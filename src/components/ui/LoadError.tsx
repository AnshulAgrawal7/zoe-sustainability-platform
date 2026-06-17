import { useTranslation } from 'react-i18next';
import { AlertTriangle, RotateCw } from 'lucide-react';

interface LoadErrorProps {
  /** When provided, renders a "Try again" button that calls this. */
  onRetry?: () => void;
  /** Override the default "could not load" message. */
  message?: string;
}

// Consistent "couldn't load / backend unreachable" state with an optional
// retry. Used across data-driven pages so a failed fetch is never silently
// shown as an empty list (Future Work 6.7).
export default function LoadError({ onRetry, message }: LoadErrorProps) {
  const { t } = useTranslation();
  return (
    <div
      role="alert"
      className="flex flex-col items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-6 py-12 text-center dark:border-amber-900/50 dark:bg-amber-900/20"
    >
      <AlertTriangle
        className="h-8 w-8 text-amber-600 dark:text-amber-400"
        aria-hidden="true"
      />
      <p className="text-sm text-amber-800 dark:text-amber-200">
        {message ?? t('common.loadError')}
      </p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-2 rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-amber-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
        >
          <RotateCw size={15} aria-hidden="true" />
          {t('common.retry')}
        </button>
      )}
    </div>
  );
}
