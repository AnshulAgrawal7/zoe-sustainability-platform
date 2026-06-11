import { api } from './api';
import type { ApiResponse, LearningResource } from '../types';

export interface LearnFilters {
  category?: string;
  projectId?: string;
}

export async function getLearningResources(
  filters: LearnFilters = {}
): Promise<LearningResource[]> {
  const params = new URLSearchParams();
  if (filters.category) params.set('category', filters.category);
  if (filters.projectId) params.set('projectId', filters.projectId);
  const query = params.toString();
  const res = await api.get<
    ApiResponse<{ resources: LearningResource[]; total: number }>
  >(`/learn${query ? `?${query}` : ''}`);
  return res.data.resources;
}

export async function getLearningResource(
  id: string
): Promise<LearningResource> {
  const res = await api.get<ApiResponse<LearningResource>>(`/learn/${id}`);
  return res.data;
}

// --- Admin CRUD ---
export interface LearnPayload {
  titleEn: string;
  titleEl: string;
  titleDe: string;
  bodyEn: string;
  bodyEl: string;
  bodyDe: string;
  category: string;
  sdgIds: number[];
  imageUrl?: string;
  sourceNote?: string;
  projectId?: string | null;
}

export async function createLearningResource(
  data: LearnPayload
): Promise<LearningResource> {
  const res = await api.post<ApiResponse<LearningResource>>(
    '/admin/learn',
    data
  );
  return res.data;
}

export async function updateLearningResource(
  id: string,
  data: Partial<LearnPayload>
): Promise<LearningResource> {
  const res = await api.patch<ApiResponse<LearningResource>>(
    `/admin/learn/${id}`,
    data
  );
  return res.data;
}

export async function deleteLearningResource(id: string): Promise<void> {
  await api.delete<ApiResponse<unknown>>(`/admin/learn/${id}`);
}
