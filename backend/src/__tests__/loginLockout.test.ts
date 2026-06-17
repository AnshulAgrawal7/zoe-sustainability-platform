import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import app from '../app';

const prisma = new PrismaClient();
const email = 'lockout@test.zoe';
const password = 'TestPass1!';

beforeAll(async () => {
  await prisma.user.deleteMany({ where: { email } }).catch(() => null);
  await request(app)
    .post('/api/auth/register')
    .send({ email, password, name: 'Lockout User', consent: true });
});

afterAll(async () => {
  await prisma.refreshToken
    .deleteMany({ where: { user: { email } } })
    .catch(() => null);
  await prisma.user.deleteMany({ where: { email } }).catch(() => null);
  await prisma.$disconnect();
});

describe('Per-account login lockout', () => {
  it('locks the account after repeated failed logins, then blocks even the correct password', async () => {
    // Four wrong attempts are rejected as plain invalid credentials …
    for (let i = 0; i < 4; i++) {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email, password: 'WrongPass9!' });
      expect(res.status).toBe(401);
    }

    // … the fifth crosses the threshold and locks the account.
    const fifth = await request(app)
      .post('/api/auth/login')
      .send({ email, password: 'WrongPass9!' });
    expect(fifth.status).toBe(429);
    expect(fifth.body.error).toBe('ACCOUNT_LOCKED');

    // While locked, even the correct password is refused.
    const correct = await request(app)
      .post('/api/auth/login')
      .send({ email, password });
    expect(correct.status).toBe(429);

    const locked = await prisma.user.findUnique({ where: { email } });
    expect(locked?.lockedUntil).toBeTruthy();
  });

  it('a successful login clears the failure counter', async () => {
    // Manually clear the lock to simulate the window elapsing, leaving a
    // non-zero attempt counter.
    await prisma.user.update({
      where: { email },
      data: { failedLoginAttempts: 2, lockedUntil: null },
    });
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email, password });
    expect(res.status).toBe(200);
    const fresh = await prisma.user.findUnique({ where: { email } });
    expect(fresh?.failedLoginAttempts).toBe(0);
  });
});
