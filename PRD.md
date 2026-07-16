# PRD — Desktop Weather App POC 3

## Problem Statement

A person wants to check the weather for a specific city — both what it's doing right now and what the next few days hold — without opening a browser, hunting through a cluttered weather website, or wading through ads and content they didn't ask for. They want to type a city name, glance at a clean desktop window, and get the answer.

## Solution

A small desktop application where the user types a **City** name and immediately sees that city's **Current Conditions** and a five-day **Forecast**. The user searches, the app resolves the name to a real place, fetches the weather, and shows it. A new search replaces what's on screen. Nothing to sign into, nothing remembered, no clutter.

## Requirements

1. As a user, I want to type a city name into a search field, so that I can choose which place I see weather for.
2. As a user, I want to submit my search (by pressing Enter or clicking a search control), so that I can trigger the weather lookup deliberately.
3. As a user, I want the app to resolve my typed text to a single real **City**, so that I don't have to pick from a list of ambiguous matches.
4. As a user, when my search matches more than one real place, I want the app to pick the best match automatically, so that I get an answer without extra steps.
5. As a user, when my search matches nothing, I want a clear "no city found" message, so that I understand the search didn't work rather than seeing a broken or empty screen.
6. As a user, I want to see the resolved city's name (and enough locality detail to recognise it, e.g. country/region), so that I can confirm the app understood which place I meant.
7. As a user, I want to see the **Current Conditions** for the chosen city, so that I know what the weather is doing right now.
8. As a user, I want Current Conditions to include the current temperature, so that I know how warm or cold it is now.
9. As a user, I want Current Conditions to show a **Weather Condition** (a label plus an icon, e.g. Clear, Cloudy, Rain, Snow), so that I can read the sky state at a glance.
10. As a user, I want to see a five-day **Forecast** for the chosen city, so that I can plan ahead.
11. As a user, I want the Forecast to begin with today, so that the first day I see matches the current day.
12. As a user, I want each **Daily Forecast** to show the day, a high and low temperature, and a Weather Condition, so that I can compare the days.
13. As a user, I want all temperatures shown in Celsius and wind (where shown) in km/h, so that the units are consistent and predictable.
14. As a user, I want a new search to replace the currently shown city, so that the window always reflects one place at a time.
15. As a user, when I first open the app, I want an empty state prompting me to search, so that I know what to do before I've searched anything.
16. As a user, I want a visible loading indication while the app fetches weather, so that I know it's working and not frozen.
17. As a user, when the weather can't be fetched (network failure, service error), I want a short, plain error message ("Unable to load weather data."), so that I understand something went wrong without technical jargon.
18. As a user, I want the app to run as a native desktop window, so that I can use it without a browser.

## Implementation Decisions

**Stack & shell**
- Electron + React 18 + TypeScript, scaffolded via Electron Forge (Vite template), per `Technical-Context.MD`.
- The Electron main process creates the `BrowserWindow` with the security baseline: `contextIsolation: true` and `nodeIntegration: false`, always. `electron-log` is wired for logging; Open-Meteo call failures and unhandled errors are logged at `error`.

**Data source**
- All weather and place data comes from **Open-Meteo** (free tier, no API key). Two endpoints are used: geocoding (name → coordinates) and forecast (coordinates → current + daily).
- Requests use native `fetch`; no HTTP-client dependency.

**Deep modules (the domain core, extracted for isolation testing)**
1. **Geocoder** — interface `resolveCity(query: string) → City | null`. Calls Open-Meteo geocoding, selects the single top-ranked match, and returns a resolved **City** (display name + locality detail + coordinates), or `null` when nothing matches. There is no disambiguation step — the top match is authoritative.
2. **Weather service** — interface `getWeather(city: City) → { currentConditions, forecast }`. Calls Open-Meteo forecast for the city's coordinates and maps the response into a **Current Conditions** value and a **Forecast** of exactly five **Daily Forecasts** (the first being today).
3. **Condition mapper** — interface `describeCondition(wmoCode: number) → WeatherCondition`. Pure function, no I/O: maps an Open-Meteo WMO weather code to a **Weather Condition** (label + icon category). Shared by Current Conditions and every Daily Forecast so the mapping is defined in exactly one place.

**UI / shell layer**
- **Search input** — captures the transient search query and emits a submit.
- **Current Conditions view** — renders the now-snapshot (temperature + Weather Condition).
- **Forecast view** — renders five Daily Forecast cards (day, high/low, Weather Condition).
- **App shell / state** — holds the single current **City** and orchestrates the states: empty (pre-search), loading, loaded, no-city-found, and fetch-error. A new successful search replaces the current city; nothing is persisted between launches.

**Contracts & shapes**
- A **City** is always a resolved place; the raw typed string is a transient search query and is never stored as domain state.
- The **Forecast** is always exactly five Daily Forecasts, today-inclusive.
- Units are fixed metric (temperature °C, wind km/h) — requested from Open-Meteo directly; no unit conversion happens in the app and there is no unit toggle.

## Testing Decisions

**What makes a good test here:** assert on external, observable behaviour — the resolved City, the shape and values of Current Conditions and the five Daily Forecasts, the mapped Weather Condition — never on internal implementation details or on generated/incidental text. Per `Technical-Context.MD`, the Open-Meteo API is **never mocked**: tests that exercise geocoding or weather fetching go over the real API (recorded-replay at Tier 1, live at Tier 2/3).

**Modules committed to testing (the three deep modules):**
1. **Geocoder** — real-IO tests over Open-Meteo geocoding: a known unambiguous city resolves to the expected place; an ambiguous name resolves to a single top match; a gibberish/no-match query returns `null`.
2. **Weather service** — real-IO tests over Open-Meteo forecast: a known city returns Current Conditions and exactly five Daily Forecasts, the first dated today, with values in the expected units and ranges.
3. **Condition mapper** — pure unit tests: representative WMO codes map to the expected Weather Condition label/icon category; every code in the table maps to a defined result (no gaps, no throw).

**Prior art:** none yet — this is a greenfield repo. These become the reference tests future work is measured against. Test framework is Vitest for unit/real-IO module tests (installed and configured as of the Story #21 scaffold); Playwright is the planned end-to-end tool but is not yet installed and no e2e is committed by this PRD (see Out of Scope).

## Out of Scope

- Choosing among ambiguous geocoding matches (disambiguation UI) — the top match is always taken.
- Any persistence: search history, favourite/saved cities, a remembered last city, or a remembered default on launch.
- A unit toggle or imperial units — units are fixed metric.
- Hourly forecasts, weather maps/radar, severe-weather alerts, air quality, sunrise/sunset, or any Open-Meteo data beyond current conditions and the five-day daily forecast.
- Geolocation / "weather for my current location" — the user always searches by name.
- Committed end-to-end (Playwright) tests — Playwright is the planned e2e tool but is not yet installed; this PRD commits only to the three deep-module tests.
- Packaging/distribution polish (installers, auto-update, code signing) beyond a local packaged build.
- Multi-window, multi-city side-by-side views.

## Further Notes

- The domain vocabulary (City, Current Conditions, Forecast, Daily Forecast, Weather Condition) is defined in `Context.MD` and used verbatim throughout.
- This is a single-feature POC whose real purpose is to exercise the Enate SDLC Factory skills end-to-end; scope is deliberately kept narrow.
- The three deep modules are the natural seams the Factory's testing tiers attach to — the Geocoder and Weather service are the real-IO integration seams with Open-Meteo; the Condition mapper is the pure, exhaustively-testable core.
- Deferred spec detail resolved during PRD synthesis: temperature units are fixed metric.
