# PROJECT_STATE

## Identity
- Status: IN_PROGRESS.
- Repository: `Midosd249/Menu_V3`.
- Source of truth: `main`.
- Product: Menu V3, Arabic-first bilingual multi-tenant digital-menu SaaS for restaurants and cafes.

## Current Position
- G1–G7.2 completed work remains protected.
- **Premium Theme System — DONE / VERIFIED / MERGED.**
- **Theme 1 — Essential — DONE / VERIFIED / MERGED; original baseline restored.**
- **Theme 2 — Editorial — DONE / VERIFIED / MERGED; preview rendering stabilized.**
- **Theme 3 — Noir — DONE / VERIFIED / MERGED; preview rendering stabilized.**
- Authentication reconciliation and the qualified `extensions.crypt(...)` fix are implemented and live authentication was verified by the user after deployment.
- The reserved `nafas` demo fixture remains the source for the marketing/theme-preview demo when no branch is requested.

## Current Atomic Task
### Preview layer isolation + responsive theme rendering — DONE / SOURCE-VERIFIED

**Root cause:** both preview routes wrapped an already self-contained menu template in a second `.menu-public-shell`. That nested shell created a second theme presentation boundary; combined with shell pseudo-elements and preview-specific CSS, it could produce the reported transparent/visual veil and made preview stacking behavior ambiguous.

**Fixed:** `src/routes/studio/preview.tsx` and `src/routes/themes/preview.tsx` no longer create an outer `.menu-public-shell`. They now render the selected theme controller and the self-contained menu template directly.

**Fixed:** added `tests/preview-shell.test.mjs` and registered it in the repository test command so a nested preview shell cannot silently return.

**Preserved:** template-family resolution, theme selection before client paint, Premium preview behavior, public menu business logic, tenant isolation, authentication, ordering, analytics, and all completed theme art direction.

## Verification State
- **VERIFIED:** both preview routes contain no outer `.menu-public-shell` wrapper.
- **VERIFIED:** both routes still render `MenuThemeController`, `PublicMenuView`, and `ContemporaryRestaurantTemplate` as applicable.
- **VERIFIED:** the menu templates remain the owners of the actual `.menu-public-shell`, eliminating the nested shell boundary.
- **VERIFIED:** the regression test asserts that both preview routes cannot reintroduce a nested menu shell.
- **VERIFIED:** no dependency was added and package dependency versions were preserved.
- **VERIFIED:** no database schema/business contract was changed.
- **PENDING:** CI execution for the new regression test and the normal repository quality gates.
- **UNKNOWN:** final physical-device pixel-level rendering until the resulting deployment is manually inspected.

## Session Log
- 2026-09-04 — Investigated the repeated hidden-menu report from the preview routes and traced the actual rendered DOM ownership.
- 2026-09-04 — Confirmed the root cause: both preview routes added a second `.menu-public-shell` around menu templates that already render their own shell.
- 2026-09-04 — Removed both redundant preview wrappers and kept the existing theme-family routing intact.
- 2026-09-04 — Added a source-level regression test preventing nested preview shells from returning.
- 2026-09-04 — Preserved all existing package dependency versions after the test-script update.

## Exact Next Task
Deploy the fixed `main` and perform live mobile-first QA of all five theme previews. Verify that each selected theme displays the full menu content without any covering layer before beginning Theme 4.