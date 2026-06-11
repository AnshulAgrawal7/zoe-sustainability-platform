import type { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import type { AuthRequest } from '../middleware/auth';
import { ok, created, badRequest, notFound, serverError } from '../utils/response';

const prisma = new PrismaClient();

interface LearningBody {
  titleEn?: string;
  titleEl?: string;
  titleDe?: string;
  bodyEn?: string;
  bodyEl?: string;
  bodyDe?: string;
  category?: string;
  sdgIds?: number[];
  imageUrl?: string;
  sourceNote?: string;
  projectId?: string | null;
}

const projectRef = {
  select: { id: true, titleEn: true, titleEl: true, titleDe: true, category: true },
};

// GET /api/learn — public list. Filters: category, projectId.
export async function getLearningResources(req: Request, res: Response) {
  const category = req.query['category'] as string | undefined;
  const projectId = req.query['projectId'] as string | undefined;
  try {
    const resources = await prisma.learningResource.findMany({
      where: {
        ...(category ? { category } : {}),
        ...(projectId ? { projectId } : {}),
      },
      orderBy: { createdAt: 'desc' },
      include: { project: projectRef },
    });
    ok(res, { resources, total: resources.length });
  } catch {
    serverError(res);
  }
}

// GET /api/learn/:id — public detail.
export async function getLearningResource(req: Request, res: Response) {
  const id = req.params['id'] as string;
  try {
    const resource = await prisma.learningResource.findUnique({
      where: { id },
      include: { project: projectRef },
    });
    if (!resource) {
      notFound(res);
      return;
    }
    ok(res, resource);
  } catch {
    serverError(res);
  }
}

// POST /api/admin/learn — adminOnly.
export async function createLearningResource(req: AuthRequest, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    badRequest(res, 'Validation failed', errors.array());
    return;
  }
  const body = req.body as LearningBody;
  try {
    if (body.projectId) {
      const project = await prisma.project.findUnique({ where: { id: body.projectId } });
      if (!project) {
        badRequest(res, 'Linked project does not exist');
        return;
      }
    }
    const resource = await prisma.learningResource.create({
      data: {
        titleEn: body.titleEn ?? '',
        titleEl: body.titleEl ?? '',
        titleDe: body.titleDe ?? '',
        bodyEn: body.bodyEn ?? '',
        bodyEl: body.bodyEl ?? '',
        bodyDe: body.bodyDe ?? '',
        category: body.category ?? 'ENVIRONMENT',
        sdgIds: JSON.stringify(body.sdgIds ?? []),
        imageUrl: body.imageUrl?.trim() || null,
        sourceNote: body.sourceNote?.trim() || null,
        projectId: body.projectId || null,
      },
    });
    created(res, resource);
  } catch {
    serverError(res);
  }
}

// PATCH /api/admin/learn/:id — adminOnly.
export async function updateLearningResource(req: AuthRequest, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    badRequest(res, 'Validation failed', errors.array());
    return;
  }
  const id = req.params['id'] as string;
  const body = req.body as LearningBody;
  try {
    const existing = await prisma.learningResource.findUnique({ where: { id } });
    if (!existing) {
      notFound(res);
      return;
    }
    if (body.projectId) {
      const project = await prisma.project.findUnique({ where: { id: body.projectId } });
      if (!project) {
        badRequest(res, 'Linked project does not exist');
        return;
      }
    }
    const updated = await prisma.learningResource.update({
      where: { id },
      data: {
        ...(body.titleEn !== undefined ? { titleEn: body.titleEn } : {}),
        ...(body.titleEl !== undefined ? { titleEl: body.titleEl } : {}),
        ...(body.titleDe !== undefined ? { titleDe: body.titleDe } : {}),
        ...(body.bodyEn !== undefined ? { bodyEn: body.bodyEn } : {}),
        ...(body.bodyEl !== undefined ? { bodyEl: body.bodyEl } : {}),
        ...(body.bodyDe !== undefined ? { bodyDe: body.bodyDe } : {}),
        ...(body.category !== undefined ? { category: body.category } : {}),
        ...(body.sdgIds !== undefined ? { sdgIds: JSON.stringify(body.sdgIds) } : {}),
        ...(body.imageUrl !== undefined ? { imageUrl: body.imageUrl || null } : {}),
        ...(body.sourceNote !== undefined ? { sourceNote: body.sourceNote || null } : {}),
        ...(body.projectId !== undefined ? { projectId: body.projectId || null } : {}),
      },
    });
    ok(res, updated);
  } catch {
    serverError(res);
  }
}

// DELETE /api/admin/learn/:id — adminOnly. Hard delete (content item).
export async function deleteLearningResource(req: AuthRequest, res: Response) {
  const id = req.params['id'] as string;
  try {
    const existing = await prisma.learningResource.findUnique({ where: { id } });
    if (!existing) {
      notFound(res);
      return;
    }
    await prisma.learningResource.delete({ where: { id } });
    ok(res, null, 'Learning resource deleted');
  } catch {
    serverError(res);
  }
}
