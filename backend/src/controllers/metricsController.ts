import type { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import { ok, badRequest, serverError } from '../utils/response';

const prisma = new PrismaClient();

/** UTC day key, e.g. "2026-06-12". */
function dayKey(date = new Date()): string {
  return date.toISOString().slice(0, 10);
}

// POST /api/metrics/view — privacy-by-design page-view counter. Receives ONLY a
// path (and an optional once-per-session visit flag) and increments aggregate
// day counters. Nothing visitor-related is read or stored (no IP, no UA, no
// cookie), so this stays consent-free. /admin paths are never recorded.
export async function recordPageView(req: Request, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    badRequest(res, 'Validation failed', errors.array());
    return;
  }

  const { path, newVisit } = req.body as { path: string; newVisit?: boolean };
  if (path.startsWith('/admin')) {
    ok(res, null); // silently ignore admin navigation
    return;
  }

  const day = dayKey();
  try {
    await prisma.pageViewDaily.upsert({
      where: { day_path: { day, path } },
      update: { count: { increment: 1 } },
      create: { day, path, count: 1 },
    });
    if (newVisit === true) {
      await prisma.siteVisitDaily.upsert({
        where: { day },
        update: { count: { increment: 1 } },
        create: { day, count: 1 },
      });
    }
    ok(res, null);
  } catch {
    serverError(res);
  }
}

/** Group a list of createdAt timestamps into per-day counts (UTC). */
function countPerDay(dates: { createdAt: Date }[]): Record<string, number> {
  const out: Record<string, number> = {};
  for (const d of dates) {
    const key = dayKey(d.createdAt);
    out[key] = (out[key] ?? 0) + 1;
  }
  return out;
}

function sum(values: number[]): number {
  return values.reduce((a, b) => a + b, 0);
}

// GET /api/admin/metrics?days=30 — adminOnly. Everything the monitoring page
// needs in one round-trip: page views & visits per day, top pages, and the
// platform-activity series derived from EXISTING timestamps (logins via
// RefreshToken, registrations, event RSVPs, ideas, submissions, newsletter).
export async function getAdminMetrics(req: Request, res: Response) {
  const daysRaw = parseInt((req.query['days'] as string) ?? '30', 10);
  const days = Math.min(Math.max(Number.isFinite(daysRaw) ? daysRaw : 30, 1), 365);
  const since = new Date(Date.now() - days * 86400000);
  const sinceDay = dayKey(since);

  try {
    const [viewRows, visitRows, topPages, logins, users, eventRegs, ideas, submissions, newsletter] =
      await Promise.all([
        prisma.pageViewDaily.groupBy({
          by: ['day'],
          where: { day: { gte: sinceDay } },
          _sum: { count: true },
          orderBy: { day: 'asc' },
        }),
        prisma.siteVisitDaily.findMany({
          where: { day: { gte: sinceDay } },
          orderBy: { day: 'asc' },
        }),
        prisma.pageViewDaily.groupBy({
          by: ['path'],
          where: { day: { gte: sinceDay } },
          _sum: { count: true },
          orderBy: { _sum: { count: 'desc' } },
          take: 10,
        }),
        // Each login (and registration) issues a refresh token → login proxy.
        prisma.refreshToken.findMany({ where: { createdAt: { gte: since } }, select: { createdAt: true } }),
        prisma.user.findMany({ where: { createdAt: { gte: since } }, select: { createdAt: true } }),
        prisma.eventRegistration.findMany({ where: { createdAt: { gte: since } }, select: { createdAt: true } }),
        prisma.idea.findMany({ where: { createdAt: { gte: since } }, select: { createdAt: true } }),
        prisma.submission.findMany({ where: { createdAt: { gte: since } }, select: { createdAt: true } }),
        prisma.newsletterSignup.findMany({ where: { createdAt: { gte: since } }, select: { createdAt: true } }),
      ]);

    const [totalUsers, totalViewsAll] = await Promise.all([
      prisma.user.count(),
      prisma.pageViewDaily.aggregate({ _sum: { count: true } }),
    ]);

    ok(res, {
      days,
      pageViews: viewRows.map((r) => ({ day: r.day, count: r._sum.count ?? 0 })),
      visits: visitRows.map((r) => ({ day: r.day, count: r.count })),
      topPages: topPages.map((r) => ({ path: r.path, count: r._sum.count ?? 0 })),
      activity: {
        logins: countPerDay(logins),
        newUsers: countPerDay(users),
        eventRegistrations: countPerDay(eventRegs),
        ideas: countPerDay(ideas),
        submissions: countPerDay(submissions),
        newsletterSignups: countPerDay(newsletter),
      },
      totals: {
        pageViews: sum(viewRows.map((r) => r._sum.count ?? 0)),
        pageViewsAllTime: totalViewsAll._sum.count ?? 0,
        visits: sum(visitRows.map((r) => r.count)),
        logins: logins.length,
        newUsers: users.length,
        eventRegistrations: eventRegs.length,
        ideas: ideas.length,
        submissions: submissions.length,
        newsletterSignups: newsletter.length,
        totalUsers,
      },
    });
  } catch {
    serverError(res);
  }
}
