import { create } from 'zustand';
import type { AuthUser } from '../types';

interface AuthStore {
  user: AuthUser | null;
  accessToken: string | null;
  setAuth: (user: AuthUser, token: string) => void;
  updateUser: (updates: Partial<AuthUser>) => void;
  clearAuth: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isAdmin: false,
  setAuth: (user, token) =>
    set({
      user,
      accessToken: token,
      isAuthenticated: true,
      isAdmin: user.role === 'ADMIN',
    }),
  updateUser: (updates) => {
    const current = get().user;
    if (current) set({ user: { ...current, ...updates } });
  },
  clearAuth: () =>
    set({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isAdmin: false,
    }),
}));
