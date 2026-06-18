import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import app from '../app';
import { clearSentMails, getSentMails } from '../services/mailService';

const prisma = new PrismaClient();
const ADMIN_EMAIL = 'admin@zoe-corfu.gr';
const ANON_EMAIL = 'anon-report@test.zoe';
let adminToken = '';
const createdIds: string[] = [];

beforeAll(async () => {
  adminToken = (
    await request(app).post('/api/auth/login').send({ email: ADMIN_EMAIL, password: 'ZoeAdmin2026!' })
  ).body?.data?.accessToken;
});

afterAll(async () => {
  await prisma.submission.deleteMany({ where: { id: { in: createdIds } } }).catch(() => null);
  await prisma.$disconnect();
});

beforeEach(() => clearSentMails());

describe('Anonymous submission flow (Future_Work §11.1)', () => {
  it('stores an anonymous report with userId = null', async () => {
    const res = await request(app)
      .post('/api/submissions')
      .send({ type: 'REPORT', message: 'Broken bin near the harbour', submitterEmail: ANON_EMAIL });
    expect(res.status).toBe(201);
    const id = res.body.data.id as string;
    createdIds.push(id);
    const row = await prisma.submission.findUnique({ where: { id } });
    expect(row?.userId).toBeNull();
    expect(row?.submitterEmail).toBe(ANON_EMAIL);
  });

  it('rejects an unknown submission type', async () => {
    const res = await request(app)
      .post('/api/submissions')
      .send({ type: 'NONSENSE', message: 'x' });
    expect(res.status).toBe(400);
  });

  it('shows the submission to admins and lets them resolve it (e-mailing an anonymous submitter)', async () => {
    const create = await request(app)
      .post('/api/submissions')
      .send({ type: 'FEEDBACK', message: 'Love the new events page!', submitterEmail: ANON_EMAIL });
    const id = create.body.data.id as string;
    createdIds.push(id);

    const list = await request(app)
      .get('/api/admin/submissions')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(list.status).toBe(200);
    expect(list.body.data.submissions.some((s: { id: string }) => s.id === id)).toBe(true);

    clearSentMails();
    const patch = await request(app)
      .patch(`/api/admin/submissions/${id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'RESOLVED', message: 'Thanks for the kind words!' });
    expect(patch.status).toBe(200);
    expect(patch.body.data.status).toBe('RESOLVED');

    // Anonymous submitter is notified by e-mail (no in-app bell for guests).
    const mails = getSentMails();
    expect(mails).toHaveLength(1);
    expect(mails[0]?.to).toBe(ANON_EMAIL);
  });

  it('rejects admin submission access without a token', async () => {
    const res = await request(app).get('/api/admin/submissions');
    expect(res.status).toBe(401);
  });
});
