# TASKS

## Current Section
- **G1 — Public Menu SEO Foundation: IN_PROGRESS.** CI implementation and Browser template QA verification are complete. Deployment inspection remains blocked by Vercel rate limiting.

## Unified Queue
1. **G1 — Public Menu SEO Foundation:** IN_PROGRESS — verify the deployed Vercel build and generated HTML/head once the deployment rate limit clears.
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
- VERIFIED: `33762057453` isolated missing PGlite runtime assets in the Vercel function root.
- VERIFIED: PGlite runtime assets are now copied to both `_libs` and the function root.
- VERIFIED: `33762621637` isolated production-only `menu_v3` migrations being executed against the PGlite `public` database.
- VERIFIED: PGlite now records `menu_v3.*` production-only migrations as skipped; PostgreSQL behavior is unchanged.
- VERIFIED: `33763072784` passed every quality gate, including Typecheck, Tests (61/61), Lint (0 errors), Production build, Playwright installation, Browser template QA and preview cleanup.
- VERIFIED: regression coverage exists for Browser QA preview isolation, PGlite assets and PGlite migration isolation.
- BLOCKED: Vercel deployment rate limit prevents live production HTML/head inspection while active.
- UNKNOWN: live production canonical origin and Search Console/indexation state until deployment can be inspected.

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
- **Verify the deployed Vercel build and generated HTML/head for G1 after the deployment rate limit clears. Do not start G2.**
