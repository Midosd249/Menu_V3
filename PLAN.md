# Platform Growth, Template Ecosystem, and Saudi SEO — Active Plan

## Status and Current Section
- Status: IN_PROGRESS.
- Repository: `Midosd249/Menu_V3`; `main` is the source of truth.
- G1 — Public Menu SEO Foundation: **DONE / VERIFIED**.
- G2 — Crawl Control and Indexation: **DONE / VERIFIED**.
- G3 — Saudi Local Discovery + Branch SEO: **DONE / VERIFIED / CLOSED**.
- G4 — Arabic/English SEO Architecture: **DONE / VERIFIED / CLOSED**.
- **Current section:** G6 — Performance + Media.
- **Current atomic milestone:** evidence-based performance audit and first targeted optimization.

## G5 — Template Ecosystem Expansion — DONE / VERIFIED / CLOSED
### Specialty Cafe milestone
- **DONE / VERIFIED / CLOSED:** dedicated specialty-cafe renderer with cafe-specific hierarchy, barista picks, compact navigation, product details/modifiers, cart, and public ordering.
- **DONE / VERIFIED / CLOSED:** `specialty-cafe` routing and `coffee` family regression contract.
- **VERIFIED:** GitHub Actions quality run `33803091905` passed the complete quality workflow including Browser Template QA.

### Bakery / Dessert milestone
- **DONE / VERIFIED / CLOSED:** `src/components/templates/bakery-dessert.tsx` provides a dedicated bakery/dessert presentation shell with image-led bakery identity while preserving the established public-menu behavior.
- **DONE / VERIFIED / CLOSED:** `src/routes/m.$slug.tsx` routes the `bakery-dessert` family to `BakeryDessertTemplate`.
- **DONE / VERIFIED / CLOSED:** `src/lib/theme/registry.test.ts` protects the `gallery` → `bakery-dessert` family mapping.
- **VERIFIED:** GitHub Actions quality run `33803745535` passed the complete quality workflow.

### Fast Casual / QSR milestone
- **DONE / VERIFIED / CLOSED:** dedicated fast-casual renderer, routing, family regression contract, and complete quality verification.
- **VERIFIED:** GitHub Actions quality run `33804153009` passed the complete quality workflow including Browser Template QA.

### Fine Dining / Hospitality milestone
- **DONE / VERIFIED / CLOSED:** dedicated dark editorial hospitality renderer, routing, `dark-dining` / `immersive` family contracts, and complete quality verification.
- **VERIFIED:** GitHub Actions quality run `33804331728` passed the complete quality workflow including Browser Template QA.

### Small Menu / Food Truck / Single-Concept milestone
- **DONE / VERIFIED / CLOSED:** `src/components/templates/small-menu.tsx` provides a dedicated focused-menu presentation shell with compact identity, concept-focused hero, active-section count, and language control.
- **DONE / VERIFIED / CLOSED:** `src/routes/m.$slug.tsx` routes the `small-menu` family to `SmallMenuTemplate` while preserving existing template fallbacks.
- **DONE / VERIFIED / CLOSED:** `src/lib/theme/registry.test.ts` protects the `minimal` → `small-menu` family mapping.
- **DONE / VERIFIED / CLOSED:** `PublicMenuView` remains the source of truth for menu browsing, product details, ordering, locale, analytics, and accessibility behavior.
- **DONE / VERIFIED / CLOSED:** no database, authorization, tenant-isolation, ordering, or public-data contract was changed.
- **VERIFIED:** final GitHub Actions quality run `33804946380` passed Route tree generation, Typecheck, Tests, Lint, Production build, Playwright Chromium installation, Browser Template QA, and cleanup.

## G1 — Public Menu SEO Foundation — CLOSED
- Existing implementation and evidence remain protected; do not rebuild.

## G2 — Crawl Control and Indexation — CLOSED
- Existing implementation and evidence remain protected; do not rebuild.

## G3 — Saudi Local Discovery + Branch SEO — CLOSED
- Existing implementation and evidence remain protected; do not rebuild.

## G4 — Arabic/English SEO Architecture — CLOSED
- Existing implementation and evidence remain protected; do not rebuild.

## Research / Design Sources
- **VERIFIED:** Google Search Central LocalBusiness guidance: https://developers.google.com/search/docs/appearance/structured-data/local-business
- **VERIFIED:** Google Search Central canonicalization guidance: https://developers.google.com/search/docs/crawling-indexing/canonicalization
- **VERIFIED:** Google Search Central canonical implementation guidance: https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls
- **VERIFIED:** Google Search Central localized versions guidance: https://developers.google.com/search/docs/specialty/international/localized-versions
- **VERIFIED:** template-system strategy in `docs/template-system-strategy.md` defines six behavioral families and requires presentation/data separation, RTL/mobile support, accessibility, performance, and visual regression gates.

## Unified milestones
- G1 — Public Menu SEO Foundation: **DONE / VERIFIED**.
- G2 — Crawl Control and Indexation: **DONE / VERIFIED**.
- G3 — Saudi Local Discovery + Branch SEO: **DONE / VERIFIED / CLOSED**.
- G4 — Arabic/English SEO Architecture: **DONE / VERIFIED / CLOSED**.
- G5 — Template Ecosystem Expansion: **DONE / VERIFIED / CLOSED**.
- G6 — Performance + Media: **IN_PROGRESS / NEXT**.
- G7 — Analytics, Search Console, Growth, Rollout: TODO.
