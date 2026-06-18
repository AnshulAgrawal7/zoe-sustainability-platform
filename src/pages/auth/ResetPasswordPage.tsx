import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { KeyRound, Check, X } from 'lucide-react';
import PasswordInput from '../../components/ui/PasswordInput';
import { resetPassword } from '../../services/authService';
import {
  passwordChecks,
  isStrongPassword,
  PASSWORD_RULES,
} from '../../utils/password';

export default function ResetPasswordPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const token = params.get('token') ?? '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{
    password?: string;
    confirmPassword?: string;
  }>({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const checks = passwordChecks(password);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const fe: typeof fieldErrors = {};
    if (!password) fe.password = t('validation.password');
    else if (!isStrongPassword(password))
      fe.password = t('validation.passwordWeak');
    if (!confirmPassword) fe.confirmPassword = t('validation.confirmPassword');
    else if (password && confirmPassword !== password)
      fe.confirmPassword = t('validation.passwordMismatch');
    setFieldErrors(fe);
    if (Object.keys(fe).length > 0) return;
    setError('');
    setLoading(true);
    try {
      await resetPassword(token, password);
      // Reset revokes existing sessions; send the user to log in afresh.
      navigate('/login', { replace: true, state: { resetDone: true } });
    } catch (err) {
      const code = err instanceof Error ? err.message : '';
      setError(
        code === 'INVALID_OR_EXPIRED_TOKEN'
          ? t('auth.resetInvalid')
          : t('auth.resetError')
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 dark:bg-gray-900">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-6 flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 dark:bg-green-900">
              <KeyRound
                className="h-6 w-6 text-green-600 dark:text-green-400"
                aria-hidden="true"
              />
            </div>
          </div>
          <h1 className="mb-2 text-center text-2xl font-bold text-gray-900 dark:text-white">
            {t('auth.resetTitle')}
          </h1>

          {!token ? (
            <>
              <p
                role="alert"
                className="mb-6 text-center text-sm text-rose-600 dark:text-rose-400"
              >
                {t('auth.resetNoToken')}
              </p>
              <Link
                to="/forgot-password"
                className="block w-full rounded-lg bg-green-600 px-4 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
              >
                {t('auth.forgotSubmit')}
              </Link>
            </>
          ) : (
            <>
              <p className="mb-6 text-center text-sm text-gray-500 dark:text-gray-400">
                {t('auth.resetIntro')}
              </p>

              {error && (
                <div
                  role="alert"
                  className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-300"
                >
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                <div>
                  <label
                    htmlFor="reset-password"
                    className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    {t('auth.newPassword')}
                  </label>
                  <PasswordInput
                    id="reset-password"
                    autoComplete="new-password"
                    minLength={8}
                    value={password}
                    onChange={(v) => {
                      setPassword(v);
                      setFieldErrors((fe) => ({ ...fe, password: undefined }));
                    }}
                  />
                  {password.length > 0 && (
                    <ul
                      className="mt-2 space-y-1"
                      aria-label={t('auth.passwordReqTitle')}
                    >
                      {PASSWORD_RULES.map((rule) => {
                        const met = checks[rule];
                        return (
                          <li
                            key={rule}
                            className={`flex items-center gap-1.5 text-xs ${
                              met
                                ? 'text-green-700 dark:text-green-400'
                                : 'text-gray-500 dark:text-gray-400'
                            }`}
                          >
                            {met ? (
                              <Check size={14} aria-hidden="true" />
                            ) : (
                              <X size={14} aria-hidden="true" />
                            )}
                            <span>{t(`auth.passwordReq.${rule}`)}</span>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                  {fieldErrors.password && (
                    <p
                      role="alert"
                      className="mt-1 text-xs text-rose-600 dark:text-rose-400"
                    >
                      {fieldErrors.password}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="reset-confirm"
                    className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    {t('auth.confirmPassword')}
                  </label>
                  <PasswordInput
                    id="reset-confirm"
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(v) => {
                      setConfirmPassword(v);
                      setFieldErrors((fe) => ({
                        ...fe,
                        confirmPassword: undefined,
                      }));
                    }}
                  />
                  {fieldErrors.confirmPassword && (
                    <p
                      role="alert"
                      className="mt-1 text-xs text-rose-600 dark:text-rose-400"
                    >
                      {fieldErrors.confirmPassword}
                    </p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-lg bg-green-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-60"
                >
                  {loading ? t('common.loading') : t('auth.resetSubmit')}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
