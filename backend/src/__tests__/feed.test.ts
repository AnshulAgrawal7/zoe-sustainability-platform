import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import app from '../app';

const prisma = new PrismaClient();
let feedPostId = '';

beforeAll(async () => {
  const post = await prisma.feedPost.create({
    data: {
      category: 'EVENT',
      eventStatus: 'COMPLETED',
      publishedAt: new Date('2026-06-10T00:00:00Z'),
      sourceFolder: 'test-feed-1',
      needsReview: true,
      translations: {
        create: [
          { locale: 'el', title: 'EL τίτλος', body: 'EL σώμα', isMachineTranslated: false },
          { locale: 'de', title: 'DE Titel', body: 'DE Text', isMachineTranslated: true },
          { locale: 'en', title: 'EN title', body: 'EN body', isMachineTranslated: true },
        ],
      },
      images: {
        create: [
          { storagePath: 'posts/test/a.jpg', publicUrl: 'https://x/a.jpg', order: 0, width: 800, height: 600 },
        ],
      },
    },
  });
  feedPostId = post.id;
});

afterAll(async () => {
  await prisma.feedPost.delete({ where: { id: feedPostId } }).catch(() => null);
  await prisma.$disconnect();
});

describe('GET /api/feed (merged What’s New feed)', () => {
  it('merges FeedPost + project Post, newest first, locale-resolved', async () => {
    const res = await request(app).get('/api/feed?locale=de');
    expect(res.status).toBe(200);
    const items = res.body.data.items as Array<Record<string, unknown>>;
    expect(items.length).toBeGreaterThan(0);

    // the imported FeedPost is present, resolved to German, with its image
    const feed = items.find((i) => i['id'] === feedPostId)!;
    expect(feed['source']).toBe('feed');
    expect(feed['category']).toBe('EVENT');
    expect(feed['eventStatus']).toBe('COMPLETED');
    expect(feed['title']).toBe('DE Titel');
    expect((feed['images'] as unknown[]).length).toBe(1);

    // existing project posts are merged in as a neutral category (not filtered out)
    const project = items.find((i) => i['source'] === 'project');
    expect(project?.['category']).toBe('PROJECT_UPDATE');

    // newest first (ISO date strings sorted desc)
    const dates = items.map((i) => i['date'] as string);
    const sorted = [...dates].sort((a, b) => (a < b ? 1 : -1));
    expect(dates).toEqual(sorted);
  });

  it('falls back to EL when the requested locale is unknown', async () => {
    const res = await request(app).get('/api/feed?locale=fr');
    expect(res.status).toBe(200);
    const feed = (res.body.data.items as Array<Record<string, unknown>>).find(
      (i) => i['id'] === feedPostId
    )!;
    expect(feed['title']).toBe('EL τίτλος');
  });
});
