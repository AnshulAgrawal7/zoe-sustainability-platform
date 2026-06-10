import { api } from './api';
import type { ApiResponse } from '../types';

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

// Register for an event. Logged-in users register without a body (the api layer
// attaches their token) and earn points; guests pass their details and earn none.
// Events are prototype content keyed by string id (src/data/events.ts).
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
