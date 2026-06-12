import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { subscribe } from '../controllers/newsletterController';

const router = Router();

// Public, unauthenticated endpoint → guard against abuse like the other open
// POST routes (ideas, submissions, event RSVP).
const newsletterLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env['NODE_ENV'] === 'production' ? 10 : 100,
  message: { success: false, error: 'Too many requests, please try again later' },
});

// Public prototype newsletter opt-in — records email + locale, no mailing.
router.post('/', newsletterLimiter, subscribe);

export default router;
