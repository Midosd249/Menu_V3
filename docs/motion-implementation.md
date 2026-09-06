# Motion and Interaction — W9

## Status
- `CLOSED / VERIFIED`.
- Final GitHub Quality run: `34010117079` / run `#779`.
- The final gate passed typecheck, 112 tests, lint, production build, Playwright Chromium installation, all-theme Browser Template QA, performance-baseline upload, and preview shutdown.
- Scope: shared motion primitives for the existing Menu V3 product and protected five-theme public menu.
- Themes remain presentation owners; this layer does not introduce a sixth theme or duplicate application shells.

## Evidence basis
- W3C WCAG Technique C39 recommends using `prefers-reduced-motion` to suppress non-essential interaction animation. It explicitly calls for testing interactive motion with the reduced-motion preference enabled.
- W3C WCAG 2.3.3 guidance states that non-essential motion triggered by interaction should be disableable and that motion must not be the only way to convey essential information.
- web.dev rendering guidance recommends keeping animation work within the browser's tight frame budget and preferring compositor-friendly properties.
- web.dev animation guidance recommends `transform` and `opacity` for high-performance motion and warns against layout-triggering properties when animating.

Sources accessed: 2026-09-06.

## Motion principles

### 1. Motion is functional
Motion is used only for:
- orientation when a sheet/drawer appears;
- immediate feedback for interaction;
- hierarchy between entering content and the surrounding surface;
- subtle press/hover feedback where the device supports it.

Perpetual decorative motion, parallax, delayed first content, and animation-only information are excluded.

### 2. Timing
Shared roles are centralized in `src/motion.css`:
- instant: 80ms;
- fast: 140ms;
- standard: 180ms;
- emphasis: 260ms;
- slow: 420ms.

The existing theme aliases are preserved so the protected theme layer does not need a rewrite.

### 3. Easing
- Standard: fast response with a controlled settle.
- Emphasis: restrained deceleration suitable for hospitality surfaces.
- Exit: reserved for future explicit exit-state lifecycles; no artificial delayed unmounting is introduced in W9.

### 4. Performance
High-frequency motion is restricted to `transform` and `opacity`, with color, border, shadow, and background transitions kept short. Layout properties such as width, height, top, left, margin, and padding are not used as motion primitives.

No `will-change` is introduced by default. It should only be added when a measured performance issue justifies it.

### 5. Public-menu choreography
- Product details sheet: short upward entrance on mobile and centered scale/fade behavior at larger widths.
- Cart drawer: enters from the logical inline-end; RTL reverses the physical direction.
- Overlay: fades in without changing layout.
- Close behavior remains immediate because the existing component lifecycle unmounts the surface directly; W9 does not add delayed unmount state merely for an exit animation.

### 6. Reduced motion
`@media (prefers-reduced-motion: reduce)` reduces animation/transition duration to an effectively immediate state change and removes press scaling. State feedback remains available through the resulting visual state, focus, and content changes.

### 7. Touch behavior
Hover-only movement is disabled for coarse pointers. Primary customer actions remain immediate and do not wait for animation completion.

## Regression contract
`scripts/motion-contract.test.mjs` verifies:
- centralized motion tokens;
- loading order before protected themes;
- absence of layout-property motion primitives;
- reduced-motion behavior;
- product-sheet and cart dialog hooks.

The test is included in the default `npm test` suite.

## Security and compatibility
- No new runtime dependency was added.
- A pre-existing invalid `@radix-ui/react-popover` range (`^1.2.12`) was aligned to the lockfile's installable `^1.1.12` range after CI proved it was blocking `npm install`; no package upgrade was introduced.
- No Supabase schema or tenant data model changes.
- No authentication, authorization, branch isolation, or customer-action semantics changed.
- No theme was replaced or duplicated.

## Final verification
- `npm run typecheck` — PASS in Quality run `34010117079`.
- `npm test` — PASS: 112/112 tests.
- `npm run lint` — PASS.
- Production build — PASS.
- Playwright Chromium installation — PASS.
- Browser Template QA — PASS for all protected themes.
- Performance baseline upload — PASS.
- Preview shutdown — PASS.

## Closure
W9 is `CLOSED / VERIFIED`. No further W9 work should be started unless later evidence demonstrates a regression.
