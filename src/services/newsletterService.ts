import { api } from './api';
import type { ApiResponse } from '../types';

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
