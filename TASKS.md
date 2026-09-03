# TASKS

## Current Section
- **G5 — Template Ecosystem Expansion: IN_PROGRESS.** Current atomic milestone: Small Menu / Food Truck / Single-Concept family renderer + routing integration.

## Unified Queue
1. **G4 — Arabic/English SEO Architecture:** DONE / VERIFIED / CLOSED — real URL-level locale variants with native metadata, reciprocal hreflang, and correct `lang`/`dir` behavior without fabricated translations.
2. **G5 — Template Ecosystem Expansion:** IN_PROGRESS — Specialty Cafe, Bakery/Dessert, Fast Casual/QSR, and Fine Dining/Hospitality are closed; Small Menu / Food Truck / Single-Concept is the final remaining G5 family.
3. **G6 — Performance + Media:** TODO — evidence-based image/font/JS budgets, media optimization and Core Web Vitals measurement for representative Saudi mobile fixtures.
4. **G7 — Analytics, Search Console, Growth, Rollout:** TODO — acquisition-to-conversion funnel, Search Console measurement, template/branch comparisons, privacy-reviewed analytics and staged rollout.

## G5 Completed Milestones
### Specialty Cafe
- DONE / VERIFIED / CLOSED: `src/components/templates/specialty-cafe.tsx` provides a dedicated specialty-cafe renderer with compact cafe hierarchy, barista picks, category navigation, dense product rows, product details/modifiers, cart, and public ordering.
- DONE / VERIFIED / CLOSED: `src/routes/m.$slug.tsx` routes the `specialty-cafe` family to `SpecialtyCafeTemplate` and preserves existing contemporary and fallback renderers.
- DONE / VERIFIED / CLOSED: `src/lib/theme/registry.test.ts` protects the `coffee` → `specialty-cafe` family mapping.
- VERIFIED: GitHub Actions quality run `33803091905` passed the complete quality workflow including Browser Template QA.

### Bakery / Dessert
- DONE / VERIFIED / CLOSED: `src/components/templates/bakery-dessert.tsx` provides a dedicated bakery/dessert presentation shell with an image-led bakery identity layer.
- DONE / VERIFIED / CLOSED: `src/routes/m.$slug.tsx` routes the `bakery-dessert` family to `BakeryDessertTemplate`.
- DONE / VERIFIED / CLOSED: `src/lib/theme/registry.test.ts` protects the `gallery` → `bakery-dessert` family mapping.
- DONE / VERIFIED / CLOSED: the renderer reuses `PublicMenuView` for established menu, ordering, locale, analytics, and accessibility behavior instead of duplicating business logic.

### Fast Casual / QSR
- DONE / VERIFIED / CLOSED: `src/components/templates/fast-casual.tsx` provides a dedicated fast-casual renderer with high-contrast identity, rapid search, category navigation, featured items, dense menu rows, and quick-add affordances.
- DONE / VERIFIED / CLOSED: `src/routes/m.$slug.tsx` routes the `fast-casual` family to `FastCasualTemplate` while preserving existing fallback behavior.
- DONE / VERIFIED / CLOSED: `src/lib/theme/registry.test.ts` protects the `fast-casual` family mapping.
- VERIFIED: GitHub Actions quality run `33804153009` passed route-tree generation, Typecheck, Tests, Lint, Production build, Playwright installation, Browser Template QA, and cleanup.

### Fine Dining / Hospitality
- DONE / VERIFIED / CLOSED: `src/components/templates/fine-dining-hospitality.tsx` provides a dedicated dark editorial hospitality renderer with immersive identity, branch context, and chef-signature presentation.
- DONE / VERIFIED / CLOSED: `src/routes/m.$slug.tsx` routes the `fine-dining-hospitality` family to `FineDiningHospitalityTemplate` while preserving existing fallback behavior.
- DONE / VERIFIED / CLOSED: `src/lib/theme/registry.test.ts` protects both `dark-dining` and `immersive` mappings.
- VERIFIED: GitHub Actions quality run `33804331728` passed route-tree generation, Typecheck, Tests, Lint, Production build, Playwright installation, Browser Template QA, and cleanup.

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

## Exact Next Task
- **G5 Small Menu / Food Truck / Single-Concept:** implement the final dedicated family renderer and route it from the existing `small-menu` family contract, preserving existing data, ordering, locale, analytics, tenant isolation, and fallback behavior. Verify with Typecheck, Tests, Lint, Production build, and Browser Template QA before closing G5.
