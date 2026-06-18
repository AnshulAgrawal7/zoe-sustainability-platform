import type { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { signAccessToken, signRefreshToken, verifyToken, getRefreshExpiresAt } from '../utils/jwt';
import { ok, created, badRequest, unauthorized, forbidden, conflict, serverError } from '../utils/response';
import type { AuthRequest } from '../middleware/auth';
import { generateUniqueUsername, isValidUsername, normalizeUsername } from '../utils/username';
import {
  TOKEN_TYPE,
  PASSWORD_RESET_TTL_MS,
  EMAIL_VERIFY_TTL_MS,
  generateRawToken,
  hashToken,
} from '../utils/tokens';
import { sendPasswordResetEmail, sendVerificationEmail } from '../services/mailService';
import { verifyTwoFactorCode } from '../utils/twoFactor';

const prisma = new PrismaClient();

// Per-account brute-force throttle (Future_Work §2.4): after this many
// consecutive failed logins the account is locked for the window below. This is
// in addition to the IP-wide auth rate limiter in app.ts.
const MAX_FAILED_ATTEMPTS = 5;
const LOCK_WINDOW_MS = 15 * 60 * 1000;

// Fields of the User that are safe to return to the client (never password).
const PUBLIC_USER_SELECT = {
  id: true,
  email: true,
  username: true,
  name: true,
  role: true,
  points: true,
  avatarUrl: true,
  language: true,
  profile: true,
  emailVerifiedAt: true,
  twoFactorEnabled: true,
} as const;

// Source fields the public-user mapper reads. Accepts the full Prisma User too
// (structural typing), but `toAuthUser` only ever copies these — so passing a
// full row (e.g. from login) can never leak the password hash.
interface SelectedUser {
  id: string;
  email: string;
  username: string;
  name: string;
  role: string;
  points: number;
  avatarUrl: string | null;
  language: string;
  profile: string;
  emailVerifiedAt: Date | null;
  twoFactorEnabled: boolean;
}

// Map a DB user to the API user shape. Exposes `emailVerified` (boolean) instead
// of the raw timestamp, so the client never has to interpret a date.
function toAuthUser(u: SelectedUser) {
  return {
    id: u.id,
    email: u.email,
    username: u.username,
    name: u.name,
    role: u.role,
    points: u.points,
    avatarUrl: u.avatarUrl,
    language: u.language,
    profile: u.profile,
    emailVerified: u.emailVerifiedAt != null,
    twoFactorEnabled: u.twoFactorEnabled,
  };
}

// Issue + e-mail a fresh verification token (Future_Work §2.2). Best-effort: a
// mail hiccup must never fail the surrounding request (registration/resend).
async function issueVerificationEmail(userId: string, email: string): Promise<void> {
  const raw = generateRawToken();
  await prisma.userToken.create({
    data: {
      userId,
      type: TOKEN_TYPE.EMAIL_VERIFY,
      tokenHash: hashToken(raw),
      expiresAt: new Date(Date.now() + EMAIL_VERIFY_TTL_MS),
    },
  });
  await sendVerificationEmail(email, raw).catch(() => null);
}

/**
 * Cookie options for the refresh token.
 *
 * In production the frontend (e.g. Vercel) and backend (e.g. Render) usually
 * live on *different* sites, so the cookie must be `SameSite=None; Secure` to
 * be sent on credentialed cross-site requests. In development (same-site
 * localhost over http) we use `lax` and drop `secure` so login works without TLS.
 *
 * No `maxAge`/`expires` → this is a SESSION cookie: the browser drops it when it
 * is fully closed, so closing the browser ends the session (no auto re-login on
 * restart). The DB-side refresh token still has its own 7-day expiry for
 * server-side cleanup, but the client stops presenting it once the browser
 * closes. (Note: browsers with "continue where you left off"/session-restore
 * may preserve session cookies — that is the browser's choice, not the server's.)
 */
function refreshCookieOptions() {
  const isProd = process.env.NODE_ENV === 'production';
  return {
    httpOnly: true,
    secure: isProd, // SameSite=None requires Secure
    sameSite: isProd ? ('none' as const) : ('lax' as const),
    path: '/',
  };
}

/** Matching attributes (minus maxAge) so clearCookie reliably removes it. */
function clearRefreshCookieOptions() {
  const isProd = process.env.NODE_ENV === 'production';
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? ('none' as const) : ('lax' as const),
    path: '/',
  };
}

