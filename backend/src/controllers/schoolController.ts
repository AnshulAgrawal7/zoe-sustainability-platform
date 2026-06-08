import type { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import type { AuthRequest } from '../middleware/auth';
import {
  ok, created, badRequest, notFound, conflict, serverError,
} from '../utils/response';

const prisma = new PrismaClient();

// A school must have at least this many student members before it is ranked.
// Prevents a 1-student school topping the average-based leaderboard.
const MIN_RANKED_MEMBERS = 3;

interface SchoolAggregate {
  id: string;
  name: string;
  location: string | null;
  memberCount: number;
  totalPoints: number;
  avgPoints: number;
  ranked: boolean;
}

// Count only real student members (role USER); the SCHOOL coordinator account
// shares the schoolId but must not inflate the aggregate.
const MEMBER_FILTER = { role: 'USER' as const };

function aggregate(
  school: { id: string; name: string; location: string | null; members: { points: number }[] },
): SchoolAggregate {
  const memberCount = school.members.length;
  const totalPoints = school.members.reduce((sum, m) => sum + m.points, 0);
  const avgPoints = memberCount > 0 ? Math.round(totalPoints / memberCount) : 0;
  return {
    id: school.id,
    name: school.name,
    location: school.location,
    memberCount,
    totalPoints,
    avgPoints,
    ranked: memberCount >= MIN_RANKED_MEMBERS,
  };
}

// Ranked schools first (by avg desc, total as tiebreak), then unranked (too few members).
function rankCompare(a: SchoolAggregate, b: SchoolAggregate): number {
  if (a.ranked !== b.ranked) return a.ranked ? -1 : 1;
  if (b.avgPoints !== a.avgPoints) return b.avgPoints - a.avgPoints;
  return b.totalPoints - a.totalPoints;
}

/** GET /api/schools — public list (id, name, location, memberCount). */
export async function getSchools(_req: Request, res: Response) {
  try {
    const schools = await prisma.school.findMany({
      orderBy: { name: 'asc' },
      include: { members: { where: MEMBER_FILTER, select: { points: true } } },
    });
    ok(res, schools.map(aggregate));
  } catch {
    serverError(res);
  }
}

/** GET /api/schools/leaderboard — public ranking by avg points per member. */
export async function getSchoolLeaderboard(_req: Request, res: Response) {
  try {
    const schools = await prisma.school.findMany({
      include: { members: { where: MEMBER_FILTER, select: { points: true } } },
    });
    const ranked = schools.map(aggregate).sort(rankCompare);
    ok(res, { schools: ranked, minRankedMembers: MIN_RANKED_MEMBERS });
  } catch {
    serverError(res);
  }
}

/** GET /api/schools/:id — public school detail with aggregate. */
export async function getSchool(req: Request, res: Response) {
  const id = req.params['id'] as string;
  try {
    const school = await prisma.school.findUnique({
      where: { id },
      include: {
        members: {
          where: MEMBER_FILTER,
          select: { id: true, name: true, points: true },
          orderBy: { points: 'desc' },
        },
      },
    });
    if (!school) { notFound(res); return; }
    const agg = aggregate(school);
    ok(res, { ...agg, members: school.members });
  } catch {
    serverError(res);
  }
}

/** GET /api/schools/me — SCHOOL coordinator dashboard (own school, read-only). */
export async function getMySchool(req: AuthRequest, res: Response) {
  try {
    const me = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      select: { schoolId: true },
    });
    if (!me?.schoolId) { notFound(res, 'No school linked to this account'); return; }

    const school = await prisma.school.findUnique({
      where: { id: me.schoolId },
      include: {
        members: {
          where: MEMBER_FILTER,
          select: { id: true, name: true, points: true },
          orderBy: { points: 'desc' },
        },
      },
    });
    if (!school) { notFound(res); return; }

    // Compute this school's rank within the full leaderboard.
    const all = await prisma.school.findMany({
      include: { members: { where: MEMBER_FILTER, select: { points: true } } },
    });
    const sorted = all.map(aggregate).sort(rankCompare);
    const position = sorted.findIndex((s) => s.id === school.id);
    const agg = aggregate(school);

    ok(res, {
      ...agg,
      code: school.code,
      members: school.members,
      rank: agg.ranked ? position + 1 : null,
      totalSchools: sorted.length,
      minRankedMembers: MIN_RANKED_MEMBERS,
    });
  } catch {
    serverError(res);
  }
}

