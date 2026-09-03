# TASKS

## Current
- **G1 — Public Menu SEO Foundation: IN_PROGRESS.** Verify server-rendered public menu content, page metadata, canonical URLs and truthful Restaurant structured data.

## Unified Queue
1. **G1 — Public Menu SEO Foundation:** IN_PROGRESS — SSR public menu content plus dynamic Arabic-first metadata, canonical, Open Graph and Restaurant JSON-LD.
2. **G2 — Crawl Control and Indexation:** TODO — `robots.txt`, dynamic sitemap, published/unpublished filtering, canonical/redirect policy and tests.
3. **G3 — Saudi Local Discovery + Branch SEO:** TODO — safe city/branch landing-page strategy using complete verified branch data.
4. **G4 — Arabic/English SEO Architecture:** TODO — real URL-level locale variants, native metadata, reciprocal hreflang and correct `lang`/`dir` only when both versions actually exist.
5. **G5 — Template Ecosystem Expansion:** TODO — specialty cafe, bakery/dessert, fast casual/QSR, fine dining/hospitality and small-menu families under the shared SEO/accessibility/performance contract.
6. **G6 — Performance + Media:** TODO — evidence-based image/font/JS budgets, media optimization and Core Web Vitals measurement for representative Saudi mobile fixtures.
7. **G7 — Analytics, Search Console, Growth, Rollout:** TODO — acquisition-to-conversion funnel, Search Console measurement, template/branch comparisons, privacy-reviewed analytics and staged rollout.

## Completed / Protected
- DONE / VERIFIED: Level 0 Foundation & Audit.
- DONE / VERIFIED: Level 1 Theme Engine Hardening.
- IMPLEMENTED / VERIFIED PARTIALLY: Level 2 Menu Experience & Product System.
- DONE / VERIFIED: Level 3 Restaurant Operations / Ordering.
- DONE / VERIFIED: Team invitation lifecycle via PR #5, merge `161d955be4311a457d5b3573212fd8a1baa21489`.
- DONE / VERIFIED: Durable tenant-role/platform-authorization database foundation.
- DONE / VERIFIED: Subscription-plan database foundation.
- DONE / VERIFIED: Canonical application authorization integration for `access_role` / `branch_scope`.
- DONE / VERIFIED: Repository agent contract in `AGENTS.md`.
- DONE / VERIFIED: Client onboarding idempotency boundary.
- DONE / VERIFIED: Level 4C subscription entitlement enforcement.
- DONE / VERIFIED: T1 template architecture contract; quality run `33742263927` passed.
- DONE / VERIFIED: T2 shared semantic menu presentation primitives; quality run `33742271561` passed.
- DONE / VERIFIED: T3 `contemporary-restaurant` family renderer; quality run `33743105967` passed.
- DONE / VERIFIED: Theme preview routing correction in `657757dfe485465277088108b43871f8d941a9a4`.

## Strategic Reassessment Evidence
- VERIFIED: public routes are `/m/$slug` and `/m/$slug/$branch`.
- VERIFIED: `PublicMenu` already contains the core restaurant/branch/menu data required for page-level SEO.
- VERIFIED: root metadata was generic and public-menu canonical/Restaurant JSON-LD were absent before G1.
- VERIFIED: no repository `robots.txt` or `sitemap.xml` route was found before G2.
- VERIFIED: English is currently a UI language state rather than a separate crawlable URL variant; `hreflang` is deferred.
- INFERRED: owned restaurant web presence + Arabic-first local SEO is the strongest current differentiation opportunity against delivery marketplaces and POS incumbents.
- UNKNOWN: production custom-domain canonical origin, Search Console state, production content quality and holiday-hour data.

## G1 Scope
- Objective: make published public menus crawlable through server-rendered content and give them accurate page-specific metadata/schema.
- Added `src/lib/menu/seo.ts`.
- Added `src/lib/menu/seo.test.ts`.
- Added route loaders/head metadata to `src/routes/m.$slug.tsx` and `src/routes/m.$slug.$branch.tsx`.
- Registered the focused SEO test in `package.json` without changing dependency versions.
- Acceptance: SSR menu content, unique truthful title/description/canonical/OG, truthful Restaurant JSON-LD, `noindex` for missing menus, preserved tenant/branch/order/theme behavior.

## Verification Evidence
- VERIFIED: historical repository quality run `33743739709` passed all existing quality steps.
- VERIFIED: browser gate run `33744076308` failed at `Start built preview`; Playwright installation and all earlier steps passed. This remains an open preview-process issue.
- IN_PROGRESS: G1 CI run `33744481336`.
- UNKNOWN: final G1 CI result and live deployed head/metadata until directly verified.
