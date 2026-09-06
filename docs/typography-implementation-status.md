# Typography Implementation Status — 2026-09-06

## Objective
Introduce the approved IBM Plex Sans Arabic + IBM Plex Sans typography system without changing theme architecture or adding a font runtime dependency.

## Completed
- Added `src/typography.css` with shared semantic typography roles for display, headings, body, buttons, prices, numerals, and code.
- Added mixed-direction isolation and tabular numeric treatment.
- Wired the typography stylesheet from `src/routes/__root.tsx` before theme styles.
- Updated the document font loading contract to request IBM Plex Sans Arabic and IBM Plex Sans at weights 400/500/600/700.
- Added `scripts/typography-contract.test.mjs` and included it in the default test suite.
- No font package dependency was added.

## Important verification state
**VERIFIED:** The official IBM Plex repository exposes Arabic WOFF2 assets and an OFL-1.1 license. The repository lists regular, medium, semibold, and bold Arabic web assets suitable for the selected weight set.

**VERIFIED:** The current Menu V3 implementation loads IBM Plex through the existing Google Fonts stylesheet path and now loads both the Arabic and Latin families.

**BLOCKED:** The final self-hosting acceptance criterion cannot yet be closed through the currently available GitHub write interface because it can create UTF-8 text blobs but cannot transfer binary WOFF2 content from the official IBM repository into Menu V3. GitHub's binary blob fetch path is also unavailable through this connector because binary responses are rejected. Do not claim that the WOFF2 files are self-hosted until the binary asset transfer is actually completed and verified in the repository.

## Required finalization
1. Transfer the official IBM Plex Sans Arabic WOFF2 assets (minimum Regular, Medium/SemiBold, Bold) and matching IBM Plex Sans Latin assets into the repository's approved public font asset path.
2. Add local `@font-face` declarations with `font-display: swap` and exact weights.
3. Remove the Google Fonts runtime stylesheet and preconnects.
4. Keep the existing semantic typography contract unchanged.
5. Run typecheck, tests, lint, production build, browser/template QA, and performance audit.
6. Measure font transfer size and layout-shift behavior on Arabic and mixed Arabic/Latin specimens.
7. Only then mark W6-01 CLOSED / VERIFIED.

## Evidence
- Official IBM Plex source: https://github.com/IBM/plex
- Official Arabic web assets directory: https://github.com/IBM/plex/tree/master/packages/plex-sans-arabic/fonts/complete/woff2
- Official Arabic asset list verified through GitHub API; the directory exposes WOFF2 assets for Bold, Medium, Regular, SemiBold and other weights.
