import type { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import type { AuthRequest } from '../middleware/auth';
import { ok, created, badRequest, notFound, serverError } from '../utils/response';
import { notifyStatusChange, emailAnonymousSubmitter } from '../utils/notify';

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
      include: { user: { select: { id: true, username: true, name: true, email: true } } },
    });
    ok(res, { submissions, total: submissions.length });
  } catch {
    serverError(res);
  }
}

// PATCH /api/admin/submissions/:id — adminOnly. Update the handling status and an
// optional reply; notifies the submitter (if a registered user).
export async function updateSubmissionStatus(req: Request, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    badRequest(res, 'Validation failed', errors.array());
    return;
  }
  const id = req.params['id'] as string;
  const { status, message } = req.body as { status: string; message?: string };
  try {
    const existing = await prisma.submission.findUnique({ where: { id } });
    if (!existing) {
      notFound(res);
      return;
    }
    const note = message?.trim() || null;
    const updated = await prisma.submission.update({
      where: { id },
      data: { status, ...(note !== null ? { adminNote: note } : {}) },
    });
    await notifyStatusChange(prisma, {
      userId: existing.userId,
      type: 'SUBMISSION_STATUS',
      status,
      message: note,
      submissionId: id,
    }).catch(() => null);
    // Anonymous submitter with an e-mail → notify by mail instead (§7.2). The
    // report/feedback has no title, so use the type label + a short message snippet.
    await emailAnonymousSubmitter({
      submitterEmail: existing.submitterEmail,
      userId: existing.userId,
      kindLabel: existing.type === 'REPORT' ? 'report' : 'feedback',
      title: existing.message.slice(0, 60),
      status,
      note,
    }).catch(() => null);
    ok(res, updated);
  } catch {
    serverError(res);
  }
}

// GET /api/submissions/mine — the logged-in user's own reports/feedback with
// status + admin reply, for dashboard tracking.
export async function getMySubmissions(req: AuthRequest, res: Response) {
  const userId = req.user!.userId;
  try {
    const submissions = await prisma.submission.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        type: true,
        message: true,
        status: true,
        adminNote: true,
        createdAt: true,
      },
    });
    ok(res, { submissions });
  } catch {
    serverError(res);
  }
}
