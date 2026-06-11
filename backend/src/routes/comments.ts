import { Router } from 'express';
import { toggleCommentLike } from '../controllers/commentController';
import { authenticate } from '../middleware/auth';

const router = Router();

// Toggle a like on a comment (one per logged-in user).
router.post('/:id/like', authenticate, toggleCommentLike);

export default router;
