import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LogIn } from 'lucide-react';
import PasswordInput from '../../components/ui/PasswordInput';
import { login } from '../../services/authService';
import { useAuthStore } from '../../stores/authStore';

export default function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const from =
    (location.state as { from?: Location })?.from?.pathname || '/dashboard';

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { user, accessToken } = await login({ email, password });
      setAuth(user, accessToken);
      navigate(from, { replace: true });
    } catch {
      setError(t('auth.loginError'));
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
              <LogIn
                className="h-6 w-6 text-green-600 dark:text-green-400"
                aria-hidden="true"
              />
            </div>
          </div>
          <h1 className="mb-2 text-center text-2xl font-bold text-gray-900 dark:text-white">
            {t('auth.login')}
          </h1>
          <p className="mb-6 text-center text-sm text-gray-500 dark:text-gray-400">
            {t('auth.noAccount')}{' '}
            <Link
              to="/register"
              className="font-medium text-green-600 hover:underline"
            >
              {t('auth.register')}
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
                htmlFor="email"
                className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                {t('auth.email')}
              </label>
              <input
                id="email"
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
                htmlFor="password"
                className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                {t('auth.password')}
              </label>
              <PasswordInput
                id="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={setPassword}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-green-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-60"
            >
              {loading ? t('common.loading') : t('auth.loginButton')}
            </button>
          </form>

          <p className="mt-4 text-center text-xs text-gray-500 dark:text-gray-400">
            Demo: citizen1@example.com / Test1234!
          </p>
        </div>
      </div>
    </div>
  );
}
