import type { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { ok, badRequest, notFound, serverError } from '../utils/response';

const prisma = new PrismaClient();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const LOCALES = ['en', 'el', 'de'] as const;

// PROTOTYPE newsletter opt-in (F): records an email + locale only. There is NO
// mailing / double-opt-in / unsubscribe system. Idempotent — the unique email
// makes re-submitting the same address a no-op.
export async function subscribe(req: Request, res: Response): Promise<void> {
  const email = String(req.body?.['email'] ?? '')
    .trim()
    .toLowerCase();
  const rawLocale = String(req.body?.['locale'] ?? 'en');
  const locale = (LOCALES as readonly string[]).includes(rawLocale)
    ? rawLocale
    : 'en';

  if (!EMAIL_RE.test(email)) {
    badRequest(res, 'Invalid email');
    return;
  }

  try {
    await prisma.newsletterSignup.upsert({
      where: { email },
      update: {}, // idempotent — same address is not stored twice
      create: { email, locale },
    });
    ok(res, { stored: true });
  } catch {
    // The table may not be migrated yet in the target DB (migration PENDING).
    // This is an explicit prototype stub (no real mailing), so we confirm to the
    // user instead of surfacing a 500. The signup simply isn't persisted then.
    ok(res, { stored: false });
  }
}

// --- Admin: manage newsletter signups (Future Work 4.4) ---

// List all signups, newest first, with a total count.
export async function listSignups(_req: Request, res: Response): Promise<void> {
  try {
    const signups = await prisma.newsletterSignup.findMany({
      orderBy: { createdAt: 'desc' },
    });
    ok(res, { signups, total: signups.length });
  } catch {
    serverError(res);
  }
}

// Remove a single signup (right to erasure / list hygiene).
export async function deleteSignup(req: Request, res: Response): Promise<void> {
  const id = String(req.params['id'] ?? '');
  try {
    await prisma.newsletterSignup.delete({ where: { id } });
    ok(res, { deleted: true });
  } catch {
    notFound(res, 'Signup not found');
  }
}

// CSV export of all signups (email,locale,createdAt) for an external mailing
// tool or records. Escapes quotes per RFC 4180.
export async function exportSignups(_req: Request, res: Response): Promise<void> {
  try {
    const signups = await prisma.newsletterSignup.findMany({
      orderBy: { createdAt: 'desc' },
    });
    const escape = (v: string): string => `"${v.replace(/"/g, '""')}"`;
    const rows = [
      'email,locale,createdAt',
      ...signups.map((s) =>
        [s.email, s.locale, s.createdAt.toISOString()].map(escape).join(',')
      ),
    ];
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="newsletter-signups.csv"'
    );
    res.send(rows.join('\r\n'));
  } catch {
    serverError(res);
  }
}