/** POST /api/schools/join { code } — authenticated user joins a school. */
export async function joinSchool(req: AuthRequest, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) { badRequest(res, 'Validation failed', errors.array()); return; }

  const code = String((req.body as { code: string }).code).trim().toUpperCase();
  try {
    const school = await prisma.school.findUnique({ where: { code } });
    if (!school) { notFound(res, 'No school found for this code'); return; }

    await prisma.user.update({
      where: { id: req.user!.userId },
      data: { schoolId: school.id },
    });
    ok(res, { id: school.id, name: school.name, code: school.code });
  } catch {
    serverError(res);
  }
}

/** POST /api/schools/leave — authenticated user leaves their school. */
export async function leaveSchool(req: AuthRequest, res: Response) {
  try {
    await prisma.user.update({
      where: { id: req.user!.userId },
      data: { schoolId: null },
    });
    ok(res, null, 'Left school');
  } catch {
    serverError(res);
  }
}

/** POST /api/admin/schools — admin creates a school (+ optional SCHOOL login). */
export async function createSchool(req: AuthRequest, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) { badRequest(res, 'Validation failed', errors.array()); return; }

  const body = req.body as {
    name: string;
    code: string;
    location?: string;
    coordinatorEmail?: string;
    coordinatorName?: string;
    coordinatorPassword?: string;
  };
  const code = body.code.trim().toUpperCase();

  try {
    const existing = await prisma.school.findUnique({ where: { code } });
    if (existing) { conflict(res, 'School code already in use'); return; }

    const school = await prisma.school.create({
      data: { name: body.name.trim(), code, location: body.location?.trim() || null },
    });

    // Optionally provision the school's coordinator login (role SCHOOL).
    let coordinator: { email: string; password: string } | undefined;
    if (body.coordinatorEmail) {
      const email = body.coordinatorEmail.trim().toLowerCase();
      const emailTaken = await prisma.user.findUnique({ where: { email } });
      if (emailTaken) { conflict(res, 'Coordinator email already registered'); return; }

      const plain = body.coordinatorPassword?.trim() || generatePassword();
      const hashed = await bcrypt.hash(plain, 12);
      await prisma.user.create({
        data: {
          email,
          password: hashed,
          name: body.coordinatorName?.trim() || `${body.name.trim()} Coordinator`,
          role: 'SCHOOL',
          schoolId: school.id,
        },
      });
      // Return the plaintext password ONCE so the admin can hand it over.
      coordinator = { email, password: plain };
    }

    created(res, { school, coordinator });
  } catch {
    serverError(res);
  }
}

/** PUT /api/admin/schools/:id — admin edits a school. */
export async function updateSchool(req: AuthRequest, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) { badRequest(res, 'Validation failed', errors.array()); return; }

  const id = req.params['id'] as string;
  const body = req.body as { name?: string; code?: string; location?: string };
  try {
    const school = await prisma.school.findUnique({ where: { id } });
    if (!school) { notFound(res); return; }

    if (body.code) {
      const code = body.code.trim().toUpperCase();
      const clash = await prisma.school.findUnique({ where: { code } });
      if (clash && clash.id !== id) { conflict(res, 'School code already in use'); return; }
    }

    const updated = await prisma.school.update({
      where: { id },
      data: {
        ...(body.name !== undefined ? { name: body.name.trim() } : {}),
        ...(body.code !== undefined ? { code: body.code.trim().toUpperCase() } : {}),
        ...(body.location !== undefined ? { location: body.location.trim() || null } : {}),
      },
    });
    ok(res, updated);
  } catch {
    serverError(res);
  }
}

/** DELETE /api/admin/schools/:id — admin deletes a school (members are unlinked). */
export async function deleteSchool(req: AuthRequest, res: Response) {
  const id = req.params['id'] as string;
  try {
    const school = await prisma.school.findUnique({ where: { id } });
    if (!school) { notFound(res); return; }
    // FK is ON DELETE SET NULL → members (and coordinator) keep their account,
    // just lose the school link.
    await prisma.school.delete({ where: { id } });
    ok(res, null, 'School deleted');
  } catch {
    serverError(res);
  }
}

// Readable random join-time password for an auto-provisioned coordinator login.
function generatePassword(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
  let out = '';
  for (let i = 0; i < 12; i += 1) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}
