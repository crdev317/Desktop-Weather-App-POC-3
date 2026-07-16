import type { City } from './city';

const ENDPOINT = 'https://geocoding-api.open-meteo.com/v1/search';

// Build the geocoding request URL for a raw search query. The query is passed through
// encodeURIComponent so a crafted string (e.g. "London&count=100") cannot inject or override
// request parameters — its tokens are percent-encoded inside `name` and the request stays
// pinned to count=1. (Security control, per the Story's Security acceptance criteria.)
export function buildGeocodingUrl(query: string): string {
  return `${ENDPOINT}?name=${encodeURIComponent(query)}&count=1&language=en&format=json`;
}

// Resolve a typed search query to the top-matching City, or null when nothing matches.
// Seam 1: Open-Meteo geocoding. A no-match body omits the `results` key entirely.
export async function resolveCity(query: string): Promise<City | null> {
  const res = await fetch(buildGeocodingUrl(query));
  if (!res.ok) return null;
  const body: unknown = await res.json();
  const results = (body as { results?: unknown }).results;
  if (!Array.isArray(results) || results.length === 0) return null;
  const r = results[0] as Record<string, unknown>;
  if (typeof r.name !== 'string' || typeof r.latitude !== 'number' || typeof r.longitude !== 'number') {
    return null;
  }
  return {
    name: r.name,
    latitude: r.latitude,
    longitude: r.longitude,
    country: typeof r.country === 'string' ? r.country : undefined,
    admin1: typeof r.admin1 === 'string' ? r.admin1 : undefined,
  };
}
