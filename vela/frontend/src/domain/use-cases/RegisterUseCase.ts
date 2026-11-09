import { RegisterRequestDto, AuthResponseDto, validateRegisterInput } from '@vela/shared';
import { IAuthRepository } from '../repositories/IAuthRepository';

export class RegisterUseCase {
  constructor(private readonly authRepository: IAuthRepository) {}

  public async execute(data: RegisterRequestDto): Promise<AuthResponseDto> {
    const errors = validateRegisterInput(data);
    if (errors.length > 0) {
      throw new Error(errors[0].message);
    }

    const authResponse = await this.authRepository.register(data);
    await this.authRepository.saveTokens(authResponse.tokens);
    return authResponse;
  }
}

