import { Router } from 'express';
import { body } from 'express-validator';
import rateLimit from 'express-rate-limit';
import {
  registerForEvent,
  getEventRegistrationCount,
} from '../controllers/eventController';
import { optionalAuth } from '../middleware/optionalAuth';

const router = Router();

// Registration is an open, unauthenticated-friendly endpoint, so guard it against
// abuse with a dedicated rate limiter (tighter in production).
const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env['NODE_ENV'] === 'production' ? 10 : 100,
  message: { success: false, error: 'Too many requests, please try again later' },
});

router.get('/:eventId/count', getEventRegistrationCount);

router.post(
  '/:eventId/register',
  registerLimiter,
  optionalAuth,
  [
    body('guestName').optional({ values: 'falsy' }).trim().isLength({ min: 1, max: 120 }),
    body('guestEmail').optional({ values: 'falsy' }).isEmail().normalizeEmail(),
    body('consent').optional().isBoolean(),
  ],
  registerForEvent
);

export default router;
