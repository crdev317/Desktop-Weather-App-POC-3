## What to build

Implement the `weatherService` deep module — `getCurrentTemperature(city: City) => Promise<number>` — as framework-agnostic TypeScript (no React or Electron imports), calling the live Open-Meteo forecast API end-to-end.

Request `https://api.open-meteo.com/v1/forecast?latitude=<lat>&longitude=<lon>&current=temperature_2m` (keyless). On a 200 body return the finite `current.temperature_2m`, asserting `current_units.temperature_2m === "°C"` (no client-side unit conversion — fixed metric). Throw on a **non-200** status — out-of-range coordinates return HTTP 400 — this is the live-proven error branch.

Retain defensive throws for a missing/non-numeric `current.temperature_2m`, a wrong unit, or an unparseable body, but treat all three as **defensive-only**: they are unreachable via live real-IO (a well-formed request for valid coordinates always returns a numeric temperature in `"°C"`), so their dedicated fixture tests are deferred (see the known-issue).

Ship a real-IO Vitest test (no mock — Overriding Principle 3) covering Seam 2: a real City's coordinates return a finite `"°C"` number; out-of-range coordinates throw (the non-200 branch).

Known-issue (feature-doc-gauntlet): the three defensive-only throw branches (missing/non-numeric temperature, wrong unit, unparseable body) carry **no** Feature-1 test — the no-mock principle blocks reaching them via live real-IO; their Tier-1 recorded-replay fixture tests land when that fixture substrate is first built.

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

- [ ] `getCurrentTemperature(city)` calls the forecast endpoint with `current=temperature_2m`, no auth, and returns the finite `current.temperature_2m`.
- [ ] Asserts `current_units.temperature_2m === "°C"`; no client-side unit conversion.
- [ ] Throws on non-200 (out-of-range coords → HTTP 400); defensive throws retained for missing/non-numeric temperature, wrong unit, and unparseable body (tests deferred — known-issue).
- [ ] Module is framework-agnostic — no React or Electron imports.
- [ ] Real-IO Vitest test (no mock) passes: real City → finite `"°C"` number; out-of-range coords → throws.

## Plan and Spec (orchestrator-projected — authoritative for this Run)

- **Plan**: `docs/superpowers/plans/2026-07-15-feature-1-current-temperature-for-searched-city-plan.md`
- **Spec**: `docs/superpowers/specs/2026-07-15-feature-1-current-temperature-for-searched-city-design.md`
