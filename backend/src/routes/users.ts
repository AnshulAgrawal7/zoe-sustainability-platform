import { Router } from 'express';
import { body } from 'express-validator';
import {
  getMe,
  updateMe,
  getMyBadges,
  searchUsers,
} from '../controllers/userController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/me', authenticate, getMe);

router.put(
  '/me',
  authenticate,
  [
    body('name').optional().trim().isLength({ min: 2 }),
    body('username')
      .optional()
      .trim()
      .toLowerCase()
      .isLength({ min: 3, max: 20 })
      .matches(/^[a-z0-9_]+$/),
    body('language').optional().isIn(['EN', 'EL', 'DE']),
    body('avatarUrl').optional().isURL(),
    body('profile').optional().isIn(['RESIDENT', 'VISITOR', 'STUDENT', 'VOLUNTEER']),
  ],
  updateMe
);

router.get('/me/badges', authenticate, getMyBadges);

// Username autocomplete for @mentions (logged-in only).
router.get('/search', authenticate, searchUsers);

export default router;
