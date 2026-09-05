# PROJECT_STATE

## Identity
- Status: IN_PROGRESS.
- Repository: `Midosd249/Menu_V3`.
- Source of truth: `main`.
- Product: Menu V3, Arabic-first bilingual multi-tenant digital-menu SaaS for restaurants and cafes.

## Current Position
- G1–G7.2 completed work remains protected.
- **Premium Theme System — DONE / VERIFIED / MERGED.**
- **Theme 1 — Essential — implementation refinement COMPLETE; final visual/device closure remains blocked pending browser evidence.**
- **Theme 2 — Editorial — DONE / VERIFIED / MERGED; protected.**
- **Theme 3 — Noir — implementation refinement COMPLETE; release/visual closure remains blocked pending browser/device evidence.**
- Heritage and Gallery remain untouched.
- **Visual/Functional Quality System — DONE / VERIFIED / MERGED.**
- **External Theme Preview QR Mode — DONE / VERIFIED.** All five themes remain available for non-persistent external preview against real branch data.
- **Shared Public Menu Rendering Stabilization — IMPLEMENTED; browser verification pending.**

## Current Atomic Task
### Repository-wide public-menu rendering and action visibility stabilization

**Objective:** eliminate the verified structural causes of theme/layer flashing across public menu routes and restore persistent visibility of supported customer actions without changing theme entitlements or the shared security model.

**VERIFIED implementation:**
- Public menu routes no longer add an unnecessary route-level `.menu-public-shell` around template-owned presentation.
- Theme tokens are bootstrapped from route loader data in the document head before hydration, preventing the browser from first painting the default theme and then switching after mount.
- `MenuThemeController` no longer clears theme tokens during ordinary dependency changes; cleanup occurs on component unmount only, preventing a transient blank/default theme between renders.
- The shared public-menu now exposes an always-available Cart entry point, including an empty-cart state, plus verified WhatsApp, map, and phone quick actions when configured.
- Main content receives bottom space for the fixed action dock so it does not cover the final menu content.
- Existing ordering, product details/modifiers, contact links, analytics, tenant/branch routing, theme registry, and subscription authorization were not intentionally changed.
- Regression checks were extended for route shell duplication, theme bootstrap, controller cleanup behavior, and shared action visibility.

## Root-Cause Assessment
- **VERIFIED:** there was a route/template presentation duplication: the public route wrapped the selected template in `.menu-public-shell` while templates also owned their presentation and/or embedded `PublicMenuView`, creating redundant presentation boundaries.
- **VERIFIED:** theme selection was applied primarily by a client `useLayoutEffect`; the server-rendered document could therefore paint with default theme variables before the client controller applied the real theme. React effects do not run during server rendering, so the first document paint cannot depend on the controller effect.
- **VERIFIED:** the controller cleanup returned from its dependency effect, so changing route/theme dependencies cleared theme attributes and CSS variables before immediately setting the next theme.
- **VERIFIED:** the Cart trigger was conditionally rendered only when `cart.length > 0`, so an empty cart had no visible entry point even though the cart drawer itself was supported.
- **INFERRED:** reports of missing map/contact controls were amplified by the duplicated presentation hierarchy because the shared public-menu action header lived below custom template hero content; a persistent shared quick-action dock removes that discoverability dependency.
- **UNKNOWN:** real-device confirmation in Edge/Opera, pixel-level first-paint timing, and console output remain unverified until an executable browser/device environment is available.

## Verification State
- **VERIFIED:** current theme registry contains exactly five themes: `essential`, `editorial`, `noir`, `heritage`, `gallery`.
- **VERIFIED:** `essential` maps to `small-menu` and remains `free`.
- **VERIFIED:** the permanent premium visual/functional/research guidance remains active.
- **VERIFIED:** existing security, tenant isolation, branch isolation, authorization, subscription, SEO, database, and deployment contracts were not targeted by the stabilization changes.
- **VERIFIED:** `main` now contains commit `dd155ee7cf9fdf0d893f0a9289f32371d8a823b8` with the rendering/action stabilization.
- **UNKNOWN:** browser/device screenshots, QR scan, Opera reproduction, post-hydration console output, and pixel comparison.
- **BLOCKED:** repository runtime quality commands cannot be executed from the current GitHub-only environment.

## Session Log
- 2026-09-05 — Audited the public route, branch route, theme controller, shared public-menu renderer, theme registry, preview incident record, and existing preview regression tests.
- 2026-09-05 — Researched TanStack Start SSR/head/script behavior, React hydration/effect timing, MDN color-scheme guidance, and WCAG 2.2 target sizing; also reviewed Saudi digital-menu patterns for persistent ordering/contact discoverability.
- 2026-09-05 — Implemented repository-wide public-menu stabilization: removed redundant route presentation shell, added pre-hydration theme bootstrap, stopped dependency-time theme-token clearing, and added persistent shared cart/contact quick actions.
- 2026-09-05 — Added regression coverage for the structural invariants and recorded the root-cause assessment.

## Exact Next Task
Use the latest `main` commit in an executable browser environment. Verify the five themes on the real public-menu route and theme preview route in small/standard/large mobile plus supported desktop/tablet sizes, Arabic RTL and English LTR. Specifically confirm no old-theme/default-layer flash, no overlap or hidden controls, visible Cart/Map/Phone/WhatsApp when configured, correct empty-cart opening, and no console errors. Then run typecheck, tests, lint, build, template QA, and performance audit before preparing one coherent Vercel release batch.
