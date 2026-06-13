import type { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import type { AuthRequest } from '../middleware/auth';
import { ok, serverError } from '../utils/response';

const prisma = new PrismaClient();

const MAX_ITEMS = 30;

// GET /api/notifications — the logged-in user's in-app notifications (mentions),
// newest first. Each carries the actor's username + a target (eventId/ideaId) so
// the client can deep-link to the discussion.
export async function getMyNotifications(req: AuthRequest, res: Response) {
  const userId = req.user!.userId;
  try {
    const rows = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: MAX_ITEMS,
      select: {
        id: true,
        type: true,
        read: true,
        createdAt: true,
        eventId: true,
        ideaId: true,
        submissionId: true,
        commentId: true,
        status: true,
        message: true,
        actor: { select: { username: true } },
      },
    });
    const unreadCount = await prisma.notification.count({
      where: { userId, read: false },
    });
    ok(res, {
      notifications: rows.map((n) => ({
        id: n.id,
        type: n.type,
        read: n.read,
        createdAt: n.createdAt,
        eventId: n.eventId,
        ideaId: n.ideaId,
        submissionId: n.submissionId,
        commentId: n.commentId,
        status: n.status,
        message: n.message,
        actorUsername: n.actor?.username ?? null,
      })),
      unreadCount,
    });
  } catch {
    serverError(res);
  }
}

// POST /api/notifications/read — mark all of the user's notifications as read.
export async function markAllNotificationsRead(req: AuthRequest, res: Response) {
  const userId = req.user!.userId;
  try {
    await prisma.notification.updateMany({
      where: { userId, read: false },
      data: { read: true },
    });
    ok(res, { ok: true });
  } catch {
    serverError(res);
  }
}
