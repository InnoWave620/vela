import { RegisterRequestDto, LoginRequestDto } from '../contracts/auth.contract';

export interface ValidationError {
  field: string;
  message: string;
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return typeof email === 'string' && emailRegex.test(email.trim());
}

export function validatePassword(password: string): string | null {
  if (!password || typeof password !== 'string') {
    return 'Password is required.';
  }
  if (password.length < 8) {
    return 'Password must be at least 8 characters long.';
  }
  return null;
}

export function validateRegisterInput(input: RegisterRequestDto): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!input.email || !isValidEmail(input.email)) {
    errors.push({ field: 'email', message: 'A valid email address is required.' });
  }

  const passwordError = validatePassword(input.password);
  if (passwordError) {
    errors.push({ field: 'password', message: passwordError });
  }

  if (!input.name || typeof input.name !== 'string' || input.name.trim().length === 0) {
    errors.push({ field: 'name', message: 'Name is required.' });
  }

  return errors;
}

export function validateLoginInput(input: LoginRequestDto): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!input.email || !isValidEmail(input.email)) {
    errors.push({ field: 'email', message: 'A valid email address is required.' });
  }

  if (!input.password || typeof input.password !== 'string') {
    errors.push({ field: 'password', message: 'Password is required.' });
  }

  return errors;
}