export async function register(req: Request, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    badRequest(res, 'Validation failed', errors.array());
    return;
  }

  const { email, password, name, username, language = 'EN', profile = 'RESIDENT' } = req.body as {
    email: string;
    password: string;
    name: string;
    username?: string;
    language?: 'EN' | 'EL' | 'DE';
    profile?: 'RESIDENT' | 'VISITOR' | 'STUDENT' | 'VOLUNTEER';
  };

  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      // Code-based message so the client can show a localised, field-level error.
      conflict(res, 'EMAIL_TAKEN');
      return;
    }

    // Resolve the public username: use the requested one (validated + unique) or
    // auto-derive a unique handle from the display name.
    let finalUsername: string;
    if (username !== undefined) {
      finalUsername = normalizeUsername(username);
      if (!isValidUsername(finalUsername)) {
        badRequest(res, 'Invalid username');
        return;
      }
      const taken = await prisma.user.findUnique({ where: { username: finalUsername } });
      if (taken) {
        conflict(res, 'USERNAME_TAKEN');
        return;
      }
    } else {
      finalUsername = await generateUniqueUsername(prisma, name);
    }

    const hashed = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashed,
        name,
        username: finalUsername,
        language,
        profile,
        // Proof of consent: validated as `true` by the route, recorded here.
        acceptedTermsAt: new Date(),
      },
      select: PUBLIC_USER_SELECT,
    });

    // Auto-award newcomer badge
    const newcomerBadge = await prisma.badge.findFirst({ where: { threshold: 0 } });
    if (newcomerBadge) {
      await prisma.userBadge.create({ data: { userId: user.id, badgeId: newcomerBadge.id } });
    }

    // Send a verification link (Future_Work §2.2). The account is usable
    // immediately (prototype); the UI nudges the user to confirm.
    await issueVerificationEmail(user.id, user.email).catch(() => null);

    const accessToken = signAccessToken({ userId: user.id, role: user.role });
    const refreshToken = signRefreshToken({ userId: user.id, role: user.role });

    await prisma.refreshToken.create({
      data: { token: refreshToken, userId: user.id, expiresAt: getRefreshExpiresAt() },
    });

    res.cookie('refreshToken', refreshToken, refreshCookieOptions());

    created(res, { user: toAuthUser(user), accessToken });
  } catch {
    serverError(res);
  }
}

