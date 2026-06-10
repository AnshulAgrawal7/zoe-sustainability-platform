import { Router } from 'express';
import { body, query } from 'express-validator';
import rateLimit from 'express-rate-limit';
import {
  getEvents,
  getEvent,
  joinEvent,
  registerForEvent,
  getEventRegistrationCount,
} from '../controllers/eventController';
import { authenticate } from '../middleware/auth';
import { optionalAuth } from '../middleware/optionalAuth';
import { PROJECT_CATEGORIES } from '../constants';

const router = Router();

// Registration is an open, unauthenticated-friendly endpoint, so guard it against
// abuse with a dedicated rate limiter (tighter in production).
const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env['NODE_ENV'] === 'production' ? 10 : 100,
  message: { success: false, error: 'Too many requests, please try again later' },
});

// --- Public read ---
router.get(
  '/',
  [
    query('category').optional().isIn([...PROJECT_CATEGORIES]),
    query('projectId').optional().isString(),
    query('upcoming').optional().isBoolean(),
  ],
  getEvents
);

router.get('/:eventId/count', getEventRegistrationCount);

// --- Logged-in attendance (earns the event's reward points) ---
router.post('/:id/join', authenticate, joinEvent);

// --- Open RSVP (guests: name + email + consent, no points) ---
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

// Keep the detail route last so it does not shadow the sub-paths above.
router.get('/:id', getEvent);

export default router;
