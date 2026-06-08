import type { Response } from 'express';
import { validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import type { AuthRequest } from '../middleware/auth';
import { ok, badRequest, serverError } from '../utils/response';

const prisma = new PrismaClient();

const USER_SELECT = {
  id: true,
  email: true,
  name: true,
  role: true,
  points: true,
  avatarUrl: true,
  language: true,
  profile: true,
  schoolId: true,
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

  const { name, language, avatarUrl, profile } = req.body as {
    name?: string;
    language?: 'EN' | 'EL' | 'DE';
    avatarUrl?: string;
    profile?: 'RESIDENT' | 'VISITOR' | 'STUDENT' | 'VOLUNTEER';
  };

  try {
    const user = await prisma.user.update({
      where: { id: req.user!.userId },
      data: { ...(name && { name }), ...(language && { language }), ...(avatarUrl && { avatarUrl }), ...(profile && { profile }) },
      select: USER_SELECT,
    });
    ok(res, user);
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

export async function getLeaderboard(_req: AuthRequest, res: Response) {
  try {
    const users = await prisma.user.findMany({
      orderBy: { points: 'desc' },
      take: 10,
      select: { id: true, name: true, points: true, avatarUrl: true, _count: { select: { participations: true } } },
    });
    ok(res, users);
  } catch {
    serverError(res);
  }
}
