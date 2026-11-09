import { LoginRequestDto, AuthResponseDto, validateLoginInput } from '@vela/shared';
import { IAuthRepository } from '../repositories/IAuthRepository';

export class LoginUseCase {
  constructor(private readonly authRepository: IAuthRepository) {}

  public async execute(credentials: LoginRequestDto): Promise<AuthResponseDto> {
    const errors = validateLoginInput(credentials);
    if (errors.length > 0) {
      throw new Error(errors[0].message);
    }

    const authResponse = await this.authRepository.login(credentials);
    await this.authRepository.saveTokens(authResponse.tokens);
    return authResponse;
  }
}

