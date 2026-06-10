import { Router } from 'express';
import { body } from 'express-validator';
import { getAllUsers, updateUserRole, getStats } from '../controllers/adminController';
import { translateProjectFields } from '../controllers/translationController';
import { getIdeas, updateIdeaStatus } from '../controllers/ideaController';
import { authenticate } from '../middleware/auth';
import { adminOnly } from '../middleware/adminOnly';
import { IDEA_STATUSES } from '../constants';

const router = Router();

router.use(authenticate, adminOnly);

router.get('/users', getAllUsers);

// Auto-translate project fields (title/description) into the other languages.
router.post('/translate', translateProjectFields);

router.put(
  '/users/:id/role',
  [body('role').isIn(['USER', 'ADMIN'])],
  updateUserRole
);

router.get('/stats', getStats);

// --- Citizen ideas (admin review) ---
router.get('/ideas', getIdeas);
router.patch(
  '/ideas/:id',
  [body('status').isIn([...IDEA_STATUSES])],
  updateIdeaStatus
);

export default router;
