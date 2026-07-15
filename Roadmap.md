# Roadmap

**Product:** Desktop Weather App POC 3 — a desktop app to search a City and see its Current Conditions and five-day Forecast.

## Sequencing

Features are listed in delivery order. Each Feature gets its own `/brainstorming` session, Spec, and Plan.

---

## Feature 1: See the current temperature for a searched city 🔫 *tracer bullet*

**Status:** **Published to ADO** — Feature [#20](https://dev.azure.com/EnateInternal/DesktopWeatherAppPOC/_workitems/edit/20) (published as "TEST - Feature 1: See the current temperature for a searched city"), 2026-07-15.

The thinnest end-to-end slice that exercises every layer of the stack: an Electron window running React, a search box that captures a search query, the **Geocoder** resolving that query to exactly one **City**, the **Weather service** fetching from Open-Meteo, and the screen showing the resolved city's name and its current temperature (in °C). A new search replaces what's shown. This proves the whole stack — Electron shell, React UI, both real-IO Open-Meteo seams — works end to end against the live API.

**Out of scope:** the **Weather Condition** icon/label, the five-day **Forecast**, and polished empty / loading / no-City-found / fetch-error states (Feature 2 owns those). Just the happy-path current temperature.

**Dependencies:** None (this is the tracer bullet).

**Why first:** It stands up the Electron/React shell and both Open-Meteo integration seams (Geocoder, Weather service) with the smallest possible user-visible result, de-risking every Feature that follows.

---

## Feature 2: Complete, robust Current Conditions

Builds the "right now" experience out to its full, resilient form. Adds the **Weather Condition** (icon + label) to **Current Conditions** via the pure **Condition mapper** (the third deep module), rounds out the current-conditions display, and adds the states the tracer bullet skipped: the empty state (prompt to search on launch), a loading indication, the "no City found" message when a search resolves to nothing, and the terse fetch-error message ("Unable to load weather data."). After this Feature the current-weather half of the app is genuinely finished.

**Out of scope:** the five-day **Forecast** (Feature 3).

**Dependencies:** Feature 1 (specifically: the search → resolve → fetch pipeline — Geocoder and Weather service — and the app shell it stands up).

---

## Feature 3: Five-day Forecast

Adds the **Forecast**: a Forecast view rendering five **Daily Forecast** cards, each showing the day, a high and low temperature, and its **Weather Condition**. Extends the **Weather service** to surface the five Daily Forecasts (today-inclusive) alongside Current Conditions, and slots the Forecast view into the existing app shell and its loading/error states.

**Out of scope:** hourly forecasts, weather maps/radar, severe-weather alerts, and anything beyond the five-day daily view (all deferred per the PRD).

**Dependencies:** Feature 2 (the Condition mapper and the empty/loading/error state handling) and Feature 1 (the Weather service and app shell).

---

## PRD coverage matrix

Every requirement in `PRD.md`, mapped to the Feature that owns it.

| PRD requirement | Owning Feature |
|---|---|
| R1 — Type a city name into a search field | Feature 1 |
| R2 — Submit the search (Enter / search control) | Feature 1 |
| R3 — Resolve typed text to a single **City** | Feature 1 |
| R4 — Auto-pick the best match when more than one place matches | Feature 1 |
| R5 — Clear "no city found" message when nothing matches | Feature 2 |
| R6 — Show the resolved city's name and locality detail | Feature 1 |
| R7 — See **Current Conditions** for the chosen city | Feature 1 |
| R8 — Current Conditions includes the current temperature | Feature 1 |
| R9 — Current Conditions shows a **Weather Condition** (label + icon) | Feature 2 |
| R10 — See a five-day **Forecast** | Feature 3 |
| R11 — Forecast begins with today | Feature 3 |
| R12 — Each **Daily Forecast** shows day, high/low, Weather Condition | Feature 3 |
| R13 — Temperatures in °C, wind in km/h (fixed metric) | Feature 1 |
| R14 — A new search replaces the currently shown city | Feature 1 |
| R15 — Empty state prompting a search on first open | Feature 2 |
| R16 — Visible loading indication while fetching | Feature 2 |
| R17 — Terse plain error message on fetch failure | Feature 2 |
| R18 — Runs as a native desktop window | Feature 1 |

All PRD requirements are owned — **0 UNOWNED**.
