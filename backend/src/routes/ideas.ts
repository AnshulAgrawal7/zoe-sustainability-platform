import { Router } from 'express';
import { body } from 'express-validator';
import rateLimit from 'express-rate-limit';
import {
  createIdea,
  getPublicIdeas,
  getMyIdeas,
  voteIdea,
} from '../controllers/ideaController';
import {
  getPublicIdeaDetail,
  createComment,
} from '../controllers/commentController';
import { optionalAuth } from '../middleware/optionalAuth';
import { authenticate } from '../middleware/auth';
import { honeypot } from '../middleware/honeypot';
import { PROJECT_CATEGORIES } from '../constants';

const router = Router();

// Public, read-only idea board — server-side filtered to ACCEPTED ideas only,
// with no personal data (pre-moderation, Decide-Madrid/Consul style). optionalAuth
// adds `votedByMe` per idea for logged-in users.
router.get('/public', optionalAuth, getPublicIdeas);

// The logged-in user's own ideas (every status) — dashboard tracking.
router.get('/mine', authenticate, getMyIdeas);

// Toggle a support vote on an approved idea (logged-in; one per user).
router.post('/:id/vote', authenticate, voteIdea);

// Public detail of an approved idea + its visible comments (optionalAuth adds
// `likedByMe`). Defined before `/:id`-style routes — there are none here.
router.get('/public/:id', optionalAuth, getPublicIdeaDetail);

// Post a comment on an approved idea — logged-in only, rate-limited.
const commentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env['NODE_ENV'] === 'production' ? 20 : 200,
  message: { success: false, error: 'Too many requests, please try again later' },
});
router.post(
  '/:id/comments',
  commentLimiter,
  authenticate,
  [body('body').trim().notEmpty().isLength({ min: 1, max: 2000 })],
  createComment
);

// Public, unauthenticated-friendly endpoint → guard against abuse, like the
// event-registration route (tighter in production).
const ideaLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env['NODE_ENV'] === 'production' ? 10 : 100,
  message: { success: false, error: 'Too many requests, please try again later' },
});

router.post(
  '/',
  ideaLimiter,
  honeypot,
  optionalAuth,
  [
    body('title').trim().notEmpty().isLength({ max: 160 }),
    body('description').trim().notEmpty().isLength({ max: 4000 }),
    body('category').isIn([...PROJECT_CATEGORIES]),
    body('submitterName').optional({ values: 'falsy' }).trim().isLength({ max: 120 }),
    body('submitterEmail').optional({ values: 'falsy' }).isEmail().normalizeEmail(),
  ],
  createIdea
);

export default router;
