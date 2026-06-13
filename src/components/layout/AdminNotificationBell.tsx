import { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Bell,
  Lightbulb,
  AlertTriangle,
  MessageSquare,
  CalendarPlus,
  type LucideIcon,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  getAdminNotifications,
  type AdminNotification,
  type NotificationKind,
} from '../../services/notificationService';

// Per-admin "last seen" marker. Items newer than this drive the unread count;
// opening the bell advances it to now, so the badge clears (conventional
// notification-bell behaviour). Stored locally — no server-side read state.
const STORAGE_KEY = 'zoe.admin.notifications.lastSeen';
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

function readLastSeen(): number {
  const raw = localStorage.getItem(STORAGE_KEY);
  const n = raw ? Number(raw) : 0;
  return Number.isFinite(n) ? n : 0;
}

// Where each kind is reviewed/approved by an admin.
function routeFor(kind: NotificationKind): string {
  if (kind === 'IDEA') return '/admin/ideas';
  if (kind === 'EVENT_PROPOSAL') return '/admin/event-proposals';
  return '/admin/submissions';
}

export default function AdminNotificationBell() {
  const { t, i18n } = useTranslation();
  const locale = LOCALES[i18n.language.slice(0, 2)] ?? 'en-GB';
  const ref = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<AdminNotification[]>([]);
  const [lastSeen, setLastSeen] = useState<number>(() => readLastSeen());
  // Items that were unread the moment the panel was opened — kept highlighted
  // for that viewing even after `lastSeen` advances and clears the badge.
  const [highlighted, setHighlighted] = useState<Set<string>>(new Set());

  const load = useCallback(() => {
    getAdminNotifications()
      .then(setItems)
      .catch(() => {
        /* ignore — keep the last good list */
      });
  }, []);

  // Fetch on mount and poll so the count stays roughly live.
  useEffect(() => {
    load();
    const id = window.setInterval(load, POLL_MS);
    return () => window.clearInterval(id);
  }, [load]);

  // Close on outside click / Escape while open.
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

  const unreadCount = items.filter(
    (n) => new Date(n.createdAt).getTime() > lastSeen
  ).length;

  function toggle() {
    if (!open) {
      // Snapshot what is unread, then mark everything as seen.
      setHighlighted(
        new Set(
          items
            .filter((n) => new Date(n.createdAt).getTime() > lastSeen)
            .map((n) => n.id)
        )
      );
      const now = Date.now();
      setLastSeen(now);
      localStorage.setItem(STORAGE_KEY, String(now));
      load();
    }
    setOpen((o) => !o);
  }

  function messageFor(n: AdminNotification): string {
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

  const badge = unreadCount > 9 ? '9+' : String(unreadCount);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={toggle}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={
          unreadCount > 0
            ? t('adminNotifications.bellWithCount', { count: unreadCount })
            : t('adminNotifications.bell')
        }
        className="relative rounded-md p-2 text-gray-500 transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 dark:text-gray-400 dark:hover:bg-gray-800 dark:focus-visible:ring-offset-gray-900"
      >
        <Bell size={18} aria-hidden="true" />
        {unreadCount > 0 && (
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
          aria-label={t('adminNotifications.title')}
          className="absolute right-0 z-50 mt-2 w-80 max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800"
        >
          <div className="border-b border-gray-100 px-4 py-3 dark:border-gray-700">
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {t('adminNotifications.title')}
            </p>
          </div>

          {items.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
              {t('adminNotifications.empty')}
            </p>
          ) : (
            <ul className="max-h-96 divide-y divide-gray-100 overflow-y-auto dark:divide-gray-700">
              {items.map((n) => {
                const Icon = KIND_ICON[n.kind];
                const isNew = highlighted.has(n.id);
                return (
                  <li key={n.id}>
                    <Link
                      to={routeFor(n.kind)}
                      role="menuitem"
                      onClick={() => setOpen(false)}
                      className={`flex items-start gap-3 px-4 py-3 transition-colors hover:bg-gray-50 focus-visible:bg-gray-50 focus-visible:outline-none dark:hover:bg-gray-700/50 dark:focus-visible:bg-gray-700/50 ${
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
                          {messageFor(n)}
                        </span>
                        <span className="mt-0.5 block truncate text-xs text-gray-500 dark:text-gray-400">
                          {n.title}
                        </span>
                        <span className="mt-0.5 block text-xs text-gray-400 dark:text-gray-500">
                          {new Date(n.createdAt).toLocaleDateString(locale, {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
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
          )}
        </div>
      )}
    </div>
  );
}
