import { api, getAccessToken } from './api';
import type {
  ApiResponse,
  AuthUser,
  ApiUserBadge,
  ApiBadge,
  ApiParticipation,
} from '../types';

const BASE_URL =
  import.meta.env['VITE_API_BASE_URL'] || 'http://localhost:3001/api';

interface MeResponse extends AuthUser {
  participations: ApiParticipation[];
  _count: { participations: number; userBadges: number };
}

interface BadgesResponse {
  earned: ApiUserBadge[];
  all: ApiBadge[];
  points: number;
  nextBadge: ApiBadge | null;
}

export async function getMe(): Promise<MeResponse> {
  const res = await api.get<ApiResponse<MeResponse>>('/users/me');
  return res.data;
}

export async function updateMe(data: {
  name?: string;
  username?: string;
  language?: string;
  avatarUrl?: string;
  profile?: string;
}): Promise<AuthUser> {
  const res = await api.put<ApiResponse<AuthUser>>('/users/me', data);
  return res.data;
}

export async function getMyBadges(): Promise<BadgesResponse> {
  const res = await api.get<ApiResponse<BadgesResponse>>('/users/me/badges');
  return res.data;
}

// GDPR Art. 15/20 — download all personal data as a JSON file. Uses a raw fetch
// (not the JSON `api` helper) so the response can be handled as a Blob and saved
// via a temporary object URL.
export async function downloadMyData(): Promise<void> {
  const res = await fetch(`${BASE_URL}/users/me/export`, {
    headers: { Authorization: `Bearer ${getAccessToken() ?? ''}` },
    credentials: 'include',
  });
  if (!res.ok) throw new Error('EXPORT_FAILED');
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'zoe-my-data.json';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// GDPR Art. 17 — permanently delete the signed-in user's account.
export async function deleteMyAccount(): Promise<void> {
  await api.delete<ApiResponse<{ deleted: boolean }>>('/users/me');
}

// Username autocomplete for @mentions (logged-in only).
export async function searchUsernames(
  q: string
): Promise<{ username: string; avatarUrl: string | null }[]> {
  const res = await api.get<
    ApiResponse<{ users: { username: string; avatarUrl: string | null }[] }>
  >(`/users/search?q=${encodeURIComponent(q)}`);
  return res.data.users;
}
