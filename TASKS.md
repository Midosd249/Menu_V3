# TASKS

## Current Section
- **G7 — Analytics, Search Console, Growth, Rollout: IN_PROGRESS / BLOCKED only on external Search Console ownership verification.**

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
- DONE / VERIFIED: no application source, migration, dependency, CI, or Vercel configuration was changed.
- DONE / VERIFIED: no deletion candidate was deleted.
- UNKNOWN: local working-tree and shell verification remain unavailable through the connected GitHub surface.

## G7.1 — Production analytics integrity hardening
- DONE / VERIFIED: added `src/lib/menu/analytics-integrity.test.ts` covering supported ranges, tenant scoping, invalid product handling, duplicate visit/QR suppression, and active/published tenant resolution.
- DONE / VERIFIED: registered the suite in the existing test command.
- DONE / VERIFIED: no runtime analytics/event model or dependency was changed.
- DONE / VERIFIED: GitHub Actions quality run `33821751476` / run 430 passed typecheck, all 81 tests, lint, production build, Playwright installation, Browser Template QA, performance artifact step, and cleanup.

## G7.2 — Search Console production readiness
- DONE / VERIFIED: identified `menu-v3-kohl.vercel.app` as the configured Vercel project domain for `menu-v3`, linked to `Midosd249/Menu_V3`.
- DONE / VERIFIED: fixed the observed Vercel build defect by declaring `@vitejs/plugin-react` at `^6.1.1` in `package.json`.
- DONE / VERIFIED: latest GitHub quality workflow passed on the tested `main` history.
- DONE / VERIFIED: Vercel production deployment `dpl_BSfCxSgyDetjHQssuz6pQRgm7DNf` is READY on commit `2e5d7c2d19ab184c51a99a0c84ec198c4a3861fa`.
- DONE / VERIFIED: live production root returns HTTP 200 with Arabic RTL metadata and the existing public experience.
- DONE / VERIFIED: live production `robots.txt` returns HTTP 200 and declares the sitemap.
- DONE / VERIFIED: live production `sitemap.xml` returns HTTP 200 and exposes the current published menu/branch URLs.
- DONE / VERIFIED: optional `VITE_GOOGLE_SITE_VERIFICATION` support exists without committing a verification token.
- BLOCKED: Search Console ownership requires the Google-provided verification value and account confirmation.
- UNKNOWN: Search Console submission/indexation/canonical state.

## Exact Next Task
- **G7.2 Search Console ownership verification:** configure the Google-provided public verification value in Vercel Production, verify ownership in Google Search Console, submit the existing `/sitemap.xml`, and record the resulting Google status. Do not commit the token or start unrelated work.
