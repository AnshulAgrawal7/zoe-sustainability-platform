import { api } from './api';
import type { ApiResponse, FeedItem, FeedDetail } from '../types';

// Public merged "What's New" feed, resolved to the given locale (EL fallback).
export async function getFeed(locale: string): Promise<FeedItem[]> {
  const res = await api.get<ApiResponse<{ items: FeedItem[]; total: number }>>(
    `/feed?locale=${encodeURIComponent(locale)}`
  );
  return res.data.items;
}

// A single entry (full body) from either source ('feed' | 'project').
export async function getFeedItem(
  source: string,
  id: string,
  locale: string
): Promise<FeedDetail> {
  const res = await api.get<ApiResponse<FeedDetail>>(
    `/feed/${encodeURIComponent(source)}/${encodeURIComponent(id)}?locale=${encodeURIComponent(locale)}`
  );
  return res.data;
}
