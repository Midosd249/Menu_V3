# Platform Growth, Template Ecosystem, and Saudi SEO — Active Plan

## Status and Current Section
- Status: IN_PROGRESS.
- Repository: `Midosd249/Menu_V3`; `main` is the source of truth.
- G1 — Public Menu SEO Foundation: **DONE / VERIFIED**.
- G2 — Crawl Control and Indexation: **DONE / VERIFIED**.
- G3 — Saudi Local Discovery + Branch SEO: **DONE / VERIFIED / CLOSED**.
- G4 — Arabic/English SEO Architecture: **DONE / VERIFIED / CLOSED**.
- G5 — Template Ecosystem Expansion: **DONE / VERIFIED / CLOSED**.
- **Current section:** G6 — Performance + Media.
- **Current atomic milestone:** evidence-based performance audit and first targeted optimization guard.

## G6 — Performance + Media — IN_PROGRESS
### Initial audit
- **VERIFIED:** `src/components/public-menu.tsx` uses native `loading="lazy"` for product media.
- **VERIFIED:** existing product-media call sites provide explicit rendered dimensions through CSS classes.
- **VERIFIED:** `src/styles.css` uses IBM Plex Sans Arabic with system fallbacks.
- **VERIFIED:** no new runtime dependency was introduced for the initial G6 work.
- **VERIFIED:** `scripts/quality-workflow.test.mjs` now protects the product-image lazy-loading contract.
- **VERIFIED:** initial audit is documented in `docs/G6_PERFORMANCE_AUDIT.md`.
- **UNKNOWN:** production font/image/JavaScript transfer sizes, cache behavior, and Core Web Vitals until a reproducible browser measurement is captured.
- **BLOCKED:** Vercel provider build-rate-limit prevents using a provider deployment as the current measurement source; repository CI remains the verification source.

### G6 guardrails
- Preserve G1–G5 contracts.
- Do not add image/font/runtime dependencies without evidence.
- Do not choose hard performance budgets from guesses; establish a baseline first.

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
- G6 — Performance + Media: **IN_PROGRESS**.
- G7 — Analytics, Search Console, Growth, Rollout: TODO.
