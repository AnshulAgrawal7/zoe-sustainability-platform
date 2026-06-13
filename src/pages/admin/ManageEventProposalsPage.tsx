import { useState, useEffect } from 'react';
import Container from '../../components/layout/Container';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CalendarPlus, MapPin, Mail, ArrowRight } from 'lucide-react';
import {
  getEventProposals,
  updateEventProposal,
} from '../../services/eventProposalService';
import type { AdminEventProposal, EventProposalStatus } from '../../types';

const STATUSES: EventProposalStatus[] = ['NEW', 'CONVERTED', 'DECLINED'];

const STATUS_BADGE: Record<EventProposalStatus, string> = {
  NEW: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  CONVERTED:
    'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  DECLINED: 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
};

const LOCALES: Record<string, string> = {
  en: 'en-GB',
  el: 'el-GR',
  de: 'de-DE',
};

export default function ManageEventProposalsPage() {
  const { t, i18n } = useTranslation();
  const locale = LOCALES[i18n.language.slice(0, 2)] ?? 'en-GB';
  const [proposals, setProposals] = useState<AdminEventProposal[]>([]);
  const [filter, setFilter] = useState<EventProposalStatus | 'ALL'>('NEW');
  const [loading, setLoading] = useState(true);
  // Which proposal is in the "decline with a message" state, + the draft message.
  const [decliningId, setDecliningId] = useState<string | null>(null);
  const [declineMsg, setDeclineMsg] = useState('');

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const d = await getEventProposals(
          filter === 'ALL' ? undefined : filter
        );
        if (!cancelled) setProposals(d);
      } catch {
        if (!cancelled) setProposals([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [filter]);

  async function confirmDecline(id: string) {
    const message = declineMsg.trim() || undefined;
    setDecliningId(null);
    setDeclineMsg('');
    setProposals((prev) =>
      filter === 'NEW'
        ? prev.filter((p) => p.id !== id)
        : prev.map((p) =>
            p.id === id
              ? { ...p, status: 'DECLINED', adminNote: message ?? p.adminNote }
              : p
          )
    );
    await updateEventProposal(id, 'DECLINED', { message }).catch(() => null);
  }

  function submitter(p: AdminEventProposal): string {
    if (p.user) return `@${p.user.username}`;
    if (p.submitterName) return p.submitterName;
    return t('adminEventProposals.anonymous');
  }

  return (
    <Container className="py-8">
      <div className="mb-1 flex items-center gap-2">
        <CalendarPlus size={22} className="text-teal-500" aria-hidden="true" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t('adminEventProposals.title')}
        </h1>
      </div>
      <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
        {t('adminEventProposals.subtitle')}
      </p>

      <div
        role="group"
        aria-label={t('adminEventProposals.filterLabel')}
        className="mb-6 flex flex-wrap gap-2"
      >
        {(['ALL', ...STATUSES] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setFilter(s)}
            aria-pressed={filter === s}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 ${
              filter === s
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            {s === 'ALL'
              ? t('adminEventProposals.all')
              : t(`eventProposalStatus.${s}`)}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-gray-500 dark:text-gray-400">
          {t('common.loading')}
        </p>
      ) : proposals.length === 0 ? (
        <p className="py-12 text-center text-gray-500 dark:text-gray-400">
          {t('adminEventProposals.empty')}
        </p>
      ) : (
        <ul className="space-y-3">
          {proposals.map((p) => (
            <li
              key={p.id}
              className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
            >
              <div className="mb-1 flex flex-wrap items-center gap-2">
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${STATUS_BADGE[p.status]}`}
                >
                  {t(`eventProposalStatus.${p.status}`)}
                </span>
                <span className="text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500">
                  {t(`projects.category.${p.category}`)} · {p.lang}
                </span>
              </div>
              <p className="font-medium text-gray-900 dark:text-white">
                {p.title}
              </p>
              <p className="mt-1 whitespace-pre-line text-sm text-gray-600 dark:text-gray-300">
                {p.description}
              </p>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
                <span>
                  {new Date(p.date).toLocaleString(locale, {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
                {p.location && (
                  <span className="inline-flex items-center gap-1">
                    <MapPin size={12} aria-hidden="true" />
                    {p.location}
                    {p.lat != null && ' 📍'}
                  </span>
                )}
                <span>{submitter(p)}</span>
                {p.submitterEmail && (
                  <a
                    href={`mailto:${p.submitterEmail}`}
                    className="inline-flex items-center gap-1 text-green-700 hover:underline dark:text-green-400"
                  >
                    <Mail size={12} aria-hidden="true" />
                    {p.submitterEmail}
                  </a>
                )}
              </div>

              {p.adminNote && (
                <p className="mt-2 rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-600 dark:bg-gray-900/40 dark:text-gray-300">
                  <span className="font-semibold">
                    {t('adminEventProposals.currentNote')}:
                  </span>{' '}
                  {p.adminNote}
                </p>
              )}

              {p.status === 'NEW' &&
                (decliningId === p.id ? (
                  <div className="mt-3 rounded-lg border border-rose-200 bg-rose-50 p-3 dark:border-rose-800 dark:bg-rose-900/20">
                    <label
                      htmlFor={`decline-${p.id}`}
                      className="mb-1 block text-xs font-medium text-rose-800 dark:text-rose-200"
                    >
                      {t('adminEventProposals.declineMessageLabel')}
                    </label>
                    <textarea
                      id={`decline-${p.id}`}
                      rows={2}
                      value={declineMsg}
                      onChange={(e) => setDeclineMsg(e.target.value)}
                      placeholder={t(
                        'adminEventProposals.declineMessagePlaceholder'
                      )}
                      className="w-full resize-none rounded-lg border border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                    <div className="mt-2 flex gap-2">
                      <button
                        type="button"
                        onClick={() => void confirmDecline(p.id)}
                        className="rounded-lg bg-rose-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-rose-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
                      >
                        {t('adminEventProposals.declineConfirm')}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setDecliningId(null);
                          setDeclineMsg('');
                        }}
                        className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-600 transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                      >
                        {t('common.cancel')}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Link
                      to={`/admin/events/new?fromProposal=${p.id}`}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-green-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
                    >
                      {t('adminEventProposals.reviewAndCreate')}
                      <ArrowRight size={14} aria-hidden="true" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        setDecliningId(p.id);
                        setDeclineMsg('');
                      }}
                      className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:border-rose-400 hover:text-rose-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 dark:border-gray-600 dark:text-gray-300"
                    >
                      {t('adminEventProposals.decline')}
                    </button>
                  </div>
                ))}
              {p.status === 'CONVERTED' && p.createdEventId && (
                <Link
                  to={`/events/${p.createdEventId}`}
                  className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-green-700 hover:underline dark:text-green-400"
                >
                  {t('adminEventProposals.viewEvent')}
                  <ArrowRight size={14} aria-hidden="true" />
                </Link>
              )}
            </li>
          ))}
        </ul>
      )}
    </Container>
  );
}
