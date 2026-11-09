import { ApiClient } from '../../data/api/ApiClient';
import { MemoryTokenStorage } from '../../data/storage/TokenStorage';
import { AuthRepositoryImpl } from '../../data/repositories/AuthRepositoryImpl';
import { LoginUseCase } from '../../domain/use-cases/LoginUseCase';
import { RegisterUseCase } from '../../domain/use-cases/RegisterUseCase';
import { GetCurrentUserUseCase } from '../../domain/use-cases/GetCurrentUserUseCase';
import { LogoutUseCase } from '../../domain/use-cases/LogoutUseCase';

export interface FrontendContainer {
  apiClient: ApiClient;
  tokenStorage: MemoryTokenStorage;
  authRepository: AuthRepositoryImpl;
  loginUseCase: LoginUseCase;
  registerUseCase: RegisterUseCase;
  getCurrentUserUseCase: GetCurrentUserUseCase;
  logoutUseCase: LogoutUseCase;
}

function createFrontendContainer(): FrontendContainer {
  const apiClient = new ApiClient();
  const tokenStorage = new MemoryTokenStorage();
  const authRepository = new AuthRepositoryImpl(apiClient, tokenStorage);

  const loginUseCase = new LoginUseCase(authRepository);
  const registerUseCase = new RegisterUseCase(authRepository);
  const getCurrentUserUseCase = new GetCurrentUserUseCase(authRepository);
  const logoutUseCase = new LogoutUseCase(authRepository);

  return {
    apiClient,
    tokenStorage,
    authRepository,
    loginUseCase,
    registerUseCase,
    getCurrentUserUseCase,
    logoutUseCase,
  };
}

export const container = createFrontendContainer();

