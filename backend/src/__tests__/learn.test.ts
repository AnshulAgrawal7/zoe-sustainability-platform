import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import app from '../app';

const prisma = new PrismaClient();
let adminToken = '';
let userToken = '';
let createdId = '';

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
  if (createdId) {
    await prisma.learningResource
      .delete({ where: { id: createdId } })
      .catch(() => null);
  }
  await prisma.$disconnect();
});

describe('GET /api/learn (public)', () => {
  it('lists seeded learning resources with their linked project', async () => {
    const res = await request(app).get('/api/learn');
    expect(res.status).toBe(200);
    expect(res.body.data.resources.length).toBeGreaterThan(0);
    const marine = (
      res.body.data.resources as Array<{ id: string; project: unknown }>
    ).find((r) => r.id === 'learn-marine');
    expect(marine?.project).toBeTruthy();
  });

  it('filters by projectId', async () => {
    const res = await request(app).get('/api/learn?projectId=proj-marine');
    expect(res.status).toBe(200);
    (res.body.data.resources as Array<{ projectId: string }>).forEach((r) => {
      expect(r.projectId).toBe('proj-marine');
    });
  });

  it('returns a single resource and 404 for a missing one', async () => {
    const ok = await request(app).get('/api/learn/learn-antinioti');
    expect(ok.status).toBe(200);
    expect(ok.body.data.titleEn).toBeTruthy();
    const missing = await request(app).get('/api/learn/nope');
    expect(missing.status).toBe(404);
  });
});

describe('Admin learn CRUD', () => {
  it('rejects unauthenticated create (401) and non-admin (403)', async () => {
    const unauth = await request(app)
      .post('/api/admin/learn')
      .send({ titleEn: 'x' });
    expect(unauth.status).toBe(401);
    const forbidden = await request(app)
      .post('/api/admin/learn')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ titleEn: 'x' });
    expect(forbidden.status).toBe(403);
  });

  it('creates, updates and deletes a resource as admin', async () => {
    const create = await request(app)
      .post('/api/admin/learn')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        titleEn: 'Test resource',
        titleEl: 'Δοκιμή',
        titleDe: 'Test',
        bodyEn: 'Body EN',
        bodyEl: 'Body EL',
        bodyDe: 'Body DE',
        category: 'EDUCATION',
        sdgIds: [4, 17],
        projectId: 'proj-education',
      });
    expect(create.status).toBe(201);
    createdId = create.body.data.id as string;
    expect(create.body.data.sdgIds).toBe('[4,17]');

    const update = await request(app)
      .patch(`/api/admin/learn/${createdId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ titleEn: 'Updated title' });
    expect(update.status).toBe(200);
    expect(update.body.data.titleEn).toBe('Updated title');

    const del = await request(app)
      .delete(`/api/admin/learn/${createdId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(del.status).toBe(200);
    createdId = '';
  });

  it('rejects an invalid category (400) and a non-existent project (400)', async () => {
    const badCat = await request(app)
      .post('/api/admin/learn')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ titleEn: 't', category: 'NOPE' });
    expect(badCat.status).toBe(400);

    const badProject = await request(app)
      .post('/api/admin/learn')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ titleEn: 't', category: 'EDUCATION', projectId: 'ghost' });
    expect(badProject.status).toBe(400);
  });
});
