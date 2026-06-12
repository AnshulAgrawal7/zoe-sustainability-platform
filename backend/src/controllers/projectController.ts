import type { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import type { AuthRequest } from '../middleware/auth';
import {
  ok, created, badRequest, notFound, conflict, serverError, forbidden,
} from '../utils/response';
import { createAutoPost } from '../services/postService';

const prisma = new PrismaClient();

interface ProjectBody {
  titleEn?: string;
  titleEl?: string;
  titleDe?: string;
  descriptionEn?: string;
  descriptionEl?: string;
  descriptionDe?: string;
  inputResourcesEn?: string;
  inputResourcesEl?: string;
  inputResourcesDe?: string;
  keyActivitiesEn?: string;
  keyActivitiesEl?: string;
  keyActivitiesDe?: string;
  outputResultsEn?: string;
  outputResultsEl?: string;
  outputResultsDe?: string;
  sdgIds?: number[];
  category?: string;
  status?: string;
  rewardPoints?: number;
  location?: string;
  maxParticipants?: number;
  imageUrl?: string;
}

export async function getProjects(req: Request, res: Response) {
  const page = Math.max(1, parseInt(req.query['page'] as string) || 1);
  const limit = Math.min(50, parseInt(req.query['limit'] as string) || 12);
  const category = req.query['category'] as string | undefined;
  // Default to OPEN; 'ALL' returns every status (Open + Completed + …).
  const status = (req.query['status'] as string) || 'OPEN';

  try {
    const where = {
      // Public list + count: structural/umbrella projects (listed=false) are
      // hidden. The detail route (getProject) does NOT filter, so they stay
      // reachable by direct link (e.g. from an event detail page).
      listed: true,
      ...(category ? { category } : {}),
      ...(status && status !== 'ALL' ? { status } : {}),
    };

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { _count: { select: { participations: true } } },
      }),
      prisma.project.count({ where }),
    ]);

    ok(res, { projects, total, page, pages: Math.ceil(total / limit) });
  } catch {
    serverError(res);
  }
}

// GET /api/projects/impact — public. All documented (sourced) impact figures
// across projects, for the transparency aggregation. Only real metrics exist.
export async function getImpactMetrics(_req: Request, res: Response) {
  try {
    const metrics = await prisma.projectMetric.findMany({
      orderBy: { createdAt: 'asc' },
      include: {
        project: {
          select: { id: true, titleEn: true, titleEl: true, titleDe: true },
        },
      },
    });
    ok(res, { metrics, total: metrics.length });
  } catch {
    serverError(res);
  }
}

export async function getProject(req: Request, res: Response) {
  const id = req.params['id'] as string;
  try {
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        _count: { select: { participations: true } },
        metrics: { orderBy: { createdAt: 'asc' } },
      },
    });
    if (!project) { notFound(res); return; }
    ok(res, project);
  } catch {
    serverError(res);
  }
}

export async function createProject(req: AuthRequest, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) { badRequest(res, 'Validation failed', errors.array()); return; }

  const body = req.body as ProjectBody;
  const { sdgIds, ...rest } = body;

  try {
    const project = await prisma.project.create({
      data: {
        titleEn: rest.titleEn ?? '',
        titleEl: rest.titleEl ?? '',
        titleDe: rest.titleDe ?? '',
        descriptionEn: rest.descriptionEn ?? '',
        descriptionEl: rest.descriptionEl ?? '',
        descriptionDe: rest.descriptionDe ?? '',
        category: rest.category ?? 'ENVIRONMENT',
        status: rest.status ?? 'OPEN',
        sdgIds: JSON.stringify(sdgIds ?? []),
        rewardPoints: rest.rewardPoints ?? 50,
        location: rest.location,
        maxParticipants: rest.maxParticipants,
        imageUrl: rest.imageUrl ?? null,
        inputResourcesEn: rest.inputResourcesEn?.trim() || null,
        inputResourcesEl: rest.inputResourcesEl?.trim() || null,
        inputResourcesDe: rest.inputResourcesDe?.trim() || null,
        keyActivitiesEn: rest.keyActivitiesEn?.trim() || null,
        keyActivitiesEl: rest.keyActivitiesEl?.trim() || null,
        keyActivitiesDe: rest.keyActivitiesDe?.trim() || null,
        outputResultsEn: rest.outputResultsEn?.trim() || null,
        outputResultsEl: rest.outputResultsEl?.trim() || null,
        outputResultsDe: rest.outputResultsDe?.trim() || null,
        createdById: req.user!.userId,
      },
    });
    // A project published straight away is news → auto-post (idempotent).
    if (project.status === 'OPEN') {
      await createAutoPost(project, 'PROJECT_NEW');
    }
    created(res, project);
  } catch {
    serverError(res);
  }
}

