import { IUser, AuthTokensDto } from '@vela/shared';

export interface AuthSession {
  user: IUser;
  tokens: AuthTokensDto;
}

