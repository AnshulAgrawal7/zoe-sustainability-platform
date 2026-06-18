import { api, setAccessToken } from './api';
import type {
  ApiResponse,
  AuthUser,
  LoginPayload,
  RegisterPayload,
} from '../types';

interface AuthResponse {
  user: AuthUser;
  accessToken: string;
}

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const res = await api.post<ApiResponse<AuthResponse>>('/auth/login', payload);
  setAccessToken(res.data.accessToken);
  return res.data;
}

export async function register(
  payload: RegisterPayload
): Promise<AuthResponse> {
  const res = await api.post<ApiResponse<AuthResponse>>(
    '/auth/register',
    payload
  );
  setAccessToken(res.data.accessToken);
  return res.data;
}

export async function logout(): Promise<void> {
  await api.post<ApiResponse<null>>('/auth/logout', {}).catch(() => null);
  setAccessToken(null);
}

// Password reset (Future_Work §2.1). `requestPasswordReset` always resolves with
// the same generic message regardless of whether the address exists (the backend
// never reveals it), so the UI shows one confirmation either way.
export async function requestPasswordReset(email: string): Promise<void> {
  await api.post<ApiResponse<null>>('/auth/forgot-password', { email });
}

export async function resetPassword(
  token: string,
  password: string
): Promise<void> {
  await api.post<ApiResponse<null>>('/auth/reset-password', {
    token,
    password,
  });
}

// Session bootstrap on app start: the refresh token lives in an httpOnly cookie,
// so a page reload can silently restore the full session (user + fresh access
// token) in one round-trip. Returns null for guests / expired sessions.
export async function initAuth(): Promise<AuthResponse | null> {
  try {
    const res = await api.post<ApiResponse<AuthResponse>>('/auth/refresh', {});
    setAccessToken(res.data.accessToken);
    return res.data;
  } catch {
    setAccessToken(null);
    return null;
  }
}
