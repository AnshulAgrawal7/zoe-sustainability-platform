import { Router } from 'express';
import {
  getLearningResources,
  getLearningResource,
} from '../controllers/learningController';

const router = Router();

// Public, read-only educational content (Z5).
router.get('/', getLearningResources);
router.get('/:id', getLearningResource);

export default router;
