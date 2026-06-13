import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { MapPin, Loader2, X } from 'lucide-react';
import { geocodeAddress } from '../../services/geocodeService';
import LocationMap from './LocationMap';
import type { GeocodeResult } from '../../types';

export interface AddressValue {
  location: string;
  lat: number | null;
  lng: number | null;
}

interface Props {
  value: AddressValue;
  onChange: (value: AddressValue) => void;
  /** Addresses already used by other events/projects — offered as quick picks. */
  knownAddresses?: AddressValue[];
  label: string;
  id?: string;
}

// Google-Maps-style address input: type an address, pick a geocoded suggestion
// (OpenStreetMap/Nominatim via the backend) → coordinates are stored and shown
// on a small map preview. Previously used addresses are offered as quick picks.
export default function AddressPicker({
  value,
  onChange,
  knownAddresses = [],
  label,
  id = 'address',
}: Props) {
  const { t } = useTranslation();
  const [results, setResults] = useState<GeocodeResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const queryRef = useRef('');

  // Debounced geocode while typing. All setState happens inside the timeout
  // (an async callback) — never synchronously in the effect body.
  useEffect(() => {
    const q = value.location.trim();
    // A coordinate-backed value means the text matches a chosen place already.
    if (q.length < 3 || value.lat != null) {
      const handle = window.setTimeout(() => {
        setResults([]);
        setOpen(false);
        setLoading(false);
      }, 0);
      return () => window.clearTimeout(handle);
    }
    const handle = window.setTimeout(() => {
      setLoading(true);
      queryRef.current = q;
      geocodeAddress(q)
        .then((r) => {
          if (queryRef.current !== q) return;
          setResults(r);
          setOpen(true);
        })
        .catch(() => setResults([]))
        .finally(() => setLoading(false));
    }, 350);
    return () => window.clearTimeout(handle);
  }, [value.location, value.lat]);

  // Close the suggestion list on outside click.
  useEffect(() => {
    function onPointer(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node))
        setOpen(false);
    }
    document.addEventListener('mousedown', onPointer);
    return () => document.removeEventListener('mousedown', onPointer);
  }, []);

  function select(r: GeocodeResult) {
    onChange({ location: r.label, lat: r.lat, lng: r.lng });
    setOpen(false);
  }

  return (
    <div ref={boxRef} className="relative">
      <label
        htmlFor={id}
        className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400"
      >
        {label}
      </label>
      <div className="relative">
        <MapPin
          size={16}
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          id={id}
          type="text"
          value={value.location}
          onChange={(e) => {
            // Typing invalidates any previously geocoded coordinates.
            onChange({ location: e.target.value, lat: null, lng: null });
          }}
          onFocus={() => results.length > 0 && setOpen(true)}
          placeholder={t('address.placeholder')}
          autoComplete="off"
          aria-describedby={`${id}-hint`}
          className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-9 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        />
        {loading ? (
          <Loader2
            size={16}
            aria-hidden="true"
            className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-gray-400 motion-reduce:animate-none"
          />
        ) : (
          value.location && (
            <button
              type="button"
              onClick={() => onChange({ location: '', lat: null, lng: null })}
              aria-label={t('address.clear')}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-gray-400 hover:text-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 dark:hover:text-gray-200"
            >
              <X size={14} aria-hidden="true" />
            </button>
          )
        )}

        {open && results.length > 0 && (
          <ul
            role="listbox"
            aria-label={t('address.suggestionsAria')}
            className="absolute z-30 mt-1 max-h-60 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-800"
          >
            {results.map((r, i) => (
              <li
                key={`${r.lat}-${r.lng}-${i}`}
                role="option"
                aria-selected="false"
              >
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    select(r);
                  }}
                  className="block w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-green-50 dark:text-gray-200 dark:hover:bg-green-900/30"
                >
                  {r.label}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <p
        id={`${id}-hint`}
        className="mt-1 text-xs text-gray-400 dark:text-gray-500"
      >
        {t('address.hint')}
      </p>

      {/* Quick picks: addresses already used elsewhere. */}
      {knownAddresses.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {knownAddresses.slice(0, 6).map((a) => (
            <button
              key={`${a.location}-${a.lat}`}
              type="button"
              onClick={() => onChange(a)}
              className="rounded-full border border-gray-300 px-2.5 py-1 text-xs text-gray-600 transition-colors hover:border-green-400 hover:text-green-700 dark:border-gray-600 dark:text-gray-300 dark:hover:border-green-600 dark:hover:text-green-400"
            >
              {a.location}
            </button>
          ))}
        </div>
      )}

      {value.lat != null && value.lng != null && (
        <div className="mt-3">
          <LocationMap
            lat={value.lat}
            lng={value.lng}
            label={value.location}
            heightClass="h-48"
          />
        </div>
      )}
    </div>
  );
}
