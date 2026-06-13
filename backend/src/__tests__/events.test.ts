import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import app from '../app';

const prisma = new PrismaClient();
let userToken = '';
let adminToken = '';
let createdEventId = '';

const ADMIN_EMAIL = 'admin@zoe-corfu.gr';
const USER_EMAIL = 'citizen1@example.com';
const LINKED_PROJECT = 'proj-marine'; // deterministic seed id

const eventPayload = {
  titleEn: 'Test Cleanup', titleEl: 'Δοκιμαστικός Καθαρισμός', titleDe: 'Test-Reinigung',
  descriptionEn: 'A test event', descriptionEl: 'Δοκιμαστική εκδήλωση', descriptionDe: 'Eine Testveranstaltung',
  date: '2026-10-01T09:00:00.000Z',
  location: 'Test Beach',
  category: 'NATURAL_MONUMENTS',
  rewardPoints: 35,
  capacity: 50,
  projectId: LINKED_PROJECT,
};

beforeAll(async () => {
  const adminRes = await request(app)
    .post('/api/auth/login')
    .send({ email: ADMIN_EMAIL, password: 'ZoeAdmin2026!' });
  adminToken = adminRes.body?.data?.accessToken ?? '';

  const userRes = await request(app)
    .post('/api/auth/login')
    .send({ email: USER_EMAIL, password: 'Test1234!' });
  userToken = userRes.body?.data?.accessToken ?? '';
});

afterAll(async () => {
  if (createdEventId) {
    await prisma.eventRegistration.deleteMany({ where: { eventId: createdEventId } }).catch(() => null);
    await prisma.event.delete({ where: { id: createdEventId } }).catch(() => null);
  }
  await prisma.$disconnect();
});

describe('GET /api/events', () => {
  it('returns the event list without auth', async () => {
    const res = await request(app).get('/api/events');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data.events)).toBe(true);
  });

  it('includes the seeded demo events (migration-safe legacy ids preserved)', async () => {
    const res = await request(app).get('/api/events');
    const ids = res.body.data.events.map((e: { id: string }) => e.id);
    expect(ids).toContain('evt-cleanup-jun25');
  });

  it('filters by projectId', async () => {
    const res = await request(app).get(`/api/events?projectId=${LINKED_PROJECT}`);
    expect(res.status).toBe(200);
    res.body.data.events.forEach((e: { projectId: string }) => {
      expect(e.projectId).toBe(LINKED_PROJECT);
    });
  });
});

describe('POST /api/admin/events (admin only)', () => {
  it('creates an event with a project link when admin', async () => {
    const res = await request(app)
      .post('/api/admin/events')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(eventPayload);
    expect(res.status).toBe(201);
    expect(res.body.data.projectId).toBe(LINKED_PROJECT);
    createdEventId = res.body.data.id as string;
  });

  it('rejects creation from a non-admin', async () => {
    const res = await request(app)
      .post('/api/admin/events')
      .set('Authorization', `Bearer ${userToken}`)
      .send(eventPayload);
    expect(res.status).toBe(403);
  });

  it('rejects unauthenticated creation', async () => {
    const res = await request(app).post('/api/admin/events').send(eventPayload);
    expect(res.status).toBe(401);
  });

  it('rejects an invalid category', async () => {
    const res = await request(app)
      .post('/api/admin/events')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ ...eventPayload, category: 'NOT_A_CATEGORY' });
    expect(res.status).toBe(400);
  });
});

describe('POST /api/events/:id/join', () => {
  it('lets a logged-in user join and awards the event reward points', async () => {
    if (!createdEventId) return;
    const res = await request(app)
      .post(`/api/events/${createdEventId}/join`)
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.status).toBe(201);
    expect(res.body.data.pointsAwarded).toBe(35);
  });

  it('rejects a duplicate join with 409', async () => {
    if (!createdEventId) return;
    const res = await request(app)
      .post(`/api/events/${createdEventId}/join`)
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.status).toBe(409);
  });

  it('rejects an unauthenticated join with 401', async () => {
    if (!createdEventId) return;
    const res = await request(app).post(`/api/events/${createdEventId}/join`);
    expect(res.status).toBe(401);
  });

  it('returns 404 for a non-existent event', async () => {
    const res = await request(app)
      .post('/api/events/does-not-exist/join')
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.status).toBe(404);
  });
});

describe('PATCH/DELETE /api/admin/events/:id', () => {
  it('updates an event when admin', async () => {
    if (!createdEventId) return;
    const res = await request(app)
      .patch(`/api/admin/events/${createdEventId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ location: 'Updated Beach' });
    expect(res.status).toBe(200);
    expect(res.body.data.location).toBe('Updated Beach');
  });

  it('rejects delete from a non-admin', async () => {
    if (!createdEventId) return;
    const res = await request(app)
      .delete(`/api/admin/events/${createdEventId}`)
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.status).toBe(403);
  });
});
