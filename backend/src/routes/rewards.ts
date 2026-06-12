import { Router } from 'express';
import { getRewardTiers } from '../controllers/rewardController';

const router = Router();

// Public, read-only: the five ZOE levels incl. role-specific designations and
// reward lists (admin edits live under /api/admin/rewards/tiers/:id).
router.get('/tiers', getRewardTiers);

export default router;
