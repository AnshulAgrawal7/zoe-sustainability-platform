import { useEffect, Suspense } from 'react';
import { Outlet, ScrollRestoration, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Header from './Header';
import Footer from './Footer';
import PrototypeBanner from '../ui/PrototypeBanner';
import Toaster from '../ui/Toaster';
import { reportPageView } from '../../services/metricsService';
import { useAuthStore } from '../../stores/authStore';

// First path segment → an existing nav translation key, so each route gets a
// descriptive, translated <title> (SEO + a11y, Future_Work §6.4). Unmapped or
// dynamic routes (e.g. detail pages) fall back to the site title.
const TITLE_BY_SEGMENT: Record<string, string> = {
  about: 'nav.about',
  projects: 'nav.projects',
  events: 'nav.events',
  news: 'nav.news',
  learn: 'nav.learn',
  ideas: 'nav.ideas',
  transparency: 'nav.transparency',
  rewards: 'nav.rewards',
  participate: 'nav.participate',
  'get-involved': 'nav.getInvolved',
  'sdg-dashboard': 'nav.sdgs',
  login: 'nav.login',
  register: 'nav.register',
  dashboard: 'nav.dashboard',
  profile: 'nav.profile',
  'my-rewards': 'nav.myRewards',
  admin: 'nav.admin',
  imprint: 'nav.imprint',
};
const SITE_TITLE = 'ZOE — Municipality of Northern Corfu';

export default function Layout() {
  const { t, i18n } = useTranslation();
  const { pathname } = useLocation();
  const isAdmin = useAuthStore((s) => s.isAdmin);

  useEffect(() => {
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  // Keep the document title in sync with the route and the active language.
  useEffect(() => {
    const segment = pathname.split('/')[1] ?? '';
    const key = TITLE_BY_SEGMENT[segment];
    document.title = key ? `${t(key)} — ZOE` : SITE_TITLE;
  }, [pathname, t, i18n.language]);

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
        {/* Routes are code-split (React.lazy); this boundary shows a light
            placeholder while a route chunk loads (Future_Work §6.6). */}
        <Suspense
          fallback={
            <p
              className="py-24 text-center text-gray-500 dark:text-gray-400"
              role="status"
            >
              {t('common.loading')}
            </p>
          }
        >
          <Outlet />
        </Suspense>
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}
