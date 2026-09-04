# Platform Growth, Template Ecosystem, and Saudi SEO — Active Plan

## Status and Current Section
- Status: IN_PROGRESS.
- Repository: `Midosd249/Menu_V3`; `main` is the source of truth.
- G1 — Public Menu SEO Foundation: **DONE / VERIFIED**.
- G2 — Crawl Control and Indexation: **DONE / VERIFIED**.
- G3 — Saudi Local Discovery + Branch SEO: **DONE / VERIFIED / CLOSED**.
- G4 — Arabic/English SEO Architecture: **DONE / VERIFIED / CLOSED**.
- G5 — Template Ecosystem Expansion: **DONE / VERIFIED / CLOSED**.
- G6 — Performance + Media: **DONE / VERIFIED / CLOSED**.
- **Current section:** G7 — Analytics, Search Console, Growth, Rollout.
- **Current atomic task:** G7 dependency manifest reconciliation is **DONE / VERIFIED**.

## Repository Maintenance — 2026-09-04
- **VERIFIED:** documentation organization from the dedicated `chore/repository-organization` branch was applied to `main` without changing application source, migrations, dependencies, CI, or Vercel configuration.
- **VERIFIED:** historical root documentation was moved under `docs/archive/`; maintained deployment, development, and product documentation was grouped under `docs/`.
- **VERIFIED:** `README.md`, `docs/repository-organization-audit.md`, and `DELETE_CANDIDATES.md` are present on `main`.
- **VERIFIED:** no deletion candidate was deleted by this maintenance commit.
- **VERIFIED:** dependency manifest drift was reconciled by regenerating `package-lock.json` from the current `package.json` using the repository package manager.
- **VERIFIED:** `npm ci`, route-tree generation, typecheck, tests, lint, and production build all passed during the reconciliation workflow.
- **VERIFIED:** the one-off reconciliation workflow removed itself after successful completion.
- **UNKNOWN:** local working-tree status remains unavailable through the GitHub connector.

## G7 — Analytics, Search Console, Growth, Rollout — IN_PROGRESS

### G7.1 — Production analytics integrity hardening — DONE / VERIFIED
- **VERIFIED:** `src/lib/menu/analytics-integrity.test.ts` protects supported ranges, tenant scoping, product validation, duplicate suppression, and active/published tenant resolution.
- **VERIFIED:** GitHub Actions quality run `33821751476` / run 430 passed typecheck, all 81 tests, lint, production build, Playwright installation, Browser Template QA, performance artifact step, and cleanup.
- **VERIFIED:** no analytics runtime code or event schema was changed.

### G7.2 — Search Console production readiness — DONE / VERIFIED / CLOSED
- **VERIFIED:** Vercel project `menu-v3` is linked to `Midosd249/Menu_V3` and exposes `menu-v3-kohl.vercel.app`.
- **VERIFIED:** `package.json` declares `@vitejs/plugin-react` at `^6.1.1`, fixing the observed Vercel missing-dependency build defect.
- **VERIFIED:** latest tested GitHub quality workflow passed on the relevant `main` history.
- **VERIFIED:** Vercel production deployment `dpl_BSfCxSgyDetjHQssuz6pQRgm7DNf` was READY on the verified deployment commit.
- **VERIFIED:** production `robots.txt` returns HTTP 200 and declares `/sitemap.xml` while protecting administrative routes.
- **VERIFIED:** production `sitemap.xml` returns HTTP 200 and exposes the current published menu/branch URLs.
- **VERIFIED:** production `/` returns HTTP 200 with the existing Arabic RTL public experience.
- **VERIFIED:** `src/routes/__root.tsx` supports optional `VITE_GOOGLE_SITE_VERIFICATION`; no verification token is committed.
- **VERIFIED:** Search Console ownership was completed for the main Google account.
- **VERIFIED:** the existing `/sitemap.xml` was submitted in Google Search Console.
- **VERIFIED:** the production home URL was inspected and the indexing request was completed successfully.
- **UNKNOWN:** Search Console crawl timing and eventual indexing state for individual URLs.

### G7 Dependency Manifest Reconciliation — DONE / VERIFIED
- **VERIFIED:** `package.json` and `package-lock.json` were reconciled by the repository package manager; no hand-edit was used.
- **VERIFIED:** `npm ci` succeeded against the regenerated lockfile.
- **VERIFIED:** route-tree generation succeeded.
- **VERIFIED:** `npm run typecheck` succeeded.
- **VERIFIED:** `npm test` succeeded.
- **VERIFIED:** `npm run lint` succeeded.
- **VERIFIED:** `npm run build` succeeded.
- **VERIFIED:** the reconciled `package-lock.json` is committed on `main` in `7cb9bd2eb41802ea5d18ee1903ef341f41ded83e`.

## G7 guardrails
- Preserve G1–G6 contracts.
- Do not add Google credentials, external analytics dependencies, or speculative provider configuration.
- Treat existing first-party `menu_events` analytics as the source of truth.
- Never commit the Search Console verification token; configure it only as a Vercel Production environment value.
- Do not infer Google indexing state from repository code or Vercel status.
- Do not hand-edit generated dependency lockfiles when the package manager can regenerate them.

## Exact Next Task
- **UNKNOWN:** the current repository state does not define a concrete G7.3 atomic task with acceptance criteria. Do not invent requirements. The next task must come from an existing documented requirement or explicit product direction.

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
- G7 — Analytics, Search Console, Growth, Rollout: **IN_PROGRESS**.
