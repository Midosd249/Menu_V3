# W17-Q — Public Menu Hardening Audit

Date: 2026-09-07

## Current position
W17-Q remains IN_PROGRESS. A focused client-facing public-menu hardening subtask was completed and merged to `main` as commit `b0a06dbeca47779f371e118beed6d62b6b63c21c`.

## Evidence reviewed
- Supplied mobile screenshots of the customer-facing menu.
- `PROJECT_STATE.md`, `PLAN.md`, `TASKS.md`, `SESSION_PROTOCOL.md`, README, and relevant W17 design/research records.
- GitHub source for the public menu, shared menu primitives, theme registry, and W17 contracts.
- Current production HTML for `/m/nafas` in Arabic and English.
- Vercel project/deployment state and preview build logs.
- WCAG 2.2 guidance and web.dev image/layout-stability guidance.

## Client-facing defects confirmed
1. Product media can display a browser broken-image state when an external image request fails; a missing `src` fallback alone is insufficient.
2. The public header previously displayed an `Opening hours` status chip even when the branch had no configured schedule, creating a misleading placeholder.
3. The supplied screenshots also show legacy presentation defects such as concatenated labels/prices and the older circular Editorial card treatment; current `main`/production HTML already contains the W17 spacing, bidi price markup, and rectangular public-card structure for the Essential route. These screenshot states must not be treated as current-main implementation evidence without a fresh device capture.

## Completed subtask
- Hardened `MenuMedia` with an `onError` fallback.
- Hardened public-menu `DishMedia` with the same runtime fallback.
- Suppressed the opening-hours status chip when no schedule exists; the detailed hours section remains conditional on actual hours data.
- Added `tests/public-menu-resilience.test.mjs` for the two regressions.
- Merged through PR #21 into `main`.

## Verification
- VERIFIED: PR #21 merged successfully.
- VERIFIED: Vercel preview deployments for the branch reached READY; the preview build completed successfully before the final hardening commit.
- VERIFIED: current production `/m/nafas` returns HTTP 200 and the live HTML already contains correct Arabic/English bidi price markup, structured spacing, rectangular cards, and conditional hours detail.
- VERIFIED: current production runtime logs for the inspected production deployment contained no error/fatal entries.
- UNKNOWN: the final merged hardening commit has not yet been independently confirmed as the active production deployment.
- UNKNOWN: the new regression test file has not been executed by a repository quality workflow in the available connector environment.
- UNKNOWN: direct physical-device/browser capture of the final merged build remains unavailable here.

## Research basis
- W3C WCAG 2.2 emphasizes that fixed UI must not obscure focused content and that target sizing/focus behavior matter on mobile.
- web.dev recommends explicit image sizing and stable media containers to reduce layout instability.
- Existing repository design research remains the source of truth; no new theme or parallel renderer was introduced.

## Remaining issues
- Full W17-Q quality gate still needs execution: typecheck, full test suite, lint, build, template QA, and final diff review.
- Final merged commit must be verified on Vercel production before W16 release closure can be claimed.
- Real-device QA remains UNKNOWN until an actual device/browser capture is available.

## Exact next task
W17-Q — Run the complete repository quality gate against the merged W17 state, inspect the final diff, and resolve only scoped defects; then re-check Vercel deployment state and record production evidence without claiming deployment until the commit match is verified.
