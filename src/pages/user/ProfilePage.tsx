import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../stores/authStore';
import { useLanguageStore } from '../../stores/languageStore';
import { updateMe } from '../../services/userService';
import type { Language } from '../../stores/languageStore';
import type { UserLanguage } from '../../types';

const LANGUAGE_LABELS: Record<UserLanguage, string> = {
  EN: 'English',
  EL: 'Ελληνικά',
  DE: 'Deutsch',
};
const LANGUAGE_RMAP: Record<UserLanguage, Language> = {
  EN: 'en',
  EL: 'el',
  DE: 'de',
};

export default function ProfilePage() {
  const { t } = useTranslation();
  const { user, updateUser } = useAuthStore();
  const { setLanguage } = useLanguageStore();

  const [name, setName] = useState(user?.name ?? '');
  const [lang, setLang] = useState<UserLanguage>(user?.language ?? 'EN');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);
    try {
      const updated = await updateMe({ name, language: lang });
      updateUser(updated);
      setLanguage(LANGUAGE_RMAP[lang]);
      setSuccess(true);
    } catch {
      setError(t('common.error'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
        {t('nav.profile')}
      </h1>
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <form onSubmit={handleSave} className="space-y-4">
          {success && (
            <div
              role="status"
              className="rounded-lg bg-green-50 p-3 text-sm text-green-700 dark:bg-green-900/30 dark:text-green-300"
            >
              {t('common.save')} ✓
            </div>
          )}
          {error && (
            <div
              role="alert"
              className="rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-300"
            >
              {error}
            </div>
          )}
          <div>
            <label
              htmlFor="profile-name"
              className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {t('auth.name')}
            </label>
            <input
              id="profile-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label
              htmlFor="profile-email"
              className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {t('auth.email')}
            </label>
            <input
              id="profile-email"
              type="email"
              value={user?.email ?? ''}
              disabled
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400"
            />
          </div>
          <div>
            <label
              htmlFor="profile-lang"
              className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {t('auth.language')}
            </label>
            <select
              id="profile-lang"
              value={lang}
              onChange={(e) => setLang(e.target.value as UserLanguage)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="EN">English</option>
              <option value="EL">Ελληνικά</option>
              <option value="DE">Deutsch</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-green-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-700 disabled:opacity-60"
          >
            {loading ? t('common.loading') : t('common.save')}
          </button>
        </form>
      </div>

      <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {t('common.language')}:{' '}
          <span className="font-semibold text-gray-700 dark:text-gray-200">
            {LANGUAGE_LABELS[user?.language ?? 'EN']}
          </span>
          {' · '}Role:{' '}
          <span className="font-semibold text-gray-700 dark:text-gray-200">
            {user?.role}
          </span>
        </p>
      </div>
    </div>
  );
}
