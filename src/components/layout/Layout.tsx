import { useEffect } from 'react';
import { Outlet, ScrollRestoration, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Header from './Header';
import Footer from './Footer';
import PrototypeBanner from '../ui/PrototypeBanner';
import Toaster from '../ui/Toaster';
import { reportPageView } from '../../services/metricsService';
import { useAuthStore } from '../../stores/authStore';

export default function Layout() {
  const { t, i18n } = useTranslation();
  const { pathname } = useLocation();
  const isAdmin = useAuthStore((s) => s.isAdmin);

  useEffect(() => {
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  // Anonymous aggregate page-view counter (admin monitoring). Admin browsing
  // is excluded so testing/management doesn't skew the statistics.
  useEffect(() => {
    if (!isAdmin) reportPageView(pathname);
  }, [pathname, isAdmin]);

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-950">
      <ScrollRestoration />
      {/* Skip link (WCAG 2.4.1) — first focusable element, visually hidden
          until it receives keyboard focus, then jumps to <main>. */}
      <a
        href="#main-content"
        className="sr-only rounded-lg bg-green-700 font-medium text-white shadow-lg focus:not-sr-only focus:!fixed focus:left-4 focus:top-4 focus:z-50 focus:!px-4 focus:!py-2 focus:outline-none focus:ring-2 focus:ring-white"
      >
        {t('nav.skipToContent')}
      </a>
      <PrototypeBanner />
      <Header />
      <main
        id="main-content"
        tabIndex={-1}
        className="flex-1 focus:outline-none"
      >
        <Outlet />
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}
