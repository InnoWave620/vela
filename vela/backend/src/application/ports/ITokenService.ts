export interface AccessTokenPayload {
  userId: string;
  role: string;
}

export interface RefreshTokenPayload {
  userId: string;
}

export interface ITokenService {
  generateAccessToken(payload: AccessTokenPayload): string;
  generateRefreshToken(payload: RefreshTokenPayload): string;
  verifyAccessToken(token: string): AccessTokenPayload;
  verifyRefreshToken(token: string): RefreshTokenPayload;
  getAccessTokenExpiresIn(): number;
}

