import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../app';
import { containsProfanity, findProfanity } from '../utils/profanity';

describe('profanity filter util (Future_Work §3.5)', () => {
  it('flags a banned word as a standalone token', () => {
    expect(containsProfanity('this is total shit')).toBe(true);
    expect(findProfanity('you are an asshole')).toBe('asshole');
  });

  it('flags German and Greek terms', () => {
    expect(containsProfanity('du bist ein Arschloch')).toBe(true);
    expect(containsProfanity('είσαι μαλάκα ρε')).toBe(true);
  });

  it('does NOT flag innocent words containing a banned substring (no Scunthorpe)', () => {
    expect(containsProfanity('I live in Scunthorpe')).toBe(false);
    expect(containsProfanity('assistant assessment classic')).toBe(false);
    expect(containsProfanity('')).toBe(false);
  });
});

describe('profanity middleware on anonymous content', () => {
  it('rejects a profane idea with 400 PROFANITY', async () => {
    const res = await request(app)
      .post('/api/ideas')
      .send({ title: 'This is shit', description: 'whatever', category: 'MOBILITY' });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('PROFANITY');
  });

  it('rejects a profane submission with 400 PROFANITY', async () => {
    const res = await request(app)
      .post('/api/submissions')
      .send({ type: 'FEEDBACK', message: 'you are an asshole' });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('PROFANITY');
  });

  it('lets clean content through', async () => {
    const res = await request(app)
      .post('/api/ideas')
      .send({ title: 'More bike lanes please', description: 'Along the waterfront', category: 'MOBILITY' });
    expect(res.status).toBe(201);
    // cleanup
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();
    await prisma.idea.delete({ where: { id: res.body.data.id } }).catch(() => null);
    await prisma.$disconnect();
  });
});
