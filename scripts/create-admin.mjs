/**
 * SHADOW / DESIGN REVIEW — create/reset an admin user in Supabase Postgres.
 *
 * Usage (from project root):
 *   set DATABASE_URL=postgres://...   (or put it in .env)
 *   npm run create-admin -- <username> <password>
 *
 * Author: Hamidreza Derhami
 */

import bcrypt from 'bcryptjs';
import postgres from 'postgres';

const args = process.argv.slice(2);
const username = args[0];
const password = args[1];

if (!username || !password) {
  console.error('Usage: npm run create-admin -- <username> <password>');
  console.error('       (password must be at least 8 characters)');
  process.exit(1);
}
if (password.length < 8) {
  console.error('Error: password must be at least 8 characters.');
  process.exit(1);
}

// Load .env manually when dotenv is unavailable
let url = process.env.DATABASE_URL;
if (!url) {
  try {
    const { config } = await import('dotenv');
    config();
    url = process.env.DATABASE_URL;
  } catch {
    // dotenv not installed locally — fall through
  }
}
if (!url) {
  console.error('Error: DATABASE_URL is not set. Export it or add it to .env');
  process.exit(1);
}

const sql = postgres(url, { prepare: false, max: 1 });

try {
  const hash = bcrypt.hashSync(password, 10);

  await sql`
    insert into admin_users (username, password_hash)
    values (${username}, ${hash})
    on conflict (username) do update set password_hash = excluded.password_hash
  `;

  console.log(`✔ Admin user "${username}" created/updated successfully.`);
} catch (err) {
  console.error('Failed:', err.message ?? err);
  console.error('Did you run vercel/schema.sql in the Supabase SQL Editor first?');
  process.exitCode = 1;
} finally {
  await sql.end();
}
