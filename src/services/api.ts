import { useAuthStore } from '../stores/authStore';
import type { AuthUser } from '../types';

const BASE_URL =
  import.meta.env['VITE_API_BASE_URL'] || 'http://localhost:3001/api';

// Token stored in memory (not localStorage) for security
let accessToken: string | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export function getAccessToken(): string | null {
  return accessToken;
}

// Access tokens are short-lived (15min). When a request comes back 401 we try
// ONE silent refresh via the httpOnly cookie and retry the request, so a user
// who keeps the tab open is never logged out mid-session. A shared promise
// dedupes concurrent 401s into a single refresh round-trip.
let refreshPromise: Promise<boolean> | null = null;

async function trySilentRefresh(): Promise<boolean> {
  refreshPromise ??= (async () => {
    try {
      const res = await fetch(`${BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      if (!res.ok) return false;
      const data = (await res.json()) as {
        data?: { accessToken?: string; user?: AuthUser };
      };
      if (!data.data?.accessToken || !data.data.user) return false;
      accessToken = data.data.accessToken;
      useAuthStore.getState().setAuth(data.data.user, data.data.accessToken);
      return true;
    } catch {
      return false;
    } finally {
      // Allow the next 401 to trigger a fresh attempt.
      setTimeout(() => {
        refreshPromise = null;
      }, 0);
    }
  })();
  return refreshPromise;
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  isRetry = false
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
    credentials: 'include', // sends httpOnly refresh cookie
  });

  // Expired access token → silent refresh + one retry (never for /auth/* itself).
  if (res.status === 401 && !isRetry && !path.startsWith('/auth/')) {
    const refreshed = await trySilentRefresh();
    if (refreshed) return request<T>(path, options, true);
    // Refresh failed → the session is really gone; reflect that in the UI.
    accessToken = null;
    useAuthStore.getState().clearAuth();
  }

  const data = (await res.json()) as T;

  if (!res.ok) {
    const err = data as { error?: string };
    throw new Error(err.error || `HTTP ${res.status}`);
  }

  return data;
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
  put: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'PUT', body: JSON.stringify(body) }),
  patch: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
};
