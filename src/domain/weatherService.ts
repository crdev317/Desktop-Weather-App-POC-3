import type { City } from './city';

const ENDPOINT = 'https://api.open-meteo.com/v1/forecast';

// Build the forecast request URL for a City. Coordinates are numbers, so there is no
// query-injection surface here (unlike the geocoder's free-text query); the request is
// pinned to the current-temperature field only. Seam 2: keyless Open-Meteo forecast.
export function buildForecastUrl(city: City): string {
  return `${ENDPOINT}?latitude=${city.latitude}&longitude=${city.longitude}&current=temperature_2m`;
}

// Fetch a City's Current Conditions temperature in °C from Open-Meteo.
// Returns the finite current.temperature_2m; throws on any unusable response.
export async function getCurrentTemperature(city: City): Promise<number> {
  const res = await fetch(buildForecastUrl(city));
  // Proven Feature-1 error branch: a non-200 status (e.g. out-of-range coords → HTTP 400).
  if (!res.ok) throw new Error(`weather fetch failed: HTTP ${res.status}`);
  const body: unknown = await res.json();
  const current = (body as { current?: { temperature_2m?: unknown } }).current;
  const units = (body as { current_units?: { temperature_2m?: unknown } }).current_units;
  const temperature = current?.temperature_2m;
  // Defensive-only (tests deferred — known-issue): missing/non-numeric temperature.
  if (typeof temperature !== 'number' || !Number.isFinite(temperature)) {
    throw new Error('weather response missing a numeric current.temperature_2m');
  }
  // Defensive-only (tests deferred): a unit other than °C. No client-side unit conversion —
  // the app is fixed-metric (per the PRD), so any other unit is an error, not a conversion.
  if (units?.temperature_2m !== '°C') {
    throw new Error(`unexpected temperature unit: ${String(units?.temperature_2m)}`);
  }
  return temperature;
}
