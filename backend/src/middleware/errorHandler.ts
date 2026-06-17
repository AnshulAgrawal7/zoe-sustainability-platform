import type { NextFunction, Request, Response } from 'express';
import { MulterError } from 'multer';
import { logger } from '../utils/logger';
import type { RequestWithId } from './requestId';

/**
 * 404 handler for unknown API routes. Mounted AFTER all routers so anything that
 * fell through gets the project's uniform `{ success:false }` shape instead of
 * Express's default HTML page.
 */
export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({ success: false, error: `Not found: ${req.method} ${req.path}` });
}

/**
 * Central error handler (the LAST `app.use`). Catches anything thrown/`next(err)`
 * from a route so the client always receives JSON. Known cases get a precise
 * status; everything else is a generic 500 (no internals leaked). Express
 * identifies this as an error handler purely by its four-argument signature, so
 * `next` must stay in the list even though it is unused.
 */
export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  // Required so Express recognises this 4-arg function as an error handler.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
): void {
  // Multer (file upload) errors → 400 with a stable, client-localisable code.
  if (err instanceof MulterError) {
    const error = err.code === 'LIMIT_FILE_SIZE' ? 'FILE_TOO_LARGE' : 'UPLOAD_ERROR';
    res.status(400).json({ success: false, error });
    return;
  }

  // Malformed JSON body (express.json throws a SyntaxError with `status` 400).
  if (err instanceof SyntaxError && 'status' in err && (err as { status?: number }).status === 400) {
    res.status(400).json({ success: false, error: 'Invalid JSON body' });
    return;
  }

  // Surfaced to error-tracking in production (see Future_Work §8.4). Logged here
  // (with the request id for correlation) so it is never silently swallowed; the
  // response body stays generic.
  logger.error('api.unhandled_error', {
    id: (req as RequestWithId).id,
    method: req.method,
    path: req.path,
    error: err instanceof Error ? err.message : String(err),
  });
  res.status(500).json({ success: false, error: 'Internal server error' });
}
