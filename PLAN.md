# Platform Growth, Template Ecosystem, and Saudi SEO — Active Plan

## Status and Current Section
- Status: IN_PROGRESS / BLOCKED only on external Search Console ownership verification.
- Repository: `Midosd249/Menu_V3`; `main` is the source of truth.
- G1 — Public Menu SEO Foundation: **DONE / VERIFIED**.
- G2 — Crawl Control and Indexation: **DONE / VERIFIED**.
- G3 — Saudi Local Discovery + Branch SEO: **DONE / VERIFIED / CLOSED**.
- G4 — Arabic/English SEO Architecture: **DONE / VERIFIED / CLOSED**.
- G5 — Template Ecosystem Expansion: **DONE / VERIFIED / CLOSED**.
- G6 — Performance + Media: **DONE / VERIFIED / CLOSED**.
- **Current section:** G7 — Analytics, Search Console, Growth, Rollout.
- **Current atomic task:** G7.2 Search Console ownership verification.

## Repository Maintenance — 2026-09-04
- **VERIFIED:** documentation organization from the dedicated `chore/repository-organization` branch was applied to `main` without changing application source, migrations, dependencies, CI, or Vercel configuration.
- **VERIFIED:** historical root documentation was moved under `docs/archive/`; maintained deployment, development, and product documentation was grouped under `docs/`.
- **VERIFIED:** `README.md`, `docs/repository-organization-audit.md`, and `DELETE_CANDIDATES.md` are now present on `main`.
- **VERIFIED:** no deletion candidate was deleted by this maintenance commit.
- **UNKNOWN:** local working-tree status remains unavailable through the GitHub connector.

## G7 — Analytics, Search Console, Growth, Rollout — IN_PROGRESS

### G7.1 — Production analytics integrity hardening — DONE / VERIFIED
- **VERIFIED:** `src/lib/menu/analytics-integrity.test.ts` protects supported ranges, tenant scoping, product validation, duplicate suppression, and active/published tenant resolution.
- **VERIFIED:** GitHub Actions quality run `33821751476` / run 430 passed typecheck, all 81 tests, lint, production build, Playwright installation, Browser Template QA, performance artifact step, and cleanup.
- **VERIFIED:** no analytics runtime code or event schema was changed.

### G7.2 — Search Console production readiness — DEPLOYMENT DONE / SEARCH CONSOLE BLOCKED
- **VERIFIED:** Vercel project `menu-v3` is linked to `Midosd249/Menu_V3` and exposes `menu-v3-kohl.vercel.app`.
- **VERIFIED:** `package.json` declares `@vitejs/plugin-react` at `^6.1.1`, fixing the observed Vercel missing-dependency build defect.
- **VERIFIED:** latest GitHub quality workflow passed on the tested `main` history.
- **VERIFIED:** Vercel production deployment `dpl_BSfCxSgyDetjHQssuz6pQRgm7DNf` is READY for commit `2e5d7c2d19ab184c51a99a0c84ec198c4a3861fa`.
- **VERIFIED:** production `robots.txt` returns HTTP 200 and declares `/sitemap.xml` while protecting administrative routes.
- **VERIFIED:** production `sitemap.xml` returns HTTP 200 and exposes the current published menu/branch URLs.
- **VERIFIED:** production `/` returns HTTP 200 with the existing Arabic RTL public experience.
- **VERIFIED:** `src/routes/__root.tsx` supports optional `VITE_GOOGLE_SITE_VERIFICATION`; no verification token is committed.
- **BLOCKED:** Search Console ownership still requires the Google-provided verification value and account confirmation.
- **UNKNOWN:** Search Console submission/indexation/canonical state until Google confirms ownership.

## G7 guardrails
- Preserve G1–G6 contracts.
- Do not add Google credentials, external analytics dependencies, or speculative provider configuration.
- Treat existing first-party `menu_events` analytics as the source of truth.
- Never commit the Search Console verification token; configure it only as a Vercel Production environment value.
- Do not infer Google indexing state from repository code or Vercel status.

## Exact Next Task
- **G7.2 Search Console ownership verification:** configure the Google-provided public verification value in Vercel Production, verify ownership in Google Search Console, submit the existing `/sitemap.xml`, and record the resulting Google status.

## Research / Design Sources
- **VERIFIED:** Google Search Console ownership verification guidance: `https://support.google.com/webmasters/answer/9008080`.
- **VERIFIED:** Google Search Console property guidance: `https://support.google.com/webmasters/answer/34592`.
- **VERIFIED:** Google Search Console sitemap guidance: `https://support.google.com/webmasters/answer/7451001`.
- **VERIFIED:** Vite environment guidance: `https://vite.dev/guide/env-and-mode` — `VITE_` variables are client-exposed and therefore unsuitable for secrets.
- **VERIFIED:** `@vitejs/plugin-react` maintained releases support the repository's Vite 8 line.

## Unified milestones
- G1 — Public Menu SEO Foundation: **DONE / VERIFIED**.
- G2 — Crawl Control and Indexation: **DONE / VERIFIED**.
- G3 — Saudi Local Discovery + Branch SEO: **DONE / VERIFIED / CLOSED**.
- G4 — Arabic/English SEO Architecture: **DONE / VERIFIED / CLOSED**.
- G5 — Template Ecosystem Expansion: **DONE / VERIFIED / CLOSED**.
- G6 — Performance + Media: **DONE / VERIFIED / CLOSED**.
- G7 — Analytics, Search Console, Growth, Rollout: **IN_PROGRESS / BLOCKED only on external Search Console verification**.
