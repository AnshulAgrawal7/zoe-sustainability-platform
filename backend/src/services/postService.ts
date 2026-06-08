// Post (news/blog) helpers. Auto-posts are derived from a project's existing
// trilingual fields, so no extra translation call is needed.
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export type AutoPostType = 'PROJECT_NEW' | 'PROJECT_COMPLETED';

interface ProjectLike {
  id: string;
  titleEn: string;
  titleEl: string;
  titleDe: string;
  descriptionEn: string;
  descriptionEl: string;
  descriptionDe: string;
  imageUrl: string | null;
}

// Localized title prefixes for each auto-post type (EN/EL/DE).
const TITLE_PREFIX: Record<AutoPostType, { en: string; el: string; de: string }> = {
  PROJECT_NEW: { en: 'New project: ', el: 'Νέο έργο: ', de: 'Neues Projekt: ' },
  PROJECT_COMPLETED: { en: 'Completed: ', el: 'Ολοκληρώθηκε: ', de: 'Abgeschlossen: ' },
};

/**
 * Create an auto-post for a project lifecycle event, unless one of that type
 * already exists for the project (idempotent — safe to call on every update).
 * Never throws; returns the created post or null.
 */
export async function createAutoPost(
  project: ProjectLike,
  type: AutoPostType,
): Promise<{ id: string } | null> {
  try {
    const existing = await prisma.post.findFirst({
      where: { projectId: project.id, type },
      select: { id: true },
    });
    if (existing) return null;

    const p = TITLE_PREFIX[type];
    const post = await prisma.post.create({
      data: {
        type,
        titleEn: p.en + project.titleEn,
        titleEl: p.el + project.titleEl,
        titleDe: p.de + project.titleDe,
        bodyEn: project.descriptionEn,
        bodyEl: project.descriptionEl,
        bodyDe: project.descriptionDe,
        imageUrl: project.imageUrl,
        published: true,
        projectId: project.id,
      },
      select: { id: true },
    });
    return post;
  } catch {
    // Auto-posts must never break the project create/update flow.
    return null;
  }
}
