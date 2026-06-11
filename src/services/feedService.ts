import { api } from './api';
import type { ApiResponse, FeedItem } from '../types';

// Public merged "What's New" feed, resolved to the given locale (EL fallback).
export async function getFeed(locale: string): Promise<FeedItem[]> {
  const res = await api.get<ApiResponse<{ items: FeedItem[]; total: number }>>(
    `/feed?locale=${encodeURIComponent(locale)}`
  );
  return res.data.items;
}
