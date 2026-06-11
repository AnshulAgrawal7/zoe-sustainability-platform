import { api } from './api';
import type {
  ApiResponse,
  PublicIdeaDetail,
  PublicComment,
  AdminComment,
  CommentStatus,
} from '../types';

// Public: an approved idea + its visible comments. When logged in, each comment
// carries `likedByMe` (the api layer attaches the bearer token automatically).
export async function getPublicIdeaDetail(
  id: string
): Promise<PublicIdeaDetail> {
  const res = await api.get<ApiResponse<PublicIdeaDetail>>(
    `/ideas/public/${id}`
  );
  return res.data;
}

// Logged-in: post a comment on an approved idea.
export async function postComment(
  ideaId: string,
  body: string
): Promise<PublicComment> {
  const res = await api.post<ApiResponse<PublicComment>>(
    `/ideas/${ideaId}/comments`,
    { body }
  );
  return res.data;
}

// Logged-in: toggle a like on a comment.
export async function toggleCommentLike(
  commentId: string
): Promise<{ liked: boolean; likeCount: number }> {
  const res = await api.post<
    ApiResponse<{ liked: boolean; likeCount: number }>
  >(`/comments/${commentId}/like`, {});
  return res.data;
}

// Admin: list every comment for moderation.
export async function getAllComments(): Promise<AdminComment[]> {
  const res =
    await api.get<ApiResponse<{ comments: AdminComment[]; total: number }>>(
      '/admin/comments'
    );
  return res.data.comments;
}

// Admin: set a comment VISIBLE/HIDDEN.
export async function setCommentStatus(
  id: string,
  status: CommentStatus
): Promise<void> {
  await api.patch<ApiResponse<unknown>>(`/admin/comments/${id}`, { status });
}
