import { api } from './api';
import type {
  ApiResponse,
  AuthUser,
  ApiUserBadge,
  ApiBadge,
  ApiParticipation,
  LeaderboardEntry,
} from '../types';

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

// Leaderboard — logged-in only, pseudonymous usernames (never names/emails).
// Reintroduced with privacy safeguards; see docs/design-rationale-matrix.md B3.
export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  const res =
    await api.get<ApiResponse<{ entries: LeaderboardEntry[] }>>(
      '/users/leaderboard'
    );
  return res.data.entries;
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
