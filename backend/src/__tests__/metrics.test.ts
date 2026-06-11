import { describe, it, expect, afterAll } from 'vitest';
import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import app from '../app';

const prisma = new PrismaClient();

afterAll(async () => {
  await prisma.$disconnect();
});

describe('GET /api/projects/impact (documented figures)', () => {
  it('returns sourced metrics with their project reference', async () => {
    const res = await request(app).get('/api/projects/impact');
    expect(res.status).toBe(200);
    const metrics = res.body.data.metrics as Array<{
      projectId: string;
      value: string;
      source: string | null;
      project: { id: string } | null;
    }>;
    expect(metrics.length).toBeGreaterThan(0);
    // Seeded flagship figures are present with a source
    const led = metrics.find((m) => m.projectId === 'proj-led');
    expect(led?.value).toBe('4,866');
    expect(led?.source).toBeTruthy();
    expect(led?.project).toBeTruthy();
    const diverted = metrics.find(
      (m) => m.projectId === 'proj-circular' && m.value === '2,682.699'
    );
    expect(diverted).toBeTruthy();
  });
});

describe('project detail includes its documented metrics', () => {
  it('a project with documented impact returns a non-empty metrics array', async () => {
    const res = await request(app).get('/api/projects/proj-led');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data.metrics)).toBe(true);
    expect(res.body.data.metrics.length).toBeGreaterThan(0);
  });

  it('a project without documented impact returns an empty metrics array', async () => {
    const res = await request(app).get('/api/projects/proj-greenmove');
    expect(res.status).toBe(200);
    expect(res.body.data.metrics).toEqual([]);
  });
});
