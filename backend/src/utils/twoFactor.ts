import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { verifyToken } from './totp';

// Helpers shared by the login flow and the 2FA management endpoints
// (Future_Work §2.5).

export const BACKUP_CODE_COUNT = 10;

/** Generate N human-friendly single-use backup codes (e.g. "a1b2-c3d4"). */
export function generateBackupCodes(count = BACKUP_CODE_COUNT): string[] {
  const codes: string[] = [];
  for (let i = 0; i < count; i++) {
    const raw = crypto.randomBytes(4).toString('hex'); // 8 hex chars
    codes.push(`${raw.slice(0, 4)}-${raw.slice(4)}`);
  }
  return codes;
}

/** bcrypt-hash backup codes for at-rest storage (JSON-encoded array). */
export async function hashBackupCodes(codes: string[]): Promise<string> {
  const hashed = await Promise.all(codes.map((c) => bcrypt.hash(c, 10)));
  return JSON.stringify(hashed);
}

type TwoFactorUser = {
  twoFactorSecret: string | null;
  twoFactorBackupCodes: string | null;
};

export interface TwoFactorCheck {
  ok: boolean;
  /** When a backup code was consumed, the updated JSON (that code removed). */
  updatedBackupCodes?: string;
}

/**
 * Verify a 6-digit TOTP token OR a one-time backup code against the user.
 * On a matching backup code, returns the remaining codes (the used one removed)
 * so the caller can persist the consumption.
 */
export async function verifyTwoFactorCode(
  user: TwoFactorUser,
  code: string
): Promise<TwoFactorCheck> {
  const cleaned = (code || '').trim();
  if (!cleaned) return { ok: false };

  // TOTP (6 digits).
  if (user.twoFactorSecret && /^\d{6}$/.test(cleaned.replace(/\s/g, ''))) {
    if (verifyToken(user.twoFactorSecret, cleaned)) return { ok: true };
  }

  // Otherwise try the single-use backup codes.
  if (user.twoFactorBackupCodes) {
    let hashes: string[];
    try {
      hashes = JSON.parse(user.twoFactorBackupCodes) as string[];
    } catch {
      hashes = [];
    }
    for (let i = 0; i < hashes.length; i++) {
      if (await bcrypt.compare(cleaned, hashes[i]!)) {
        const remaining = hashes.filter((_, idx) => idx !== i);
        return { ok: true, updatedBackupCodes: JSON.stringify(remaining) };
      }
    }
  }

  return { ok: false };
}
