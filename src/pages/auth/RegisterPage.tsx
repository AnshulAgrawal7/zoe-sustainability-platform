import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { UserPlus } from 'lucide-react';
import { register } from '../../services/authService';
import { useAuthStore } from '../../stores/authStore';
import type { UserLanguage, UserProfile } from '../../types';
import { PROFILE_OPTIONS } from '../../data/profiles';

export default function RegisterPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [language, setLanguage] = useState<UserLanguage>('EN');
  const [profile, setProfile] = useState<UserProfile>('RESIDENT');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { user, accessToken } = await register({
        name,
        email,
        password,
        language,
        profile,
      });
      setAuth(user, accessToken);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : t('auth.registerError'));
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
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
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
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label
                htmlFor="reg-password"
                className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                {t('auth.password')}
              </label>
              <input
                id="reg-password"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
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
                    {p.emoji} {t(`profiles.${p.id}.label`)}
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
