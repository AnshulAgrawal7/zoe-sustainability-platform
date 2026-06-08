import type { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import type { AuthRequest } from '../middleware/auth';
import { ok, created, badRequest, notFound, serverError } from '../utils/response';

const prisma = new PrismaClient();

const POST_TYPES = ['PROJECT_NEW', 'PROJECT_COMPLETED', 'ANNOUNCEMENT'] as const;

interface PostBody {
  type?: string;
  titleEn?: string;
  titleEl?: string;
  titleDe?: string;
  bodyEn?: string;
  bodyEl?: string;
  bodyDe?: string;
  imageUrl?: string;
  published?: boolean;
}

/** GET /api/posts?type=&limit= — public, published posts, newest first. */
export async function getPosts(req: Request, res: Response) {
  const limit = Math.min(50, parseInt(req.query['limit'] as string) || 20);
  const type = req.query['type'] as string | undefined;
  const where = {
    published: true,
    ...(type && (POST_TYPES as readonly string[]).includes(type) ? { type } : {}),
  };
  try {
    const posts = await prisma.post.findMany({
      where,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });
    ok(res, posts);
  } catch {
    serverError(res);
  }
}

/** GET /api/posts/:id — public. */
export async function getPost(req: Request, res: Response) {
  const id = req.params['id'] as string;
  try {
    const post = await prisma.post.findUnique({ where: { id } });
    if (!post || !post.published) { notFound(res); return; }
    ok(res, post);
  } catch {
    serverError(res);
  }
}

/** POST /api/posts — admin, manual post (trilingual). */
export async function createPost(req: AuthRequest, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) { badRequest(res, 'Validation failed', errors.array()); return; }

  const b = req.body as PostBody;
  try {
    const post = await prisma.post.create({
      data: {
        type: b.type && (POST_TYPES as readonly string[]).includes(b.type) ? b.type : 'ANNOUNCEMENT',
        titleEn: b.titleEn ?? '',
        titleEl: b.titleEl ?? '',
        titleDe: b.titleDe ?? '',
        bodyEn: b.bodyEn ?? '',
        bodyEl: b.bodyEl ?? '',
        bodyDe: b.bodyDe ?? '',
        imageUrl: b.imageUrl || null,
        published: b.published ?? true,
      },
    });
    created(res, post);
  } catch {
    serverError(res);
  }
}

/** PUT /api/posts/:id — admin, edit (also works on auto-posts). */
export async function updatePost(req: AuthRequest, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) { badRequest(res, 'Validation failed', errors.array()); return; }

  const id = req.params['id'] as string;
  const b = req.body as PostBody;
  try {
    const post = await prisma.post.findUnique({ where: { id } });
    if (!post) { notFound(res); return; }

    const updated = await prisma.post.update({
      where: { id },
      data: {
        ...(b.type !== undefined && (POST_TYPES as readonly string[]).includes(b.type) ? { type: b.type } : {}),
        ...(b.titleEn !== undefined ? { titleEn: b.titleEn } : {}),
        ...(b.titleEl !== undefined ? { titleEl: b.titleEl } : {}),
        ...(b.titleDe !== undefined ? { titleDe: b.titleDe } : {}),
        ...(b.bodyEn !== undefined ? { bodyEn: b.bodyEn } : {}),
        ...(b.bodyEl !== undefined ? { bodyEl: b.bodyEl } : {}),
        ...(b.bodyDe !== undefined ? { bodyDe: b.bodyDe } : {}),
        ...(b.imageUrl !== undefined ? { imageUrl: b.imageUrl || null } : {}),
        ...(b.published !== undefined ? { published: b.published } : {}),
      },
    });
    ok(res, updated);
  } catch {
    serverError(res);
  }
}

/** DELETE /api/posts/:id — admin. */
export async function deletePost(req: AuthRequest, res: Response) {
  const id = req.params['id'] as string;
  try {
    const post = await prisma.post.findUnique({ where: { id } });
    if (!post) { notFound(res); return; }
    await prisma.post.delete({ where: { id } });
    ok(res, null, 'Post deleted');
  } catch {
    serverError(res);
  }
}
