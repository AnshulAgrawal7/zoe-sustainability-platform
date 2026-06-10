import type { Response } from 'express';
import { validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import type { AuthRequest } from '../middleware/auth';
import { created, ok, badRequest, conflict, serverError } from '../utils/response';

const prisma = new PrismaClient();

// Points granted to a logged-in user for registering to an event. Guests earn none
// (this is the incentive to create an account — participation itself stays open).
const EVENT_POINTS = 20;

// POST /api/events/:eventId/register — open to everyone (see optionalAuth).
// Logged-in users register via their account and earn points; guests provide a
// name + email + consent and earn nothing. Events are prototype content keyed by
// string id (src/data/events.ts), so eventId is not validated against a table.
export async function registerForEvent(req: AuthRequest, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    badRequest(res, 'Validation failed', errors.array());
    return;
  }

  const eventId = req.params['eventId'] as string;
  const userId = req.user?.userId;

  try {
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
          data: { eventId, userId, pointsAwarded: EVENT_POINTS },
        }),
        prisma.user.update({
          where: { id: userId },
          data: { points: { increment: EVENT_POINTS } },
        }),
      ]);
      created(res, { id: registration.id, pointsAwarded: EVENT_POINTS, guest: false });
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
