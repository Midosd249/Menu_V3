# Session — 2026-09-20 — Public Menu Reliability / Brand Social / Image Contract

## Classification
Focused public-menu performance, theme preview media, Studio brand/social settings, image upload contract, and social icon quality milestone.

## Execution plan — 1 to 10
1. Boot/evidence: verify branch/main/history/PRs, read continuity and specialist docs, and isolate the four authorized defects.
2. Theme preview media: make Double Espresso use the repository-owned `/homepage/menu-dish.webp` asset instead of a remote demo image.
3. Public-menu performance: remove the duplicate tenant lookup after `loadPublicMenu`; retain SSR `initialMenu`, session cache, retry behavior, and server-side tenant/branch/session boundaries.
4. Studio brand model: add website, Snapchat, Facebook, and TikTok end-to-end from migration through mapping, validation, and Studio UI.
5. Image contract: align client/server image payloads at a 450,000-character data-URL ceiling with adaptive WebP compression.
6. Public social actions: add safe Website/Instagram/Snapchat/Facebook/TikTok actions and reject unsafe/unsupported URL schemes.
7. Icon/placement system: use local recognizable brand marks with accessible labels and existing theme-owned action placement; do not add a new dependency or overlay.
8. Regression tests: cover image limits, local espresso media, social URL safety/order, and public-menu query behavior.
9. Browser/mobile review: Arabic RTL, English LTR, mobile touch targets, all five themes, Studio brand form, image upload, QR/public-menu first render.
10. Release/continuity: final diff review, one PR, one release batch, record exact SHA/deployment evidence, and stop.

## Research
- Repository evidence was the primary source of truth.
- MDN guidance supports lazy-loading non-critical images, asynchronous decoding, stable image dimensions, and selective fetch priority. citeturn0search0turn0search1turn0search3
- Simple Icons research confirms local recognizable brand SVG paths are a viable no-runtime-CDN approach. citeturn2search0turn3search0

## Constraints
- No auth/RLS/tenant-isolation weakening.
- No new runtime dependency.
- No intentional production/Vercel deployment during implementation.
- No unrelated homepage/theme redesign.
- Production/device evidence remains UNKNOWN until directly verified.

## Verification target
`npm run typecheck`, `npm test`, `npm run lint`, `npm run build`, `npm run check:auth`, `npm run qa:template`, `npm run performance:audit`, final diff review.

## Final verification
- VERIFIED: final implementation head `b3bbf92c3fbaef52511162f2b340ea179878603d`.
- VERIFIED: Quality run `35477401543` passed all configured quality, browser, and performance stages, including 319/319 tests, typecheck, lint, production build, all-theme browser QA, Studio browser QA, and Platform Admin/W7.10 browser QA.
- VERIFIED: W9 Orders QA run `35477401542` passed.
- VERIFIED: Vercel status is success.
- VERIFIED: the requested Studio map capability already exists as branch-scoped `mapsUrl` in `/studio/branches`; `/studio/brand` now exposes a direct `Manage branches & map` link for discoverability.
- VERIFIED: the implementation preserves tenant/branch isolation and does not duplicate map data at tenant level.
- UNKNOWN: Production deployment identity and physical Android/iOS/QR/device evidence.

## Status
PUSHED / VERIFIED — READY TO MERGE

## 2026-09-20 — Public Menu Reliability / Brand Social / Image Contract — MERGED / RELEASE-STAGE PENDING

- VERIFIED: PR #217 merged successfully into `main` at `679f72aca993f5a8001ef5f158877b2c48b79265` from verified head `e82d2652a1cc9f4d69f1e73ff9efc6dbf9a8a98b`.
- VERIFIED: Quality rerun `35477790515` completed successfully; typecheck, tests, lint, production build, all-theme browser QA, Studio browser QA, Platform Admin/W7.10 browser QA, performance diagnostics, and cleanup all passed.
- VERIFIED: PR #217 had no unresolved review threads and no submitted reviews.
- VERIFIED: GitHub reports Vercel status `pending` for merged `main`; this is not Production deployment evidence.
- UNKNOWN: direct Production deployment identity/status and physical Android/iOS/QR/theme/order/RTL verification.
- Implementation status: `PUSHED` / merged to `main`.
- Deployment status: `UNKNOWN` / release-stage verification pending.

### Exact Next Task

**Release-stage verification of `main` at `679f72aca993f5a8001ef5f158877b2c48b79265`, then the prepared physical Android/iOS/QR/theme/order/RTL smoke matrix. Do not start another redesign or feature task before this evidence is closed.**


## 2026-09-20 — Release Verification — PRODUCTION DEPLOYED / DEVICE QA PENDING

- VERIFIED: canonical `main` is `1fcb287072c47746e5f0a7a4a376a87783ab74e5` after continuity PR #218.
- VERIFIED: Vercel Production deployment `dpl_21u9f1K7ninyd6JBi5ayrJJ8TekF` is `READY`, target `production`, and is built from `main` commit `1fcb287072c47746e5f0a7a4a376a87783ab74e5`.
- VERIFIED: GitHub Vercel status for `main` is `success`.
- VERIFIED: Production runtime-error aggregation reports no runtime errors in the selected last-1-hour window.
- VERIFIED: PR #217 implementation is therefore present in a Vercel Production deployment; no additional deployment was intentionally triggered.
- UNKNOWN: physical Android/iOS QR scanning, all-theme visual rendering, ordering, RTL/LTR, and QR print-preview evidence on real devices.
- NOTE: direct deployment URL fetch is protected by Vercel authentication, so no anonymous HTTP page-content verification was claimed from that check.

### Exact Next Task

**Physical Android/iOS production QA — execute the prepared QR/theme/order/RTL smoke matrix, including QR single-print and multi-copy print-preview checks, against `main` `1fcb287072c47746e5f0a7a4a376a87783ab74e5`.**
