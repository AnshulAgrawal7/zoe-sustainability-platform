import type { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import { ok, badRequest, notFound, serverError } from '../utils/response';
import { USER_PROFILES } from '../constants';

const prisma = new PrismaClient();

// GET /api/rewards/tiers — public. The five ZOE levels with their role-specific
// designations + reward lists (all three languages; the client picks). `rewards*`
// are newline-separated (one reward per line).
export async function getRewardTiers(_req: Request, res: Response) {
  try {
    const tiers = await prisma.rewardTier.findMany({
      orderBy: { order: 'asc' },
      include: { roleVariants: true },
    });
    ok(res, { tiers });
  } catch {
    serverError(res);
  }
}

interface TierVariantBody {
  role?: string;
  nameEn?: string;
  nameEl?: string;
  nameDe?: string;
  descriptionEn?: string;
  descriptionEl?: string;
  descriptionDe?: string;
  rewardsEn?: string;
  rewardsEl?: string;
  rewardsDe?: string;
}

interface TierBody {
  greekName?: string;
  icon?: string;
  pointsMin?: number;
  pointsMax?: number | null;
  variants?: TierVariantBody[];
}

// PUT /api/admin/rewards/tiers/:id — adminOnly. Updates the tier's base fields
// (point range, icon, Greek name) and/or upserts its role variants. Point
// ranges are sanity-checked (min ≥ 0, max > min when set); keeping the five
// ranges contiguous is the admin's responsibility (prototype scope).
export async function updateRewardTier(req: Request, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    badRequest(res, 'Validation failed', errors.array());
    return;
  }

  const id = req.params['id'] as string;
  const body = req.body as TierBody;

  try {
    const existing = await prisma.rewardTier.findUnique({ where: { id } });
    if (!existing) { notFound(res); return; }

    const pointsMin = body.pointsMin ?? existing.pointsMin;
    const pointsMax =
      body.pointsMax === undefined ? existing.pointsMax : body.pointsMax;
    if (pointsMin < 0) { badRequest(res, 'pointsMin must be ≥ 0'); return; }
    if (pointsMax !== null && pointsMax <= pointsMin) {
      badRequest(res, 'pointsMax must be greater than pointsMin (or null for the top tier)');
      return;
    }

    for (const v of body.variants ?? []) {
      if (!v.role || !(USER_PROFILES as readonly string[]).includes(v.role)) {
        badRequest(res, `Invalid role: ${v.role ?? '(missing)'}`);
        return;
      }
    }

    const tier = await prisma.rewardTier.update({
      where: { id },
      data: {
        ...(body.greekName !== undefined ? { greekName: body.greekName.trim() } : {}),
        ...(body.icon !== undefined ? { icon: body.icon.trim() } : {}),
        ...(body.pointsMin !== undefined ? { pointsMin: body.pointsMin } : {}),
        ...(body.pointsMax !== undefined ? { pointsMax: body.pointsMax } : {}),
      },
    });

    for (const v of body.variants ?? []) {
      const texts = {
        nameEn: v.nameEn?.trim() ?? '', nameEl: v.nameEl?.trim() ?? '', nameDe: v.nameDe?.trim() ?? '',
        descriptionEn: v.descriptionEn?.trim() ?? '', descriptionEl: v.descriptionEl?.trim() ?? '', descriptionDe: v.descriptionDe?.trim() ?? '',
        rewardsEn: v.rewardsEn?.trim() ?? '', rewardsEl: v.rewardsEl?.trim() ?? '', rewardsDe: v.rewardsDe?.trim() ?? '',
      };
      await prisma.rewardTierRole.upsert({
        where: { tierId_role: { tierId: id, role: v.role! } },
        update: texts,
        create: { tierId: id, role: v.role!, ...texts },
      });
    }

    const withVariants = await prisma.rewardTier.findUnique({
      where: { id: tier.id },
      include: { roleVariants: true },
    });
    ok(res, withVariants);
  } catch {
    serverError(res);
  }
}
