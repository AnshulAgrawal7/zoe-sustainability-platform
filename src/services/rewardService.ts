import { api } from './api';
import type { ApiResponse, ApiRewardTier } from '../types';

// The five ZOE levels with role-specific designations + reward lists.
export async function getRewardTiers(): Promise<ApiRewardTier[]> {
  const res =
    await api.get<ApiResponse<{ tiers: ApiRewardTier[] }>>('/rewards/tiers');
  return res.data.tiers;
}

// Admin: update a tier's base fields and/or upsert its role variants.
export interface RewardTierUpdatePayload {
  greekName?: string;
  icon?: string;
  pointsMin?: number;
  pointsMax?: number | null;
  variants?: Array<{
    role: string;
    nameEn: string;
    nameEl: string;
    nameDe: string;
    descriptionEn: string;
    descriptionEl: string;
    descriptionDe: string;
    rewardsEn: string;
    rewardsEl: string;
    rewardsDe: string;
  }>;
}

export async function updateRewardTier(
  id: string,
  data: RewardTierUpdatePayload
): Promise<ApiRewardTier> {
  const res = await api.put<ApiResponse<ApiRewardTier>>(
    `/admin/rewards/tiers/${id}`,
    data
  );
  return res.data;
}
