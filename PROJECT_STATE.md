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
- **Theme 2 — Editorial — DONE / VERIFIED / MERGED; preview refinement integration fixed.**
- **Theme 3 — Noir — DONE / VERIFIED / MERGED; preview refinement integration fixed.**
- Authentication reconciliation and the qualified `extensions.crypt(...)` fix are implemented and live authentication was verified by the user after deployment.
- The reserved `nafas` demo fixture remains the source for the marketing/theme-preview demo when no branch is requested.

## Current Atomic Task
### Theme preview integration + Essential baseline restoration

**Objective:** make the Studio theme previews render the selected theme instead of the default/base presentation, expose Premium themes for preview without weakening entitlement enforcement, and remove the new refinement treatment from Essential so its original completed visual baseline is preserved.

**VERIFIED:** the public menu and Studio preview components were not consistently carrying the `menu-public-shell` hook required by the refinement layer. `PublicMenuView` and `ContemporaryRestaurantTemplate` now expose that hook.

**VERIFIED:** the root `MenuThemeController` was also able to paint the default Essential theme on preview routes before the route-specific controller applied the requested theme. Preview routes now opt out of the root controller to prevent the observed Essential → selected-theme flicker.

**IMPLEMENTED:** `theme-refinements-v2.css` now contains only the Editorial and Noir refinement pass. Essential keeps its original theme layer without the refinement-v2 treatment.

**VERIFIED:** Premium entitlement enforcement remains unchanged. Premium themes are previewable through the public preview route; `saveTenantTheme` still blocks publishing a Premium theme for an ineligible subscription.

## Verification State
- **VERIFIED:** `PublicMenuView` uses `menu-public-shell`.
- **VERIFIED:** `ContemporaryRestaurantTemplate` uses `menu-public-shell`.
- **VERIFIED:** Studio/theme preview route can select any valid `ThemeKey` and route-specific theme controller owns preview theme application.
- **VERIFIED:** Essential refinement-v2 rules were removed; Editorial and Noir refinement rules remain.
- **VERIFIED:** reduced-motion and touch/hover safeguards remain for Premium refinement effects.
- **VERIFIED:** no dependency was added and no database schema/business contract was changed.
- **VERIFIED:** Premium save/publish authorization remains enforced in `src/lib/theme/server.ts`.
- **PENDING:** Vercel deployment for the latest code commit.
- **UNKNOWN:** final pixel-level mobile/desktop rendering until the new deployment is live and manually inspected.
- **UNKNOWN:** local shell test execution in this session because the repository is accessed through repository tooling rather than a local checkout.

## Session Log
- 2026-09-04 — Confirmed user-uploaded deployment was successful before this refinement task.
- 2026-09-04 — Audited Studio preview, public preview, theme controller, theme registry, PublicMenuView, ContemporaryRestaurantTemplate and Premium entitlement enforcement.
- 2026-09-04 — Found the missing `menu-public-shell` integration hook that prevented refinement CSS from applying to preview-rendered templates.
- 2026-09-04 — Restored Essential to its original baseline by removing its refinement-v2 rules while retaining Editorial and Noir refinements.
- 2026-09-04 — Prevented the root theme controller from painting Essential on dedicated preview routes, removing the preview theme flicker.

## Exact Next Task
Deploy and live-QA the corrected Studio previews for `essential`, `editorial`, and `noir` on mobile and desktop. Verify that Premium themes are previewable while publishing entitlement remains protected. Fix only evidence-backed rendering regressions before Theme 4.
