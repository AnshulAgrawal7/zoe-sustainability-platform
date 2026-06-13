import { api } from './api';
import type { ApiResponse, GeocodeResult } from '../types';

// Address → coordinate suggestions via the backend Nominatim proxy (logged-in).
export async function geocodeAddress(q: string): Promise<GeocodeResult[]> {
  const res = await api.get<ApiResponse<{ results: GeocodeResult[] }>>(
    `/geocode?q=${encodeURIComponent(q)}`
  );
  return res.data.results;
}
