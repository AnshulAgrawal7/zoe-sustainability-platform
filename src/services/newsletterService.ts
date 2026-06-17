import { api, getAccessToken } from './api';
import type { ApiResponse } from '../types';

const BASE_URL =
  import.meta.env['VITE_API_BASE_URL'] || 'http://localhost:3001/api';

export interface NewsletterSignup {
  id: string;
  email: string;
  locale: string;
  createdAt: string;
}

// PROTOTYPE newsletter opt-in (F): records email + locale; no real mailing.
// `stored` is false when the backend table is not yet migrated in the target DB.
export async function subscribeNewsletter(
  email: string,
  locale: string,
  // Anti-spam honeypot — real users leave this empty.
  website = ''
): Promise<{ stored: boolean }> {
  const res = await api.post<ApiResponse<{ stored: boolean }>>('/newsletter', {
    email,
    locale,
    website,
  });
  return res.data;
}

// --- Admin (Future Work 4.4) ---

export async function getNewsletterSignups(): Promise<{
  signups: NewsletterSignup[];
  total: number;
}> {
  const res =
    await api.get<ApiResponse<{ signups: NewsletterSignup[]; total: number }>>(
      '/admin/newsletter'
    );
  return res.data;
}

export async function deleteNewsletterSignup(id: string): Promise<void> {
  await api.delete<ApiResponse<{ deleted: boolean }>>(
    `/admin/newsletter/${id}`
  );
}

// CSV download of all signups (auth header + blob, like the GDPR data export).
export async function exportNewsletterSignups(): Promise<void> {
  const res = await fetch(`${BASE_URL}/admin/newsletter/export`, {
    headers: { Authorization: `Bearer ${getAccessToken() ?? ''}` },
    credentials: 'include',
  });
  if (!res.ok) throw new Error('EXPORT_FAILED');
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'newsletter-signups.csv';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
