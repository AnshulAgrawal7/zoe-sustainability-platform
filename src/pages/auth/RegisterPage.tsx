import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { UserPlus, Check, X } from 'lucide-react';
import PasswordInput from '../../components/ui/PasswordInput';
import { register } from '../../services/authService';
import { useAuthStore } from '../../stores/authStore';
import type { UserLanguage, UserProfile } from '../../types';
import { PROFILE_OPTIONS } from '../../data/profiles';
import {
  passwordChecks,
  isStrongPassword,
  PASSWORD_RULES,
} from '../../utils/password';

export default function RegisterPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [language, setLanguage] = useState<UserLanguage>('EN');
  const [profile, setProfile] = useState<UserProfile>('RESIDENT');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    username?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const [loading, setLoading] = useState(false);

  const checks = passwordChecks(password);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const fe: typeof fieldErrors = {};
    if (!name.trim()) fe.name = t('validation.name');
    if (!/^[a-z0-9_]{3,20}$/.test(username.trim().toLowerCase()))
      fe.username = t('validation.username');
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      fe.email = t('validation.email');
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
      const { user, accessToken } = await register({
        name,
        username: username.trim().toLowerCase(),
        email,
        password,
        language,
        profile,
      });
      setAuth(user, accessToken);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      // Backend returns stable codes for the "already exists" cases so we can
      // place a localised error on the right field.
      const code = err instanceof Error ? err.message : '';
      if (code === 'EMAIL_TAKEN') {
        setFieldErrors((fe) => ({ ...fe, email: t('auth.emailTaken') }));
      } else if (code === 'USERNAME_TAKEN') {
        setFieldErrors((fe) => ({ ...fe, username: t('auth.usernameTaken') }));
      } else {
        setError(t('auth.registerError'));
      }
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
              <UserPlus
                className="h-6 w-6 text-green-600 dark:text-green-400"
                aria-hidden="true"
              />
            </div>
          </div>
          <h1 className="mb-2 text-center text-2xl font-bold text-gray-900 dark:text-white">
            {t('auth.register')}
          </h1>
          <p className="mb-6 text-center text-sm text-gray-500 dark:text-gray-400">
            {t('auth.hasAccount')}{' '}
            <Link
              to="/login"
              className="font-medium text-green-600 hover:underline"
            >
              {t('auth.login')}
            </Link>
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
                htmlFor="name"
                className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                {t('auth.name')}
              </label>
              <input
                id="name"
                type="text"
                autoComplete="name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setFieldErrors((fe) => ({ ...fe, name: undefined }));
                }}
                aria-invalid={!!fieldErrors.name}
                aria-describedby={fieldErrors.name ? 'reg-name-err' : undefined}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
              {fieldErrors.name && (
                <p
                  id="reg-name-err"
                  role="alert"
                  className="mt-1 text-xs text-rose-600 dark:text-rose-400"
                >
                  {fieldErrors.name}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="reg-username"
                className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                {t('auth.username')}
              </label>
              <input
                id="reg-username"
                type="text"
                autoComplete="username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setFieldErrors((fe) => ({ ...fe, username: undefined }));
                }}
                aria-invalid={!!fieldErrors.username}
                aria-describedby="reg-username-hint reg-username-err"
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
              <p
                id="reg-username-hint"
                className="mt-1 text-xs text-gray-500 dark:text-gray-400"
              >
                {t('auth.usernameHint')}
              </p>
              {fieldErrors.username && (
                <p
                  id="reg-username-err"
                  role="alert"
                  className="mt-1 text-xs text-rose-600 dark:text-rose-400"
                >
                  {fieldErrors.username}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="reg-email"
                className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                {t('auth.email')}
              </label>
              <input
                id="reg-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setFieldErrors((fe) => ({ ...fe, email: undefined }));
                }}
                aria-invalid={!!fieldErrors.email}
                aria-describedby={
                  fieldErrors.email ? 'reg-email-err' : undefined
                }
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
              {fieldErrors.email && (
                <p
                  id="reg-email-err"
                  role="alert"
                  className="mt-1 text-xs text-rose-600 dark:text-rose-400"
                >
                  {fieldErrors.email}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="reg-password"
                className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                {t('auth.password')}
              </label>
              <PasswordInput
                id="reg-password"
                autoComplete="new-password"
                minLength={8}
                value={password}
                onChange={(v) => {
                  setPassword(v);
                  setFieldErrors((fe) => ({ ...fe, password: undefined }));
                }}
              />
              {/* Live password-policy checklist (shown once the user types). */}
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
                htmlFor="reg-confirm-password"
                className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                {t('auth.confirmPassword')}
              </label>
              <PasswordInput
                id="reg-confirm-password"
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
            <div>
              <label
                htmlFor="language"
                className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                {t('auth.language')}
              </label>
              <select
                id="language"
                value={language}
                onChange={(e) => setLanguage(e.target.value as UserLanguage)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                <option value="EN">English</option>
                <option value="EL">Ελληνικά</option>
                <option value="DE">Deutsch</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="reg-profile"
                className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                {t('profiles.fieldLabel')}
              </label>
              <select
                id="reg-profile"
                value={profile}
                onChange={(e) => setProfile(e.target.value as UserProfile)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                {PROFILE_OPTIONS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {t(`profiles.${p.id}.label`)}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {t('profiles.hint')}
              </p>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-green-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-60"
            >
              {loading ? t('common.loading') : t('auth.registerButton')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
