# Changelog

All notable changes to this project are recorded here. The **why** matters as much as the **what**.

## [Unreleased]

### Added
- `weatherService` deep module (`src/domain/weatherService.ts`) — `getCurrentTemperature(city) => Promise<number>` calls the live Open-Meteo forecast endpoint (`current=temperature_2m`, keyless, native `fetch`) and returns the finite `current.temperature_2m` (Story #23, Seam 2). Asserts `current_units.temperature_2m === "°C"` and does no client-side unit conversion — the app is fixed-metric (per the PRD), so any other unit is treated as an error, not converted. Framework-agnostic — no React or Electron imports. This is the first slice of the eventual `getWeather` module; the daily forecast and Weather Condition mapping land in later stories.
- Real-IO Vitest suite for the weather service (`src/domain/weatherService.test.ts`) — no mock, per Overriding Principle 3: a real City's coordinates return a finite `"°C"` number, and out-of-range coordinates throw (the live-proven non-200 / HTTP 400 branch).
- `buildForecastUrl` (`src/domain/weatherService.ts`) — builds the forecast request URL from a City's numeric coordinates. No query-injection defence is needed here (unlike the geocoder's free-text query) because coordinates are numbers, not user free-text; the request is pinned to the current-temperature field only.
- `geocoder` deep module (`src/domain/geocoder.ts`) — `resolveCity(query) => Promise<City | null>` calls the live Open-Meteo geocoding endpoint (`count=1`, keyless, native `fetch`), maps the top match `results[0]` to a `City`, and returns `null` when the response omits `results` entirely (the no-match shape) (Story #22, Seam 1). Framework-agnostic — no React or Electron imports.
- Real-IO Vitest suite for the geocoder (`src/domain/geocoder.test.ts`) — no mock, per Overriding Principle 3: "London" resolves to a non-null City with numeric coordinates, ambiguous "Springfield" resolves to a single top match, and gibberish resolves to `null` (exercising the absent-`results` path).
- `buildGeocodingUrl` (`src/domain/geocoder.ts`) with a query-injection defence — the raw search query is passed through `encodeURIComponent`, so a crafted query (e.g. `London&count=100`) lands percent-encoded inside `name` and cannot add or override request parameters; the request stays pinned to `count=1`. Guarded by dedicated injection-defence tests (the Story's Security acceptance criterion from `/check-security-design`).
- Electron + React 18 + TypeScript project skeleton via Electron Forge (Vite template) — the foundation every Feature-1 story builds on (Story #21).
- Vitest test harness (node environment, `src/**/*.test.ts`) with `test` and `typecheck` npm scripts.
- `City` domain type (`src/domain/city.ts`) — a resolved place (`name`, `latitude`, `longitude`, optional `country`/`admin1`); the shared primitive the geocoder and weather-service stories depend on.
- Thin `electron-log` logger wrapper (`src/logger.ts`), usable from both main and renderer — Open-Meteo failures and unhandled errors are logged at ERROR.
- Hardened Content-Security-Policy in `index.html`: `default-src 'self'`, `script-src 'self'` (no `unsafe-eval`/inline script), and `connect-src` restricted to exactly the two Open-Meteo hosts with no wildcard.
- Guard tests: `src/csp.test.ts` (asserts the CSP directives) and `src/supply-chain.test.ts` (asserts exact-pinning and lockfile presence) — the security acceptance criteria are executable, so `npm test` is no longer empty.
- `.nvmrc` pinning Node 22; `@vitejs/plugin-react` wired into the renderer Vite config.

### Changed
- Bumped TypeScript to `5.9.3` from the Forge template's `~4.5.4` — the template version cannot parse this environment's Node 22 `@types/node`; `5.9.3` is the observed-working pin.
- Pinned every dependency to an exact version (no `^`/`~`) and committed `package-lock.json` — installs use `npm ci` so an agent/CI run reproduces the exact tree it was proven against.

### Decisions
- `weatherService`'s three defensive throws (missing/non-numeric temperature, wrong unit, unparseable body) ship without Feature-1 tests — the no-mock principle (Overriding Principle 3) blocks reaching them via live real-IO, since a well-formed request for valid coordinates always returns a numeric temperature in `"°C"`. Their Tier-1 recorded-replay fixture tests land when that fixture substrate is first built (feature-doc-gauntlet known-issue). Only the live-reachable non-200 branch is tested now.
- Supply-chain pinning and the renderer CSP are enforced by tests, not just policy — they guard the dependency-substitution/drift and renderer network-egress exfiltration threats (from `/check-security-design`).
