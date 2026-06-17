import type { PrismaClient } from '@prisma/client';
import { logger } from './logger';

export type AuditAction =
  | 'ROLE_CHANGE'
  | 'ACCOUNT_SUSPEND'
  | 'ACCOUNT_REACTIVATE'
  | 'POINTS_ADJUST'
  | 'ACCOUNT_DELETE';

interface AuditInput {
  actorId: string;
  actorEmail: string;
  action: AuditAction;
  targetType: string;
  targetId?: string | null;
  targetLabel?: string | null;
  detail?: string | null;
}

/**
 * Append a row to the admin audit trail (Future_Work §4.2). Best-effort: a
 * logging failure must never abort the action it records, so errors are
 * swallowed (and surfaced to error-tracking in production — see §8.4).
 */
export async function writeAudit(prisma: PrismaClient, input: AuditInput): Promise<void> {
  try {
    await prisma.adminAuditLog.create({
      data: {
        actorId: input.actorId,
        actorEmail: input.actorEmail,
        action: input.action,
        targetType: input.targetType,
        targetId: input.targetId ?? null,
        targetLabel: input.targetLabel ?? null,
        detail: input.detail ?? null,
      },
    });
  } catch (err) {
    logger.error('audit.write_failed', {
      error: err instanceof Error ? err.message : String(err),
    });
  }
}
