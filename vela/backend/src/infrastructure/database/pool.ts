import { Pool, QueryResult, QueryResultRow } from 'pg';
import path from 'path';
import dotenv from 'dotenv';

// Ensure .env is loaded regardless of import order
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
dotenv.config(); // Also check default cwd

export interface DbConfig {
  connectionString?: string;
  host?: string;
  port?: number;
  user?: string;
  password?: string;
  database?: string;
}

const pool = new Pool(
  process.env.DATABASE_URL
    ? { connectionString: process.env.DATABASE_URL }
    : {
        host: process.env.PGHOST || 'localhost',
        port: parseInt(process.env.PGPORT || '5432', 10),
        user: process.env.PGUSER || 'postgres',
        password: process.env.PGPASSWORD || 'SamsungS25Ultra',
        database: process.env.PGDATABASE || 'vela_db',
      }
);

pool.on('error', (err) => {
  console.error('[PostgreSQL Pool Unexpected Error]:', err);
});

export const db = {
  query: (text: string, params?: any[]): Promise<QueryResult<any>> => {
    return pool.query(text, params);
  },

  async testConnection(): Promise<boolean> {
    try {
      const client = await pool.connect();
      const res = await client.query('SELECT NOW() as current_time, current_database() as db_name');
      console.log(`[PostgreSQL Connected]: DB "${res.rows[0].db_name}" at ${res.rows[0].current_time}`);
      client.release();
      return true;
    } catch (err: any) {
      console.warn(`[PostgreSQL Notice]: Could not connect (${err?.message || err}).`);
      return false;
    }
  },

  pool,
};
