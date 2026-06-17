import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useThemeStore } from '../../stores/themeStore';
import { projectCategoryHex } from '../ui/categoryVisuals';
import 'leaflet/dist/leaflet.css';

// Leaflet/Vite icon fix (safety net): Leaflet's default marker references image
// paths the bundler does not resolve, so we re-point them at the bundled assets.
// The visible markers below use category-coloured DIV icons (HTML, no image
// assets), which avoids the problem entirely — this override only covers any
// fallback default marker.
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

export interface MapPoint {
  id: string;
  title: string;
  category: string;
  sdgs: number[];
  lat: number;
  lng: number;
}

interface ProjectMapProps {
  points: MapPoint[];
  className?: string;
}

// Category colour comes from the central categoryVisuals source (one truth,
// shared with the cards' accent + the map legend). divIcon HTML lives outside
// Tailwind's class scanning, so we use the raw hex here.
function categoryIcon(category: string): L.DivIcon {
  const color = projectCategoryHex(category);
  return L.divIcon({
    className: '', // drop Leaflet's default white box
    html: `<span style="display:block;width:18px;height:18px;border-radius:9999px;background:${color};border:2px solid #fff;box-shadow:0 0 0 1px rgba(0,0,0,.35)"></span>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
    popupAnchor: [0, -10],
  });
}

const NORTH_CORFU_CENTER: [number, number] = [39.77, 19.88];

export default function ProjectMap({ points, className }: ProjectMapProps) {
  const { t } = useTranslation();
  const isDark = useThemeStore((s) => s.theme === 'dark');

  // Theme-aware tiles — both free, no API key. Attribution is mandatory.
  const tile = isDark
    ? {
        url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      }
    : {
        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      };

  const located = points.filter(
    (p) => typeof p.lat === 'number' && typeof p.lng === 'number'
  );

  if (located.length === 0) {
    return (
      <div
        className={`flex h-96 items-center justify-center rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 ${className ?? ''}`}
      >
        {t('map.noLocation')}
      </div>
    );
  }

  return (
    <div
      role="region"
      aria-label={t('map.ariaLabel')}
      className={`overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 ${className ?? ''}`}
    >
      <MapContainer
        center={NORTH_CORFU_CENTER}
        zoom={11}
        scrollWheelZoom
        className="h-96 w-full"
        // Leaflet needs an explicit height before init; h-96 provides it.
        style={{ height: '24rem' }}
      >
        <TileLayer
          key={isDark ? 'dark' : 'light'}
          url={tile.url}
          attribution={tile.attribution}
        />
        {located.map((p) => (
          <Marker
            key={p.id}
            position={[p.lat, p.lng]}
            icon={categoryIcon(p.category)}
            title={p.title}
            alt={p.title}
            keyboard
          >
            <Popup>
              <div className="min-w-[10rem]">
                <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                  {t(`projects.category.${p.category}`)}
                </p>
                <p className="mb-1 text-sm font-bold text-gray-900">
                  {p.title}
                </p>
                {p.sdgs.length > 0 && (
                  <p className="mb-2 text-xs text-gray-600">
                    {p.sdgs.map((n) => `SDG ${n}`).join(' · ')}
                  </p>
                )}
                <Link
                  to={`/projects/${p.id}`}
                  className="text-xs font-medium text-green-700 underline"
                >
                  {t('popup.viewProject')}
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Accessible, keyboard-focusable text equivalent of the markers (WCAG
          1.1.1): screen-reader and keyboard users get the same destinations as
          the visual pins, which Leaflet does not expose. */}
      <ul className="sr-only" aria-label={t('map.markerListLabel')}>
        {located.map((p) => (
          <li key={p.id}>
            <Link to={`/projects/${p.id}`}>
              {p.title} — {t(`projects.category.${p.category}`)}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
