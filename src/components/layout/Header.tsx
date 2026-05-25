import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Leaf,
  Menu,
  X,
  Sun,
  Moon,
  Star,
  LayoutDashboard,
  LogOut,
  Shield,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../stores/authStore';
import { useThemeStore } from '../../stores/themeStore';
import { useLanguageStore } from '../../stores/languageStore';
import { logout } from '../../services/authService';
import type { Language } from '../../stores/languageStore';

const LANGUAGES: { code: Language; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'el', label: 'Ελληνικά' },
  { code: 'de', label: 'Deutsch' },
];

export default function Header() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const { user, isAuthenticated, isAdmin, clearAuth } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const { language, setLanguage } = useLanguageStore();

  const navLinks = [
    { to: '/about', label: t('nav.about') },
    { to: '/projects', label: t('nav.projects') },
    { to: '/sdg-dashboard', label: t('nav.sdgs') },
    { to: '/events', label: t('nav.events') },
    { to: '/transparency', label: t('nav.transparency') },
    { to: '/rewards', label: t('nav.rewards') },
  ];

  async function handleLogout() {
    await logout();
    clearAuth();
    navigate('/', { replace: true });
  }

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 text-lg font-bold text-green-700 transition-colors hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
          >
            <Leaf size={22} aria-hidden="true" />
            <span>ZOE Platform</span>
          </Link>

          {/* Desktop nav */}
          <nav
            aria-label="Main navigation"
            className="hidden items-center gap-1 lg:flex"
          >
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-green-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-green-400'
                  }`
                }
              >
                {({ isActive }) => (
                  <span aria-current={isActive ? 'page' : undefined}>
                    {link.label}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Controls */}
          <div className="hidden items-center gap-2 lg:flex">
            {/* Language selector */}
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              aria-label={t('common.language')}
              className="rounded-md px-2 py-2 text-sm text-gray-500 bg-transparent border-0 cursor-pointer transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-1"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.label}
                </option>
              ))}
            </select>

            {/* Dark mode toggle */}
            <button
              onClick={toggleTheme}
              aria-label={
                theme === 'dark' ? t('common.lightMode') : t('common.darkMode')
              }
              className="rounded-md p-2 text-gray-500 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            >
              {theme === 'dark' ? (
                <Sun size={18} aria-hidden="true" />
              ) : (
                <Moon size={18} aria-hidden="true" />
              )}
            </button>

            {/* Auth area */}
            {isAuthenticated && user ? (
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 text-sm font-semibold text-amber-600 dark:text-amber-400">
                  <Star size={14} aria-hidden="true" />
                  {user.points}
                </span>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="rounded-md p-2 text-gray-500 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                    aria-label={t('nav.admin')}
                  >
                    <Shield size={18} aria-hidden="true" />
                  </Link>
                )}
                <Link
                  to="/dashboard"
                  className="rounded-md p-2 text-gray-500 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                  aria-label={t('nav.dashboard')}
                >
                  <LayoutDashboard size={18} aria-hidden="true" />
                </Link>
                <button
                  onClick={handleLogout}
                  aria-label={t('nav.logout')}
                  className="rounded-md p-2 text-gray-500 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                >
                  <LogOut size={18} aria-hidden="true" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-green-700 dark:text-gray-300 dark:hover:text-green-400"
                >
                  {t('nav.login')}
                </Link>
                <Link
                  to="/register"
                  className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700"
                >
                  {t('nav.register')}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="rounded-md p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 lg:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? t('common.close') : t('nav.openMenu')}
          >
            {menuOpen ? (
              <X size={22} aria-hidden="true" />
            ) : (
              <Menu size={22} aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {menuOpen && (
        <nav
          id="mobile-menu"
          aria-label="Mobile navigation"
          className="border-t border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 lg:hidden"
        >
          <div className="space-y-1 px-4 py-3">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `block rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-green-700 dark:text-gray-300 dark:hover:bg-gray-800'
                  }`
                }
              >
                {({ isActive }) => (
                  <span aria-current={isActive ? 'page' : undefined}>
                    {link.label}
                  </span>
                )}
              </NavLink>
            ))}
            <div className="mt-2 flex items-center gap-2 border-t border-gray-100 pt-2 dark:border-gray-800">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  aria-pressed={language === lang.code}
                  className={`rounded px-2 py-1 text-xs font-semibold ${
                    language === lang.code
                      ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-400'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {lang.code.toUpperCase()}
                </button>
              ))}
              <button
                onClick={toggleTheme}
                aria-label={
                  theme === 'dark'
                    ? t('common.lightMode')
                    : t('common.darkMode')
                }
                className="ml-auto rounded-md p-2 text-gray-500 dark:text-gray-400"
              >
                {theme === 'dark' ? (
                  <Sun size={16} aria-hidden="true" />
                ) : (
                  <Moon size={16} aria-hidden="true" />
                )}
              </button>
            </div>
            {isAuthenticated ? (
              <div className="space-y-1 pt-1">
                <Link
                  to="/dashboard"
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  {t('nav.dashboard')}
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setMenuOpen(false)}
                    className="block rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
                  >
                    {t('nav.admin')}
                  </Link>
                )}
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    void handleLogout();
                  }}
                  className="block w-full rounded-md px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                >
                  {t('nav.logout')}
                </button>
              </div>
            ) : (
              <div className="space-y-1 pt-1">
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-md px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300"
                >
                  {t('nav.login')}
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-lg bg-green-600 px-3 py-2 text-center text-sm font-medium text-white"
                >
                  {t('nav.register')}
                </Link>
              </div>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
