import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { KeyRound, MailCheck } from 'lucide-react';
import { requestPasswordReset } from '../../services/authService';

export default function ForgotPasswordPage() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [fieldError, setFieldError] = useState<string | undefined>();
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setFieldError(t('validation.email'));
      return;
    }
    setLoading(true);
    try {
      await requestPasswordReset(email.trim());
    } catch {
      // The endpoint never reveals whether the address exists; on a transport
      // error we still show the same generic confirmation (no enumeration).
    } finally {
      setSent(true);
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 dark:bg-gray-900">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-6 flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 dark:bg-green-900">
              {sent ? (
                <MailCheck
                  className="h-6 w-6 text-green-600 dark:text-green-400"
                  aria-hidden="true"
                />
              ) : (
                <KeyRound
                  className="h-6 w-6 text-green-600 dark:text-green-400"
                  aria-hidden="true"
                />
              )}
            </div>
          </div>
          <h1 className="mb-2 text-center text-2xl font-bold text-gray-900 dark:text-white">
            {t('auth.forgotTitle')}
          </h1>

          {sent ? (
            <>
              <p
                role="status"
                className="mb-6 text-center text-sm text-gray-600 dark:text-gray-300"
              >
                {t('auth.forgotSent')}
              </p>
              <Link
                to="/login"
                className="block w-full rounded-lg bg-green-600 px-4 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
              >
                {t('auth.backToLogin')}
              </Link>
            </>
          ) : (
            <>
              <p className="mb-6 text-center text-sm text-gray-500 dark:text-gray-400">
                {t('auth.forgotIntro')}
              </p>
              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                <div>
                  <label
                    htmlFor="forgot-email"
                    className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    {t('auth.email')}
                  </label>
                  <input
                    id="forgot-email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setFieldError(undefined);
                    }}
                    aria-invalid={!!fieldError}
                    aria-describedby={
                      fieldError ? 'forgot-email-err' : undefined
                    }
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                  {fieldError && (
                    <p
                      id="forgot-email-err"
                      role="alert"
                      className="mt-1 text-xs text-rose-600 dark:text-rose-400"
                    >
                      {fieldError}
                    </p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-lg bg-green-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-60"
                >
                  {loading ? t('common.loading') : t('auth.forgotSubmit')}
                </button>
              </form>
              <p className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
                <Link
                  to="/login"
                  className="font-medium text-green-600 hover:underline"
                >
                  {t('auth.backToLogin')}
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