export async function updateProject(req: AuthRequest, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) { badRequest(res, 'Validation failed', errors.array()); return; }

  const id = req.params['id'] as string;
  try {
    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) { notFound(res); return; }

    const body = req.body as ProjectBody;
    const { sdgIds, ...rest } = body;

    const updated = await prisma.project.update({
      where: { id },
      data: {
        ...(rest.titleEn !== undefined ? { titleEn: rest.titleEn } : {}),
        ...(rest.titleEl !== undefined ? { titleEl: rest.titleEl } : {}),
        ...(rest.titleDe !== undefined ? { titleDe: rest.titleDe } : {}),
        ...(rest.descriptionEn !== undefined ? { descriptionEn: rest.descriptionEn } : {}),
        ...(rest.descriptionEl !== undefined ? { descriptionEl: rest.descriptionEl } : {}),
        ...(rest.descriptionDe !== undefined ? { descriptionDe: rest.descriptionDe } : {}),
        ...(rest.category !== undefined ? { category: rest.category } : {}),
        ...(rest.status !== undefined ? { status: rest.status } : {}),
        ...(rest.location !== undefined ? { location: rest.location } : {}),
        ...(rest.rewardPoints !== undefined ? { rewardPoints: rest.rewardPoints } : {}),
        ...(rest.imageUrl !== undefined ? { imageUrl: rest.imageUrl || null } : {}),
        ...(rest.inputResourcesEn !== undefined ? { inputResourcesEn: rest.inputResourcesEn || null } : {}),
        ...(rest.inputResourcesEl !== undefined ? { inputResourcesEl: rest.inputResourcesEl || null } : {}),
        ...(rest.inputResourcesDe !== undefined ? { inputResourcesDe: rest.inputResourcesDe || null } : {}),
        ...(rest.keyActivitiesEn !== undefined ? { keyActivitiesEn: rest.keyActivitiesEn || null } : {}),
        ...(rest.keyActivitiesEl !== undefined ? { keyActivitiesEl: rest.keyActivitiesEl || null } : {}),
        ...(rest.keyActivitiesDe !== undefined ? { keyActivitiesDe: rest.keyActivitiesDe || null } : {}),
        ...(rest.outputResultsEn !== undefined ? { outputResultsEn: rest.outputResultsEn || null } : {}),
        ...(rest.outputResultsEl !== undefined ? { outputResultsEl: rest.outputResultsEl || null } : {}),
        ...(rest.outputResultsDe !== undefined ? { outputResultsDe: rest.outputResultsDe || null } : {}),
        ...(sdgIds !== undefined ? { sdgIds: JSON.stringify(sdgIds) } : {}),
      },
    });
    // Lifecycle auto-posts (idempotent): going live (DRAFT→OPEN) or completing.
    if (project.status !== 'COMPLETED' && updated.status === 'COMPLETED') {
      await createAutoPost(updated, 'PROJECT_COMPLETED');
    }
    if (project.status === 'DRAFT' && updated.status === 'OPEN') {
      await createAutoPost(updated, 'PROJECT_NEW');
    }
    ok(res, updated);
  } catch {
    serverError(res);
  }
}

export async function deleteProject(req: AuthRequest, res: Response) {
  const id = req.params['id'] as string;
  try {
    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) { notFound(res); return; }

    const updated = await prisma.project.update({
      where: { id },
      data: { status: 'CLOSED' },
    });
    ok(res, updated, 'Project closed');
  } catch {
    serverError(res);
  }
}

export async function participate(req: AuthRequest, res: Response) {
  const userId = req.user!.userId;
  const projectId = req.params['id'] as string;

  try {
    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) { notFound(res); return; }
    if (project.status !== 'OPEN') { forbidden(res, 'Project is not open for participation'); return; }

    const existing = await prisma.participation.findUnique({
      where: { userId_projectId: { userId, projectId } },
    });
    if (existing) { conflict(res, 'Already participating in this project'); return; }

    // A1: projects award NO points anymore — only events/actions do. The join
    // record is still created (participant tracking), but pointsAwarded = 0 and
    // the user's points are not touched (no project point path).
    const participation = await prisma.participation.create({
      data: { userId, projectId, pointsAwarded: 0 },
    });

    ok(res, { participation, pointsAwarded: 0 });
  } catch {
    serverError(res);
  }
}

export async function withdrawParticipation(req: AuthRequest, res: Response) {
  const userId = req.user!.userId;
  const projectId = req.params['id'] as string;

  try {
    const existing = await prisma.participation.findUnique({
      where: { userId_projectId: { userId, projectId } },
    });
    if (!existing) { notFound(res, 'Participation not found'); return; }

    // A1: no project point path — just remove the join record (pointsAwarded was
    // 0, so the user's points are unaffected).
    await prisma.participation.delete({
      where: { userId_projectId: { userId, projectId } },
    });

    ok(res, null, 'Participation withdrawn');
  } catch {
    serverError(res);
  }
}
