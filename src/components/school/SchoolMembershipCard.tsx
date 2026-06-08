import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { GraduationCap, LogOut } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import {
  getSchool,
  joinSchool,
  leaveSchool,
} from '../../services/schoolService';

// Lets a citizen join a school by code or leave their current one. Shown on the
// profile page. Members feed the school ranking (avg points per member).
export default function SchoolMembershipCard() {
  const { t } = useTranslation();
  const { user, updateUser } = useAuthStore();
  const [code, setCode] = useState('');
  const [schoolName, setSchoolName] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!user?.schoolId) return;
    let active = true;
    getSchool(user.schoolId)
      .then((s) => {
        if (active) setSchoolName(s.name);
      })
      .catch(() => {
        if (active) setSchoolName(null);
      });
    return () => {
      active = false;
    };
  }, [user?.schoolId]);

  async function handleJoin(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim()) return;
    setError('');
    setBusy(true);
    try {
      const school = await joinSchool(code.trim());
      updateUser({ schoolId: school.id });
      setSchoolName(school.name);
      setCode('');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : t('schools.membership.joinError')
      );
    } finally {
      setBusy(false);
    }
  }

  async function handleLeave() {
    setError('');
    setBusy(true);
    try {
      await leaveSchool();
      updateUser({ schoolId: null });
      setSchoolName(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('common.error'));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-4 rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
      <h2 className="mb-1 flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
        <GraduationCap
          size={16}
          aria-hidden="true"
          className="text-green-600 dark:text-green-400"
        />
        {t('schools.membership.title')}
      </h2>
      <p className="mb-3 text-xs text-gray-500 dark:text-gray-400">
        {t('schools.membership.hint')}{' '}
        <Link to="/school-ranking" className="text-green-600 hover:underline">
          {t('schools.membership.rankingLink')}
        </Link>
      </p>

      {error && (
        <p
          role="alert"
          className="mb-3 rounded-lg bg-red-50 p-2 text-xs text-red-700 dark:bg-red-900/30 dark:text-red-300"
        >
          {error}
        </p>
      )}

      {user?.schoolId ? (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {t('schools.membership.memberOf')}{' '}
            <span className="font-semibold text-gray-900 dark:text-white">
              {schoolName ?? '…'}
            </span>
          </p>
          <button
            type="button"
            onClick={handleLeave}
            disabled={busy}
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-red-600 transition-colors hover:bg-red-50 disabled:opacity-60 dark:border-gray-600 dark:text-red-400 dark:hover:bg-red-900/20"
          >
            <LogOut size={14} aria-hidden="true" />
            {t('schools.membership.leave')}
          </button>
        </div>
      ) : (
        <form onSubmit={handleJoin} className="flex flex-wrap items-end gap-2">
          <div className="flex-1">
            <label
              htmlFor="profile-school-code"
              className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400"
            >
              {t('schools.join.codeLabel')}
            </label>
            <input
              id="profile-school-code"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder={t('schools.join.codePlaceholder')}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 font-mono text-sm uppercase text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <button
            type="submit"
            disabled={busy || !code.trim()}
            className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-green-700 disabled:opacity-60"
          >
            {t('schools.membership.join')}
          </button>
        </form>
      )}
    </div>
  );
}
