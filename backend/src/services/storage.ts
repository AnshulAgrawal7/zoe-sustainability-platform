import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Supabase Storage for post images. SERVER-ONLY: uses the service-role key, which
// must NEVER reach the browser. Reads SUPABASE_URL + SERVICE_ROLE_KEY from the
// backend env and fails loudly if they are missing.
export const POST_IMAGES_BUCKET = 'post-images';
// Cover images for the core entities (projects, events, learning resources) and
// the project-lifecycle news (`Post`), plus branding assets. Kept separate from
// the imported-feed bucket so the two import pipelines never collide.
export const ENTITY_IMAGES_BUCKET = 'entity-images';

export class StorageNotConfiguredError extends Error {
  constructor() {
    super(
      'Supabase Storage is not configured — set SUPABASE_URL and SERVICE_ROLE_KEY in backend/.env.'
    );
    this.name = 'StorageNotConfiguredError';
  }
}

let client: SupabaseClient | null = null;

export function isStorageConfigured(): boolean {
  return Boolean(
    process.env['SUPABASE_URL'] && process.env['SERVICE_ROLE_KEY']
  );
}

export function getStorageClient(): SupabaseClient {
  if (!isStorageConfigured()) throw new StorageNotConfiguredError();
  if (!client) {
    client = createClient(
      process.env['SUPABASE_URL'] as string,
      process.env['SERVICE_ROLE_KEY'] as string,
      { auth: { persistSession: false, autoRefreshToken: false } }
    );
  }
  return client;
}

// Create the public bucket if it does not already exist (idempotent).
export async function ensureBucket(
  bucket: string = POST_IMAGES_BUCKET
): Promise<void> {
  const sb = getStorageClient();
  const { data: buckets, error } = await sb.storage.listBuckets();
  if (error) throw error;
  if (!buckets.some((b) => b.name === bucket)) {
    const { error: createErr } = await sb.storage.createBucket(bucket, {
      public: true,
    });
    if (createErr) throw createErr;
  }
}

export async function uploadImage(
  path: string,
  body: Buffer,
  contentType: string,
  bucket: string = POST_IMAGES_BUCKET
): Promise<{ path: string; publicUrl: string }> {
  const sb = getStorageClient();
  const { error } = await sb.storage
    .from(bucket)
    .upload(path, body, { contentType, upsert: true });
  if (error) throw error;
  const { data } = sb.storage.from(bucket).getPublicUrl(path);
  return { path, publicUrl: data.publicUrl };
}

// Remove objects from the bucket (used when deleting a post or an image).
export async function deleteImages(
  paths: string[],
  bucket: string = POST_IMAGES_BUCKET
): Promise<void> {
  if (paths.length === 0) return;
  const sb = getStorageClient();
  const { error } = await sb.storage.from(bucket).remove(paths);
  if (error) throw error;
}
