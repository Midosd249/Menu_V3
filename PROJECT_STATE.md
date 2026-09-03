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
- G1 — Public Menu SEO Foundation is now **DONE / VERIFIED**.
- Current section is ready to advance to **G2 — Crawl Control and Indexation**.
- No G2 implementation has been started in this task.

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

## G1 Production Verification — CLOSED
### VERIFIED
- Vercel project `menu-v3` is linked to `Midosd249/Menu_V3` and has production domains `menu-v3-kohl.vercel.app`, `menu-v3-midosd2s-projects.vercel.app`, and the main-branch alias.
- Latest production deployment `dpl_y7wz8vKhNzXWjjDYthLCGYfwv9Bm` is `READY` and was built from `main` commit `30325490ed502344360e86e31ae0d13d3fe5eae2`.
- **VERIFIED:** GitHub comparison confirms commit `30325490ed502344360e86e31ae0d13d3fe5eae2` is directly ahead of the SEO fix commit `62df67e5d2597dcc3f4132354cefe750ae2c2188`, with the only intervening change being continuity documentation. Therefore the fixed application code is included in the deployed commit.
- `/m/nafas` returns HTTP 200 with SSR menu content, Arabic title/description, `index, follow`, canonical metadata and exactly one Restaurant JSON-LD payload.
- `/m/nafas/olaya` returns HTTP 200 with SSR branch content, branch-specific title, `index, follow`, canonical `/m/nafas/olaya`, and exactly one branch Restaurant JSON-LD payload.
- `/m/does-not-exist` returns the expected SSR not-found behavior with `noindex, nofollow`.
- The public production domain does not emit the deployment-protection `x-robots-tag: noindex` header; that header was observed only on the protected Vercel deployment hostname.
- **VERIFIED:** the duplicate canonical/JSON-LD issue is resolved in production. The branch page now has one canonical and one relevant Restaurant JSON-LD payload.
- **VERIFIED:** live production pages contain actual SSR menu/branch content rather than an empty client shell.

### Finding and Fix
- **VERIFIED:** the original live `/m/nafas/olaya` output emitted two canonical links and two Restaurant JSON-LD scripts because both `/m/$slug` and `/m/$slug/$branch` supplied head entries.
- **VERIFIED:** commit `62df67e5d2597dcc3f4132354cefe750ae2c2188` changes only `src/routes/m.$slug.tsx` so the parent route omits canonical and JSON-LD when the branch child is present. The branch route remains the sole owner of branch canonical/schema metadata.
- **VERIFIED:** production deployment `dpl_y7wz8vKhNzXWjjDYthLCGYfwv9Bm` contains the fix through commit `30325490ed502344360e86e31ae0d13d3fe5eae2`.

## Verification Evidence
- VERIFIED: `33763072784` passed every quality gate, including Typecheck, Tests (61/61), Lint (0 errors), Production build, Playwright installation, Browser template QA and preview cleanup.
- VERIFIED: live production `/m/nafas` returns HTTP 200 and SSR menu content.
- VERIFIED: live production `/m/nafas/olaya` returns HTTP 200 and SSR branch content.
- VERIFIED: live production `/m/does-not-exist` returns the not-found SEO behavior.
- VERIFIED: live `/m/nafas/olaya` after the fix has one canonical link and one Restaurant JSON-LD script.
- VERIFIED: GitHub compare shows `30325490ed502344360e86e31ae0d13d3fe5eae2` contains `62df67e5d2597dcc3f4132354cefe750ae2c2188` as its immediate parent.
- VERIFIED: Vercel latest production deployment is `dpl_y7wz8vKhNzXWjjDYthLCGYfwv9Bm`, state `READY`, source commit `30325490ed502344360e86e31ae0d13d3fe5eae2`.

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
- G1 Public Menu SEO Foundation: DONE / VERIFIED.

## Known Issues / Risks
- **UNKNOWN:** production canonical origin for JSON-LD remains relative because no verified application-level canonical public origin has been configured.
- **UNKNOWN:** Search Console/indexation state until separately inspected.
- Existing lint warnings remain but are not errors and were not introduced by this task.

## Session Log
- 2026-09-03 — Audited repository continuity, routes, public data contract, templates, analytics, CI and deployment evidence.
- 2026-09-03 — Researched Saudi restaurant/delivery competitors and official Google/TanStack/SDAIA guidance.
- 2026-09-03 — Archived the superseded template-only plan and created the unified growth/Saudi SEO active plan.
- 2026-09-03 — Implemented G1 public-menu SSR metadata/schema foundation.
- 2026-09-03 — Fixed typed public-menu links and Browser QA URL handling.
- 2026-09-03 — Fixed CI preview recursion and preview process lifetime handling.
- 2026-09-03 — Isolated and fixed PGlite runtime asset placement and production-only migration isolation; CI run `33763072784` passed all quality gates.
- 2026-09-03 — Inspected live Vercel production HTML/head and found duplicate branch canonical/JSON-LD emission from nested route heads.
- 2026-09-03 — Applied targeted parent-head suppression in commit `62df67e5d2597dcc3f4132354cefe750ae2c2188`.
- 2026-09-03 — Verified Vercel production deployment `dpl_y7wz8vKhNzXWjjDYthLCGYfwv9Bm` is built from descendant commit `30325490ed502344360e86e31ae0d13d3fe5eae2` and includes the fix.
- 2026-09-03 — Re-inspected production `/m/nafas` and `/m/nafas/olaya`; one canonical and one relevant Restaurant JSON-LD payload are present per page. G1 CLOSED.

## Exact Remaining Work
- **Next atomic task:** G2 — Crawl Control and Indexation. Audit and implement `robots.txt`, dynamic sitemap, published/unpublished filtering, canonical/redirect policy and regression tests. Do not start G3 until G2 is complete and verified.
