# Session Log — 2026-09-07 — Themes 3–5 Main Visual Refinement

## Current position
- **VERIFIED:** source of truth is `Midosd249/Menu_V3` on `main`.
- **VERIFIED:** registry order identifies themes 3–5 as `noir`, `heritage`, and `gallery`.
- **VERIFIED:** the requested work was limited to visual/layout/image/theme quality plus regression protection.

## Completed task
- **VERIFIED:** removed the root-level unconfigured `MenuThemeController` that could overwrite the server-bootstrapped route theme with `essential` during hydration.
- **VERIFIED:** preserved the route-level theme controller and `createThemeBootstrapScript` as the public-menu theme owners.
- **VERIFIED:** strengthened Heritage's final presentation layer with explicit light material surfaces, tighter section rhythm, stable card surfaces, and preserved 4:3 media/bidi behavior.
- **VERIFIED:** added Gallery first-screen semantic hooks and a scoped hardening layer for logo/title sizing, wrapping, RTL/LTR alignment, and first-screen spacing.
- **VERIFIED:** added Gallery and theme-bootstrap regression tests and registered the Gallery test in the default suite.
- **VERIFIED:** no schema, auth/authz, subscriptions, tenant/branch isolation, customer-order semantics, CI/CD, Vercel configuration, environment variables, or deployment settings were changed.

## Visual evidence
- **VERIFIED:** supplied screenshots are 695×1536 mobile captures and visibly show the Noir public-menu experience.
- **VERIFIED:** screenshots show the menu's strong Noir identity and support preserving the existing Noir presentation rather than redesigning it.
- **UNKNOWN:** exact physical device/browser identity and final post-change pixel rendering in this connector environment.

## Verification limits
- **VERIFIED:** changed files are present on `main` through GitHub repository content and commit evidence.
- **UNKNOWN:** local `npm run typecheck`, `npm test`, `npm run lint`, `npm run build`, `npm run qa:template`, and interactive Playwright/device visual QA could not be executed because a runnable repository workspace is not available in this connector environment.
- **UNKNOWN:** deployment status of the new main commits. No deployment was intentionally invoked.

## Main HEAD
- **VERIFIED:** use the latest `main` commit shown by the repository after this session; no stale SHA is embedded here.

## Exact next task
Run the complete repository quality gate and real browser/device QA against the latest main commit, verify Noir/Heritage/Gallery at supported viewports and languages, and record production/deployment status separately without claiming `DEPLOYED` without direct Vercel evidence.
