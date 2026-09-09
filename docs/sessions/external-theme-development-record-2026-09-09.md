# External Theme Development Record — 2026-09-09

## Purpose
Preserve continuity for theme work completed through an external chat/session so future Menu V3 work does not lose the resulting repository state.

## Evidence status
- **VERIFIED:** The repository contains a consecutive theme-development chain on 2026-09-09 immediately before the marketing-home branch work.
- **VERIFIED:** `726dcc36f6d3d5ed4c18f2b5b7faf42c837e0c75` — `test(theme): lock canonical renderer coverage for all five themes`.
- **VERIFIED:** `567744001b131029fc7534b769ff8089d7d50d8c` — `feat(themes): add premium cover imagery to theme registry`.
- **VERIFIED:** `cd746bd9209b350ad103a9e903420ce72075ffc9` — `feat(themes): use real cover imagery in theme gallery`.
- **VERIFIED:** `ec3464111e4c14b5dda2ae13b724187344258ae9` — `feat(preview): sync theme previews with owner studio data`.
- **VERIFIED:** The theme chain is part of the repository history and is therefore preserved even though the originating work was performed in an external chat/session.

## What the verified repository evidence says
1. **Five-theme coverage is protected by regression coverage.** The test commit explicitly locks canonical renderer coverage for all five themes: Essential, Editorial, Noir, Heritage, and Gallery.
2. **Theme registry now carries premium cover imagery.** The registry commit adds preview cover-image data to the theme definitions rather than creating a separate parallel theme system.
3. **Theme gallery uses the real registered cover imagery.** The gallery commit wires the gallery to those real cover assets.
4. **Theme previews were synchronized with Owner Studio data.** The preview commit establishes continuity between preview presentation and the data used by the Owner/Studio surface.
5. **Existing theme identities remain protected.** No evidence in this record authorizes replacing the five-theme architecture or creating a sixth theme.

## Heritage / Taste continuity
- **VERIFIED:** The current theme registry identifies `heritage` with Arabic name `مذاق` and English name `Taste`.
- **INFERRED:** This is the repository implementation corresponding to the previously discussed Taste/مذاق visual direction. The exact external-chat conversation wording or any visual decisions not represented in Git are not available as authoritative evidence here.
- **UNKNOWN:** Any external-chat changes that were never committed or otherwise represented in the repository cannot be reconstructed from Git alone.

## Operational rule for future sessions
The repository remains the source of truth. If an external chat produces successful theme work, record the resulting commit(s), files, design decisions, tests, and known limitations here or in the appropriate theme audit before starting another major theme iteration. Do not treat an external-chat claim as implementation evidence until it is visible in the repository and verified by tests/browser evidence where applicable.

## Current protected theme set
- Essential
- Editorial
- Noir
- Heritage / Taste (`مذاق` / `Taste`)
- Gallery

## Non-copy / design boundary
The theme work may be inspired by references and restaurant-market direction, but proprietary screenshots, branding, text, assets, or source code must not be copied. Theme presentation must remain scoped to the existing renderer and theme registry architecture.

## Current milestone integration
- **VERIFIED:** The marketing-home branch consumes the canonical `MENU_THEMES` registry and its real preview image data for the theme gallery instead of introducing a parallel theme catalog.
- **VERIFIED:** The branch preserves the existing `/themes/preview` route as the full preview destination.
- **VERIFIED:** The marketing lead flow calls the existing `submitLead` contract and displays a stable short reference derived from the returned lead id.
- **VERIFIED:** Plan and theme selection are carried into the customer request details without changing the theme registry or theme renderer contracts.
- **VERIFIED:** Theme-specific test contracts were reconciled to the current centralized renderer architecture rather than reverting completed theme work.
- **VERIFIED:** The Taste/Heritage local Quick Add behavior remains protected while the retired shared Quick Add selector remains hidden.
- **VERIFIED:** Gallery, Editorial, Noir, Essential, and Heritage/Taste regression contracts all pass in the current quality gate.

## Quality-gate evidence
- **VERIFIED:** Quality run `1136` completed successfully on 2026-09-09.
- **VERIFIED:** Route generation passed.
- **VERIFIED:** Typecheck passed.
- **VERIFIED:** All `181` repository tests passed.
- **VERIFIED:** Lint passed with existing warnings only and zero errors.
- **VERIFIED:** Production build passed, including PGlite asset/migration checks.
- **VERIFIED:** Playwright runtime and Chromium installation passed.
- **VERIFIED:** Browser Template QA — all themes passed.
- **VERIFIED:** Browser performance baseline step and preview shutdown passed.
- **VERIFIED:** CI required a CI-local Playwright runtime install because `performance-audit.mjs` imports Playwright directly while the application package intentionally does not expose Playwright as a runtime dependency. The workflow now installs `playwright@1.63.0` with `--no-save --no-package-lock` before browser QA.

## Verification gap
- **UNKNOWN:** Physical-device rendering and manual screen-reader output remain unobserved in the connector environment.
- **UNKNOWN:** The external chat itself is not a repository source and cannot be cited as evidence beyond the repository artifacts it produced.
- **UNKNOWN:** Vercel Production deployment has not been intentionally triggered as part of this milestone.

## Next continuity action
Keep the five-theme system, the Taste/Heritage modifications, the Gallery Canva parity work, and the centralized ThemeRenderer architecture protected. Do not reopen completed theme implementation unless new browser/device evidence reproduces a defect. Treat Quality run `1136` as the current verified baseline for the marketing-home branch.
