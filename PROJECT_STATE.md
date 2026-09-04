# PROJECT_STATE

## Identity
- Status: IN_PROGRESS.
- Repository: `Midosd249/Menu_V3`.
- Source of truth: `main`.
- Product: Menu V3, Arabic-first bilingual multi-tenant digital-menu SaaS for restaurants and cafes.
- Active plan: `PLAN.md` — Platform Growth, Template Ecosystem, and Saudi SEO.

## Current Position
- T1, T2, and T3 template milestones are DONE / VERIFIED and protected.
- **G1 — Public Menu SEO Foundation is DONE / VERIFIED.**
- **G2 — Crawl Control and Indexation is DONE / VERIFIED.**
- **G3 — Saudi Local Discovery + Branch SEO is DONE / VERIFIED and CLOSED.**
- **G4 — Arabic/English SEO Architecture is DONE / VERIFIED and CLOSED.**
- **G5 — Template Ecosystem Expansion is DONE / VERIFIED and CLOSED.**
- **G6 — Performance + Media is DONE / VERIFIED / CLOSED.**
- **G7 — Analytics, Search Console, Growth, Rollout is IN_PROGRESS.**
- **G7 audit is DONE / VERIFIED.**
- **G7.1 production analytics integrity hardening is DONE / VERIFIED.**
- **G7.2 Search Console production readiness is DONE / VERIFIED / CLOSED.**
- **Repository organization maintenance is DONE / VERIFIED.**

## G7.1 — Production Analytics Integrity Hardening — DONE / VERIFIED
- **VERIFIED:** `src/lib/menu/analytics-integrity.test.ts` covers supported 7/30-day ranges, tenant scoping across analytics aggregations, invalid/cross-tenant product handling, duplicate visit/QR suppression, and active/published tenant resolution.
- **VERIFIED:** GitHub Actions quality run `33821751476` (run 430) passed typecheck, all 81 tests, lint, production build, Playwright installation, Browser Template QA, performance artifact step, and cleanup.
- **VERIFIED:** no analytics runtime code, event schema, or dependency was changed by the hardening task.

## G7.2 — Search Console Production Readiness — DONE / VERIFIED / CLOSED
- **VERIFIED:** Vercel project `menu-v3` is linked to `Midosd249/Menu_V3` and exposes `menu-v3-kohl.vercel.app`.
- **VERIFIED:** `package.json` declares `@vitejs/plugin-react` at `^6.1.1`, fixing the observed Vercel `ERR_MODULE_NOT_FOUND` build defect.
- **VERIFIED:** latest `main` history passed the full GitHub quality workflow.
- **VERIFIED:** Vercel production deployment `dpl_BSfCxSgyDetjHQssuz6pQRgm7DNf` is `READY` and targets commit `2e5d7c2d19ab184c51a99a0c84ec198c4a3861fa`.
- **VERIFIED:** production `/robots.txt` returns HTTP 200 and declares the production sitemap while disallowing administrative routes.
- **VERIFIED:** production `/sitemap.xml` returns HTTP 200 and contains the current published menu/branch URLs.
- **VERIFIED:** production `/` returns HTTP 200 with Arabic RTL document metadata and the existing public landing experience.
- **VERIFIED:** `src/routes/__root.tsx` supports optional `VITE_GOOGLE_SITE_VERIFICATION`; no token or credential is committed.
- **VERIFIED:** Google Search Console ownership was completed for the user's main Google account.
- **VERIFIED:** the existing `/sitemap.xml` was submitted in Google Search Console.
- **VERIFIED:** the production home URL was inspected and the indexing request was completed successfully.
- **UNKNOWN:** Google's eventual crawl timing and indexing state for individual URLs.

## Repository Organization — DONE / VERIFIED
- **VERIFIED:** documentation organization from `chore/repository-organization` was applied to `main` without changing application source, migrations, dependencies, CI, or Vercel configuration.
- **VERIFIED:** historical root documentation was moved under `docs/archive/`; maintained deployment, development, and product documentation was grouped under `docs/`.
- **VERIFIED:** `README.md`, `docs/repository-organization-audit.md`, and `DELETE_CANDIDATES.md` are present on `main`.
- **VERIFIED:** no deletion candidate was deleted by the organization initiative.
- **UNKNOWN:** local working-tree status remains unavailable through the GitHub connector.

## Known Repository Finding — Dependency Manifest Drift
- **VERIFIED:** `package-lock.json` contains a broader root dependency set than the current `package.json`.
- **UNKNOWN:** whether the lockfile can be safely regenerated from the current manifest without changing required transitive versions or build behavior; this requires a repository shell and package-manager execution.
- **BLOCKED:** the connected GitHub surface does not expose a repository shell, so `npm install --package-lock-only`, `npm ci`, and the full local verification sequence cannot be executed here.
- **Decision:** do not hand-edit `package-lock.json` speculatively. Treat dependency reconciliation as the next atomic task when shell execution is available.

## Protected Completed Work
- G1 Public Menu SEO Foundation: DONE / VERIFIED.
- G2 Crawl Control and Indexation: DONE / VERIFIED.
- G3 Saudi Local Discovery + Branch SEO: DONE / VERIFIED / CLOSED.
- G4 Arabic/English SEO Architecture: DONE / VERIFIED / CLOSED.
- G5 Template Ecosystem: DONE / VERIFIED / CLOSED.
- G6 Performance + Media: DONE / VERIFIED / CLOSED.
- G7.1 Analytics Integrity: DONE / VERIFIED.
- G7.2 Search Console Production Readiness: DONE / VERIFIED / CLOSED.
- Repository Organization Maintenance: DONE / VERIFIED.

## Session Log
- 2026-09-04 — Reconciled continuity state with the completed Google Search Console work and closed G7.2.
- 2026-09-04 — Confirmed repository organization work is present on `main` and the historical organization PR is no longer the active queue.
- 2026-09-04 — Recorded package manifest/lockfile drift as a separate, evidence-backed maintenance finding; no speculative lockfile edit was made.

## Exact Remaining Work
- **Dependency manifest reconciliation:** compare `package.json` and `package-lock.json` using the repository package manager, regenerate only if required, run `npm ci`, typecheck, tests, lint, build, and inspect the resulting diff. Do not change dependency versions unless package-manager evidence requires it.
