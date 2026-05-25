import path from 'path';

const TEST_DB = path.resolve(__dirname, '../../prisma/test.db');
process.env['DATABASE_URL'] = `file:${TEST_DB}`;
process.env['JWT_SECRET'] = 'test-secret-min-32-chars-for-tests-only';
process.env['NODE_ENV'] = 'test';
