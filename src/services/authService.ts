import { api, setAccessToken } from './api';
import type {
  ApiResponse,
  AuthUser,
  AuthTokens,
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

export async function refreshToken(): Promise<string | null> {
  try {
    const res = await api.post<ApiResponse<AuthTokens>>('/auth/refresh', {});
    setAccessToken(res.data.accessToken);
    return res.data.accessToken;
  } catch {
    setAccessToken(null);
    return null;
  }
}
