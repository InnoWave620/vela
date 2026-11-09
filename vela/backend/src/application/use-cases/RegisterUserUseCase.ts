import { RegisterRequestDto, AuthResponseDto, validateRegisterInput } from '@vela/shared';
import { User } from '../../domain/entities/User';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { UserAlreadyExistsError, ValidationError } from '../../domain/errors/UserErrors';
import { IPasswordHasher } from '../ports/IPasswordHasher';
import { ITokenService } from '../ports/ITokenService';

export class RegisterUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordHasher: IPasswordHasher,
    private readonly tokenService: ITokenService
  ) {}

  public async execute(dto: RegisterRequestDto): Promise<AuthResponseDto> {
    const validationErrors = validateRegisterInput(dto);
    if (validationErrors.length > 0) {
      throw new ValidationError('Validation failed for user registration.', validationErrors);
    }

    const normalizedEmail = dto.email.trim().toLowerCase();
    const existing = await this.userRepository.findByEmail(normalizedEmail);
    if (existing) {
      throw new UserAlreadyExistsError(dto.email);
    }

    const passwordHash = await this.passwordHasher.hash(dto.password);
    const user = User.create({
      email: normalizedEmail,
      name: dto.name,
      passwordHash,
      role: 'user',
    });

    await this.userRepository.save(user);

    const accessToken = this.tokenService.generateAccessToken({
      userId: user.id,
      role: user.role,
    });
    const refreshToken = this.tokenService.generateRefreshToken({
      userId: user.id,
    });

    return {
      user: user.toDto(),
      tokens: {
        accessToken,
        refreshToken,
        expiresIn: this.tokenService.getAccessTokenExpiresIn(),
        tokenType: 'Bearer',
      },
    };
  }
}

