// One-off, idempotent import of the VBM Kokkali Facebook posts into the
// "What's New" feed. Re-running upserts by `sourceFolder` (no duplicates).
//
// Run:  cd backend && npx ts-node scripts/import-facebook-posts.ts
//
// Needs in backend/.env: DATABASE_URL (Supabase), DEEPL_API_KEY (EL->DE/EN),
// SUPABASE_URL + SERVICE_ROLE_KEY (image upload to the post-images bucket).
import { PrismaClient } from '@prisma/client';
import type { PostCategory, EventStatus } from '@prisma/client';
import { readFileSync, readdirSync } from 'fs';
import path from 'path';
import { imageSize } from 'image-size';
import { translateBatch } from '../src/services/translationService';
import {
  ensureBucket,
  uploadImage,
  isStorageConfigured,
} from '../src/services/storage';

const prisma = new PrismaClient();
const SOURCE_DIR = path.resolve(__dirname, '../../Posts_Kokkali_Facebook');
// eventStatus cut-off: a dated EVENT before today is COMPLETED, else UPCOMING.
const TODAY = new Date('2026-06-11T00:00:00Z');

// Category per folder, authored from reading the Greek headlines. EVENTs get an
// eventStatus from the date. Admins can correct any of this later.
const CLASSIFICATION: Record<string, { category: PostCategory; reason: string }> = {
  '1': { category: 'EVENT', reason: 'School celebration (Tom Cat show) — a dated happening' },
  '2': { category: 'EVENT', reason: 'Annual Tom Cat school show — a dated happening' },
  '3': { category: 'ANNOUNCEMENT', reason: 'Statement/message for World Environment Day' },
  '4': { category: 'EVENT', reason: 'World Environment Day awareness action (Δράση)' },
  '5': { category: 'EVENT', reason: '"Strawberry Day" experiential education event' },
  '6': { category: 'NEWS', reason: 'ERT3 TV feature on the Klimatia waterfalls (media coverage)' },
  '7': { category: 'NEWS', reason: 'Honorary distinction at the Attica Green Expo (award)' },
  '8': { category: 'ANNOUNCEMENT', reason: 'Personal statement about coordinating an event' },
  '9': { category: 'EVENT', reason: '"Spring in a Bottle" education event' },
  '10': { category: 'NEWS', reason: 'Hellenic Red Cross regional-branch elections (news)' },
  '11': { category: 'ANNOUNCEMENT', reason: 'ECPE (Michigan Proficiency) exams info' },
  '12': { category: 'EVENT', reason: '7th preventive-medicine health action (report)' },
  '13': { category: 'EVENT', reason: 'Municipality + school environmental activity' },
  '14': { category: 'NEWS', reason: 'Discovery of a new waterfall (news item)' },
  '15': { category: 'NEWS', reason: 'Municipality presence at a conference (coverage)' },
  '16': { category: 'EVENT', reason: '"Bees & Honey Day" education event' },
  '17': { category: 'EVENT', reason: "Students' educational visit (event)" },
  '18': { category: 'NEWS', reason: 'Municipality ranked among the top 6 (recognition)' },
  '19': { category: 'NEWS', reason: 'Informational meeting at the Ministry of Shipping' },
  '20': { category: 'EVENT', reason: '7th preventive-medicine action (announcement)' },
};

const IMG_EXT = /\.(jpe?g|png|webp)$/i;

function parseDate(firstLine: string): Date {
  const m = firstLine.trim().match(/^(\d{2})\.(\d{2})\.(\d{4})/);
  if (!m) throw new Error(`first line is not a DD.MM.YYYY date: "${firstLine}"`);
  return new Date(Date.UTC(Number(m[3]), Number(m[2]) - 1, Number(m[1])));
}

