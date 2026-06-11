import type { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { PrismaClient, Prisma } from '@prisma/client';
import type { Post } from '@prisma/client';
import { ok, badRequest, notFound, serverError } from '../utils/response';
import { deleteImages } from '../services/storage';

const prisma = new PrismaClient();

type Locale = 'el' | 'de' | 'en';
const LOCALES: Locale[] = ['el', 'de', 'en'];

interface FeedImage {
  url: string;
  alt: string | null;
  width: number | null;
  height: number | null;
}

// Common display shape — FeedPost (imported) and the existing project Post are
// both adapted to this so the public feed is one chronological stream.
interface FeedItem {
  id: string;
  source: 'feed' | 'project';
  category: string; // PostCategory | 'PROJECT_UPDATE'
  eventStatus: 'UPCOMING' | 'COMPLETED' | null;
  date: string; // ISO; sort key
  title: string;
  excerpt: string;
  images: FeedImage[];
  needsReview: boolean;
}

// Detail shape — like FeedItem but carries the FULL body instead of an excerpt.
interface FeedDetail {
  id: string;
  source: 'feed' | 'project';
  category: string;
  eventStatus: 'UPCOMING' | 'COMPLETED' | null;
  date: string;
  title: string;
  body: string;
  images: FeedImage[];
  needsReview: boolean;
}

function excerpt(body: string, n = 240): string {
  const clean = body.replace(/\s+/g, ' ').trim();
  return clean.length > n ? `${clean.slice(0, n).trimEnd()}…` : clean;
}

// Resolve an image's alt text to the active locale (fallback: EN, then ""). An
// empty string is a valid, intentional value (decorative image).
function pickAlt(
  altTexts: { locale: string; text: string }[],
  locale: Locale
): string {
  const a =
    altTexts.find((x) => x.locale === locale) ??
    altTexts.find((x) => x.locale === 'en');
  return a?.text ?? '';
}

// One Prisma include reused by the list (findMany) and the detail (findUnique)
// so both resolve images + alt texts identically.
const feedPostInclude = {
  translations: true,
  images: { orderBy: { order: 'asc' as const }, include: { altTexts: true } },
} satisfies Prisma.FeedPostInclude;

type FeedPostWithRelations = Prisma.FeedPostGetPayload<{
  include: typeof feedPostInclude;
}>;

// Resolved parts shared by both endpoints (full body; the list excerpts it).
interface FeedParts {
  category: string;
  eventStatus: 'UPCOMING' | 'COMPLETED' | null;
  date: string;
  title: string;
  body: string;
  images: FeedImage[];
  needsReview: boolean;
}

function feedPostParts(fp: FeedPostWithRelations, locale: Locale): FeedParts {
  const tr =
    fp.translations.find((t) => t.locale === locale) ??
    fp.translations.find((t) => t.locale === 'el') ??
    fp.translations[0];
  return {
    category: fp.category,
    eventStatus: fp.eventStatus,
    date: fp.publishedAt.toISOString(),
    title: tr?.title ?? '',
    body: tr?.body ?? '',
    images: fp.images.map((im) => ({
      url: im.publicUrl,
      alt: pickAlt(im.altTexts, locale),
      width: im.width,
      height: im.height,
    })),
    needsReview: fp.needsReview,
  };
}

function projectPostParts(p: Post, locale: Locale): FeedParts {
  const title =
    locale === 'de' ? p.titleDe : locale === 'en' ? p.titleEn : p.titleEl;
  const body = locale === 'de' ? p.bodyDe : locale === 'en' ? p.bodyEn : p.bodyEl;
  return {
    category: 'PROJECT_UPDATE',
    eventStatus: null,
    date: p.createdAt.toISOString(),
    title,
    body,
    images: p.imageUrl
      ? [{ url: p.imageUrl, alt: null, width: null, height: null }]
      : [],
    needsReview: false,
  };
}

function toListItem(
  id: string,
  source: 'feed' | 'project',
  p: FeedParts
): FeedItem {
  return {
    id,
    source,
    category: p.category,
    eventStatus: p.eventStatus,
    date: p.date,
    title: p.title,
    excerpt: excerpt(p.body),
    images: p.images,
    needsReview: p.needsReview,
  };
}

function toDetail(
  id: string,
  source: 'feed' | 'project',
  p: FeedParts
): FeedDetail {
  return {
    id,
    source,
    category: p.category,
    eventStatus: p.eventStatus,
    date: p.date,
    title: p.title,
    body: p.body,
    images: p.images,
    needsReview: p.needsReview,
  };
}

// GET /api/feed?locale=el|de|en — public. Merged feed, newest first. Text is
// resolved to the requested locale with an EL fallback (the imported posts'
// source language).
export async function getFeed(req: Request, res: Response) {
  const q = (req.query['locale'] as string) || 'el';
  const locale: Locale = LOCALES.includes(q as Locale) ? (q as Locale) : 'el';

  try {
    const [feedPosts, projectPosts] = await Promise.all([
      prisma.feedPost.findMany({ include: feedPostInclude }),
      prisma.post.findMany({
        where: { published: true },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    const items: FeedItem[] = [
      ...feedPosts.map((fp) =>
        toListItem(fp.id, 'feed', feedPostParts(fp, locale))
      ),
      ...projectPosts.map((p) =>
        toListItem(p.id, 'project', projectPostParts(p, locale))
      ),
    ];

    // Newest first (ISO strings sort chronologically).
    items.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));

    ok(res, { items, total: items.length });
  } catch {
    serverError(res);
  }
}

// GET /api/feed/:source/:id?locale=… — public. One entry (FULL body) from either
// source. 404 if the id does not exist (or the project post is unpublished).
export async function getFeedItem(req: Request, res: Response) {
  const source = req.params['source'];
  const id = req.params['id'] as string;
  const q = (req.query['locale'] as string) || 'el';
  const locale: Locale = LOCALES.includes(q as Locale) ? (q as Locale) : 'el';

  try {
    if (source === 'feed') {
      const fp = await prisma.feedPost.findUnique({
        where: { id },
        include: feedPostInclude,
      });
      if (!fp) {
        notFound(res);
        return;
      }
      ok(res, toDetail(fp.id, 'feed', feedPostParts(fp, locale)));
      return;
    }
    if (source === 'project') {
      const p = await prisma.post.findFirst({ where: { id, published: true } });
      if (!p) {
        notFound(res);
        return;
      }
      ok(res, toDetail(p.id, 'project', projectPostParts(p, locale)));
      return;
    }
    badRequest(res, 'Invalid source (expected "feed" or "project")');
  } catch {
    serverError(res);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Admin (adminOnly via the admin router)
// ─────────────────────────────────────────────────────────────────────────────

const adminInclude = {
  translations: true,
  images: {
    orderBy: { order: 'asc' as const },
    include: { altTexts: true },
  },
};

// GET /api/admin/feed — all feed posts with every translation + image.
export async function adminListFeed(_req: Request, res: Response) {
  try {
    const posts = await prisma.feedPost.findMany({
      orderBy: { publishedAt: 'desc' },
      include: adminInclude,
    });
    ok(res, { posts, total: posts.length });
  } catch {
    serverError(res);
  }
}

// GET /api/admin/feed/:id
export async function adminGetFeed(req: Request, res: Response) {
  const id = req.params['id'] as string;
  try {
    const post = await prisma.feedPost.findUnique({
      where: { id },
      include: adminInclude,
    });
    if (!post) {
      notFound(res);
      return;
    }
    ok(res, post);
  } catch {
    serverError(res);
  }
}

interface UpdateFeedBody {
  category?: 'ANNOUNCEMENT' | 'EVENT' | 'PROJECT' | 'NEWS';
  eventStatus?: 'UPCOMING' | 'COMPLETED' | null;
  needsReview?: boolean;
  translations?: { locale: string; title: string; body: string }[];
}

// PATCH /api/admin/feed/:id — fields + translations (title/body per locale).
export async function adminUpdateFeed(req: Request, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    badRequest(res, 'Validation failed', errors.array());
    return;
  }
  const id = req.params['id'] as string;
  const body = req.body as UpdateFeedBody;
  try {
    const existing = await prisma.feedPost.findUnique({ where: { id } });
    if (!existing) {
      notFound(res);
      return;
    }
    await prisma.feedPost.update({
      where: { id },
      data: {
        ...(body.category !== undefined ? { category: body.category } : {}),
        ...(body.eventStatus !== undefined ? { eventStatus: body.eventStatus } : {}),
        ...(body.needsReview !== undefined ? { needsReview: body.needsReview } : {}),
      },
    });
    if (Array.isArray(body.translations)) {
      for (const tr of body.translations) {
        if (!['el', 'de', 'en'].includes(tr.locale)) continue;
        await prisma.feedPostTranslation.upsert({
          where: { postId_locale: { postId: id, locale: tr.locale } },
          update: { title: tr.title, body: tr.body },
          create: {
            postId: id,
            locale: tr.locale,
            title: tr.title,
            body: tr.body,
            isMachineTranslated: tr.locale !== 'el',
          },
        });
      }
    }
    const updated = await prisma.feedPost.findUnique({
      where: { id },
      include: adminInclude,
    });
    ok(res, updated);
  } catch {
    serverError(res);
  }
}

// DELETE /api/admin/feed/:id — removes bucket images, then the post (cascade).
export async function adminDeleteFeed(req: Request, res: Response) {
  const id = req.params['id'] as string;
  try {
    const post = await prisma.feedPost.findUnique({
      where: { id },
      include: { images: true },
    });
    if (!post) {
      notFound(res);
      return;
    }
    await deleteImages(post.images.map((im) => im.storagePath)).catch(() => null);
    await prisma.feedPost.delete({ where: { id } });
    ok(res, null, 'Feed post deleted');
  } catch {
    serverError(res);
  }
}

// PATCH /api/admin/feed/images/:imageId — trilingual alt texts and/or order.
export async function adminUpdateImage(req: Request, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    badRequest(res, 'Validation failed', errors.array());
    return;
  }
  const imageId = req.params['imageId'] as string;
  const { altTexts, order } = req.body as {
    altTexts?: { locale: string; text: string; needsReview?: boolean }[];
    order?: number;
  };
  try {
    const existing = await prisma.feedPostImage.findUnique({ where: { id: imageId } });
    if (!existing) {
      notFound(res);
      return;
    }
    if (order !== undefined) {
      await prisma.feedPostImage.update({ where: { id: imageId }, data: { order } });
    }
    if (Array.isArray(altTexts)) {
      for (const at of altTexts) {
        if (!['el', 'de', 'en'].includes(at.locale)) continue;
        await prisma.feedPostImageAltText.upsert({
          where: { imageId_locale: { imageId, locale: at.locale } },
          update: {
            text: at.text,
            ...(at.needsReview !== undefined ? { needsReview: at.needsReview } : {}),
          },
          create: {
            imageId,
            locale: at.locale,
            text: at.text,
            needsReview: at.needsReview ?? true,
          },
        });
      }
    }
    const updated = await prisma.feedPostImage.findUnique({
      where: { id: imageId },
      include: { altTexts: true },
    });
    ok(res, updated);
  } catch {
    serverError(res);
  }
}

// DELETE /api/admin/feed/images/:imageId — removes the object + the row.
export async function adminDeleteImage(req: Request, res: Response) {
  const imageId = req.params['imageId'] as string;
  try {
    const img = await prisma.feedPostImage.findUnique({ where: { id: imageId } });
    if (!img) {
      notFound(res);
      return;
    }
    await deleteImages([img.storagePath]).catch(() => null);
    await prisma.feedPostImage.delete({ where: { id: imageId } });
    ok(res, null, 'Image deleted');
  } catch {
    serverError(res);
  }
}

// PATCH /api/admin/feed/:id/reorder — set image order from an ordered id list.
export async function adminReorderImages(req: Request, res: Response) {
  const id = req.params['id'] as string;
  const { ids } = req.body as { ids: string[] };
  if (!Array.isArray(ids)) {
    badRequest(res, 'ids must be an array');
    return;
  }
  try {
    await prisma.$transaction(
      ids.map((imgId, idx) =>
        prisma.feedPostImage.update({
          where: { id: imgId },
          data: { order: idx },
        })
      )
    );
    const images = await prisma.feedPostImage.findMany({
      where: { postId: id },
      orderBy: { order: 'asc' },
    });
    ok(res, { images });
  } catch {
    serverError(res);
  }
}
