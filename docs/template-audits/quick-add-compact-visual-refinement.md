# Quick Add Compact Visual Refinement Audit

## Status
- **VERIFIED:** focused presentation-only refinement branch: `feat/quick-add-compact-visual-refinement`.
- **VERIFIED:** current branch head is `1de469b9e0f1f4804660cb70dbe90c3dc7211970`.
- **VERIFIED:** PR #32 is already merged into `main` as merge commit `930ffd4cfe1c20782079a7d5b70d48150ed6f80c`. This audit does not reopen, amend, or merge PR #32.
- **VERIFIED:** Quick Add eligibility remains owned by `getQuickAddDecision` and is not changed by this refinement.
- **VERIFIED:** the existing cart/order architecture and product-options flow remain unchanged.
- **VERIFIED:** the new visual contract test is included in the repository `test` script.
- **PROPOSED:** the compact action should read as a secondary, fast-selection affordance rather than a primary full-width CTA.
- **UNKNOWN:** live physical-device rendering is not directly observable from the repository connector environment.

## Visual problem
The existing Quick Add control used a full-width, text-bearing treatment in the shared renderer and a similarly prominent treatment in the contemporary renderer. This increased card chrome and competed with product imagery and product identity, especially on narrow mobile cards.

The supplied screenshot was used only as visual direction: compact circular/rounded action, strong discoverability, restrained footprint, and preserved product imagery. No proprietary assets, branding, or exact layout were copied.

## Verified renderer/template coverage
The theme registry maps the five active themes as follows:

| Theme | Renderer family | Current card composition | Compact treatment |
| --- | --- | --- | --- |
| Essential | `small-menu` / `PublicMenuView` | Information-first horizontal cards | 44px accent circle aligned to the card action edge |
| Editorial | `contemporary-restaurant` | Editorial featured cards and product rows | 44px editorial accent circle outside the product navigation button |
| Noir | `fine-dining-hospitality` → shared `PublicMenuView` | Noir shell with shared menu content | 44px dark/gold compact action with restrained shadow |
| Heritage | `contemporary-restaurant` | Horizontal image/content cards with adaptive geometry | 44px warm-brown compact action outside card navigation |
| Gallery | `bakery-dessert` / `PublicMenuView` | Image-first featured/grid composition | 44px gallery accent circle aligned to the card action edge |

## Placement and image protection
- **VERIFIED:** shared `PublicMenuView` renders Quick Add as a sibling of the product navigation button, not a nested interactive control.
- **VERIFIED:** the shared renderer's Quick Add sits in the card action/footer flow rather than being placed across the product image.
- **VERIFIED:** Editorial and Heritage Quick Add buttons are siblings of the `.editorial-featured-card` / `.editorial-product-card` navigation controls.
- **VERIFIED:** Noir delegates the full menu interaction surface to `PublicMenuView`, so the compact shared treatment applies without adding a second control system.
- **VERIFIED:** the refinement does not alter image dimensions, aspect ratios, `object-fit`, image loading, or missing-image fallbacks.
- **VERIFIED:** long titles/descriptions/prices remain owned by the existing content regions; the compact action no longer consumes a full-width row.
- **VERIFIED:** the refinement stylesheet introduces no `position: absolute`, `position: fixed`, or new `z-index` rule for Quick Add.

## Compact interaction contract
- **VERIFIED:** visible action geometry is `44px × 44px`.
- **VERIFIED:** the existing accessible `aria-label` remains on the Quick Add button in Arabic/English.
- **VERIFIED:** the existing Plus icon remains visible at 18px while the redundant text label is visually collapsed, keeping the accessible name intact.
- **VERIFIED:** keyboard focus remains available with a visible focus ring.
- **VERIFIED:** `touch-action: manipulation` is retained.
- **VERIFIED:** reduced-motion disables the refinement's transforms/transitions.
- **VERIFIED:** the Options action is not targeted by the compact Quick Add stylesheet.
- **VERIFIED:** `tests/quick-add-compact-visual-refinement.test.mjs` is part of `npm test`.

## Layering safety
- **VERIFIED:** the refinement introduces no new fixed, sticky, modal, toast, cart, or overlay layer.
- **VERIFIED:** no z-index value is introduced.
- **VERIFIED:** existing fixed cart controls remain governed by the existing public-menu/theme layers.
- **VERIFIED:** no duplicate cart or Quick Add control is introduced.
- **UNKNOWN:** live scroll-position and real-device stacking behavior require browser/device execution to confirm visually.

## RTL/LTR and responsive intent
- **VERIFIED:** placement uses logical inline margins, so the compact action follows document direction without hard-coded left/right positioning.
- **VERIFIED:** Arabic/English accessible labels are unchanged in the renderer code.
- **VERIFIED:** mobile spacing uses the existing responsive breakpoint and safe-area architecture; no fixed viewport overlay was added.
- **PROPOSED:** final browser QA should cover Arabic RTL, English LTR, mixed-direction names, narrow mobile widths, standard mobile widths, and tablet/desktop.

## Verification performed in this session
- **VERIFIED:** repository/source inspection of the five active public theme families, shared renderer, contemporary renderer, Noir delegation, card/image structure, Quick Add markup, cart controls, and stylesheet cascade order.
- **VERIFIED:** branch comparison confirms the refinement is isolated to four presentation/test/documentation files plus the test-script registration in `package.json`.
- **VERIFIED:** no workflow run exists for the feature branch because no PR was opened and no deployment-triggering workflow was intentionally started.
- **UNKNOWN:** `npm test`, `npm run lint`, `npm run typecheck`, `npm run build`, Playwright, console-error checks, and physical-device rendering could not be executed because no local repository/runtime/browser is available in this session.
- **BLOCKED:** creating a PR solely to obtain hosted browser/CI execution would also invoke the repository's Vercel integration, so it was intentionally not used under the explicit no-deployment constraint.

## Verification plan for the next authorized browser/CI pass
Run on the refinement branch:
1. `npm test`
2. `npm run lint`
3. `npm run typecheck`
4. `npm run build`
5. available template/browser QA for all five themes

Manual browser/device matrix:
- Essential, Editorial, Noir, Heritage, Gallery
- Arabic RTL and English LTR
- mixed-direction content
- long product names and prices
- missing descriptions and images
- portrait/square/landscape images
- eligible simple product
- product with variants
- product with required modifiers
- unavailable/sold-out product
- empty and populated cart
- cart open and closed
- top/middle/bottom scroll positions
- small mobile, standard mobile, tablet/desktop where supported
- no horizontal overflow, console errors, or image/title/price/action overlap

## Files changed in this focused refinement
- `src/quick-add-compact-refinement.css`
- `src/routes/__root.tsx`
- `tests/quick-add-compact-visual-refinement.test.mjs`
- `package.json`
- `docs/template-audits/quick-add-compact-visual-refinement.md`
