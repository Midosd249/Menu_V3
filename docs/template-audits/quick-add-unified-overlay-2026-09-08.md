# Quick Add Unified Overlay Audit — 2026-09-08

## Status
- **VERIFIED:** `main` was at `c34aa938c572bd6617f637fe83e2c285823c7457` before this task; that commit is deployed to the current production Vercel deployment `dpl_EpP4tNrHQmZdJBphfs6ntVYz4o2K`.
- **VERIFIED:** the user-provided mobile screenshots expose inconsistent Quick Add presentation: an oversized circular action outside a card in one state, text/oval treatments in another, and inconsistent visibility across theme presentations.
- **VERIFIED:** the repository already centralizes Quick Add eligibility through `getQuickAddDecision` and cart insertion through the existing public renderers; this task does not change that behavior.
- **VERIFIED:** the previous compact refinement standardized the nominal 44px control but left it in normal card flow, allowing theme/card presentation rules to make the visible control look larger, detached, or inconsistent.
- **PROPOSED:** use one icon-only plus treatment across all five themes, with a 44px transparent hit target positioned over the product media. This preserves reachability while removing the visible circle/oval chrome.
- **UNKNOWN:** final physical-device pixels require a real browser/device pass after deployment.

## Visual findings

### Finding A — Quick Add escaped the intended card composition
- **VERIFIED:** the shared renderer places Quick Add as a sibling after the product navigation button.
- **VERIFIED:** the prior compact stylesheet used normal flow plus margins, so the control consumed its own footer row.
- **Observed user evidence:** the supplied mobile screenshot shows a plus control visually detached below the card instead of reading as part of the product media.
- **Impact:** high visual inconsistency and unnecessary vertical density.
- **Resolution:** establish a scoped positioning context on the card wrapper and position the Quick Add over the media edge.

### Finding B — One control had multiple visual shapes
- **VERIFIED:** the repository contains shared/theme-specific Quick Add styling that previously supplied filled circular/rounded treatments and inherited button geometry.
- **Observed user evidence:** screenshots show circular and elongated/oval variants.
- **Impact:** the same customer action does not read as the same interaction across themes.
- **Resolution:** remove visible background/border/chrome from Quick Add and use a single icon-only plus visual.

### Finding C — The visible mark was too dominant
- **VERIFIED:** the prior control had a 44px visible circle/rounded button and text hidden only through font sizing.
- **PROPOSED:** keep the interaction target at 44×44 CSS px while reducing the visible glyph to 22px.
- **Resolution:** transparent 44px hit area + 22px plus icon with a restrained shadow for image contrast.

### Finding D — Theme identity should not require different control geometry
- **VERIFIED:** all five active themes support the shared `public-menu-quick-add` class.
- **Resolution:** keep the same geometry, placement, and icon treatment across Essential, Editorial, Noir, Heritage, and Gallery; retain only theme-appropriate icon color.

## Design decision
The canonical Quick Add presentation is now:

1. **44×44 CSS px interactive target** for mobile reachability.
2. **22px Plus icon** as the only visible action mark.
3. **No circle, pill, filled oval, border, or dedicated footer row.**
4. **Overlay on product media** at the logical inline-start/top edge so RTL and LTR mirror correctly.
5. **One geometry across all five themes.** Theme personality is expressed through color only.
6. **No image resizing or card-height changes.** The action is removed from normal document flow.
7. **No new cart/order logic.** Existing eligibility and ordering boundaries remain authoritative.

## Theme coverage
| Theme | Quick Add presentation |
| --- | --- |
| Essential | icon-only plus over product media |
| Editorial | icon-only plus over featured/product media |
| Noir | icon-only plus with Noir accent color |
| Heritage | icon-only plus with Heritage light accent |
| Gallery | icon-only plus with Gallery light accent |

## Accessibility / interaction
- **VERIFIED:** the existing accessible `aria-label` remains owned by the renderer.
- **VERIFIED:** 44×44 CSS px hit target is retained.
- **VERIFIED:** keyboard focus remains available through `:focus-visible`.
- **VERIFIED:** reduced-motion behavior remains explicit.
- **VERIFIED:** no nested interactive controls were introduced.
- **UNKNOWN:** final touch reachability, focus visibility, and image-contrast behavior need physical/browser verification.

## Layering safety
- **VERIFIED:** `position: absolute` is used only to anchor Quick Add inside an existing card/media positioning context.
- **VERIFIED:** a documented local `z-index: 2` is used only to place the action above the product navigation content inside the card.
- **VERIFIED:** no new fixed/sticky/modal/cart layer is introduced.
- **VERIFIED:** no arbitrary large z-index or viewport-wide stacking context is introduced.
- **UNKNOWN:** cross-browser stacking and pointer behavior require runtime verification.

## Regression contract
`tests/quick-add-compact-visual-refinement.test.mjs` now protects:
- stylesheet load order;
- 44px hit target;
- icon-only transparent presentation;
- media/card positioning context;
- logical RTL/LTR placement;
- five-theme coverage;
- sibling relationship outside product-card navigation;
- reduced-motion behavior.

## Verification plan
Run the repository quality gate on the release candidate:

1. `npm run typecheck`
2. `npm test`
3. `npm run lint`
4. `npm run build`
5. `npm run qa:template`
6. Browser/device review for all five themes.

Manual visual matrix:
- small / standard / large mobile;
- tablet / desktop where supported;
- Arabic RTL;
- English LTR;
- mixed-direction names;
- short/long names and SAR prices;
- missing and mixed-ratio images;
- eligible simple products;
- configurable products using the options flow;
- unavailable products;
- empty and populated cart;
- top/middle/bottom scroll positions;
- no overflow, clipping, overlap, or detached actions.

## Limitations
- **BLOCKED:** no local repository checkout/runtime/browser is available in this session, so local commands and physical browser/device capture cannot be executed here.
- **VERIFIED:** current production Vercel can be queried through the connected Vercel surface, but final production verification must wait until this release candidate is deployed.
- **UNKNOWN:** physical-device rendering and manual screen-reader output remain unobserved.

## Scope boundary
Only the Quick Add presentation contract is changed. Product eligibility, cart state, pricing, availability, variants/modifiers, order submission, tenant/branch isolation, authentication, authorization, and database behavior remain protected.
