import type { Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import type { AuthRequest } from './auth';

// Like `authenticate`, but never rejects: attaches `req.user` when a valid Bearer
// token is present, otherwise continues as an anonymous (guest) request. Used for
// endpoints open to everyone where being logged in only changes the outcome
// (e.g. event registration awards points to members but is open to guests).
export function optionalAuth(
  req: AuthRequest,
  _res: Response,
  next: NextFunction
) {
  const header = req.headers.authorization;
  if (header?.startsWith('Bearer ')) {
    try {
      req.user = verifyToken(header.slice(7));
    } catch {
      // Invalid/expired token → treat as a guest rather than rejecting.
    }
  }
  next();
}
