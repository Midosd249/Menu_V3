# TASKS

## Current Section
- **G1 — Public Menu SEO Foundation: IN_PROGRESS.** Implementation is complete; the current atomic task is the evidence-backed fix and verification of the two public-menu link search typing errors.

## Unified Queue
1. **G1 — Public Menu SEO Foundation:** IN_PROGRESS — verify the current CI run after the typed public-menu search fix; do not close G1 until its required CI/browser and deployment evidence is available.
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

## G1 Verification Evidence
- VERIFIED: historical quality run `33743739709` passed all existing gates before G1.
- VERIFIED: historical run `33744076308` passed Typecheck, Tests, Lint, Production build and Playwright installation; it failed only at `Start built preview`.
- VERIFIED: root cause of that preview failure was recursive `npm run preview` invocation through `scripts/preview.mjs`.
- VERIFIED: public-route typing errors from run `33744710145` were fixed in `9e4368ac545fc155480d89ccf172d7d70b46746e`, `ebef098356e805d246d54a7c4dd6dc0ac6d63000` and `73d0e13375de54ccf49ae9fdab703c836ce60b28`.
- VERIFIED: commit `298ffe21f98cb17a9147c27b3cd222f8f4f7453f` changed only the CI preview start step to run `vite preview` directly with readiness polling.
- VERIFIED: CI run `33748260638` showed the two remaining errors in `src/routes/index.tsx`: `{}` was not assignable to the required `{ branch: string | undefined }` search contract at the two existing public-menu links.
- VERIFIED: commit `295e6cbcf19ce65f2da4ea780e0768ac370fdd9b` changed only those two links to supply `search={{ branch: undefined }}`.
- IN_PROGRESS: CI run `33748743094` was triggered from the fix commit; it had reached Install when last observed. Later documentation commits also trigger quality runs, so the latest run must be checked before claiming verification.
- BLOCKED: Vercel deployment rate limit prevents live production HTML/head inspection.
- UNKNOWN: final CI conclusion, Browser QA result, live canonical origin, Search Console/indexation state and production content quality.

## Strategic Reassessment Evidence
- VERIFIED: public routes are `/m/$slug` and `/m/$slug/$branch`.
- VERIFIED: `PublicMenu` contains the core restaurant/branch/menu data required for page-level SEO.
- VERIFIED: root metadata was generic and public-menu canonical/Restaurant JSON-LD were absent before G1.
- VERIFIED: no repository `robots.txt` or `sitemap.xml` route was found before G2.
- VERIFIED: English is currently a UI language state rather than a separate crawlable URL variant; `hreflang` is deferred.
- INFERRED: owned restaurant web presence + Arabic-first local SEO is the strongest current differentiation opportunity against delivery marketplaces and POS incumbents.
- UNKNOWN: production custom-domain canonical origin, Search Console state, production content quality and holiday-hour data.
