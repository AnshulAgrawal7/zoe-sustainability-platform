import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from '../../components/layout/Container';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../stores/authStore';
import { useLanguageStore } from '../../stores/languageStore';
import { useToastStore } from '../../stores/toastStore';
import {
  updateMe,
  downloadMyData,
  deleteMyAccount,
} from '../../services/userService';
import { logout } from '../../services/authService';
import type { Language } from '../../stores/languageStore';
import type { UserLanguage, UserProfile } from '../../types';
import { PROFILE_OPTIONS, PROFILE_EMOJI } from '../../data/profiles';

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
  const navigate = useNavigate();
  const { user, updateUser, clearAuth } = useAuthStore();
  const { setLanguage } = useLanguageStore();
  const showToast = useToastStore((s) => s.showToast);

  const [exporting, setExporting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteAck, setDeleteAck] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleExport() {
    setExporting(true);
    try {
      await downloadMyData();
    } catch {
      showToast(t('common.error'), { variant: 'error' });
    } finally {
      setExporting(false);
    }
  }

  async function handleDeleteAccount() {
    if (!deleteAck) return;
    setDeleting(true);
    try {
      await deleteMyAccount();
      // Best-effort server logout, then drop local session and leave.
      await logout().catch(() => undefined);
      clearAuth();
      showToast(t('profile.data.deleted'), { variant: 'success' });
      navigate('/', { replace: true });
    } catch {
      showToast(t('common.error'), { variant: 'error' });
      setDeleting(false);
    }
  }

  const [name, setName] = useState(user?.name ?? '');
  const [username, setUsername] = useState(user?.username ?? '');
  const [usernameError, setUsernameError] = useState('');
  const [lang, setLang] = useState<UserLanguage>(user?.language ?? 'EN');
  const [profile, setProfile] = useState<UserProfile>(
    user?.profile ?? 'RESIDENT'
  );
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setUsernameError('');
    setSuccess(false);
    const normalized = username.trim().toLowerCase();
    if (!/^[a-z0-9_]{3,20}$/.test(normalized)) {
      setUsernameError(t('validation.username'));
      return;
    }
    setLoading(true);
    try {
      const updated = await updateMe({
        name,
        username: normalized,
        language: lang,
        profile,
      });
      updateUser(updated);
      setLanguage(LANGUAGE_RMAP[lang]);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('common.error'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container maxW="lg" className="py-8">
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
              htmlFor="profile-username"
              className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {t('auth.username')}
            </label>
            <input
              id="profile-username"
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setUsernameError('');
              }}
              aria-invalid={!!usernameError}
              aria-describedby="profile-username-hint profile-username-err"
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
            <p
              id="profile-username-hint"
              className="mt-1 text-xs text-gray-500 dark:text-gray-400"
            >
              {t('auth.usernamePublicHint')}
            </p>
            {usernameError && (
              <p
                id="profile-username-err"
                role="alert"
                className="mt-1 text-xs text-rose-600 dark:text-rose-400"
              >
                {usernameError}
              </p>
            )}
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
          <div>
            <label
              htmlFor="profile-audience"
              className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {t('profiles.fieldLabel')}
            </label>
            <select
              id="profile-audience"
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
            className="w-full rounded-lg bg-green-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-700 disabled:opacity-60"
          >
            {loading ? t('common.loading') : t('common.save')}
          </button>
        </form>
      </div>

      <div className="mt-4 rounded-xl border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
        <p className="text-sm font-semibold text-green-800 dark:text-green-300">
          {PROFILE_EMOJI[profile]} {t('profiles.rewardFocusTitle')} —{' '}
          {t(`profiles.${profile}.label`)}
        </p>
        <p className="mt-1 text-sm text-green-700 dark:text-green-200/90">
          {t(`profiles.${profile}.reward`)}
        </p>
      </div>

      <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {t('common.language')}:{' '}
          <span className="font-semibold text-gray-700 dark:text-gray-200">
            {LANGUAGE_LABELS[user?.language ?? 'EN']}
          </span>
          {' · '}
          {t('common.role')}:{' '}
          <span className="font-semibold text-gray-700 dark:text-gray-200">
            {user?.role}
          </span>
        </p>
      </div>

      {/* GDPR self-service: data export (Art. 15/20) + account deletion (Art. 17) */}
      <section
        aria-labelledby="data-rights-heading"
        className="mt-8 rounded-xl border border-gray-200 p-5 dark:border-gray-700"
      >
        <h2
          id="data-rights-heading"
          className="text-lg font-semibold text-gray-900 dark:text-white"
        >
          {t('profile.data.title')}
        </h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {t('profile.data.subtitle')}
        </p>

        <div className="mt-4">
          <button
            type="button"
            onClick={() => void handleExport()}
            disabled={exporting}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 disabled:opacity-60 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            {exporting ? t('common.loading') : t('profile.data.export')}
          </button>
        </div>

        <div className="mt-6 border-t border-gray-200 pt-5 dark:border-gray-700">
          <h3 className="text-sm font-semibold text-rose-700 dark:text-rose-400">
            {t('profile.data.deleteTitle')}
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {t('profile.data.deleteWarning')}
          </p>

          {!confirmDelete ? (
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              className="mt-3 rounded-lg border border-rose-300 px-4 py-2 text-sm font-medium text-rose-700 transition-colors hover:bg-rose-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 dark:border-rose-800 dark:text-rose-400 dark:hover:bg-rose-900/20"
            >
              {t('profile.data.deleteButton')}
            </button>
          ) : (
            <div className="mt-3 space-y-3 rounded-lg border border-rose-300 bg-rose-50 p-4 dark:border-rose-800 dark:bg-rose-900/20">
              <label className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-200">
                <input
                  type="checkbox"
                  checked={deleteAck}
                  onChange={(e) => setDeleteAck(e.target.checked)}
                  className="mt-0.5 h-4 w-4 shrink-0 rounded border-gray-300 text-rose-600 focus:ring-2 focus:ring-rose-500 dark:border-gray-600 dark:bg-gray-700"
                />
                <span>{t('profile.data.deleteConfirm')}</span>
              </label>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => void handleDeleteAccount()}
                  disabled={!deleteAck || deleting}
                  className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-rose-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 disabled:opacity-50 dark:focus-visible:ring-offset-gray-900"
                >
                  {deleting
                    ? t('common.loading')
                    : t('profile.data.deleteFinal')}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setConfirmDelete(false);
                    setDeleteAck(false);
                  }}
                  disabled={deleting}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 disabled:opacity-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
                >
                  {t('common.cancel')}
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </Container>
  );
}
