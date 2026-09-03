# PROJECT_STATE

## Identity
- Status: IN_PROGRESS.
- Repository: `Midosd249/Menu_V3`.
- Source of truth: `main`.
- Product: Menu V3, Arabic-first bilingual multi-tenant digital-menu SaaS for restaurants and cafes.
- Active plan: `PLAN.md` — Platform Growth, Template Ecosystem, and Saudi SEO.

## Current Position
- T1, T2, and T3 template milestones are DONE / VERIFIED and protected.
- **G1 — Public Menu SEO Foundation is DONE / VERIFIED.**
- **G2 — Crawl Control and Indexation is DONE / VERIFIED.**
- **G3 — Saudi Local Discovery + Branch SEO is DONE / VERIFIED and CLOSED.**
- **G4 — Arabic/English SEO Architecture is DONE / VERIFIED and CLOSED.**
- **G5 — Template Ecosystem Expansion is DONE / VERIFIED and CLOSED.**
- **G6 — Performance + Media is IN_PROGRESS.**
- Current atomic milestone: **G6 initial evidence-based performance audit + first targeted optimization guard.**

## G6 Initial Audit — IN_PROGRESS
- **VERIFIED:** `src/components/public-menu.tsx` uses native `loading="lazy"` for product media.
- **VERIFIED:** existing product-media call sites provide explicit rendered dimensions through CSS classes.
- **VERIFIED:** `src/styles.css` uses IBM Plex Sans Arabic with system fallbacks.
- **VERIFIED:** no new runtime dependency was introduced for the initial G6 work.
- **VERIFIED:** `scripts/quality-workflow.test.mjs` now protects the product-image lazy-loading contract.
- **VERIFIED:** `docs/G6_PERFORMANCE_AUDIT.md` records the evidence, unknowns, guardrails, and measurement gate.
- **UNKNOWN:** production font/image/JavaScript transfer sizes, cache behavior, and Core Web Vitals until a reproducible browser measurement is captured.
- **BLOCKED:** Vercel provider build-rate-limit prevents using a provider deployment as the current measurement source; repository CI remains the current verification source.

## Protected Completed Work
- G1 Public Menu SEO Foundation: DONE / VERIFIED.
- G2 Crawl Control and Indexation: DONE / VERIFIED.
- G3 Saudi Local Discovery + Branch SEO: DONE / VERIFIED.
- G4 Arabic/English SEO Architecture: DONE / VERIFIED.
- G5 Template Ecosystem: DONE / VERIFIED / CLOSED.

## Session Log
- 2026-09-04 — Started G6 with repository evidence audit of image, font, JavaScript, and delivery behavior.
- 2026-09-04 — Added a regression guard protecting below-the-fold product image lazy-loading.
- 2026-09-04 — Added `docs/G6_PERFORMANCE_AUDIT.md` and recorded the next measurement gate.

## Exact Remaining Work
- **G6:** build the reproducible browser performance measurement gate against the local production preview, then use the measured baseline to target the highest-impact bottleneck.
- **G7:** TODO.
