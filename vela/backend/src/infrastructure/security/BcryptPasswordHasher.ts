import bcrypt from 'bcryptjs';
import { IPasswordHasher } from '../../application/ports/IPasswordHasher';

export class BcryptPasswordHasher implements IPasswordHasher {
  private readonly saltRounds = 10;

  public async hash(plainText: string): Promise<string> {
    return bcrypt.hash(plainText, this.saltRounds);
  }

  public async compare(plainText: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(plainText, hashed);
  }
}

