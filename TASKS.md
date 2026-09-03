# TASKS

## Current Section
- **G5 — Template Ecosystem Expansion: DONE / VERIFIED / CLOSED.** All six behavioral template families are implemented, routed, regression-protected, and quality-verified.

## Unified Queue
1. **G4 — Arabic/English SEO Architecture:** DONE / VERIFIED / CLOSED — real URL-level locale variants with native metadata, reciprocal hreflang, and correct `lang`/`dir` behavior without fabricated translations.
2. **G5 — Template Ecosystem Expansion:** DONE / VERIFIED / CLOSED — Specialty Cafe, Bakery/Dessert, Fast Casual/QSR, Fine Dining/Hospitality, and Small Menu/Food Truck/Single-Concept are implemented and verified.
3. **G6 — Performance + Media:** TODO / NEXT — evidence-based image/font/JS budgets, media optimization and Core Web Vitals measurement for representative Saudi mobile fixtures.
4. **G7 — Analytics, Search Console, Growth, Rollout:** TODO — acquisition-to-conversion funnel, Search Console measurement, template/branch comparisons, privacy-reviewed analytics and staged rollout.

## G5 Completed Milestones
### Specialty Cafe
- DONE / VERIFIED / CLOSED: dedicated specialty-cafe renderer, routing, `coffee` family contract, and complete quality verification.
- VERIFIED: GitHub Actions quality run `33803091905` passed the complete quality workflow including Browser Template QA.

### Bakery / Dessert
- DONE / VERIFIED / CLOSED: dedicated bakery/dessert renderer, routing, `gallery` family contract, and complete quality verification.
- VERIFIED: GitHub Actions quality run `33803745535` passed the complete quality workflow.

### Fast Casual / QSR
- DONE / VERIFIED / CLOSED: dedicated fast-casual renderer, routing, `fast-casual` family contract, and complete quality verification.
- VERIFIED: GitHub Actions quality run `33804153009` passed the complete quality workflow including Browser Template QA.

### Fine Dining / Hospitality
- DONE / VERIFIED / CLOSED: dedicated fine-dining/hospitality renderer, routing, `dark-dining` / `immersive` family contracts, and complete quality verification.
- VERIFIED: GitHub Actions quality run `33804331728` passed the complete quality workflow including Browser Template QA.

### Small Menu / Food Truck / Single-Concept
- DONE / VERIFIED / CLOSED: `src/components/templates/small-menu.tsx` provides a dedicated focused-menu presentation shell with compact identity, concept-focused hero, active-section count, and language control.
- DONE / VERIFIED / CLOSED: `src/routes/m.$slug.tsx` routes the `small-menu` family to `SmallMenuTemplate` while preserving existing template fallbacks.
- DONE / VERIFIED / CLOSED: `src/lib/theme/registry.test.ts` protects the `minimal` → `small-menu` family mapping.
- DONE / VERIFIED / CLOSED: the renderer reuses `PublicMenuView` for established menu browsing, product details, ordering, locale, analytics, and accessibility behavior.
- DONE / VERIFIED / CLOSED: no database, authorization, tenant-isolation, ordering, or public-data contract was changed.
- VERIFIED: GitHub Actions quality run `33804946380` passed Route tree generation, Typecheck, Tests, Lint, Production build, Playwright Chromium installation, Browser Template QA, and cleanup.

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
- DONE / VERIFIED: G5 Specialty Cafe.
- DONE / VERIFIED: G5 Bakery / Dessert.
- DONE / VERIFIED: G5 Fast Casual / QSR.
- DONE / VERIFIED: G5 Fine Dining / Hospitality.
- DONE / VERIFIED: G5 Small Menu / Food Truck / Single-Concept.
- DONE / VERIFIED: G5 Template Ecosystem Expansion.

## Exact Next Task
- **G6 Performance + Media:** begin with an evidence-based audit of current image, font, JavaScript, caching, and Core Web Vitals behavior before making targeted optimizations. Preserve all G1–G5 contracts and avoid speculative refactors.
