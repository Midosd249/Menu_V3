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
- G1 — Public Menu SEO Foundation is DONE / VERIFIED and protected.
- **G2 — Crawl Control and Indexation is IN_PROGRESS.** The production crawl-control implementation is present and its regression coverage is restored and expanded.
- A pre-existing G1 typecheck regression in `src/routes/m.$slug.tsx` was found by CI evidence and corrected without reopening G1.
- The focused G2 commit has now passed the complete repository quality workflow. G2 remains open only because the current Vercel deployment is rate-limited, preventing live inspection of `/robots.txt` and `/sitemap.xml` for the focused commit.

## Completed Task — CI Browser template QA
### Root Cause
- **VERIFIED:** the built Vercel server-function preview uses PGlite in the fallback path.
- **VERIFIED:** PGlite runtime assets were required at the Vercel server-function root as well as `_libs`.
- **VERIFIED:** production-only `menu_v3.*` migrations are isolated from the PGlite fallback, while PostgreSQL behavior remains unchanged.
- **VERIFIED:** CI preview lifecycle is isolated from runner cleanup and Browser QA is run against the built preview.

### Fix
- **VERIFIED:** `scripts/ensure-pglite-asset.mjs` copies the required PGlite runtime assets to both supported runtime locations.
- **VERIFIED:** `src/lib/db.ts` records production-only `menu_v3.*` migrations as skipped in PGlite instead of executing them there.
- **VERIFIED:** CI preview is launched directly with Vite, readiness-checked, and cleaned up safely.
- **VERIFIED:** regression tests cover preview isolation, PGlite asset placement, migration portability, and migration isolation.

## G2 — Crawl Control and Indexation
### Implementation
- **VERIFIED:** `src/lib/seo/crawl.ts` provides deterministic `robots.txt` and XML sitemap builders with XML escaping, origin normalization, and duplicate-path elimination.
- **VERIFIED:** `server/middleware/grok-pwa.ts` serves `/robots.txt` and `/sitemap.xml` through the existing Nitro middleware.
- **VERIFIED:** sitemap database selection requires `tenants.is_active = true`, `tenants.is_published = true`, and `branches.is_active = true`, ordered deterministically.
- **VERIFIED:** sitemap output uses absolute URLs and optional `lastmod` values.
- **VERIFIED:** robots allows public pages, disallows private application surfaces, and declares `/sitemap.xml`.
- **VERIFIED:** public-menu routes enforce active/published tenant state and emit `noindex, nofollow` for missing/unavailable menu data.
- **VERIFIED:** branch routes own their canonical and Restaurant JSON-LD metadata; the parent route suppresses duplicate branch metadata.
- **VERIFIED:** `scripts/quality-workflow.test.mjs` covers robots behavior, sitemap rendering/deduplication, and the published/active sitemap SQL contract.
- **VERIFIED:** the route-id typecheck regression in `src/routes/m.$slug.tsx` is corrected by comparing the route id as a string.

### Research / Design Evidence
- **VERIFIED:** Google Search Central recommends absolute URLs in sitemaps, root-level sitemap placement, and using sitemaps for canonical/indexable URLs.
- **VERIFIED:** Google Search Central distinguishes robots.txt crawl control from `noindex`.
- **VERIFIED:** Google documents the `Sitemap` robots.txt field as a fully qualified URL.

## Verification Evidence
- **VERIFIED:** focused G2 implementation commit `e0a007a4a45362494d26ff801a833708b17d4fb7` is present on `main` and triggered GitHub Actions run `33769708337`.
- **VERIFIED:** run `33769708337` passed route-tree generation, Typecheck, Tests, Lint, Production build, Playwright installation, Browser template QA, and preview cleanup.
- **VERIFIED:** the repository test suite reported 66 tests passed and 0 failed.
- **VERIFIED:** Browser template QA passed for mobile, tablet, and desktop with RTL, Arabic document language, no horizontal overflow, zero runtime console errors, accessibility-name checks, and reduced-motion support.
- **VERIFIED:** the production build completed successfully and generated the Vercel Nitro output; the database migration step safely skipped because no Postgres connection string was configured in CI.
- **VERIFIED:** a dedicated session log records this verification checkpoint.
- **BLOCKED:** Vercel reports `Deployment rate limited — retry in 24 hours` for the focused commit, so no new production deployment is available for live crawler-surface inspection.
- **UNKNOWN:** live `/robots.txt` and `/sitemap.xml` output for the focused commit until Vercel permits a deployment.
- **UNKNOWN:** Search Console/indexation state until separately inspected.

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
- **BLOCKED:** Vercel deployment rate limit prevents final live G2 crawler-surface verification.
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
- 2026-09-03 — Inspected live Vercel production HTML/head and fixed duplicate branch canonical/JSON-LD emission.
- 2026-09-03 — Re-inspected production `/m/nafas` and `/m/nafas/olaya`; G1 CLOSED.
- 2026-09-03 — Resumed G2 from repository evidence; confirmed crawl-control implementation already existed but its regression coverage had been reverted.
- 2026-09-03 — Restored and expanded G2 regression coverage and corrected the typecheck regression found in `src/routes/m.$slug.tsx`.
- 2026-09-03 — Committed focused G2 changes as `2c40efee3c58264606d5e6e6b8cfe74e29e7a109`.
- 2026-09-03 — Fixed sitemap duplicate-path handling in `e0a007a4a45362494d26ff801a833708b17d4fb7b7`; GitHub Actions run `33769708337` passed every repository quality gate.
- 2026-09-03 — Confirmed Vercel deployment for the focused commit is rate-limited, so live crawler-surface verification remains blocked.

## Exact Remaining Work
- **Current atomic task remains G2 — Crawl Control and Indexation.**
- **Exact next action:** when Vercel deployment is no longer rate-limited, verify the focused commit's `/robots.txt` and `/sitemap.xml` responses and close G2 only if those live outputs satisfy the existing acceptance criteria.
- Do not start G3 until G2 is closed and verified.
