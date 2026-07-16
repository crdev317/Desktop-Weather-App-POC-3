import { test, expect } from 'vitest';
import { getCurrentTemperature } from './weatherService';
import type { City } from './city';

// Seam 2 — Weather service ↔ Open-Meteo Forecast API. Real I/O, no mock (Overriding Principle 3).

const london: City = { name: 'London', latitude: 51.5085, longitude: -0.1257 };

test('getCurrentTemperature returns a finite °C temperature for a real City', async () => {
  const temperature = await getCurrentTemperature(london);
  expect(typeof temperature).toBe('number');
  expect(Number.isFinite(temperature)).toBe(true);
  // Current Conditions temperature for a real City sits within a sane earthly band.
  expect(temperature).toBeGreaterThan(-90);
  expect(temperature).toBeLessThan(60);
});

// Proven Feature-1 error contract: out-of-range coordinates return HTTP 400 (non-200),
// which surfaces as a thrown error (observed live 2026-07-15). The missing/non-numeric,
// wrong-unit and unparseable-body throws are defensive-only — unreachable via live real-IO
// without mocking (Overriding Principle 3), so their fixture tests are deferred (known-issue).
test('getCurrentTemperature throws on out-of-range coordinates (non-200 branch)', async () => {
  const outOfRange: City = { name: 'Nowhere', latitude: 9999, longitude: 9999 };
  await expect(getCurrentTemperature(outOfRange)).rejects.toThrow();
});
