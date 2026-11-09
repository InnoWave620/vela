import { AuthTokensDto } from '@vela/shared';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { UnauthorizedError } from '../../domain/errors/UserErrors';
import { ITokenService } from '../ports/ITokenService';

export class RefreshTokenUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly tokenService: ITokenService
  ) {}

  public async execute(refreshToken: string): Promise<AuthTokensDto> {
    if (!refreshToken) {
      throw new UnauthorizedError('Refresh token is required.');
    }

    try {
      const payload = this.tokenService.verifyRefreshToken(refreshToken);
      const user = await this.userRepository.findById(payload.userId);
      if (!user) {
        throw new UnauthorizedError('User associated with token no longer exists.');
      }

      const newAccessToken = this.tokenService.generateAccessToken({
        userId: user.id,
        role: user.role,
      });
      const newRefreshToken = this.tokenService.generateRefreshToken({
        userId: user.id,
      });

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        expiresIn: this.tokenService.getAccessTokenExpiresIn(),
        tokenType: 'Bearer',
      };
    } catch {
      throw new UnauthorizedError('Invalid or expired refresh token.');
    }
  }
}

