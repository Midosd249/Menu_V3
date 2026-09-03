# TASKS

## Current Section
- **G4 — Arabic/English SEO Architecture: DONE / VERIFIED / CLOSED.** G5 is now the next queued task, but is not started.

## Unified Queue
1. **G4 — Arabic/English SEO Architecture:** DONE / VERIFIED / CLOSED — real URL-level locale variants with native metadata, reciprocal hreflang, and correct `lang`/`dir` behavior without fabricated translations.
2. **G5 — Template Ecosystem Expansion:** TODO — specialty cafe, bakery/dessert, fast casual/QSR, fine dining/hospitality and small-menu families under the shared SEO/accessibility/performance contract.
3. **G6 — Performance + Media:** TODO — evidence-based image/font/JS budgets, media optimization and Core Web Vitals measurement for representative Saudi mobile fixtures.
4. **G7 — Analytics, Search Console, Growth, Rollout:** TODO — acquisition-to-conversion funnel, Search Console measurement, template/branch comparisons, privacy-reviewed analytics and staged rollout.

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

## G3 Verification Evidence — CLOSED
- VERIFIED: repository data audit confirms tenant city/country, branch address/name/Maps URL/phone/activity, and branch hours are available.
- VERIFIED: `src/lib/menu/seo.ts` gates local address markup on verified Saudi location fields and emits `hasMap` only for an absolute stored Maps URL.
- VERIFIED: `src/lib/menu/seo.test.ts` covers complete Saudi branch data and incomplete location data.
- VERIFIED: GitHub Actions run `33782244590` passed route-tree generation, Typecheck, Tests, Lint, Production build, Playwright installation, Browser Template QA, and preview cleanup for commit `6982c586fb0455405f04ea1625c494638bf7b1d6`.
- VERIFIED: G3 code diff against the G2 baseline is limited to `src/lib/menu/seo.ts` and `src/lib/menu/seo.test.ts`.
- VERIFIED: Vercel production deployment `dpl_CPvXFBZgh439e94rUHCJf3GFwWBC` is READY and was built from current `main` commit `e7ac56dcd1730d2cdaf648830199647bf8909f7f`.
- VERIFIED: GitHub Vercel status for current commit `e7ac56dcd1730d2cdaf648830199647bf8909f7f` is `success`.
- VERIFIED: production `/m/nafas/olaya` returns HTTP 200 with `lang="ar"`, `dir="rtl"`, Saudi `PostalAddress`, absolute Google Maps `hasMap`, canonical path `/m/nafas/olaya`, and `robots=index, follow`.
- VERIFIED: the prior provider build-rate-limit blocker no longer prevents the verified deployment.

## G4 Verification Evidence — CLOSED
- VERIFIED: public menu search validation accepts only `ar` or `en` locale values.
- VERIFIED: locale resolution is data-driven and falls back to Arabic when the English variant is not actually available.
- VERIFIED: English public variants use `?lang=en`; Arabic remains the default canonical path.
- VERIFIED: available English variants emit reciprocal absolute `hreflang` links for `ar` and `en`.
- VERIFIED: unavailable English variants emit no fabricated alternate links and are `noindex, follow` while resolving to the Arabic canonical.
- VERIFIED: titles, descriptions, Open Graph locale, canonical URL, and Restaurant schema follow the effective locale.
- VERIFIED: public language switching updates only the locale query parameter and preserves existing search state.
- VERIFIED: parent menu routes suppress duplicate head metadata when a branch child owns the canonical route.
- VERIFIED: `src/lib/menu/seo.test.ts` covers locale availability, resolution, reciprocal alternates, missing English data, Saudi local SEO, and missing-menu noindex behavior.
- VERIFIED: GitHub Actions run `33801648459` for commit `4cb283ab8037506374f9711788cd0e576207e260` passed every quality gate: route-tree generation, Typecheck, Tests (69/69), Lint, Production build, Playwright installation, Browser Template QA, and preview cleanup.
- VERIFIED: Browser Template QA passed mobile, tablet, and desktop with HTTP 200, RTL, Arabic document language, no horizontal overflow, accessibility-name checks, zero runtime console errors, and reduced-motion support.
- VERIFIED: the G4 TypeScript regression in `src/components/lang-toggle.tsx` was fixed and the resulting CI run passed.
- INFERRED: a fresh Vercel deployment of the G4 commit was not independently available for live SEO-head inspection because the provider reported a `build-rate-limit` failure; repository build and browser-preview verification passed completely.

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
- DONE / VERIFIED: G3 Saudi Local Discovery + Branch SEO.
- DONE / VERIFIED: G4 Arabic/English SEO Architecture.

## Exact Next Task
- **G5 — Template Ecosystem Expansion:** TODO. Do not start it in this session.
