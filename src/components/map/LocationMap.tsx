import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import { useTranslation } from 'react-i18next';
import { useThemeStore } from '../../stores/themeStore';
import { projectCategoryHex } from '../ui/categoryVisuals';
import 'leaflet/dist/leaflet.css';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface Props {
  lat: number;
  lng: number;
  label?: string;
  category?: string;
  zoom?: number;
  className?: string;
  heightClass?: string;
}

function dotIcon(category: string): L.DivIcon {
  const color = projectCategoryHex(category);
  return L.divIcon({
    className: '',
    html: `<span style="display:block;width:18px;height:18px;border-radius:9999px;background:${color};border:2px solid #fff;box-shadow:0 0 0 1px rgba(0,0,0,.35)"></span>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  });
}

// Minimal single-marker map for one place (an event location, or a geocoded
// address preview). Theme-aware OSM/CARTO tiles, no API key.
export default function LocationMap({
  lat,
  lng,
  label,
  category = 'COMMUNITY',
  zoom = 14,
  className,
  heightClass = 'h-64',
}: Props) {
  const { t } = useTranslation();
  const isDark = useThemeStore((s) => s.theme === 'dark');

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

  return (
    <div
      role="region"
      aria-label={
        label ? t('map.locationOf', { name: label }) : t('map.ariaLabel')
      }
      className={`overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 ${className ?? ''}`}
    >
      <MapContainer
        center={[lat, lng]}
        zoom={zoom}
        scrollWheelZoom={false}
        className={`${heightClass} w-full`}
        style={{ height: '100%' }}
      >
        <TileLayer
          key={isDark ? 'dark' : 'light'}
          url={tile.url}
          attribution={tile.attribution}
        />
        <Marker
          position={[lat, lng]}
          icon={dotIcon(category)}
          title={label}
          alt={label ?? ''}
        />
      </MapContainer>
    </div>
  );
}
