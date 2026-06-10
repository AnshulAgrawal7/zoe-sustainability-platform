import { Router } from 'express';
import { body } from 'express-validator';
import rateLimit from 'express-rate-limit';
import { createIdea } from '../controllers/ideaController';
import { optionalAuth } from '../middleware/optionalAuth';
import { PROJECT_CATEGORIES } from '../constants';

const router = Router();

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
