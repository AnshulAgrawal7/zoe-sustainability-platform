import type { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import type { AuthRequest } from '../middleware/auth';
import {
  ok, created, badRequest, notFound, conflict, forbidden, serverError,
} from '../utils/response';

const prisma = new PrismaClient();

// Points granted to a logged-in user for joining an event default to this when an
// event does not override it. Guests earn none (the incentive to create an
// account — participation itself stays open).
const EVENT_POINTS = 20;

interface EventBody {
  titleEn?: string;
  titleEl?: string;
  titleDe?: string;
  descriptionEn?: string;
  descriptionEl?: string;
  descriptionDe?: string;
  date?: string;
  location?: string;
  category?: string;
  rewardPoints?: number;
  capacity?: number;
  imageUrl?: string;
  projectId?: string;
}

// Attach a registration count to each event (the link is a soft string reference,
// so we group EventRegistration by eventId rather than via a relation include).
async function withCounts<T extends { id: string }>(events: T[]) {
  if (events.length === 0) return events.map((e) => ({ ...e, registeredCount: 0 }));
  const groups = await prisma.eventRegistration.groupBy({
    by: ['eventId'],
    where: { eventId: { in: events.map((e) => e.id) } },
    _count: { _all: true },
  });
  const counts = new Map(groups.map((g) => [g.eventId, g._count._all]));
  return events.map((e) => ({ ...e, registeredCount: counts.get(e.id) ?? 0 }));
}

const projectSelect = {
  select: { id: true, titleEn: true, titleEl: true, titleDe: true, category: true },
};

// GET /api/events — public. Filters: category, projectId, upcoming=true (date>=now).
export async function getEvents(req: Request, res: Response) {
  const category = req.query['category'] as string | undefined;
  const projectId = req.query['projectId'] as string | undefined;
  const upcoming = req.query['upcoming'] === 'true';

  try {
    const events = await prisma.event.findMany({
      where: {
        ...(category ? { category } : {}),
        ...(projectId ? { projectId } : {}),
        ...(upcoming ? { date: { gte: new Date() } } : {}),
      },
      orderBy: { date: 'asc' },
      include: { project: projectSelect },
    });
    ok(res, { events: await withCounts(events) });
  } catch {
    serverError(res);
  }
}

// GET /api/events/:id — public detail.
export async function getEvent(req: Request, res: Response) {
  const id = req.params['id'] as string;
  try {
    const event = await prisma.event.findUnique({
      where: { id },
      include: { project: projectSelect },
    });
    if (!event) { notFound(res); return; }
    const [withCount] = await withCounts([event]);
    ok(res, withCount);
  } catch {
    serverError(res);
  }
}

// POST /api/admin/events — adminOnly.
export async function createEvent(req: AuthRequest, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) { badRequest(res, 'Validation failed', errors.array()); return; }

  const body = req.body as EventBody;
  try {
    // Decision A: every event must belong to a Project.
    if (!body.projectId) { badRequest(res, 'A linked project is required'); return; }
    const project = await prisma.project.findUnique({ where: { id: body.projectId } });
    if (!project) { badRequest(res, 'Linked project does not exist'); return; }
    const event = await prisma.event.create({
      data: {
        titleEn: body.titleEn ?? '',
        titleEl: body.titleEl ?? '',
        titleDe: body.titleDe ?? '',
        descriptionEn: body.descriptionEn ?? '',
        descriptionEl: body.descriptionEl ?? '',
        descriptionDe: body.descriptionDe ?? '',
        date: new Date(body.date as string),
        location: body.location ?? null,
        category: body.category as string,
        rewardPoints: body.rewardPoints ?? EVENT_POINTS,
        capacity: body.capacity ?? null,
        imageUrl: body.imageUrl ?? null,
        projectId: body.projectId,
      },
    });
    created(res, event);
  } catch {
    serverError(res);
  }
}

// PATCH /api/admin/events/:id — adminOnly.
export async function updateEvent(req: AuthRequest, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) { badRequest(res, 'Validation failed', errors.array()); return; }

  const id = req.params['id'] as string;
  const body = req.body as EventBody;
  try {
    const existing = await prisma.event.findUnique({ where: { id } });
    if (!existing) { notFound(res); return; }
    if (body.projectId) {
      const project = await prisma.project.findUnique({ where: { id: body.projectId } });
      if (!project) { badRequest(res, 'Linked project does not exist'); return; }
    }
    const updated = await prisma.event.update({
      where: { id },
      data: {
        ...(body.titleEn !== undefined ? { titleEn: body.titleEn } : {}),
        ...(body.titleEl !== undefined ? { titleEl: body.titleEl } : {}),
        ...(body.titleDe !== undefined ? { titleDe: body.titleDe } : {}),
        ...(body.descriptionEn !== undefined ? { descriptionEn: body.descriptionEn } : {}),
        ...(body.descriptionEl !== undefined ? { descriptionEl: body.descriptionEl } : {}),
        ...(body.descriptionDe !== undefined ? { descriptionDe: body.descriptionDe } : {}),
        ...(body.date !== undefined ? { date: new Date(body.date) } : {}),
        ...(body.location !== undefined ? { location: body.location || null } : {}),
        ...(body.category !== undefined ? { category: body.category } : {}),
        ...(body.rewardPoints !== undefined ? { rewardPoints: body.rewardPoints } : {}),
        ...(body.capacity !== undefined ? { capacity: body.capacity } : {}),
        ...(body.imageUrl !== undefined ? { imageUrl: body.imageUrl || null } : {}),
        ...(body.projectId ? { projectId: body.projectId } : {}),
      },
    });
    ok(res, updated);
  } catch {
    serverError(res);
  }
}

