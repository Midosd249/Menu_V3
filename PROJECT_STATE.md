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
- **G6 — Performance + Media is DONE / VERIFIED / CLOSED.**
- Current atomic milestone: **G7 Analytics, Search Console, Growth, Rollout.**

## G6 Performance + Media — DONE / VERIFIED / CLOSED
- **VERIFIED:** `src/components/public-menu.tsx` keeps native lazy loading and now uses asynchronous decoding plus low fetch priority for non-critical product media.
- **VERIFIED:** existing product-media call sites retain explicit rendered dimensions through CSS classes.
- **VERIFIED:** `src/styles.css` retains IBM Plex Sans Arabic with system fallbacks.
- **VERIFIED:** no new runtime image/font dependency was introduced.
- **VERIFIED:** `scripts/performance-audit.mjs` measures navigation timing, LCP availability, CLS, INP support/observations, JS/image/font transfer, media counts, cache indicators, and paint timing.
- **VERIFIED:** `.github/workflows/quality.yml` runs the audit against the existing local production preview and uploads `g6-performance-baseline` for 14 days.
- **VERIFIED:** successful quality run `33812307525` passed typecheck, 76 tests, lint, production build, Playwright setup, browser performance measurement, artifact upload, and mobile/tablet/desktop Browser Template QA.
- **VERIFIED:** captured baseline at 390×844: HTTP 200, FCP 880 ms, CLS 0, 39 resources, JS 16,785 transfer bytes, images 1,465,595 transfer bytes across 6 requests, fonts 0 bytes, 17 document images with 17 lazy-loaded, 0 observable cached resources in the clean CI profile.
- **VERIFIED:** image transfer is the dominant initial transfer class; G6 therefore applied one low-risk client-side scheduling/decoding optimization rather than speculative storage URL rewriting or a new image library.
- **UNKNOWN:** exact production Vercel CDN/cache measurements because provider deployment remains unavailable under the existing `build-rate-limit` condition.
- **UNKNOWN:** future intrinsic image-size savings until a supported production media transformation path is established.
- **BLOCKED:** Vercel provider `build-rate-limit` remains external to the codebase and does not block G6 closure.

## Protected Completed Work
- G1 Public Menu SEO Foundation: DONE / VERIFIED.
- G2 Crawl Control and Indexation: DONE / VERIFIED.
- G3 Saudi Local Discovery + Branch SEO: DONE / VERIFIED / CLOSED.
- G4 Arabic/English SEO Architecture: DONE / VERIFIED / CLOSED.
- G5 Template Ecosystem: DONE / VERIFIED / CLOSED.
- G6 Performance + Media: DONE / VERIFIED / CLOSED.

## Session Log
- 2026-09-04 — Started G6 with repository evidence audit of image, font, JavaScript, and delivery behavior.
- 2026-09-04 — Added and protected the product-image lazy-loading contract.
- 2026-09-04 — Added the reproducible browser performance measurement gate and CI artifact retention.
- 2026-09-04 — Captured the first CI production-preview baseline and identified image transfer as the dominant initial transfer class.
- 2026-09-04 — Applied asynchronous decoding and low fetch priority to non-critical product media; quality pipeline passed.
- 2026-09-04 — Closed G6 after successful CI verification and documented remaining provider-specific unknowns.

## Exact Remaining Work
- **G7:** Analytics, Search Console, Growth, Rollout — TODO.
