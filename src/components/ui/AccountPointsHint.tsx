import { Link } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../stores/authStore';

interface AccountPointsHintProps {
  /** Margin/spacing utilities for the placement context. */
  className?: string;
}

// Guests-only notice: ZOE points for rewards require an account. Shown on the
// pages where points can be earned (participate, events) for consistency.
export default function AccountPointsHint({
  className = '',
}: AccountPointsHintProps) {
  const { t } = useTranslation();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  if (isAuthenticated) return null;

  return (
    <div
      className={`flex flex-col gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20 sm:flex-row sm:items-center sm:justify-between ${className}`}
    >
      <p className="flex items-start gap-2 text-sm text-amber-800 dark:text-amber-200">
        <UserPlus size={16} aria-hidden="true" className="mt-0.5 shrink-0" />
        {t('participate.accountHint')}
      </p>
      <div className="flex shrink-0 items-center gap-3">
        <Link
          to="/register"
          className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
        >
          {t('participate.accountHintCta')}
        </Link>
        <Link
          to="/login"
          className="text-sm font-medium text-green-700 hover:underline dark:text-green-400"
        >
          {t('nav.login')}
        </Link>
      </div>
    </div>
  );
}
