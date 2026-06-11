import { create } from 'zustand';

export type ToastVariant = 'success' | 'info' | 'error';

export interface Toast {
  id: number;
  /** Already-translated message (callers pass t('key')). */
  message: string;
  variant: ToastVariant;
  /** Auto-dismiss delay in ms (0 = never auto-dismiss). */
  duration: number;
}

interface ToastStore {
  toasts: Toast[];
  /** Show a transient toast; returns its id. */
  showToast: (
    message: string,
    opts?: { variant?: ToastVariant; duration?: number }
  ) => number;
  dismissToast: (id: number) => void;
}

let nextId = 1;

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  showToast: (message, opts) => {
    const id = nextId++;
    const toast: Toast = {
      id,
      message,
      variant: opts?.variant ?? 'success',
      duration: opts?.duration ?? 4000,
    };
    set((state) => ({ toasts: [...state.toasts, toast] }));
    return id;
  },
  dismissToast: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));
