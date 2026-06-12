// Idempotent removal of source/citation clauses from user-visible free-text DB
// fields (L1). We declare the figures as illustrative demo data, so the inline
// provenance — "(programme figure: Verde.tec 2026)", "(Attica Green Expo 2026 …)",
// "Municipal programme data, not a ZOE impact measurement." etc. — is stripped
// from project descriptions, value-chain outputs and the news Post bodies.
//
// Run:  cd backend && node --env-file=.env -r ts-node/register/transpile-only \
//         scripts/scrub-source-citations.ts            (apply)
//       …same… --dry-run                                (report only)
//
// Idempotent: the regexes match only the citation clauses, so a second run is a
// no-op. Discrete "Source:/Quelle:" labels are already removed in the UI; this
// only touches text that embeds the citation inline.
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const DRY = process.argv.includes('--dry-run');

// Any parenthetical that CONTAINS a source/figure-provenance keyword, e.g.
// "(Verde.tec 2026)", "(programme figure: Verde.tec 2026)", "(municipal programme
// figure)", "(στοιχείο προγράμματος)", "(Programmangabe)". The lookahead keys on
// the content, so it matches regardless of where the keyword sits in the clause.
// DELIBERATELY does NOT list "programme target" / "στόχος προγράμματος" /
// "Programmziel": those are honest goal qualifiers, not source citations — kept.
const PAREN =
  /\s*\((?=[^)]*(?:Verde\.tec|Attica Green Expo|kerkyrasimera|life-news|programme figure|municipal programme figure|Programmangaben?|Programmbeschreibung|programme description|στοιχείο|Περιγραφή προγράμματος))[^)]*\)/gi;
// Standalone provenance sentences (optionally carrying a trailing "(…)" source).
const SENT =
  /\s*(?:Figures are (?:municipal )?programme data(?:\s*\([^)]*\))?\.|Figures are municipal programme data, not a ZOE impact measurement\.|Municipal programme data, not a ZOE impact measurement\.|Στοιχεία προγράμματος, όχι μέτρηση επίδρασης\.|Programmangaben, keine Wirkungsmessung\.)/gi;

function scrub(s: string | null): string | null {
  if (!s) return s;
  // SENT first (it swallows a trailing "(…)" source as one unit), then PAREN.
  return s.replace(SENT, '').replace(PAREN, '').replace(/\s{2,}/g, ' ').trim();
}

async function main() {
  let changed = 0;

  const projects = await prisma.project.findMany();
  for (const p of projects) {
    const data = {
      descriptionEn: scrub(p.descriptionEn)!,
      descriptionEl: scrub(p.descriptionEl)!,
      descriptionDe: scrub(p.descriptionDe)!,
      outputResultsEn: scrub(p.outputResultsEn),
      outputResultsEl: scrub(p.outputResultsEl),
      outputResultsDe: scrub(p.outputResultsDe),
    };
    const diff = (Object.keys(data) as (keyof typeof data)[]).filter(
      (k) => data[k] !== (p as unknown as Record<string, unknown>)[k]
    );
    if (diff.length) {
      console.log(`project ${p.id}: ${diff.join(', ')}`);
      if (!DRY) await prisma.project.update({ where: { id: p.id }, data });
      changed += diff.length;
    }
  }

  const posts = await prisma.post.findMany();
  for (const post of posts) {
    const data = {
      bodyEn: scrub(post.bodyEn)!,
      bodyEl: scrub(post.bodyEl)!,
      bodyDe: scrub(post.bodyDe)!,
    };
    const diff = (Object.keys(data) as (keyof typeof data)[]).filter(
      (k) => data[k] !== (post as unknown as Record<string, unknown>)[k]
    );
    if (diff.length) {
      console.log(`post ${post.id}: ${diff.join(', ')}`);
      if (!DRY) await prisma.post.update({ where: { id: post.id }, data });
      changed += diff.length;
    }
  }

  console.log(`\n${DRY ? '[DRY] would change' : 'changed'} ${changed} field(s).`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
