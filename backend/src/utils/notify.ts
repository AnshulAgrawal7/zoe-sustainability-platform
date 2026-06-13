import type { PrismaClient } from '@prisma/client';

export type StatusNotificationType =
  | 'IDEA_STATUS'
  | 'PROPOSAL_STATUS'
  | 'SUBMISSION_STATUS';

interface StatusNotificationInput {
  userId: string | null | undefined;
  type: StatusNotificationType;
  status: string;
  message?: string | null;
  ideaId?: string | null;
  eventId?: string | null;
  submissionId?: string | null;
}

// Create an in-app notification for the citizen who submitted an idea / event
// proposal / report, telling them an admin changed its status (with an optional
// note). No-op for anonymous submissions (no userId). Best-effort: callers wrap
// in catch so a notification failure never blocks the status update itself.
export async function notifyStatusChange(
  prisma: PrismaClient,
  input: StatusNotificationInput
): Promise<void> {
  if (!input.userId) return;
  await prisma.notification.create({
    data: {
      userId: input.userId,
      type: input.type,
      status: input.status,
      message: input.message?.trim() || null,
      ideaId: input.ideaId ?? null,
      eventId: input.eventId ?? null,
      submissionId: input.submissionId ?? null,
      read: false,
    },
  });
}
