# PROJECT_STATE

## Identity
- Status: IN_PROGRESS.
- Repository: `Midosd249/Menu_V3`.
- Source of truth: `main`.
- Product: Menu V3, Arabic-first bilingual multi-tenant digital-menu SaaS for restaurants and cafes.
- Active plan: `PLAN.md` — Platform Growth, Template Ecosystem, and Saudi SEO.
- Superseded plan archive: `PLAN_ARCHIVE_2026-09-03-template-ecosystem.md`.

## Current Position
- T1, T2, and T3 template milestones are DONE / VERIFIED and protected.
- G1 — Public Menu SEO Foundation is DONE / VERIFIED and protected.
- **G2 — Crawl Control and Indexation is DONE / VERIFIED.**
- **G3 — Saudi Local Discovery + Branch SEO is DONE / VERIFIED and CLOSED.**
- **G4 — Arabic/English SEO Architecture is DONE / VERIFIED and CLOSED.**
- **G5 — Template Ecosystem Expansion is IN_PROGRESS.**
- Current atomic milestone: **Small Menu / Food Truck / Single-Concept family renderer + routing integration.**
- Completed G5 families: Specialty Cafe, Bakery / Dessert, Fast Casual / QSR, Fine Dining / Hospitality.

## G5 — Template Ecosystem Expansion — IN_PROGRESS
### Specialty Cafe milestone
- **VERIFIED:** `src/components/templates/specialty-cafe.tsx` provides a dedicated specialty-cafe renderer with a compact cafe hierarchy, barista picks, category navigation, dense menu rows, product detail/modifier selection, cart, and public ordering.
- **VERIFIED:** the renderer is presentation-only and consumes the existing `PublicMenu`, product options, locale, analytics, and ordering contracts.
- **VERIFIED:** `src/routes/m.$slug.tsx` routes the `specialty-cafe` family to `SpecialtyCafeTemplate` while preserving `contemporary-restaurant` and legacy fallback routing.
- **VERIFIED:** `src/lib/theme/registry.test.ts` locks `coffee` to the `specialty-cafe` family.
- **VERIFIED:** GitHub Actions quality run `33803091905` passed route-tree generation, Typecheck, Tests, Lint, Production build, Playwright installation, Browser Template QA, and cleanup.

### Bakery / Dessert milestone
- **VERIFIED:** `src/components/templates/bakery-dessert.tsx` provides a dedicated bakery/dessert presentation shell with an image-led bakery identity layer while preserving the existing public menu, ordering, locale, analytics, and accessibility contracts.
- **VERIFIED:** `src/routes/m.$slug.tsx` routes the `bakery-dessert` family to `BakeryDessertTemplate` while preserving specialty-cafe, contemporary-restaurant, and legacy fallback routing.
- **VERIFIED:** `src/lib/theme/registry.test.ts` locks `gallery` to the `bakery-dessert` family.
- **VERIFIED:** the implementation reuses `PublicMenuView` for the established menu/order behavior instead of duplicating business logic.
- **VERIFIED:** Bakery/Dessert is closed after the complete quality workflow passed in GitHub Actions run `33803745535`.

### Fast Casual / QSR milestone
- **VERIFIED:** `src/components/templates/fast-casual.tsx` provides a dedicated fast-casual renderer with high-contrast identity, rapid search, horizontal category navigation, featured-item grid, dense menu rows, and quick-add affordances.
- **VERIFIED:** `src/routes/m.$slug.tsx` routes the `fast-casual` family to `FastCasualTemplate` while preserving all existing template fallbacks.
- **VERIFIED:** `src/lib/theme/registry.test.ts` locks `fast-casual` to the `fast-casual` family.
- **VERIFIED:** the implementation preserves the existing public menu/data/locale/analytics contracts and does not change authorization or database behavior.
- **VERIFIED:** GitHub Actions run `33804153009` passed route-tree generation, Typecheck, Tests, Lint, Production build, Playwright installation, Browser Template QA, and cleanup.
- **VERIFIED:** the initial route-generation failure was corrected by simplifying the renderer without changing the template-family contract; the corrected run passed every quality gate.

### Fine Dining / Hospitality milestone
- **VERIFIED:** `src/components/templates/fine-dining-hospitality.tsx` provides a dedicated dark, editorial hospitality renderer with immersive identity, branch context, chef-signature presentation, and a premium visual entry into the existing menu.
- **VERIFIED:** `src/routes/m.$slug.tsx` routes the `fine-dining-hospitality` family to `FineDiningHospitalityTemplate` while preserving all existing template fallbacks.
- **VERIFIED:** `src/lib/theme/registry.test.ts` locks both `dark-dining` and `immersive` to the `fine-dining-hospitality` family.
- **VERIFIED:** the renderer reuses `PublicMenuView` for established menu/order/data behavior and introduces no new database or authorization path.
- **VERIFIED:** GitHub Actions run `33804331728` passed route-tree generation, Typecheck, Tests, Lint, Production build, Playwright installation, Browser Template QA, and cleanup.

