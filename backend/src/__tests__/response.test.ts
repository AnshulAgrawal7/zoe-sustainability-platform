import { describe, it, expect, vi } from 'vitest';
import { ok, created, badRequest, unauthorized, forbidden, notFound, conflict, serverError } from '../utils/response';
import type { Response } from 'express';

function mockRes() {
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  } as unknown as Response;
  return res;
}

describe('Response utilities', () => {
  it('ok sends 200 with success:true and data', () => {
    const res = mockRes();
    ok(res, { id: '1' });
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true, data: { id: '1' } }));
  });

  it('ok includes message when provided', () => {
    const res = mockRes();
    ok(res, null, 'Done');
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Done' }));
  });

  it('created sends 201', () => {
    const res = mockRes();
    created(res, { id: '2' });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
  });

  it('badRequest sends 400 with success:false', () => {
    const res = mockRes();
    badRequest(res, 'Validation failed');
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: false, error: 'Validation failed' }));
  });

  it('unauthorized sends 401', () => {
    const res = mockRes();
    unauthorized(res);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('forbidden sends 403', () => {
    const res = mockRes();
    forbidden(res);
    expect(res.status).toHaveBeenCalledWith(403);
  });

  it('notFound sends 404', () => {
    const res = mockRes();
    notFound(res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('conflict sends 409', () => {
    const res = mockRes();
    conflict(res, 'Already exists');
    expect(res.status).toHaveBeenCalledWith(409);
  });

  it('serverError sends 500', () => {
    const res = mockRes();
    serverError(res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: false }));
  });
});
