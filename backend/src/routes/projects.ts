import { Router } from 'express';
import { body, query } from 'express-validator';
import {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  participate,
  withdrawParticipation,
} from '../controllers/projectController';
import { authenticate } from '../middleware/auth';
import { adminOnly } from '../middleware/adminOnly';

const router = Router();

router.get(
  '/',
  [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 50 }),
    query('category').optional().isIn(['ENVIRONMENT', 'MOBILITY', 'COMMUNITY', 'EDUCATION', 'CULTURE']),
    query('status').optional().isIn(['DRAFT', 'OPEN', 'CLOSED', 'COMPLETED', 'ALL']),
  ],
  getProjects
);

router.get('/:id', getProject);

router.post(
  '/',
  authenticate,
  adminOnly,
  [
    body('titleEn').trim().notEmpty(),
    body('titleEl').trim().notEmpty(),
    body('titleDe').trim().notEmpty(),
    body('descriptionEn').trim().notEmpty(),
    body('descriptionEl').trim().notEmpty(),
    body('descriptionDe').trim().notEmpty(),
    body('category').isIn(['ENVIRONMENT', 'MOBILITY', 'COMMUNITY', 'EDUCATION', 'CULTURE']),
    body('rewardPoints').optional().isInt({ min: 0 }),
    body('imageUrl').optional({ values: 'falsy' }).isURL({ require_protocol: true }).isLength({ max: 2048 }),
    body('sdgIds').isArray(),
  ],
  createProject
);

router.put(
  '/:id',
  authenticate,
  adminOnly,
  [
    body('titleEn').optional().trim().notEmpty(),
    body('titleEl').optional().trim().notEmpty(),
    body('titleDe').optional().trim().notEmpty(),
    body('status').optional().isIn(['DRAFT', 'OPEN', 'CLOSED', 'COMPLETED']),
    body('imageUrl').optional({ values: 'falsy' }).isURL({ require_protocol: true }).isLength({ max: 2048 }),
  ],
  updateProject
);

router.delete('/:id', authenticate, adminOnly, deleteProject);

router.post('/:id/participate', authenticate, participate);
router.delete('/:id/participate', authenticate, withdrawParticipation);

export default router;
