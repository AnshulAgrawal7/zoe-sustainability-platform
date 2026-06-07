import type { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import type { AuthRequest } from '../middleware/auth';
import {
  ok, created, badRequest, notFound, conflict, serverError, forbidden,
} from '../utils/response';

const prisma = new PrismaClient();

interface ProjectBody {
  titleEn?: string;
  titleEl?: string;
  titleDe?: string;
  descriptionEn?: string;
  descriptionEl?: string;
  descriptionDe?: string;
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

export async function getProject(req: Request, res: Response) {
  const id = req.params['id'] as string;
  try {
    const project = await prisma.project.findUnique({
      where: { id },
      include: { _count: { select: { participations: true } } },
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
        createdById: req.user!.userId,
      },
    });
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
        ...(sdgIds !== undefined ? { sdgIds: JSON.stringify(sdgIds) } : {}),
      },
    });
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

    const [participation] = await prisma.$transaction([
      prisma.participation.create({ data: { userId, projectId, pointsAwarded: project.rewardPoints } }),
      prisma.user.update({ where: { id: userId }, data: { points: { increment: project.rewardPoints } } }),
    ]);

    const updatedUser = await prisma.user.findUnique({ where: { id: userId }, select: { points: true } });
    if (updatedUser) {
      const earnedBadges = await prisma.badge.findMany({ where: { threshold: { lte: updatedUser.points } } });
      for (const badge of earnedBadges) {
        await prisma.userBadge.upsert({
          where: { userId_badgeId: { userId, badgeId: badge.id } },
          update: {},
          create: { userId, badgeId: badge.id },
        });
      }
    }

    ok(res, { participation, pointsAwarded: project.rewardPoints });
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

    await prisma.$transaction([
      prisma.participation.delete({ where: { userId_projectId: { userId, projectId } } }),
      prisma.user.update({ where: { id: userId }, data: { points: { decrement: existing.pointsAwarded } } }),
    ]);

    ok(res, null, 'Participation withdrawn');
  } catch {
    serverError(res);
  }
}
