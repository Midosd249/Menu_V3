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
- G1 — Public Menu SEO Foundation is now DONE / VERIFIED and protected.
- **G2 — Crawl Control and Indexation is IN_PROGRESS.** The production crawl-control implementation is present in `server/middleware/grok-pwa.ts` and `src/lib/seo/crawl.ts`; regression coverage has now been restored and expanded.
- A pre-existing G1 typecheck regression in `src/routes/m.$slug.tsx` was found by CI evidence and corrected without reopening the G1 milestone.
- G2 cannot be marked DONE until the full repository verification suite runs successfully against the new commit.

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

## G2 — Crawl Control and Indexation
### Implementation
- **VERIFIED:** `src/lib/seo/crawl.ts` provides deterministic `robots.txt` and XML sitemap builders with XML escaping, origin normalization, and duplicate-path elimination.
- **VERIFIED:** `server/middleware/grok-pwa.ts` serves `/robots.txt` and `/sitemap.xml` directly through the deployed Nitro middleware.
- **VERIFIED:** sitemap database selection requires `tenants.is_active = true`, `tenants.is_published = true`, and `branches.is_active = true`, ordered deterministically by tenant slug and branch creation time.
- **VERIFIED:** sitemap output uses absolute URLs and optional `lastmod` values.
- **VERIFIED:** robots allows public pages, disallows private application surfaces, and declares `/sitemap.xml`.
- **VERIFIED:** existing public-menu routes enforce `is_active` and `is_published` at the database boundary and emit `noindex, nofollow` for missing/unavailable menu data.
- **VERIFIED:** branch routes own their canonical and Restaurant JSON-LD metadata; the parent route suppresses duplicate branch metadata.
- **VERIFIED:** regression coverage was restored in `scripts/quality-workflow.test.mjs` for robots, sitemap rendering/deduplication, and the published/active sitemap SQL contract.
- **VERIFIED:** the typecheck failure from the immediately preceding CI run was isolated to the existing `matches.some(...)` route-id comparison in `src/routes/m.$slug.tsx`; the targeted correction now compares the route id as a string.

### Research / Design Evidence
- **VERIFIED:** Google Search Central recommends absolute URLs in sitemaps, root-level sitemap placement, and using sitemaps for canonical/indexable URLs.
- **VERIFIED:** Google Search Central distinguishes robots.txt crawl control from `noindex`; robots.txt must not be used as the mechanism for preventing indexing.
- **VERIFIED:** Google documents the `Sitemap` robots.txt field as a fully qualified URL.

## Verification Evidence
- **VERIFIED:** commit `141cb949e0d3d0ac8b081aed1c9be97607e6febb` was the prior `main` head and its CI run `33767726530` reached typecheck after successful route-tree generation/build setup, then failed on the G1 route-id comparison.
- **VERIFIED:** commit `2c40efee3c58264606d5e6e6b8cfe74e29e7a109` is now `main` and contains only the targeted G2 regression coverage plus the typecheck correction.
- **VERIFIED:** Vercel has accepted the new commit and currently reports the deployment status as pending.
- **BLOCKED:** the new commit has no GitHub Actions workflow run yet; the available workflow history shows the previous failure, but the API-authored commit has not produced a new Actions run in the available execution window.
- **BLOCKED:** local `git clone` is unavailable in this execution environment because outbound DNS/network access to GitHub is unavailable, so the repository-defined local commands cannot be executed here.
- **UNKNOWN:** final CI test/typecheck/lint/build result for commit `2c40efee3c58264606d5e6e6b8cfe74e29e7a109`.
- **UNKNOWN:** final Vercel deployment result for that commit.
- **UNKNOWN:** live `/robots.txt` and `/sitemap.xml` output after the new deployment completes.

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
- **BLOCKED:** final G2 verification is waiting for executable CI/deployment evidence against commit `2c40efee3c58264606d5e6e6b8cfe74e29e7a109`.

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
- 2026-09-03 — Resumed G2 from repository evidence; confirmed crawl-control implementation already existed but its regression coverage had been reverted.
- 2026-09-03 — Restored and expanded G2 regression coverage and corrected the typecheck regression found in `src/routes/m.$slug.tsx`.
- 2026-09-03 — Committed the focused G2 changes as `2c40efee3c58264606d5e6e6b8cfe74e29e7a109` and advanced `main` to that commit.

## Exact Remaining Work
- **Current atomic task remains G2 — Crawl Control and Indexation.**
- **Exact next action:** obtain executable verification for commit `2c40efee3c58264606d5e6e6b8cfe74e29e7a109` (GitHub Actions or equivalent repository environment), then inspect the deployed `/robots.txt` and `/sitemap.xml` responses and close G2 only if all acceptance gates pass.
- Do not start G3 until G2 is closed and verified.
