# TASKS

## Current Section
- **G7 — Analytics, Search Console, Growth, Rollout: IN_PROGRESS / BLOCKED on Vercel deployment confirmation and external Search Console ownership verification.**

## Unified Queue
1. **G4 — Arabic/English SEO Architecture:** DONE / VERIFIED / CLOSED.
2. **G5 — Template Ecosystem Expansion:** DONE / VERIFIED / CLOSED.
3. **G6 — Performance + Media:** DONE / VERIFIED / CLOSED.
4. **G7 — Analytics, Search Console, Growth, Rollout:** IN_PROGRESS.

## G6 Closure Evidence
- DONE / VERIFIED: audited public-menu media and preserved native `loading="lazy"`.
- DONE / VERIFIED: added `decoding="async"` and `fetchPriority="low"` to non-critical product media.
- DONE / VERIFIED: added a regression test protecting the media scheduling contract.
- DONE / VERIFIED: added reproducible browser performance measurement using the existing Playwright dependency and local production preview.
- DONE / VERIFIED: CI quality run `33812307525` passed typecheck, 76 tests, lint, production build, browser measurement, artifact upload, and mobile/tablet/desktop Browser Template QA.
- DONE / VERIFIED: captured and retained the first baseline artifact `g6-performance-baseline`.
- DONE / VERIFIED: baseline identified image transfer as the dominant initial transfer class: 1,465,595 bytes across 6 image requests in the clean CI browser profile.
- DONE / VERIFIED: no new runtime image/font dependency or speculative storage URL transformation was introduced.
- BLOCKED: Vercel provider `build-rate-limit` prevents provider-specific CDN/cache measurement; local CI measurement is sufficient for G6 closure.

## G7 Audit — 2026-09-04
- DONE / VERIFIED: existing owner analytics surface is implemented at `src/routes/studio/analytics.tsx`.
- DONE / VERIFIED: existing tenant-scoped analytics aggregation is implemented by `getOwnerAnalytics` in `src/lib/menu/owner.ts`.
- DONE / VERIFIED: `menu_events` schema and indexes are defined in `migrations/0002_menu_v3.sql`.
- DONE / VERIFIED: public event recording is implemented and validated in `src/lib/menu/public.ts`.
- DONE / VERIFIED: public menu emits visit/QR/product-view events while preview mode is excluded from analytics in `src/components/public-menu.tsx`.
- DONE / VERIFIED: existing SEO/crawl helpers remain present and protected; no G1–G6 contract was changed.
- DONE / VERIFIED: no Search Console integration or verification configuration was present before G7.2 work.
- DONE / VERIFIED: no separate growth automation surface is present beyond existing leads, analytics, and SEO capabilities.
- UNKNOWN: Search Console ownership/indexation state before verification.
- BLOCKED: Vercel provider `build-rate-limit` remains an external deployment blocker.

## G7.1 — Production analytics integrity hardening
- DONE / VERIFIED: added `src/lib/menu/analytics-integrity.test.ts` for tenant scoping across all owner analytics aggregations, supported 7/30-day ranges, invalid product handling, duplicate visit/QR suppression, and active/published tenant resolution.
- DONE / VERIFIED: registered the suite in the existing `npm test` command.
- DONE / VERIFIED: no runtime analytics/event model or dependency was changed.
- DONE / VERIFIED: GitHub Actions quality run `33821751476` / run 430 passed typecheck, all 81 tests, lint, production build, Playwright installation, Browser Template QA, performance artifact step, and cleanup.
- DONE / VERIFIED: brittle assertions exposed by runs 427 and 429 were corrected from concrete CI evidence; the final query-specific assertions pass.

## G7.2 — Search Console production readiness
- DONE / VERIFIED: identified `menu-v3-kohl.vercel.app` as the configured Vercel project domain for `menu-v3`, linked to `Midosd249/Menu_V3`.
- DONE / VERIFIED: confirmed prior `main` production deployments reached READY.
- DONE / VERIFIED: confirmed existing sitemap/robots SEO infrastructure can support Search Console submission without a new sitemap implementation.
- DONE / VERIFIED: added optional `VITE_GOOGLE_SITE_VERIFICATION` support in `src/routes/__root.tsx`; unset means no behavior change.
- DONE / VERIFIED: recorded the verification approach and security boundary in `PLAN.md`; no token or credential was committed.
- DONE / VERIFIED: diagnosed the Vercel build failure as a missing direct dependency declaration for `@vitejs/plugin-react`.
- DONE / VERIFIED: added `@vitejs/plugin-react` at `^6.1.1` to `package.json` and pushed the fix to `main`.
- INFERRED: the dependency declaration addresses the observed `ERR_MODULE_NOT_FOUND` failure because the failing import is now declared.
- VERIFIED: GitHub Actions run `33821751476` passes the full quality workflow on the latest tested code before the final state-documentation commits.
- BLOCKED: Vercel has not created a deployment from the latest tested `main` history; newest observed Vercel production deployment remains an older `ERROR` deployment for commit `1a7dbcdaa246e7103e69a43322425be8806c9c46`.
- BLOCKED: the available direct-deploy connector cannot be invoked with the required deployment arguments in the current connected surface.
- UNKNOWN: local typecheck/test/lint/build results outside GitHub Actions.
- BLOCKED: Search Console verification remains pending the account-specific token and Google ownership confirmation.

## Exact Next Task
- **G7.2 deployment confirmation:** obtain a Vercel deployment from the latest verified `main` history, confirm it reaches READY, then continue the existing Search Console verification flow. Do not start another feature or refactor.
