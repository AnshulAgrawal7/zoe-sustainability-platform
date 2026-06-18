import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import app from '../app';
import { generateToken, verifyToken } from '../utils/totp';

const prisma = new PrismaClient();
const email = '2fa@test.zoe';
const password = 'TwoFactor1!';
let token = '';

beforeAll(async () => {
  await prisma.refreshToken.deleteMany({ where: { user: { email } } }).catch(() => null);
  await prisma.userBadge.deleteMany({ where: { user: { email } } }).catch(() => null);
  await prisma.user.deleteMany({ where: { email } }).catch(() => null);
  const reg = await request(app)
    .post('/api/auth/register')
    .send({ email, password, name: '2FA User', consent: true });
  token = reg.body.data.accessToken as string;
});

afterAll(async () => {
  await prisma.refreshToken.deleteMany({ where: { user: { email } } }).catch(() => null);
  await prisma.userBadge.deleteMany({ where: { user: { email } } }).catch(() => null);
  await prisma.user.deleteMany({ where: { email } }).catch(() => null);
  await prisma.$disconnect();
});

describe('TOTP util (RFC 6238)', () => {
  it('round-trips: a freshly generated token verifies, a wrong one does not', () => {
    const secret = 'JBSWY3DPEHPK3PXP';
    const code = generateToken(secret);
    expect(verifyToken(secret, code)).toBe(true);
    expect(verifyToken(secret, '000000')).toBe(false);
  });
});

describe('Two-factor auth lifecycle (Future_Work §2.5)', () => {
  let backupCodes: string[] = [];

  it('setup returns a secret + otpauth URL but does not enable yet', async () => {
    const res = await request(app)
      .post('/api/auth/2fa/setup')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.data.secret).toBeTruthy();
    expect(res.body.data.otpauthUrl).toContain('otpauth://totp/');
    const user = await prisma.user.findUnique({ where: { email } });
    expect(user?.twoFactorEnabled).toBe(false);
    expect(user?.twoFactorSecret).toBeTruthy();
  });

  it('rejects enable with a wrong code, accepts a valid TOTP and returns backup codes', async () => {
    const bad = await request(app)
      .post('/api/auth/2fa/enable')
      .set('Authorization', `Bearer ${token}`)
      .send({ token: '000000' });
    expect(bad.status).toBe(400);
    expect(bad.body.error).toBe('INVALID_2FA');

    const user = await prisma.user.findUnique({ where: { email } });
    const code = generateToken(user!.twoFactorSecret!);
    const good = await request(app)
      .post('/api/auth/2fa/enable')
      .set('Authorization', `Bearer ${token}`)
      .send({ token: code });
    expect(good.status).toBe(200);
    backupCodes = good.body.data.backupCodes as string[];
    expect(backupCodes).toHaveLength(10);
  });

  it('login now requires the second factor', async () => {
    const noTotp = await request(app)
      .post('/api/auth/login')
      .send({ email, password });
    expect(noTotp.status).toBe(401);
    expect(noTotp.body.error).toBe('TWO_FACTOR_REQUIRED');

    const wrong = await request(app)
      .post('/api/auth/login')
      .send({ email, password, totp: '111111' });
    expect(wrong.status).toBe(401);
    expect(wrong.body.error).toBe('INVALID_2FA');

    const user = await prisma.user.findUnique({ where: { email } });
    const code = generateToken(user!.twoFactorSecret!);
    const good = await request(app)
      .post('/api/auth/login')
      .send({ email, password, totp: code });
    expect(good.status).toBe(200);
    expect(good.body.data.user.twoFactorEnabled).toBe(true);
  });

  it('accepts a single-use backup code at login and then consumes it', async () => {
    const backup = backupCodes[0]!;
    const first = await request(app)
      .post('/api/auth/login')
      .send({ email, password, totp: backup });
    expect(first.status).toBe(200);

    // The same backup code cannot be reused.
    const reuse = await request(app)
      .post('/api/auth/login')
      .send({ email, password, totp: backup });
    expect(reuse.status).toBe(401);
  });

  it('disables 2FA with a valid code and restores password-only login', async () => {
    const user = await prisma.user.findUnique({ where: { email } });
    const code = generateToken(user!.twoFactorSecret!);
    const off = await request(app)
      .post('/api/auth/2fa/disable')
      .set('Authorization', `Bearer ${token}`)
      .send({ code });
    expect(off.status).toBe(200);

    const login = await request(app)
      .post('/api/auth/login')
      .send({ email, password });
    expect(login.status).toBe(200);
    expect(login.body.data.user.twoFactorEnabled).toBe(false);
  });
});
