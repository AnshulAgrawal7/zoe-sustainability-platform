import type { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import type { AuthRequest } from '../middleware/auth';
import { ok, created, badRequest, notFound, forbidden, serverError } from '../utils/response';
import { notifyStatusChange, emailAnonymousSubmitter } from '../utils/notify';
import { parsePageParams } from '../utils/pagination';

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

// GET /api/ideas/public — public idea board. Returns ONLY admin-approved
// (ACCEPTED) ideas and, for privacy/DSGVO, selects NO personal fields
// (submitterName/Email/userId are never exposed). Pre-moderation is enforced
// server-side here, not in the frontend.
export async function getPublicIdeas(req: AuthRequest, res: Response) {
  const category = req.query['category'] as string | undefined;
  const userId = req.user?.userId;
  // Opt-in pagination (Future_Work §3.7) — without ?page/?limit the full list is
  // returned (unchanged behaviour for the current SPA board).
  const { paginated, page, limit, skip } = parsePageParams(req);
  try {
    const where = { status: 'ACCEPTED', ...(category ? { category } : {}) };
    // Most-supported first (participatory prioritization), then newest.
    const ideas = await prisma.idea.findMany({
      where,
      orderBy: [{ votes: { _count: 'desc' } }, { createdAt: 'desc' }],
      ...(paginated ? { skip, take: limit } : {}),
      select: {
        id: true,
        title: true,
        description: true,
        category: true,
        status: true,
        createdAt: true,
        _count: { select: { votes: true } },
      },
    });
    const total = paginated
      ? await prisma.idea.count({ where })
      : ideas.length;

    let votedSet = new Set<string>();
    if (userId && ideas.length) {
      const votes = await prisma.ideaVote.findMany({
        where: { userId, ideaId: { in: ideas.map((i) => i.id) } },
        select: { ideaId: true },
      });
      votedSet = new Set(votes.map((v) => v.ideaId));
    }

    ok(res, {
      ideas: ideas.map((i) => ({
        id: i.id,
        title: i.title,
        description: i.description,
        category: i.category,
        status: i.status,
        createdAt: i.createdAt,
        voteCount: i._count.votes,
        votedByMe: votedSet.has(i.id),
      })),
      total,
      ...(paginated ? { page, limit, pages: Math.ceil(total / limit) } : {}),
    });
  } catch {
    serverError(res);
  }
}

// GET /api/ideas/mine — the logged-in user's own ideas (every status), so they
// can track them in their dashboard ("in review / approved / declined").
export async function getMyIdeas(req: AuthRequest, res: Response) {
  const userId = req.user!.userId;
  try {
    const ideas = await prisma.idea.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        description: true,
        category: true,
        status: true,
        adminNote: true,
        createdAt: true,
        _count: { select: { votes: true } },
      },
    });
    ok(res, {
      ideas: ideas.map((i) => ({
        id: i.id,
        title: i.title,
        description: i.description,
        category: i.category,
        status: i.status,
        adminNote: i.adminNote,
        createdAt: i.createdAt,
        voteCount: i._count.votes,
      })),
    });
  } catch {
    serverError(res);
  }
}

// POST /api/ideas/:id/vote — toggle a support vote (logged-in). Only approved
// (ACCEPTED) ideas are votable; one vote per user.
export async function voteIdea(req: AuthRequest, res: Response) {
  const ideaId = req.params['id'] as string;
  const userId = req.user!.userId;
  try {
    const idea = await prisma.idea.findUnique({
      where: { id: ideaId },
      select: { status: true },
    });
    if (!idea) {
      notFound(res);
      return;
    }
    if (idea.status !== 'ACCEPTED') {
      forbidden(res, 'You can only vote on approved ideas');
      return;
    }
    const existing = await prisma.ideaVote.findUnique({
      where: { ideaId_userId: { ideaId, userId } },
    });
    let voted: boolean;
    if (existing) {
      await prisma.ideaVote.delete({
        where: { ideaId_userId: { ideaId, userId } },
      });
      voted = false;
    } else {
      await prisma.ideaVote.create({ data: { ideaId, userId } });
      voted = true;
    }
    const voteCount = await prisma.ideaVote.count({ where: { ideaId } });
    ok(res, { voted, voteCount });
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
      include: { user: { select: { id: true, username: true, name: true, email: true } } },
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
  const { status, message } = req.body as { status: string; message?: string };

  try {
    const existing = await prisma.idea.findUnique({ where: { id } });
    if (!existing) {
      notFound(res);
      return;
    }
    const note = message?.trim() || null;
    const idea = await prisma.idea.update({
      where: { id },
      data: { status, adminNote: note },
    });
    // Tell the submitter (if a registered user) that their idea was reviewed.
    await notifyStatusChange(prisma, {
      userId: existing.userId,
      type: 'IDEA_STATUS',
      status,
      message: note,
      ideaId: id,
    }).catch(() => null);
    // Anonymous submitter with an e-mail → notify by mail instead (§7.2).
    await emailAnonymousSubmitter({
      submitterEmail: existing.submitterEmail,
      userId: existing.userId,
      kindLabel: 'idea',
      title: existing.title,
      status,
      note,
    }).catch(() => null);
    ok(res, idea);
  } catch {
    serverError(res);
  }
}
