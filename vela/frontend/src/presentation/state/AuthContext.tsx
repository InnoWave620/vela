import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import {
  IUser,
  AuthTokensDto,
  LoginRequestDto,
  RegisterRequestDto,
} from '@vela/shared';
import { container } from '../di/container';

export interface AuthContextType {
  user: IUser | null;
  tokens: AuthTokensDto | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginRequestDto) => Promise<void>;
  register: (data: RegisterRequestDto) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  apiBaseUrl: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [tokens, setTokens] = useState<AuthTokensDto | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load initial session
  useEffect(() => {
    let isMounted = true;

    async function initializeSession() {
      try {
        const storedTokens = await container.authRepository.getStoredTokens();
        if (storedTokens && isMounted) {
          setTokens(storedTokens);
          const currentUser = await container.getCurrentUserUseCase.execute();
          if (isMounted) {
            setUser(currentUser);
          }
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err?.message || 'Failed to restore session');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    initializeSession();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (credentials: LoginRequestDto) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await container.loginUseCase.execute(credentials);
      setUser(response.user);
      setTokens(response.tokens);
    } catch (err: any) {
      setError(err?.message || 'Failed to login');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterRequestDto) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await container.registerUseCase.execute(data);
      setUser(response.user);
      setTokens(response.tokens);
    } catch (err: any) {
      setError(err?.message || 'Failed to register');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await container.logoutUseCase.execute();
      setUser(null);
      setTokens(null);
    } catch (err: any) {
      setError(err?.message || 'Failed to logout');
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setError(null);

  const value = useMemo(
    () => ({
      user,
      tokens,
      isAuthenticated: !!user,
      isLoading,
      error,
      login,
      register,
      logout,
      clearError,
      apiBaseUrl: container.apiClient.getBaseUrl(),
    }),
    [user, tokens, isLoading, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuthContext(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}

