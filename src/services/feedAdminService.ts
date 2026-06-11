import { api } from './api';
import type { ApiResponse, AdminFeedPost, AdminFeedImage } from '../types';

export async function getAdminFeed(): Promise<AdminFeedPost[]> {
  const res =
    await api.get<ApiResponse<{ posts: AdminFeedPost[]; total: number }>>(
      '/admin/feed'
    );
  return res.data.posts;
}

export async function getAdminFeedPost(id: string): Promise<AdminFeedPost> {
  const res = await api.get<ApiResponse<AdminFeedPost>>(`/admin/feed/${id}`);
  return res.data;
}

export interface FeedUpdatePayload {
  category?: AdminFeedPost['category'];
  eventStatus?: AdminFeedPost['eventStatus'];
  needsReview?: boolean;
  translations?: { locale: string; title: string; body: string }[];
}

export async function updateFeedPost(
  id: string,
  data: FeedUpdatePayload
): Promise<AdminFeedPost> {
  const res = await api.patch<ApiResponse<AdminFeedPost>>(
    `/admin/feed/${id}`,
    data
  );
  return res.data;
}

export async function deleteFeedPost(id: string): Promise<void> {
  await api.delete<ApiResponse<unknown>>(`/admin/feed/${id}`);
}

export async function updateFeedImage(
  imageId: string,
  data: { altText?: string; order?: number }
): Promise<AdminFeedImage> {
  const res = await api.patch<ApiResponse<AdminFeedImage>>(
    `/admin/feed/images/${imageId}`,
    data
  );
  return res.data;
}

export async function deleteFeedImage(imageId: string): Promise<void> {
  await api.delete<ApiResponse<unknown>>(`/admin/feed/images/${imageId}`);
}

export async function reorderFeedImages(
  id: string,
  ids: string[]
): Promise<AdminFeedImage[]> {
  const res = await api.patch<ApiResponse<{ images: AdminFeedImage[] }>>(
    `/admin/feed/${id}/reorder`,
    { ids }
  );
  return res.data.images;
}
