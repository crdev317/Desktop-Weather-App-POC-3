import { test, expect } from 'vitest';
import { resolveCity, buildGeocodingUrl } from './geocoder';

// Seam 1 — Geocoder ↔ Open-Meteo Geocoding API. Real I/O, no mock (Overriding Principle 3).

test('resolveCity resolves "London" to a City with a name and numeric coordinates', async () => {
  const city = await resolveCity('London');
  expect(city).not.toBeNull();
  expect(typeof city?.name).toBe('string');
  expect(city?.name.length).toBeGreaterThan(0);
  expect(typeof city?.latitude).toBe('number');
  expect(typeof city?.longitude).toBe('number');
});

// Security (query-parameter injection): a crafted query must not add or override request
// parameters. The raw query is URL-encoded, so its tokens land inside `name` and the request
// stays pinned to count=1. Asserted on the built URL — deterministic, no mock of Open-Meteo.
test('buildGeocodingUrl percent-encodes a crafted query so it cannot override count', () => {
  const url = buildGeocodingUrl('London&count=100');
  const params = new URL(url).searchParams;

  // The injection attempt lands intact inside `name`, not as its own parameter.
  expect(params.get('name')).toBe('London&count=100');
  // count is pinned to 1 exactly once — the crafted count=100 did not take effect.
  expect(params.getAll('count')).toEqual(['1']);
  // The dangerous tokens are percent-encoded in the raw URL, never literal separators.
  expect(url).toContain('name=London%26count%3D100');
});

test('buildGeocodingUrl percent-encodes &, =, #, ? and spaces without spawning parameters', () => {
  const raw = 'a b&c=d#e?f';
  const url = buildGeocodingUrl(raw);
  const params = new URL(url).searchParams;

  // Every crafted token round-trips inside `name`; no extra parameters appear.
  expect(params.get('name')).toBe(raw);
  expect(params.getAll('count')).toEqual(['1']);
  expect([...params.keys()].sort()).toEqual(['count', 'format', 'language', 'name']);
});

test('resolveCity returns null when nothing matches (absent results key)', async () => {
  const city = await resolveCity('zzqqxxnope123');
  expect(city).toBeNull();
});

test('resolveCity resolves an ambiguous name ("Springfield") to a single top match', async () => {
  const city = await resolveCity('Springfield');
  expect(city).not.toBeNull();
  expect(typeof city?.name).toBe('string');
  expect(typeof city?.latitude).toBe('number');
  expect(typeof city?.longitude).toBe('number');
});
