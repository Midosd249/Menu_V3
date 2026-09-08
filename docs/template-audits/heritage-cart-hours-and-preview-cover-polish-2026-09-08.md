# Heritage — Cart, Opening Hours, and Preview Cover Polish — 2026-09-08

## Scope
- Theme: `heritage`
- Repository: `Midosd249/Menu_V3`
- Branch: `fix/heritage-cart-hours-and-theme-covers`
- Scope: presentation-only correction of the persistent cart position, Heritage opening-hours rhythm, and theme-preview cover art.
- Protected: data model, tenant/branch isolation, customer-order behavior, authentication, authorization, subscriptions, CI/CD, Vercel configuration, and production tenant cover data.

## Evidence
- **VERIFIED:** current `main` contains an existing shared `.public-menu-bottom-bar` contract and a Heritage-specific positioning rule in `src/theme-price-consistency.css`.
- **VERIFIED:** the user-provided Heritage screenshot shows the cart visually displaced toward the side instead of reading as a centered bottom action.
- **VERIFIED:** the user-provided Heritage screenshot shows opening-hours rows with weak spacing/alignment and ambiguous Arabic/Latin time separation.
- **VERIFIED:** the existing theme preview uses the demo restaurant `nafas` and supports `data-menu-preview="true"`, allowing preview-only art direction without changing real tenant cover data.
- **VERIFIED:** the repository already contains stable Unsplash food imagery in `src/lib/menu/demo.ts`; the final preview layer reuses those existing image sources rather than adding a new dependency.

## Implemented
- **VERIFIED:** added `src/theme-final-visual-polish.css` and loaded it after the existing theme layers.
- **VERIFIED:** Heritage cart is explicitly centered with `margin-inline: auto`, constrained width, flex centering, safe-area bottom spacing, and normalized child margins.
- **VERIFIED:** Heritage opening-hours content is given a stable editorial grid with aligned weekday/time columns and isolated LTR time values.
- **VERIFIED:** theme-preview cover art is differentiated for Essential, Editorial, Noir, Heritage, and Gallery only when `data-menu-preview="true"` is present.
- **VERIFIED:** real tenant cover data is not changed by the preview art rules.
- **VERIFIED:** added regression assertions to `tests/public-menu-theme-coherence-refinement.test.mjs`.

## Visual intent
- Cart: one calm, centered, reachable action surface consistent with the shared public-menu behavior.
- Hours: compact information hierarchy with strong weekday/time separation and no decorative container competing with the content.
- Covers: five distinct premium food/restaurant moods while preserving each theme's existing personality.

## Verification status
- **VERIFIED:** repository source and cascade order were inspected before implementation.
- **VERIFIED:** changes are presentation-only and scoped to the requested public-menu surfaces.
- **UNKNOWN:** local `npm test`, `npm run typecheck`, `npm run lint`, and `npm run build` could not be executed in the current connector environment because the repository is not mounted locally and outbound git access is unavailable from the execution container.
- **UNKNOWN:** physical Android/iOS pixels and QR-camera scanning remain pending direct device evidence.
- **BLOCKED:** production deployment verification is intentionally not performed as part of ordinary visual iteration.

## Exact next action
Run the repository's normal local verification suite on the branch, then perform mobile visual QA for Heritage and the five theme preview covers before any release merge/deployment decision.
