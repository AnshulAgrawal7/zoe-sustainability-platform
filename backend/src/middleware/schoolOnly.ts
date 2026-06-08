import type { Response, NextFunction } from 'express';
import type { AuthRequest } from './auth';
import { forbidden } from '../utils/response';

// Guards the school-coordinator dashboard routes. SCHOOL is a distinct role
// from ADMIN (a coordinator manages only their own school, read-only).
export function schoolOnly(req: AuthRequest, res: Response, next: NextFunction) {
  if (req.user?.role !== 'SCHOOL') {
    forbidden(res);
    return;
  }
  next();
}
