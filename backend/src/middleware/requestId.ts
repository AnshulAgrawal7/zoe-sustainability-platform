import type { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';
import { logger } from '../utils/logger';

export interface RequestWithId extends Request {
  id?: string;
}

// Assigns a request id (honouring an inbound `X-Request-Id` from a proxy, else
// generated), echoes it back on the response header, and logs one structured
// line per completed request — method, path, status, duration (Future_Work §3.6).
export function requestId(req: Request, res: Response, next: NextFunction): void {
  const incoming = req.headers['x-request-id'];
  const id =
    (typeof incoming === 'string' && incoming.trim()) || randomUUID();
  (req as RequestWithId).id = id;
  res.setHeader('X-Request-Id', id);

  const start = Date.now();
  res.on('finish', () => {
    logger.info('request', {
      id,
      method: req.method,
      path: req.path,
      status: res.statusCode,
      ms: Date.now() - start,
    });
  });

  next();
}
