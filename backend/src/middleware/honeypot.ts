import { Request, Response, NextFunction } from 'express';

/**
 * Name of the hidden honeypot field. The frontend renders an off-screen,
 * `aria-hidden`, `autocomplete="off"` input with this name that a human never
 * sees or fills. Automated spam bots that blindly fill every field will set it.
 */
export const HONEYPOT_FIELD = 'website';

/**
 * Anti-spam honeypot for public, unauthenticated POST forms (ideas, submissions,
 * event proposals, newsletter). If the hidden field carries a value the request
 * almost certainly came from a bot.
 *
 * We respond with a benign `200` and persist nothing: a bot gets the same shape
 * as a real success and therefore no signal to adapt, while no junk reaches the
 * database. A real submission (hidden field untouched) passes straight through.
 */
export function honeypot(req: Request, res: Response, next: NextFunction): void {
  const value = req.body?.[HONEYPOT_FIELD];
  if (typeof value === 'string' && value.trim() !== '') {
    res.status(200).json({ success: true, data: null });
    return;
  }
  next();
}
