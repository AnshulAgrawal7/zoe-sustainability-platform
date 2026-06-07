import { execSync } from 'child_process';
import path from 'path';

// Tests run against a dedicated local Postgres test database (NEVER Supabase).
// Start it with:  cd backend && docker compose up -d   (see docker-compose.yml)
// CI / a custom host can override via the TEST_DATABASE_URL env var.
const TEST_DATABASE_URL =
  process.env['TEST_DATABASE_URL'] ?? 'postgresql://zoe:zoe@localhost:5433/zoe_test';

export default function setup() {
  // Safety: the test setup runs a destructive `--force-reset`. It must NEVER
  // point at the production/Supabase database.
  if (/supabase\.com/i.test(TEST_DATABASE_URL)) {
    throw new Error(
      'SICHERHEIT: TEST_DATABASE_URL zeigt auf Supabase. Tests führen ein ' +
        'destruktives `db push --force-reset` aus und dürfen nie gegen die echte DB laufen.',
    );
  }

  // Override BOTH urls: Prisma migrations/db push use `directUrl` (DIRECT_URL),
  // the client uses `url` (DATABASE_URL). Overriding only one would let the
  // other fall back to .env (= Supabase) — which must never happen in tests.
  process.env['DATABASE_URL'] = TEST_DATABASE_URL;
  process.env['DIRECT_URL'] = TEST_DATABASE_URL;
  const testEnv = {
    ...process.env,
    DATABASE_URL: TEST_DATABASE_URL,
    DIRECT_URL: TEST_DATABASE_URL,
  };

  execSync('npx prisma db push --force-reset --skip-generate', {
    cwd: path.resolve(__dirname, '../..'),
    env: testEnv,
    stdio: 'pipe',
  });

  execSync('npx ts-node prisma/seed.ts', {
    cwd: path.resolve(__dirname, '../..'),
    env: testEnv,
    stdio: 'pipe',
  });
}
