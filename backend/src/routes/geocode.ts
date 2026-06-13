import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { geocode } from '../controllers/geocodeController';

const router = Router();

// Public address autocomplete (also used by guests submitting an event proposal).
// Rate-limited to respect Nominatim's usage policy; it only proxies address
// lookups (no personal data), so no auth is required.
const geocodeLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: process.env['NODE_ENV'] === 'production' ? 60 : 600,
  message: { success: false, error: 'Too many requests, please try again later' },
});

router.get('/', geocodeLimiter, geocode);

export default router;
