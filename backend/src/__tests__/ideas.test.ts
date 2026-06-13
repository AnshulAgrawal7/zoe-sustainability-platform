import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import app from '../app';

const prisma = new PrismaClient();
let adminToken = '';
let userToken = '';
let targetId = '';
const createdIds: string[] = [];

beforeAll(async () => {
  const adminRes = await request(app)
    .post('/api/auth/login')
    .send({ email: 'admin@zoe-corfu.gr', password: 'ZoeAdmin2026!' });
  adminToken = adminRes.body?.data?.accessToken ?? '';

  const userRes = await request(app)
    .post('/api/auth/login')
    .send({ email: 'citizen1@example.com', password: 'Test1234!' });
  userToken = userRes.body?.data?.accessToken ?? '';
});

afterAll(async () => {
  if (createdIds.length) {
    await prisma.idea
      .deleteMany({ where: { id: { in: createdIds } } })
      .catch(() => null);
  }
  await prisma.$disconnect();
});

describe('POST /api/ideas (public, no login required)', () => {
  it('accepts an anonymous submission and stores it with userId = null', async () => {
    const res = await request(app).post('/api/ideas').send({
      title: 'Test idea (anonymous)',
      description: 'More recycling bins at the harbour.',
      category: 'NATURAL_MONUMENTS',
    });
    expect(res.status).toBe(201);
    expect(res.body.data.status).toBe('NEW');
    targetId = res.body.data.id as string;
    createdIds.push(targetId);

    const idea = await prisma.idea.findUnique({ where: { id: targetId } });
    expect(idea?.userId).toBeNull();
  });

  it('links the userId when a valid token is sent', async () => {
    const res = await request(app)
      .post('/api/ideas')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        title: 'Test idea (logged in)',
        description: 'Linked to my account.',
        category: 'EDUCATION_PARTICIPATION',
      });
    expect(res.status).toBe(201);
    const id = res.body.data.id as string;
    createdIds.push(id);

    const idea = await prisma.idea.findUnique({ where: { id } });
    expect(idea?.userId).not.toBeNull();
  });

  it('rejects a submission missing required fields', async () => {
    const res = await request(app)
      .post('/api/ideas')
      .send({ description: 'no title', category: 'NATURAL_MONUMENTS' });
    expect(res.status).toBe(400);
  });

  it('rejects an invalid category', async () => {
    const res = await request(app)
      .post('/api/ideas')
      .send({ title: 't', description: 'd', category: 'NOPE' });
    expect(res.status).toBe(400);
  });
});

describe('GET /api/admin/ideas (admin only)', () => {
  it('rejects unauthenticated requests', async () => {
    const res = await request(app).get('/api/admin/ideas');
    expect(res.status).toBe(401);
  });

  it('rejects a non-admin user', async () => {
    const res = await request(app)
      .get('/api/admin/ideas')
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.status).toBe(403);
  });

  it('returns the list for an admin', async () => {
    const res = await request(app)
      .get('/api/admin/ideas')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data.ideas)).toBe(true);
    expect(res.body.data.ideas.length).toBeGreaterThan(0);
  });

  it('filters by status', async () => {
    const res = await request(app)
      .get('/api/admin/ideas?status=NEW')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    res.body.data.ideas.forEach((i: { status: string }) => {
      expect(i.status).toBe('NEW');
    });
  });
});

describe('PATCH /api/admin/ideas/:id (admin only)', () => {
  it('updates the status', async () => {
    const res = await request(app)
      .patch(`/api/admin/ideas/${targetId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'ACCEPTED' });
    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe('ACCEPTED');
  });

  it('rejects an invalid status value', async () => {
    const res = await request(app)
      .patch(`/api/admin/ideas/${targetId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'BOGUS' });
    expect(res.status).toBe(400);
  });

  it('rejects a non-admin user', async () => {
    const res = await request(app)
      .patch(`/api/admin/ideas/${targetId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ status: 'NEW' });
    expect(res.status).toBe(403);
  });
});

describe('GET /api/ideas/public (public board, no login)', () => {
  it('returns only ACCEPTED ideas and never exposes personal fields', async () => {
    // A NEW (unapproved) idea with personal data — must NOT be public.
    const newRes = await request(app).post('/api/ideas').send({
      title: 'Hidden until approved',
      description: 'Should not be public yet.',
      category: 'NATURAL_MONUMENTS',
      submitterName: 'Jane Doe',
      submitterEmail: 'jane@example.com',
    });
    const hiddenId = newRes.body.data.id as string;
    createdIds.push(hiddenId);

    const res = await request(app).get('/api/ideas/public');
    expect(res.status).toBe(200);
    const ideas = res.body.data.ideas as Array<Record<string, unknown>>;
    expect(Array.isArray(ideas)).toBe(true);
    expect(ideas.length).toBeGreaterThan(0); // seed has ACCEPTED demo ideas
    for (const idea of ideas) {
      expect(idea['status']).toBe('ACCEPTED');
      expect(idea).not.toHaveProperty('submitterName');
      expect(idea).not.toHaveProperty('submitterEmail');
      expect(idea).not.toHaveProperty('userId');
    }
    expect(ideas.some((i) => i['id'] === hiddenId)).toBe(false);
  });

  it('filters by category', async () => {
    const res = await request(app).get('/api/ideas/public?category=MOBILITY');
    expect(res.status).toBe(200);
    (res.body.data.ideas as Array<{ category: string }>).forEach((i) => {
      expect(i.category).toBe('MOBILITY');
    });
  });
});
