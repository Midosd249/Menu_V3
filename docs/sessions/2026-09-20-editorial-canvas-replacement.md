# Editorial Canvas Replacement — 2026-09-20

## Status
- Classification: design/system replacement, not a patch.
- Scope: replace the public Editorial theme presentation with the owner-supplied Canva-derived restaurant-menu direction.
- Branch: `redesign/editorial-canvas-menu-2026-09-20`.
- Base: GitHub `main` at `65dd5944f64203b74c80924098adf68fa15ccbce` when work started.
- Deployment: not requested and not performed.

## Owner intent
- The existing Editorial/Atelier presentation is superseded.
- The supplied HTML/CSS is a visual reference, not a standalone replacement for Menu V3 architecture.
- Preserve Menu V3's tenant/branch data, public actions, search, category filtering, product details, modifiers, cart, ordering, analytics, bilingual routing, and existing security boundaries.
- Do not copy the supplied demo tenant data, phone number, hard-coded dishes, or standalone CDN/Tailwind runtime into the SaaS.

## Design translation
- Warm paper canvas with ink typography, lime interaction accent, copper editorial accent.
- Sticky compact top bar with search, restaurant identity, language, and cart.
- Image-led editorial hero with stable aspect ratio.
- Horizontal category/search rail.
- Featured/editorial selection with explicit number → title → price → description hierarchy.
- Product list with fixed media column and flexible text column.
- Prices isolated with LTR/bidi rules; Arabic names wrap by words rather than characters.
- Fixed mobile cart entry with safe-area clearance.
- Restaurant footer with dynamic tenant/branch facts.
- Reduced-motion and visible focus behavior retained.

## Safety boundary
- No schema, auth, RLS, tenant isolation, order pricing, payment, subscription, SEO routing, or deployment architecture changes.
- No hard-coded restaurant identity from the supplied reference.
- No arbitrary z-index escalation; the new top bar/search/cart layers use a small documented stacking hierarchy.

## Research preflight
- W3C WCAG 2.2: target size and focus/interaction requirements.
- MDN: logical RTL properties, text wrapping, aspect-ratio/object-fit, responsive layout, positioning/stacking, and color contrast.
- Exa: current Arabic-first restaurant/digital-menu patterns.
- Repository evidence: current Editorial renderer, theme registry, semantic color adapter, tests, CI workflow, and prior Editorial/QR hardening.

## Implementation
1. Replace the complete Editorial presentation stylesheet with the Canvas system.
2. Rename the stylesheet from `theme-editorial-atelier.css` to `theme-editorial-canvas.css`.
3. Integrate a real top bar and footer into the existing renderer without duplicating ordering logic.
4. Restore the public Editorial registry identity while keeping the theme key `editorial`.
5. Align semantic color tokens with the new palette.
6. Update Editorial/preview/QR regression contracts.
7. Run GitHub Quality and browser template QA before merge.
8. Review the final diff and merge only if quality gates are clean.
9. Do not deploy to Production as part of this design task.

## Acceptance criteria
- No mobile character-by-character fragmentation of Arabic product names.
- No price/title collision or squeezed price column.
- Product images remain stable and rectangular on mobile.
- Hero logo cannot hijack the cover media geometry.
- Search/category/cart remain reachable and touch-safe.
- Fixed cart does not cover product content or safe-area.
- Top bar, footer, featured section, and product list visually match the supplied direction while remaining data-driven.
- English LTR layout remains structurally valid.
- Existing public ordering/modifier behavior remains unchanged.

## Verification plan
- Contract tests: `npm test` plus focused Editorial/preview/QR contracts.
- Typecheck and lint.
- Production build.
- Playwright/all-theme browser QA and performance stage through GitHub Actions.
- Review changed-file diff.
- Physical device QA remains separate release evidence and is not claimed here.

## Exactly one next action
Complete CI/browser verification for this branch, inspect failures if any, then perform one final diff review before merge.
