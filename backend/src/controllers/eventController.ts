import type { Response } from 'express';
import { validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import type { AuthRequest } from '../middleware/auth';
import {
  ok, created, badRequest, notFound, conflict, forbidden, serverError,
} from '../utils/response';
import { sendRsvpConfirmationEmail } from '../services/mailService';

const prisma = new PrismaClient();

// Send an RSVP confirmation (Future_Work §7.3). Best-effort: a mail hiccup must
// never fail the registration itself. Skips when no address is available.
async function sendRsvpConfirmation(
  event: { titleEn: string; date: Date; location: string | null } | null,
  to: string | null | undefined,
  name: string | null | undefined,
): Promise<void> {
  if (!event || !to) return;
  await sendRsvpConfirmationEmail({
    to,
    name,
    eventTitle: event.titleEn,
    eventDate: event.date,
    location: event.location,
  }).catch(() => null);
}

// Default reward when an event does not override it. NOTE: points are NOT
// granted on registration anymore — they are awarded to registered logged-in
// users when an admin marks the event COMPLETED (see completeEvent). Guests
// earn none either way (the incentive to create an account — participation
// itself stays open).
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
  lat?: number | null;
  lng?: number | null;
  category?: string;
  rewardPoints?: number;
  capacity?: number;
  imageUrl?: string;
  projectId?: string;
}

// Attach a registration count to each event (the link is a soft string reference,
// so we group EventRegistration by eventId rather than via a relation include).
// When a logged-in user makes the request, also flag the events they are
// registered for (`registeredByMe`) so the UI can show cancel instead of register.
async function withCounts<T extends { id: string }>(events: T[], userId?: string) {
  if (events.length === 0)
    return events.map((e) => ({ ...e, registeredCount: 0, registeredByMe: false }));
  const ids = events.map((e) => e.id);
  const [groups, mine] = await Promise.all([
    prisma.eventRegistration.groupBy({
      by: ['eventId'],
      where: { eventId: { in: ids } },
      _count: { _all: true },
    }),
    userId
      ? prisma.eventRegistration.findMany({
          where: { eventId: { in: ids }, userId },
          select: { eventId: true },
        })
      : Promise.resolve([]),
  ]);
  const counts = new Map(groups.map((g) => [g.eventId, g._count._all]));
  const mineSet = new Set(mine.map((m) => m.eventId));
  return events.map((e) => ({
    ...e,
    registeredCount: counts.get(e.id) ?? 0,
    registeredByMe: mineSet.has(e.id),
  }));
}

const projectSelect = {
  select: { id: true, titleEn: true, titleEl: true, titleDe: true, category: true },
};

// GET /api/events — public (optionalAuth adds registeredByMe). Filters:
// category, projectId, upcoming=true (date>=now).
export async function getEvents(req: AuthRequest, res: Response) {
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
    ok(res, { events: await withCounts(events, req.user?.userId) });
  } catch {
    serverError(res);
  }
}

// GET /api/events/:id — public detail (optionalAuth adds registeredByMe).
export async function getEvent(req: AuthRequest, res: Response) {
  const id = req.params['id'] as string;
  try {
    const event = await prisma.event.findUnique({
      where: { id },
      include: { project: projectSelect },
    });
    if (!event) { notFound(res); return; }
    const [withCount] = await withCounts([event], req.user?.userId);
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
        lat: body.lat ?? null,
        lng: body.lng ?? null,
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
        ...(body.lat !== undefined ? { lat: body.lat } : {}),
        ...(body.lng !== undefined ? { lng: body.lng } : {}),
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

// POST /api/events/:id/join — logged-in attendance. Creates the registration
// only: NO points are granted here. They become `pointsPending` and are awarded
// once an admin marks the event COMPLETED (see completeEvent). The event must
// exist (validated here since eventId is a soft reference).
export async function joinEvent(req: AuthRequest, res: Response) {
  const userId = req.user!.userId;
  const eventId = req.params['id'] as string;

  try {
    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) { notFound(res); return; }
    if (event.status === 'COMPLETED') {
      forbidden(res, 'This event has already taken place'); return;
    }

    const existing = await prisma.eventRegistration.findUnique({
      where: { userId_eventId: { userId, eventId } },
    });
    if (existing) { conflict(res, 'You are already registered for this event'); return; }

    if (event.capacity != null) {
      const count = await prisma.eventRegistration.count({ where: { eventId } });
      if (count >= event.capacity) { forbidden(res, 'This event is fully booked'); return; }
    }

    const registration = await prisma.eventRegistration.create({
      data: { eventId, userId, pointsAwarded: 0 },
    });

    // Confirm the RSVP by e-mail (§7.3) to the member's address.
    const member = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, name: true },
    });
    await sendRsvpConfirmation(event, member?.email, member?.name);

    created(res, {
      id: registration.id,
      pointsAwarded: 0,
      pointsPending: event.rewardPoints,
      guest: false,
    });
  } catch {
    serverError(res);
  }
}

