import crypto from 'crypto';

// Mail-driven account flows (password reset §2.1, e-mail verification §2.2).
// The RAW token is sent to the user (in the e-mail link); only its SHA-256 hash
// is persisted (UserToken.tokenHash), so a database leak cannot be replayed.

export const TOKEN_TYPE = {
  PASSWORD_RESET: 'PASSWORD_RESET',
  EMAIL_VERIFY: 'EMAIL_VERIFY',
} as const;

export type TokenType = (typeof TOKEN_TYPE)[keyof typeof TOKEN_TYPE];

export const PASSWORD_RESET_TTL_MS = 60 * 60 * 1000; // 60 minutes
export const EMAIL_VERIFY_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

/** A URL-safe 32-byte random token (the value e-mailed to the user). */
export function generateRawToken(): string {
  return crypto.randomBytes(32).toString('base64url');
}

/** SHA-256 hash of a raw token — what we store and look up by. */
export function hashToken(raw: string): string {
  return crypto.createHash('sha256').update(raw).digest('hex');
}