// DELETE /api/admin/events/:id — adminOnly. Hard delete (events are dated content);
// registrations keep their soft eventId reference (no FK) and are not cascaded.
export async function deleteEvent(req: AuthRequest, res: Response) {
  const id = req.params['id'] as string;
  try {
    const existing = await prisma.event.findUnique({ where: { id } });
    if (!existing) { notFound(res); return; }
    await prisma.event.delete({ where: { id } });
    ok(res, null, 'Event deleted');
  } catch {
    serverError(res);
  }
}

// POST /api/events/:id/join — logged-in attendance. Mirrors project participation:
// awards the event's rewardPoints, prevents double-join, and grants threshold
// badges. The event must exist (validated here since eventId is a soft reference).
export async function joinEvent(req: AuthRequest, res: Response) {
  const userId = req.user!.userId;
  const eventId = req.params['id'] as string;

  try {
    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) { notFound(res); return; }

    const existing = await prisma.eventRegistration.findUnique({
      where: { userId_eventId: { userId, eventId } },
    });
    if (existing) { conflict(res, 'You are already registered for this event'); return; }

    if (event.capacity != null) {
      const count = await prisma.eventRegistration.count({ where: { eventId } });
      if (count >= event.capacity) { forbidden(res, 'This event is fully booked'); return; }
    }

    const points = event.rewardPoints;
    const [registration] = await prisma.$transaction([
      prisma.eventRegistration.create({ data: { eventId, userId, pointsAwarded: points } }),
      prisma.user.update({ where: { id: userId }, data: { points: { increment: points } } }),
    ]);

    const updatedUser = await prisma.user.findUnique({ where: { id: userId }, select: { points: true } });
    if (updatedUser) {
      const earnedBadges = await prisma.badge.findMany({ where: { threshold: { lte: updatedUser.points } } });
      for (const badge of earnedBadges) {
        await prisma.userBadge.upsert({
          where: { userId_badgeId: { userId, badgeId: badge.id } },
          update: {},
          create: { userId, badgeId: badge.id },
        });
      }
    }

    created(res, { id: registration.id, pointsAwarded: points, guest: false });
  } catch {
    serverError(res);
  }
}

// POST /api/events/:eventId/register — open to everyone (see optionalAuth).
// Logged-in users register via their account and earn points; guests provide a
// name + email + consent and earn nothing.
export async function registerForEvent(req: AuthRequest, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    badRequest(res, 'Validation failed', errors.array());
    return;
  }

  const eventId = req.params['eventId'] as string;
  const userId = req.user?.userId;

  try {
    // Resolve the event's reward (soft reference; default if the event row is gone).
    const event = await prisma.event.findUnique({ where: { id: eventId } });
    const points = event?.rewardPoints ?? EVENT_POINTS;

    if (userId) {
      const existing = await prisma.eventRegistration.findUnique({
        where: { userId_eventId: { userId, eventId } },
      });
      if (existing) {
        conflict(res, 'You are already registered for this event');
        return;
      }
      const [registration] = await prisma.$transaction([
        prisma.eventRegistration.create({
          data: { eventId, userId, pointsAwarded: points },
        }),
        prisma.user.update({
          where: { id: userId },
          data: { points: { increment: points } },
        }),
      ]);
      created(res, { id: registration.id, pointsAwarded: points, guest: false });
      return;
    }

    // Guest registration — name, email and explicit consent are mandatory.
    const { guestName, guestEmail, consent } = req.body as {
      guestName?: string;
      guestEmail?: string;
      consent?: boolean;
    };
    if (!guestName || !guestEmail || consent !== true) {
      badRequest(res, 'Name, email and consent are required to register as a guest');
      return;
    }
    const duplicate = await prisma.eventRegistration.findFirst({
      where: { eventId, guestEmail },
    });
    if (duplicate) {
      conflict(res, 'This email is already registered for this event');
      return;
    }
    const registration = await prisma.eventRegistration.create({
      data: { eventId, guestName, guestEmail },
    });
    created(res, { id: registration.id, pointsAwarded: 0, guest: true });
  } catch {
    serverError(res);
  }
}

// GET /api/events/:eventId/count — public registration count for an event.
export async function getEventRegistrationCount(req: AuthRequest, res: Response) {
  const eventId = req.params['eventId'] as string;
  try {
    const count = await prisma.eventRegistration.count({ where: { eventId } });
    ok(res, { count });
  } catch {
    serverError(res);
  }
}
