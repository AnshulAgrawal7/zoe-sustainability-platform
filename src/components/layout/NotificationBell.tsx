import { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Bell,
  Lightbulb,
  AlertTriangle,
  MessageSquare,
  CalendarPlus,
  AtSign,
  ClipboardCheck,
  type LucideIcon,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../stores/authStore';
import {
  getAdminNotifications,
  type AdminNotification,
  type NotificationKind,
} from '../../services/notificationService';
import {
  getMyNotifications,
  markAllNotificationsRead,
} from '../../services/userNotificationService';
import type { UserNotification } from '../../types';

// ONE bell for everyone. Admins get two sections in the dropdown: the review
// queue (computed, "last seen" tracked locally) and their personal notifications
// (mentions + status updates, read state server-side). Non-admins see only the
// personal section. The badge sums both unread counts.

const ADMIN_LAST_SEEN_KEY = 'zoe.admin.notifications.lastSeen';
const POLL_MS = 60_000;

const LOCALES: Record<string, string> = {
  en: 'en-GB',
  el: 'el-GR',
  de: 'de-DE',
};

const KIND_ICON: Record<NotificationKind, LucideIcon> = {
  IDEA: Lightbulb,
  REPORT: AlertTriangle,
  FEEDBACK: MessageSquare,
  EVENT_PROPOSAL: CalendarPlus,
};
const KIND_ICON_CLASS: Record<NotificationKind, string> = {
  IDEA: 'text-amber-500',
  REPORT: 'text-rose-500',
  FEEDBACK: 'text-blue-500',
  EVENT_PROPOSAL: 'text-teal-500',
};

function adminRouteFor(kind: NotificationKind): string {
  if (kind === 'IDEA') return '/admin/ideas';
  if (kind === 'EVENT_PROPOSAL') return '/admin/event-proposals';
  return '/admin/submissions';
}

function readLastSeen(): number {
  const raw = localStorage.getItem(ADMIN_LAST_SEEN_KEY);
  const n = raw ? Number(raw) : 0;
  return Number.isFinite(n) ? n : 0;
}

export default function NotificationBell() {
  const { t, i18n } = useTranslation();
  const locale = LOCALES[i18n.language.slice(0, 2)] ?? 'en-GB';
  const isAdmin = useAuthStore((s) => s.isAdmin);
  const ref = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(false);

  // Personal notifications (everyone).
  const [userItems, setUserItems] = useState<UserNotification[]>([]);
  const [userUnread, setUserUnread] = useState(0);

  // Admin review queue (admins only).
  const [adminItems, setAdminItems] = useState<AdminNotification[]>([]);
  const [adminLastSeen, setAdminLastSeen] = useState<number>(() =>
    readLastSeen()
  );
  const [adminHighlighted, setAdminHighlighted] = useState<Set<string>>(
    new Set()
  );

  const load = useCallback(() => {
    getMyNotifications()
      .then(({ notifications, unreadCount }) => {
        setUserItems(notifications);
        setUserUnread(unreadCount);
      })
      .catch(() => {});
    if (isAdmin) {
      getAdminNotifications()
        .then(setAdminItems)
        .catch(() => {});
    }
  }, [isAdmin]);

  useEffect(() => {
    load();
    const id = window.setInterval(load, POLL_MS);
    return () => window.clearInterval(id);
  }, [load]);

  useEffect(() => {
    if (!open) return;
    function onPointer(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const adminUnread = isAdmin
    ? adminItems.filter((n) => new Date(n.createdAt).getTime() > adminLastSeen)
        .length
    : 0;
  const totalUnread = userUnread + adminUnread;

  function toggle() {
    if (!open) {
      // Personal: mark all read server-side.
      if (userUnread > 0) {
        setUserUnread(0);
        markAllNotificationsRead().catch(() => null);
      }
      // Admin: snapshot what was unread, then advance the "last seen" marker.
      if (isAdmin) {
        setAdminHighlighted(
          new Set(
            adminItems
              .filter((n) => new Date(n.createdAt).getTime() > adminLastSeen)
              .map((n) => n.id)
          )
        );
        const now = Date.now();
        setAdminLastSeen(now);
        localStorage.setItem(ADMIN_LAST_SEEN_KEY, String(now));
      }
      load();
    }
    setOpen((o) => !o);
  }

  // --- personal notification rendering ---
  function userLinkFor(n: UserNotification): string {
    if (n.type === 'MENTION') {
      if (n.eventId) return `/events/${n.eventId}`;
      if (n.ideaId) return `/ideas/${n.ideaId}`;
      return '#';
    }
    // Status updates take the citizen to their dashboard (their submissions).
    return '/dashboard';
  }

  function userMessageFor(n: UserNotification): string {
    if (n.type === 'MENTION') {
      const actor = n.actorUsername
        ? `@${n.actorUsername}`
        : t('userNotifications.someone');
      const where = n.eventId
        ? t('userNotifications.onEvent')
        : t('userNotifications.onIdea');
      return t('userNotifications.mentioned', { actor, where });
    }
    const statusLabel =
      n.type === 'SUBMISSION_STATUS'
        ? t(`submissionStatus.${n.status}`)
        : n.type === 'PROPOSAL_STATUS'
          ? t(`eventProposalStatus.${n.status}`)
          : t(`ideaStatus.${n.status}`);
    const key =
      n.type === 'IDEA_STATUS'
        ? 'ideaStatusChanged'
        : n.type === 'PROPOSAL_STATUS'
          ? 'proposalStatusChanged'
          : 'submissionStatusChanged';
    return t(`userNotifications.${key}`, { status: statusLabel });
  }

  function adminMessageFor(n: AdminNotification): string {
    const name = n.submitterName ?? t('adminNotifications.someone');
    const key =
      n.kind === 'IDEA'
        ? 'ideaSubmitted'
        : n.kind === 'EVENT_PROPOSAL'
          ? 'eventProposalSubmitted'
          : n.kind === 'REPORT'
            ? 'reportSubmitted'
            : 'feedbackSubmitted';
    return t(`adminNotifications.${key}`, { name });
  }

  function fmt(iso: string): string {
    return new Date(iso).toLocaleDateString(locale, {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  const badge = totalUnread > 9 ? '9+' : String(totalUnread);
  const hasAdminSection = isAdmin && adminItems.length > 0;
  const hasUserSection = userItems.length > 0;

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={toggle}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={
          totalUnread > 0
            ? t('notifications.bellWithCount', { count: totalUnread })
            : t('notifications.bell')
        }
        className="relative rounded-md p-2 text-gray-500 transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 dark:text-gray-400 dark:hover:bg-gray-800 dark:focus-visible:ring-offset-gray-900"
      >
        <Bell size={18} aria-hidden="true" />
        {totalUnread > 0 && (
          <span
            aria-hidden="true"
            className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-rose-600 px-1 text-[10px] font-bold leading-none text-white"
          >
            {badge}
          </span>
        )}
      </button>

      {open && (
        <div
          role="menu"
          aria-label={t('notifications.title')}
          className="absolute right-0 z-50 mt-2 w-80 max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800"
        >
          <div className="border-b border-gray-100 px-4 py-3 dark:border-gray-700">
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {t('notifications.title')}
            </p>
          </div>

          {!hasAdminSection && !hasUserSection ? (
            <p className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
              {t('notifications.empty')}
            </p>
          ) : (
            <div className="max-h-[28rem] overflow-y-auto">
              {/* Admin review queue */}
              {hasAdminSection && (
                <>
                  <p className="flex items-center gap-1.5 bg-gray-50 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-gray-500 dark:bg-gray-900/40 dark:text-gray-400">
                    <ClipboardCheck size={12} aria-hidden="true" />
                    {t('notifications.reviewQueue')}
                  </p>
                  <ul className="divide-y divide-gray-100 dark:divide-gray-700">
                    {adminItems.map((n) => {
                      const Icon = KIND_ICON[n.kind];
                      const isNew = adminHighlighted.has(n.id);
                      return (
                        <li key={n.id}>
                          <Link
                            to={adminRouteFor(n.kind)}
                            role="menuitem"
                            onClick={() => setOpen(false)}
                            className={`flex items-start gap-3 px-4 py-3 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50 ${
                              isNew ? 'bg-green-50/60 dark:bg-green-900/10' : ''
                            }`}
                          >
                            <Icon
                              size={18}
                              aria-hidden="true"
                              className={`mt-0.5 shrink-0 ${KIND_ICON_CLASS[n.kind]}`}
                            />
                            <span className="min-w-0 flex-1">
                              <span className="block text-sm text-gray-800 dark:text-gray-100">
                                {adminMessageFor(n)}
                              </span>
                              <span className="mt-0.5 block truncate text-xs text-gray-500 dark:text-gray-400">
                                {n.title}
                              </span>
                              <span className="mt-0.5 block text-xs text-gray-400 dark:text-gray-500">
                                {fmt(n.createdAt)}
                              </span>
                            </span>
                            {isNew && (
                              <span
                                aria-hidden="true"
                                className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-rose-500"
                              />
                            )}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </>
              )}

              {/* Personal notifications */}
              {hasUserSection && (
                <>
                  {hasAdminSection && (
                    <p className="bg-gray-50 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-gray-500 dark:bg-gray-900/40 dark:text-gray-400">
                      {t('notifications.yours')}
                    </p>
                  )}
                  <ul className="divide-y divide-gray-100 dark:divide-gray-700">
                    {userItems.map((n) => (
                      <li key={n.id}>
                        <Link
                          to={userLinkFor(n)}
                          role="menuitem"
                          onClick={() => setOpen(false)}
                          className={`flex items-start gap-3 px-4 py-3 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50 ${
                            n.read ? '' : 'bg-green-50/60 dark:bg-green-900/10'
                          }`}
                        >
                          {n.type === 'MENTION' ? (
                            <AtSign
                              size={18}
                              aria-hidden="true"
                              className="mt-0.5 shrink-0 text-green-600 dark:text-green-400"
                            />
                          ) : (
                            <ClipboardCheck
                              size={18}
                              aria-hidden="true"
                              className="mt-0.5 shrink-0 text-green-600 dark:text-green-400"
                            />
                          )}
                          <span className="min-w-0 flex-1">
                            <span className="block text-sm text-gray-800 dark:text-gray-100">
                              {userMessageFor(n)}
                            </span>
                            {n.message && (
                              <span className="mt-0.5 block text-xs italic text-gray-600 dark:text-gray-300">
                                “{n.message}”
                              </span>
                            )}
                            <span className="mt-0.5 block text-xs text-gray-400 dark:text-gray-500">
                              {fmt(n.createdAt)}
                            </span>
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
