import jwt, { SignOptions } from 'jsonwebtoken';
import {
  ITokenService,
  AccessTokenPayload,
  RefreshTokenPayload,
} from '../../application/ports/ITokenService';
import { env } from '../config/environment';

export class JwtTokenService implements ITokenService {
  public generateAccessToken(payload: AccessTokenPayload): string {
    const options: SignOptions = {
      expiresIn: env.jwt.accessExpiresInSeconds,
    };
    return jwt.sign(payload, env.jwt.accessSecret, options);
  }

  public generateRefreshToken(payload: RefreshTokenPayload): string {
    const options: SignOptions = {
      expiresIn: env.jwt.refreshExpiresInSeconds,
    };
    return jwt.sign(payload, env.jwt.refreshSecret, options);
  }

  public verifyAccessToken(token: string): AccessTokenPayload {
    return jwt.verify(token, env.jwt.accessSecret) as AccessTokenPayload;
  }

  public verifyRefreshToken(token: string): RefreshTokenPayload {
    return jwt.verify(token, env.jwt.refreshSecret) as RefreshTokenPayload;
  }

  public getAccessTokenExpiresIn(): number {
    return env.jwt.accessExpiresInSeconds;
  }
}

