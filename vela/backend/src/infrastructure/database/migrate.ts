import fs from 'fs';
import path from 'path';
import { Client } from 'pg';
import dotenv from 'dotenv';

// Load backend .env
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const config = {
  host: process.env.PGHOST || 'localhost',
  port: parseInt(process.env.PGPORT || '5432', 10),
  user: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD || 'SamsungS25Ultra',
  database: process.env.PGDATABASE || 'vela_db',
};

async function runMigration() {
  console.log('----------------------------------------------------');
  console.log('VELA DATABASE INITIALIZER & MIGRATION RUNNER');
  console.log('Connecting to PostgreSQL host:', config.host, 'port:', config.port);
  console.log('Target database:', config.database);
  console.log('----------------------------------------------------');

  // Step 1: Connect to maintenance db ('postgres') to ensure 'vela_db' exists
  const maintClient = new Client({
    host: config.host,
    port: config.port,
    user: config.user,
    password: config.password,
    database: 'postgres',
  });

  try {
    await maintClient.connect();
    console.log('✔ Connected to PostgreSQL instance.');

    const checkDbRes = await maintClient.query(
      `SELECT 1 FROM pg_database WHERE datname = $1;`,
      [config.database]
    );

    if (checkDbRes.rowCount === 0) {
      console.log(`Creating database "${config.database}"...`);
      await maintClient.query(`CREATE DATABASE "${config.database}";`);
      console.log(`✔ Database "${config.database}" created successfully.`);
    } else {
      console.log(`✔ Database "${config.database}" already exists.`);
    }
  } catch (err: any) {
    console.warn(`[Warning during DB check]: ${err.message}`);
  } finally {
    await maintClient.end();
  }

  // Step 2: Connect to vela_db and apply schema.sql
  const dbClient = new Client(config);
  try {
    await dbClient.connect();
    console.log(`✔ Connected to target database "${config.database}".`);

    const schemaPath = path.resolve(__dirname, 'schema.sql');
    const seedPath = path.resolve(__dirname, 'seed.sql');

    console.log('Executing schema.sql...');
    const schemaSql = fs.readFileSync(schemaPath, 'utf-8');
    await dbClient.query(schemaSql);
    console.log('✔ Schema applied successfully.');

    console.log('Executing seed.sql...');
    const seedSql = fs.readFileSync(seedPath, 'utf-8');
    await dbClient.query(seedSql);
    console.log('✔ Seed data populated successfully.');

    // Step 3: Verify and display summary
    const tablesRes = await dbClient.query(
      `SELECT table_name FROM information_schema.tables WHERE table_schema='public' ORDER BY table_name;`
    );
    console.log('\n--- VERIFICATION: TABLES IN DATABASE ---');
    for (const row of tablesRes.rows) {
      const countRes = await dbClient.query(`SELECT COUNT(*) as count FROM "${row.table_name}";`);
      console.log(`- ${row.table_name}: ${countRes.rows[0].count} rows`);
    }

    console.log('\n--- SAMPLE SEEDED USERS BY AGE CATEGORY ---');
    const usersRes = await dbClient.query(
      `SELECT id, name, age_category, date_of_birth, is_parent_managed FROM users ORDER BY date_of_birth DESC;`
    );
    for (const u of usersRes.rows) {
      console.log(`- [${u.age_category.toUpperCase()}] ${u.name} (DOB: ${u.date_of_birth.toISOString().slice(0, 10)}, Managed: ${u.is_parent_managed})`);
    }

    console.log('\n--- SAMPLE SEEDED MEMORY POSTS (IMAGE & VIDEO) ---');
    const postsRes = await dbClient.query(
      `SELECT id, author_id, media_type, age_category, visibility, LEFT(content, 60) as preview FROM posts;`
    );
    for (const p of postsRes.rows) {
      console.log(`- Post ${p.id} [${p.media_type.toUpperCase()} | ${p.age_category} | ${p.visibility}]: "${p.preview}..."`);
    }

    console.log('\n🎉 ALL TABLES WRITTEN & SEEDED DIRECTLY INTO POSTGRESQL SUCCESSFULLY!');
  } catch (err: any) {
    console.error('❌ Migration failed:', err.message);
    process.exit(1);
  } finally {
    await dbClient.end();
  }
}

runMigration().catch((e) => {
  console.error(e);
  process.exit(1);
});

