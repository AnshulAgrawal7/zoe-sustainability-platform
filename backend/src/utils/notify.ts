import type { PrismaClient } from '@prisma/client';
import { sendSubmissionStatusEmail } from '../services/mailService';

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

interface AnonSubmitterMailInput {
  submitterEmail?: string | null;
  userId?: string | null;
  /** Human label of what was reviewed, e.g. "idea", "report", "event proposal". */
  kindLabel: string;
  title: string;
  status: string;
  note?: string | null;
}

// E-mail the ANONYMOUS submitter (no account → no in-app bell) when an admin
// changes the status of their idea / report / event proposal (Future_Work §7.2).
// Deliberately a NO-OP for logged-in submitters (they already get the bell via
// notifyStatusChange) and when no e-mail address was provided. Best-effort:
// callers wrap in `.catch` so a mail failure never blocks the status update.
export async function emailAnonymousSubmitter(input: AnonSubmitterMailInput): Promise<void> {
  if (input.userId || !input.submitterEmail) return;
  await sendSubmissionStatusEmail({
    to: input.submitterEmail,
    kindLabel: input.kindLabel,
    title: input.title,
    status: input.status,
    note: input.note,
  });
}
