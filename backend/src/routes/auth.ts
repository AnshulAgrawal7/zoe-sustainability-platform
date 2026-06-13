import { Router } from 'express';
import { body } from 'express-validator';
import { register, login, refresh, logout } from '../controllers/authController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post(
  '/register',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
    body('username')
      .trim()
      .toLowerCase()
      .isLength({ min: 3, max: 20 })
      .withMessage('Username must be 3–20 characters')
      .matches(/^[a-z0-9_]+$/)
      .withMessage('Username may only contain letters, digits and underscore'),
    body('language').optional().isIn(['EN', 'EL', 'DE']),
    body('profile').optional().isIn(['RESIDENT', 'VISITOR', 'STUDENT', 'VOLUNTEER']),
  ],
  register
);

router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty(),
  ],
  login
);

router.post('/refresh', refresh);

router.post('/logout', authenticate, logout);

export default router;
