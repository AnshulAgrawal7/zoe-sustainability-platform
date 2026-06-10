import type { Response } from 'express';
import { validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import type { AuthRequest } from '../middleware/auth';
import { ok, badRequest, notFound, serverError } from '../utils/response';

const prisma = new PrismaClient();

export async function getAllUsers(_req: AuthRequest, res: Response) {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true, email: true, name: true, role: true,
        points: true, language: true, createdAt: true,
        _count: { select: { participations: true, userBadges: true } },
      },
    });
    ok(res, users);
  } catch {
    serverError(res);
  }
}

export async function updateUserRole(req: AuthRequest, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) { badRequest(res, 'Validation failed', errors.array()); return; }

  const id = req.params['id'] as string;
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) { notFound(res); return; }

    const updated = await prisma.user.update({
      where: { id },
      data: { role: (req.body as { role: string }).role },
      select: { id: true, email: true, name: true, role: true },
    });
    ok(res, updated);
  } catch {
    serverError(res);
  }
}

export async function getStats(_req: AuthRequest, res: Response) {
  try {
    const [totalUsers, totalProjects, totalParticipations, openProjects, totalEvents, projectsByCategory] =
      await Promise.all([
        prisma.user.count(),
        prisma.project.count(),
        prisma.participation.count(),
        prisma.project.count({ where: { status: 'OPEN' } }),
        prisma.event.count(),
        prisma.project.groupBy({ by: ['category'], _count: { id: true } }),
      ]);

    ok(res, { totalUsers, totalProjects, totalParticipations, openProjects, totalEvents, projectsByCategory });
  } catch {
    serverError(res);
  }
}
