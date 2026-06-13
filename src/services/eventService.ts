import { api } from './api';
import type {
  ApiResponse,
  ApiEvent,
  MyEventRegistration,
  AdminEventRegistration,
} from '../types';

export interface GuestRegistration {
  guestName: string;
  guestEmail: string;
  consent: boolean;
}

export interface RegistrationResult {
  id: string;
  /** Always 0 on registration — points are credited when the event completes. */
  pointsAwarded: number;
  /** The event's reward, pending until an admin marks it COMPLETED. */
  pointsPending?: number;
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

// Logged-in attendance — points become pending until the event is completed.
export async function joinEvent(eventId: string): Promise<RegistrationResult> {
  const res = await api.post<ApiResponse<RegistrationResult>>(
    `/events/${eventId}/join`,
    {}
  );
  return res.data;
}

// Logged-in cancel — allowed any time before the event is completed.
export async function cancelEventRegistration(eventId: string): Promise<void> {
  await api.delete<ApiResponse<null>>(`/events/${eventId}/registration`);
}

// The logged-in user's registrations (dashboard "my events").
export async function getMyEventRegistrations(): Promise<
  MyEventRegistration[]
> {
  const res = await api.get<
    ApiResponse<{ registrations: MyEventRegistration[] }>
  >('/events/registrations/me');
  return res.data.registrations;
}

// Admin: who is registered for an event (members + guests, newest first).
export async function getEventRegistrationsAdmin(eventId: string): Promise<{
  event: ApiEvent;
  registrations: AdminEventRegistration[];
}> {
  const res = await api.get<
    ApiResponse<{ event: ApiEvent; registrations: AdminEventRegistration[] }>
  >(`/admin/events/${eventId}/registrations`);
  return res.data;
}

// Admin: mark an event COMPLETED and award pending points (idempotent).
export async function completeEvent(
  eventId: string
): Promise<{ awardedCount: number; pointsPerUser: number }> {
  const res = await api.post<
    ApiResponse<{ awardedCount: number; pointsPerUser: number }>
  >(`/admin/events/${eventId}/complete`, {});
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
  lat?: number | null;
  lng?: number | null;
  category: string;
  rewardPoints?: number;
  capacity?: number | null;
  imageUrl?: string | null;
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
