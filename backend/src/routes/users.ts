import { Router } from 'express';
import { body } from 'express-validator';
import { getMe, updateMe, getMyBadges, getLeaderboard } from '../controllers/userController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/me', authenticate, getMe);

router.put(
  '/me',
  authenticate,
  [
    body('name').optional().trim().isLength({ min: 2 }),
    body('language').optional().isIn(['EN', 'EL', 'DE']),
    body('avatarUrl').optional().isURL(),
  ],
  updateMe
);

router.get('/me/badges', authenticate, getMyBadges);

router.get('/leaderboard', getLeaderboard);

export default router;
