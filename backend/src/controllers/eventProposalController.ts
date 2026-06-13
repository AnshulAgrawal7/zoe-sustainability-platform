import type { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import type { AuthRequest } from '../middleware/auth';
import { ok, created, badRequest, notFound, serverError } from '../utils/response';

const prisma = new PrismaClient();

interface ProposalBody {
  title: string;
  description: string;
  lang?: string;
  category: string;
  date: string;
  location?: string;
  lat?: number | null;
  lng?: number | null;
  capacity?: number | null;
  imageUrl?: string;
  projectId?: string;
  submitterName?: string;
  submitterEmail?: string;
}

// POST /api/event-proposals — open to everyone (optionalAuth). A citizen suggests
// an event in ONE language; an admin reviews it and, on approval, converts it
// into a real Event (the admin form is pre-filled + auto-translated). NOT shown
// on the public idea board.
export async function createEventProposal(req: AuthRequest, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    badRequest(res, 'Validation failed', errors.array());
    return;
  }
  const body = req.body as ProposalBody;
  try {
    const proposal = await prisma.eventProposal.create({
      data: {
        title: body.title.trim(),
        description: body.description.trim(),
        lang: body.lang ?? 'EN',
        category: body.category,
        date: new Date(body.date),
        location: body.location?.trim() || null,
        lat: body.lat ?? null,
        lng: body.lng ?? null,
        capacity: body.capacity ?? null,
        imageUrl: body.imageUrl?.trim() || null,
        projectId: body.projectId?.trim() || null,
        submitterName: body.submitterName?.trim() || null,
        submitterEmail: body.submitterEmail?.trim() || null,
        userId: req.user?.userId ?? null,
      },
      select: { id: true, status: true, createdAt: true },
    });
    created(res, proposal);
  } catch {
    serverError(res);
  }
}

// GET /api/admin/event-proposals?status=… — adminOnly.
export async function getEventProposals(req: Request, res: Response) {
  const status = req.query['status'] as string | undefined;
  try {
    const proposals = await prisma.eventProposal.findMany({
      where: status ? { status } : {},
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { id: true, username: true, name: true, email: true } } },
    });
    ok(res, { proposals, total: proposals.length });
  } catch {
    serverError(res);
  }
}

// GET /api/admin/event-proposals/:id — adminOnly. Used to pre-fill the event form.
export async function getEventProposal(req: Request, res: Response) {
  const id = req.params['id'] as string;
  try {
    const proposal = await prisma.eventProposal.findUnique({
      where: { id },
      include: { user: { select: { id: true, username: true, name: true, email: true } } },
    });
    if (!proposal) {
      notFound(res);
      return;
    }
    ok(res, proposal);
  } catch {
    serverError(res);
  }
}

// PATCH /api/admin/event-proposals/:id — adminOnly. Set status to DECLINED, or
// to CONVERTED with the id of the Event that was created from it.
export async function updateEventProposal(req: Request, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    badRequest(res, 'Validation failed', errors.array());
    return;
  }
  const id = req.params['id'] as string;
  const { status, createdEventId } = req.body as {
    status: string;
    createdEventId?: string;
  };
  try {
    const existing = await prisma.eventProposal.findUnique({ where: { id } });
    if (!existing) {
      notFound(res);
      return;
    }
    const updated = await prisma.eventProposal.update({
      where: { id },
      data: {
        status,
        ...(createdEventId !== undefined ? { createdEventId } : {}),
      },
    });
    ok(res, updated);
  } catch {
    serverError(res);
  }
}
