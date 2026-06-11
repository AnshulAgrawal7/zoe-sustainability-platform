// One-off, idempotent import of the entity cover images (Events / Projects /
// News / Wissen) + the two branding logos into Supabase Storage, and persisting
// the public URL onto each entity's `imageUrl`.
//
// Run:  cd backend && npx ts-node scripts/import-entity-images.ts
//       cd backend && npx ts-node scripts/import-entity-images.ts --report-only
//
// Source: ../../Bilder_Events_Projekte_News  (local-only, gitignored)
// Needs in backend/.env: DATABASE_URL (Supabase), SUPABASE_URL + SERVICE_ROLE_KEY.
//
// MATCHING HEURISTIC: the source filenames are German/­descriptive while the DB
// titles are trilingual (EN/EL/DE), so a purely automatic normalised-substring
// match is unreliable (e.g. "Green_Mov" ↔ "GreenMove — Sustainable Mobility",
// "Maine_Protection_Seaturtles" ↔ "Marine Protection & Sea Turtles"). The files
// are therefore mapped to entity IDs via the reviewed table below; every mapping
// is verified against the live DB at runtime and logged. Unmatched files and
// entities without an image are reported, never guessed.
//
// IDEMPOTENCY: the target public URL is deterministic. If an entity already
// carries exactly that URL, the file is neither re-uploaded nor re-written.
// Otherwise the object is upserted (same path → same content) and imageUrl set.
import { PrismaClient } from '@prisma/client';
import { readFileSync, existsSync, readdirSync } from 'fs';
import path from 'path';
import {
  ensureBucket,
  uploadImage,
  isStorageConfigured,
  getStorageClient,
  ENTITY_IMAGES_BUCKET,
} from '../src/services/storage';

const prisma = new PrismaClient();
const SOURCE_DIR = path.resolve(__dirname, '../../Bilder_Events_Projekte_News');
const REPORT_ONLY = process.argv.includes('--report-only');

type EntityType = 'project' | 'event' | 'learn' | 'post';

interface Mapping {
  type: EntityType;
  id: string;
  // path relative to SOURCE_DIR
  file: string;
}

// Reviewed filename → entity mapping (folder/filename ↔ entity id).
const MAPPINGS: Mapping[] = [
  // --- Projects/ → Project.imageUrl ---
  { type: 'project', id: 'proj-natural-monuments', file: 'Projects/Natural_Monuments.jpeg' },
  { type: 'project', id: 'proj-marine', file: 'Projects/Maine_Protection_Seaturtles.jpeg' },
  { type: 'project', id: 'proj-antinioti', file: 'Projects/Antinioti_lagoon.jpeg' },
  { type: 'project', id: 'proj-water-quality', file: 'Projects/Drinking_Water.jpeg' },
  { type: 'project', id: 'proj-education', file: 'Projects/Environmental_Education.jpeg' },
  { type: 'project', id: 'proj-greenmove', file: 'Projects/Green_Mov.jpeg' },
  { type: 'project', id: 'proj-circular', file: 'Projects/Circular_Economy_Network.jpeg' },
  // --- Events/ → Event.imageUrl ---
  { type: 'event', id: 'evt-youth-eco', file: 'Events/Jugend_Umweltworkshop.jpeg' },
  { type: 'event', id: 'evt-water-monitoring', file: 'Events/Schulung_Wasser-Monitoring.png' },
  { type: 'event', id: 'evt-sdg-forum', file: 'Events/Jaehrliches_SDG_Forum.jpeg' },
  { type: 'event', id: 'evt-biodiversity-workshop', file: 'Events/Biodiverstitaets_Spaziergang.png' },
  { type: 'event', id: 'evt-composting-expansion', file: 'Events/Planung_der_Gemeinschaftskompostierung.png' },
  { type: 'event', id: 'evt-cleanup-jun25', file: 'Events/Kuestenreinigungstag_Nordkorfu.png' },
  { type: 'event', id: 'evt-cleanup-jul25', file: 'Events/Zweite_Kuestenreinigung.png' },
  { type: 'event', id: 'evt-recycling-hub', file: 'Events/Tag_der_offenen_Tuer.png' },
  // --- Wissen/ → LearningResource.imageUrl ---
  { type: 'learn', id: 'learn-circular', file: 'Wissen/Wie_Recycling.jpeg' },
  { type: 'learn', id: 'learn-antinioti', file: 'Wissen/Die_Antinioti_Lagune.jpeg' },
  { type: 'learn', id: 'learn-marine', file: 'Wissen/Meeresschildkroeten .jpeg' },
  { type: 'learn', id: 'learn-erimitis', file: 'Wissen/Erimitis.jpeg' },
  // --- News/ → Post.imageUrl (project-lifecycle news; NOT the imported FeedPosts) ---
  { type: 'post', id: 'post-circular-forum', file: 'News/Forum_der_Kreislauf.jpeg' },
  { type: 'post', id: 'post-new-marine', file: 'News/Schutz_von_Meeresschildkroeten.jpeg' },
  { type: 'post', id: 'post-completed-led', file: 'News/LED.jpeg' },
];

