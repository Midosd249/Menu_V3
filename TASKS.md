# TASKS

## Current Section
- **G2 — Crawl Control and Indexation: TODO / READY.** G1 Public Menu SEO Foundation is DONE / VERIFIED, including production deployment and live HTML/head verification.

## Unified Queue
1. **G2 — Crawl Control and Indexation:** TODO — audit and implement `robots.txt`, dynamic sitemap, published/unpublished filtering, canonical/redirect policy and regression tests.
2. **G3 — Saudi Local Discovery + Branch SEO:** TODO — safe city/branch landing-page strategy using complete verified branch data.
3. **G4 — Arabic/English SEO Architecture:** TODO — real URL-level locale variants, native metadata, reciprocal hreflang and correct `lang`/`dir` only when both versions actually exist.
4. **G5 — Template Ecosystem Expansion:** TODO — specialty cafe, bakery/dessert, fast casual/QSR, fine dining/hospitality and small-menu families under the shared SEO/accessibility/performance contract.
5. **G6 — Performance + Media:** TODO — evidence-based image/font/JS budgets, media optimization and Core Web Vitals measurement for representative Saudi mobile fixtures.
6. **G7 — Analytics, Search Console, Growth, Rollout:** TODO — acquisition-to-conversion funnel, Search Console measurement, template/branch comparisons, privacy-reviewed analytics and staged rollout.

## G1 Verification Evidence — CLOSED
- VERIFIED: `33763072784` passed every quality gate, including Typecheck, Tests (61/61), Lint (0 errors), Production build, Playwright installation, Browser template QA and preview cleanup.
- VERIFIED: PGlite runtime assets are correctly copied to both `_libs` and the Vercel function root.
- VERIFIED: PGlite records production-only `menu_v3.*` migrations as skipped; PostgreSQL behavior remains unchanged.
- VERIFIED: Vercel production project `menu-v3` is linked to `Midosd249/Menu_V3`.
- VERIFIED: production deployment `dpl_y7wz8vKhNzXWjjDYthLCGYfwv9Bm` is READY and built from `main` commit `30325490ed502344360e86e31ae0d13d3fe5eae2`.
- VERIFIED: GitHub comparison confirms `30325490ed502344360e86e31ae0d13d3fe5eae2` is directly ahead of SEO fix commit `62df67e5d2597dcc3f4132354cefe750ae2c2188`.
- VERIFIED: live `/m/nafas` returns SSR menu content with Arabic SEO metadata, one canonical and one Restaurant JSON-LD payload.
- VERIFIED: live `/m/nafas/olaya` returns SSR branch content with branch-specific SEO metadata, one canonical and one Restaurant JSON-LD payload.
- VERIFIED: live `/m/does-not-exist` returns the expected `noindex, nofollow` behavior.
- VERIFIED: the deployment-protection `x-robots-tag: noindex` header is absent on the public production domain; it was only observed on protected Vercel deployment hostnames.
- VERIFIED: the nested branch-head duplication is resolved in production.
- UNKNOWN: production canonical origin for JSON-LD remains relative because no verified application-level canonical public origin is configured.
- UNKNOWN: Search Console/indexation state until separately inspected.

## Completed / Protected
- DONE / VERIFIED: Level 0 Foundation & Audit.
- DONE / VERIFIED: Level 1 Theme Engine Hardening.
- IMPLEMENTED / VERIFIED PARTIALLY: Level 2 Menu Experience & Product System.
- DONE / VERIFIED: Level 3 Restaurant Operations / Ordering.
- DONE / VERIFIED: Team invitation lifecycle.
- DONE / VERIFIED: Durable tenant-role/platform-authorization database foundation.
- DONE / VERIFIED: Subscription-plan database foundation.
- DONE / VERIFIED: Canonical application authorization integration.
- DONE / VERIFIED: Repository agent contract in `AGENTS.md`.
- DONE / VERIFIED: Client onboarding idempotency boundary.
- DONE / VERIFIED: Level 4C subscription entitlement enforcement.
- DONE / VERIFIED: T1 template architecture contract.
- DONE / VERIFIED: T2 shared semantic menu presentation primitives.
- DONE / VERIFIED: T3 `contemporary-restaurant` family renderer.
- DONE / VERIFIED: G1 Public Menu SEO Foundation.

## Exact Next Task
- **G2 — Crawl Control and Indexation:** audit and implement `robots.txt`, dynamic sitemap, published/unpublished filtering, canonical/redirect policy and regression tests. Before coding, inspect the existing route/static-file structure and current crawler/indexation behavior. Do not start G3.
