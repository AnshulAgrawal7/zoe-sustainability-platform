import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import app from '../app';

const prisma = new PrismaClient();
let feedPostId = '';
let imageId = '';
let projectPostId = '';
let adminToken = '';
let userToken = '';

beforeAll(async () => {
  const adminRes = await request(app)
    .post('/api/auth/login')
    .send({ email: 'admin@zoe-corfu.gr', password: 'ZoeAdmin2026!' });
  adminToken = adminRes.body?.data?.accessToken ?? '';
  const userRes = await request(app)
    .post('/api/auth/login')
    .send({ email: 'citizen1@example.com', password: 'Test1234!' });
  userToken = userRes.body?.data?.accessToken ?? '';

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
    include: { images: true },
  });
  feedPostId = post.id;
  imageId = post.images[0]?.id ?? '';

  const project = await prisma.post.create({
    data: {
      type: 'ANNOUNCEMENT',
      titleEn: 'Proj EN',
      titleEl: 'Proj EL',
      titleDe: 'Proj DE',
      bodyEn: 'Full EN body text',
      bodyEl: 'Πλήρες EL κείμενο',
      bodyDe: 'Voller DE Text',
      imageUrl: 'https://x/p.jpg',
      published: true,
    },
  });
  projectPostId = project.id;
});

afterAll(async () => {
  await prisma.feedPost.delete({ where: { id: feedPostId } }).catch(() => null);
  await prisma.post.delete({ where: { id: projectPostId } }).catch(() => null);
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

describe('GET /api/feed/:source/:id (single entry, full body)', () => {
  it('returns a feed post with the FULL body, resolved to the locale', async () => {
    const res = await request(app).get(`/api/feed/feed/${feedPostId}?locale=de`);
    expect(res.status).toBe(200);
    expect(res.body.data.source).toBe('feed');
    expect(res.body.data.title).toBe('DE Titel');
    expect(res.body.data.body).toBe('DE Text'); // full body, not an excerpt
    expect(res.body.data.excerpt).toBeUndefined();
    expect(res.body.data.category).toBe('EVENT');
    expect(res.body.data.eventStatus).toBe('COMPLETED');
    expect((res.body.data.images as unknown[]).length).toBe(1);
  });

  it('falls back to EL for an unknown locale', async () => {
    const res = await request(app).get(`/api/feed/feed/${feedPostId}?locale=fr`);
    expect(res.status).toBe(200);
    expect(res.body.data.body).toBe('EL σώμα');
  });

  it('returns a project post via source=project', async () => {
    const res = await request(app).get(
      `/api/feed/project/${projectPostId}?locale=en`
    );
    expect(res.status).toBe(200);
    expect(res.body.data.source).toBe('project');
    expect(res.body.data.category).toBe('PROJECT_UPDATE');
    expect(res.body.data.title).toBe('Proj EN');
    expect(res.body.data.body).toBe('Full EN body text');
  });

  it('404 for a missing id', async () => {
    const res = await request(app).get('/api/feed/feed/does-not-exist');
    expect(res.status).toBe(404);
  });

  it('400 for an invalid source', async () => {
    const res = await request(app).get(`/api/feed/bogus/${feedPostId}`);
    expect(res.status).toBe(400);
  });
});

describe('Admin feed CRUD', () => {
  it('rejects unauthenticated (401) and non-admin (403)', async () => {
    expect((await request(app).get('/api/admin/feed')).status).toBe(401);
    const forbidden = await request(app)
      .get('/api/admin/feed')
      .set('Authorization', `Bearer ${userToken}`);
    expect(forbidden.status).toBe(403);
  });

  it('updates category, eventStatus and a translation', async () => {
    const res = await request(app)
      .patch(`/api/admin/feed/${feedPostId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        category: 'NEWS',
        eventStatus: null,
        needsReview: false,
        translations: [{ locale: 'de', title: 'DE neu', body: 'DE Text neu' }],
      });
    expect(res.status).toBe(200);
    expect(res.body.data.category).toBe('NEWS');
    expect(res.body.data.eventStatus).toBeNull();
    expect(res.body.data.needsReview).toBe(false);
    const de = (res.body.data.translations as Array<{ locale: string; title: string }>).find(
      (t) => t.locale === 'de'
    );
    expect(de?.title).toBe('DE neu');
  });

  it('updates trilingual image alt texts and reorders images', async () => {
    const alt = await request(app)
      .patch(`/api/admin/feed/images/${imageId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        altTexts: [
          { locale: 'en', text: 'A descriptive alt', needsReview: false },
          { locale: 'de', text: 'Beschreibender Alt-Text' },
        ],
      });
    expect(alt.status).toBe(200);
    const en = (
      alt.body.data.altTexts as Array<{
        locale: string;
        text: string;
        needsReview: boolean;
      }>
    ).find((a) => a.locale === 'en');
    expect(en?.text).toBe('A descriptive alt');
    expect(en?.needsReview).toBe(false);

    const reorder = await request(app)
      .patch(`/api/admin/feed/${feedPostId}/reorder`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ ids: [imageId] });
    expect(reorder.status).toBe(200);
    expect(reorder.body.data.images[0].id).toBe(imageId);
  });

  it('rejects an invalid category (400)', async () => {
    const res = await request(app)
      .patch(`/api/admin/feed/${feedPostId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ category: 'BOGUS' });
    expect(res.status).toBe(400);
  });
});
