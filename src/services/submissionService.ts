import { api } from './api';
import type { ApiResponse, ApiSubmission, SubmissionType } from '../types';

export interface SubmissionPayload {
  type: SubmissionType;
  message: string;
  submitterName?: string;
  submitterEmail?: string;
}

// Environmental issue report / general feedback from /participate. Works
// without an account (anonymous); when logged in the bearer token links the
// submission to the user server-side.
export async function submitSubmission(
  payload: SubmissionPayload
): Promise<void> {
  await api.post<ApiResponse<{ id: string }>>('/submissions', payload);
}

// Admin: read-only overview of all submissions (newest first).
export async function getAdminSubmissions(
  type?: SubmissionType
): Promise<ApiSubmission[]> {
  const query = type ? `?type=${type}` : '';
  const res = await api.get<
    ApiResponse<{ submissions: ApiSubmission[]; total: number }>
  >(`/admin/submissions${query}`);
  return res.data.submissions;
}
