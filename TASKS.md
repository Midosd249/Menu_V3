# TASKS

## Current Section
- **G1 — Public Menu SEO Foundation: IN_PROGRESS.** Implementation is complete; the current atomic task is verification of the Browser QA fix.

## Unified Queue
1. **G1 — Public Menu SEO Foundation:** IN_PROGRESS — verify the current CI run through Browser template QA and close only when required CI/browser and deployment evidence is available.
2. **G2 — Crawl Control and Indexation:** TODO — `robots.txt`, dynamic sitemap, published/unpublished filtering, canonical/redirect policy and tests.
3. **G3 — Saudi Local Discovery + Branch SEO:** TODO — safe city/branch landing-page strategy using complete verified branch data.
4. **G4 — Arabic/English SEO Architecture:** TODO — real URL-level locale variants, native metadata, reciprocal hreflang and correct `lang`/`dir` only when both versions actually exist.
5. **G5 — Template Ecosystem Expansion:** TODO — specialty cafe, bakery/dessert, fast casual/QSR, fine dining/hospitality and small-menu families under the shared SEO/accessibility/performance contract.
6. **G6 — Performance + Media:** TODO — evidence-based image/font/JS budgets, media optimization and Core Web Vitals measurement for representative Saudi mobile fixtures.
7. **G7 — Analytics, Search Console, Growth, Rollout:** TODO — acquisition-to-conversion funnel, Search Console measurement, template/branch comparisons, privacy-reviewed analytics and staged rollout.

## G1 Verification Evidence
- VERIFIED: `33748743094` isolated the Browser QA URL-type defect after all earlier gates passed.
- VERIFIED: `7b3e0812a29c129374d8d99cdf98cf005790a233` fixed the target conversion.
- VERIFIED: `33760030791` isolated preview lifetime loss before Browser QA.
- VERIFIED: `b56c951e362522ec0e25b02a343278beff725f2c` keeps preview startup and Browser QA in one process lifetime.
- VERIFIED: `33762057453` isolated the remaining Browser QA failure to missing `.vercel/output/functions/__server.func/pglite.wasm`.
- VERIFIED: `69544f9f55f06c85e70a703765f62ed6a16cf3f1` copies `pglite.data`, `pglite.wasm` and `initdb.wasm` to the function root while preserving `_libs` copies.
- VERIFIED: `scripts/pglite-asset.test.mjs` guards the function-root asset contract.
- VERIFIED: `33762426073` correctly exposed a stale regression assertion; the assertion was updated without weakening runtime coverage.
- IN_PROGRESS: post-fix CI verification after the asset placement correction and continuity-document updates.
- BLOCKED: Vercel deployment rate limit prevents live production HTML/head inspection while active.
- UNKNOWN: final post-fix CI conclusion and production deployment evidence.

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

## Exact Next Task
- **Verify the newest GitHub Actions run through Browser template QA and final conclusion. Do not start G2.**
