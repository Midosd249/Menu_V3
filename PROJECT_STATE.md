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
- **G7 — Analytics, Search Console, Growth, Rollout is IN_PROGRESS.**
- **G7 audit task is DONE / VERIFIED:** existing analytics, event collection, SEO/crawl surfaces, Search Console presence, and growth surfaces were audited from repository evidence.
- **G7.1 is the exact next atomic task:** production analytics integrity hardening.

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

## G7 Audit Evidence — DONE / VERIFIED
- **VERIFIED:** `src/routes/studio/analytics.tsx` exposes authenticated owner analytics for 7/30-day ranges, visits, sessions, product views, QR scans, WhatsApp clicks, language split, daily series, top products, and category rankings.
- **VERIFIED:** `src/lib/menu/owner.ts` implements `getOwnerAnalytics` behind `authMiddleware` and scopes analytics queries to the authenticated tenant membership.
- **VERIFIED:** `migrations/0002_menu_v3.sql` defines `menu_events` and tenant/session indexes.
- **VERIFIED:** `src/lib/menu/public.ts` validates and records `visit`, `product_view`, `qr_scan`, and `whatsapp` events, with publication/activity checks and recent duplicate suppression for visits/QR scans.
- **VERIFIED:** `src/components/public-menu.tsx` emits public visit/QR/product-view events and excludes owner preview mode from analytics.
- **VERIFIED:** `src/lib/menu/seo.ts` and `src/lib/seo/crawl.ts` retain the existing SEO/crawl contracts from completed G1–G4 work.
- **VERIFIED:** no Google Search Console integration or verification-token configuration is present in the repository tree.
- **VERIFIED:** no separate growth automation surface is present beyond existing leads, analytics, and SEO capabilities.
- **VERIFIED:** latest audited repository commit before this state update was `a45c18bc6dd4164903d745e71778e599e617a47f`; this audit then produced documentation commits on `main`.
- **UNKNOWN:** production Search Console ownership/indexation data and final production domain are not evidenced by repository data.
- **BLOCKED:** Vercel provider `build-rate-limit` remains external to the codebase.

## Protected Completed Work
- G1 Public Menu SEO Foundation: DONE / VERIFIED.
- G2 Crawl Control and Indexation: DONE / VERIFIED.
- G3 Saudi Local Discovery + Branch SEO: DONE / VERIFIED / CLOSED.
- G4 Arabic/English SEO Architecture: DONE / VERIFIED / CLOSED.
- G5 Template Ecosystem: DONE / VERIFIED / CLOSED.
- G6 Performance + Media: DONE / VERIFIED / CLOSED.

## Session Log
- 2026-09-04 — Resumed Menu V3 from `main` and audited repository continuity files, latest history, source tree, analytics, SEO/crawl, migrations, and CI/deployment evidence.
- 2026-09-04 — Confirmed G6 remains closed/protected and identified G7 as the next milestone without reopening completed work.
- 2026-09-04 — Audited existing G7 analytics/event collection and confirmed the owner analytics surface is already implemented and tenant-scoped.
- 2026-09-04 — Confirmed Search Console and growth automation integrations are not present in the repository; recorded production-domain/Search Console state as UNKNOWN rather than guessing.
- 2026-09-04 — Completed the G7 audit task and selected G7.1 production analytics integrity hardening as the single next atomic task.
- 2026-09-04 — Updated `PLAN.md` and `TASKS.md` with the G7 audit evidence, guardrails, and exact next task.

## Exact Remaining Work
- **G7.1 — Production analytics integrity hardening:** add focused regression coverage for tenant isolation, invalid product handling, duplicate visit/QR suppression, and the 7/30-day range behavior without changing the existing event model or adding dependencies.
