# PROJECT_STATE

## Identity
- Status: IN_PROGRESS.
- Repository: `Midosd249/Menu_V3`.
- Source of truth: `main`.
- Product: Menu V3, Arabic-first bilingual multi-tenant digital-menu SaaS for restaurants and cafes.
- Active plan: `PLAN.md` — Platform Growth, Template Ecosystem, and Saudi SEO.
- Superseded plan archive: `PLAN_ARCHIVE_2026-09-03-template-ecosystem.md`.

## Current Position
- T1, T2, and T3 template milestones are DONE / VERIFIED and protected.
- SEO/discoverability remains prioritized before broad template expansion.
- Current section: **G1 — Public Menu SEO Foundation.**
- **Current atomic task completed:** CI Browser template QA was repaired and fully verified.

## Completed Task — CI Browser template QA
### Root Cause
- **VERIFIED:** the built Vercel server-function preview uses PGlite in the fallback path.
- **VERIFIED:** `scripts/ensure-pglite-asset.mjs` originally copied PGlite runtime files only to `_libs`, while the runtime resolved them from `.vercel/output/functions/__server.func`.
- **VERIFIED:** after asset placement was corrected, PGlite migration bootstrap failed because production-only migrations referenced the `menu_v3` PostgreSQL schema, while the PGlite fallback intentionally uses `public`.
- **VERIFIED:** the migration failure caused the preview server to reset the Browser QA connection; this was the actual remaining Browser QA failure.

### Fix
- **VERIFIED:** `scripts/ensure-pglite-asset.mjs` now copies `pglite.data`, `pglite.wasm`, and `initdb.wasm` to both the existing `_libs` location and the Vercel server-function root.
- **VERIFIED:** `src/lib/db.ts` now detects migrations that explicitly target `menu_v3.*` and records them as skipped in PGlite instead of executing production-only schema operations there. PostgreSQL behavior is unchanged.
- **VERIFIED:** CI preview is launched directly with Vite, isolated from runner cleanup, kept in the same step as Browser QA, readiness-checked, and cleaned up with a trap.
- **VERIFIED:** targeted regression tests cover preview isolation, PGlite asset placement, migration portability, and the PGlite migration isolation contract.

## Verification Evidence
- VERIFIED: historical quality run `33743739709` passed all existing quality steps.
- VERIFIED: run `33748743094` passed route generation, Typecheck, Tests (58/58), Lint, Production build, Playwright installation and preview startup; it isolated the `page.goto` URL-type defect.
- VERIFIED: `7b3e0812a29c129374d8d99cdf98cf005790a233` fixed the Browser QA URL-type defect.
- VERIFIED: run `33760030791` isolated preview lifetime loss between CI process contexts.
- VERIFIED: `b56c951e362522ec0e25b02a343278beff725f2c` kept preview startup and Browser QA in one process lifetime.
- VERIFIED: run `33762057453` isolated missing `pglite.wasm` in the server-function root.
- VERIFIED: run `33762621637` isolated the PGlite migration failure after asset placement was corrected.
- VERIFIED: run `33763072784` passed every quality gate, including Browser template QA and cleanup. All steps were successful: Install, route generation, Typecheck, Tests (61/61), Lint (0 errors; warnings only), Production build, Playwright installation, Browser template QA, and preview cleanup.
- VERIFIED: final successful run is `33763072784`.

## Protected Completed Work
- Level 0: DONE / VERIFIED.
- Level 1: DONE / VERIFIED.
- Level 2: IMPLEMENTED / historical partial verification; do not rebuild.
- Level 3: DONE / VERIFIED.
- Team invitation lifecycle: DONE / VERIFIED.
- Durable roles and branch scope: DONE / VERIFIED.
- Client onboarding idempotency: DONE / VERIFIED.
- Subscription foundation and entitlement enforcement: DONE / VERIFIED.
- Repository agent contract: DONE / VERIFIED.
- T1 template architecture contract: DONE / VERIFIED.
- T2 shared semantic menu presentation primitives: DONE / VERIFIED.
- T3 flagship template: DONE / VERIFIED.

## Known Issues / Risks
- **BLOCKED:** Vercel deployment/live HTML-head verification may remain unavailable while the deployment rate limit is active.
- **UNKNOWN:** live production canonical origin, Search Console/indexation state and production content quality until a live deployment can be inspected.
- Existing lint warnings remain but are not errors and were not introduced by this task.

## Session Log
- 2026-09-03 — Audited repository continuity, routes, public data contract, templates, analytics, CI and deployment evidence.
- 2026-09-03 — Researched Saudi restaurant/delivery competitors and official Google/TanStack/SDAIA guidance.
- 2026-09-03 — Archived the superseded template-only plan and created the unified growth/Saudi SEO active plan.
- 2026-09-03 — Implemented G1 public-menu SSR metadata/schema foundation.
- 2026-09-03 — Fixed typed public-menu links and Browser QA URL handling.
- 2026-09-03 — Fixed CI preview recursion and preview process lifetime handling.
- 2026-09-03 — Isolated PGlite runtime asset placement as the remaining Browser QA failure.
- 2026-09-03 — Corrected PGlite runtime asset placement and added a regression guard.
- 2026-09-03 — Isolated production-only `menu_v3` migration execution as the remaining PGlite bootstrap failure.
- 2026-09-03 — Added PGlite migration isolation and regression coverage.
- 2026-09-03 — **CI run `33763072784` passed all quality gates including Browser template QA.**

## Exact Remaining Work
- **Next atomic task:** verify the deployed Vercel build and inspect production HTML/head for the G1 SEO acceptance criteria once Vercel is no longer rate-limited. Do not start G2 before that evidence is available.
