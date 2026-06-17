import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import app from '../app';

const prisma = new PrismaClient();

const EMAIL = 'gdpr@test.zoe';
const ADMIN_EMAIL = 'admin@zoe-corfu.gr';
const ADMIN_PASSWORD = 'ZoeAdmin2026!';

let token = '';
let userId = '';
let ideaId = '';
let commentId = '';
let adminToken = '';
let adminId = '';

async function cleanup() {
  await prisma.comment.deleteMany({ where: { user: { email: { contains: '@test.zoe' } } } });
  await prisma.idea.deleteMany({ where: { title: 'GDPR test idea' } });
  await prisma.refreshToken.deleteMany({ where: { user: { email: { contains: '@test.zoe' } } } });
  await prisma.userBadge.deleteMany({ where: { user: { email: { contains: '@test.zoe' } } } });
  await prisma.adminAuditLog.deleteMany({ where: { targetLabel: { contains: '@test.zoe' } } });
  await prisma.user.deleteMany({ where: { email: { contains: '@test.zoe' } } });
}

beforeAll(async () => {
  await cleanup();
  const reg = await request(app)
    .post('/api/auth/register')
    .send({ email: EMAIL, password: 'TestPass1!', name: 'GDPR User', consent: true });
  token = reg.body?.data?.accessToken ?? '';
  userId = reg.body?.data?.user?.id ?? '';

  // Community content (anonymised on deletion) + a personal comment (deleted).
  const idea = await prisma.idea.create({
    data: { title: 'GDPR test idea', description: 'keep me', category: 'ENVIRONMENT', userId },
  });
  ideaId = idea.id;
  const comment = await prisma.comment.create({
    data: { body: 'my comment', ideaId, userId },
  });
  commentId = comment.id;

  const adminRes = await request(app)
    .post('/api/auth/login')
    .send({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD });
  adminToken = adminRes.body?.data?.accessToken ?? '';
  adminId = adminRes.body?.data?.user?.id ?? '';
});

afterAll(async () => {
  await cleanup();
  await prisma.$disconnect();
});

describe('GDPR self-service', () => {
  it('exports all personal data as a JSON attachment', async () => {
    const res = await request(app)
      .get('/api/users/me/export')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.headers['content-disposition']).toContain('attachment');
    expect(res.body.user.email).toBe(EMAIL);
    expect(res.body.ideas.length).toBeGreaterThanOrEqual(1);
  });

  it('deletes the account: anonymises community content, removes personal rows', async () => {
    const res = await request(app)
      .delete('/api/users/me')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);

    expect(await prisma.user.findUnique({ where: { id: userId } })).toBeNull();

    const idea = await prisma.idea.findUnique({ where: { id: ideaId } });
    expect(idea).not.toBeNull();
    expect(idea?.userId).toBeNull(); // kept but anonymised

    expect(await prisma.comment.findUnique({ where: { id: commentId } })).toBeNull();

    const login = await request(app)
      .post('/api/auth/login')
      .send({ email: EMAIL, password: 'TestPass1!' });
    expect(login.status).toBe(401);
  });
});

describe('Admin account deletion', () => {
  it('refuses an admin deleting their own account', async () => {
    const res = await request(app)
      .delete(`/api/admin/users/${adminId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(403);
    expect(res.body.error).toBe('CANNOT_DELETE_SELF');
  });

  it('deletes another user and writes an audit entry', async () => {
    const reg = await request(app)
      .post('/api/auth/register')
      .send({ email: 'gdpradmin@test.zoe', password: 'TestPass1!', name: 'To Delete', consent: true });
    const targetId = reg.body?.data?.user?.id ?? '';

    const res = await request(app)
      .delete(`/api/admin/users/${targetId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(await prisma.user.findUnique({ where: { id: targetId } })).toBeNull();

    const audit = await prisma.adminAuditLog.findFirst({
      where: { action: 'ACCOUNT_DELETE', targetId },
    });
    expect(audit).not.toBeNull();
  });
});
