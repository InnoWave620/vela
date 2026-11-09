import { Request, Response, NextFunction } from 'express';
import { DomainError } from '../../../domain/errors/DomainError';
import { ValidationError } from '../../../domain/errors/UserErrors';
import { sendError } from '../utils/apiResponse';

export function errorHandlerMiddleware(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof ValidationError) {
    sendError(res, err.code, err.message, err.statusCode, err.details);
    return;
  }

  if (err instanceof DomainError) {
    sendError(res, err.code, err.message, err.statusCode);
    return;
  }

  console.error('[Unhandled Internal Error]:', err);
  sendError(
    res,
    'INTERNAL_SERVER_ERROR',
    'An unexpected internal error occurred.',
    500
  );
}

