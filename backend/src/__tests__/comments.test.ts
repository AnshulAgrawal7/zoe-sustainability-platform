import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import app from '../app';

const prisma = new PrismaClient();
let adminToken = '';
let userToken = '';
let commentId = '';
let newIdeaId = '';
const ACCEPTED_IDEA = 'idea-demo-bikeracks'; // seeded ACCEPTED demo idea

beforeAll(async () => {
  const adminRes = await request(app)
    .post('/api/auth/login')
    .send({ email: 'admin@zoe-corfu.gr', password: 'ZoeAdmin2026!' });
  adminToken = adminRes.body?.data?.accessToken ?? '';
  const userRes = await request(app)
    .post('/api/auth/login')
    .send({ email: 'citizen1@example.com', password: 'Test1234!' });
  userToken = userRes.body?.data?.accessToken ?? '';

  // A NEW (unapproved) idea — comments on it must be rejected.
  const ideaRes = await request(app).post('/api/ideas').send({
    title: 'Unapproved idea for comment test',
    description: 'pending',
    category: 'NATURAL_MONUMENTS',
  });
  newIdeaId = ideaRes.body.data.id as string;
});

afterAll(async () => {
  await prisma.commentLike.deleteMany({ where: { commentId } }).catch(() => null);
  await prisma.comment
    .deleteMany({ where: { ideaId: ACCEPTED_IDEA } })
    .catch(() => null);
  await prisma.idea.delete({ where: { id: newIdeaId } }).catch(() => null);
  await prisma.$disconnect();
});

describe('POST /api/ideas/:id/comments', () => {
  it('rejects an unauthenticated request (401)', async () => {
    const res = await request(app)
      .post(`/api/ideas/${ACCEPTED_IDEA}/comments`)
      .send({ body: 'hello' });
    expect(res.status).toBe(401);
  });

  it('rejects an empty body (400)', async () => {
    const res = await request(app)
      .post(`/api/ideas/${ACCEPTED_IDEA}/comments`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ body: '   ' });
    expect(res.status).toBe(400);
  });

  it('rejects a comment on a non-approved idea (403)', async () => {
    const res = await request(app)
      .post(`/api/ideas/${newIdeaId}/comments`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ body: 'should not work' });
    expect(res.status).toBe(403);
  });

  it('creates a comment for a logged-in user (201), no PII exposed', async () => {
    const res = await request(app)
      .post(`/api/ideas/${ACCEPTED_IDEA}/comments`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ body: 'Great idea — count me in!' });
    expect(res.status).toBe(201);
    expect(res.body.data.authorUsername).toBeTruthy();
    expect(res.body.data.likeCount).toBe(0);
    expect(res.body.data.likedByMe).toBe(false);
    expect(res.body.data).not.toHaveProperty('userId');
    commentId = res.body.data.id as string;
  });
});

describe('GET /api/ideas/public/:id (detail + comments)', () => {
  it('returns the approved idea with its visible comment and no PII', async () => {
    const res = await request(app).get(`/api/ideas/public/${ACCEPTED_IDEA}`);
    expect(res.status).toBe(200);
    expect(res.body.data.idea.status).toBe('ACCEPTED');
    expect(res.body.data.idea).not.toHaveProperty('submitterEmail');
    const ids = (res.body.data.comments as Array<{ id: string }>).map(
      (c) => c.id
    );
    expect(ids).toContain(commentId);
  });

  it('404 for a non-approved idea', async () => {
    const res = await request(app).get(`/api/ideas/public/${newIdeaId}`);
    expect(res.status).toBe(404);
  });
});

describe('POST /api/comments/:id/like (toggle)', () => {
  it('likes then unlikes (toggle) for a logged-in user', async () => {
    const like = await request(app)
      .post(`/api/comments/${commentId}/like`)
      .set('Authorization', `Bearer ${userToken}`);
    expect(like.status).toBe(200);
    expect(like.body.data.liked).toBe(true);
    expect(like.body.data.likeCount).toBe(1);

    const unlike = await request(app)
      .post(`/api/comments/${commentId}/like`)
      .set('Authorization', `Bearer ${userToken}`);
    expect(unlike.body.data.liked).toBe(false);
    expect(unlike.body.data.likeCount).toBe(0);
  });

  it('rejects an unauthenticated like (401)', async () => {
    const res = await request(app).post(`/api/comments/${commentId}/like`);
    expect(res.status).toBe(401);
  });

  it('404 for a non-existent comment', async () => {
    const res = await request(app)
      .post('/api/comments/does-not-exist/like')
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.status).toBe(404);
  });
});

describe('Admin comment moderation', () => {
  it('rejects a non-admin (403)', async () => {
    const res = await request(app)
      .get('/api/admin/comments')
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.status).toBe(403);
  });

  it('lists comments for an admin', async () => {
    const res = await request(app)
      .get('/api/admin/comments')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data.comments)).toBe(true);
  });

  it('hiding a comment removes it from the public detail', async () => {
    const patch = await request(app)
      .patch(`/api/admin/comments/${commentId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'HIDDEN' });
    expect(patch.status).toBe(200);

    const detail = await request(app).get(
      `/api/ideas/public/${ACCEPTED_IDEA}`
    );
    const ids = (detail.body.data.comments as Array<{ id: string }>).map(
      (c) => c.id
    );
    expect(ids).not.toContain(commentId);
  });

  it('rejects an invalid status (400)', async () => {
    const res = await request(app)
      .patch(`/api/admin/comments/${commentId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'BOGUS' });
    expect(res.status).toBe(400);
  });
});
