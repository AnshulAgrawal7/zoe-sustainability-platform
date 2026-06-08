import { Router } from 'express';
import { body } from 'express-validator';
import { getAllUsers, updateUserRole, getStats } from '../controllers/adminController';
import { translateProjectFields } from '../controllers/translationController';
import { createSchool, updateSchool, deleteSchool } from '../controllers/schoolController';
import { authenticate } from '../middleware/auth';
import { adminOnly } from '../middleware/adminOnly';

const router = Router();

router.use(authenticate, adminOnly);

router.get('/users', getAllUsers);

// Auto-translate project fields (title/description) into the other languages.
router.post('/translate', translateProjectFields);

router.put(
  '/users/:id/role',
  [body('role').isIn(['USER', 'ADMIN', 'SCHOOL'])],
  updateUserRole
);

router.get('/stats', getStats);

// --- School management (admin) ---
router.post(
  '/schools',
  [
    body('name').trim().notEmpty().isLength({ max: 120 }),
    body('code').trim().notEmpty().isLength({ max: 64 }),
    body('location').optional({ values: 'falsy' }).trim().isLength({ max: 120 }),
    body('coordinatorEmail').optional({ values: 'falsy' }).isEmail(),
    body('coordinatorName').optional({ values: 'falsy' }).trim().isLength({ max: 120 }),
    body('coordinatorPassword').optional({ values: 'falsy' }).isLength({ min: 8, max: 128 }),
  ],
  createSchool
);
router.put(
  '/schools/:id',
  [
    body('name').optional().trim().notEmpty().isLength({ max: 120 }),
    body('code').optional().trim().notEmpty().isLength({ max: 64 }),
    body('location').optional({ values: 'falsy' }).trim().isLength({ max: 120 }),
  ],
  updateSchool
);
router.delete('/schools/:id', deleteSchool);

export default router;
