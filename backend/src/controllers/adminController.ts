import type { Response } from 'express';
import { validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import type { AuthRequest } from '../middleware/auth';
import { ok, badRequest, forbidden, notFound, serverError } from '../utils/response';
import { writeAudit } from '../utils/audit';
import { deleteUserCompletely } from '../services/userDeletion';

const prisma = new PrismaClient();

const ADMIN_USER_SELECT = {
  id: true, email: true, name: true, role: true, active: true, points: true,
} as const;

export async function getAllUsers(_req: AuthRequest, res: Response) {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true, email: true, username: true, name: true, role: true,
        active: true, points: true, language: true, createdAt: true,
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
  const newRole = (req.body as { role: string }).role;
  const actorId = req.user?.userId ?? '';

  try {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) { notFound(res); return; }

    // Guard 1: an admin cannot change their own role (prevents accidental
    // self-demotion and the resulting lockout).
    if (id === actorId) { forbidden(res, 'CANNOT_CHANGE_OWN_ROLE'); return; }

    // Guard 2: never demote the last remaining admin (keeps at least one admin
    // in the system at all times).
    if (user.role === 'ADMIN' && newRole !== 'ADMIN') {
      const adminCount = await prisma.user.count({ where: { role: 'ADMIN' } });
      if (adminCount <= 1) { forbidden(res, 'LAST_ADMIN'); return; }
    }

    if (user.role === newRole) { ok(res, { id: user.id, role: user.role }); return; }

    const updated = await prisma.user.update({
      where: { id },
      data: { role: newRole },
      select: ADMIN_USER_SELECT,
    });

    const actor = await prisma.user.findUnique({ where: { id: actorId } });
    await writeAudit(prisma, {
      actorId,
      actorEmail: actor?.email ?? 'unknown',
      action: 'ROLE_CHANGE',
      targetType: 'USER',
      targetId: id,
      targetLabel: user.email,
      detail: `role ${user.role} → ${newRole}`,
    });

    ok(res, updated);
  } catch {
    serverError(res);
  }
}

export async function updateUserActive(req: AuthRequest, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) { badRequest(res, 'Validation failed', errors.array()); return; }

  const id = req.params['id'] as string;
  const active = (req.body as { active: boolean }).active;
  const actorId = req.user?.userId ?? '';

  try {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) { notFound(res); return; }

    // An admin cannot suspend their own account.
    if (id === actorId && !active) { forbidden(res, 'CANNOT_SUSPEND_SELF'); return; }

    // Never suspend the last remaining admin.
    if (!active && user.role === 'ADMIN') {
      const activeAdmins = await prisma.user.count({ where: { role: 'ADMIN', active: true } });
      if (activeAdmins <= 1) { forbidden(res, 'LAST_ADMIN'); return; }
    }

    const updated = await prisma.user.update({
      where: { id },
      data: { active },
      select: ADMIN_USER_SELECT,
    });

    // Suspending revokes existing sessions so the block takes effect at once.
    if (!active) {
      await prisma.refreshToken.deleteMany({ where: { userId: id } });
    }

    const actor = await prisma.user.findUnique({ where: { id: actorId } });
    await writeAudit(prisma, {
      actorId,
      actorEmail: actor?.email ?? 'unknown',
      action: active ? 'ACCOUNT_REACTIVATE' : 'ACCOUNT_SUSPEND',
      targetType: 'USER',
      targetId: id,
      targetLabel: user.email,
    });

    ok(res, updated);
  } catch {
    serverError(res);
  }
}

export async function updateUserPoints(req: AuthRequest, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) { badRequest(res, 'Validation failed', errors.array()); return; }

  const id = req.params['id'] as string;
  const points = (req.body as { points: number }).points;
  const actorId = req.user?.userId ?? '';

  try {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) { notFound(res); return; }

    const updated = await prisma.user.update({
      where: { id },
      data: { points },
      select: ADMIN_USER_SELECT,
    });

    const actor = await prisma.user.findUnique({ where: { id: actorId } });
    await writeAudit(prisma, {
      actorId,
      actorEmail: actor?.email ?? 'unknown',
      action: 'POINTS_ADJUST',
      targetType: 'USER',
      targetId: id,
      targetLabel: user.email,
      detail: `points ${user.points} → ${points}`,
    });

    ok(res, updated);
  } catch {
    serverError(res);
  }
}

export async function deleteUser(req: AuthRequest, res: Response) {
  const id = req.params['id'] as string;
  const actorId = req.user?.userId ?? '';

  try {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) { notFound(res); return; }

    // An admin cannot delete their own account here (use self-service), and the
    // last admin can never be removed.
    if (id === actorId) { forbidden(res, 'CANNOT_DELETE_SELF'); return; }
    if (user.role === 'ADMIN') {
      const adminCount = await prisma.user.count({ where: { role: 'ADMIN' } });
      if (adminCount <= 1) { forbidden(res, 'LAST_ADMIN'); return; }
    }

    await deleteUserCompletely(prisma, id);

    const actor = await prisma.user.findUnique({ where: { id: actorId } });
    await writeAudit(prisma, {
      actorId,
      actorEmail: actor?.email ?? 'unknown',
      action: 'ACCOUNT_DELETE',
      targetType: 'USER',
      targetId: id,
      targetLabel: user.email,
    });

    ok(res, { deleted: true });
  } catch (err) {
    if (err instanceof Error && err.name === 'UserDeletionBlockedError') {
      badRequest(res, err.message);
      return;
    }
    serverError(res);
  }
}

export async function getAuditLog(req: AuthRequest, res: Response) {
  try {
    const limit = Math.min(Number(req.query['limit']) || 100, 500);
    const entries = await prisma.adminAuditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
    ok(res, entries);
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
