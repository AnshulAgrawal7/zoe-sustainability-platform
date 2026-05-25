import type { Response, NextFunction } from 'express';
import type { AuthRequest } from './auth';
import { forbidden } from '../utils/response';

export function adminOnly(req: AuthRequest, res: Response, next: NextFunction) {
  if (req.user?.role !== 'ADMIN') {
    forbidden(res);
    return;
  }
  next();
}