// Branding logos (A1/A2) — uploaded to entity-images/branding/. Not matched to
// any content entity. They are ALSO bundled into the repo (public/ + src/assets);
// the frontend references the local copies, these URLs are for the record.
const BRANDING = [
  { key: 'branding/logo-icon.png', file: 'Logo_Icon_transparent.png' },
  { key: 'branding/logo-gemeinde-korfu.png', file: 'Logo_Gemeinde_Korfu.png' },
];

function contentType(file: string): string {
  if (/\.png$/i.test(file)) return 'image/png';
  if (/\.webp$/i.test(file)) return 'image/webp';
  return 'image/jpeg';
}

// Storage key: <type>/<id>/<sanitised-filename> (spaces/trailing-space removed).
function storageKey(type: EntityType, id: string, file: string): string {
  const base = path.basename(file).trim().replace(/\s+/g, '_');
  return `${type}s/${id}/${base}`;
}

function publicUrlFor(key: string): string {
  const { data } = getStorageClient()
    .storage.from(ENTITY_IMAGES_BUCKET)
    .getPublicUrl(key);
  return data.publicUrl;
}

async function getEntity(type: EntityType, id: string) {
  if (type === 'project') return prisma.project.findUnique({ where: { id } });
  if (type === 'event') return prisma.event.findUnique({ where: { id } });
  if (type === 'learn') return prisma.learningResource.findUnique({ where: { id } });
  return prisma.post.findUnique({ where: { id } });
}

async function setImageUrl(type: EntityType, id: string, url: string) {
  if (type === 'project') return prisma.project.update({ where: { id }, data: { imageUrl: url } });
  if (type === 'event') return prisma.event.update({ where: { id }, data: { imageUrl: url } });
  if (type === 'learn') return prisma.learningResource.update({ where: { id }, data: { imageUrl: url } });
  return prisma.post.update({ where: { id }, data: { imageUrl: url } });
}

