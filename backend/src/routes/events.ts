import { Router } from 'express';
import { body, query } from 'express-validator';
import rateLimit from 'express-rate-limit';
import {
  getEvents,
  getEvent,
  joinEvent,
  registerForEvent,
  cancelRegistration,
  getMyEventRegistrations,
  getEventRegistrationCount,
} from '../controllers/eventController';
import { getEventComments, createEventComment } from '../controllers/commentController';
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

// --- Public read (optionalAuth adds registeredByMe for logged-in users) ---
router.get(
  '/',
  optionalAuth,
  [
    query('category').optional().isIn([...PROJECT_CATEGORIES]),
    query('projectId').optional().isString(),
    query('upcoming').optional().isBoolean(),
  ],
  getEvents
);

// The logged-in user's own registrations (dashboard "my events"). Two literal
// segments, so it never collides with `/:eventId/count` or `/:id` below.
router.get('/registrations/me', authenticate, getMyEventRegistrations);

router.get('/:eventId/count', getEventRegistrationCount);

// --- Logged-in attendance (points pending until the event is completed) ---
router.post('/:id/join', authenticate, joinEvent);

// --- Logged-in cancel (any time before the event is completed) ---
router.delete('/:id/registration', authenticate, cancelRegistration);

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

// --- Event discussion (everyone reads; logged-in users post) ---
router.get('/:id/comments', optionalAuth, getEventComments);

const eventCommentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env['NODE_ENV'] === 'production' ? 20 : 200,
  message: { success: false, error: 'Too many requests, please try again later' },
});
router.post(
  '/:id/comments',
  eventCommentLimiter,
  authenticate,
  [body('body').trim().notEmpty().isLength({ min: 1, max: 2000 })],
  createEventComment
);

// Keep the detail route last so it does not shadow the sub-paths above.
router.get('/:id', optionalAuth, getEvent);

export default router;
