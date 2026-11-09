import { IUser } from '../models/user';

export interface RegisterRequestDto {
  email: string;
  password: string;
  name: string;
}

export interface LoginRequestDto {
  email: string;
  password: string;
}

export interface RefreshTokenRequestDto {
  refreshToken: string;
}

export interface AuthTokensDto {
  accessToken: string;
  refreshToken: string;
  expiresIn: number; // in seconds
  tokenType: 'Bearer';
}

export interface AuthResponseDto {
  user: IUser;
  tokens: AuthTokensDto;
}

