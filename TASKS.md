# TASKS

## Current Section
- **G7 — Analytics, Search Console, Growth, Rollout: IN_PROGRESS.**

## Unified Queue
1. **G4 — Arabic/English SEO Architecture:** DONE / VERIFIED / CLOSED.
2. **G5 — Template Ecosystem Expansion:** DONE / VERIFIED / CLOSED.
3. **G6 — Performance + Media:** DONE / VERIFIED / CLOSED.
4. **G7 — Analytics, Search Console, Growth, Rollout:** IN_PROGRESS.

## Repository Organization Maintenance — 2026-09-04
- DONE / VERIFIED: applied the dedicated `chore/repository-organization` documentation organization to `main`.
- DONE / VERIFIED: moved historical root records into `docs/archive/` without changing their contents.
- DONE / VERIFIED: grouped maintained deployment, development, and product documentation under `docs/`.
- DONE / VERIFIED: added `README.md`, `docs/repository-organization-audit.md`, and `DELETE_CANDIDATES.md`.
- DONE / VERIFIED: no application source, migration, dependency, CI, or Vercel configuration was changed by the organization work.
- DONE / VERIFIED: no deletion candidate was deleted.
- UNKNOWN: local working-tree status remains unavailable through the connected GitHub surface.

## G7.1 — Production analytics integrity hardening
- DONE / VERIFIED: added `src/lib/menu/analytics-integrity.test.ts` covering supported ranges, tenant scoping, invalid product handling, duplicate visit/QR suppression, and active/published tenant resolution.
- DONE / VERIFIED: registered the suite in the existing test command.
- DONE / VERIFIED: no runtime analytics/event model or dependency was changed.
- DONE / VERIFIED: GitHub Actions quality run `33821751476` / run 430 passed typecheck, all 81 tests, lint, production build, Playwright installation, Browser Template QA, performance artifact step, and cleanup.

## G7.2 — Search Console production readiness
- DONE / VERIFIED: identified `menu-v3-kohl.vercel.app` as the configured Vercel project domain for `menu-v3`, linked to `Midosd249/Menu_V3`.
- DONE / VERIFIED: fixed the observed Vercel build defect by declaring `@vitejs/plugin-react` at `^6.1.1` in `package.json`.
- DONE / VERIFIED: latest tested GitHub quality workflow passed on the relevant `main` history.
- DONE / VERIFIED: live production root returns HTTP 200 with Arabic RTL metadata and the existing public experience.
- DONE / VERIFIED: live production `robots.txt` returns HTTP 200 and declares the sitemap.
- DONE / VERIFIED: live production `sitemap.xml` returns HTTP 200 and exposes the current published menu/branch URLs.
- DONE / VERIFIED: optional `VITE_GOOGLE_SITE_VERIFICATION` support exists without committing a verification token.
- DONE / VERIFIED: Google Search Console ownership was completed for the main Google account.
- DONE / VERIFIED: the existing `/sitemap.xml` was submitted in Google Search Console.
- DONE / VERIFIED: the production home URL was inspected and the indexing request was completed successfully.
- UNKNOWN: Google crawl timing and eventual indexing state for individual URLs.

## Dependency Manifest Reconciliation — 2026-09-04
- DONE / VERIFIED: regenerated `package-lock.json` from the current `package.json` using the repository package manager on GitHub Actions.
- DONE / VERIFIED: `npm ci` succeeded against the regenerated lockfile.
- DONE / VERIFIED: route-tree generation succeeded.
- DONE / VERIFIED: `npm run typecheck` succeeded.
- DONE / VERIFIED: `npm test` succeeded.
- DONE / VERIFIED: `npm run lint` succeeded.
- DONE / VERIFIED: `npm run build` succeeded.
- DONE / VERIFIED: the one-off reconciliation workflow removed itself after successful completion.
- DONE / VERIFIED: the reconciled lockfile was committed to `main` in commit `7cb9bd2eb41802ea5d18ee1903ef341f41ded83e`.

## Exact Next Task
- **UNKNOWN:** `TASKS.md` currently contains no concrete G7.3 atomic task or acceptance criteria. Do not invent a next requirement; select the next task only from an existing documented requirement or explicit product direction.
