export type UserRole = 'admin' | 'user';

export interface IUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

