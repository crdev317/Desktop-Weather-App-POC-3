# Changelog

All notable changes to this project are recorded here. The **why** matters as much as the **what**.

## [Unreleased]

### Added
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
- Supply-chain pinning and the renderer CSP are enforced by tests, not just policy — they guard the dependency-substitution/drift and renderer network-egress exfiltration threats (from `/check-security-design`).
