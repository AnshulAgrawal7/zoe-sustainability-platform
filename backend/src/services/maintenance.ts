import type { PrismaClient } from '@prisma/client';

// Scheduled maintenance / data hygiene (Future_Work §5.6). Idempotent and safe
// to run repeatedly (e.g. nightly via the host's scheduler / a cron):
//
//   - prune expired refresh tokens (DB-side 7-day expiry; the client already
//     drops the session cookie on browser close, but stale rows accumulate);
//   - prune consumed or expired mail tokens (password reset / e-mail verify);
//   - release elapsed per-account login locks (clear lockedUntil + the counter)
//     so a locked account recovers automatically once the window passes.
//
// Returns the affected counts for logging/observability.

export interface MaintenanceResult {
  refreshTokensDeleted: number;
  userTokensDeleted: number;
  loginLocksReleased: number;
}

export async function runMaintenance(prisma: PrismaClient): Promise<MaintenanceResult> {
  const now = new Date();

  const refreshTokens = await prisma.refreshToken.deleteMany({
    where: { expiresAt: { lt: now } },
  });

  // Mail tokens are single-use + short-lived: drop anything already used or past
  // its expiry. (Unused, still-valid tokens are kept.)
  const userTokens = await prisma.userToken.deleteMany({
    where: { OR: [{ usedAt: { not: null } }, { expiresAt: { lt: now } }] },
  });

  const locks = await prisma.user.updateMany({
    where: { lockedUntil: { lt: now } },
    data: { lockedUntil: null, failedLoginAttempts: 0 },
  });

  return {
    refreshTokensDeleted: refreshTokens.count,
    userTokensDeleted: userTokens.count,
    loginLocksReleased: locks.count,
  };
}
