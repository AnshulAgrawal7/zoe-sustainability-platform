import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getSdgByNumber } from '../../data/sdgs';

interface SdgIconProps {
  number: number;
  /** Rendered edge length in px (square). */
  size?: number;
  /** When true the tile links to the SDG on the dashboard (/sdg-dashboard#sdg-N). */
  linkToDashboard?: boolean;
}

// Small official UN SDG tile, reused on the projects list (static) and the
// project detail (clickable, deep-linking to the dashboard). One source for the
// icon URL + accessible naming so the two usages stay consistent.
export default function SdgIcon({
  number,
  size = 40,
  linkToDashboard = false,
}: SdgIconProps) {
  const { t } = useTranslation();
  const sdg = getSdgByNumber(number);
  if (!sdg) return null;

  const title = t(`sdgCatalog.${number}.title`, {
    defaultValue: `SDG ${number}`,
  });
  const dims = { width: size, height: size };

  if (linkToDashboard) {
    // The link carries the accessible name; the image is decorative.
    return (
      <Link
        to={`/sdg-dashboard#sdg-${number}`}
        aria-label={t('projects.sdgLinkAria', { n: number })}
        className="block rounded transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 motion-safe:hover:scale-105 dark:focus-visible:ring-offset-gray-800"
      >
        <img
          src={sdg.iconUrl}
          alt=""
          aria-hidden="true"
          loading="lazy"
          style={dims}
          className="rounded"
        />
      </Link>
    );
  }

  // Static (non-link): the image carries the meaning, so it gets a real alt.
  return (
    <img
      src={sdg.iconUrl}
      alt={t('projects.sdgIconAlt', { n: number, title })}
      loading="lazy"
      style={dims}
      className="rounded"
    />
  );
}
