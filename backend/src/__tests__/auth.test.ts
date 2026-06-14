import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import app from '../app';

// Use a separate test DB
const prisma = new PrismaClient();

beforeAll(async () => {
  // Clean up test users before suite
  await prisma.refreshToken.deleteMany({ where: { user: { email: { contains: '@test.zoe' } } } });
  await prisma.participation.deleteMany({ where: { user: { email: { contains: '@test.zoe' } } } });
  await prisma.userBadge.deleteMany({ where: { user: { email: { contains: '@test.zoe' } } } });
  await prisma.user.deleteMany({ where: { email: { contains: '@test.zoe' } } });
});

afterAll(async () => {
  await prisma.refreshToken.deleteMany({ where: { user: { email: { contains: '@test.zoe' } } } });
  await prisma.userBadge.deleteMany({ where: { user: { email: { contains: '@test.zoe' } } } });
  await prisma.participation.deleteMany({ where: { user: { email: { contains: '@test.zoe' } } } });
  await prisma.user.deleteMany({ where: { email: { contains: '@test.zoe' } } });
  await prisma.$disconnect();
});

describe('POST /api/auth/register', () => {
  it('creates a new user and returns accessToken', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'new@test.zoe', password: 'TestPass1!', name: 'Test User', language: 'EN' });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.accessToken).toBeDefined();
    expect(res.body.data.user.email).toBe('new@test.zoe');
    expect(res.body.data.user.role).toBe('USER');
    expect(res.body.data.user.password).toBeUndefined(); // never expose hash
  });

  it('rejects duplicate email with 409', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({ email: 'dup@test.zoe', password: 'TestPass1!', name: 'Dup User' });

    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'dup@test.zoe', password: 'TestPass1!', name: 'Dup User' });

    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
  });

  it('rejects short password with 400', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'short@test.zoe', password: '123', name: 'Short' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('rejects invalid email with 400', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'not-an-email', password: 'TestPass1!', name: 'Bad Email' });

    expect(res.status).toBe(400);
  });

  it('rejects a weak password (no special character) with 400', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'weak@test.zoe', password: 'TestPass1', name: 'Weak Pass' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('rejects a duplicate username with 409', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({ email: 'uname1@test.zoe', password: 'TestPass1!', name: 'Name One', username: 'dupname1' });

    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'uname2@test.zoe', password: 'TestPass1!', name: 'Name Two', username: 'dupname1' });

    expect(res.status).toBe(409);
    expect(res.body.error).toBe('USERNAME_TAKEN');
  });
});

describe('POST /api/auth/login', () => {
  it('returns accessToken for valid credentials', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({ email: 'login@test.zoe', password: 'TestPass1!', name: 'Login User' });

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'login@test.zoe', password: 'TestPass1!' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.accessToken).toBeDefined();
  });

  it('returns 401 for wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'login@test.zoe', password: 'WrongPassword!' });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('returns 401 for unknown email', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'nobody@test.zoe', password: 'TestPass1!' });

    expect(res.status).toBe(401);
  });

  it('logs in with a username via identifier', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({ email: 'byuname@test.zoe', password: 'TestPass1!', name: 'By Username', username: 'byunametest' });

    const res = await request(app)
      .post('/api/auth/login')
      .send({ identifier: 'byunametest', password: 'TestPass1!' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.username).toBe('byunametest');
  });
});

describe('GET /api/health', () => {
  it('returns 200 and status ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe('ok');
  });
});
