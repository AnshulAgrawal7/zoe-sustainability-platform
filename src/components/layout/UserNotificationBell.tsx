import { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Bell, AtSign } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  getMyNotifications,
  markAllNotificationsRead,
} from '../../services/userNotificationService';
import type { UserNotification } from '../../types';

const POLL_MS = 60_000;

const LOCALES: Record<string, string> = {
  en: 'en-GB',
  el: 'el-GR',
  de: 'de-DE',
};

// Citizen-facing notification bell: shows mentions ("@you was mentioned") with an
// unread count. Read state is server-side — opening the panel marks all read.
export default function UserNotificationBell() {
  const { t, i18n } = useTranslation();
  const locale = LOCALES[i18n.language.slice(0, 2)] ?? 'en-GB';
  const ref = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<UserNotification[]>([]);
  const [unread, setUnread] = useState(0);

  const load = useCallback(() => {
    getMyNotifications()
      .then(({ notifications, unreadCount }) => {
        setItems(notifications);
        setUnread(unreadCount);
      })
      .catch(() => {
        /* ignore — keep last good state */
      });
  }, []);

  useEffect(() => {
    load();
    const handle = window.setInterval(load, POLL_MS);
    return () => window.clearInterval(handle);
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

  function toggle() {
    if (!open && unread > 0) {
      setUnread(0);
      markAllNotificationsRead().catch(() => null);
    }
    if (!open) load();
    setOpen((o) => !o);
  }

  function linkFor(n: UserNotification): string {
    if (n.eventId) return `/events/${n.eventId}`;
    if (n.ideaId) return `/ideas/${n.ideaId}`;
    return '#';
  }

  function messageFor(n: UserNotification): string {
    const actor = n.actorUsername
      ? `@${n.actorUsername}`
      : t('userNotifications.someone');
    const where = n.eventId
      ? t('userNotifications.onEvent')
      : t('userNotifications.onIdea');
    return t('userNotifications.mentioned', { actor, where });
  }

  const badge = unread > 9 ? '9+' : String(unread);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={toggle}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={
          unread > 0
            ? t('userNotifications.bellWithCount', { count: unread })
            : t('userNotifications.bell')
        }
        className="relative rounded-md p-2 text-gray-500 transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 dark:text-gray-400 dark:hover:bg-gray-800 dark:focus-visible:ring-offset-gray-900"
      >
        <Bell size={18} aria-hidden="true" />
        {unread > 0 && (
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
          aria-label={t('userNotifications.title')}
          className="absolute right-0 z-50 mt-2 w-80 max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800"
        >
          <div className="border-b border-gray-100 px-4 py-3 dark:border-gray-700">
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {t('userNotifications.title')}
            </p>
          </div>

          {items.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
              {t('userNotifications.empty')}
            </p>
          ) : (
            <ul className="max-h-96 divide-y divide-gray-100 overflow-y-auto dark:divide-gray-700">
              {items.map((n) => (
                <li key={n.id}>
                  <Link
                    to={linkFor(n)}
                    role="menuitem"
                    onClick={() => setOpen(false)}
                    className={`flex items-start gap-3 px-4 py-3 transition-colors hover:bg-gray-50 focus-visible:bg-gray-50 focus-visible:outline-none dark:hover:bg-gray-700/50 ${
                      n.read ? '' : 'bg-green-50/60 dark:bg-green-900/10'
                    }`}
                  >
                    <AtSign
                      size={18}
                      aria-hidden="true"
                      className="mt-0.5 shrink-0 text-green-600 dark:text-green-400"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm text-gray-800 dark:text-gray-100">
                        {messageFor(n)}
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
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
