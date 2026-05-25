import { Router } from 'express';
import { body } from 'express-validator';
import { getAllUsers, updateUserRole, getStats } from '../controllers/adminController';
import { authenticate } from '../middleware/auth';
import { adminOnly } from '../middleware/adminOnly';

const router = Router();

router.use(authenticate, adminOnly);

router.get('/users', getAllUsers);

router.put(
  '/users/:id/role',
  [body('role').isIn(['USER', 'ADMIN'])],
  updateUserRole
);

router.get('/stats', getStats);

export default router;
