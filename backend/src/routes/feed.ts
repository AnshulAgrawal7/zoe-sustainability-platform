import { Router } from 'express';
import { getFeed } from '../controllers/feedController';

const router = Router();

// Public, read-only merged "What's New" feed.
router.get('/', getFeed);

export default router;
