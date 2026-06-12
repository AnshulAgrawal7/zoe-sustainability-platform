import { Router } from 'express';
import { body, query } from 'express-validator';
import {
  getProjects,
  getProject,
  getImpactMetrics,
  createProject,
  updateProject,
  deleteProject,
  participate,
  withdrawParticipation,
} from '../controllers/projectController';
import { authenticate } from '../middleware/auth';
import { adminOnly } from '../middleware/adminOnly';
import { optionalAuth } from '../middleware/optionalAuth';
import { PROJECT_CATEGORIES } from '../constants';

const router = Router();

// Value-chain fields (Block 5) — all optional, trilingual free text.
const valueChainValidators = [
  'inputResourcesEn', 'inputResourcesEl', 'inputResourcesDe',
  'keyActivitiesEn', 'keyActivitiesEl', 'keyActivitiesDe',
  'outputResultsEn', 'outputResultsEl', 'outputResultsDe',
].map((f) =>
  body(f).optional({ values: 'falsy' }).isString().isLength({ max: 2000 })
);

// optionalAuth: DRAFT rows are only visible to admins (list + filters).
router.get(
  '/',
  optionalAuth,
  [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 50 }),
    query('category').optional().isIn([...PROJECT_CATEGORIES]),
    query('status').optional().isIn(['DRAFT', 'OPEN', 'CLOSED', 'COMPLETED', 'ALL']),
  ],
  getProjects
);

// Aggregated documented impact figures — must precede the `/:id` route.
router.get('/impact', getImpactMetrics);

// optionalAuth: drafts stay hidden for the public but readable for admins.
router.get('/:id', optionalAuth, getProject);

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
    body('category').isIn([...PROJECT_CATEGORIES]),
    body('rewardPoints').optional().isInt({ min: 0 }),
    body('imageUrl').optional({ values: 'falsy' }).isURL({ require_protocol: true }).isLength({ max: 2048 }),
    ...valueChainValidators,
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
    ...valueChainValidators,
  ],
  updateProject
);

router.delete('/:id', authenticate, adminOnly, deleteProject);

router.post('/:id/participate', authenticate, participate);
router.delete('/:id/participate', authenticate, withdrawParticipation);

export default router;
