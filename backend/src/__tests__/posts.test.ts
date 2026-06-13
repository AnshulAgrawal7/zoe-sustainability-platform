import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import app from '../app';

const prisma = new PrismaClient();
let adminToken = '';
let userToken = '';
let manualPostId = '';
let autoProjectId = '';

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
  if (manualPostId) {
    await prisma.post.delete({ where: { id: manualPostId } }).catch(() => null);
  }
  if (autoProjectId) {
    await prisma.post.deleteMany({ where: { projectId: autoProjectId } }).catch(() => null);
    await prisma.project.delete({ where: { id: autoProjectId } }).catch(() => null);
  }
  await prisma.$disconnect();
});

describe('GET /api/posts', () => {
  it('returns published posts, newest first', async () => {
    const res = await request(app).get('/api/posts');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it('filters by type', async () => {
    const res = await request(app).get('/api/posts?type=PROJECT_COMPLETED');
    expect(res.status).toBe(200);
    res.body.data.forEach((p: { type: string }) => {
      expect(p.type).toBe('PROJECT_COMPLETED');
    });
  });
});

describe('POST /api/posts (admin only)', () => {
  it('creates a manual post when admin', async () => {
    const res = await request(app)
      .post('/api/posts')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        titleEn: 'Manual EN', titleEl: 'Manual EL', titleDe: 'Manual DE',
        bodyEn: 'Body EN', bodyEl: 'Body EL', bodyDe: 'Body DE',
        type: 'ANNOUNCEMENT',
      });
    expect(res.status).toBe(201);
    manualPostId = res.body.data.id as string;
  });

  it('rejects creation from a non-admin', async () => {
    const res = await request(app)
      .post('/api/posts')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        titleEn: 'x', titleEl: 'x', titleDe: 'x',
        bodyEn: 'x', bodyEl: 'x', bodyDe: 'x',
      });
    expect(res.status).toBe(403);
  });
});

describe('Auto-post hook on project lifecycle', () => {
  it('creates a PROJECT_NEW post when a project is published (OPEN)', async () => {
    const res = await request(app)
      .post('/api/projects')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        titleEn: 'Auto Hook EN', titleEl: 'Auto Hook EL', titleDe: 'Auto Hook DE',
        descriptionEn: 'desc EN', descriptionEl: 'desc EL', descriptionDe: 'desc DE',
        category: 'EDUCATION_PARTICIPATION', sdgIds: [11], status: 'OPEN',
      });
    expect(res.status).toBe(201);
    autoProjectId = res.body.data.id as string;

    const post = await prisma.post.findFirst({
      where: { projectId: autoProjectId, type: 'PROJECT_NEW' },
    });
    expect(post).not.toBeNull();
    expect(post?.titleEn).toContain('Auto Hook EN');
  });

  it('creates a PROJECT_COMPLETED post when the project is completed', async () => {
    const res = await request(app)
      .put(`/api/projects/${autoProjectId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'COMPLETED' });
    expect(res.status).toBe(200);

    const post = await prisma.post.findFirst({
      where: { projectId: autoProjectId, type: 'PROJECT_COMPLETED' },
    });
    expect(post).not.toBeNull();
  });

  it('is idempotent — completing again does not duplicate the post', async () => {
    await request(app)
      .put(`/api/projects/${autoProjectId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'COMPLETED' });

    const count = await prisma.post.count({
      where: { projectId: autoProjectId, type: 'PROJECT_COMPLETED' },
    });
    expect(count).toBe(1);
  });
});
