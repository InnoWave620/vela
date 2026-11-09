import { LoginRequestDto, AuthResponseDto, validateLoginInput } from '@vela/shared';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { InvalidCredentialsError, ValidationError } from '../../domain/errors/UserErrors';
import { IPasswordHasher } from '../ports/IPasswordHasher';
import { ITokenService } from '../ports/ITokenService';

export class LoginUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordHasher: IPasswordHasher,
    private readonly tokenService: ITokenService
  ) {}

  public async execute(dto: LoginRequestDto): Promise<AuthResponseDto> {
    const validationErrors = validateLoginInput(dto);
    if (validationErrors.length > 0) {
      throw new ValidationError('Validation failed for login.', validationErrors);
    }

    const normalizedEmail = dto.email.trim().toLowerCase();
    const user = await this.userRepository.findByEmail(normalizedEmail);
    if (!user) {
      throw new InvalidCredentialsError();
    }

    const isValidPassword = await this.passwordHasher.compare(dto.password, user.passwordHash);
    if (!isValidPassword) {
      throw new InvalidCredentialsError();
    }

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

