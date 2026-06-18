import { Router } from 'express';
import { body } from 'express-validator';
import {
  register,
  login,
  refresh,
  logout,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerification,
} from '../controllers/authController';
import { authenticate } from '../middleware/auth';

// Shared strong-password policy (mirrors registration + the client checklist).
const strongPassword = {
  minLength: 8,
  minLowercase: 1,
  minUppercase: 1,
  minNumbers: 1,
  minSymbols: 1,
};

const router = Router();

router.post(
  '/register',
  [
    body('email').isEmail().normalizeEmail(),
    // Password policy (best practice): ≥8 chars with lower-, upper-case, a digit
    // and a special character. Mirrors the client-side checklist. Code-based
    // message so the UI can localise it.
    body('password')
      .isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage('WEAK_PASSWORD'),
    body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
    body('username')
      .optional({ values: 'falsy' })
      .trim()
      .toLowerCase()
      .isLength({ min: 3, max: 20 })
      .withMessage('Username must be 3–20 characters')
      .matches(/^[a-z0-9_]+$/)
      .withMessage('Username may only contain letters, digits and underscore'),
    body('language').optional().isIn(['EN', 'EL', 'DE']),
    body('profile').optional().isIn(['RESIDENT', 'VISITOR', 'STUDENT', 'VOLUNTEER']),
    // GDPR: the privacy policy must be actively accepted (boolean `true`). The
    // moment of acceptance is recorded server-side (User.acceptedTermsAt).
    body('consent')
      .custom((value) => value === true)
      .withMessage('CONSENT_REQUIRED'),
  ],
  register
);

router.post(
  '/login',
  [
    // Login accepts either a username or an email in `identifier`. `email` is
    // still accepted for backwards compatibility (older clients / tests).
    body('identifier').optional().trim(),
    body('email').optional().isEmail().normalizeEmail(),
    body('password').notEmpty(),
  ],
  login
);

router.post('/refresh', refresh);

router.post('/logout', authenticate, logout);

// Password reset (Future_Work §2.1). `forgot` always 200s (no enumeration);
// `reset` enforces the same strong-password policy as registration.
router.post(
  '/forgot-password',
  [body('email').isEmail().normalizeEmail()],
  forgotPassword
);

router.post(
  '/reset-password',
  [
    body('token').isString().notEmpty(),
    body('password').isStrongPassword(strongPassword).withMessage('WEAK_PASSWORD'),
  ],
  resetPassword
);

// E-mail verification (Future_Work §2.2). `verify` is public + token-based;
// `resend` re-issues a link for the authenticated user.
router.post('/verify-email', [body('token').isString().notEmpty()], verifyEmail);
router.post('/resend-verification', authenticate, resendVerification);

export default router;
