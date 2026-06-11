import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import app from '../app';

const prisma = new PrismaClient();
let userToken = '';
let adminToken = '';
let testProjectId = '';

const ADMIN_EMAIL = 'admin@zoe-corfu.gr';
const USER_EMAIL = 'citizen1@example.com';

beforeAll(async () => {
  // Login with seeded users
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
  if (testProjectId) {
    await prisma.project.delete({ where: { id: testProjectId } }).catch(() => null);
  }
  await prisma.$disconnect();
});

describe('GET /api/projects', () => {
  it('returns project list without auth', async () => {
    const res = await request(app).get('/api/projects');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data.projects)).toBe(true);
    expect(res.body.data.total).toBeGreaterThan(0);
  });

  it('filters by category', async () => {
    const res = await request(app).get('/api/projects?category=ENVIRONMENT');
    expect(res.status).toBe(200);
    res.body.data.projects.forEach((p: { category: string }) => {
      expect(p.category).toBe('ENVIRONMENT');
    });
  });

  it('respects pagination', async () => {
    const res = await request(app).get('/api/projects?limit=2&page=1');
    expect(res.status).toBe(200);
    expect(res.body.data.projects.length).toBeLessThanOrEqual(2);
  });

  it('hides structural (listed=false) projects from the list but keeps them reachable by id', async () => {
    const list = await request(app).get('/api/projects?status=ALL&limit=50');
    expect(list.status).toBe(200);
    const ids = (list.body.data.projects as { id: string }[]).map((p) => p.id);
    expect(ids).not.toContain('proj-zoe-programme');

    // The umbrella project is still reachable by direct link (event detail links to it).
    const detail = await request(app).get('/api/projects/proj-zoe-programme');
    expect(detail.status).toBe(200);
    expect(detail.body.data.id).toBe('proj-zoe-programme');
    expect(detail.body.data.listed).toBe(false);
  });
});

describe('POST /api/projects (admin only)', () => {
  it('creates a project when admin', async () => {
    const res = await request(app)
      .post('/api/projects')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        titleEn: 'Test Project', titleEl: 'Δοκιμαστικό Έργο', titleDe: 'Testprojekt',
        descriptionEn: 'Test description', descriptionEl: 'Περιγραφή', descriptionDe: 'Beschreibung',
        category: 'COMMUNITY', sdgIds: [11, 17], rewardPoints: 30, location: 'Test Location',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    testProjectId = res.body.data.id as string;
  });

  it('rejects project creation from non-admin', async () => {
    const res = await request(app)
      .post('/api/projects')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        titleEn: 'Hack', titleEl: 'Hack', titleDe: 'Hack',
        descriptionEn: 'x', descriptionEl: 'x', descriptionDe: 'x',
        category: 'COMMUNITY', sdgIds: [11],
      });

    expect(res.status).toBe(403);
  });

  it('rejects unauthenticated project creation', async () => {
    const res = await request(app)
      .post('/api/projects')
      .send({ titleEn: 'Hack', category: 'COMMUNITY', sdgIds: [] });

    expect(res.status).toBe(401);
  });
});

describe('POST /api/projects/:id/participate', () => {
  it('allows a user to participate and returns pointsAwarded', async () => {
    if (!testProjectId) return;
    const res = await request(app)
      .post(`/api/projects/${testProjectId}/participate`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.pointsAwarded).toBe(30);
  });

  it('rejects duplicate participation with 409', async () => {
    if (!testProjectId) return;
    const res = await request(app)
      .post(`/api/projects/${testProjectId}/participate`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(409);
  });

  it('allows withdraw after participating', async () => {
    if (!testProjectId) return;
    const res = await request(app)
      .delete(`/api/projects/${testProjectId}/participate`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(200);
  });

  it('rejects unauthenticated participation', async () => {
    if (!testProjectId) return;
    const res = await request(app)
      .post(`/api/projects/${testProjectId}/participate`);

    expect(res.status).toBe(401);
  });
});
