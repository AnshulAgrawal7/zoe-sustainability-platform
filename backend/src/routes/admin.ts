import { Router } from 'express';
import { body } from 'express-validator';
import { getAllUsers, updateUserRole, getStats } from '../controllers/adminController';
import { translateProjectFields } from '../controllers/translationController';
import { authenticate } from '../middleware/auth';
import { adminOnly } from '../middleware/adminOnly';

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

export default router;
