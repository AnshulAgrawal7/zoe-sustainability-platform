import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Award,
  User,
  Shield,
  LogOut,
  Star,
  ChevronDown,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../stores/authStore';
import { logout } from '../../services/authService';

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function UserMenu() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, isAdmin, clearAuth } = useAuthStore();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

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

  if (!user) return null;

  const firstName = user.name.trim().split(/\s+/)[0] || user.name;

  async function handleLogout() {
    setOpen(false);
    await logout();
    clearAuth();
    navigate('/', { replace: true });
  }

  const items = [
    { to: '/dashboard', label: t('nav.dashboard'), Icon: LayoutDashboard },
    { to: '/my-rewards', label: t('nav.myRewards'), Icon: Award },
    { to: '/profile', label: t('nav.profile'), Icon: User },
    ...(isAdmin ? [{ to: '/admin', label: t('nav.admin'), Icon: Shield }] : []),
  ];

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={t('nav.account')}
        className="flex items-center gap-2 rounded-full border border-gray-200 py-1 pl-1 pr-2.5 text-sm transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 dark:border-gray-700 dark:hover:bg-gray-800"
      >
        <span
          className="flex h-7 w-7 items-center justify-center rounded-full bg-green-600 text-xs font-bold text-white"
          aria-hidden="true"
        >
          {initials(user.name)}
        </span>
        <span className="max-w-[8rem] truncate font-medium text-gray-700 dark:text-gray-200">
          {firstName}
        </span>
        <ChevronDown size={14} aria-hidden="true" className="text-gray-400" />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 w-60 overflow-hidden rounded-xl border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-800"
        >
          <div className="border-b border-gray-100 px-4 py-3 dark:border-gray-700">
            <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
              {user.name}
            </p>
            <p className="truncate text-xs text-gray-500 dark:text-gray-400">
              {user.email}
            </p>
            <p className="mt-1.5 flex items-center gap-1 text-xs font-semibold text-amber-600 dark:text-amber-400">
              <Star size={12} aria-hidden="true" />
              {t('nav.points', { points: user.points })}
            </p>
          </div>
          {items.map(({ to, label, Icon }) => (
            <Link
              key={to}
              to={to}
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50 focus-visible:bg-gray-50 focus-visible:outline-none dark:text-gray-200 dark:hover:bg-gray-700/50 dark:focus-visible:bg-gray-700/50"
            >
              <Icon size={15} aria-hidden="true" className="text-gray-400" />
              {label}
            </Link>
          ))}
          <button
            type="button"
            role="menuitem"
            onClick={handleLogout}
            className="flex w-full items-center gap-2.5 border-t border-gray-100 px-4 py-2 text-left text-sm text-red-600 transition-colors hover:bg-red-50 focus-visible:bg-red-50 focus-visible:outline-none dark:border-gray-700 dark:text-red-400 dark:hover:bg-red-900/20"
          >
            <LogOut size={15} aria-hidden="true" />
            {t('nav.logout')}
          </button>
        </div>
      )}
    </div>
  );
}
