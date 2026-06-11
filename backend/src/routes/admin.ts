import { Router } from 'express';
import { body } from 'express-validator';
import { getAllUsers, updateUserRole, getStats } from '../controllers/adminController';
import { translateProjectFields } from '../controllers/translationController';
import { getIdeas, updateIdeaStatus } from '../controllers/ideaController';
import { getAllComments, setCommentStatus } from '../controllers/commentController';
import { createEvent, updateEvent, deleteEvent } from '../controllers/eventController';
import {
  createLearningResource,
  updateLearningResource,
  deleteLearningResource,
} from '../controllers/learningController';
import { authenticate } from '../middleware/auth';
import { adminOnly } from '../middleware/adminOnly';
import { IDEA_STATUSES, COMMENT_STATUSES, PROJECT_CATEGORIES } from '../constants';

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

// --- Comment moderation (Z3 discourse) ---
router.get('/comments', getAllComments);
router.patch(
  '/comments/:id',
  [body('status').isIn([...COMMENT_STATUSES])],
  setCommentStatus
);

// --- Events (admin CRUD; public read lives on /api/events) ---
const eventCreateValidators = [
  body('titleEn').trim().notEmpty(),
  body('titleEl').trim().notEmpty(),
  body('titleDe').trim().notEmpty(),
  body('descriptionEn').trim().notEmpty(),
  body('descriptionEl').trim().notEmpty(),
  body('descriptionDe').trim().notEmpty(),
  body('date').isISO8601(),
  body('category').isIn([...PROJECT_CATEGORIES]),
  body('rewardPoints').optional().isInt({ min: 0 }),
  body('capacity').optional({ values: 'null' }).isInt({ min: 1 }),
  body('projectId').optional({ values: 'falsy' }).isString(),
  body('location').optional({ values: 'falsy' }).trim().isLength({ max: 200 }),
  body('imageUrl').optional({ values: 'falsy' }).isURL({ require_protocol: true }).isLength({ max: 2048 }),
];

const eventUpdateValidators = [
  body('titleEn').optional().trim().notEmpty(),
  body('titleEl').optional().trim().notEmpty(),
  body('titleDe').optional().trim().notEmpty(),
  body('date').optional().isISO8601(),
  body('category').optional().isIn([...PROJECT_CATEGORIES]),
  body('rewardPoints').optional().isInt({ min: 0 }),
  body('capacity').optional({ values: 'null' }).isInt({ min: 1 }),
  body('imageUrl').optional({ values: 'falsy' }).isURL({ require_protocol: true }).isLength({ max: 2048 }),
];

router.post('/events', eventCreateValidators, createEvent);
router.patch('/events/:id', eventUpdateValidators, updateEvent);
router.delete('/events/:id', deleteEvent);

// --- Learning resources (Z5, admin CRUD; public read lives on /api/learn) ---
const learnValidators = [
  body('titleEn').optional().trim().isLength({ max: 200 }),
  body('titleEl').optional().trim().isLength({ max: 200 }),
  body('titleDe').optional().trim().isLength({ max: 200 }),
  body('bodyEn').optional().isString().isLength({ max: 20000 }),
  body('bodyEl').optional().isString().isLength({ max: 20000 }),
  body('bodyDe').optional().isString().isLength({ max: 20000 }),
  body('category').optional().isIn([...PROJECT_CATEGORIES]),
  body('sdgIds').optional().isArray(),
  body('imageUrl').optional({ values: 'falsy' }).isURL({ require_protocol: true }).isLength({ max: 2048 }),
  body('sourceNote').optional({ values: 'falsy' }).trim().isLength({ max: 500 }),
  body('projectId').optional({ values: 'falsy' }).isString(),
];
router.post('/learn', learnValidators, createLearningResource);
router.patch('/learn/:id', learnValidators, updateLearningResource);
router.delete('/learn/:id', deleteLearningResource);

export default router;
