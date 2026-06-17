import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../app';

describe('Opt-in list pagination (Future_Work 3.7)', () => {
  it('feed: returns the full list without ?page/?limit (backward compatible)', async () => {
    const res = await request(app).get('/api/feed');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data.items)).toBe(true);
    expect(res.body.data.total).toBe(res.body.data.items.length);
    // No pagination metadata when not requested.
    expect(res.body.data.page).toBeUndefined();
  });

  it('feed: bounds the result and reports page metadata with ?limit', async () => {
    const res = await request(app).get('/api/feed?limit=2&page=1');
    expect(res.status).toBe(200);
    expect(res.body.data.items.length).toBeLessThanOrEqual(2);
    expect(res.body.data.page).toBe(1);
    expect(res.body.data.limit).toBe(2);
    expect(res.body.data.total).toBeGreaterThanOrEqual(res.body.data.items.length);
    expect(res.body.data.pages).toBe(Math.ceil(res.body.data.total / 2));
  });

  it('ideas board: full list without params, bounded with ?limit', async () => {
    const full = await request(app).get('/api/ideas/public');
    expect(full.status).toBe(200);
    expect(full.body.data.page).toBeUndefined();

    const paged = await request(app).get('/api/ideas/public?limit=1');
    expect(paged.status).toBe(200);
    expect(paged.body.data.ideas.length).toBeLessThanOrEqual(1);
    expect(paged.body.data.limit).toBe(1);
    expect(paged.body.data.total).toBe(full.body.data.total);
  });

  it('clamps an over-large limit to the maximum', async () => {
    const res = await request(app).get('/api/ideas/public?limit=9999');
    expect(res.status).toBe(200);
    expect(res.body.data.limit).toBe(100);
  });
});
