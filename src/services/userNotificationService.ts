import { api } from './api';
import type { ApiResponse, UserNotification } from '../types';

// The logged-in user's in-app notifications (mentions) + unread count.
export async function getMyNotifications(): Promise<{
  notifications: UserNotification[];
  unreadCount: number;
}> {
  const res =
    await api.get<
      ApiResponse<{ notifications: UserNotification[]; unreadCount: number }>
    >('/notifications');
  return res.data;
}

// Mark all of the user's notifications as read.
export async function markAllNotificationsRead(): Promise<void> {
  await api.post<ApiResponse<{ ok: boolean }>>('/notifications/read', {});
}
