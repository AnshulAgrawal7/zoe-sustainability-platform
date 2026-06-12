import { api } from './api';
import type { ApiResponse } from '../types';

// --- Privacy-by-design monitoring -----------------------------------------
// The client reports ONLY the route path (plus a once-per-session visit flag).
// The backend stores aggregate day counters — no IP, no UA, no cookies, no
// visitor-level rows (see backend/src/controllers/metricsController.ts).

const VISIT_FLAG = 'zoe-visit-reported';
let lastReportedPath = '';

/** Fire-and-forget page-view report; deduped against the previous path
 *  (also absorbs React StrictMode's double effect in dev). */
export function reportPageView(path: string): void {
  if (path.startsWith('/admin')) return; // admin navigation is never counted
  if (path === lastReportedPath) return;
  lastReportedPath = path;

  let newVisit = false;
  try {
    if (!sessionStorage.getItem(VISIT_FLAG)) {
      sessionStorage.setItem(VISIT_FLAG, '1');
      newVisit = true;
    }
  } catch {
    // sessionStorage unavailable → count the view, skip the visit flag.
  }

  api
    .post<ApiResponse<null>>('/metrics/view', { path, newVisit })
    .catch(() => null); // monitoring must never break the page
}

// --- Admin dashboard data ---------------------------------------------------

export interface DayCount {
  day: string; // YYYY-MM-DD (UTC)
  count: number;
}

export interface AdminMetrics {
  days: number;
  pageViews: DayCount[];
  visits: DayCount[];
  topPages: { path: string; count: number }[];
  activity: {
    logins: Record<string, number>;
    newUsers: Record<string, number>;
    eventRegistrations: Record<string, number>;
    ideas: Record<string, number>;
    submissions: Record<string, number>;
    newsletterSignups: Record<string, number>;
  };
  totals: {
    pageViews: number;
    pageViewsAllTime: number;
    visits: number;
    logins: number;
    newUsers: number;
    eventRegistrations: number;
    ideas: number;
    submissions: number;
    newsletterSignups: number;
    totalUsers: number;
  };
}

export async function getAdminMetrics(days = 30): Promise<AdminMetrics> {
  const res = await api.get<ApiResponse<AdminMetrics>>(
    `/admin/metrics?days=${days}`
  );
  return res.data;
}
