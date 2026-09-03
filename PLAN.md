# Platform Growth, Template Ecosystem, and Saudi SEO — Active Plan

## Status and Current Section
- Status: IN_PROGRESS.
- Repository: `Midosd249/Menu_V3`; `main` is the source of truth.
- G1 — Public Menu SEO Foundation: **DONE / VERIFIED**.
- G2 — Crawl Control and Indexation: **DONE / VERIFIED**.
- G3 — Saudi Local Discovery + Branch SEO: **DONE / VERIFIED / CLOSED**.
- G4 — Arabic/English SEO Architecture: **DONE / VERIFIED / CLOSED**.
- **Current section:** G5 — Template Ecosystem Expansion.
- **Current atomic milestone:** Specialty Cafe family renderer + routing integration.

## G5 — Template Ecosystem Expansion — IN_PROGRESS
### Specialty Cafe milestone
- **Objective:** introduce the first genuinely distinct template family without changing the canonical menu data model, ordering semantics, tenant isolation, locale behavior, or existing theme compatibility.
- **VERIFIED:** `src/components/templates/specialty-cafe.tsx` is a dedicated renderer with cafe-specific information hierarchy: brand header, barista picks, compact category navigation, dense product rows, product details/modifiers, cart, and public ordering.
- **VERIFIED:** the renderer consumes the existing `PublicMenu` and `ProductOptions` contracts and reuses existing analytics and public-order services.
- **VERIFIED:** `src/routes/m.$slug.tsx` routes the `specialty-cafe` family to the dedicated renderer while preserving the contemporary renderer and legacy public-menu fallback.
- **VERIFIED:** `src/lib/theme/registry.test.ts` protects the `coffee` → `specialty-cafe` family mapping.
- **VERIFIED:** GitHub Actions run `33802971758` passed route-tree generation, Typecheck, Tests, Lint, and Production build for the G5 implementation commit; Playwright installation and Browser Template QA were still running at the time of this documentation update.
- **IN_PROGRESS:** complete Browser Template QA and inspect the final diff before closing this milestone.
- **BLOCKED:** Vercel currently reports provider `build-rate-limit` for the G5 implementation commit; no source workaround is appropriate.

### Remaining G5 families
- TODO: Bakery / Dessert.
- TODO: Fast Casual / QSR.
- TODO: Fine Dining / Hospitality.
- TODO: Small Menu / Food Truck / Single-Concept.

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
- G5 — Template Ecosystem Expansion: **IN_PROGRESS**.
- G6 — Performance + Media: TODO.
- G7 — Analytics, Search Console, Growth, Rollout: TODO.
