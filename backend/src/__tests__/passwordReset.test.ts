import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import app from '../app';
import { clearSentMails, getSentMails } from '../services/mailService';
import { hashToken } from '../utils/tokens';

const prisma = new PrismaClient();
const email = 'reset@test.zoe';
const oldPassword = 'OldPass1!';
const newPassword = 'BrandNew9!';

beforeAll(async () => {
  await prisma.user.deleteMany({ where: { email } }).catch(() => null);
  await request(app)
    .post('/api/auth/register')
    .send({ email, password: oldPassword, name: 'Reset User', consent: true });
});

afterAll(async () => {
  await prisma.userToken.deleteMany({ where: { user: { email } } }).catch(() => null);
  await prisma.refreshToken.deleteMany({ where: { user: { email } } }).catch(() => null);
  await prisma.user.deleteMany({ where: { email } }).catch(() => null);
  await prisma.$disconnect();
});

beforeEach(() => clearSentMails());

describe('Password reset (Future_Work §2.1)', () => {
  it('forgot-password returns 200 for an unknown address without sending mail (no enumeration)', async () => {
    const res = await request(app)
      .post('/api/auth/forgot-password')
      .send({ email: 'nobody@nowhere.zoe' });
    expect(res.status).toBe(200);
    expect(getSentMails()).toHaveLength(0);
  });

  it('forgot-password issues a single-use token and sends the reset mail', async () => {
    const res = await request(app)
      .post('/api/auth/forgot-password')
      .send({ email });
    expect(res.status).toBe(200);
    const mails = getSentMails();
    expect(mails).toHaveLength(1);
    expect(mails[0]?.kind).toBe('password-reset');
    const token = await prisma.userToken.findFirst({
      where: { user: { email }, type: 'PASSWORD_RESET' },
    });
    expect(token).toBeTruthy();
  });

  it('rejects an invalid token', async () => {
    const res = await request(app)
      .post('/api/auth/reset-password')
      .send({ token: 'not-a-real-token', password: newPassword });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('INVALID_OR_EXPIRED_TOKEN');
  });

  it('resets the password, lets the new one log in, and consumes the token', async () => {
    await request(app).post('/api/auth/forgot-password').send({ email });
    // Re-derive the raw token: the mail link carries it; here we mint a fresh
    // known token directly so the test does not parse the stub mail body.
    const raw = 'integration-known-token';
    await prisma.userToken.create({
      data: {
        userId: (await prisma.user.findUniqueOrThrow({ where: { email } })).id,
        type: 'PASSWORD_RESET',
        tokenHash: hashToken(raw),
        expiresAt: new Date(Date.now() + 60_000),
      },
    });

    const reset = await request(app)
      .post('/api/auth/reset-password')
      .send({ token: raw, password: newPassword });
    expect(reset.status).toBe(200);

    // Old password no longer works, new one does.
    const oldLogin = await request(app)
      .post('/api/auth/login')
      .send({ email, password: oldPassword });
    expect(oldLogin.status).toBe(401);
    const newLogin = await request(app)
      .post('/api/auth/login')
      .send({ email, password: newPassword });
    expect(newLogin.status).toBe(200);

    // The token is single use.
    const reuse = await request(app)
      .post('/api/auth/reset-password')
      .send({ token: raw, password: 'Another1!' });
    expect(reuse.status).toBe(400);
  });
});
