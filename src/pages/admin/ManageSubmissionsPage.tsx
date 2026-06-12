import { useState, useEffect } from 'react';
import Container from '../../components/layout/Container';
import { useTranslation } from 'react-i18next';
import { AlertTriangle, MessageSquare, User as UserIcon } from 'lucide-react';
import { getAdminSubmissions } from '../../services/submissionService';
import type { ApiSubmission, SubmissionType } from '../../types';

const LOCALES: Record<string, string> = {
  en: 'en-GB',
  el: 'el-GR',
  de: 'de-DE',
};

const TYPE_FILTERS: ('' | SubmissionType)[] = ['', 'REPORT', 'FEEDBACK'];

// Read-only overview of citizen reports & feedback (no workflow yet — the team
// reviews them here; actions are Future Work).
export default function ManageSubmissionsPage() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language.slice(0, 2);
  const locale = LOCALES[lang] ?? 'en-GB';

  const [submissions, setSubmissions] = useState<ApiSubmission[]>([]);
  const [typeFilter, setTypeFilter] = useState<'' | SubmissionType>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminSubmissions(typeFilter || undefined)
      .then(setSubmissions)
      .catch(() => setSubmissions([]))
      .finally(() => setLoading(false));
  }, [typeFilter]);

  function submitter(s: ApiSubmission): string {
    if (s.user) return `${s.user.name} (${s.user.email})`;
    if (s.submitterName || s.submitterEmail)
      return [s.submitterName, s.submitterEmail].filter(Boolean).join(' · ');
    return t('adminSubmissions.anonymous');
  }

  return (
    <Container className="py-8">
      <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
        {t('adminSubmissions.title')}
      </h1>
      <p className="mb-6 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
        {t('adminSubmissions.intro')}
      </p>

      {/* Type filter */}
      <div
        className="mb-6 flex flex-wrap gap-2"
        role="group"
        aria-label={t('adminSubmissions.filterBy')}
      >
        {TYPE_FILTERS.map((f) => (
          <button
            key={f || 'all'}
            onClick={() => setTypeFilter(f)}
            aria-pressed={typeFilter === f}
            className={`rounded-full border px-3 py-1.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 ${
              typeFilter === f
                ? 'border-green-600 bg-green-600 text-white'
                : 'border-gray-300 bg-white text-gray-600 hover:border-green-400 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300'
            }`}
          >
            {f === ''
              ? t('adminSubmissions.all')
              : t(`adminSubmissions.type${f}`)}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-gray-500 dark:text-gray-400">
          {t('common.loading')}
        </p>
      ) : submissions.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">
          {t('adminSubmissions.empty')}
        </p>
      ) : (
        <ul className="space-y-3">
          {submissions.map((s) => (
            <li
              key={s.id}
              className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
            >
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    s.type === 'REPORT'
                      ? 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300'
                      : 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300'
                  }`}
                >
                  {s.type === 'REPORT' ? (
                    <AlertTriangle size={12} aria-hidden="true" />
                  ) : (
                    <MessageSquare size={12} aria-hidden="true" />
                  )}
                  {t(`adminSubmissions.type${s.type}`)}
                </span>
                <time
                  dateTime={s.createdAt}
                  className="text-xs text-gray-400 dark:text-gray-500"
                >
                  {new Date(s.createdAt).toLocaleDateString(locale, {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </time>
              </div>
              <p className="mb-3 whitespace-pre-line text-sm leading-relaxed text-gray-700 dark:text-gray-200">
                {s.message}
              </p>
              <p className="flex items-center gap-1.5 border-t border-gray-100 pt-2 text-xs text-gray-500 dark:border-gray-700 dark:text-gray-400">
                <UserIcon size={12} aria-hidden="true" />
                {submitter(s)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </Container>
  );
}
