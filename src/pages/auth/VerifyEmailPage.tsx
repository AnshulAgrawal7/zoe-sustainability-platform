import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MailCheck, MailX, Loader2 } from 'lucide-react';
import { verifyEmail } from '../../services/authService';
import { useAuthStore } from '../../stores/authStore';

type Status = 'pending' | 'success' | 'error';

export default function VerifyEmailPage() {
  const { t } = useTranslation();
  const [params] = useSearchParams();
  const token = params.get('token') ?? '';
  const updateUser = useAuthStore((s) => s.updateUser);
  const [status, setStatus] = useState<Status>(token ? 'pending' : 'error');
  // Guard against double-invocation (React 18 StrictMode mounts effects twice).
  const ran = useRef(false);

  useEffect(() => {
    if (!token || ran.current) return;
    ran.current = true;
    verifyEmail(token)
      .then(() => {
        setStatus('success');
        // If the user is logged in, reflect the new state immediately.
        updateUser({ emailVerified: true });
      })
      .catch(() => setStatus('error'));
  }, [token, updateUser]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 dark:bg-gray-900">
      <div className="w-full max-w-md text-center">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-6 flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 dark:bg-green-900">
              {status === 'pending' && (
                <Loader2
                  className="h-6 w-6 text-green-600 motion-safe:animate-spin dark:text-green-400"
                  aria-hidden="true"
                />
              )}
              {status === 'success' && (
                <MailCheck
                  className="h-6 w-6 text-green-600 dark:text-green-400"
                  aria-hidden="true"
                />
              )}
              {status === 'error' && (
                <MailX
                  className="h-6 w-6 text-rose-600 dark:text-rose-400"
                  aria-hidden="true"
                />
              )}
            </div>
          </div>
          <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
            {t('auth.verifyTitle')}
          </h1>
          <p
            role={status === 'error' ? 'alert' : 'status'}
            className="mb-6 text-sm text-gray-600 dark:text-gray-300"
          >
            {status === 'pending' && t('auth.verifyPending')}
            {status === 'success' && t('auth.verifySuccess')}
            {status === 'error' && t('auth.verifyError')}
          </p>
          {status !== 'pending' && (
            <Link
              to="/login"
              className="inline-block rounded-lg bg-green-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
            >
              {t('auth.backToLogin')}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
