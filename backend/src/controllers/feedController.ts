import type { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { ok, serverError } from '../utils/response';

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

function excerpt(body: string, n = 240): string {
  const clean = body.replace(/\s+/g, ' ').trim();
  return clean.length > n ? `${clean.slice(0, n).trimEnd()}…` : clean;
}

// GET /api/feed?locale=el|de|en — public. Merged feed, newest first. Text is
// resolved to the requested locale with an EL fallback (the imported posts'
// source language).
export async function getFeed(req: Request, res: Response) {
  const q = (req.query['locale'] as string) || 'el';
  const locale: Locale = LOCALES.includes(q as Locale) ? (q as Locale) : 'el';

  try {
    const [feedPosts, projectPosts] = await Promise.all([
      prisma.feedPost.findMany({
        include: {
          translations: true,
          images: { orderBy: { order: 'asc' } },
        },
      }),
      prisma.post.findMany({
        where: { published: true },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    const items: FeedItem[] = [];

    for (const fp of feedPosts) {
      const tr =
        fp.translations.find((t) => t.locale === locale) ??
        fp.translations.find((t) => t.locale === 'el') ??
        fp.translations[0];
      items.push({
        id: fp.id,
        source: 'feed',
        category: fp.category,
        eventStatus: fp.eventStatus,
        date: fp.publishedAt.toISOString(),
        title: tr?.title ?? '',
        excerpt: excerpt(tr?.body ?? ''),
        images: fp.images.map((im) => ({
          url: im.publicUrl,
          alt: im.altText,
          width: im.width,
          height: im.height,
        })),
        needsReview: fp.needsReview,
      });
    }

    for (const p of projectPosts) {
      const title = locale === 'de' ? p.titleDe : locale === 'en' ? p.titleEn : p.titleEl;
      const body = locale === 'de' ? p.bodyDe : locale === 'en' ? p.bodyEn : p.bodyEl;
      items.push({
        id: p.id,
        source: 'project',
        category: 'PROJECT_UPDATE',
        eventStatus: null,
        date: p.createdAt.toISOString(),
        title,
        excerpt: excerpt(body),
        images: p.imageUrl
          ? [{ url: p.imageUrl, alt: null, width: null, height: null }]
          : [],
        needsReview: false,
      });
    }

    // Newest first (ISO strings sort chronologically).
    items.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));

    ok(res, { items, total: items.length });
  } catch {
    serverError(res);
  }
}
