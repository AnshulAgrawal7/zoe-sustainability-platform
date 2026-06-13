import { Link } from 'react-router-dom';
import Container from './Container';
import { useTranslation } from 'react-i18next';
import logoIcon from '../../assets/logo-icon.png';
import FooterNewsletter from './FooterNewsletter';

// Brand glyphs as inline SVG (lucide-react no longer ships brand icons). Paths
// are the CC0 Simple Icons marks; rendered in the current text colour.
type IconProps = { size?: number };
function InstagramIcon({ size = 18 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}
function FacebookIcon({ size = 18 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}
function YouTubeIcon({ size = 18 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

// Social links — prototype placeholders pointing at each network's home page.
const SOCIAL_LINKS = [
  { name: 'Instagram', href: 'https://www.instagram.com', Icon: InstagramIcon },
  { name: 'Facebook', href: 'https://www.facebook.com', Icon: FacebookIcon },
  { name: 'YouTube', href: 'https://www.youtube.com', Icon: YouTubeIcon },
];

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
      <Container className="py-12">
        {/* Newsletter opt-in — global footer touchpoint (F1) */}
        <div className="mb-10 border-b border-green-900 pb-10">
          <div className="max-w-xl">
            <FooterNewsletter />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand — same ZOE logo as the header (the alt carries the name). */}
          <div className="md:col-span-1">
            <img
              src={logoIcon}
              alt={t('footer.brand')}
              className="mb-3 h-16 w-auto"
            />
            <p className="text-sm leading-relaxed text-gray-400">
              {t('footer.tagline')}
            </p>
            <p className="mt-3 inline-block rounded border border-amber-600/40 px-2 py-1 text-xs text-amber-400">
              {t('footer.prototypeNotice')}
            </p>

            {/* Social media — opens each network's home page in a new tab. */}
            <ul className="mt-4 flex items-center gap-3">
              {SOCIAL_LINKS.map(({ name, href, Icon }) => (
                <li key={name}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={t('footer.socialAria', { network: name })}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-green-900 text-gray-300 transition-colors hover:bg-green-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 focus-visible:ring-offset-green-950"
                  >
                    <Icon size={18} />
                  </a>
                </li>
              ))}
            </ul>
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
      </Container>
    </footer>
  );
}
