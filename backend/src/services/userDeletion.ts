import type { PrismaClient } from '@prisma/client';

/** Thrown when a user still owns structural data that blocks a clean deletion. */
export class UserDeletionBlockedError extends Error {
  constructor(public readonly code: string) {
    super(code);
    this.name = 'UserDeletionBlockedError';
  }
}

/**
 * Build the GDPR data-export bundle for one user (Art. 15/20 — access &
 * portability). Returns everything personal we hold, ready to be serialised to
 * JSON. Read-only.
 */
export async function buildUserExport(prisma: PrismaClient, userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true, email: true, username: true, name: true, role: true,
      points: true, language: true, profile: true, active: true,
      acceptedTermsAt: true, createdAt: true,
    },
  });
  if (!user) return null;

  const [participations, eventRegistrations, ideas, submissions, eventProposals, comments, badges] =
    await Promise.all([
      prisma.participation.findMany({ where: { userId }, select: { projectId: true, joinedAt: true, pointsAwarded: true } }),
      prisma.eventRegistration.findMany({ where: { userId }, select: { eventId: true, createdAt: true, pointsAwarded: true } }),
      prisma.idea.findMany({ where: { userId }, select: { id: true, title: true, description: true, category: true, status: true, createdAt: true } }),
      prisma.submission.findMany({ where: { userId }, select: { id: true, type: true, message: true, status: true, createdAt: true } }),
      prisma.eventProposal.findMany({ where: { userId }, select: { id: true, title: true, description: true, category: true, status: true, createdAt: true } }),
      prisma.comment.findMany({ where: { userId }, select: { id: true, body: true, ideaId: true, eventId: true, createdAt: true } }),
      prisma.userBadge.findMany({ where: { userId }, select: { badgeId: true, earnedAt: true } }),
    ]);

  return {
    exportedAt: new Date().toISOString(),
    note: 'GDPR data export (Art. 15/20). Contains all personal data held for this account.',
    user,
    participations,
    eventRegistrations,
    ideas,
    submissions,
    eventProposals,
    comments,
    badges,
  };
}

/**
 * Delete a user and clean up all related rows in ONE transaction (GDPR Art. 17 —
 * right to erasure). Content with public/community value (ideas, submissions,
 * event proposals) is ANONYMISED (the user link and any submitter name/email are
 * cleared) so boards/threads stay coherent; everything strictly personal
 * (participations, RSVPs, badges, tokens, likes, the user's own comments and
 * notifications) is removed.
 *
 * Deletion is blocked if the user still owns projects (they authored municipal
 * content); the caller should reassign those first. Regular citizens never hit
 * this. Throws {@link UserDeletionBlockedError} with a stable code on a block.
 */
export async function deleteUserCompletely(prisma: PrismaClient, userId: string): Promise<void> {
  const createdProjects = await prisma.project.count({ where: { createdById: userId } });
  if (createdProjects > 0) {
    throw new UserDeletionBlockedError('USER_HAS_PROJECTS');
  }

  await prisma.$transaction(async (tx) => {
    // 1) The user's own comments: clear likes on them, then delete (mention
    //    notifications cascade via Notification.commentId).
    const ownComments = await tx.comment.findMany({ where: { userId }, select: { id: true } });
    const ownCommentIds = ownComments.map((c) => c.id);
    if (ownCommentIds.length > 0) {
      await tx.commentLike.deleteMany({ where: { commentId: { in: ownCommentIds } } });
      await tx.comment.deleteMany({ where: { id: { in: ownCommentIds } } });
    }

    // 2) Strictly personal rows (Restrict relations → must be removed first).
    await tx.commentLike.deleteMany({ where: { userId } });
    await tx.participation.deleteMany({ where: { userId } });
    await tx.eventRegistration.deleteMany({ where: { userId } });
    await tx.userBadge.deleteMany({ where: { userId } });
    await tx.refreshToken.deleteMany({ where: { userId } });

    // 3) Anonymise community content instead of deleting it.
    await tx.idea.updateMany({
      where: { userId },
      data: { userId: null, submitterName: null, submitterEmail: null },
    });
    await tx.submission.updateMany({
      where: { userId },
      data: { userId: null, submitterName: null, submitterEmail: null },
    });
    await tx.eventProposal.updateMany({
      where: { userId },
      data: { userId: null, submitterName: null, submitterEmail: null },
    });

    // 4) Detach notifications this user triggered for others (actor is optional).
    await tx.notification.updateMany({ where: { actorId: userId }, data: { actorId: null } });

    // 5) Finally delete the user. Received notifications and idea votes cascade.
    await tx.user.delete({ where: { id: userId } });
  });
}
