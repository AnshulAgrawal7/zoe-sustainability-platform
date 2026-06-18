import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import app from '../app';
import { clearSentMails, getSentMails } from '../services/mailService';

const prisma = new PrismaClient();
const ADMIN_EMAIL = 'admin@zoe-corfu.gr';
const USER_EMAIL = 'citizen1@example.com';

let adminToken = '';
let userToken = '';
let eventId = '';

const eventPayload = {
  titleEn: 'RSVP Mail Test',
  titleEl: 'Δοκιμή',
  titleDe: 'Test',
  descriptionEn: 'x',
  descriptionEl: 'x',
  descriptionDe: 'x',
  date: '2026-11-01T09:00:00.000Z',
  location: 'Kassiopi',
  category: 'NATURAL_MONUMENTS',
  rewardPoints: 20,
  capacity: 50,
  projectId: 'proj-marine',
};

beforeAll(async () => {
  adminToken = (
    await request(app).post('/api/auth/login').send({ email: ADMIN_EMAIL, password: 'ZoeAdmin2026!' })
  ).body?.data?.accessToken;
  userToken = (
    await request(app).post('/api/auth/login').send({ email: USER_EMAIL, password: 'Test1234!' })
  ).body?.data?.accessToken;
  const created = await request(app)
    .post('/api/admin/events')
    .set('Authorization', `Bearer ${adminToken}`)
    .send(eventPayload);
  eventId = created.body.data.id;
});

afterAll(async () => {
  if (eventId) {
    await prisma.eventRegistration.deleteMany({ where: { eventId } }).catch(() => null);
    await prisma.event.delete({ where: { id: eventId } }).catch(() => null);
  }
  await prisma.$disconnect();
});

beforeEach(() => clearSentMails());

describe('RSVP confirmation e-mail (Future_Work §7.3)', () => {
  it('confirms a guest RSVP by e-mail', async () => {
    const res = await request(app)
      .post(`/api/events/${eventId}/register`)
      .send({ guestName: 'Nikos', guestEmail: 'nikos@example.com', consent: true });
    expect(res.status).toBe(201);
    const mails = getSentMails();
    expect(mails).toHaveLength(1);
    expect(mails[0]?.kind).toBe('rsvp-confirmation');
    expect(mails[0]?.to).toBe('nikos@example.com');
    expect(mails[0]?.text).toContain('RSVP Mail Test');
  });

  it('confirms a logged-in member RSVP to their account address', async () => {
    const res = await request(app)
      .post(`/api/events/${eventId}/join`)
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.status).toBe(201);
    const mails = getSentMails();
    expect(mails).toHaveLength(1);
    expect(mails[0]?.to).toBe(USER_EMAIL);
    expect(mails[0]?.kind).toBe('rsvp-confirmation');
  });
});