async function main() {
  if (!isStorageConfigured()) {
    throw new Error('SUPABASE_URL + SERVICE_ROLE_KEY missing in backend/.env.');
  }
  if (!existsSync(SOURCE_DIR)) {
    throw new Error(`Source folder not found: ${SOURCE_DIR}`);
  }
  if (!REPORT_ONLY) await ensureBucket(ENTITY_IMAGES_BUCKET);

  const matched: string[] = [];
  const skipped: string[] = [];
  const missingFile: string[] = [];
  const noEntity: string[] = [];
  const uploadedLogos: string[] = [];

  // --- Branding logos ---
  for (const b of BRANDING) {
    const abs = path.join(SOURCE_DIR, b.file);
    if (!existsSync(abs)) {
      missingFile.push(`(logo) ${b.file}`);
      continue;
    }
    if (REPORT_ONLY) {
      uploadedLogos.push(`${b.file} → would upload to ${b.key}`);
      continue;
    }
    const { publicUrl } = await uploadImage(
      b.key,
      readFileSync(abs),
      contentType(b.file),
      ENTITY_IMAGES_BUCKET
    );
    uploadedLogos.push(`${b.file} → ${publicUrl}`);
  }

  // --- Entity images ---
  for (const m of MAPPINGS) {
    const abs = path.join(SOURCE_DIR, m.file);
    if (!existsSync(abs)) {
      missingFile.push(`${m.file} (→ ${m.type}:${m.id})`);
      continue;
    }
    const entity = await getEntity(m.type, m.id);
    if (!entity) {
      noEntity.push(`${m.file} → ${m.type}:${m.id} (entity not in DB)`);
      continue;
    }
    const key = storageKey(m.type, m.id, m.file);
    const targetUrl = publicUrlFor(key);
    if ((entity as { imageUrl: string | null }).imageUrl === targetUrl) {
      skipped.push(`${m.type}:${m.id} already → ${key} (idempotent skip)`);
      continue;
    }
    if (REPORT_ONLY) {
      matched.push(`${m.file} → ${m.type}:${m.id} → would set ${key}`);
      continue;
    }
    const { publicUrl } = await uploadImage(
      key,
      readFileSync(abs),
      contentType(m.file),
      ENTITY_IMAGES_BUCKET
    );
    await setImageUrl(m.type, m.id, publicUrl);
    matched.push(`${m.file} → ${m.type}:${m.id} → ${publicUrl}`);
  }

  // --- Entities without any image (for the report) ---
  const projsNo = await prisma.project.findMany({ where: { imageUrl: null }, select: { id: true, titleEn: true, listed: true } });
  const evtsNo = await prisma.event.findMany({ where: { imageUrl: null }, select: { id: true, titleEn: true } });
  const learnNo = await prisma.learningResource.findMany({ where: { imageUrl: null }, select: { id: true, titleEn: true } });
  const postsNo = await prisma.post.findMany({ where: { imageUrl: null }, select: { id: true, titleEn: true } });

  // --- Unmatched source files (present on disk but not in MAPPINGS/BRANDING) ---
  const mappedFiles = new Set([
    ...MAPPINGS.map((m) => m.file),
    ...BRANDING.map((b) => b.file),
  ]);
  const onDisk: string[] = [];
  for (const sub of ['', 'Projects', 'Events', 'News', 'Wissen']) {
    const dir = path.join(SOURCE_DIR, sub);
    if (!existsSync(dir)) continue;
    for (const f of readdirSync(dir, { withFileTypes: true })) {
      if (f.isFile() && /\.(jpe?g|png|webp)$/i.test(f.name)) {
        onDisk.push(sub ? `${sub}/${f.name}` : f.name);
      }
    }
  }
  const unmatchedFiles = onDisk.filter((f) => !mappedFiles.has(f));

  const line = (s: string) => process.stdout.write(s + '\n');
  line('\n================ ENTITY IMAGE IMPORT REPORT ================');
  line(`Mode: ${REPORT_ONLY ? 'REPORT-ONLY (no writes)' : 'APPLY'}`);
  line(`Bucket: ${ENTITY_IMAGES_BUCKET}`);
  line('\n--- BRANDING LOGOS ---');
  uploadedLogos.forEach((s) => line('  ' + s));
  line(`\n--- MATCHED & SET (${matched.length}) ---`);
  matched.forEach((s) => line('  ' + s));
  line(`\n--- IDEMPOTENT SKIPS (${skipped.length}) ---`);
  skipped.forEach((s) => line('  ' + s));
  line(`\n--- MAPPED FILE MISSING ON DISK (${missingFile.length}) ---`);
  missingFile.forEach((s) => line('  ' + s));
  line(`\n--- MAPPED ENTITY NOT IN DB (${noEntity.length}) ---`);
  noEntity.forEach((s) => line('  ' + s));
  line(`\n--- SOURCE FILES NOT MATCHED (${unmatchedFiles.length}) ---`);
  unmatchedFiles.forEach((s) => line('  ' + s));
  line('\n--- ENTITIES STILL WITHOUT IMAGE ---');
  line(`  Projects: ${projsNo.map((p) => `${p.id}${p.listed ? '' : '(unlisted)'}`).join(', ') || 'none'}`);
  line(`  Events:   ${evtsNo.map((e) => e.id).join(', ') || 'none'}`);
  line(`  Learn:    ${learnNo.map((l) => l.id).join(', ') || 'none'}`);
  line(`  Posts:    ${postsNo.map((p) => p.id).join(', ') || 'none'}`);
  line('===========================================================\n');
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
