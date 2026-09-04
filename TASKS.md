# TASKS

## Current Section
- **G7 — Analytics, Search Console, Growth, Rollout: IN_PROGRESS.**

## Unified Queue
1. **G4 — Arabic/English SEO Architecture:** DONE / VERIFIED / CLOSED.
2. **G5 — Template Ecosystem Expansion:** DONE / VERIFIED / CLOSED.
3. **G6 — Performance + Media:** DONE / VERIFIED / CLOSED.
4. **G7 — Analytics, Search Console, Growth, Rollout:** IN_PROGRESS.

## Repository Organization Maintenance — 2026-09-04
- **DONE / VERIFIED:** completed an evidence-based repository organization audit against `main`.
- **DONE / VERIFIED:** created dedicated branch `chore/repository-organization`.
- **DONE / VERIFIED:** created `docs/repository-organization-audit.md` and `DELETE_CANDIDATES.md`.
- **PROPOSED:** archive historical root reports and group maintained deployment/product/development documentation under `docs/`.
- **UNKNOWN:** local working-tree and shell verification are unavailable through the connected GitHub surface.
- **BLOCKED:** local test/lint/typecheck/build execution cannot be performed from this GitHub-only interface.

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
- DONE / VERIFIED: no Search Console integration or verification configuration is present in the repository tree.
- DONE / VERIFIED: no separate growth automation surface is present beyond existing leads, analytics, and SEO capabilities.
- UNKNOWN: production Search Console ownership/indexation state and final production domain are not evidenced by repository data.
- BLOCKED: Vercel provider `build-rate-limit` remains an external deployment blocker.

## G7.1 — Production analytics integrity hardening
- DONE / VERIFIED: added `src/lib/menu/analytics-integrity.test.ts` for tenant scoping, supported 7/30-day ranges, invalid product handling, duplicate visit/QR suppression, and active/published tenant resolution.
- DONE / VERIFIED: registered the suite in the existing `npm test` command.
- DONE / VERIFIED: no runtime analytics/event model or dependency was changed.
- UNKNOWN: the new test suite was not executed in-session because no repository shell/CI dispatch capability was available through the connected GitHub surface.

## Exact Next Task
- **G7.2 — Search Console production readiness:** verify the intended production domain from repository/deployment evidence, then prepare only the minimal first-party verification/submission surface required by official Google Search Central guidance. Do not add credentials or claim ownership/indexation until production-domain evidence exists.
