import { api } from './api';
import type {
  ApiResponse,
  Idea,
  IdeaStatus,
  PublicIdea,
  MyIdea,
  ApiProjectCategory,
} from '../types';

// Public idea board — the server returns only ACCEPTED ideas, no personal data.
export async function getPublicIdeas(
  category?: ApiProjectCategory
): Promise<PublicIdea[]> {
  const query = category ? `?category=${category}` : '';
  const res = await api.get<
    ApiResponse<{ ideas: PublicIdea[]; total: number }>
  >(`/ideas/public${query}`);
  return res.data.ideas;
}

export interface IdeaSubmission {
  title: string;
  description: string;
  category: ApiProjectCategory;
  submitterName?: string;
  submitterEmail?: string;
  /** Anti-spam honeypot — real users leave this empty. */
  website?: string;
}

// Submit a citizen idea. Works WITHOUT an account; the api layer attaches the
// token automatically when the user is logged in (then the idea links to them).
export async function submitIdea(
  data: IdeaSubmission
): Promise<{ id: string; status: IdeaStatus; createdAt: string }> {
  const res = await api.post<
    ApiResponse<{ id: string; status: IdeaStatus; createdAt: string }>
  >('/ideas', data);
  return res.data;
}

// The logged-in user's own ideas (every status) for dashboard tracking.
export async function getMyIdeas(): Promise<MyIdea[]> {
  const res = await api.get<ApiResponse<{ ideas: MyIdea[] }>>('/ideas/mine');
  return res.data.ideas;
}

// Toggle a support vote on an approved idea (logged-in).
export async function toggleIdeaVote(
  id: string
): Promise<{ voted: boolean; voteCount: number }> {
  const res = await api.post<
    ApiResponse<{ voted: boolean; voteCount: number }>
  >(`/ideas/${id}/vote`, {});
  return res.data;
}

// Admin: list ideas, optionally filtered by status.
export async function getIdeas(status?: IdeaStatus): Promise<Idea[]> {
  const query = status ? `?status=${status}` : '';
  const res = await api.get<ApiResponse<{ ideas: Idea[]; total: number }>>(
    `/admin/ideas${query}`
  );
  return res.data.ideas;
}

// Admin: change an idea's status.
export async function updateIdeaStatus(
  id: string,
  status: IdeaStatus,
  message?: string
): Promise<Idea> {
  const res = await api.patch<ApiResponse<Idea>>(`/admin/ideas/${id}`, {
    status,
    ...(message !== undefined ? { message } : {}),
  });
  return res.data;
}
