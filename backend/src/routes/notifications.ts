import { Router } from 'express';
import {
  getMyNotifications,
  markAllNotificationsRead,
} from '../controllers/userNotificationController';
import { authenticate } from '../middleware/auth';

const router = Router();

// Citizen-facing notification bell (mentions). All routes require a session.
router.get('/', authenticate, getMyNotifications);
router.post('/read', authenticate, markAllNotificationsRead);

export default router;
