# TASKS

## Current Section
- **G3 — Saudi Local Discovery + Branch SEO: BLOCKED at final production verification.** Repository implementation is green; Vercel production deployment is blocked by the provider's build-rate-limit status.

## Unified Queue
1. **G3 — Saudi Local Discovery + Branch SEO:** BLOCKED — verify/trigger a Vercel production deployment from the current G3 `main` commit after the provider build-rate limit clears, then confirm the deployed branch page and close G3. Do not start G4.
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
- VERIFIED: GitHub Actions run `33769708337` passed route-tree generation, Typecheck, Tests (66/66), Lint, Production build, Playwright installation, Browser Template QA, and preview cleanup.
- VERIFIED: Browser template QA passed on mobile, tablet, and desktop with RTL, Arabic document language, no horizontal overflow, zero runtime console errors, accessibility-name checks, and reduced-motion support.
- VERIFIED: current Vercel production deployment `dpl_4VUKHziJn8B3nwVTUG6mjiFksihS` is READY and exposes the expected production aliases.
- VERIFIED: live `/robots.txt` returns HTTP 200 with the expected crawl rules and sitemap declaration.
- VERIFIED: live `/sitemap.xml` returns HTTP 200 with `application/xml; charset=utf-8`.
- VERIFIED: live sitemap is valid XML and contains four absolute unique URLs: `/m/mndy-alwtnya`, `/m/mndy-alwtnya/main-branch`, `/m/nafas`, `/m/nafas/olaya`.
- VERIFIED: the live sitemap URL set is consistent with the repository eligibility contract; automated tests verify active/published tenant and active branch filtering.
- VERIFIED: unavailable public-menu routes are excluded from the verified live sitemap set and emit non-indexing behavior.

## G3 Verification Evidence
- VERIFIED: repository data audit confirms tenant city/country, branch address/name/Maps URL/phone/activity, and branch hours are available.
- VERIFIED: current production `/m/nafas/olaya` payload contains `country=SA`, `city=الرياض`, branch name, address, Maps URL, phone, and branch hours.
- VERIFIED: `src/lib/menu/seo.ts` gates local address markup on verified Saudi location fields and emits `hasMap` only for an absolute stored Maps URL.
- VERIFIED: `src/lib/menu/seo.test.ts` covers complete Saudi branch data and incomplete location data.
- VERIFIED: GitHub Actions run `33782244590` passed route-tree generation, Typecheck, Tests, Lint, Production build, Playwright installation, Browser Template QA, and preview cleanup for commit `6982c586fb0455405f04ea1625c494638bf7b1d6`.
- VERIFIED: G3 code diff against the G2 baseline is limited to `src/lib/menu/seo.ts` and `src/lib/menu/seo.test.ts`.
- BLOCKED: Vercel project `menu-v3` reports production deployment `dpl_BfbtHk39MdNakPrVEZzdHAhZWoqB`, built from `5dd7549d534f2003e2fc95563fbfd4ebee6c81d5`, which is four commits behind the G3 implementation baseline `6982c586fb0455405f04ea1625c494638bf7b1d6`.
- BLOCKED: GitHub Vercel status for current commit `54e6b68c9e7177f3d21565bc00cfcc6f508894d9` is `failure` with target `https://vercel.com/midosd2s-projects?upgradeToPro=build-rate-limit`, directly identifying the provider build-rate-limit as the current deployment blocker.
- VERIFIED: the Vercel deployment tool rejected an empty deployment because it requires actual files; no unsafe/speculative deployment payload was attempted.
- VERIFIED: no application source change is required for this infrastructure blocker.

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
- **Finish G3 only:** after the Vercel build-rate limit clears, trigger/verify a production deployment from current `main`, fetch `/m/nafas/olaya`, confirm the Saudi `PostalAddress` and `hasMap` output plus no regressions, then close G3. Do not begin G4.
