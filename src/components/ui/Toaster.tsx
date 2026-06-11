import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle2, Info, AlertCircle, X } from 'lucide-react';
import { useToastStore, type Toast } from '../../stores/toastStore';

// Global toast region. Rendered once in the Layout. Each toast auto-dismisses
// after its `duration` and can also be closed manually. The region is an
// aria-live status area so screen readers announce new toasts politely.

const VARIANT: Record<
  Toast['variant'],
  { Icon: typeof CheckCircle2; classes: string; iconClass: string }
> = {
  success: {
    Icon: CheckCircle2,
    classes:
      'border-green-200 bg-green-50 text-green-900 dark:border-green-800 dark:bg-green-950 dark:text-green-100',
    iconClass: 'text-green-600 dark:text-green-400',
  },
  info: {
    Icon: Info,
    classes:
      'border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-100',
    iconClass: 'text-blue-600 dark:text-blue-400',
  },
  error: {
    Icon: AlertCircle,
    classes:
      'border-red-200 bg-red-50 text-red-900 dark:border-red-800 dark:bg-red-950 dark:text-red-100',
    iconClass: 'text-red-600 dark:text-red-400',
  },
};

function ToastItem({ toast }: { toast: Toast }) {
  const { t } = useTranslation();
  const dismissToast = useToastStore((s) => s.dismissToast);
  const { Icon, classes, iconClass } = VARIANT[toast.variant];

  // Auto-dismiss timer, scoped to this toast and cleared on manual close/unmount.
  useEffect(() => {
    if (toast.duration <= 0) return;
    const id = window.setTimeout(() => dismissToast(toast.id), toast.duration);
    return () => window.clearTimeout(id);
  }, [toast.id, toast.duration, dismissToast]);

  return (
    <div
      className={`pointer-events-auto flex w-full items-start gap-3 rounded-lg border px-4 py-3 shadow-lg motion-safe:animate-[fade-in_0.2s_ease-out] ${classes}`}
    >
      <Icon
        size={20}
        aria-hidden="true"
        className={`mt-0.5 shrink-0 ${iconClass}`}
      />
      <p className="flex-1 text-sm font-medium">{toast.message}</p>
      <button
        type="button"
        onClick={() => dismissToast(toast.id)}
        aria-label={t('common.close')}
        className="shrink-0 rounded p-0.5 opacity-70 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current"
      >
        <X size={16} aria-hidden="true" />
      </button>
    </div>
  );
}

export default function Toaster() {
  const toasts = useToastStore((s) => s.toasts);

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 top-4 z-[60] mx-auto flex max-w-sm flex-col gap-2 px-4 sm:left-auto sm:right-4 sm:mx-0"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  );
}
