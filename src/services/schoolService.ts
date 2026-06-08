import { api } from './api';
import type {
  ApiResponse,
  SchoolSummary,
  SchoolLeaderboard,
  SchoolMember,
  MySchool,
} from '../types';

export async function getSchools(): Promise<SchoolSummary[]> {
  const res = await api.get<ApiResponse<SchoolSummary[]>>('/schools');
  return res.data;
}

export type SchoolDetail = SchoolSummary & { members: SchoolMember[] };

export async function getSchool(id: string): Promise<SchoolDetail> {
  const res = await api.get<ApiResponse<SchoolDetail>>(`/schools/${id}`);
  return res.data;
}

export async function getSchoolLeaderboard(): Promise<SchoolLeaderboard> {
  const res = await api.get<ApiResponse<SchoolLeaderboard>>(
    '/schools/leaderboard'
  );
  return res.data;
}

export async function getMySchool(): Promise<MySchool> {
  const res = await api.get<ApiResponse<MySchool>>('/schools/me');
  return res.data;
}

export async function joinSchool(
  code: string
): Promise<{ id: string; name: string; code: string }> {
  const res = await api.post<
    ApiResponse<{ id: string; name: string; code: string }>
  >('/schools/join', { code });
  return res.data;
}

export async function leaveSchool(): Promise<void> {
  await api.post<ApiResponse<null>>('/schools/leave', {});
}

// --- Admin ---

export interface CreateSchoolPayload {
  name: string;
  code: string;
  location?: string;
  coordinatorEmail?: string;
  coordinatorName?: string;
  coordinatorPassword?: string;
}

export interface CreateSchoolResult {
  school: { id: string; name: string; code: string; location: string | null };
  coordinator?: { email: string; password: string };
}

export async function createSchool(
  payload: CreateSchoolPayload
): Promise<CreateSchoolResult> {
  const res = await api.post<ApiResponse<CreateSchoolResult>>(
    '/admin/schools',
    payload
  );
  return res.data;
}

export async function updateSchool(
  id: string,
  payload: Partial<Pick<CreateSchoolPayload, 'name' | 'code' | 'location'>>
): Promise<{
  id: string;
  name: string;
  code: string;
  location: string | null;
}> {
  const res = await api.put<
    ApiResponse<{
      id: string;
      name: string;
      code: string;
      location: string | null;
    }>
  >(`/admin/schools/${id}`, payload);
  return res.data;
}

export async function deleteSchool(id: string): Promise<void> {
  await api.delete(`/admin/schools/${id}`);
}
