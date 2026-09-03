# TASKS

## Current Section
- **G5 — Template Ecosystem Expansion: IN_PROGRESS.** Current atomic milestone: Specialty Cafe family renderer + routing integration.

## Unified Queue
1. **G4 — Arabic/English SEO Architecture:** DONE / VERIFIED / CLOSED — real URL-level locale variants with native metadata, reciprocal hreflang, and correct `lang`/`dir` behavior without fabricated translations.
2. **G5 — Template Ecosystem Expansion:** IN_PROGRESS — first specialty-cafe family is implemented and awaiting final Browser Template QA; remaining families stay queued.
3. **G6 — Performance + Media:** TODO — evidence-based image/font/JS budgets, media optimization and Core Web Vitals measurement for representative Saudi mobile fixtures.
4. **G7 — Analytics, Search Console, Growth, Rollout:** TODO — acquisition-to-conversion funnel, Search Console measurement, template/branch comparisons, privacy-reviewed analytics and staged rollout.

## G5 Current Atomic Milestone — Specialty Cafe
- VERIFIED: `src/components/templates/specialty-cafe.tsx` provides a dedicated specialty-cafe renderer with compact cafe hierarchy, barista picks, category navigation, dense product rows, product details/modifiers, cart, and public ordering.
- VERIFIED: `src/routes/m.$slug.tsx` routes the `specialty-cafe` family to `SpecialtyCafeTemplate` and preserves existing contemporary and fallback renderers.
- VERIFIED: `src/lib/theme/registry.test.ts` protects the `coffee` → `specialty-cafe` family mapping.
- VERIFIED: GitHub Actions run `33802971758` passed route-tree generation, Typecheck, Tests, Lint, and Production build.
- IN_PROGRESS: Playwright installation and Browser Template QA remain pending/running in the quality workflow.
- BLOCKED: Vercel provider status reports `build-rate-limit` for the G5 implementation commit; no source workaround is appropriate.

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
- VERIFIED: GitHub Actions run `33801648459` for commit `4cb283ab8037506374f9711788cd0e576207e260` passed every quality gate.
- VERIFIED: Browser Template QA passed mobile, tablet, and desktop with HTTP 200, RTL, Arabic document language, no horizontal overflow, accessibility-name checks, zero runtime console errors, and reduced-motion support.
- VERIFIED: the G4 TypeScript regression in `src/components/lang-toggle.tsx` was fixed and the resulting CI run passed.

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
- **G5 Specialty Cafe milestone:** finish Browser Template QA for the current implementation commit, then close the milestone only after the full quality workflow passes.
