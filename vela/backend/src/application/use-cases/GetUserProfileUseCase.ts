import { IUser } from '@vela/shared';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { UserNotFoundError } from '../../domain/errors/UserErrors';

export class GetUserProfileUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  public async execute(userId: string): Promise<IUser> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new UserNotFoundError(userId);
    }
    return user.toDto();
  }
}

