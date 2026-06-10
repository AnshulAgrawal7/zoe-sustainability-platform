import { api } from './api';
import type { ApiResponse, ApiEvent } from '../types';

export interface GuestRegistration {
  guestName: string;
  guestEmail: string;
  consent: boolean;
}

export interface RegistrationResult {
  id: string;
  pointsAwarded: number;
  guest: boolean;
}

export interface EventFilters {
  category?: string;
  projectId?: string;
  upcoming?: boolean;
}

export async function getEvents(
  filters: EventFilters = {}
): Promise<ApiEvent[]> {
  const params = new URLSearchParams();
  if (filters.category) params.set('category', filters.category);
  if (filters.projectId) params.set('projectId', filters.projectId);
  if (filters.upcoming) params.set('upcoming', 'true');
  const query = params.toString();
  const res = await api.get<ApiResponse<{ events: ApiEvent[] }>>(
    `/events${query ? `?${query}` : ''}`
  );
  return res.data.events;
}

export async function getEvent(id: string): Promise<ApiEvent> {
  const res = await api.get<ApiResponse<ApiEvent>>(`/events/${id}`);
  return res.data;
}

// Logged-in attendance — earns the event's reward points.
export async function joinEvent(eventId: string): Promise<RegistrationResult> {
  const res = await api.post<ApiResponse<RegistrationResult>>(
    `/events/${eventId}/join`,
    {}
  );
  return res.data;
}

// Open RSVP. Logged-in users register without a body (token attached by the api
// layer) and earn points; guests pass their details and earn none.
export async function registerForEvent(
  eventId: string,
  guest?: GuestRegistration
): Promise<RegistrationResult> {
  const res = await api.post<ApiResponse<RegistrationResult>>(
    `/events/${eventId}/register`,
    guest ?? {}
  );
  return res.data;
}

// --- Admin CRUD ---
export interface EventPayload {
  titleEn: string;
  titleEl: string;
  titleDe: string;
  descriptionEn: string;
  descriptionEl: string;
  descriptionDe: string;
  date: string;
  location?: string;
  category: string;
  rewardPoints?: number;
  capacity?: number | null;
  projectId?: string | null;
}

export async function createEvent(data: EventPayload): Promise<ApiEvent> {
  const res = await api.post<ApiResponse<ApiEvent>>('/admin/events', data);
  return res.data;
}

export async function updateEvent(
  id: string,
  data: Partial<EventPayload>
): Promise<ApiEvent> {
  const res = await api.patch<ApiResponse<ApiEvent>>(
    `/admin/events/${id}`,
    data
  );
  return res.data;
}

export async function deleteEvent(id: string): Promise<void> {
  await api.delete(`/admin/events/${id}`);
}
