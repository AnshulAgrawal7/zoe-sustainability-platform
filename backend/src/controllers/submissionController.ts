import type { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import type { AuthRequest } from '../middleware/auth';
import { ok, created, badRequest, serverError } from '../utils/response';

const prisma = new PrismaClient();

// POST /api/submissions — environmental issue reports & general feedback from
// /participate. Mirrors createIdea: open to everyone (optionalAuth); a valid
// token links the submission to that user, otherwise it is stored anonymously
// (optional submitterName/submitterEmail). Admins see these in a read-only
// overview — no further workflow yet (Future Work).
export async function createSubmission(req: AuthRequest, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    badRequest(res, 'Validation failed', errors.array());
    return;
  }

  const { type, message, submitterName, submitterEmail } = req.body as {
    type: string;
    message: string;
    submitterName?: string;
    submitterEmail?: string;
  };

  try {
    const submission = await prisma.submission.create({
      data: {
        type,
        message: message.trim(),
        submitterName: submitterName?.trim() || null,
        submitterEmail: submitterEmail?.trim() || null,
        userId: req.user?.userId ?? null,
      },
      select: { id: true, type: true, createdAt: true },
    });
    created(res, submission);
  } catch {
    serverError(res);
  }
}

// GET /api/admin/submissions?type=... — adminOnly (guarded by the admin router).
export async function getSubmissions(req: Request, res: Response) {
  const type = req.query['type'] as string | undefined;
  try {
    const submissions = await prisma.submission.findMany({
      where: type ? { type } : {},
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { id: true, name: true, email: true } } },
    });
    ok(res, { submissions, total: submissions.length });
  } catch {
    serverError(res);
  }
}
