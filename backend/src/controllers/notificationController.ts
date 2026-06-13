import type { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { ok, serverError } from '../utils/response';

const prisma = new PrismaClient();

// Cap the feed — the header bell is a glance, not the full management list
// (those live on /admin/ideas and /admin/submissions).
const MAX_ITEMS = 30;

type NotificationKind = 'IDEA' | 'REPORT' | 'FEEDBACK';

interface NotificationItem {
  id: string;
  kind: NotificationKind;
  title: string;
  submitterName: string | null;
  createdAt: Date;
}

// GET /api/admin/notifications — adminOnly (guarded by the admin router).
// Aggregates the items that need an admin's attention into one feed for the
// header bell: citizen ideas still awaiting review (status NEW) plus reports
// (environmental issues) and feedback. Newest first, capped. Only a short
// title is returned — no full idea body / message — to keep the payload lean.
export async function getAdminNotifications(_req: Request, res: Response) {
  try {
    const [ideas, submissions] = await Promise.all([
      prisma.idea.findMany({
        where: { status: 'NEW' },
        orderBy: { createdAt: 'desc' },
        take: MAX_ITEMS,
        select: {
          id: true,
          title: true,
          createdAt: true,
          submitterName: true,
          user: { select: { name: true } },
        },
      }),
      prisma.submission.findMany({
        orderBy: { createdAt: 'desc' },
        take: MAX_ITEMS,
        select: {
          id: true,
          type: true,
          message: true,
          createdAt: true,
          submitterName: true,
          user: { select: { name: true } },
        },
      }),
    ]);

    const items: NotificationItem[] = [
      ...ideas.map((i) => ({
        id: `idea:${i.id}`,
        kind: 'IDEA' as NotificationKind,
        title: i.title,
        submitterName: i.user?.name ?? i.submitterName ?? null,
        createdAt: i.createdAt,
      })),
      ...submissions.map((s) => ({
        id: `submission:${s.id}`,
        kind: (s.type === 'REPORT' ? 'REPORT' : 'FEEDBACK') as NotificationKind,
        // A short excerpt — reports/feedback have no title of their own.
        title: s.message.length > 80 ? `${s.message.slice(0, 80)}…` : s.message,
        submitterName: s.user?.name ?? s.submitterName ?? null,
        createdAt: s.createdAt,
      })),
    ]
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, MAX_ITEMS);

    ok(res, { notifications: items, total: items.length });
  } catch {
    serverError(res);
  }
}
