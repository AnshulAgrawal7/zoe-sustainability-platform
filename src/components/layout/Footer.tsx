import { Link } from 'react-router-dom';
import { Leaf, ExternalLink } from 'lucide-react';
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
    { to: '/roadmap', label: t('nav.roadmap') },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 text-white font-bold mb-3">
              <Leaf size={20} className="text-green-400" aria-hidden="true" />
              <span>{t('footer.brand')}</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              {t('footer.tagline')}
            </p>
            <p className="text-xs text-amber-400 mt-3 border border-amber-600/40 rounded px-2 py-1 inline-block">
              {t('footer.prototypeNotice')}
            </p>
          </div>

          {/* Platform links */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-3">{t('footer.platformLinks')}</h3>
            <ul className="space-y-2 text-sm">
              {platformLinks.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Engagement links */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-3">{t('footer.engagementLinks')}</h3>
            <ul className="space-y-2 text-sm">
              {engagementLinks.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Research context */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-3">{t('footer.researchContext')}</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              {t('footer.researchText')}
            </p>
            <a
              href="https://github.com"
              className="inline-flex items-center gap-2 mt-3 text-sm text-gray-400 hover:text-white transition-colors"
              aria-label={t('footer.viewOnGitHub')}
            >
              <ExternalLink size={16} aria-hidden="true" />
              <span>{t('footer.viewOnGitHub')}</span>
            </a>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-gray-500">
          <p>{t('footer.copyright')}</p>
          <nav aria-label="Legal navigation" className="flex items-center gap-4">
            <Link to="/accessibility" className="hover:text-white transition-colors">
              {t('footer.accessibility')}
            </Link>
            <Link to="/privacy" className="hover:text-white transition-colors">
              {t('footer.privacy')}
            </Link>
          </nav>
        </div>
        <p className="text-center text-xs text-gray-600 mt-3">{t('footer.dsr')}</p>
      </div>
    </footer>
  );
}
