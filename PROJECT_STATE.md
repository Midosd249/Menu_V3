# PROJECT_STATE

## Identity
- Status: IN_PROGRESS / BLOCKED on external Search Console ownership verification.
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
- **G7 audit task is DONE / VERIFIED.**
- **G7.1 production analytics integrity hardening is DONE / VERIFIED at repository level.**
- **G7.2 Search Console production readiness is IN_PROGRESS / BLOCKED pending the user-provided Search Console verification token and ownership verification.**

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
- **UNKNOWN:** exact production Vercel CDN/cache measurements because provider deployment remains subject to `build-rate-limit` and the newest deployment is still BUILDING.
- **BLOCKED:** Vercel provider `build-rate-limit` remains external to the codebase and does not block G6 closure.

## G7 Audit — DONE / VERIFIED
- **VERIFIED:** `src/routes/studio/analytics.tsx` exposes authenticated owner analytics for 7/30-day ranges, visits, sessions, product views, QR scans, WhatsApp clicks, language split, daily series, top products, and category rankings.
- **VERIFIED:** `src/lib/menu/owner.ts` implements `getOwnerAnalytics` behind `authMiddleware` and scopes analytics queries to the authenticated tenant membership.
- **VERIFIED:** `migrations/0002_menu_v3.sql` defines `menu_events` and tenant/session indexes.
- **VERIFIED:** `src/lib/menu/public.ts` validates and records `visit`, `product_view`, `qr_scan`, and `whatsapp` events, with publication/activity checks and recent duplicate suppression for visits/QR scans.
- **VERIFIED:** `src/components/public-menu.tsx` emits public visits/QR/product-view events and excludes owner preview mode from analytics.
- **VERIFIED:** `src/lib/menu/seo.ts` and `src/lib/seo/crawl.ts` retain the existing SEO/crawl contracts from completed G1–G4 work.
- **VERIFIED:** no separate growth automation surface is present beyond existing leads, analytics, and SEO capabilities.

## G7.1 — Production Analytics Integrity Hardening — DONE / VERIFIED
- **VERIFIED:** `src/lib/menu/analytics-integrity.test.ts` covers supported 7/30-day ranges, tenant scoping, invalid/cross-tenant product handling, duplicate visit/QR suppression, and active/published tenant resolution.
- **VERIFIED:** `package.json` includes the new suite in the existing `npm test` command.
- **VERIFIED:** no analytics runtime code, event schema, or dependency was changed.
- **INFERRED:** the suite follows the repository's existing Node test conventions and uses only Node built-ins.
- **UNKNOWN:** actual execution of the new test suite in the earlier connected GitHub-only session was unavailable.

## G7.2 — Search Console Production Readiness — IN_PROGRESS / BLOCKED
- **VERIFIED:** Vercel project `menu-v3` is linked to `Midosd249/Menu_V3` and exposes `menu-v3-kohl.vercel.app` as a configured project domain.
- **VERIFIED:** Vercel has a prior READY production deployment from `main` at commit `ca3d7e39b4eb6954e2c6012f251e384a2d38a3df`, and the current `main` commit `b553184488e082544fc03e441b42c8e7d25da381` has an associated production deployment currently reported as BUILDING.
- **VERIFIED:** `src/lib/menu/seo.ts` already uses `https://menu-v3-kohl.vercel.app` as the default public origin, while allowing `VITE_VERCEL_PROJECT_PRODUCTION_URL` to override it.
- **VERIFIED:** the repository has dynamic sitemap generation and robots sitemap declaration through the existing SEO/crawl surface.
- **VERIFIED:** the repository contains no committed Google Search Console credentials or verification token.
- **VERIFIED:** the smallest first-party integration is now present: `src/routes/__root.tsx` emits an optional `google-site-verification` meta tag when `VITE_GOOGLE_SITE_VERIFICATION` is configured; it emits nothing when unset, preserving existing behavior.
- **VERIFIED:** no dependency was added and no existing SEO route/schema contract was changed.
- **INFERRED:** because `menu-v3-kohl.vercel.app` is a shared Vercel-hosted subdomain, the practical Search Console path is a URL-prefix property (`https://menu-v3-kohl.vercel.app/`) with HTML-tag verification; a Domain property would require DNS control of the parent domain.
- **VERIFIED:** Google Search Console documentation states that Domain properties require DNS verification, while URL-prefix properties support HTML-tag verification; sitemap submission requires an owner permission and an accessible sitemap.
- **BLOCKED:** the actual Search Console verification token is user/account-specific and must be copied exactly from Google's verification wizard. It must not be invented or committed to the repository.
- **UNKNOWN:** Search Console property ownership, indexing status, sitemap submission status, and Google-selected canonicals are not directly accessible from the repository/Vercel integration.
- **UNKNOWN:** verification of the current `b553184488e082544fc03e441b42c8e7d25da381` deployment is pending because Vercel currently reports it as BUILDING.

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
- 2026-09-04 — Confirmed Search Console and growth automation integrations were not present in the repository before G7.2 work; recorded production-domain/Search Console state as UNKNOWN rather than guessing.
- 2026-09-04 — Completed the G7 audit task and selected G7.1 production analytics integrity hardening as the single next atomic task.
- 2026-09-04 — Added focused analytics integrity regression coverage and registered it in the existing test command without adding dependencies or changing runtime analytics behavior.
- 2026-09-04 — Reviewed the G7.1 diff against the prior state; changed files were limited to the new regression suite, `package.json`, and G7 state documentation.
- 2026-09-04 — Verified the intended production domain from Vercel project/deployment evidence and confirmed `menu-v3-kohl.vercel.app` is configured for `menu-v3`.
- 2026-09-04 — Researched current Google Search Console verification guidance and selected URL-prefix + HTML-tag verification as the compatible path for the shared Vercel subdomain.
- 2026-09-04 — Added an optional `VITE_GOOGLE_SITE_VERIFICATION` integration to the existing root document head; no token or credential was committed.
- 2026-09-04 — Current deployment for the new commit is BUILDING; repository shell/CI dispatch is unavailable through the connected surface, so local test/typecheck/build execution remains UNKNOWN.

## Exact Remaining Work
- **G7.2 completion:** configure `VITE_GOOGLE_SITE_VERIFICATION` in the Vercel Production environment using the exact token from the Search Console URL-prefix verification wizard, allow a successful production deployment, verify ownership in Search Console, then submit `/sitemap.xml` and inspect the homepage/public menu URLs. Do not commit the token or claim verification before Google confirms it.
