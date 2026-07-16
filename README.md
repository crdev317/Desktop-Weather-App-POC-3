# Desktop Weather App POC 3

A small desktop app: type a city name and see its current conditions and a five-day
forecast — no browser, no sign-in, no clutter. Weather and place data come from
[Open-Meteo](https://open-meteo.com/) (free tier, no API key). Built with the
**Enate SDLC Factory**; see `CLAUDE.md` for the agent flow and `PRD.md` for scope.

> Status: early build. The Electron + React shell, exact-pinned toolchain and test
> harness are in place, and the **geocoder** deep module (`resolveCity`) is built and
> tested against the live Open-Meteo geocoding API. The remaining weather features
> (weather service, condition mapper, UI) are not built yet.

## Stack

- **Electron 43** desktop shell, scaffolded via **Electron Forge** (Vite template)
- **React 18** + **TypeScript 5.9** renderer, built with **Vite 5** (`@vitejs/plugin-react`)
- **Vitest 2** test harness · **electron-log** logging
- Node **22** (see `.nvmrc`)

## Setup

```sh
nvm use            # Node 22, per .nvmrc
npm ci             # install the exact, locked dependency tree (not `npm install`)
```

The dependency tree is exact-pinned (no `^`/`~`) with a committed `package-lock.json`,
so always install with `npm ci`.

## Commands

```sh
npm start          # run the app in dev (electron-forge)
npm test           # run the Vitest suite once
npm run typecheck  # tsc --noEmit
npm run lint       # eslint over .ts/.tsx
npm run make       # produce a packaged build
```