// DELETE /api/events/:id/registration — logged-in cancel. Allowed any time
// BEFORE the event is completed; afterwards the attendance (and its points)
// is locked in.
export async function cancelRegistration(req: AuthRequest, res: Response) {
  const userId = req.user!.userId;
  const eventId = req.params['id'] as string;

  try {
    const registration = await prisma.eventRegistration.findUnique({
      where: { userId_eventId: { userId, eventId } },
    });
    if (!registration) { notFound(res, 'You are not registered for this event'); return; }

    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (event?.status === 'COMPLETED') {
      forbidden(res, 'This event has already taken place — the registration can no longer be cancelled');
      return;
    }

    await prisma.eventRegistration.delete({ where: { id: registration.id } });
    ok(res, null, 'Registration cancelled');
  } catch {
    serverError(res);
  }
}

// GET /api/events/registrations/me — the logged-in user's event registrations,
// enriched with the event (manual join: eventId is a soft reference). Drives the
// dashboard "my events" list incl. pending vs awarded points.
export async function getMyEventRegistrations(req: AuthRequest, res: Response) {
  const userId = req.user!.userId;
  try {
    const registrations = await prisma.eventRegistration.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    const events = await prisma.event.findMany({
      where: { id: { in: registrations.map((r) => r.eventId) } },
      include: { project: projectSelect },
    });
    const eventMap = new Map(events.map((e) => [e.id, e]));
    ok(res, {
      registrations: registrations.map((r) => {
        const event = eventMap.get(r.eventId) ?? null;
        return {
          id: r.id,
          eventId: r.eventId,
          createdAt: r.createdAt,
          pointsAwarded: r.pointsAwarded,
          // Pending until the admin completes the event (0 once awarded/orphaned).
          pointsPending:
            event && event.status !== 'COMPLETED' ? event.rewardPoints : 0,
          event,
        };
      }),
    });
  } catch {
    serverError(res);
  }
}

// GET /api/admin/events/:id/registrations — adminOnly. Who is registered for an
// event: members (linked user incl. points status) and guests (name/email),
// newest first. Read-only — admins manage attendance, they don't join.
export async function getEventRegistrationsAdmin(req: AuthRequest, res: Response) {
  const eventId = req.params['id'] as string;
  try {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: { project: projectSelect },
    });
    if (!event) { notFound(res); return; }
    const registrations = await prisma.eventRegistration.findMany({
      where: { eventId },
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { id: true, name: true, email: true } } },
    });
    ok(res, { event, registrations, total: registrations.length });
  } catch {
    serverError(res);
  }
}

// POST /api/admin/events/:id/complete — adminOnly. Marks the event COMPLETED and
// awards its rewardPoints to every registered logged-in user that has not been
// awarded yet (idempotent: re-running never double-awards). Threshold badges are
// granted afterwards, mirroring the old join-time logic.
export async function completeEvent(req: AuthRequest, res: Response) {
  const eventId = req.params['id'] as string;

  try {
    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) { notFound(res); return; }

    const pending = await prisma.eventRegistration.findMany({
      where: { eventId, userId: { not: null }, pointsAwarded: 0 },
      select: { id: true, userId: true },
    });

    await prisma.$transaction([
      prisma.event.update({ where: { id: eventId }, data: { status: 'COMPLETED' } }),
      ...pending.flatMap((r) => [
        prisma.eventRegistration.update({
          where: { id: r.id },
          data: { pointsAwarded: event.rewardPoints },
        }),
        prisma.user.update({
          where: { id: r.userId! },
          data: { points: { increment: event.rewardPoints } },
        }),
      ]),
    ]);

    // Grant any threshold badges the new totals unlock.
    for (const r of pending) {
      const user = await prisma.user.findUnique({
        where: { id: r.userId! },
        select: { points: true },
      });
      if (!user) continue;
      const earnedBadges = await prisma.badge.findMany({
        where: { threshold: { lte: user.points } },
      });
      for (const badge of earnedBadges) {
        await prisma.userBadge.upsert({
          where: { userId_badgeId: { userId: r.userId!, badgeId: badge.id } },
          update: {},
          create: { userId: r.userId!, badgeId: badge.id },
        });
      }
    }

    ok(res, {
      id: event.id,
      status: 'COMPLETED',
      awardedCount: pending.length,
      pointsPerUser: event.rewardPoints,
    });
  } catch {
    serverError(res);
  }
}

// POST /api/events/:eventId/register — open to everyone (see optionalAuth).
// Logged-in users register via their account (points become pending — awarded
// when the event is completed); guests provide a name + email + consent and
// earn nothing.
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
    if (event?.status === 'COMPLETED') {
      forbidden(res, 'This event has already taken place');
      return;
    }

    // Capacity is enforced on EVERY registration path (members AND guests) —
    // mirrors joinEvent, otherwise the open RSVP could overbook a full event.
    if (event?.capacity != null) {
      const count = await prisma.eventRegistration.count({ where: { eventId } });
      if (count >= event.capacity) {
        forbidden(res, 'This event is fully booked');
        return;
      }
    }

    if (userId) {
      const existing = await prisma.eventRegistration.findUnique({
        where: { userId_eventId: { userId, eventId } },
      });
      if (existing) {
        conflict(res, 'You are already registered for this event');
        return;
      }
      const registration = await prisma.eventRegistration.create({
        data: { eventId, userId, pointsAwarded: 0 },
      });
      const member = await prisma.user.findUnique({
        where: { id: userId },
        select: { email: true, name: true },
      });
      await sendRsvpConfirmation(event, member?.email, member?.name);
      created(res, {
        id: registration.id,
        pointsAwarded: 0,
        pointsPending: points,
        guest: false,
      });
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
    await sendRsvpConfirmation(event, guestEmail, guestName);
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
