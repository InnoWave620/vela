import {
  RegisterRequestDto,
  LoginRequestDto,
  AuthResponseDto,
  AuthTokensDto,
  IUser,
} from '@vela/shared';
import { IAuthRepository } from '../../domain/repositories/IAuthRepository';
import { ApiClient } from '../api/ApiClient';
import { ITokenStorage } from '../storage/TokenStorage';

export class AuthRepositoryImpl implements IAuthRepository {
  constructor(
    private readonly apiClient: ApiClient,
    private readonly tokenStorage: ITokenStorage
  ) {}

  public async login(credentials: LoginRequestDto): Promise<AuthResponseDto> {
    const response = await this.apiClient.post<AuthResponseDto>(
      '/auth/login',
      credentials,
      { requiresAuth: false }
    );
    this.apiClient.setToken(response.tokens.accessToken);
    return response;
  }

  public async register(data: RegisterRequestDto): Promise<AuthResponseDto> {
    const response = await this.apiClient.post<AuthResponseDto>(
      '/auth/register',
      data,
      { requiresAuth: false }
    );
    this.apiClient.setToken(response.tokens.accessToken);
    return response;
  }

  public async refreshToken(token: string): Promise<AuthTokensDto> {
    const response = await this.apiClient.post<AuthTokensDto>(
      '/auth/refresh',
      { refreshToken: token },
      { requiresAuth: false }
    );
    this.apiClient.setToken(response.accessToken);
    return response;
  }

  public async getCurrentUser(): Promise<IUser> {
    return this.apiClient.get<IUser>('/users/me', { requiresAuth: true });
  }

  public async getStoredTokens(): Promise<AuthTokensDto | null> {
    const tokens = await this.tokenStorage.getTokens();
    if (tokens?.accessToken) {
      this.apiClient.setToken(tokens.accessToken);
    }
    return tokens;
  }

  public async saveTokens(tokens: AuthTokensDto): Promise<void> {
    this.apiClient.setToken(tokens.accessToken);
    await this.tokenStorage.saveTokens(tokens);
  }

  public async clearTokens(): Promise<void> {
    this.apiClient.setToken(null);
    await this.tokenStorage.clearTokens();
  }
}

