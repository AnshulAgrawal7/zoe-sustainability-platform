import type { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { signAccessToken, signRefreshToken, verifyToken, getRefreshExpiresAt } from '../utils/jwt';
import { ok, created, badRequest, unauthorized, conflict, serverError } from '../utils/response';
import type { AuthRequest } from '../middleware/auth';
import { generateUniqueUsername, isValidUsername, normalizeUsername } from '../utils/username';

const prisma = new PrismaClient();

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
} as const;

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

    const accessToken = signAccessToken({ userId: user.id, role: user.role });
    const refreshToken = signRefreshToken({ userId: user.id, role: user.role });

    await prisma.refreshToken.create({
      data: { token: refreshToken, userId: user.id, expiresAt: getRefreshExpiresAt() },
    });

    res.cookie('refreshToken', refreshToken, refreshCookieOptions());

    created(res, { user, accessToken });
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

  const { identifier, email, password } = req.body as {
    identifier?: string;
    email?: string;
    password: string;
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

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      unauthorized(res, 'Invalid credentials');
      return;
    }

    const accessToken = signAccessToken({ userId: user.id, role: user.role });
    const refreshToken = signRefreshToken({ userId: user.id, role: user.role });

    await prisma.refreshToken.create({
      data: { token: refreshToken, userId: user.id, expiresAt: getRefreshExpiresAt() },
    });

    res.cookie('refreshToken', refreshToken, refreshCookieOptions());

    ok(res, {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        name: user.name,
        role: user.role,
        points: user.points,
        avatarUrl: user.avatarUrl,
        language: user.language,
        profile: user.profile,
      },
      accessToken,
    });
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
    ok(res, { accessToken, user });
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
