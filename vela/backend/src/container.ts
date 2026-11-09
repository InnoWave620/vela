import { IUserRepository } from './domain/repositories/IUserRepository';
import { PostgresUserRepository } from './infrastructure/persistence/PostgresUserRepository';
import { InMemoryUserRepository } from './infrastructure/persistence/InMemoryUserRepository';
import { BcryptPasswordHasher } from './infrastructure/security/BcryptPasswordHasher';
import { JwtTokenService } from './infrastructure/security/JwtTokenService';

import { RegisterUserUseCase } from './application/use-cases/RegisterUserUseCase';
import { LoginUserUseCase } from './application/use-cases/LoginUserUseCase';
import { GetUserProfileUseCase } from './application/use-cases/GetUserProfileUseCase';
import { RefreshTokenUseCase } from './application/use-cases/RefreshTokenUseCase';

import { AuthController } from './presentation/http/controllers/AuthController';
import { UserController } from './presentation/http/controllers/UserController';
import { TwinController } from './presentation/http/controllers/TwinController';
import { FeedController } from './presentation/http/controllers/FeedController';
import { EventController } from './presentation/http/controllers/EventController';

export interface ServiceContainer {
  userRepository: IUserRepository;
  passwordHasher: BcryptPasswordHasher;
  tokenService: JwtTokenService;

  registerUserUseCase: RegisterUserUseCase;
  loginUserUseCase: LoginUserUseCase;
  getUserProfileUseCase: GetUserProfileUseCase;
  refreshTokenUseCase: RefreshTokenUseCase;

  authController: AuthController;
  userController: UserController;
  twinController: TwinController;
  feedController: FeedController;
  eventController: EventController;
}

export function createContainer(): ServiceContainer {
  // 1. Infrastructure (PostgreSQL Repository with in-memory fallback)
  const userRepository: IUserRepository =
    process.env.USE_POSTGRES === 'false'
      ? new InMemoryUserRepository()
      : new PostgresUserRepository();

  const passwordHasher = new BcryptPasswordHasher();
  const tokenService = new JwtTokenService();

  // 2. Application Layer (Use Cases)
  const registerUserUseCase = new RegisterUserUseCase(
    userRepository,
    passwordHasher,
    tokenService
  );
  const loginUserUseCase = new LoginUserUseCase(
    userRepository,
    passwordHasher,
    tokenService
  );
  const getUserProfileUseCase = new GetUserProfileUseCase(userRepository);
  const refreshTokenUseCase = new RefreshTokenUseCase(userRepository, tokenService);

  // 3. Presentation Layer (Controllers)
  const authController = new AuthController(
    registerUserUseCase,
    loginUserUseCase,
    refreshTokenUseCase
  );
  const userController = new UserController(getUserProfileUseCase, userRepository);
  const twinController = new TwinController();
  const feedController = new FeedController();
  const eventController = new EventController();

  return {
    userRepository,
    passwordHasher,
    tokenService,
    registerUserUseCase,
    loginUserUseCase,
    getUserProfileUseCase,
    refreshTokenUseCase,
    authController,
    userController,
    twinController,
    feedController,
    eventController,
  };
}
