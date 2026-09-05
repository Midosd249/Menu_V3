# Menu V3 — Active Plan

## Status
- Status: IN_PROGRESS.
- Repository: `Midosd249/Menu_V3`.
- Source of truth: `main`.
- Premium Theme System is DONE / VERIFIED / MERGED.
- Essential refinement implementation is complete; final browser/device closure remains blocked.
- Editorial remains protected.
- Noir implementation refinement is complete; final browser/device closure remains separately blocked and Noir is not being reopened.
- Heritage and Gallery remain untouched.
- Permanent visual/functional/research quality workflow is DONE / VERIFIED and mandatory.
- External theme preview QR mode is DONE / VERIFIED.
- **Current stabilization task:** repository-wide public-menu rendering and shared action visibility.

## Current Atomic Task
### Public-menu rendering and shared-action stabilization

**Objective:** remove redundant presentation layers and eliminate theme-token timing gaps that can cause an old/default visual layer to appear before the intended theme across public routes.

## Implementation
- **VERIFIED:** `src/routes/m.$slug.tsx` no longer wraps selected templates in a second `.menu-public-shell`.
- **VERIFIED:** `src/routes/m.$slug.$branch.tsx` uses the same pre-hydration theme bootstrap as the primary public route.
- **VERIFIED:** `createThemeBootstrapScript()` serializes the server-known theme token colors and sets `data-menu-theme` / `data-menu-theme-mode` before hydration.
- **VERIFIED:** `MenuThemeController` preserves current tokens across dependency updates and clears them only when the controller unmounts.
- **VERIFIED:** `PublicMenuView` now provides an always-available Cart control and persistent configured WhatsApp, map, and phone quick actions.
- **VERIFIED:** the action dock has adequate bottom content clearance.
- **VERIFIED:** regression assertions cover the new invariants.

## Design/Engineering Rationale
The defect is treated as a rendering-system problem rather than a z-index problem. The repository already documented the correct diagnostic order: DOM structure → positioning/sizing → stacking contexts → pseudo-elements → animation/paint timing → responsive constraints → targeted z-index. The selected fix therefore removes duplicated presentation ownership and moves theme identity into the SSR document head rather than adding more stacking rules.

This is consistent with TanStack Start guidance that route head output can provide inline scripts and that scripts intended to prevent theme flicker should execute before hydration. React documents that effects do not run during server rendering, so client-only theme effects cannot be the only source of first-paint theme state. WCAG 2.2 requires at least 24×24 CSS-pixel pointer targets at Level AA, with larger targets preferable for primary mobile actions.

## Acceptance Criteria
- **VERIFIED:** no route-level duplicate `.menu-public-shell` remains on published public-menu routes.
- **VERIFIED:** the server-rendered public-menu has a deterministic theme attribute/token bootstrap before hydration.
- **VERIFIED:** normal theme/controller updates do not clear the document theme between renders.
- **VERIFIED:** every published theme exposes a Cart entry point even when empty.
- **VERIFIED:** configured WhatsApp, map, and phone actions have a persistent shared quick-action surface.
- **VERIFIED:** the dock is excluded from owner preview mode.
- **UNKNOWN:** actual browser paint timing and device screenshots.

## Verification
Required in an executable repository runtime:
1. `npm run typecheck`
2. `npm test`
3. `npm run test:platform`
4. `npm run lint`
5. `npm run build`
6. `npm run qa:template`
7. `npm run performance:audit`
8. Real browser checks for all five themes, Arabic RTL and English LTR, small/standard/large mobile, and supported desktop/tablet.

## Release Policy
- Do not claim `DEPLOYED` without real Vercel evidence.
- Keep this stabilization as one coherent release batch.
- Do not make unrelated template or subscription changes while verifying this defect.
- Vercel Git integration deploys pushes automatically by default, so avoid fragmented production commits while the batch is incomplete.

## Exact Next Task
Verify commit `dd155ee7cf9fdf0d893f0a9289f32371d8a823b8` in an executable browser/device environment, then run the full repository quality gates and prepare one Vercel release batch only after evidence is clean.
