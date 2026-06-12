import { Router } from 'express';
import { body } from 'express-validator';
import { getMe, updateMe, getMyBadges } from '../controllers/userController';
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
    body('profile').optional().isIn(['RESIDENT', 'VISITOR', 'STUDENT', 'VOLUNTEER']),
  ],
  updateMe
);

router.get('/me/badges', authenticate, getMyBadges);

// NOTE: GET /leaderboard was removed for privacy: it exposed user names +
// points without auth. The DSR rationale argues against individual citizen
// rankings anyway (docs/design-rationale-matrix.md B3).

export default router;
