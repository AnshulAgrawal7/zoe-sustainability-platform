import type { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import type { AuthRequest } from '../middleware/auth';
import { ok, created, badRequest, notFound, serverError } from '../utils/response';

const prisma = new PrismaClient();

// POST /api/ideas — open to everyone (see optionalAuth). title/description/category
// are required; submitterName/submitterEmail are optional. A valid token links the
// idea to that user; otherwise it is stored anonymously (userId = null).
export async function createIdea(req: AuthRequest, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    badRequest(res, 'Validation failed', errors.array());
    return;
  }

  const { title, description, category, submitterName, submitterEmail } =
    req.body as {
      title: string;
      description: string;
      category: string;
      submitterName?: string;
      submitterEmail?: string;
    };

  try {
    const idea = await prisma.idea.create({
      data: {
        title: title.trim(),
        description: description.trim(),
        category,
        submitterName: submitterName?.trim() || null,
        submitterEmail: submitterEmail?.trim() || null,
        userId: req.user?.userId ?? null,
      },
      select: { id: true, status: true, createdAt: true },
    });
    created(res, idea);
  } catch {
    serverError(res);
  }
}

// GET /api/admin/ideas?status=... — adminOnly (guarded by the admin router).
export async function getIdeas(req: Request, res: Response) {
  const status = req.query['status'] as string | undefined;
  try {
    const ideas = await prisma.idea.findMany({
      where: status ? { status } : {},
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { id: true, name: true, email: true } } },
    });
    ok(res, { ideas, total: ideas.length });
  } catch {
    serverError(res);
  }
}

// PATCH /api/admin/ideas/:id — adminOnly. Only the status is mutable.
export async function updateIdeaStatus(req: Request, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    badRequest(res, 'Validation failed', errors.array());
    return;
  }

  const id = req.params['id'] as string;
  const { status } = req.body as { status: string };

  try {
    const existing = await prisma.idea.findUnique({ where: { id } });
    if (!existing) {
      notFound(res);
      return;
    }
    const idea = await prisma.idea.update({ where: { id }, data: { status } });
    ok(res, idea);
  } catch {
    serverError(res);
  }
}
