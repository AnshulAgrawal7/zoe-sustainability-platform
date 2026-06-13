import { useState, useEffect } from 'react';
import Container from '../../components/layout/Container';
import { useTranslation } from 'react-i18next';
import {
  AlertTriangle,
  MessageSquare,
  User as UserIcon,
  Mail,
  Loader2,
} from 'lucide-react';
import {
  getAdminSubmissions,
  updateSubmissionStatus,
} from '../../services/submissionService';
import { useToastStore } from '../../stores/toastStore';
import type {
  ApiSubmission,
  SubmissionType,
  SubmissionStatus,
} from '../../types';

const LOCALES: Record<string, string> = {
  en: 'en-GB',
  el: 'el-GR',
  de: 'de-DE',
};

const TYPE_FILTERS: ('' | SubmissionType)[] = ['', 'REPORT', 'FEEDBACK'];
const STATUSES: SubmissionStatus[] = [
  'NEW',
  'IN_REVIEW',
  'RESOLVED',
  'DECLINED',
];

const STATUS_BADGE: Record<SubmissionStatus, string> = {
  NEW: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  IN_REVIEW:
    'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  RESOLVED:
    'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  DECLINED: 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
};

interface Draft {
  status: SubmissionStatus;
  message: string;
}

// Citizen reports & feedback: review, set a handling status and reply — the
// submitter sees the status + reply in their dashboard (and gets notified).
export default function ManageSubmissionsPage() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language.slice(0, 2);
  const locale = LOCALES[lang] ?? 'en-GB';
  const showToast = useToastStore((s) => s.showToast);

  const [submissions, setSubmissions] = useState<ApiSubmission[]>([]);
  const [typeFilter, setTypeFilter] = useState<'' | SubmissionType>('');
  const [loading, setLoading] = useState(true);
  const [drafts, setDrafts] = useState<Record<string, Draft>>({});
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    getAdminSubmissions(typeFilter || undefined)
      .then((data) => {
        setSubmissions(data);
        setDrafts(
          Object.fromEntries(
            data.map((s) => [s.id, { status: s.status, message: '' }])
          )
        );
      })
      .catch(() => setSubmissions([]))
      .finally(() => setLoading(false));
  }, [typeFilter]);

  function setDraft(id: string, patch: Partial<Draft>) {
    setDrafts((prev) => ({ ...prev, [id]: { ...prev[id], ...patch } }));
  }

  async function save(s: ApiSubmission) {
    const draft = drafts[s.id];
    if (!draft) return;
    setSavingId(s.id);
    try {
      await updateSubmissionStatus(
        s.id,
        draft.status,
        draft.message || undefined
      );
      showToast(t('adminSubmissions.saved'));
      setSubmissions((prev) =>
        prev.map((x) =>
          x.id === s.id
            ? {
                ...x,
                status: draft.status,
                adminNote: draft.message || x.adminNote,
              }
            : x
        )
      );
      setDraft(s.id, { message: '' });
    } catch {
      showToast(t('common.error'));
    } finally {
      setSavingId(null);
    }
  }

  function submitter(s: ApiSubmission): string {
    if (s.user) return `${s.user.name} (@${s.user.username})`;
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
          {submissions.map((s) => {
            const draft = drafts[s.id] ?? { status: s.status, message: '' };
            const dirty =
              draft.status !== s.status || draft.message.trim().length > 0;
            return (
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
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${STATUS_BADGE[s.status]}`}
                  >
                    {t(`submissionStatus.${s.status}`)}
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
                {s.adminNote && (
                  <p className="mb-3 rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-600 dark:bg-gray-900/40 dark:text-gray-300">
                    <span className="font-semibold">
                      {t('adminSubmissions.currentReply')}:
                    </span>{' '}
                    {s.adminNote}
                  </p>
                )}
                <p className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-gray-100 pt-2 text-xs text-gray-500 dark:border-gray-700 dark:text-gray-400">
                  <span className="inline-flex items-center gap-1.5">
                    <UserIcon size={12} aria-hidden="true" />
                    {submitter(s)}
                  </span>
                  {s.submitterEmail && (
                    <a
                      href={`mailto:${s.submitterEmail}`}
                      className="inline-flex items-center gap-1 font-medium text-green-700 hover:underline dark:text-green-400"
                    >
                      <Mail size={12} aria-hidden="true" />
                      {s.submitterEmail}
                    </a>
                  )}
                </p>

                {/* Handling: status + optional reply to the submitter. */}
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
                  <div className="sm:w-44">
                    <label
                      htmlFor={`sub-status-${s.id}`}
                      className="mb-1 block text-xs text-gray-500 dark:text-gray-400"
                    >
                      {t('adminSubmissions.statusLabel')}
                    </label>
                    <select
                      id={`sub-status-${s.id}`}
                      value={draft.status}
                      onChange={(e) =>
                        setDraft(s.id, {
                          status: e.target.value as SubmissionStatus,
                        })
                      }
                      className="w-full rounded-lg border border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    >
                      {STATUSES.map((st) => (
                        <option key={st} value={st}>
                          {t(`submissionStatus.${st}`)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex-1">
                    <label
                      htmlFor={`sub-msg-${s.id}`}
                      className="mb-1 block text-xs text-gray-500 dark:text-gray-400"
                    >
                      {t('adminSubmissions.replyLabel')}
                    </label>
                    <input
                      id={`sub-msg-${s.id}`}
                      type="text"
                      value={draft.message}
                      onChange={(e) =>
                        setDraft(s.id, { message: e.target.value })
                      }
                      placeholder={t('adminSubmissions.replyPlaceholder')}
                      className="w-full rounded-lg border border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => void save(s)}
                    disabled={savingId === s.id || !dirty}
                    className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-green-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 disabled:opacity-50"
                  >
                    {savingId === s.id && (
                      <Loader2
                        size={13}
                        className="motion-safe:animate-spin"
                        aria-hidden="true"
                      />
                    )}
                    {t('adminSubmissions.save')}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Container>
  );
}
