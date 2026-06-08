import { Router } from 'express';
import { body, query } from 'express-validator';
import {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
} from '../controllers/postController';
import { authenticate } from '../middleware/auth';
import { adminOnly } from '../middleware/adminOnly';

const router = Router();

const POST_TYPES = ['PROJECT_NEW', 'PROJECT_COMPLETED', 'ANNOUNCEMENT'];

router.get(
  '/',
  [
    query('type').optional().isIn(POST_TYPES),
    query('limit').optional().isInt({ min: 1, max: 50 }),
  ],
  getPosts
);

router.get('/:id', getPost);

router.post(
  '/',
  authenticate,
  adminOnly,
  [
    body('titleEn').trim().notEmpty(),
    body('titleEl').trim().notEmpty(),
    body('titleDe').trim().notEmpty(),
    body('bodyEn').trim().notEmpty(),
    body('bodyEl').trim().notEmpty(),
    body('bodyDe').trim().notEmpty(),
    body('type').optional().isIn(POST_TYPES),
    body('imageUrl').optional({ values: 'falsy' }).isURL({ require_protocol: true }).isLength({ max: 2048 }),
    body('published').optional().isBoolean(),
  ],
  createPost
);

router.put(
  '/:id',
  authenticate,
  adminOnly,
  [
    body('titleEn').optional().trim().notEmpty(),
    body('titleEl').optional().trim().notEmpty(),
    body('titleDe').optional().trim().notEmpty(),
    body('type').optional().isIn(POST_TYPES),
    body('imageUrl').optional({ values: 'falsy' }).isURL({ require_protocol: true }).isLength({ max: 2048 }),
    body('published').optional().isBoolean(),
  ],
  updatePost
);

router.delete('/:id', authenticate, adminOnly, deletePost);

export default router;
