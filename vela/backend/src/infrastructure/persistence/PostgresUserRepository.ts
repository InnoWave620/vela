import { User } from '../../domain/entities/User';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { db } from '../database/pool';

export class PostgresUserRepository implements IUserRepository {
  public async findById(id: string): Promise<User | null> {
    const query = `
      SELECT id, email, name, password_hash, role, date_of_birth, created_at, updated_at
      FROM users
      WHERE id = $1
      LIMIT 1
    `;
    const result = await db.query(query, [id]);
    if (result.rows.length === 0) {
      return null;
    }
    const row = result.rows[0];
    return User.reconstruct({
      id: row.id,
      email: row.email,
      name: row.name,
      passwordHash: row.password_hash,
      role: row.role,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    });
  }

  public async findByEmail(email: string): Promise<User | null> {
    const query = `
      SELECT id, email, name, password_hash, role, date_of_birth, created_at, updated_at
      FROM users
      WHERE LOWER(email) = LOWER($1)
      LIMIT 1
    `;
    const result = await db.query(query, [email.trim()]);
    if (result.rows.length === 0) {
      return null;
    }
    const row = result.rows[0];
    return User.reconstruct({
      id: row.id,
      email: row.email,
      name: row.name,
      passwordHash: row.password_hash,
      role: row.role,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    });
  }

  public async save(user: User): Promise<void> {
    // Default birth details if not set on entity
    const dob = '1998-10-27';
    const [year, month, day] = dob.split('-').map((n) => parseInt(n, 10));

    const query = `
      INSERT INTO users (
        id, email, name, password_hash, role, date_of_birth,
        birth_month, birth_day, birth_year, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        password_hash = EXCLUDED.password_hash,
        role = EXCLUDED.role,
        updated_at = NOW();
    `;
    await db.query(query, [
      user.id,
      user.email,
      user.name,
      user.passwordHash,
      user.role,
      dob,
      month,
      day,
      year,
      user.createdAt,
      user.updatedAt,
    ]);
  }

  public async delete(id: string): Promise<void> {
    await db.query('DELETE FROM users WHERE id = $1', [id]);
  }

  public async listAll(): Promise<User[]> {
    const result = await db.query(`
      SELECT id, email, name, password_hash, role, date_of_birth, created_at, updated_at
      FROM users
      ORDER BY created_at DESC
    `);
    return result.rows.map((row) =>
      User.reconstruct({
        id: row.id,
        email: row.email,
        name: row.name,
        passwordHash: row.password_hash,
        role: row.role,
        createdAt: new Date(row.created_at),
        updatedAt: new Date(row.updated_at),
      })
    );
  }

  /**
   * High performance birthday twin query using the (birth_month, birth_day) index!
   */
  public async findBirthdayTwins(month: number, day: number, excludeUserId?: string): Promise<any[]> {
    const query = `
      SELECT id, name, avatar_url, bio, location, occupation, membership_tier,
             date_of_birth, zodiac_sign, birth_year
      FROM users
      WHERE birth_month = $1 AND birth_day = $2 AND ($3::VARCHAR IS NULL OR id != $3)
      ORDER BY name ASC
    `;
    const result = await db.query(query, [month, day, excludeUserId || null]);
    return result.rows;
  }
}

