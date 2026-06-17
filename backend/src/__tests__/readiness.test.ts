import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../app';

describe('Health & readiness probes', () => {
  it('liveness returns ok without touching the database', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('ok');
  });

  it('readiness returns ready when the database is reachable', async () => {
    const res = await request(app).get('/api/ready');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.database).toBe('up');
  });
});
