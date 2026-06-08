import { api } from './api';
import type { ApiResponse, Post, PostType } from '../types';

export async function getPosts(
  filters: {
    type?: PostType;
    limit?: number;
  } = {}
): Promise<Post[]> {
  const params = new URLSearchParams();
  if (filters.type) params.set('type', filters.type);
  if (filters.limit) params.set('limit', String(filters.limit));
  const query = params.toString();
  const res = await api.get<ApiResponse<Post[]>>(
    `/posts${query ? `?${query}` : ''}`
  );
  return res.data;
}

export async function getPost(id: string): Promise<Post> {
  const res = await api.get<ApiResponse<Post>>(`/posts/${id}`);
  return res.data;
}

// --- Admin ---

export interface PostPayload {
  type?: PostType;
  titleEn: string;
  titleEl: string;
  titleDe: string;
  bodyEn: string;
  bodyEl: string;
  bodyDe: string;
  imageUrl?: string;
  published?: boolean;
}

export async function createPost(payload: PostPayload): Promise<Post> {
  const res = await api.post<ApiResponse<Post>>('/posts', payload);
  return res.data;
}

export async function updatePost(
  id: string,
  payload: Partial<PostPayload>
): Promise<Post> {
  const res = await api.put<ApiResponse<Post>>(`/posts/${id}`, payload);
  return res.data;
}

export async function deletePost(id: string): Promise<void> {
  await api.delete(`/posts/${id}`);
}
