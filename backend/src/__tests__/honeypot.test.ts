import { describe, it, expect, afterAll } from 'vitest';
import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import app from '../app';
import { HONEYPOT_FIELD } from '../middleware/honeypot';

const prisma = new PrismaClient();
const createdIds: string[] = [];

afterAll(async () => {
  if (createdIds.length) {
    await prisma.idea
      .deleteMany({ where: { id: { in: createdIds } } })
      .catch(() => null);
  }
  await prisma.$disconnect();
});

describe('Honeypot anti-spam on public forms', () => {
  it('silently drops an idea when the honeypot field is filled (no DB row)', async () => {
    const title = `Honeypot bot idea ${Date.now()}`;
    const res = await request(app)
      .post('/api/ideas')
      .send({
        title,
        description: 'Spammy bot content.',
        category: 'NATURAL_MONUMENTS',
        [HONEYPOT_FIELD]: 'http://spam.example',
      });

    // Benign success so the bot gets no signal …
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeNull();

    // … but nothing was persisted.
    const found = await prisma.idea.findFirst({ where: { title } });
    expect(found).toBeNull();
  });

  it('lets a real submission through when the honeypot is empty', async () => {
    const res = await request(app)
      .post('/api/ideas')
      .send({
        title: `Honeypot real idea ${Date.now()}`,
        description: 'Genuine citizen idea.',
        category: 'NATURAL_MONUMENTS',
        [HONEYPOT_FIELD]: '',
      });
    expect(res.status).toBe(201);
    expect(res.body.data.id).toBeTruthy();
    createdIds.push(res.body.data.id as string);
  });

  it('also guards the newsletter opt-in', async () => {
    const res = await request(app)
      .post('/api/newsletter')
      .send({ email: `bot-${Date.now()}@spam.example`, [HONEYPOT_FIELD]: 'filled' });
    expect(res.status).toBe(200);
    expect(res.body.data).toBeNull();
  });
});
