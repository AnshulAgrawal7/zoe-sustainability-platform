import { api } from './api';
import type {
  ApiResponse,
  AuthUser,
  ApiUserBadge,
  ApiBadge,
  LeaderboardEntry,
  ApiParticipation,
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
  language?: string;
  avatarUrl?: string;
}): Promise<AuthUser> {
  const res = await api.put<ApiResponse<AuthUser>>('/users/me', data);
  return res.data;
}

export async function getMyBadges(): Promise<BadgesResponse> {
  const res = await api.get<ApiResponse<BadgesResponse>>('/users/me/badges');
  return res.data;
}

export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  const res =
    await api.get<ApiResponse<LeaderboardEntry[]>>('/users/leaderboard');
  return res.data;
}
