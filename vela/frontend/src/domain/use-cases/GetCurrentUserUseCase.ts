import { IUser } from '@vela/shared';
import { IAuthRepository } from '../repositories/IAuthRepository';

export class GetCurrentUserUseCase {
  constructor(private readonly authRepository: IAuthRepository) {}

  public async execute(): Promise<IUser | null> {
    const tokens = await this.authRepository.getStoredTokens();
    if (!tokens?.accessToken) {
      return null;
    }

    try {
      return await this.authRepository.getCurrentUser();
    } catch {
      await this.authRepository.clearTokens();
      return null;
    }
  }
}

