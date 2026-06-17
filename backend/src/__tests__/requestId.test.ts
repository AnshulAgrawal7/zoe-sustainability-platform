import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../app';

describe('Request id middleware', () => {
  it('sets an X-Request-Id response header', async () => {
    const res = await request(app).get('/api/health');
    expect(res.headers['x-request-id']).toBeTruthy();
    expect(res.headers['x-request-id'].length).toBeGreaterThan(0);
  });

  it('echoes an inbound X-Request-Id (proxy correlation)', async () => {
    const res = await request(app)
      .get('/api/health')
      .set('X-Request-Id', 'trace-abc-123');
    expect(res.headers['x-request-id']).toBe('trace-abc-123');
  });
});
