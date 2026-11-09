import { User } from '../../domain/entities/User';
import { IUserRepository } from '../../domain/repositories/IUserRepository';

export class InMemoryUserRepository implements IUserRepository {
  private users: Map<string, User> = new Map();

  public async findById(id: string): Promise<User | null> {
    const user = this.users.get(id);
    return user ? User.reconstruct({
      id: user.id,
      email: user.email,
      name: user.name,
      passwordHash: user.passwordHash,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }) : null;
  }

  public async findByEmail(email: string): Promise<User | null> {
    const normalized = email.trim().toLowerCase();
    for (const user of this.users.values()) {
      if (user.email === normalized) {
        return User.reconstruct({
          id: user.id,
          email: user.email,
          name: user.name,
          passwordHash: user.passwordHash,
          role: user.role,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        });
      }
    }
    return null;
  }

  public async save(user: User): Promise<void> {
    this.users.set(user.id, user);
  }

  public async delete(id: string): Promise<void> {
    this.users.delete(id);
  }

  public async listAll(): Promise<User[]> {
    return Array.from(this.users.values());
  }
}

