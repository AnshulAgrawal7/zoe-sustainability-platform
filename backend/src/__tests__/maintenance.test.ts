import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { PrismaClient } from '@prisma/client';
import { runMaintenance } from '../services/maintenance';
import { hashToken } from '../utils/tokens';

const prisma = new PrismaClient();
const email = 'maint@test.zoe';
let userId = '';

beforeAll(async () => {
  await prisma.user.deleteMany({ where: { email } }).catch(() => null);
  const user = await prisma.user.create({
    data: {
      email,
      username: 'maintuser',
      password: 'x',
      name: 'Maint User',
      // An elapsed lock that maintenance should release.
      lockedUntil: new Date(Date.now() - 60_000),
      failedLoginAttempts: 5,
    },
  });
  userId = user.id;

  await prisma.refreshToken.create({
    data: { token: 'maint-expired-rt', userId, expiresAt: new Date(Date.now() - 60_000) },
  });
  await prisma.refreshToken.create({
    data: { token: 'maint-valid-rt', userId, expiresAt: new Date(Date.now() + 3_600_000) },
  });
  await prisma.userToken.create({
    data: { userId, type: 'PASSWORD_RESET', tokenHash: hashToken('maint-used'), expiresAt: new Date(Date.now() + 3_600_000), usedAt: new Date() },
  });
  await prisma.userToken.create({
    data: { userId, type: 'EMAIL_VERIFY', tokenHash: hashToken('maint-expired'), expiresAt: new Date(Date.now() - 60_000) },
  });
  await prisma.userToken.create({
    data: { userId, type: 'EMAIL_VERIFY', tokenHash: hashToken('maint-valid'), expiresAt: new Date(Date.now() + 3_600_000) },
  });
});

afterAll(async () => {
  await prisma.refreshToken.deleteMany({ where: { userId } }).catch(() => null);
  await prisma.userToken.deleteMany({ where: { userId } }).catch(() => null);
  await prisma.user.deleteMany({ where: { email } }).catch(() => null);
  await prisma.$disconnect();
});

describe('runMaintenance (Future_Work §5.6)', () => {
  it('prunes expired tokens, used mail tokens, and releases elapsed locks', async () => {
    const result = await runMaintenance(prisma);
    expect(result.refreshTokensDeleted).toBeGreaterThanOrEqual(1);
    expect(result.userTokensDeleted).toBeGreaterThanOrEqual(2);
    expect(result.loginLocksReleased).toBeGreaterThanOrEqual(1);

    // The still-valid refresh token + the valid mail token survive.
    expect(await prisma.refreshToken.findUnique({ where: { token: 'maint-valid-rt' } })).toBeTruthy();
    expect(await prisma.refreshToken.findUnique({ where: { token: 'maint-expired-rt' } })).toBeNull();
    expect(
      await prisma.userToken.findUnique({ where: { tokenHash: hashToken('maint-valid') } })
    ).toBeTruthy();
    expect(
      await prisma.userToken.findUnique({ where: { tokenHash: hashToken('maint-used') } })
    ).toBeNull();

    // The lock was released.
    const user = await prisma.user.findUnique({ where: { id: userId } });
    expect(user?.lockedUntil).toBeNull();
    expect(user?.failedLoginAttempts).toBe(0);
  });
});
