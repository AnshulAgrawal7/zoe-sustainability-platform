import { api } from './api';
import type { ApiResponse } from '../types';

export type NotificationKind =
  | 'IDEA'
  | 'REPORT'
  | 'FEEDBACK'
  | 'EVENT_PROPOSAL';

export interface AdminNotification {
  id: string;
  kind: NotificationKind;
  title: string;
  submitterName: string | null;
  createdAt: string;
}

// Admin: aggregated feed for the header bell — NEW ideas + citizen
// reports/feedback, newest first (capped server-side).
export async function getAdminNotifications(): Promise<AdminNotification[]> {
  const res = await api.get<
    ApiResponse<{ notifications: AdminNotification[]; total: number }>
  >('/admin/notifications');
  return res.data.notifications;
}