export async function login(req: Request, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    badRequest(res, 'Validation failed', errors.array());
    return;
  }

  const { identifier, email, password, totp } = req.body as {
    identifier?: string;
    email?: string;
    password: string;
    totp?: string;
  };

  // Accept either a username or an email. Stored emails and usernames are both
  // lowercased, so a trimmed lowercase comparison matches either column.
  const loginId = String(identifier ?? email ?? '')
    .trim()
    .toLowerCase();
  if (!loginId) {
    unauthorized(res, 'Invalid credentials');
    return;
  }

  try {
    const user = await prisma.user.findFirst({
      where: { OR: [{ email: loginId }, { username: loginId }] },
    });
    if (!user) {
      unauthorized(res, 'Invalid credentials');
      return;
    }

    // Per-account brute-force lock (Future_Work §2.4): while locked, reject
    // before even checking the password (no token issued).
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      res.status(429).json({ success: false, error: 'ACCOUNT_LOCKED' });
      return;
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      // Count the failure; lock the account once the threshold is reached.
      const attempts = user.failedLoginAttempts + 1;
      if (attempts >= MAX_FAILED_ATTEMPTS) {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            failedLoginAttempts: 0,
            lockedUntil: new Date(Date.now() + LOCK_WINDOW_MS),
          },
        });
        res.status(429).json({ success: false, error: 'ACCOUNT_LOCKED' });
        return;
      }
      await prisma.user.update({
        where: { id: user.id },
        data: { failedLoginAttempts: attempts },
      });
      unauthorized(res, 'Invalid credentials');
      return;
    }

    // Suspended accounts are blocked here: credentials may be correct but no
    // token is issued (admin soft-suspend, see adminController.updateUserActive).
    if (!user.active) {
      forbidden(res, 'ACCOUNT_DISABLED');
      return;
    }

    // Two-factor challenge (Future_Work §2.5). The password is correct, but if
    // 2FA is on we require a valid TOTP code (or a single-use backup code)
    // BEFORE issuing any token. A missing code returns a distinct status so the
    // client can prompt for it; a wrong code is rejected.
    if (user.twoFactorEnabled) {
      if (!totp) {
        res.status(401).json({ success: false, error: 'TWO_FACTOR_REQUIRED' });
        return;
      }
      const check = await verifyTwoFactorCode(user, totp);
      if (!check.ok) {
        res.status(401).json({ success: false, error: 'INVALID_2FA' });
        return;
      }
      // Consume a backup code if that is what was used.
      if (check.updatedBackupCodes !== undefined) {
        await prisma.user.update({
          where: { id: user.id },
          data: { twoFactorBackupCodes: check.updatedBackupCodes },
        });
      }
    }

    // Successful login → clear any accumulated failure state.
    if (user.failedLoginAttempts !== 0 || user.lockedUntil) {
      await prisma.user.update({
        where: { id: user.id },
        data: { failedLoginAttempts: 0, lockedUntil: null },
      });
    }

    const accessToken = signAccessToken({ userId: user.id, role: user.role });
    const refreshToken = signRefreshToken({ userId: user.id, role: user.role });

    await prisma.refreshToken.create({
      data: { token: refreshToken, userId: user.id, expiresAt: getRefreshExpiresAt() },
    });

    res.cookie('refreshToken', refreshToken, refreshCookieOptions());

    ok(res, { user: toAuthUser(user), accessToken });
  } catch {
    serverError(res);
  }
}

export async function refresh(req: Request, res: Response) {
  const token = req.cookies?.refreshToken as string | undefined;
  if (!token) {
    unauthorized(res, 'No refresh token');
    return;
  }

  try {
    const payload = verifyToken(token);
    const stored = await prisma.refreshToken.findUnique({ where: { token } });
    if (!stored || stored.expiresAt < new Date()) {
      unauthorized(res, 'Refresh token expired or invalid');
      return;
    }

    // Return the user alongside the token so the frontend can restore a full
    // session from the httpOnly cookie in ONE round-trip (page reload survives
    // without re-login — see AppRouter's auth bootstrap).
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: PUBLIC_USER_SELECT,
    });
    if (!user) {
      unauthorized(res, 'User no longer exists');
      return;
    }

    const accessToken = signAccessToken({ userId: user.id, role: user.role });
    ok(res, { accessToken, user: toAuthUser(user) });
  } catch {
    unauthorized(res, 'Invalid refresh token');
  }
}

export async function logout(req: AuthRequest, res: Response) {
  const token = req.cookies?.refreshToken as string | undefined;
  if (token) {
    await prisma.refreshToken.deleteMany({ where: { token } }).catch(() => null);
  }
  res.clearCookie('refreshToken', clearRefreshCookieOptions());
  ok(res, null, 'Logged out');
}

