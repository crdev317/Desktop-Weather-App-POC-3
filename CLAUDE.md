# CLAUDE.md — agent orientation

You are working in **Desktop Weather App POC 3**, a product built with the **Enate SDLC Factory**.
This file is the *agent* front door (auto-loaded every session); `README.md` is the human one.

## Read this first — and follow the flow

This product is built by walking the Factory's **HITL → AFK** flow. **Before you act, read
the field guide and follow the flow it describes:**

➡️ **[Using the Enate SDLC Factory](https://github.com/kitcox-dev/enate-claude-skills/blob/main/docs/using-the-sdlc-factory.md)**

The guide is the source of truth for *which skill to fire when*. The single rule it hinges on,
which you must never break: **only a human moves a Story to `Agent Ready`** — that is the HITL→AFK
handoff; the orchestrator owns every other transition.

## Where the Factory skills come from

The Factory skills install as the **`enate-sdlc-factory` plugin** from the `enate-skills`
marketplace declared in this repo's `.claude/settings.json` (source:
`kitcox-dev/enate-claude-skills`) — every session on this repo, desktop or cloud, loads them
automatically. Plugin-loaded skill names carry the `enate-sdlc-factory:` prefix (e.g.
`/enate-sdlc-factory:tdd`); guide references like `/tdd` mean that skill under whatever name
your available-skills list shows.

## The documentation fabric (load before you plan or build)

Authority order (lower wins): **ADR > Technical-Context > Context.MD > PRD > Roadmap > Spec > Plan.**

- **`Technical-Context.MD`** — the engineering contract every code-writing agent must respect
  (principles, secure-coding baseline, branching, and the **Testing & the ratchet** standard).
- **`Context.MD`** — the domain glossary (the project's language).
- **`PRD.md`** · **`Roadmap.md`** — product requirements; the ordered Feature list.
- **`docs/adr/`** — architectural decisions (highest authority).
- **`docs/superpowers/specs/`** · **`plans/`** — per-Feature Spec and Plan (the Plan carries
  the **Context references** an agent loads).

## Dev commands

Stack: Electron 43 (Forge + Vite template) · React 18 · TypeScript 5.9 · Vite 5 ·
Vitest 2 · Node 22 (`.nvmrc`). Dependencies are exact-pinned with a committed
`package-lock.json` — always install with `npm ci`, never `npm install` (a version
bump is a deliberate PR, per `Technical-Context.MD`).

- `npm ci` — install the exact, locked dependency tree
- `npm start` — run the app in dev (electron-forge)
- `npm test` — run the Vitest suite once (`vitest run`)
- `npm run typecheck` — `tsc --noEmit`
- `npm run lint` — ESLint over `.ts`/`.tsx`
- `npm run make` / `npm run package` — packaged build

Tests live next to source as `src/**/*.test.ts` (Vitest, node environment). The renderer's
`index.html` carries a Content-Security-Policy that must allow exactly the two Open-Meteo
hosts and nothing else — `src/csp.test.ts` and `src/supply-chain.test.ts` guard the CSP and
the exact-pinning/lockfile policy.