## G4 — Arabic/English SEO Architecture — CLOSED
### Implementation
- **VERIFIED:** public menu search validation accepts only `ar` or `en` locale values.
- **VERIFIED:** locale resolution is data-driven and falls back to Arabic when the English variant is not actually available.
- **VERIFIED:** English public variants use `?lang=en`; Arabic remains the default canonical path.
- **VERIFIED:** available English variants emit reciprocal absolute `hreflang` links for `ar` and `en`.
- **VERIFIED:** unavailable English variants emit no fabricated alternate links and are `noindex, follow` while resolving to the Arabic canonical.
- **VERIFIED:** titles, descriptions, Open Graph locale, canonical URL, and Restaurant schema follow the effective locale.
- **VERIFIED:** public language switching updates only the locale query parameter and preserves existing search state.
- **VERIFIED:** parent menu routes suppress duplicate head metadata when a branch child owns the canonical route.
- **VERIFIED:** `src/lib/menu/seo.test.ts` covers locale availability, resolution, reciprocal alternates, missing English data, Saudi local SEO, and missing-menu noindex behavior.
- **VERIFIED:** the G4 TypeScript regression in `src/components/lang-toggle.tsx` was fixed and the resulting CI run passed.

## Protected Completed Work
- Level 0: DONE / VERIFIED.
- Level 1: DONE / VERIFIED.
- Level 2: IMPLEMENTED / historical partial verification; do not rebuild.
- Level 3: DONE / VERIFIED.
- Team invitation lifecycle: DONE / VERIFIED.
- Durable roles and branch scope: DONE / VERIFIED.
- Client onboarding idempotency: DONE / VERIFIED.
- Subscription foundation and entitlement enforcement: DONE / VERIFIED.
- Repository agent contract: DONE / VERIFIED.
- T1 template architecture contract: DONE / VERIFIED.
- T2 shared semantic menu presentation primitives: DONE / VERIFIED.
- T3 flagship template: DONE / VERIFIED.
- G1 Public Menu SEO Foundation: DONE / VERIFIED.
- G2 Crawl Control and Indexation: DONE / VERIFIED.
- G3 Saudi Local Discovery + Branch SEO: DONE / VERIFIED.
- G4 Arabic/English SEO Architecture: DONE / VERIFIED.
- G5 Specialty Cafe: DONE / VERIFIED / CLOSED.
- G5 Bakery / Dessert: DONE / VERIFIED / CLOSED.
- G5 Fast Casual / QSR: DONE / VERIFIED / CLOSED.
- G5 Fine Dining / Hospitality: DONE / VERIFIED / CLOSED.

## Known Issues / Risks
- **UNKNOWN:** production canonical origin for JSON-LD remains relative because no verified application-level canonical public origin has been configured.
- **UNKNOWN:** Search Console/indexation state until separately inspected.
- **BLOCKED:** Vercel provider build-rate-limit may prevent a provider deployment for recent G5 commits; repository CI remains the primary verification source until the provider accepts a build.
- Existing lint warnings remain but are not errors and were not introduced by G4 or the G5 template milestones.

## Session Log
- 2026-09-03 — Resumed G5 from repository evidence after closing G4.
- 2026-09-03 — Implemented dedicated Specialty Cafe template renderer with compact cafe hierarchy, barista picks, category navigation, product details/modifiers, cart, and public ordering.
- 2026-09-03 — Integrated `specialty-cafe` family routing and protected the `coffee` → `specialty-cafe` family contract.
- 2026-09-03 — GitHub Actions quality run `33803091905` passed the complete quality workflow for Specialty Cafe.
- 2026-09-03 — Implemented Bakery/Dessert presentation shell, routed `bakery-dessert` to it, protected the `gallery` → `bakery-dessert` family contract, and closed the milestone after successful quality verification.
- 2026-09-03 — Implemented Fast Casual/QSR renderer, integrated family routing, protected the `fast-casual` contract, corrected the initial route-generation issue, and closed the milestone after quality run `33804153009` passed all gates.
- 2026-09-03 — Implemented Fine Dining/Hospitality renderer, integrated family routing, protected `dark-dining` and `immersive` family contracts, and closed the milestone after quality run `33804331728` passed all gates.

## Exact Remaining Work
- **G5 remaining family:** Small Menu / Food Truck / Single-Concept remains TODO.
- **G6:** Performance + Media remains TODO.
- **G7:** Analytics, Search Console, Growth, Rollout remains TODO.
