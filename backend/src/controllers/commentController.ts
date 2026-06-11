import type { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import type { AuthRequest } from '../middleware/auth';
import {
  ok, created, badRequest, notFound, forbidden, serverError,
} from '../utils/response';

const prisma = new PrismaClient();

// Public shape of a comment — author DISPLAY NAME only (the user posts knowingly
// in public; never email/userId), aggregate like count, and whether the current
// user liked it.
interface CommentRow {
  id: string;
  body: string;
  createdAt: Date;
  user: { name: string };
  _count: { likes: number };
}

const commentSelect = {
  id: true,
  body: true,
  createdAt: true,
  user: { select: { name: true } },
  _count: { select: { likes: true } },
} as const;

function shapeComment(c: CommentRow, likedSet: Set<string>) {
  return {
    id: c.id,
    body: c.body,
    createdAt: c.createdAt,
    authorName: c.user.name,
    likeCount: c._count.likes,
    likedByMe: likedSet.has(c.id),
  };
}

// GET /api/ideas/public/:id — an approved idea + its VISIBLE comments.
// optionalAuth: a logged-in user additionally gets `likedByMe` per comment.
export async function getPublicIdeaDetail(req: AuthRequest, res: Response) {
  const id = req.params['id'] as string;
  const userId = req.user?.userId;
  try {
    const idea = await prisma.idea.findFirst({
      where: { id, status: 'ACCEPTED' },
      select: {
        id: true, title: true, description: true,
        category: true, status: true, createdAt: true,
      },
    });
    if (!idea) {
      notFound(res);
      return;
    }

    const comments = await prisma.comment.findMany({
      where: { ideaId: id, status: 'VISIBLE' },
      orderBy: { createdAt: 'asc' },
      select: commentSelect,
    });

    let likedSet = new Set<string>();
    if (userId && comments.length) {
      const likes = await prisma.commentLike.findMany({
        where: { userId, commentId: { in: comments.map((c) => c.id) } },
        select: { commentId: true },
      });
      likedSet = new Set(likes.map((l) => l.commentId));
    }

    ok(res, {
      idea,
      comments: comments.map((c) => shapeComment(c as CommentRow, likedSet)),
    });
  } catch {
    serverError(res);
  }
}

// POST /api/ideas/:id/comments — logged-in only; the idea must be ACCEPTED.
export async function createComment(req: AuthRequest, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    badRequest(res, 'Validation failed', errors.array());
    return;
  }
  const ideaId = req.params['id'] as string;
  const userId = req.user!.userId;
  const { body } = req.body as { body: string };
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
      forbidden(res, 'Comments are only allowed on approved ideas');
      return;
    }
    const comment = await prisma.comment.create({
      data: { ideaId, userId, body: body.trim() },
      select: commentSelect,
    });
    created(res, shapeComment(comment as CommentRow, new Set()));
  } catch {
    serverError(res);
  }
}

// POST /api/comments/:id/like — toggle a like (logged-in). One like per user.
export async function toggleCommentLike(req: AuthRequest, res: Response) {
  const commentId = req.params['id'] as string;
  const userId = req.user!.userId;
  try {
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      select: { status: true },
    });
    if (!comment || comment.status !== 'VISIBLE') {
      notFound(res);
      return;
    }
    const existing = await prisma.commentLike.findUnique({
      where: { commentId_userId: { commentId, userId } },
    });
    let liked: boolean;
    if (existing) {
      await prisma.commentLike.delete({
        where: { commentId_userId: { commentId, userId } },
      });
      liked = false;
    } else {
      await prisma.commentLike.create({ data: { commentId, userId } });
      liked = true;
    }
    const likeCount = await prisma.commentLike.count({ where: { commentId } });
    ok(res, { liked, likeCount });
  } catch {
    serverError(res);
  }
}

// GET /api/admin/comments — moderation list (every status), adminOnly.
export async function getAllComments(_req: Request, res: Response) {
  try {
    const comments = await prisma.comment.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true, body: true, status: true, createdAt: true,
        user: { select: { name: true } },
        idea: { select: { id: true, title: true } },
        _count: { select: { likes: true } },
      },
    });
    ok(res, { comments, total: comments.length });
  } catch {
    serverError(res);
  }
}

// PATCH /api/admin/comments/:id — set VISIBLE/HIDDEN, adminOnly.
export async function setCommentStatus(req: Request, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    badRequest(res, 'Validation failed', errors.array());
    return;
  }
  const id = req.params['id'] as string;
  const { status } = req.body as { status: string };
  try {
    const existing = await prisma.comment.findUnique({ where: { id } });
    if (!existing) {
      notFound(res);
      return;
    }
    const updated = await prisma.comment.update({ where: { id }, data: { status } });
    ok(res, updated);
  } catch {
    serverError(res);
  }
}
