import { execSync } from 'child_process';
import path from 'path';

const TEST_DB = path.resolve(__dirname, '../../prisma/test.db');

export default function setup() {
  process.env['DATABASE_URL'] = `file:${TEST_DB}`;

  execSync('npx prisma db push --force-reset --skip-generate', {
    cwd: path.resolve(__dirname, '../..'),
    env: { ...process.env, DATABASE_URL: `file:${TEST_DB}` },
    stdio: 'pipe',
  });

  execSync('npx ts-node prisma/seed.ts', {
    cwd: path.resolve(__dirname, '../..'),
    env: { ...process.env, DATABASE_URL: `file:${TEST_DB}` },
    stdio: 'pipe',
  });
}
