import { execSync } from 'child_process';

// After the whole E2E run, remove the test ideas/comments it created from the
// persistent (Supabase) DB so they never leak onto the public /ideas board.
// Best-effort: a failure here (e.g. DB unreachable in CI) must not fail the run.
export default function globalTeardown() {
  try {
    execSync('npx ts-node prisma/cleanup-test-data.ts', {
      cwd: 'backend',
      stdio: 'inherit',
    });
  } catch (err) {
    console.warn('[e2e] test-data cleanup skipped:', (err as Error).message);
  }
}
