import type { Response } from 'express';

export function ok<T>(res: Response, data: T, message?: string) {
  const body: Record<string, unknown> = { success: true, data };
  if (message) body['message'] = message;
  return res.json(body);
}

export function created<T>(res: Response, data: T) {
  return res.status(201).json({ success: true, data });
}

export function badRequest(res: Response, error: string, details?: unknown) {
  const body: Record<string, unknown> = { success: false, error };
  if (details !== undefined) body['details'] = details;
  return res.status(400).json(body);
}

export function unauthorized(res: Response, error = 'Unauthorized') {
  return res.status(401).json({ success: false, error });
}

export function forbidden(res: Response, error = 'Forbidden') {
  return res.status(403).json({ success: false, error });
}

export function notFound(res: Response, error = 'Not found') {
  return res.status(404).json({ success: false, error });
}

export function conflict(res: Response, error: string) {
  return res.status(409).json({ success: false, error });
}

export function serverError(res: Response, error = 'Internal server error') {
  return res.status(500).json({ success: false, error });
}

export function serviceUnavailable(res: Response, error = 'Service unavailable') {
  return res.status(503).json({ success: false, error });
}
