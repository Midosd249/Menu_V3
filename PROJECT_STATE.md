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
- **G1 — Public Menu SEO Foundation is DONE / VERIFIED.**
- **G2 — Crawl Control and Indexation is DONE / VERIFIED.**
- **G3 — Saudi Local Discovery + Branch SEO is DONE / VERIFIED and CLOSED.**
- **G4 — Arabic/English SEO Architecture is DONE / VERIFIED and CLOSED.**
- **G5 — Template Ecosystem Expansion is DONE / VERIFIED and CLOSED.**
- Current atomic milestone: **G6 — Performance + Media.**
- Completed G5 families: Specialty Cafe, Bakery / Dessert, Fast Casual / QSR, Fine Dining / Hospitality, Small Menu / Food Truck / Single-Concept.

## G5 — Template Ecosystem Expansion — CLOSED
### Specialty Cafe
- **VERIFIED / CLOSED:** dedicated specialty-cafe renderer, routing, family contract, and complete quality verification.
- **VERIFIED:** GitHub Actions quality run `33803091905` passed all gates including Browser Template QA.

### Bakery / Dessert
- **VERIFIED / CLOSED:** dedicated bakery/dessert renderer, routing, family contract, and complete quality verification.
- **VERIFIED:** GitHub Actions quality run `33803745535` passed all gates.

### Fast Casual / QSR
- **VERIFIED / CLOSED:** dedicated fast-casual renderer, routing, family contract, and complete quality verification.
- **VERIFIED:** GitHub Actions quality run `33804153009` passed all gates including Browser Template QA.

### Fine Dining / Hospitality
- **VERIFIED / CLOSED:** dedicated dark editorial hospitality renderer, routing, family contracts, and complete quality verification.
- **VERIFIED:** GitHub Actions quality run `33804331728` passed all gates including Browser Template QA.

### Small Menu / Food Truck / Single-Concept
- **VERIFIED / CLOSED:** `src/components/templates/small-menu.tsx` provides a dedicated focused-menu presentation shell with compact identity, concept-focused hero, active-section count, and language control.
- **VERIFIED / CLOSED:** `src/routes/m.$slug.tsx` routes the `small-menu` family to `SmallMenuTemplate` while preserving existing template fallbacks.
- **VERIFIED / CLOSED:** `src/lib/theme/registry.test.ts` locks `minimal` to the `small-menu` family.
- **VERIFIED / CLOSED:** `PublicMenuView` remains the source of truth for menu browsing, product details, ordering, locale, analytics, and accessibility behavior.
- **VERIFIED / CLOSED:** no database, authorization, tenant-isolation, ordering, or public-data contract was changed.
- **VERIFIED:** final GitHub Actions quality run `33804946380` passed Route tree generation, Typecheck, Tests, Lint, Production build, Playwright Chromium installation, Browser Template QA, and cleanup.

## G4 — Arabic/English SEO Architecture — CLOSED
- Existing implementation and verification evidence remain protected; do not rebuild.

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
- G5 Template Ecosystem: DONE / VERIFIED / CLOSED.

## Known Issues / Risks
- **UNKNOWN:** production canonical origin for JSON-LD remains relative because no verified application-level canonical public origin has been configured.
- **UNKNOWN:** Search Console/indexation state until separately inspected.
- **BLOCKED:** Vercel provider build-rate-limit may prevent provider deployments for recent commits; repository CI remains the verification source until the provider accepts a build.
- Existing lint warnings remain but are not errors and were not introduced by G5.

## Session Log
- 2026-09-03 — Implemented the final Small Menu / Food Truck / Single-Concept renderer, integrated routing, and protected the `minimal` → `small-menu` family contract.
- 2026-09-03 — Identified and corrected the Small Menu TypeScript issue (`Branch` has no `city`; header now uses `tenant.city`).
- 2026-09-03 — Final G5 quality run `33804946380` passed every quality gate.
- 2026-09-03 — Closed G5 after final verification across all six template families.

## Exact Remaining Work
- **G5:** DONE / VERIFIED / CLOSED.
- **G6:** Performance + Media — TODO / NEXT.
- **G7:** Analytics, Search Console, Growth, Rollout — TODO.
