# AGENTS.md

## What this repo is

Playwright E2E tests against the **live Steam store** (`store.steampowered.com`). There is no app to run and no `webServer`/`baseURL` in the Playwright config — specs use absolute URLs and only pass with real network access to Valve's servers. Treat failures as potentially flaky before assuming a regression.

## Commands

- Setup: `npm install` then `npx playwright install` (browsers not auto-installed on `npm install`).
- `npm run lint` (eslint), `npm run format:check` (prettier), `npm run typecheck` (tsc --noEmit), `npm test` (playwright).
- Run one spec: `npx playwright test tests/add-to-cart.spec.ts`
- Run one test: `npx playwright test -g "add a game to the cart"`
- All four (`lint`, `format:check`, `typecheck`, `test`) run in CI and must pass locally.

## Layout

- `tests/` — Playwright specs (one file per feature area).
- `pages/` — Page Object Model classes (`HomePage`, `AddToCartPage`, `CartPage`); specs instantiate these instead of writing raw locators.
- `config/config.ts` — the only constants file: Steam URLs and timeout tiers. Edit here, not in specs/pages.

## Gotchas

- Cart tests share live cart state: they must call `CartPage.ensureEmptyCart()` before adding items. Keep that call when modifying cart flows.
- Tests are tightly coupled to a specific game (Palworld): locators hardcode name `Palworld`, price `$29.99`, and the `Buy Palworld` region. Changing the target game means updating `pages/AddToCartPage.ts`, `pages/CartPage.ts`, and `config/config.ts` together.
- Playwright config is deliberately lenient: only the `chromium` project is enabled, `fullyParallel: true`, no retries locally. In CI (`CI=true`): `forbidOnly` on, 2 retries, single worker. Generous timeouts (60s–1000s) exist because live Steam is slow — don't shrink them casually.
- `tsconfig.json`: `strict: false`, includes only `tests/**` and `playwright.config.ts` (page objects are type-checked transitively via imports).
- ESLint is relaxed (no-unused-vars / no-explicit-any are warnings, not errors), and `eslint.config.cjs` itself is lint-ignored. Match this tolerance; don't "fix" it to be strict.
- Prettier uses defaults (`{}`); run `npm run format:check` and fix formatting rather than disabling the check.

## CI / branching

Workflow `.github/workflows/playwright.yml` triggers on PRs to `development` or `main` only. `lint-and-format` is advisory (`continue-on-error: true`) and does not block merging; `typecheck` and `playwright-tests` are the real gates. The `playwright-tests` job depends on `typecheck`.
