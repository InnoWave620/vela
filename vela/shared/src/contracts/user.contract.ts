import { IUser } from '../models/user';

export type UserProfileDto = IUser;

export interface UpdateProfileDto {
  name?: string;
  password?: string;
}

