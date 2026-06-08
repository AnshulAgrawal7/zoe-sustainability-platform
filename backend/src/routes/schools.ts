import { Router } from 'express';
import { body } from 'express-validator';
import {
  getSchools,
  getSchoolLeaderboard,
  getSchool,
  getMySchool,
  joinSchool,
  leaveSchool,
} from '../controllers/schoolController';
import { authenticate } from '../middleware/auth';
import { schoolOnly } from '../middleware/schoolOnly';

const router = Router();

// Static paths must be registered before the `/:id` catch-all.
router.get('/', getSchools);
router.get('/leaderboard', getSchoolLeaderboard);
router.get('/me', authenticate, schoolOnly, getMySchool);

router.post(
  '/join',
  authenticate,
  [body('code').trim().notEmpty().isLength({ max: 64 })],
  joinSchool,
);
router.post('/leave', authenticate, leaveSchool);

router.get('/:id', getSchool);

export default router;
