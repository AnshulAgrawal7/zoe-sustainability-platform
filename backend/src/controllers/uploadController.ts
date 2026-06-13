import type { Response } from 'express';
import type { AuthRequest } from '../middleware/auth';
import { randomUUID } from 'crypto';
import { ok, badRequest, serviceUnavailable, serverError } from '../utils/response';
import {
  ENTITY_IMAGES_BUCKET,
  ensureBucket,
  isStorageConfigured,
  uploadImage,
} from '../services/storage';

const ALLOWED = new Map<string, string>([
  ['image/jpeg', 'jpg'],
  ['image/png', 'png'],
  ['image/webp', 'webp'],
  ['image/gif', 'gif'],
]);

// POST /api/uploads/image — authenticated. Accepts a single multipart file
// (`image`), stores it in the Supabase `entity-images` bucket and returns the
// public URL to save in the entity's `imageUrl` column. Used by admins and by
// citizens submitting an event proposal with a cover photo from their device.
export async function uploadEntityImage(req: AuthRequest, res: Response) {
  if (!isStorageConfigured()) {
    serviceUnavailable(res, 'Image storage is not configured');
    return;
  }
  const file = req.file;
  if (!file) {
    badRequest(res, 'No image file provided (field name must be "image")');
    return;
  }
  const ext = ALLOWED.get(file.mimetype);
  if (!ext) {
    badRequest(res, 'Unsupported image type — use JPEG, PNG, WebP or GIF');
    return;
  }

  try {
    await ensureBucket(ENTITY_IMAGES_BUCKET);
    const path = `uploads/${new Date().getFullYear()}/${randomUUID()}.${ext}`;
    const { publicUrl } = await uploadImage(
      path,
      file.buffer,
      file.mimetype,
      ENTITY_IMAGES_BUCKET
    );
    ok(res, { url: publicUrl, path });
  } catch {
    serverError(res);
  }
}
