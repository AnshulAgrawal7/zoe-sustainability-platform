import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import app from '../app';
import { clearSentMails, getSentMails } from '../services/mailService';

const prisma = new PrismaClient();
const ADMIN_EMAIL = 'admin@zoe-corfu.gr';
const ADMIN_PASSWORD = 'ZoeAdmin2026!';
const ANON_EMAIL = 'anon-submitter@test.zoe';

let adminToken = '';

beforeAll(async () => {
  const adminRes = await request(app)
    .post('/api/auth/login')
    .send({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD });
  adminToken = adminRes.body?.data?.accessToken ?? '';
});

afterAll(async () => {
  await prisma.idea.deleteMany({ where: { submitterEmail: ANON_EMAIL } });
  await prisma.$disconnect();
});

beforeEach(() => clearSentMails());

describe('Anonymous submitter e-mail on status change (Future_Work §7.2)', () => {
  it('e-mails an anonymous idea submitter when an admin reviews it', async () => {
    // Anonymous idea (no auth header) with a contact e-mail.
    const create = await request(app)
      .post('/api/ideas')
      .send({
        title: 'Solar lights on the promenade',
        description: 'Install solar lamps along the waterfront path.',
        category: 'ENERGY',
        submitterEmail: ANON_EMAIL,
      });
    expect(create.status).toBe(201);
    const ideaId = create.body.data.id as string;

    clearSentMails();
    const review = await request(app)
      .patch(`/api/admin/ideas/${ideaId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'ACCEPTED', message: 'Great idea — added to the board.' });
    expect(review.status).toBe(200);

    const mails = getSentMails();
    expect(mails).toHaveLength(1);
    expect(mails[0]?.to).toBe(ANON_EMAIL);
    expect(mails[0]?.kind).toBe('submission-status');
    expect(mails[0]?.text).toContain('Great idea');
  });

  it('does NOT e-mail when the idea has no submitter address', async () => {
    const create = await request(app)
      .post('/api/ideas')
      .send({
        title: 'No-contact idea',
        description: 'An idea submitted without an e-mail address.',
        category: 'MOBILITY',
      });
    const ideaId = create.body.data.id as string;

    clearSentMails();
    await request(app)
      .patch(`/api/admin/ideas/${ideaId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'DECLINED' });
    expect(getSentMails()).toHaveLength(0);

    await prisma.idea.delete({ where: { id: ideaId } });
  });
});
