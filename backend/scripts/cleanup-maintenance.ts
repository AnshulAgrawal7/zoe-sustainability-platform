/**
 * Scheduled data-hygiene job (Future_Work §5.6).
 *
 * Prunes expired refresh tokens and consumed/expired mail tokens, and releases
 * per-account login locks whose window has elapsed. Idempotent — safe to run on
 * any cadence. Intended to be wired to the host's scheduler, e.g. a daily cron:
 *
 *   0 3 * * *   cd /app/backend && npm run cleanup:maintenance
 *
 * Or invoked from an external scheduler / GitHub Actions schedule against the
 * production DATABASE_URL.
 */
import { PrismaClient } from '@prisma/client';
import { runMaintenance } from '../src/services/maintenance';

const prisma = new PrismaClient();

async function main() {
  const result = await runMaintenance(prisma);
  console.log(
    `✓ maintenance done — refreshTokens:${result.refreshTokensDeleted} ` +
      `userTokens:${result.userTokensDeleted} loginLocks:${result.loginLocksReleased}`
  );
}

main()
  .catch((err) => {
    console.error(`✗ ${err instanceof Error ? err.message : String(err)}`);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
