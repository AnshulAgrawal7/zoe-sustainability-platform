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
  const { i18n } = useTranslation();
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
      <PrototypeBanner />
      <Header />
      <main id="main-content" className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}
