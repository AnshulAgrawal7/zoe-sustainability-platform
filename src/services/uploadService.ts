import { api } from './api';
import type { ApiResponse } from '../types';

// Upload an image file (from the user's device) to Supabase Storage and get back
// the public URL to save in an entity's `imageUrl`. Logged-in only (admins +
// citizens submitting an event proposal). Max 5 MB; JPEG/PNG/WebP/GIF.
export async function uploadEntityImage(file: File): Promise<string> {
  const form = new FormData();
  form.append('image', file);
  const res = await api.upload<ApiResponse<{ url: string; path: string }>>(
    '/uploads/image',
    form
  );
  return res.data.url;
}
