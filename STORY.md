## What to build

Implement the `geocoder` deep module — `resolveCity(query: string) => Promise<City | null>` — as framework-agnostic TypeScript (no React or Electron imports), calling the live Open-Meteo geocoding API end-to-end.

Request `https://geocoding-api.open-meteo.com/v1/search?name=<query>&count=1&language=en&format=json` (keyless, no auth headers). Map the top match (`results[0]`) to a resolved **City** — `name` + numeric `latitude`/`longitude`, optional `country`/`admin1`. Return `null` when nothing matches: the no-match body omits the `results` key **entirely** (not `[]`, not `null`), so absent/empty `results` maps to `null`.

Ship a real-IO Vitest test (no mock — Technical-Context Overriding Principle 3) covering Seam 1: "London" resolves to a non-null City with a name and numeric coordinates; an ambiguous name ("Springfield") resolves to a single top match; gibberish resolves to `null` (exercising the absent-`results` path).

**Security control (added by /check-security-design):** URL-encode the search query with `encodeURIComponent` before building the geocoding URL so a crafted query cannot inject or override request parameters (e.g. `count`). See the Security acceptance criteria.

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

- [ ] `resolveCity(query)` calls the Open-Meteo geocoding endpoint with `count=1`, no auth headers, and returns `City | null`.
- [ ] Absent/empty `results` → `null`; a match maps `results[0]` to a City (`name` + numeric `latitude`/`longitude`, optional `country`/`admin1`).
- [ ] Module is framework-agnostic — no React or Electron imports.
- [ ] Real-IO Vitest test (no mock) passes: "London" → non-null City with numeric coords; "Springfield" → single top match; gibberish → `null`.

### Security acceptance criteria
<!-- Added by /check-security-design (threat: query-parameter injection via the search string). Each is independently testable; the post-PR /review-implementation-security gate checks the merged diff against these. -->
- [ ] The raw search query is passed through `encodeURIComponent` before interpolation into the geocoding request URL; a test with a query containing `&`, `=`, `#`, `?`, and spaces (e.g. `London&count=100`) asserts the extra tokens are percent-encoded and do NOT add or override request parameters (the request still pins `count=1`).

## Plan and Spec (orchestrator-projected — authoritative for this Run)

- **Plan**: `docs/superpowers/plans/2026-07-15-feature-1-current-temperature-for-searched-city-plan.md`
- **Spec**: `docs/superpowers/specs/2026-07-15-feature-1-current-temperature-for-searched-city-design.md`
