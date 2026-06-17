import { describe, it, expect } from 'vitest';
import express from 'express';
import rateLimit from 'express-rate-limit';
import request from 'supertest';

// Verifies the write-limiter *pattern* used in app.ts: GET/HEAD are skipped
// (never throttled) while mutating requests are capped and answered with the
// uniform JSON 429 shape. A dedicated tiny app with max=2 makes the boundary
// observable without firing hundreds of requests at the real server.
function makeApp() {
  const app = express();
  const limiter = rateLimit({
    windowMs: 60_000,
    max: 2,
    skip: (req) => req.method === 'GET' || req.method === 'HEAD',
    message: { success: false, error: 'Too many requests, please try again later' },
  });
  app.use(limiter);
  app.get('/x', (_req, res) => res.json({ success: true, data: 'ok' }));
  app.post('/x', (_req, res) => res.json({ success: true, data: 'ok' }));
  return app;
}

describe('write rate limiter', () => {
  it('never throttles GET requests', async () => {
    const app = makeApp();
    for (let i = 0; i < 5; i++) {
      const res = await request(app).get('/x');
      expect(res.status).toBe(200);
    }
  });

  it('caps mutating requests and returns a uniform JSON 429', async () => {
    const app = makeApp();
    expect((await request(app).post('/x')).status).toBe(200);
    expect((await request(app).post('/x')).status).toBe(200);
    const blocked = await request(app).post('/x');
    expect(blocked.status).toBe(429);
    expect(blocked.body.success).toBe(false);
  });
});
