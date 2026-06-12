import { useState } from 'react';
import Container from './Container';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import logoIcon from '../../assets/logo-icon.png';
import { useAuthStore } from '../../stores/authStore';
import { useThemeStore } from '../../stores/themeStore';
import { useToastStore } from '../../stores/toastStore';
import { logout } from '../../services/authService';
import LanguageSwitcher from './LanguageSwitcher';
import UserMenu from './UserMenu';
import NavDropdown from './NavDropdown';

export default function Header() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const { user, isAuthenticated, isAdmin, clearAuth } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const showToast = useToastStore((s) => s.showToast);

  // Grouped under dropdowns to keep the bar slim (3 dropdowns + 1 solo link).
  // Each route appears exactly once; desktop and mobile nav share these arrays.
  const navGroups = [
    {
      label: t('nav.initiatives'),
      links: [
        { to: '/projects', label: t('nav.projects') },
        { to: '/events', label: t('nav.events') },
        { to: '/learn', label: t('nav.learn') },
      ],
    },
    {
      label: t('nav.getInvolved'),
      links: [
        { to: '/participate', label: t('nav.submitIdea') },
        { to: '/ideas', label: t('nav.ideas') },
        { to: '/get-involved', label: t('nav.getInvolvedOverview') },
        { to: '/rewards', label: t('nav.rewards') },
      ],
    },
    {
      label: t('nav.transparency'),
      links: [
        { to: '/sdg-dashboard', label: t('nav.sdgContributions') },
        { to: '/transparency', label: t('nav.keyFigures') },
      ],
    },
  ];

  const soloLinks = [
    { to: '/news', label: t('nav.news') },
    { to: '/about', label: t('nav.about') },
  ];

  async function handleLogout() {
    await logout();
    clearAuth();
    navigate('/', { replace: true });
    showToast(t('auth.logoutSuccess'));
  }

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <Container>
        <div className="flex h-20 items-center justify-between">
          {/* Logo — ZOE brand mark (links home). The link carries the accessible
              name, so the image is decorative. */}
          <Link
            to="/"
            aria-label={t('nav.home')}
            className="flex items-center rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900"
          >
            <img
              src={logoIcon}
              alt=""
              aria-hidden="true"
              className="h-12 w-auto sm:h-14"
            />
          </Link>

          {/* Desktop nav */}
          <nav
            aria-label={t('nav.mainNavAria')}
            className="hidden items-center gap-1 lg:flex"
          >
            {navGroups.map((group) => (
              <NavDropdown
                key={group.label}
                label={group.label}
                links={group.links}
              />
            ))}
            {soloLinks.map((link) => (
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
            {/* Language selector (flags) */}
            <LanguageSwitcher size="sm" />

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
              <UserMenu />
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
      </Container>

      {/* Mobile nav */}
      {menuOpen && (
        <nav
          id="mobile-menu"
          aria-label={t('nav.mobileNavAria')}
          className="border-t border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 lg:hidden"
        >
          <div className="space-y-1 px-4 py-3">
            {navGroups.map((group) => (
              <div key={group.label}>
                <p className="px-3 pb-1 pt-2 text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
                  {group.label}
                </p>
                {group.links.map((link) => (
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
              </div>
            ))}
            {soloLinks.map((link) => (
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
              <LanguageSwitcher size="md" />
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
                {user && (
                  <p className="px-3 pb-1 text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
                    {user.name}
                  </p>
                )}
                <Link
                  to="/dashboard"
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  {t('nav.dashboard')}
                </Link>
                <Link
                  to="/my-rewards"
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  {t('nav.myRewards')}
                </Link>
                <Link
                  to="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  {t('nav.profile')}
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
