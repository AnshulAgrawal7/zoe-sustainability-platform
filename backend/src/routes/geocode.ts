import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { geocode } from '../controllers/geocodeController';
import { authenticate } from '../middleware/auth';

const router = Router();

// Address autocomplete is only needed by logged-in users filling event/project
// forms — gate it behind auth and rate-limit to respect Nominatim's policy.
const geocodeLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: process.env['NODE_ENV'] === 'production' ? 30 : 300,
  message: { success: false, error: 'Too many requests, please try again later' },
});

router.get('/', geocodeLimiter, authenticate, geocode);

export default router;
