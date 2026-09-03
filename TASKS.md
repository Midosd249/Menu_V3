# TASKS

## Current Section
- **G2 — Crawl Control and Indexation: IN_PROGRESS.** Implementation and repository verification are complete; final live crawler-surface verification is blocked by the current Vercel deployment rate limit.

## Unified Queue
1. **G2 — Crawl Control and Indexation:** IN_PROGRESS — final live verification of deployed `/robots.txt` and `/sitemap.xml`; close only when those outputs are inspected successfully.
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
- VERIFIED: live `/m/nafas` and `/m/nafas/olaya` return the expected route-specific SSR SEO metadata and structured data.
- VERIFIED: live `/m/does-not-exist` returns the expected `noindex, nofollow` behavior.
- VERIFIED: the nested branch-head duplication is resolved in production.
- UNKNOWN: production canonical origin for JSON-LD remains relative because no verified application-level canonical public origin is configured.
- UNKNOWN: Search Console/indexation state until separately inspected.

## G2 Evidence
- VERIFIED: `src/lib/seo/crawl.ts` implements deterministic robots/sitemap serialization.
- VERIFIED: `server/middleware/grok-pwa.ts` exposes `/robots.txt` and `/sitemap.xml` using the existing Nitro middleware path.
- VERIFIED: sitemap SQL requires active/published tenants and active branches.
- VERIFIED: robots does not disallow `/m/*` and declares `/sitemap.xml`.
- VERIFIED: missing public menus remain `noindex, nofollow`; branch routes remain canonical owners.
- VERIFIED: `scripts/quality-workflow.test.mjs` covers robots behavior, sitemap rendering/deduplication, and the published/active sitemap SQL contract.
- VERIFIED: the G1 route-id typecheck regression identified by CI was corrected in `src/routes/m.$slug.tsx` without changing its SEO behavior.
- VERIFIED: focused commit `e0a007a4a45362494d26ff801a833708b17d4fb7` is the tested G2 implementation head.
- VERIFIED: GitHub Actions run `33769708337` passed route-tree generation, Typecheck, Tests (66/66), Lint, Production build, Playwright installation, Browser template QA, and preview cleanup.
- VERIFIED: Browser template QA passed on mobile, tablet, and desktop with RTL, Arabic document language, no horizontal overflow, zero runtime console errors, accessibility-name checks, and reduced-motion support.
- BLOCKED: Vercel deployment for the focused commit is rate-limited (`retry in 24 hours`), so live `/robots.txt` and `/sitemap.xml` output cannot yet be inspected for that deployment.

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
- **G2 — Final live crawler-surface verification:** when Vercel permits a deployment for the focused commit, inspect `/robots.txt` and `/sitemap.xml`, verify the existing G2 acceptance criteria, then close G2. Do not start G3 before G2 is closed and verified.
