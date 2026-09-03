# TASKS

## Current Section
- **G3 — Saudi Local Discovery + Branch SEO: IN_PROGRESS.** G2 is closed and protected after complete repository and live crawler-surface verification.

## Unified Queue
1. **G3 — Saudi Local Discovery + Branch SEO:** IN_PROGRESS — audit verified Saudi city/branch data and implement the smallest production-safe local SEO slice backed entirely by existing verified entities.
2. **G4 — Arabic/English SEO Architecture:** TODO — real URL-level locale variants, native metadata, reciprocal hreflang and correct `lang`/`dir` only when both versions actually exist.
3. **G5 — Template Ecosystem Expansion:** TODO — specialty cafe, bakery/dessert, fast casual/QSR, fine dining/hospitality and small-menu families under the shared SEO/accessibility/performance contract.
4. **G6 — Performance + Media:** TODO — evidence-based image/font/JS budgets, media optimization and Core Web Vitals measurement for representative Saudi mobile fixtures.
5. **G7 — Analytics, Search Console, Growth, Rollout:** TODO — acquisition-to-conversion funnel, Search Console measurement, template/branch comparisons, privacy-reviewed analytics and staged rollout.

## G1 Verification Evidence — CLOSED
- VERIFIED: `33763072784` passed every quality gate, including Typecheck, Tests (61/61), Lint (0 errors), Production build, Playwright installation, Browser template QA and preview cleanup.
- VERIFIED: production public-menu SSR SEO metadata and structured data behave correctly for normal, branch, and missing routes.
- UNKNOWN: production canonical origin for JSON-LD remains relative because no verified application-level canonical public origin has been configured.
- UNKNOWN: Search Console/indexation state until separately inspected.

## G2 Verification Evidence — CLOSED
- VERIFIED: `src/lib/seo/crawl.ts` implements deterministic robots/sitemap serialization with XML escaping, origin normalization, and duplicate-path elimination.
- VERIFIED: `server/middleware/grok-pwa.ts` exposes `/robots.txt` and `/sitemap.xml` using the existing Nitro middleware path.
- VERIFIED: sitemap SQL requires active/published tenants and active branches.
- VERIFIED: robots does not disallow `/m/*` and declares `/sitemap.xml`.
- VERIFIED: unavailable public menus remain `noindex, nofollow`; branch routes remain canonical owners.
- VERIFIED: `scripts/quality-workflow.test.mjs` covers robots behavior, sitemap rendering/deduplication, and the published/active sitemap SQL contract.
- VERIFIED: GitHub Actions run `33769708337` passed route-tree generation, Typecheck, Tests (66/66), Lint, Production build, Playwright installation, Browser template QA, and preview cleanup.
- VERIFIED: Browser template QA passed on mobile, tablet, and desktop with RTL, Arabic document language, no horizontal overflow, zero runtime console errors, accessibility-name checks, and reduced-motion support.
- VERIFIED: current Vercel production deployment `dpl_4VUKHziJn8B3nwVTUG6mjiFksihS` is READY and exposes the expected production aliases.
- VERIFIED: live `/robots.txt` returns HTTP 200 with the expected crawl rules and sitemap declaration.
- VERIFIED: live `/sitemap.xml` returns HTTP 200 with `application/xml; charset=utf-8`.
- VERIFIED: live sitemap is valid XML and contains four absolute unique URLs: `/m/mndy-alwtnya`, `/m/mndy-alwtnya/main-branch`, `/m/nafas`, `/m/nafas/olaya`.
- VERIFIED: the live sitemap URL set is consistent with the repository eligibility contract; automated tests verify active/published tenant and active branch filtering.
- VERIFIED: unavailable public-menu routes are excluded from the verified live sitemap set and emit non-indexing behavior.

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
- DONE / VERIFIED: G2 Crawl Control and Indexation.

## Exact Next Task
- **G3 — Audit verified Saudi location data and implement the smallest production-safe local-discovery/branch-SEO slice backed entirely by existing verified entities.** Do not begin G4 in the same task.
