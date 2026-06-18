import type { Request, Response, NextFunction } from 'express';
import { badRequest } from '../utils/response';
import { containsProfanity } from '../utils/profanity';

// Reject a public write if any of the named body fields contains profanity
// (Future_Work §3.5). Code-based error ('PROFANITY') so the client can show a
// localized "please keep it civil" message. Runs on anonymous content routes
// (ideas, submissions, event proposals) before the controller.
export function rejectProfanity(fields: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    for (const field of fields) {
      const value = req.body?.[field];
      if (typeof value === 'string' && containsProfanity(value)) {
        badRequest(res, 'PROFANITY');
        return;
      }
    }
    next();
  };
}
