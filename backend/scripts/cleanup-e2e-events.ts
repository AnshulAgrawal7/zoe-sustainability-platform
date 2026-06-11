// Idempotent removal of leftover E2E-test events from the database (G1). The
// Playwright suite creates throwaway events titled "E2E Cleanup <timestamp>";
// these are not part of the seed and should not appear in the public demo.
//
// Run:  cd backend && node --env-file=.env -r ts-node/register/transpile-only \
//         scripts/cleanup-e2e-events.ts --dry-run     (report)
//       …same… (no flag)                              (apply — DESTRUCTIVE)
//
// DESTRUCTIVE: deletes Event rows (and their soft-referenced EventRegistration
// rows) whose title marks them as E2E fixtures. Idempotent: a second run finds
// nothing. NOT run automatically against prod — see the run-log PENDING section.
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const DRY = process.argv.includes('--dry-run');

async function main() {
  // E2E events are titled "E2E Cleanup <ts>" (titleEn) / "E2E Reinigung <ts>".
  const events = await prisma.event.findMany({
    where: { OR: [{ titleEn: { startsWith: 'E2E ' } }, { titleDe: { startsWith: 'E2E ' } }] },
    select: { id: true, titleEn: true, date: true },
  });

  if (events.length === 0) {
    console.log('No E2E events found — nothing to do.');
    return;
  }
  console.log(`Found ${events.length} E2E event(s):`);
  events.forEach((e) => console.log(`  ${e.id}  ${e.date.toISOString().slice(0, 10)}  ${e.titleEn}`));

  if (DRY) {
    console.log('\n[DRY] no deletions performed.');
    return;
  }

  const ids = events.map((e) => e.id);
  // EventRegistration.eventId is a SOFT reference (no FK) — clean its rows too.
  const regs = await prisma.eventRegistration.deleteMany({
    where: { eventId: { in: ids } },
  });
  const del = await prisma.event.deleteMany({ where: { id: { in: ids } } });
  console.log(`\nDeleted ${del.count} event(s) and ${regs.count} registration(s).`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
