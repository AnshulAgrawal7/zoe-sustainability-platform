import { Router } from 'express';
import { subscribe } from '../controllers/newsletterController';

const router = Router();

// Public prototype newsletter opt-in — records email + locale, no mailing.
router.post('/', subscribe);

export default router;
