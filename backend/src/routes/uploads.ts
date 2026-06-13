import { Router } from 'express';
import multer from 'multer';
import rateLimit from 'express-rate-limit';
import { uploadEntityImage } from '../controllers/uploadController';
import { authenticate } from '../middleware/auth';

const router = Router();

// In-memory storage (small cover images) → streamed straight to Supabase. 5 MB cap.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env['NODE_ENV'] === 'production' ? 30 : 300,
  message: { success: false, error: 'Too many requests, please try again later' },
});

router.post('/image', uploadLimiter, authenticate, upload.single('image'), uploadEntityImage);

export default router;
