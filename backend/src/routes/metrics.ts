import { Router } from 'express';
import { body } from 'express-validator';
import rateLimit from 'express-rate-limit';
import { recordPageView } from '../controllers/metricsController';

const router = Router();

// SPA navigation is chatty — allow plenty, but cap abuse.
const viewLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env['NODE_ENV'] === 'production' ? 300 : 3000,
  message: { success: false, error: 'Too many requests, please try again later' },
});

// Anonymous aggregate page-view counter (see metricsController for the
// privacy-by-design constraints). Strictly an app-internal path string.
router.post(
  '/view',
  viewLimiter,
  [
    body('path').isString().trim().isLength({ min: 1, max: 200 }).matches(/^\/[a-zA-Z0-9\-_./]*$/),
    body('newVisit').optional().isBoolean(),
  ],
  recordPageView
);

export default router;
