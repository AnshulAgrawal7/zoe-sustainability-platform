import { api } from './api';
import type { ApiResponse, ApiProject } from '../types';

interface ProjectsResponse {
  projects: ApiProject[];
  total: number;
  page: number;
  pages: number;
}

interface ProjectFilters {
  page?: number;
  limit?: number;
  category?: string;
  status?: string;
}

export async function getProjects(
  filters: ProjectFilters = {}
): Promise<ProjectsResponse> {
  const params = new URLSearchParams();
  if (filters.page) params.set('page', String(filters.page));
  if (filters.limit) params.set('limit', String(filters.limit));
  if (filters.category) params.set('category', filters.category);
  if (filters.status) params.set('status', filters.status);

  const query = params.toString();
  const res = await api.get<ApiResponse<ProjectsResponse>>(
    `/projects${query ? `?${query}` : ''}`
  );
  return res.data;
}

export async function getProject(id: string): Promise<ApiProject> {
  const res = await api.get<ApiResponse<ApiProject>>(`/projects/${id}`);
  return res.data;
}

export async function participate(
  projectId: string
): Promise<{ pointsAwarded: number }> {
  const res = await api.post<
    ApiResponse<{ participation: unknown; pointsAwarded: number }>
  >(`/projects/${projectId}/participate`, {});
  return { pointsAwarded: res.data.pointsAwarded };
}

export async function withdraw(projectId: string): Promise<void> {
  await api.delete(`/projects/${projectId}/participate`);
}

export async function createProject(
  data: Partial<ApiProject> & { sdgIds: number[] }
): Promise<ApiProject> {
  const res = await api.post<ApiResponse<ApiProject>>('/projects', data);
  return res.data;
}

export interface UpdateProjectPayload extends Omit<
  Partial<ApiProject>,
  'sdgIds'
> {
  sdgIds?: number[];
}

export async function updateProject(
  id: string,
  data: UpdateProjectPayload
): Promise<ApiProject> {
  const res = await api.put<ApiResponse<ApiProject>>(`/projects/${id}`, data);
  return res.data;
}
