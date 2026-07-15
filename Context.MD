# Desktop Weather App POC 3

The domain of a desktop app where a user searches for a city and views its current weather and a five-day forecast.

## Language

**City**:
A real place that has been resolved to geographic coordinates and can have weather shown for it. Always a resolved place — never the raw text a user typed, and never an unresolved or non-existent place.
_Avoid_: Location, Place, Search

**Current Conditions**:
A real-time snapshot of the weather right now for a City. Describes the present moment, not a prediction.
_Avoid_: Now, Live weather

**Forecast**:
The set of five Daily Forecasts covering a City's weather over five calendar days beginning today. Distinct from Current Conditions, which describes now rather than a whole-day prediction.
_Avoid_: Outlook, Prediction

**Daily Forecast**:
A single day's predicted weather within a Forecast (a whole-day summary such as high/low and expected Weather Condition). The first Daily Forecast is today.
_Avoid_: Day, Forecast day

**Weather Condition**:
The categorical state of the weather (e.g. Clear, Cloudy, Rain, Snow), shown as an icon and label. A field appearing in both Current Conditions and each Daily Forecast — not the full now-snapshot itself.
_Avoid_: Condition, Weather code, Status

## Relationships

- A **City** has one **Current Conditions** and one **Forecast**
- A **Forecast** is composed of five **Daily Forecasts**, the first being today
- **Current Conditions** and the first **Daily Forecast** both describe today — one as the instantaneous now, the other as the whole-day summary
- Both **Current Conditions** and each **Daily Forecast** carry a **Weather Condition**
- The app shows exactly one **City** at a time; a new search replaces it, and nothing is persisted between launches (no history, favourites, or remembered City)

## Example dialogue

> **Dev:** "When someone types 'Paris' and there's a Paris, France and a Paris, Texas, do we ask which one?"
> **Domain expert:** "No — there's no disambiguation. The search resolves to exactly one **City**, the top geocoding match. If it resolves to nothing, that's 'no **City** found', not a broken City."
> **Dev:** "And today shows up twice — once in **Current Conditions**, once as the first **Daily Forecast**?"
> **Domain expert:** "Right. Same day, different resolution: Current Conditions is the instantaneous now; the first Daily Forecast is today's whole-day summary. Both show a **Weather Condition**, but 'Current Conditions' is the whole snapshot, not the sky state."

## Flagged ambiguities

- "City" was used to mean both the raw text a user typed and the resolved place. Resolved: a **City** is always a resolved place (name + coordinates); the typed text is a transient _search query_ (not a domain term). A search resolves to exactly one **City** (the top geocoding match is auto-picked; there is no disambiguation step) or to none, in which case the outcome is "no City found" — not an invalid City.
- "condition" alone is ambiguous. **Current Conditions** is the full now-snapshot for a City; a **Weather Condition** is just the categorical sky state (Clear, Rain, …) that appears as a field within it and within each Daily Forecast.
