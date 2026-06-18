import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import app from '../app';
import { clearSentMails, getSentMails } from '../services/mailService';
import { hashToken } from '../utils/tokens';

const prisma = new PrismaClient();
const email = 'verify@test.zoe';
const password = 'VerifyPass1!';
let accessToken = '';

beforeAll(async () => {
  await prisma.user.deleteMany({ where: { email } }).catch(() => null);
  const res = await request(app)
    .post('/api/auth/register')
    .send({ email, password, name: 'Verify User', consent: true });
  accessToken = res.body.data.accessToken as string;
});

afterAll(async () => {
  await prisma.userToken.deleteMany({ where: { user: { email } } }).catch(() => null);
  await prisma.refreshToken.deleteMany({ where: { user: { email } } }).catch(() => null);
  await prisma.user.deleteMany({ where: { email } }).catch(() => null);
  await prisma.$disconnect();
});

beforeEach(() => clearSentMails());

describe('E-mail verification (Future_Work §2.2)', () => {
  it('registration sends a verification mail and the user starts unverified', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'verify2@test.zoe', password, name: 'V2', consent: true });
    expect(res.status).toBe(201);
    expect(res.body.data.user.emailVerified).toBe(false);
    expect(getSentMails().some((m) => m.kind === 'email-verification')).toBe(true);
    const u2 = await prisma.user.findUnique({ where: { email: 'verify2@test.zoe' } });
    if (u2) {
      await prisma.userBadge.deleteMany({ where: { userId: u2.id } });
      await prisma.userToken.deleteMany({ where: { userId: u2.id } });
      await prisma.refreshToken.deleteMany({ where: { userId: u2.id } });
      await prisma.user.delete({ where: { id: u2.id } });
    }
  });

  it('rejects an invalid verification token', async () => {
    const res = await request(app)
      .post('/api/auth/verify-email')
      .send({ token: 'bogus' });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('INVALID_OR_EXPIRED_TOKEN');
  });

  it('verifies the address with a valid token (single use) and reflects it on refresh', async () => {
    const raw = 'known-verify-token';
    const user = await prisma.user.findUniqueOrThrow({ where: { email } });
    await prisma.userToken.create({
      data: {
        userId: user.id,
        type: 'EMAIL_VERIFY',
        tokenHash: hashToken(raw),
        expiresAt: new Date(Date.now() + 60_000),
      },
    });

    const verify = await request(app)
      .post('/api/auth/verify-email')
      .send({ token: raw });
    expect(verify.status).toBe(200);

    const fresh = await prisma.user.findUnique({ where: { email } });
    expect(fresh?.emailVerifiedAt).toBeTruthy();

    // Re-using the same token fails (single use).
    const reuse = await request(app)
      .post('/api/auth/verify-email')
      .send({ token: raw });
    expect(reuse.status).toBe(400);
  });

  it('resend is a no-op (still 200) once already verified', async () => {
    const res = await request(app)
      .post('/api/auth/resend-verification')
      .set('Authorization', `Bearer ${accessToken}`);
    expect(res.status).toBe(200);
    // Already verified above → no new mail.
    expect(getSentMails()).toHaveLength(0);
  });
});
