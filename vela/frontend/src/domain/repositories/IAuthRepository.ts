import { RegisterRequestDto, LoginRequestDto, AuthResponseDto, AuthTokensDto, IUser } from '@vela/shared';

export interface IAuthRepository {
  login(credentials: LoginRequestDto): Promise<AuthResponseDto>;
  register(data: RegisterRequestDto): Promise<AuthResponseDto>;
  refreshToken(token: string): Promise<AuthTokensDto>;
  getCurrentUser(): Promise<IUser>;
  getStoredTokens(): Promise<AuthTokensDto | null>;
  saveTokens(tokens: AuthTokensDto): Promise<void>;
  clearTokens(): Promise<void>;
}

