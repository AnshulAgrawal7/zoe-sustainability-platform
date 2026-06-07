// Point the Prisma client at the dedicated local Postgres test DB (never Supabase).
// Set BEFORE the app/Prisma client is imported so it overrides .env's DATABASE_URL.
const TEST_DATABASE_URL =
  process.env['TEST_DATABASE_URL'] ?? 'postgresql://zoe:zoe@localhost:5433/zoe_test';
process.env['DATABASE_URL'] = TEST_DATABASE_URL;
process.env['DIRECT_URL'] = TEST_DATABASE_URL;
process.env['JWT_SECRET'] = 'test-secret-min-32-chars-for-tests-only';
process.env['NODE_ENV'] = 'test';
