import { Router } from 'express';
import { body } from 'express-validator';
import rateLimit from 'express-rate-limit';
import { createSubmission } from '../controllers/submissionController';
import { optionalAuth } from '../middleware/optionalAuth';
import { SUBMISSION_TYPES } from '../constants';

const router = Router();

// Public, unauthenticated-friendly endpoint → guard against abuse, like the
// idea/event-registration routes (tighter in production).
const submissionLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env['NODE_ENV'] === 'production' ? 10 : 100,
  message: { success: false, error: 'Too many requests, please try again later' },
});

router.post(
  '/',
  submissionLimiter,
  optionalAuth,
  [
    body('type').isIn([...SUBMISSION_TYPES]),
    body('message').trim().notEmpty().isLength({ max: 4000 }),
    body('submitterName').optional({ values: 'falsy' }).trim().isLength({ max: 120 }),
    body('submitterEmail').optional({ values: 'falsy' }).isEmail().normalizeEmail(),
  ],
  createSubmission
);

export default router;
