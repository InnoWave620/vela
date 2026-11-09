import { IAuthRepository } from '../repositories/IAuthRepository';

export class LogoutUseCase {
  constructor(private readonly authRepository: IAuthRepository) {}

  public async execute(): Promise<void> {
    await this.authRepository.clearTokens();
  }
}

