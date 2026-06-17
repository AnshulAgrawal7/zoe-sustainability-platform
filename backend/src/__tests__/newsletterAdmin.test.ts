import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import app from '../app';

const prisma = new PrismaClient();
let adminToken = '';
let userToken = '';
const testEmail = `nl-admin-${Date.now()}@example.com`;

beforeAll(async () => {
  const adminRes = await request(app)
    .post('/api/auth/login')
    .send({ email: 'admin@zoe-corfu.gr', password: 'ZoeAdmin2026!' });
  adminToken = adminRes.body?.data?.accessToken ?? '';

  const userRes = await request(app)
    .post('/api/auth/login')
    .send({ email: 'citizen1@example.com', password: 'Test1234!' });
  userToken = userRes.body?.data?.accessToken ?? '';
});

afterAll(async () => {
  await prisma.newsletterSignup
    .deleteMany({ where: { email: testEmail } })
    .catch(() => null);
  await prisma.$disconnect();
});

describe('Admin newsletter management', () => {
  it('lists a stored signup and exports it as CSV, then deletes it', async () => {
    // Public opt-in creates the signup.
    await request(app).post('/api/newsletter').send({ email: testEmail, locale: 'de' });

    // Admin can list it.
    const list = await request(app)
      .get('/api/admin/newsletter')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(list.status).toBe(200);
    const row = list.body.data.signups.find(
      (s: { email: string }) => s.email === testEmail
    );
    expect(row).toBeTruthy();
    expect(row.locale).toBe('de');

    // CSV export contains the email.
    const csv = await request(app)
      .get('/api/admin/newsletter/export')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(csv.status).toBe(200);
    expect(csv.headers['content-type']).toContain('text/csv');
    expect(csv.text).toContain('email,locale,createdAt');
    expect(csv.text).toContain(testEmail);

    // Admin can delete it.
    const del = await request(app)
      .delete(`/api/admin/newsletter/${row.id}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(del.status).toBe(200);
    const gone = await prisma.newsletterSignup.findUnique({
      where: { email: testEmail },
    });
    expect(gone).toBeNull();
  });

  it('forbids non-admins from listing signups', async () => {
    const res = await request(app)
      .get('/api/admin/newsletter')
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.status).toBe(403);
  });
});
