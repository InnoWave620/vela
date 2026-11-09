import { Request, Response, NextFunction } from 'express';
import { ITokenService } from '../../../application/ports/ITokenService';
import { UnauthorizedError } from '../../../domain/errors/UserErrors';

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    role: string;
  };
}

export function createAuthMiddleware(tokenService: ITokenService) {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('Missing or malformed Authorization header.');
    }

    const token = authHeader.substring(7);
    try {
      const payload = tokenService.verifyAccessToken(token);
      req.user = payload;
      next();
    } catch {
      throw new UnauthorizedError('Invalid or expired access token.');
    }
  };
}

