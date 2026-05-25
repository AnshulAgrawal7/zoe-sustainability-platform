import type { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { signAccessToken, signRefreshToken, verifyToken, getRefreshExpiresAt } from '../utils/jwt';
import { ok, created, badRequest, unauthorized, conflict, serverError } from '../utils/response';
import type { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();

export async function register(req: Request, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    badRequest(res, 'Validation failed', errors.array());
    return;
  }

  const { email, password, name, language = 'EN' } = req.body as {
    email: string;
    password: string;
    name: string;
    language?: 'EN' | 'EL' | 'DE';
  };

  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      conflict(res, 'Email already registered');
      return;
    }

    const hashed = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { email, password: hashed, name, language },
      select: { id: true, email: true, name: true, role: true, points: true, language: true },
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

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

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

  const { email, password } = req.body as { email: string; password: string };

  try {
    const user = await prisma.user.findUnique({ where: { email } });
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

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    ok(res, {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        points: user.points,
        language: user.language,
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

    const accessToken = signAccessToken({ userId: payload.userId, role: payload.role });
    ok(res, { accessToken });
  } catch {
    unauthorized(res, 'Invalid refresh token');
  }
}

export async function logout(req: AuthRequest, res: Response) {
  const token = req.cookies?.refreshToken as string | undefined;
  if (token) {
    await prisma.refreshToken.deleteMany({ where: { token } }).catch(() => null);
  }
  res.clearCookie('refreshToken');
  ok(res, null, 'Logged out');
}
