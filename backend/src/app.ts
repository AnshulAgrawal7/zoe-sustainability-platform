import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { PrismaClient } from '@prisma/client';

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
import { notFoundHandler, errorHandler } from './middleware/errorHandler';

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

const isTestEnv = process.env['NODE_ENV'] === 'test';

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  // Higher limit in dev/test to allow E2E test suites; tighten for production
  max: process.env['NODE_ENV'] === 'production' ? 20 : 200,
  message: { success: false, error: 'Too many requests, please try again later' },
});

// Anti-spam limiter for public, write-heavy endpoints (citizen submissions,
// comments, newsletter). Only counts mutating requests so reading the public
// idea board / feed is never throttled. Disabled under NODE_ENV=test so the
// integration suites (which fire many writes) are not flagged; tuned tighter in
// production than in local dev.
const writeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env['NODE_ENV'] === 'production' ? 30 : 500,
  skip: (req) => isTestEnv || req.method === 'GET' || req.method === 'HEAD',
  message: { success: false, error: 'Too many requests, please try again later' },
});

app.use('/api/auth', authLimiter, authRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/users', usersRouter);
app.use('/api/admin', adminRouter);
app.use('/api/events', eventsRouter);
app.use('/api/ideas', writeLimiter, ideasRouter);
app.use('/api/comments', writeLimiter, commentsRouter);
app.use('/api/learn', learnRouter);
app.use('/api/feed', feedRouter);
app.use('/api/posts', postsRouter);
app.use('/api/newsletter', writeLimiter, newsletterRouter);
app.use('/api/submissions', writeLimiter, submissionsRouter);
app.use('/api/event-proposals', writeLimiter, eventProposalsRouter);
app.use('/api/rewards', rewardsRouter);
app.use('/api/metrics', metricsRouter);
app.use('/api/geocode', geocodeRouter);
app.use('/api/uploads', uploadsRouter);
app.use('/api/notifications', notificationsRouter);

// Liveness: the process is up and serving HTTP. Cheap, no I/O — safe for the
// host's frequent liveness probe.
app.get('/api/health', (_req, res) => {
  res.json({ success: true, data: { status: 'ok', version: '0.1.0' } });
});

// Readiness: the process can actually serve traffic, i.e. the database is
// reachable. Hosts/orchestrators should poll this before routing requests.
// Returns 503 (not 500) so a load balancer treats it as "not ready" rather than
// a crash, and never leaks DB internals.
const readinessPrisma = new PrismaClient();
app.get('/api/ready', async (_req, res) => {
  try {
    await readinessPrisma.$queryRaw`SELECT 1`;
    res.json({ success: true, data: { status: 'ready', database: 'up' } });
  } catch {
    res.status(503).json({ success: false, error: 'Database unavailable' });
  }
});

// Unknown route → uniform JSON 404 (must come after all routers).
app.use(notFoundHandler);
// Central error handler → uniform JSON 500/400 (must be the LAST middleware).
app.use(errorHandler);

export default app;
