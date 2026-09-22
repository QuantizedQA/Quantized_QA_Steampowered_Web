# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

Playwright E2E tests against the **live Steam store** (`store.steampowered.com`, plus `help.steampowered.com` / `steamcommunity.com` for cross-navigation). There is no app to run and no `webServer`/`baseURL` in the Playwright config — every spec uses absolute URLs and only passes with real network access to Valve's servers. Treat failures as potentially flaky (slow/changed live site) before assuming a regression.

## Commands

- Setup: `npm install` then `npx playwright install` (browsers are not auto-installed by `npm install`).
- `npm run lint` — eslint
- `npm run format:check` — prettier check
- `npm run typecheck` — `tsc --noEmit`
- `npm test` — `playwright test` (all specs, chromium only)
- Run one spec file: `npx playwright test tests/Footer_Links.spec.ts`
- Run one test by name: `npx playwright test -g "community navigation"`
- All four commands run in CI; `typecheck` and `playwright-tests` are the actual merge gates (see below).

## Layout

- `tests/` — Playwright specs, one file per feature area (footer links, main nav, landing page, game details page).
- `pages/` — Page Object Model classes. Specs instantiate these instead of writing raw locators/URLs inline:
  - `HomePage` — main nav locators/actions (Store/Community/About/Support).
  - `POM_Legal` — footer/legal flows: centralized Steam legal URLs (`urls` map), footer link clicking (handles same-tab vs new-tab navigation), and the accessibility report download flow.
- No shared `config/` constants file currently exists — each page object owns its own URLs (e.g. `POM_Legal.urls`). If you introduce a new page object with hardcoded URLs, follow that pattern rather than reintroducing a global config file unless asked.

## Gotchas

- Specs target real, specific live content (e.g. the game "Meowgic" and "Counter-Strike 2" in `VerifyGameDetailsPage.spec.ts`, specific footer link text/selectors in `Footer_Links.spec.ts`). Steam changing page structure, copy, or catalog content will break these tests independent of code correctness — verify against the live site before assuming a code bug.
- `POM_Legal.clickFooterLink` handles both same-tab navigation and links that open a new tab (`context.waitForEvent("page")`); preserve that dual handling when touching footer flows.
- Playwright config (`playwright.config.ts`) is deliberately lenient: only the `chromium` project is enabled, `fullyParallel: true`, no retries locally. In CI (`CI=true`): `forbidOnly` on, 2 retries, single worker. Don't shrink timeouts casually — live Steam can be slow.
- `tsconfig.json`: `strict: false`, includes only `tests/**` and `playwright.config.ts` (page objects under `pages/` are type-checked transitively via imports, not directly included).
- ESLint (`eslint.config.cjs`) is relaxed: `no-unused-vars` and `no-explicit-any` are warnings, not errors, and the config file itself is lint-ignored. Match this tolerance; don't "fix" it to be strict.
- Prettier uses defaults (`{}`); run `npm run format:check` and fix formatting rather than disabling the check.

## CI / branching

`.github/workflows/playwright.yml` triggers only on pull requests into `development` or `main` (direct pushes to those branches are blocked by branch rules). Three jobs:
- `lint-and-format` — advisory only (`continue-on-error: true`), does not block merging; kept warn-only because the team is learning.
- `typecheck` — a real gate.
- `playwright-tests` — the real gate, depends on `typecheck`, runs against the live Steam store with a 30-minute timeout; always uploads the HTML report as an artifact (`playwright-report/`), pass or fail.
