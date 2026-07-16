# Technical Context

Engineering-practice contract for code-writing agents in this project. Every implementation must respect what's written here. If a constraint conflicts with the user's request, flag the conflict — don't silently bypass it.

## Overriding Principles
1. No API keys or credentials committed or hardcoded — always via env/config, never in source. (Open-Meteo's free tier needs no key today, but this holds for any service added later, e.g. geocoding.)
2. Electron security baseline is non-negotiable: `nodeIntegration` is always `false` and `contextIsolation` is always enabled in every `BrowserWindow`. Never disabled for convenience.
3. No mocking the Open-Meteo API in tests. Every test that exercises weather-fetching goes over the real API (recorded-replay in Tier 1, live in Tier 2/3) — never a stubbed response.

## Frameworks
> Versions are the exact pins scaffolded by Story #21 (`.nvmrc` + `package.json`/`package-lock.json`).
- **Electron 43.1.1** — desktop shell/runtime
- **React 18.3.1** (`react-dom` 18.3.1) — UI layer
- **TypeScript 5.9.3** — language and type system (bumped from the Forge template's `~4.5.4`, which cannot parse Node 22's `@types/node`)
- **Electron Forge 7.11.2 (Vite plugin)** with **Vite 5.4.21** and **`@vitejs/plugin-react` 4.7.0** — scaffolding and build tooling
- **Node 22** — runtime, pinned via `.nvmrc`

## 3rd-party tech
- **Open-Meteo** — weather data API (free tier, no API key required)

## Packages in use
**HTTP:** native `fetch` (no HTTP client dependency)
**UI/build:** `react` / `react-dom` 18.3.1, `@vitejs/plugin-react` 4.7.0 (React-under-Vite)
**Logging:** `electron-log` 5.4.4 (see Instrumentation)
**Runtime helper:** `electron-squirrel-startup` 1.0.1 (Windows install shortcuts)
**Testing:** `Vitest` 2.1.9 — installed and configured (node environment, `src/**/*.test.ts`). `Playwright` (Electron end-to-end) is planned per the testing tiers but **not yet installed**.

## Toolchain pinning
- Policy: exact-pinned.
- Pinned tools: Node version pinned via `.nvmrc`; all npm dependencies exact-pinned via committed `package-lock.json` (install with `npm ci`, not `npm install`, in agent/CI runs); Electron version pinned exactly (no `^`/`~`) in `package.json`.
- Bumping: a version bump (Node, Electron, or any dependency) is a deliberate PR that updates `.nvmrc`/`package.json` and regenerates `package-lock.json` — never an incidental side effect of another change.

## Instrumentation
`electron-log` is the logging library, with standard levels (`error` / `warn` / `info` / `debug`). Logs write to the local per-OS log file electron-log defaults to, plus the console in dev. Open-Meteo call failures and any unhandled errors are always logged at `error`.

## User Feedback Approach
In-app UI only — no email, Slack, or other out-of-band channel; this is a desktop app. Tone is plain and terse. When a weather fetch fails, the UI shows a short, jargon-free message (e.g. "Unable to load weather data.") rather than a detailed or conversational explanation.

## Branching and Environments
- Model: trunk-based, per `CONTRIBUTING.md`.
- Branches: `main` (protected); `claude/*` HITL work branches; `story/<issue#>-<slug>` AFK Story branches (one in flight at a time).
- Environments: Dev (local, `npm run dev` via electron-forge) and a packaged build (`electron-forge make`/`package`) for install testing. No staging/prod servers — there is no backend to deploy.
- Protected: `main`.

## Git Guardrails
- Never force-push to `main`.
- Never run `git reset --hard`, `git clean -f`, or delete a branch without explicit confirmation.
- Never use `--no-verify` or otherwise skip hooks.
- No enforcement hooks installed yet (policy is documented, not hook-enforced) — revisit with `/git-guardrails-claude-code` if that changes.

## Testing & the ratchet
> Seeded from the Factory standard — **opt-out, not opt-in**. Trim a line only with a deliberate, recorded decision; don't start from nothing. Full standard: <https://github.com/kitcox-dev/enate-claude-skills/blob/main/docs/testing-and-the-ratchet-standard.md> · the *why*: <https://github.com/kitcox-dev/enate-claude-skills/blob/main/docs/agentic-e2e-testing-principles.md>.

- **Test the contract, not the LLM.** Assert on the deterministic envelope (output shape, state transition, side-effect ordering), never on generated text or chain-of-thought.
- **Every seam gets a real-IO test on at least one side.** Mock-on-both-sides only proves the mocks agree; defects live at integration seams, not inside modules.
- **Three tiers, each catching a class the others can't.** Tier 1 — recorded-replay (real local I/O, fakes at the seams, replayed Open-Meteo fixtures; $0, every commit); Tier 2 — live-Open-Meteo, disposable (real subprocess against a per-run throwaway substrate; bounded cost, scheduled); Tier 3 — live (real production substrate and subprocess; continuous).
- **Platform matrix is non-negotiable for OS-touching code.** Filesystem/subprocess code (this is Electron) runs Tier 1 + Tier 2 on every OS it supports, not just the dev box's.
- **Plan test coverage at the Feature level, not the Story level.** Each Feature declares at kickoff which tiers it needs, which fixtures/substrates must exist, and a Tier-2 cost ceiling.
- **The ratchet — every Tier-3 defect pins a cheap-tier regression.** A live defect's fix lands with a Tier-1 (or Tier-2) regression that would have caught it, encoding the **class** of defect **bounded by the seam** where it surfaced — not the exact reproducer, and not a project-wide sweep. A Story that surfaced from a live defect carries that ratcheting fixture as an acceptance criterion.
- **Disposable substrate, not shared.** Tier-2 substrate is created per run and torn down; reproducibility comes from a seed (tarball/manifest/script), never persistent state.
- **Assert on observable behaviour, not internal state.** For Tier 2/3 the target is what an operator could verify from external artefacts — tracker state, commit shape, ordered log events, posted comments.
