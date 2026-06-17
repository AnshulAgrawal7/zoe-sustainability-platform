import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import app from '../app';

const prisma = new PrismaClient();

const ADMIN_EMAIL = 'admin@zoe-corfu.gr';
const ADMIN_PASSWORD = 'ZoeAdmin2026!';
const TARGET_EMAIL = 'adminmgmt@test.zoe';

let adminToken = '';
let adminId = '';
let targetId = '';

async function cleanup() {
  await prisma.adminAuditLog.deleteMany({ where: { targetLabel: TARGET_EMAIL } });
  await prisma.refreshToken.deleteMany({ where: { user: { email: TARGET_EMAIL } } });
  await prisma.userBadge.deleteMany({ where: { user: { email: TARGET_EMAIL } } });
  await prisma.user.deleteMany({ where: { email: TARGET_EMAIL } });
}

beforeAll(async () => {
  await cleanup();
  const adminRes = await request(app)
    .post('/api/auth/login')
    .send({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD });
  adminToken = adminRes.body?.data?.accessToken ?? '';
  adminId = adminRes.body?.data?.user?.id ?? '';

  const reg = await request(app)
    .post('/api/auth/register')
    .send({ email: TARGET_EMAIL, password: 'TestPass1!', name: 'Admin Mgmt Target', consent: true });
  targetId = reg.body?.data?.user?.id ?? '';
});

afterAll(async () => {
  await cleanup();
  await prisma.$disconnect();
});

describe('Admin user management', () => {
  it('refuses an admin changing their own role', async () => {
    const res = await request(app)
      .put(`/api/admin/users/${adminId}/role`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ role: 'USER' });
    expect(res.status).toBe(403);
    expect(res.body.error).toBe('CANNOT_CHANGE_OWN_ROLE');
  });

  it('promotes a user to ADMIN and writes an audit entry', async () => {
    const res = await request(app)
      .put(`/api/admin/users/${targetId}/role`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ role: 'ADMIN' });
    expect(res.status).toBe(200);
    expect(res.body.data.role).toBe('ADMIN');

    const audit = await prisma.adminAuditLog.findFirst({
      where: { action: 'ROLE_CHANGE', targetId },
    });
    expect(audit).not.toBeNull();

    // Revert for the rest of the suite (two admins exist, so this is allowed).
    await request(app)
      .put(`/api/admin/users/${targetId}/role`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ role: 'USER' });
  });

  it('adjusts points and records the change', async () => {
    const res = await request(app)
      .patch(`/api/admin/users/${targetId}/points`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ points: 250 });
    expect(res.status).toBe(200);
    expect(res.body.data.points).toBe(250);

    const audit = await prisma.adminAuditLog.findFirst({
      where: { action: 'POINTS_ADJUST', targetId },
    });
    expect(audit?.detail).toContain('250');
  });

  it('suspends an account, blocks its login, then reactivates it', async () => {
    const suspend = await request(app)
      .patch(`/api/admin/users/${targetId}/active`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ active: false });
    expect(suspend.status).toBe(200);
    expect(suspend.body.data.active).toBe(false);

    const blocked = await request(app)
      .post('/api/auth/login')
      .send({ email: TARGET_EMAIL, password: 'TestPass1!' });
    expect(blocked.status).toBe(403);
    expect(blocked.body.error).toBe('ACCOUNT_DISABLED');

    const reactivate = await request(app)
      .patch(`/api/admin/users/${targetId}/active`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ active: true });
    expect(reactivate.status).toBe(200);

    const ok = await request(app)
      .post('/api/auth/login')
      .send({ email: TARGET_EMAIL, password: 'TestPass1!' });
    expect(ok.status).toBe(200);
  });

  it('exposes the audit log to admins only', async () => {
    const res = await request(app)
      .get('/api/admin/audit')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);

    const anon = await request(app).get('/api/admin/audit');
    expect(anon.status).toBe(401);
  });
});
