import { IUser, UserRole } from '@vela/shared';

export interface UserProps {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export class User {
  private props: UserProps;

  private constructor(props: UserProps) {
    this.props = props;
  }

  public static create(
    params: {
      email: string;
      name: string;
      passwordHash: string;
      role?: UserRole;
      id?: string;
    }
  ): User {
    const now = new Date();
    return new User({
      id: params.id || `usr_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      email: params.email.trim().toLowerCase(),
      name: params.name.trim(),
      passwordHash: params.passwordHash,
      role: params.role || 'user',
      createdAt: now,
      updatedAt: now,
    });
  }

  public static reconstruct(props: UserProps): User {
    return new User(props);
  }

  public get id(): string {
    return this.props.id;
  }

  public get email(): string {
    return this.props.email;
  }

  public get name(): string {
    return this.props.name;
  }

  public get role(): UserRole {
    return this.props.role;
  }

  public get passwordHash(): string {
    return this.props.passwordHash;
  }

  public get createdAt(): Date {
    return this.props.createdAt;
  }

  public get updatedAt(): Date {
    return this.props.updatedAt;
  }

  public updateProfile(name?: string): void {
    if (name && name.trim().length > 0) {
      this.props.name = name.trim();
      this.props.updatedAt = new Date();
    }
  }

  public updatePassword(newPasswordHash: string): void {
    this.props.passwordHash = newPasswordHash;
    this.props.updatedAt = new Date();
  }

  public toDto(): IUser {
    return {
      id: this.props.id,
      email: this.props.email,
      name: this.props.name,
      role: this.props.role,
      createdAt: this.props.createdAt.toISOString(),
      updatedAt: this.props.updatedAt.toISOString(),
    };
  }
}

