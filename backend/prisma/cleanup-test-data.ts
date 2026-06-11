// Reusable cleanup of E2E test artefacts from the persistent (Supabase) DB.
//
// E2E runs against the real Supabase DB and leave behind test ideas/comments
// (e.g. "E2E board 1781…", description "Automated end-to-end idea submission")
// that then show up on the public /ideas board and the landing "From the
// community" section. Run this before a demo to remove them:
//
//   cd backend && npx ts-node prisma/cleanup-test-data.ts
//
// It deletes ONLY clear test artefacts. The 4 seeded ACCEPTED demo ideas
// (idea-demo-*) and any genuine citizen ideas are left untouched. It is also
// run automatically after every Playwright run (see e2e/global-teardown.ts).
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // 1) Test ideas — title starts with "E2E", the automated description, or a
  //    test-fixture reply email. Seeded demo ideas (idea-demo-*) never match.
  const testIdeas = await prisma.idea.findMany({
    where: {
      OR: [
        { title: { startsWith: 'E2E' } },
        { description: { contains: 'Automated end-to-end' } },
        { submitterEmail: { startsWith: 'reply-', endsWith: '@example.com' } },
      ],
    },
    select: { id: true },
  });
  const testIdeaIds = testIdeas.map((i) => i.id);

  // 2) Test comments — the E2E comment marker, plus any comment on a test idea.
  const testComments = await prisma.comment.findMany({
    where: {
      OR: [
        { body: { startsWith: 'E2E comment' } },
        ...(testIdeaIds.length ? [{ ideaId: { in: testIdeaIds } }] : []),
      ],
    },
    select: { id: true },
  });
  const testCommentIds = testComments.map((c) => c.id);

  // 3) Delete in FK-safe order: likes -> comments -> ideas.
  const likes = testCommentIds.length
    ? await prisma.commentLike.deleteMany({
        where: { commentId: { in: testCommentIds } },
      })
    : { count: 0 };
  const comments = testCommentIds.length
    ? await prisma.comment.deleteMany({ where: { id: { in: testCommentIds } } })
    : { count: 0 };
  const ideas = testIdeaIds.length
    ? await prisma.idea.deleteMany({ where: { id: { in: testIdeaIds } } })
    : { count: 0 };

  console.log(
    `Cleanup: removed ${ideas.count} test ideas, ${comments.count} test comments, ${likes.count} comment likes.`
  );

  // 4) Safety check: the 4 seeded ACCEPTED demo ideas must still be present.
  const demo = await prisma.idea.count({
    where: { id: { startsWith: 'idea-demo-' } },
  });
  console.log(
    `Seeded demo ideas present: ${demo}/4` +
      (demo < 4 ? ' — run `npm run db:seed` to restore them.' : ' OK')
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