// POST /auth/forgot-password — start a password reset (Future_Work §2.1).
// ALWAYS responds 200 with the same body whether or not the address exists, to
// avoid leaking which e-mails are registered (account enumeration). When the
// address does exist, a single-use reset token is created and e-mailed (stub
// transport logs the link while no provider is wired — see mailService).
export async function forgotPassword(req: Request, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    badRequest(res, 'Validation failed', errors.array());
    return;
  }
  const { email } = req.body as { email: string };
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (user) {
      const raw = generateRawToken();
      await prisma.userToken.create({
        data: {
          userId: user.id,
          type: TOKEN_TYPE.PASSWORD_RESET,
          tokenHash: hashToken(raw),
          expiresAt: new Date(Date.now() + PASSWORD_RESET_TTL_MS),
        },
      });
      await sendPasswordResetEmail(user.email, raw).catch(() => null);
    }
    // Uniform response regardless of existence.
    ok(res, null, 'If that account exists, a reset link has been sent.');
  } catch {
    serverError(res);
  }
}

// POST /auth/reset-password — complete a password reset (Future_Work §2.1).
// Validates the token (hash match, not expired, not used), sets the new password,
// marks the token used, and revokes all refresh tokens so other sessions are
// logged out (a reset is also a "lock out anyone with the old password" action).
export async function resetPassword(req: Request, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    badRequest(res, 'Validation failed', errors.array());
    return;
  }
  const { token, password } = req.body as { token: string; password: string };
  try {
    const record = await prisma.userToken.findUnique({
      where: { tokenHash: hashToken(token) },
    });
    if (
      !record ||
      record.type !== TOKEN_TYPE.PASSWORD_RESET ||
      record.usedAt ||
      record.expiresAt < new Date()
    ) {
      badRequest(res, 'INVALID_OR_EXPIRED_TOKEN');
      return;
    }
    const hashed = await bcrypt.hash(password, 12);
    await prisma.$transaction([
      prisma.user.update({
        where: { id: record.userId },
        // A successful reset also clears any brute-force lock state.
        data: { password: hashed, failedLoginAttempts: 0, lockedUntil: null },
      }),
      prisma.userToken.update({
        where: { id: record.id },
        data: { usedAt: new Date() },
      }),
      prisma.refreshToken.deleteMany({ where: { userId: record.userId } }),
    ]);
    ok(res, null, 'Password updated');
  } catch {
    serverError(res);
  }
}

// POST /auth/verify-email — confirm an e-mail address (Future_Work §2.2).
// Public + token-based: validates the hash, type, expiry and single use, then
// stamps User.emailVerifiedAt and consumes the token. Idempotent-ish: a used
// token returns the same 400 as an invalid one.
export async function verifyEmail(req: Request, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    badRequest(res, 'Validation failed', errors.array());
    return;
  }
  const { token } = req.body as { token: string };
  try {
    const record = await prisma.userToken.findUnique({
      where: { tokenHash: hashToken(token) },
    });
    if (
      !record ||
      record.type !== TOKEN_TYPE.EMAIL_VERIFY ||
      record.usedAt ||
      record.expiresAt < new Date()
    ) {
      badRequest(res, 'INVALID_OR_EXPIRED_TOKEN');
      return;
    }
    await prisma.$transaction([
      prisma.user.update({
        where: { id: record.userId },
        data: { emailVerifiedAt: new Date() },
      }),
      prisma.userToken.update({
        where: { id: record.id },
        data: { usedAt: new Date() },
      }),
    ]);
    ok(res, null, 'E-mail verified');
  } catch {
    serverError(res);
  }
}

// POST /auth/resend-verification — authenticated. Re-issues a verification link
// for the logged-in user. No-op (still 200) if the address is already verified,
// so the client never learns more than "ok".
export async function resendVerification(req: AuthRequest, res: Response) {
  const userId = req.user!.userId;
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, emailVerifiedAt: true },
    });
    if (user && !user.emailVerifiedAt) {
      await issueVerificationEmail(user.id, user.email).catch(() => null);
    }
    ok(res, null, 'If your address is unverified, a new link has been sent.');
  } catch {
    serverError(res);
  }
}
