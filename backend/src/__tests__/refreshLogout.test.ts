import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import app from '../app';

const prisma = new PrismaClient();
const email = 'refresh@test.zoe';
const password = 'RefreshPass1!';

beforeAll(async () => {
  await prisma.refreshToken.deleteMany({ where: { user: { email } } }).catch(() => null);
  await prisma.userBadge.deleteMany({ where: { user: { email } } }).catch(() => null);
  await prisma.user.deleteMany({ where: { email } }).catch(() => null);
});

afterAll(async () => {
  await prisma.refreshToken.deleteMany({ where: { user: { email } } }).catch(() => null);
  await prisma.userBadge.deleteMany({ where: { user: { email } } }).catch(() => null);
  await prisma.user.deleteMany({ where: { email } }).catch(() => null);
  await prisma.$disconnect();
});

describe('Auth refresh + logout (critical path, Future_Work §11.1)', () => {
  it('issues a new access token + user from the refresh cookie, then invalidates it on logout', async () => {
    // An agent persists the httpOnly refresh cookie across requests.
    const agent = request.agent(app);
    const reg = await agent
      .post('/api/auth/register')
      .send({ email, password, name: 'Refresh User', consent: true });
    expect(reg.status).toBe(201);
    const accessToken = reg.body.data.accessToken as string;

    // The cookie alone restores a full session in one round-trip.
    const refreshed = await agent.post('/api/auth/refresh').send({});
    expect(refreshed.status).toBe(200);
    expect(refreshed.body.data.accessToken).toBeTruthy();
    expect(refreshed.body.data.user.email).toBe(email);

    // The refresh token row exists server-side …
    const before = await prisma.refreshToken.count({ where: { user: { email } } });
    expect(before).toBeGreaterThanOrEqual(1);

    // … logout deletes it (server-side invalidation, not just a cookie clear).
    const out = await agent
      .post('/api/auth/logout')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({});
    expect(out.status).toBe(200);

    // A subsequent refresh now fails (token gone).
    const afterLogout = await agent.post('/api/auth/refresh').send({});
    expect(afterLogout.status).toBe(401);
  });

  it('rejects a refresh with no cookie', async () => {
    const res = await request(app).post('/api/auth/refresh').send({});
    expect(res.status).toBe(401);
  });

  it('rejects a refresh with a garbage cookie', async () => {
    const res = await request(app)
      .post('/api/auth/refresh')
      .set('Cookie', 'refreshToken=not-a-valid-jwt')
      .send({});
    expect(res.status).toBe(401);
  });
});
