import type { Response } from 'express';
import { validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import type { AuthRequest } from '../middleware/auth';
import { ok, badRequest, conflict, serverError } from '../utils/response';
import { generateSecret, otpauthURL, verifyToken } from '../utils/totp';
import { generateBackupCodes, hashBackupCodes, verifyTwoFactorCode } from '../utils/twoFactor';

const prisma = new PrismaClient();

// POST /auth/2fa/setup — authenticated. Generates a fresh secret and returns it
// (+ the otpauth:// URI for the QR). NOT enabled yet: the user must confirm a
// code via /enable. Re-running before enabling just rotates the pending secret.
export async function setupTwoFactor(req: AuthRequest, res: Response) {
  const userId = req.user!.userId;
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, twoFactorEnabled: true },
    });
    if (!user) {
      badRequest(res, 'User not found');
      return;
    }
    if (user.twoFactorEnabled) {
      conflict(res, 'TWO_FACTOR_ALREADY_ENABLED');
      return;
    }
    const secret = generateSecret();
    await prisma.user.update({ where: { id: userId }, data: { twoFactorSecret: secret } });
    ok(res, { secret, otpauthUrl: otpauthURL(secret, user.email) });
  } catch {
    serverError(res);
  }
}

// POST /auth/2fa/enable — authenticated, body { token }. Confirms the pending
// secret with a live code, switches 2FA on, and returns one-time backup codes
// (shown ONCE — only their bcrypt hashes are stored).
export async function enableTwoFactor(req: AuthRequest, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    badRequest(res, 'Validation failed', errors.array());
    return;
  }
  const userId = req.user!.userId;
  const { token } = req.body as { token: string };
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { twoFactorSecret: true, twoFactorEnabled: true },
    });
    if (!user?.twoFactorSecret) {
      badRequest(res, 'TWO_FACTOR_NOT_SET_UP');
      return;
    }
    if (user.twoFactorEnabled) {
      conflict(res, 'TWO_FACTOR_ALREADY_ENABLED');
      return;
    }
    if (!verifyToken(user.twoFactorSecret, token)) {
      badRequest(res, 'INVALID_2FA');
      return;
    }
    const backupCodes = generateBackupCodes();
    await prisma.user.update({
      where: { id: userId },
      data: {
        twoFactorEnabled: true,
        twoFactorBackupCodes: await hashBackupCodes(backupCodes),
      },
    });
    ok(res, { backupCodes });
  } catch {
    serverError(res);
  }
}

// POST /auth/2fa/disable — authenticated, body { code }. Requires a valid TOTP
// token or backup code, then clears all 2FA state.
export async function disableTwoFactor(req: AuthRequest, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    badRequest(res, 'Validation failed', errors.array());
    return;
  }
  const userId = req.user!.userId;
  const { code } = req.body as { code: string };
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { twoFactorEnabled: true, twoFactorSecret: true, twoFactorBackupCodes: true },
    });
    if (!user?.twoFactorEnabled) {
      badRequest(res, 'TWO_FACTOR_NOT_ENABLED');
      return;
    }
    const check = await verifyTwoFactorCode(user, code);
    if (!check.ok) {
      badRequest(res, 'INVALID_2FA');
      return;
    }
    await prisma.user.update({
      where: { id: userId },
      data: {
        twoFactorEnabled: false,
        twoFactorSecret: null,
        twoFactorBackupCodes: null,
      },
    });
    ok(res, null, 'Two-factor authentication disabled');
  } catch {
    serverError(res);
  }
}
