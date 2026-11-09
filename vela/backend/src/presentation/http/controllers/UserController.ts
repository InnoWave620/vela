import { Response, NextFunction } from 'express';
import { GetUserProfileUseCase } from '../../../application/use-cases/GetUserProfileUseCase';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';
import { sendSuccess } from '../utils/apiResponse';
import { UnauthorizedError } from '../../../domain/errors/UserErrors';

export class UserController {
  constructor(
    private readonly getUserProfileUseCase: GetUserProfileUseCase,
    private readonly userRepository: IUserRepository
  ) {}

  public getMe = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user?.userId) {
        throw new UnauthorizedError();
      }
      const profile = await this.getUserProfileUseCase.execute(req.user.userId);
      sendSuccess(res, profile, 200);
    } catch (err) {
      next(err);
    }
  };

  public listAll = async (_req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const users = await this.userRepository.listAll();
      sendSuccess(res, users.map(u => u.toDto()), 200);
    } catch (err) {
      next(err);
    }
  };
}

