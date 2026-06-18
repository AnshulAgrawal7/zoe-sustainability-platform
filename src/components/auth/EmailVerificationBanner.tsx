import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MailWarning } from 'lucide-react';
import { resendVerification } from '../../services/authService';
import { useAuthStore } from '../../stores/authStore';

// Shown to logged-in users whose e-mail address is not yet confirmed
// (Future_Work §2.2). Offers a one-click resend. Renders nothing once verified
// or for guests, so it is safe to drop into any authenticated page.
export default function EmailVerificationBanner() {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  // `emailVerified === false` is the only "unverified" signal; `undefined`
  // (legacy payload) is treated as verified to avoid nagging on stale data.
  if (!user || user.emailVerified !== false) return null;

  async function handleResend() {
    setLoading(true);
    try {
      await resendVerification();
      setSent(true);
    } catch {
      // Best-effort; keep the banner so the user can retry.
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      role="status"
      className="mb-6 flex flex-col gap-2 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-700/60 dark:bg-amber-900/20 dark:text-amber-200 sm:flex-row sm:items-center sm:justify-between"
    >
      <span className="flex items-center gap-2">
        <MailWarning className="h-5 w-5 shrink-0" aria-hidden="true" />
        {sent ? t('auth.verifyResent') : t('auth.verifyBanner')}
      </span>
      {!sent && (
        <button
          type="button"
          onClick={handleResend}
          disabled={loading}
          className="shrink-0 rounded-md bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-amber-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 disabled:opacity-60"
        >
          {loading ? t('common.loading') : t('auth.verifyResend')}
        </button>
      )}
    </div>
  );
}
