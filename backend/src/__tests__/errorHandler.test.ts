import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../app';

describe('Error & 404 middleware', () => {
  it('returns a uniform JSON 404 for an unknown route', async () => {
    const res = await request(app).get('/api/this-route-does-not-exist');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(typeof res.body.error).toBe('string');
  });

  it('returns a uniform JSON 400 for a malformed JSON body', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .set('Content-Type', 'application/json')
      .send('{ not valid json');
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});
