## What to build

Stand up the Electron + React 18 + TypeScript project skeleton (Electron Forge, Vite template) with the exact-pinned toolchain and a working test harness — the foundation every other Feature-1 story builds on.

Scaffold the app, then pin every dependency to an exact version (no `^`/`~`) and bump TypeScript to a version that typechecks against this environment's Node 22 `@types/node` (the template's `~4.5.4` cannot parse it; `5.9.3` is the observed-working pin). Wire `@vitejs/plugin-react` into the renderer Vite config. Set the renderer `index.html` with a Content-Security-Policy whose `connect-src` allows **exactly** the two Open-Meteo hosts (`https://geocoding-api.open-meteo.com` and `https://api.open-meteo.com`). Add a Vitest config (node environment) and `test` / `typecheck` scripts, plus `.nvmrc` pinning Node 22.

Include the two shared primitives both deep-module stories depend on: the `City` domain type (a resolved place — `name`, `latitude`, `longitude`, optional `country`/`admin1`) and a thin `electron-log` logger wrapper.

The slice is complete when `npm run typecheck` and the renderer `vite build` exit 0 and an (empty) `npm test` run succeeds.

Known-issues (feature-doc-gauntlet, project-level): the toolchain is exact-pinned per `Technical-Context.MD`; the initial scaffold legitimately uses `npm install` / `npm init` to create the first lockfile — commit `package-lock.json` and use `npm ci` for subsequent installs. `@vitejs/plugin-react` is an implied React-under-Vite dependency to itemise at the next docs sync.

**Security controls (added by /check-security-design):** harden the `index.html` CSP — `default-src 'self'`, `script-src 'self'` (no `unsafe-eval`/inline script), and `connect-src` restricted to exactly the two Open-Meteo hosts with no wildcard — and enforce supply-chain pinning (exact versions, committed `package-lock.json`, `npm ci`). See the Security acceptance criteria.

## Context references

The docs the AFK Developer Agent must load from the checkout before implementing this story (the Developer reads them from disk; it never queries the tracker):

- **Plan**: `docs/superpowers/plans/2026-07-15-feature-1-current-temperature-for-searched-city-plan.md`
- **Spec**: `docs/superpowers/specs/2026-07-15-feature-1-current-temperature-for-searched-city-design.md`
- `Context.MD`
- `Technical-Context.MD`
- `PRD.md`
- `Roadmap.md`

No ADRs apply (`docs/adr/` is empty at design time).

## Acceptance criteria (ADO Acceptance Criteria field — authoritative)

- [ ] Electron Forge Vite+TypeScript app scaffolds and runs; all dependencies exact-pinned (no `^`/`~`), TypeScript on a version that typechecks against Node 22 `@types/node`.
- [ ] `.nvmrc` pins Node 22; `tsconfig.json` configured for React (`jsx: react-jsx`, DOM libs, `strict: true`).
- [ ] `@vitejs/plugin-react` wired into the renderer Vite config.
- [ ] `index.html` carries a CSP whose `connect-src` allows exactly `https://geocoding-api.open-meteo.com` and `https://api.open-meteo.com`.
- [ ] Vitest configured (node environment); `test` and `typecheck` scripts present.
- [ ] `City` type defined (`name`, `latitude`, `longitude`, optional `country`/`admin1`); `electron-log` logger wrapper added.
- [ ] `npm run typecheck` exits 0; renderer `vite build` exits 0; `npm test` runs (0 tests) green.

### Security acceptance criteria
<!-- Added by /check-security-design (threats: renderer network-egress exfiltration; dependency substitution/drift). Each is independently testable; the post-PR /review-implementation-security gate checks the merged diff against these. -->
- [ ] `index.html` CSP sets `default-src 'self'` and `script-src 'self'` (no `unsafe-eval`, no inline `<script>`); a test asserts these directives are present.
- [ ] CSP `connect-src` lists exactly `https://geocoding-api.open-meteo.com` and `https://api.open-meteo.com` — no `*` wildcard and no other host; a test asserts the directive contains no `*` and only these two origins.
- [ ] All npm dependencies are exact-pinned in `package.json` (no `^`/`~` ranges) and `package-lock.json` is committed; a check asserts no floating ranges and that the lockfile exists.

## Plan and Spec (orchestrator-projected — authoritative for this Run)

- **Plan**: `docs/superpowers/plans/2026-07-15-feature-1-current-temperature-for-searched-city-plan.md`
- **Spec**: `docs/superpowers/specs/2026-07-15-feature-1-current-temperature-for-searched-city-design.md`
