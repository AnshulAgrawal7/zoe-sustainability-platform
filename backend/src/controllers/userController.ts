import type { Response } from 'express';
import { validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import type { AuthRequest } from '../middleware/auth';
import { ok, badRequest, conflict, serverError } from '../utils/response';
import { isValidUsername, normalizeUsername } from '../utils/username';

const prisma = new PrismaClient();

const USER_SELECT = {
  id: true,
  email: true,
  username: true,
  name: true,
  role: true,
  points: true,
  avatarUrl: true,
  language: true,
  profile: true,
  createdAt: true,
};

export async function getMe(req: AuthRequest, res: Response) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      select: {
        ...USER_SELECT,
        participations: {
          include: { project: { select: { id: true, titleEn: true, titleEl: true, titleDe: true, category: true } } },
          orderBy: { joinedAt: 'desc' },
        },
        _count: { select: { participations: true, userBadges: true } },
      },
    });
    ok(res, user);
  } catch {
    serverError(res);
  }
}

export async function updateMe(req: AuthRequest, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) { badRequest(res, 'Validation failed', errors.array()); return; }

  const { name, username, language, avatarUrl, profile } = req.body as {
    name?: string;
    username?: string;
    language?: 'EN' | 'EL' | 'DE';
    avatarUrl?: string;
    profile?: 'RESIDENT' | 'VISITOR' | 'STUDENT' | 'VOLUNTEER';
  };

  try {
    // Username change: normalize, validate, and enforce uniqueness (excluding self).
    let normalizedUsername: string | undefined;
    if (username !== undefined) {
      normalizedUsername = normalizeUsername(username);
      if (!isValidUsername(normalizedUsername)) {
        badRequest(res, 'Invalid username');
        return;
      }
      const taken = await prisma.user.findFirst({
        where: { username: normalizedUsername, NOT: { id: req.user!.userId } },
        select: { id: true },
      });
      if (taken) {
        conflict(res, 'Username already taken');
        return;
      }
    }

    const user = await prisma.user.update({
      where: { id: req.user!.userId },
      data: {
        ...(name && { name }),
        ...(normalizedUsername && { username: normalizedUsername }),
        ...(language && { language }),
        ...(avatarUrl && { avatarUrl }),
        ...(profile && { profile }),
      },
      select: USER_SELECT,
    });
    ok(res, user);
  } catch {
    serverError(res);
  }
}

// GET /api/users/leaderboard — logged-in only (privacy: pseudonymous usernames,
// never names/emails). Top users by points, with a 1-based rank. The DSR
// rationale (design-rationale-matrix B3) is updated: pseudonymity + auth gate
// mitigate the earlier concern about exposing individual citizen rankings.
export async function getLeaderboard(req: AuthRequest, res: Response) {
  try {
    const top = await prisma.user.findMany({
      where: { role: 'USER' },
      orderBy: [{ points: 'desc' }, { createdAt: 'asc' }],
      take: 20,
      select: {
        id: true,
        username: true,
        points: true,
        avatarUrl: true,
        _count: { select: { participations: true } },
      },
    });
    const entries = top.map((u, i) => ({
      rank: i + 1,
      username: u.username,
      points: u.points,
      avatarUrl: u.avatarUrl,
      participationCount: u._count.participations,
      isMe: u.id === req.user!.userId,
    }));
    ok(res, { entries });
  } catch {
    serverError(res);
  }
}

// GET /api/users/search?q=… — logged-in only. Username autocomplete for @mentions
// in comments. Returns up to 8 matches by username prefix/substring.
export async function searchUsers(req: AuthRequest, res: Response) {
  const q = normalizeUsername(String(req.query['q'] ?? ''));
  if (q.length < 1) {
    ok(res, { users: [] });
    return;
  }
  try {
    const users = await prisma.user.findMany({
      where: { username: { contains: q } },
      orderBy: { username: 'asc' },
      take: 8,
      select: { username: true, avatarUrl: true },
    });
    ok(res, { users });
  } catch {
    serverError(res);
  }
}

export async function getMyBadges(req: AuthRequest, res: Response) {
  try {
    const userBadges = await prisma.userBadge.findMany({
      where: { userId: req.user!.userId },
      include: { badge: true },
      orderBy: { earnedAt: 'asc' },
    });
    const allBadges = await prisma.badge.findMany({ orderBy: { threshold: 'asc' } });
    const user = await prisma.user.findUnique({ where: { id: req.user!.userId }, select: { points: true } });

    ok(res, {
      earned: userBadges,
      all: allBadges,
      points: user?.points ?? 0,
      nextBadge: allBadges.find(b => b.threshold > (user?.points ?? 0)) ?? null,
    });
  } catch {
    serverError(res);
  }
}

