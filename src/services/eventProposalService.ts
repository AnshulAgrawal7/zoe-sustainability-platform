import { api } from './api';
import type {
  ApiResponse,
  EventProposalPayload,
  AdminEventProposal,
  EventProposalStatus,
} from '../types';

// Public (works without an account; the token links it when logged in): submit
// a citizen event proposal. Never shown on the public idea board — an admin
// reviews and converts it into a real Event.
export async function submitEventProposal(
  payload: EventProposalPayload
): Promise<{ id: string; status: EventProposalStatus; createdAt: string }> {
  const res = await api.post<
    ApiResponse<{ id: string; status: EventProposalStatus; createdAt: string }>
  >('/event-proposals', payload);
  return res.data;
}

// Admin: list proposals, optionally filtered by status.
export async function getEventProposals(
  status?: EventProposalStatus
): Promise<AdminEventProposal[]> {
  const query = status ? `?status=${status}` : '';
  const res = await api.get<
    ApiResponse<{ proposals: AdminEventProposal[]; total: number }>
  >(`/admin/event-proposals${query}`);
  return res.data.proposals;
}

// Admin: one proposal (to pre-fill the event form).
export async function getEventProposal(
  id: string
): Promise<AdminEventProposal> {
  const res = await api.get<ApiResponse<AdminEventProposal>>(
    `/admin/event-proposals/${id}`
  );
  return res.data;
}

// Admin: mark a proposal CONVERTED (with the new event id) or DECLINED.
export async function updateEventProposal(
  id: string,
  status: EventProposalStatus,
  createdEventId?: string
): Promise<void> {
  await api.patch<ApiResponse<unknown>>(`/admin/event-proposals/${id}`, {
    status,
    ...(createdEventId ? { createdEventId } : {}),
  });
}
