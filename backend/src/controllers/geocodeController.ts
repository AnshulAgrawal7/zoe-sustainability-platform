import type { Request, Response } from 'express';
import { ok, badRequest, serverError } from '../utils/response';

// Address → coordinates via OpenStreetMap Nominatim (free, no API key — matches
// the OSM tiles used on the maps). Proxied through the backend so we can send a
// compliant User-Agent and bias results to Corfu/Greece, per Nominatim's usage
// policy. Results are cached in-memory to stay well under the 1 req/s limit.
const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';
const USER_AGENT = 'ZOE-Sustainability-Platform/1.0 (FAU WInf Projektseminar; contact via repository)';

interface GeocodeResult {
  label: string;
  lat: number;
  lng: number;
}

interface NominatimRow {
  display_name?: string;
  lat?: string;
  lon?: string;
}

const cache = new Map<string, { at: number; results: GeocodeResult[] }>();
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

// GET /api/geocode?q=… — returns up to 5 address suggestions with coordinates.
export async function geocode(req: Request, res: Response) {
  const q = String(req.query['q'] ?? '').trim();
  if (q.length < 3) {
    badRequest(res, 'Query must be at least 3 characters');
    return;
  }

  const key = q.toLowerCase();
  const cached = cache.get(key);
  if (cached && Date.now() - cached.at < CACHE_TTL_MS) {
    ok(res, { results: cached.results });
    return;
  }

  try {
    const url = new URL(NOMINATIM_URL);
    url.searchParams.set('q', q);
    url.searchParams.set('format', 'jsonv2');
    url.searchParams.set('addressdetails', '0');
    url.searchParams.set('limit', '5');
    // Bias toward Greece (the platform's region) without hard-excluding others.
    url.searchParams.set('countrycodes', 'gr');
    url.searchParams.set('accept-language', 'en');

    const upstream = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
    if (!upstream.ok) {
      serverError(res);
      return;
    }
    const rows = (await upstream.json()) as NominatimRow[];
    const results: GeocodeResult[] = rows
      .filter((r) => r.lat && r.lon && r.display_name)
      .map((r) => ({
        label: r.display_name as string,
        lat: Number(r.lat),
        lng: Number(r.lon),
      }));

    cache.set(key, { at: Date.now(), results });
    ok(res, { results });
  } catch {
    serverError(res);
  }
}
