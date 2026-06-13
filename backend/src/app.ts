import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';

import authRouter from './routes/auth';
import projectsRouter from './routes/projects';
import usersRouter from './routes/users';
import adminRouter from './routes/admin';
import eventsRouter from './routes/events';
import ideasRouter from './routes/ideas';
import commentsRouter from './routes/comments';
import learnRouter from './routes/learn';
import feedRouter from './routes/feed';
import postsRouter from './routes/posts';
import newsletterRouter from './routes/newsletter';
import submissionsRouter from './routes/submissions';
import eventProposalsRouter from './routes/eventProposals';
import rewardsRouter from './routes/rewards';
import metricsRouter from './routes/metrics';
import geocodeRouter from './routes/geocode';
import uploadsRouter from './routes/uploads';
import notificationsRouter from './routes/notifications';

const app = express();

app.use(helmet());

const corsOrigin = process.env['CORS_ORIGIN'] || 'http://localhost:5173';
const isProd = process.env['NODE_ENV'] === 'production';
const localhostOrigin = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;

app.use(
  cors({
    // In dev, accept any localhost port (Vite may fall back to 5174, 5175, …);
    // in production, only the configured CORS_ORIGIN. Non-browser clients send
    // no Origin and are allowed (curl, server-to-server).
    origin: (origin: string | undefined, cb: (err: Error | null, allow?: boolean) => void) => {
      if (!origin || origin === corsOrigin) return cb(null, true);
      if (!isProd && localhostOrigin.test(origin)) return cb(null, true);
      return cb(null, false);
    },
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  // Higher limit in dev/test to allow E2E test suites; tighten for production
  max: process.env['NODE_ENV'] === 'production' ? 20 : 200,
  message: { success: false, error: 'Too many requests, please try again later' },
});

app.use('/api/auth', authLimiter, authRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/users', usersRouter);
app.use('/api/admin', adminRouter);
app.use('/api/events', eventsRouter);
app.use('/api/ideas', ideasRouter);
app.use('/api/comments', commentsRouter);
app.use('/api/learn', learnRouter);
app.use('/api/feed', feedRouter);
app.use('/api/posts', postsRouter);
app.use('/api/newsletter', newsletterRouter);
app.use('/api/submissions', submissionsRouter);
app.use('/api/event-proposals', eventProposalsRouter);
app.use('/api/rewards', rewardsRouter);
app.use('/api/metrics', metricsRouter);
app.use('/api/geocode', geocodeRouter);
app.use('/api/uploads', uploadsRouter);
app.use('/api/notifications', notificationsRouter);

app.get('/api/health', (_req, res) => {
  res.json({ success: true, data: { status: 'ok', version: '0.1.0' } });
});

export default app;
