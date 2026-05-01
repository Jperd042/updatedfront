import bcrypt from 'bcrypt';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { Client } from 'pg';

const DEFAULT_TECHNICIAN_EMAIL = 'tech.demo@autocare.local';
const DEFAULT_TECHNICIAN_PASSWORD = 'Tech1234!';
const DEFAULT_TECHNICIAN_FIRST_NAME = 'Demo';
const DEFAULT_TECHNICIAN_LAST_NAME = 'Technician';
const DEFAULT_TECHNICIAN_PHONE = '+63 917 222 2222';
const DEFAULT_TECHNICIAN_STAFF_CODE = 'TECH-DEMO-001';

const loadLocalEnv = () => {
  try {
    const envFile = readFileSync(resolve(process.cwd(), '.env'), 'utf8');

    envFile.split(/\r?\n/).forEach((line) => {
      const trimmedLine = line.trim();
      if (!trimmedLine || trimmedLine.startsWith('#')) {
        return;
      }
      const separatorIndex = trimmedLine.indexOf('=');
      if (separatorIndex === -1) {
        return;
      }
      const key = trimmedLine.slice(0, separatorIndex).trim();
      const value = trimmedLine.slice(separatorIndex + 1).trim();
      if (key && !process.env[key]) {
        process.env[key] = value;
      }
    });
  } catch {
    // Allow CI or shells that already provide DATABASE_URL.
  }
};

const run = async () => {
  loadLocalEnv();

  const email = process.env.SEED_TECHNICIAN_EMAIL ?? DEFAULT_TECHNICIAN_EMAIL;
  const password = process.env.SEED_TECHNICIAN_PASSWORD ?? DEFAULT_TECHNICIAN_PASSWORD;
  const firstName = process.env.SEED_TECHNICIAN_FIRST_NAME ?? DEFAULT_TECHNICIAN_FIRST_NAME;
  const lastName = process.env.SEED_TECHNICIAN_LAST_NAME ?? DEFAULT_TECHNICIAN_LAST_NAME;
  const phone = process.env.SEED_TECHNICIAN_PHONE ?? DEFAULT_TECHNICIAN_PHONE;
  const staffCode = process.env.SEED_TECHNICIAN_STAFF_CODE ?? DEFAULT_TECHNICIAN_STAFF_CODE;

  const connectionString =
    process.env.DATABASE_URL ?? 'postgresql://admin:root@localhost:5433/codewave';
  const client = new Client({ connectionString });

  await client.connect();

  try {
    await client.query('begin');

    const userResult = await client.query<{ id: string; role: string }>(
      `
        insert into users (email, role, staff_code, is_active, updated_at)
        values ($1, 'technician', $2, true, now())
        on conflict (email)
        do update set
          role = 'technician',
          staff_code = excluded.staff_code,
          is_active = true,
          updated_at = now()
        returning id, role
      `,
      [email, staffCode],
    );

    const userId = userResult.rows[0].id;

    await client.query(
      `
        insert into user_profiles (user_id, first_name, last_name, phone, updated_at)
        values ($1, $2, $3, $4, now())
        on conflict (user_id)
        do update set
          first_name = excluded.first_name,
          last_name = excluded.last_name,
          phone = excluded.phone,
          updated_at = now()
      `,
      [userId, firstName, lastName, phone],
    );

    const passwordHash = await bcrypt.hash(password, 12);

    await client.query(
      `
        insert into auth_accounts (user_id, password_hash, is_active, updated_at)
        values ($1, $2, true, now())
        on conflict (user_id)
        do update set
          password_hash = excluded.password_hash,
          is_active = true,
          updated_at = now()
      `,
      [userId, passwordHash],
    );

    await client.query('commit');

    console.log('Technician account ready:');
    console.log(`  email:      ${email}`);
    console.log(`  password:   ${password}`);
    console.log(`  staff code: ${staffCode}`);
    console.log(`  user id:    ${userId}`);
  } catch (error) {
    await client.query('rollback');
    throw error;
  } finally {
    await client.end();
  }
};

run().catch((error) => {
  console.error('Failed to seed technician account:', error);
  process.exit(1);
});
