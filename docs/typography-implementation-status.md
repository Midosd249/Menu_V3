# Typography Implementation Status — 2026-09-06

## Objective
Introduce the approved IBM Plex Sans Arabic + IBM Plex Sans typography system without changing theme architecture or adding a font runtime dependency.

## Completed
- Added `src/typography.css` with shared semantic typography roles for display, headings, body, buttons, prices, numerals, and code.
- Added mixed-direction isolation and tabular numeric treatment.
- Wired the typography stylesheet from `src/routes/__root.tsx` before theme styles.
- Updated the document font loading contract to request IBM Plex Sans Arabic and IBM Plex Sans at weights 400/500/600/700.
- Removed Google Fonts runtime loading and preconnects.
- Switched the browser delivery path to the version-pinned Fontsource CDN after browser QA exposed 404s on the earlier IBM GitHub-commit URLs.
- Added `scripts/typography-contract.test.mjs` and included it in the default test suite.
- No font package dependency was added.

## Final verification — VERIFIED
- `Menu V3 Quality` run `34009000701` completed successfully.
- Typecheck: PASSED.
- Tests: PASSED.
- Lint: PASSED.
- Production build: PASSED.
- Browser Template QA — all themes: PASSED.
- Browser performance baseline upload: PASSED.
- Stop built preview: PASSED.
- The corrected Fontsource CDN path is now the implementation of record.

## Delivery boundary
The repository write connector cannot transfer binary WOFF2 files into the repository, so strict local self-hosting is not claimed. Fontsource documents its CDN as versioned and recommends exact semantic versions for reproducible production URLs. The implementation uses exact `5.3.0` Fontsource CDN URLs, with `font-display: swap`, and no npm runtime font dependency.

This is an explicit delivery-model exception, not an unresolved browser-delivery failure. A future binary-capable repository path may migrate the same typography contract to local WOFF2 assets without changing semantic roles or component usage.

## Evidence
- IBM Plex official source: https://github.com/IBM/plex
- IBM Plex Sans Arabic package: https://www.npmjs.com/package/@ibm/plex-sans-arabic
- Fontsource IBM Plex Sans Arabic: https://www.npmjs.com/package/@fontsource/ibm-plex-sans-arabic
- Fontsource CDN documentation: https://fontsource.org/docs/getting-started/cdn
