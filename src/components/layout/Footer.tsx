import { Link } from 'react-router-dom';
import { Leaf } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();

  const platformLinks = [
    { to: '/', label: t('nav.home') },
    { to: '/about', label: t('nav.about') },
    { to: '/projects', label: t('nav.projects') },
    { to: '/sdg-dashboard', label: t('nav.sdgs') },
  ];

  const engagementLinks = [
    { to: '/participate', label: t('nav.participate') },
    { to: '/events', label: t('nav.events') },
    { to: '/transparency', label: t('nav.transparency') },
  ];

  return (
    <footer className="mt-auto bg-green-950 text-gray-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="mb-3 flex items-center gap-2 font-bold text-white">
              <Leaf size={20} className="text-green-400" aria-hidden="true" />
              <span>{t('footer.brand')}</span>
            </div>
            <p className="text-sm leading-relaxed text-gray-400">
              {t('footer.tagline')}
            </p>
            <p className="mt-3 inline-block rounded border border-amber-600/40 px-2 py-1 text-xs text-amber-400">
              {t('footer.prototypeNotice')}
            </p>
          </div>

          {/* Platform links */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-white">
              {t('footer.platformLinks')}
            </h3>
            <ul className="space-y-2 text-sm">
              {platformLinks.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="transition-colors hover:text-white"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Engagement links */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-white">
              {t('footer.engagementLinks')}
            </h3>
            <ul className="space-y-2 text-sm">
              {engagementLinks.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="transition-colors hover:text-white"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Research context */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-white">
              {t('footer.researchContext')}
            </h3>
            <p className="text-sm leading-relaxed text-gray-400">
              {t('footer.researchText')}
            </p>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-green-900 pt-6 text-xs text-gray-400 sm:flex-row">
          <p>{t('footer.copyright')}</p>
          <nav
            aria-label={t('footer.legalNavAria')}
            className="flex items-center gap-4"
          >
            <Link
              to="/accessibility"
              className="transition-colors hover:text-white"
            >
              {t('footer.accessibility')}
            </Link>
            <Link to="/privacy" className="transition-colors hover:text-white">
              {t('footer.privacy')}
            </Link>
            <Link to="/imprint" className="transition-colors hover:text-white">
              {t('footer.imprint')}
            </Link>
          </nav>
        </div>
        <p className="mt-3 text-center text-xs text-gray-400">
          {t('footer.dsr')}
        </p>
      </div>
    </footer>
  );
}
