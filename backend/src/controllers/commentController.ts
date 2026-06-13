import type { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import type { AuthRequest } from '../middleware/auth';
import {
  ok, created, badRequest, notFound, forbidden, serverError,
} from '../utils/response';

const prisma = new PrismaClient();

// Public shape of a comment — author USERNAME only (pseudonymous; the user posts
// knowingly in public; never real name/email/userId), aggregate like count, and
// whether the current user liked it.
interface CommentRow {
  id: string;
  body: string;
  createdAt: Date;
  user: { username: string; avatarUrl: string | null };
  _count: { likes: number };
}

const commentSelect = {
  id: true,
  body: true,
  createdAt: true,
  user: { select: { username: true, avatarUrl: true } },
  _count: { select: { likes: true } },
} as const;

function shapeComment(c: CommentRow, likedSet: Set<string>) {
  return {
    id: c.id,
    body: c.body,
    createdAt: c.createdAt,
    authorUsername: c.user.username,
    authorAvatarUrl: c.user.avatarUrl,
    likeCount: c._count.likes,
    likedByMe: likedSet.has(c.id),
  };
}

// Extract @username mentions from a comment body and create one MENTION
// notification per distinct, real user (never the author themselves). Best-effort:
// a failure here must not fail the comment creation, so callers ignore errors.
const MENTION_RE = /@([a-z0-9_]{3,20})/g;

async function createMentionNotifications(opts: {
  body: string;
  actorId: string;
  commentId: string;
  eventId?: string;
  ideaId?: string;
}): Promise<void> {
  const usernames = [
    ...new Set(
      [...opts.body.toLowerCase().matchAll(MENTION_RE)].map((m) => m[1])
    ),
  ];
  if (usernames.length === 0) return;

  const mentioned = await prisma.user.findMany({
    where: { username: { in: usernames }, id: { not: opts.actorId } },
    select: { id: true },
  });
  if (mentioned.length === 0) return;

  await prisma.notification.createMany({
    data: mentioned.map((u) => ({
      userId: u.id,
      type: 'MENTION',
      actorId: opts.actorId,
      commentId: opts.commentId,
      ...(opts.eventId ? { eventId: opts.eventId } : {}),
      ...(opts.ideaId ? { ideaId: opts.ideaId } : {}),
    })),
  });
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
      select: { ...commentSelect, id: true },
    });
    await createMentionNotifications({
      body: body.trim(),
      actorId: userId,
      commentId: comment.id,
      ideaId,
    }).catch(() => null);
    created(res, shapeComment(comment as CommentRow, new Set()));
  } catch {
    serverError(res);
  }
}

// GET /api/events/:id/comments — public; VISIBLE comments on an event.
// optionalAuth adds `likedByMe`. Everyone can read the discussion.
export async function getEventComments(req: AuthRequest, res: Response) {
  const eventId = req.params['id'] as string;
  const userId = req.user?.userId;
  try {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      select: { id: true },
    });
    if (!event) {
      notFound(res);
      return;
    }
    const comments = await prisma.comment.findMany({
      where: { eventId, status: 'VISIBLE' },
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
      comments: comments.map((c) => shapeComment(c as CommentRow, likedSet)),
    });
  } catch {
    serverError(res);
  }
}

// POST /api/events/:id/comments — logged-in only. The event must exist.
export async function createEventComment(req: AuthRequest, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    badRequest(res, 'Validation failed', errors.array());
    return;
  }
  const eventId = req.params['id'] as string;
  const userId = req.user!.userId;
  const { body } = req.body as { body: string };
  try {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      select: { id: true },
    });
    if (!event) {
      notFound(res);
      return;
    }
    const comment = await prisma.comment.create({
      data: { eventId, userId, body: body.trim() },
      select: { ...commentSelect, id: true },
    });
    await createMentionNotifications({
      body: body.trim(),
      actorId: userId,
      commentId: comment.id,
      eventId,
    }).catch(() => null);
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
        user: { select: { username: true } },
        idea: { select: { id: true, title: true } },
        event: { select: { id: true, titleEn: true } },
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