// Short headline: first non-empty line, leading emojis/bullets stripped, ~80 chars.
function makeHeadline(body: string): string {
  const first = body.split('\n').map((s) => s.trim()).find(Boolean) ?? '';
  const cleaned = first.replace(/^[^\p{L}\p{N}«"]+/u, '').trim();
  return cleaned.length > 80 ? `${cleaned.slice(0, 79).trimEnd()}…` : cleaned;
}

function naturalSort(a: string, b: string): number {
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
}

function contentType(file: string): string {
  if (/\.png$/i.test(file)) return 'image/png';
  if (/\.webp$/i.test(file)) return 'image/webp';
  return 'image/jpeg';
}

async function main() {
  if (!process.env['DEEPL_API_KEY']) {
    throw new Error('DEEPL_API_KEY missing in backend/.env (needed for EL->DE/EN).');
  }
  if (!isStorageConfigured()) {
    throw new Error(
      'SUPABASE_URL / SERVICE_ROLE_KEY missing in backend/.env (needed for image upload).'
    );
  }
  await ensureBucket();

  const summary: Array<{
    folder: string;
    date: string;
    category: string;
    eventStatus: string;
    images: number;
  }> = [];

  for (let i = 1; i <= 20; i++) {
    const folder = String(i);
    const dir = path.join(SOURCE_DIR, folder);
    const files = readdirSync(dir);
    const txt = files.find((f) => f.toLowerCase().endsWith('.txt'));
    if (!txt) {
      console.warn(`[${folder}] no .txt found — skipping`);
      continue;
    }

    const raw = readFileSync(path.join(dir, txt), 'utf8');
    const lines = raw.split(/\r?\n/);
    const firstLine = lines[0] ?? '';
    const publishedAt = parseDate(firstLine);
    const elBody = lines.slice(1).join('\n').trim();
    const elHeadline = makeHeadline(elBody);

    const cls = CLASSIFICATION[folder] ?? {
      category: 'NEWS' as PostCategory,
      reason: 'default (no rule)',
    };
    const category = cls.category;
    const eventStatus: EventStatus | null =
      category === 'EVENT' ? (publishedAt < TODAY ? 'COMPLETED' : 'UPCOMING') : null;
    console.log(
      `[${folder}] ${firstLine.trim()} -> ${category}${eventStatus ? `/${eventStatus}` : ''} — ${cls.reason}`
    );

    // DeepL: translate [headline, body] EL -> DE and EL -> EN.
    const [de, en] = await Promise.all([
      translateBatch([elHeadline, elBody], 'EL', 'DE'),
      translateBatch([elHeadline, elBody], 'EL', 'EN'),
    ]);

    // Images: natural-sorted, uploaded to posts/<folder>/<filename>.
    const imgFiles = files.filter((f) => IMG_EXT.test(f)).sort(naturalSort);
    const images: Array<{
      storagePath: string;
      publicUrl: string;
      order: number;
      width: number | null;
      height: number | null;
    }> = [];
    for (let idx = 0; idx < imgFiles.length; idx++) {
      const fname = imgFiles[idx] as string;
      const buf = readFileSync(path.join(dir, fname));
      let width: number | null = null;
      let height: number | null = null;
      try {
        const d = imageSize(buf);
        width = d.width ?? null;
        height = d.height ?? null;
      } catch {
        /* dimensions optional */
      }
      const storagePath = `posts/${folder}/${fname}`;
      const { publicUrl } = await uploadImage(storagePath, buf, contentType(fname));
      images.push({ storagePath, publicUrl, order: idx, width, height });
    }

    // Idempotent upsert by sourceFolder; translations + images are replaced.
    const post = await prisma.feedPost.upsert({
      where: { sourceFolder: folder },
      create: { category, eventStatus, publishedAt, sourceFolder: folder, needsReview: true },
      update: { category, eventStatus, publishedAt, needsReview: true },
    });
    await prisma.feedPostTranslation.deleteMany({ where: { postId: post.id } });
    await prisma.feedPostTranslation.createMany({
      data: [
        { postId: post.id, locale: 'el', title: elHeadline, body: elBody, isMachineTranslated: false },
        { postId: post.id, locale: 'de', title: de[0] ?? elHeadline, body: de[1] ?? elBody, isMachineTranslated: true },
        { postId: post.id, locale: 'en', title: en[0] ?? elHeadline, body: en[1] ?? elBody, isMachineTranslated: true },
      ],
    });
    await prisma.feedPostImage.deleteMany({ where: { postId: post.id } });
    if (images.length) {
      await prisma.feedPostImage.createMany({
        data: images.map((im) => ({ postId: post.id, ...im })),
      });
    }

    summary.push({
      folder,
      date: firstLine.trim(),
      category,
      eventStatus: eventStatus ?? '—',
      images: images.length,
    });
  }

  console.log('\n=== Import summary ===');
  console.table(summary);
  console.log(
    'All posts have needsReview=true. Review the DE/EN machine translations and add image alt-texts in the admin.'
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
