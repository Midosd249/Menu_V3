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
### Preview layer isolation + responsive theme rendering

**Objective:** remove the preview presentation layer race/stacking ambiguity, make each selected theme render through its intended visual family, and keep preview behavior safe on mobile and desktop without changing production business logic.

**VERIFIED:** `src/routes/studio/preview.tsx` and `src/routes/themes/preview.tsx` resolve the requested theme before the first client render when available.

**VERIFIED:** Studio preview now uses `getThemeFamily(activeTheme)` so Editorial and Noir use their intended template family instead of forcing every preview through `PublicMenuView`.

**VERIFIED:** dedicated preview shells carry `data-menu-preview` and `data-menu-preview-theme` markers.

**IMPLEMENTED:** `src/menu-preview-layer.css` no longer creates an isolated/z-indexed stacking context. Preview shell decoration remains non-interactive and cannot create a preview-only content veil through this layer.

**VERIFIED:** the root `MenuThemeController` applies preview theme tokens with `useLayoutEffect`, removing the client paint race that could briefly expose the default theme.

**VERIFIED:** Premium preview access does not weaken `saveTenantTheme` entitlement enforcement.

## Verification State
- **VERIFIED:** theme keys are validated through the central theme registry.
- **VERIFIED:** Essential remains the original completed visual baseline.
- **VERIFIED:** Editorial and Noir refinement layers remain available.
- **VERIFIED:** Studio preview routes now respect theme template families.
- **VERIFIED:** preview shell layering no longer creates a dedicated stacking context or raises shell children into a separate z-index layer.
- **VERIFIED:** mobile overflow safeguards remain in place.
- **VERIFIED:** no dependency was added and no database schema/business contract was changed.
- **VERIFIED:** Premium save/publish authorization remains enforced in `src/lib/theme/server.ts`.
- **PENDING:** Vercel deployment for the latest code state.
- **UNKNOWN:** final physical-device pixel-level rendering until the latest deployment is manually inspected.
- **UNKNOWN:** local shell test execution in this session because the repository is accessed through repository tooling rather than a local checkout.

## Session Log
- 2026-09-04 — Investigated the reported hidden preview layer and traced the preview rendering path through the Studio route, public theme preview route, theme registry and controller.
- 2026-09-04 — Found that Studio preview forced `PublicMenuView` for every theme family, while the dedicated theme preview route already respected template family.
- 2026-09-04 — Stabilized preview theme selection during initial client render and changed the theme controller to `useLayoutEffect`.
- 2026-09-04 — Reworked `src/menu-preview-layer.css` to remove its isolated/z-indexed stacking context after the reported content veil persisted.

## Exact Next Task
Deploy the latest `main` and perform live mobile-first QA of all five theme previews: `essential`, `editorial`, `noir`, `heritage`, and `gallery`. Verify that each selected theme is visibly rendered and the full menu content remains readable. Do not start Theme 4 as a development milestone until this QA is complete.