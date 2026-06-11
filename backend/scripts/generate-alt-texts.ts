// Generate trilingual alt texts (EL / DE / EN) for every FeedPostImage. WCAG 2.1
// AA / EU Web Accessibility Directive (2016/2102).
//
// The English BASE descriptions live in ./alt-text-descriptions.ts. They were
// authored by visually inspecting each image and describe ONLY what is visible:
// no guesses about people's identities, no "image of…/photo showing…" framing.
// An empty string ("") is a DELIBERATE decorative-image marker (correct
// empty-alt behaviour, not an omission). This script translates each EN base
// into DE and EL via DeepL, then upserts one row per (image, locale).
//
// Idempotent: re-running upserts the same rows (no duplicates). Manually
// reviewed entries (needsReview = false) are NEVER overwritten.
//
// Run:  cd backend && npx ts-node scripts/generate-alt-texts.ts
//
// Needs in backend/.env: DATABASE_URL (Supabase), DEEPL_API_KEY (EN -> DE/EL).
import { PrismaClient } from '@prisma/client';
import { translateBatch } from '../src/services/translationService';
import { ALT_TEXTS_EN } from './alt-text-descriptions';

const prisma = new PrismaClient();
const LOCALES = ['el', 'de', 'en'] as const;
const DEEPL_CHUNK = 40; // DeepL allows up to 50 text params per request

async function translateChunked(
  texts: string[],
  target: 'DE' | 'EL'
): Promise<string[]> {
  const out: string[] = [];
  for (let i = 0; i < texts.length; i += DEEPL_CHUNK) {
    out.push(
      ...(await translateBatch(texts.slice(i, i + DEEPL_CHUNK), 'EN', target))
    );
  }
  return out;
}

async function main() {
  if (!process.env['DEEPL_API_KEY']) {
    throw new Error(
      'DEEPL_API_KEY missing in backend/.env (needed for EN->DE/EL).'
    );
  }

  const images = await prisma.feedPostImage.findMany({
    include: { altTexts: true },
    orderBy: [{ postId: 'asc' }, { order: 'asc' }],
  });

  // An image is worked on only if it has an authored EN base AND at least one
  // locale that is still writable (not manually reviewed).
  const missing: string[] = [];
  const work = images
    .map((img) => {
      const base = ALT_TEXTS_EN[img.storagePath];
      if (base === undefined) {
        missing.push(img.storagePath);
        return null;
      }
      const locked = new Set(
        img.altTexts.filter((a) => !a.needsReview).map((a) => a.locale)
      );
      return { img, base, locked };
    })
    .filter(
      (
        x
      ): x is {
        img: (typeof images)[number];
        base: string;
        locked: Set<string>;
      } => x !== null && x.locked.size < LOCALES.length
    );

  // Translate only the non-empty bases (decorative "" stays "" in every locale).
  const nonEmpty = work.filter((w) => w.base.trim() !== '');
  const enTexts = nonEmpty.map((w) => w.base);
  const [deTexts, elTexts] = enTexts.length
    ? await Promise.all([
        translateChunked(enTexts, 'DE'),
        translateChunked(enTexts, 'EL'),
      ])
    : [[] as string[], [] as string[]];
  const deByPath = new Map<string, string>();
  const elByPath = new Map<string, string>();
  nonEmpty.forEach((w, i) => {
    deByPath.set(w.img.storagePath, deTexts[i] ?? w.base);
    elByPath.set(w.img.storagePath, elTexts[i] ?? w.base);
  });

  let written = 0;
  let skippedLocked = 0;
  let decorative = 0;
  for (const { img, base, locked } of work) {
    const empty = base.trim() === '';
    if (empty) decorative++;
    const byLocale: Record<string, string> = {
      en: base,
      de: empty ? '' : (deByPath.get(img.storagePath) ?? base),
      el: empty ? '' : (elByPath.get(img.storagePath) ?? base),
    };
    for (const locale of LOCALES) {
      if (locked.has(locale)) {
        skippedLocked++;
        continue;
      }
      await prisma.feedPostImageAltText.upsert({
        where: { imageId_locale: { imageId: img.id, locale } },
        update: { text: byLocale[locale]!, needsReview: true },
        create: {
          imageId: img.id,
          locale,
          text: byLocale[locale]!,
          needsReview: true,
        },
      });
      written++;
    }
  }

  console.log('— Alt-text generation —');
  console.log(`images total:        ${images.length}`);
  console.log(`processed:           ${work.length}`);
  console.log(`alt rows written:    ${written}`);
  console.log(`decorative (empty):  ${decorative} image(s)`);
  console.log(`skipped (reviewed):  ${skippedLocked} locale row(s)`);
  if (missing.length) {
    console.log(
      `\nNO base description for ${missing.length} image(s) — add them to alt-text-descriptions.ts:`
    );
    missing.forEach((m) => console.log('   ', m));
  }
  console.log(
    '\nAll written rows have needsReview=true — review them in the admin (Edit feed post → Images) before they go public.'
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => void prisma.$disconnect());
