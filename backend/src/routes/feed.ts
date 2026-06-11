import { Router } from 'express';
import { getFeed, getFeedItem } from '../controllers/feedController';

const router = Router();

// Public, read-only merged "What's New" feed.
router.get('/', getFeed);

// Single entry (full body) — source is 'feed' (imported) or 'project'.
router.get('/:source/:id', getFeedItem);

export default router;
