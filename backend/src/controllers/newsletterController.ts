import type { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { ok, badRequest } from '../utils/response';

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
