import { Router } from 'express';
import { body } from 'express-validator';
import rateLimit from 'express-rate-limit';
import {
  createEventProposal,
  getMyEventProposals,
} from '../controllers/eventProposalController';
import { optionalAuth } from '../middleware/optionalAuth';
import { authenticate } from '../middleware/auth';
import { PROJECT_CATEGORIES, APP_LANGUAGES } from '../constants';

const router = Router();

// The logged-in user's own event proposals (every status) — dashboard tracking.
router.get('/mine', authenticate, getMyEventProposals);

// Public, unauthenticated-friendly (like ideas/submissions) → rate-limited.
const proposalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env['NODE_ENV'] === 'production' ? 10 : 100,
  message: { success: false, error: 'Too many requests, please try again later' },
});

router.post(
  '/',
  proposalLimiter,
  optionalAuth,
  [
    body('title').trim().notEmpty().isLength({ max: 160 }),
    body('description').trim().notEmpty().isLength({ max: 4000 }),
    body('lang').optional().isIn([...APP_LANGUAGES]),
    body('category').isIn([...PROJECT_CATEGORIES]),
    body('date').isISO8601(),
    body('location').optional({ values: 'falsy' }).trim().isLength({ max: 200 }),
    body('lat').optional({ values: 'null' }).isFloat({ min: -90, max: 90 }),
    body('lng').optional({ values: 'null' }).isFloat({ min: -180, max: 180 }),
    body('capacity').optional({ values: 'null' }).isInt({ min: 1 }),
    body('imageUrl').optional({ values: 'falsy' }).isURL({ require_protocol: true }).isLength({ max: 2048 }),
    body('projectId').optional({ values: 'falsy' }).isString(),
    body('submitterName').optional({ values: 'falsy' }).trim().isLength({ max: 120 }),
    body('submitterEmail').optional({ values: 'falsy' }).isEmail().normalizeEmail(),
  ],
  createEventProposal
);

export default router;
