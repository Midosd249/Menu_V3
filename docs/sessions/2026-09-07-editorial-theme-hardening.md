# 2026-09-07 — Editorial Theme Browser Hardening

## Current position
- Theme under test: `editorial` (second protected theme).
- Repository: `Midosd249/Menu_V3`.
- Branch: `main`.
- Method: repository-specific Editorial refinement brief + layering audit + browser QA gate, followed by targeted root-cause hardening.

## Evidence reviewed
- `docs/template-briefs/editorial-premium-refinement.md`
- `docs/editorial-layering-and-ui-audit.md`
- `docs/image-art-direction.md`
- `tests/preview-shell.test.mjs`
- `scripts/template-qa.mjs`
- Supplied client screenshots showing oversized/overly tall Editorial mobile composition, unstable image/card geometry, and mixed-direction text/price collisions.
- External UX/accessibility evidence from Nielsen Norman Group and W3C/MDN was used to validate sticky navigation, touch targets, responsive hierarchy, focus clearance, logical direction handling, bidi isolation, and stable image geometry.

## Findings
- `status == null` previously rendered the literal `Opening hours` label, which was not a real status and could mislead customers when today's schedule was missing.
- Mobile Editorial hero remained too dominant at `56dvh` despite the product brief requiring the hero to stay below the previous near-full-screen treatment.
- Mobile product imagery forced `height: 100%` while also declaring an aspect ratio; the hardening layer now uses width + aspect ratio + auto height to make image geometry deterministic.
- Featured/product title-price rows needed a safer two-row mobile arrangement for long Arabic/Latin names and mixed-direction SAR values.
- The shared final Editorial stylesheet is intentionally preserved; a final scoped hardening layer is loaded immediately after it.

## Changes
- Added `src/theme-editorial-hardening.css`.
- Loaded the hardening layer after `theme-editorial.css` in `src/routes/__root.tsx`.
- Updated `src/components/templates/contemporary-restaurant.tsx` so unknown/missing schedule data does not fabricate an `Opening hours` status.
- Added `tests/editorial-browser-hardening.test.mjs` and included it in the default `npm test` suite.
- Preserved the five-theme architecture, renderer boundary, backend contracts, and existing Editorial personality.

## Verification
- VERIFIED: GitHub Actions Quality run `34066962978` for head `4cf83cfa1c9091ff8973ab42cbeeaef2ddb554de` completed successfully.
- VERIFIED: route-tree generation passed.
- VERIFIED: typecheck passed.
- VERIFIED: default test suite passed, including `tests/editorial-browser-hardening.test.mjs` and existing public-menu resilience contracts.
- VERIFIED: lint passed.
- VERIFIED: production build passed.
- VERIFIED: Playwright Chromium installation passed.
- VERIFIED: Browser Template QA passed for all five protected themes across mobile, tablet, and desktop viewports, including RTL direction, accessible names, horizontal-overflow, runtime-console, and reduced-motion checks.
- VERIFIED: browser performance audit completed successfully as part of the same quality workflow.

## Production status
- UNKNOWN: final hardening commit is not yet confirmed as the active Vercel production deployment.
- UNKNOWN: direct physical-device rendering and manual screen-reader output remain unobserved in this connector environment.

## Acceptance result
- Editorial hardening implementation: VERIFIED / MERGED to `main`.
- Repository quality gate: VERIFIED / PASSED.
- Browser all-theme regression gate: VERIFIED / PASSED.
- Production deployment: UNKNOWN / remains separately tracked.

## Exact next task
After production deployment evidence is available, perform the same agent workflow on the third protected theme: `noir`, without reopening Editorial or Essential unless new regression evidence appears.
