import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import app from '../app';

const prisma = new PrismaClient();
let adminToken = '';
let schoolToken = '';
let userToken = '';
let createdSchoolId = '';
let joinUserId = '';

beforeAll(async () => {
  const adminRes = await request(app)
    .post('/api/auth/login')
    .send({ email: 'admin@zoe-corfu.gr', password: 'ZoeAdmin2026!' });
  adminToken = adminRes.body?.data?.accessToken ?? '';

  // Seeded SCHOOL coordinator login.
  const schoolRes = await request(app)
    .post('/api/auth/login')
    .send({ email: 'school1@zoe-corfu.gr', password: 'School2026!' });
  schoolToken = schoolRes.body?.data?.accessToken ?? '';

  // A throwaway user for the join flow (keeps seeded ranking untouched).
  const reg = await request(app)
    .post('/api/auth/register')
    .send({ email: 'jointest@example.com', password: 'Test1234!', name: 'Join Tester', profile: 'STUDENT' });
  userToken = reg.body?.data?.accessToken ?? '';
  joinUserId = reg.body?.data?.user?.id ?? '';
});

afterAll(async () => {
  if (joinUserId) {
    await prisma.refreshToken.deleteMany({ where: { userId: joinUserId } }).catch(() => null);
    await prisma.userBadge.deleteMany({ where: { userId: joinUserId } }).catch(() => null);
    await prisma.user.delete({ where: { id: joinUserId } }).catch(() => null);
  }
  if (createdSchoolId) {
    await prisma.user.deleteMany({ where: { schoolId: createdSchoolId } }).catch(() => null);
    await prisma.school.delete({ where: { id: createdSchoolId } }).catch(() => null);
  }
  await prisma.$disconnect();
});

describe('GET /api/schools', () => {
  it('returns the public school list with member counts', async () => {
    const res = await request(app).get('/api/schools');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThanOrEqual(3);
    const kerkyra = res.body.data.find((s: { name: string }) => s.name === '1ο Γυμνάσιο Κέρκυρας');
    expect(kerkyra.memberCount).toBe(4);
    expect(kerkyra.totalPoints).toBe(590);
    expect(kerkyra.avgPoints).toBe(148); // (210+160+130+90)/4 = 147.5 → 148
  });
});

describe('GET /api/schools/leaderboard', () => {
  it('ranks by average points and flags under-sized schools as unranked', async () => {
    const res = await request(app).get('/api/schools/leaderboard');
    expect(res.status).toBe(200);
    expect(res.body.data.minRankedMembers).toBe(3);

    const schools = res.body.data.schools as {
      name: string; memberCount: number; avgPoints: number; ranked: boolean;
    }[];

    // Lefkimmi (avg ≈ 207) outranks Kerkyra (avg 148) despite fewer members.
    expect(schools[0].name).toBe('Lefkimmi High School');
    expect(schools[0].ranked).toBe(true);

    // Acharavi has only 2 members → not ranked.
    const acharavi = schools.find((s) => s.name === 'Gymnasium Acharavi');
    expect(acharavi?.memberCount).toBe(2);
    expect(acharavi?.ranked).toBe(false);

    // Ranked schools must come before unranked ones.
    const firstUnranked = schools.findIndex((s) => !s.ranked);
    const lastRanked = [...schools].map((s) => s.ranked).lastIndexOf(true);
    if (firstUnranked !== -1) expect(firstUnranked).toBeGreaterThan(lastRanked - 1);
  });
});

describe('POST /api/schools/join', () => {
  it('lets a user join via a valid code (case-insensitive)', async () => {
    const res = await request(app)
      .post('/api/schools/join')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ code: 'kerkyra-7f' });
    expect(res.status).toBe(200);
    expect(res.body.data.code).toBe('KERKYRA-7F');

    const user = await prisma.user.findUnique({ where: { id: joinUserId } });
    expect(user?.schoolId).toBeTruthy();
  });

  it('returns 404 for an unknown code', async () => {
    const res = await request(app)
      .post('/api/schools/join')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ code: 'DOES-NOT-EXIST' });
    expect(res.status).toBe(404);
  });

  it('rejects unauthenticated join', async () => {
    const res = await request(app).post('/api/schools/join').send({ code: 'KERKYRA-7F' });
    expect(res.status).toBe(401);
  });
});

describe('POST /api/admin/schools', () => {
  it('creates a school with a coordinator login and returns credentials once', async () => {
    const res = await request(app)
      .post('/api/admin/schools')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Test Create School',
        code: 'TEST-CREATE-1',
        location: 'Corfu',
        coordinatorEmail: 'coord-test@zoe-corfu.gr',
        coordinatorPassword: 'Coord2026!',
      });
    expect(res.status).toBe(201);
    expect(res.body.data.school.code).toBe('TEST-CREATE-1');
    expect(res.body.data.coordinator.email).toBe('coord-test@zoe-corfu.gr');
    createdSchoolId = res.body.data.school.id as string;
  });

  it('rejects creation from a non-admin', async () => {
    const res = await request(app)
      .post('/api/admin/schools')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ name: 'Hack', code: 'HACK-1' });
    expect(res.status).toBe(403);
  });
});

describe('GET /api/schools/me', () => {
  it('returns the coordinator’s own school with a rank', async () => {
    const res = await request(app)
      .get('/api/schools/me')
      .set('Authorization', `Bearer ${schoolToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data.name).toBe('1ο Γυμνάσιο Κέρκυρας');
    expect(Array.isArray(res.body.data.members)).toBe(true);
    expect(res.body.data.code).toBe('KERKYRA-7F');
  });

  it('forbids non-school users', async () => {
    const res = await request(app)
      .get('/api/schools/me')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(403);
  });
});
