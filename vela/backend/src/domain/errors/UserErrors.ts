import { DomainError } from './DomainError';

export class UserAlreadyExistsError extends DomainError {
  public readonly code = 'USER_ALREADY_EXISTS';
  public readonly statusCode = 409;

  constructor(email: string) {
    super(`User with email "${email}" already exists.`);
  }
}

export class InvalidCredentialsError extends DomainError {
  public readonly code = 'INVALID_CREDENTIALS';
  public readonly statusCode = 401;

  constructor() {
    super('Invalid email or password.');
  }
}

export class UserNotFoundError extends DomainError {
  public readonly code = 'USER_NOT_FOUND';
  public readonly statusCode = 404;

  constructor(identifier: string) {
    super(`User "${identifier}" was not found.`);
  }
}

export class UnauthorizedError extends DomainError {
  public readonly code = 'UNAUTHORIZED';
  public readonly statusCode = 401;

  constructor(message = 'Authentication required.') {
    super(message);
  }
}

export class ValidationError extends DomainError {
  public readonly code = 'VALIDATION_FAILED';
  public readonly statusCode = 400;
  public readonly details: any[];

  constructor(message: string, details: any[] = []) {
    super(message);
    this.details = details;
  }
}

