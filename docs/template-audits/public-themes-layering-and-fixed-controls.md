# Public Themes — Layering and Fixed Controls Audit

## Status
- Date: 2026-09-07
- Scope: all five canonical public-menu themes
- Evidence status: **VERIFIED** for source structure; browser/device pixel closure is **UNKNOWN**

## Layering inventory
The public menu uses a small set of intentional layers. The audit rejects arbitrary z-index escalation as a visual repair technique.

| Layer | Evidence | Intended responsibility |
|---|---|---|
| Base document/theme surfaces | **VERIFIED** | Canvas, header, content, theme decoration |
| Sticky discovery controls | **VERIFIED** | Search/category discovery where theme CSS defines it |
| Fixed customer action/navigation | **VERIFIED** | Cart/action dock where existing renderer provides it |
| Product dialog/sheet | **VERIFIED** | Product details and required modifiers |
| Cart dialog/drawer | **VERIFIED** | Existing cart/order interaction |
| Toast/status feedback | **VERIFIED** | Existing transient feedback |
| Owner preview chrome | **VERIFIED** | Preview-only host controls when present |

## Source-level stacking findings
- **VERIFIED:** the shared public renderer uses explicit fixed modal/drawer layers for product and cart interactions.
- **VERIFIED:** theme CSS uses sticky discovery regions and reserves bottom content clearance in the existing protected themes.
- **VERIFIED:** the Noir hardening pass removed the need for decorative/staggered presentation layers to control product geometry.
- **VERIFIED:** the Gallery/Heritage recovery layer adds no new fixed/sticky customer control and no arbitrary z-index value.
- **VERIFIED:** the recovery branch contains no `z-index: 999`-style escalation and no timeout-based rendering workaround.

## Final layering rules
1. Normal document content stays in normal flow.
2. Sticky search/category UI may sit above scrolling content but must not cover text or actions.
3. Fixed cart/customer actions reserve document clearance using the existing safe-area approach.
4. Product dialogs and cart drawers sit above page content because they are modal interaction states.
5. Transient feedback must not obscure the primary action it reports on.
6. Preview/owner chrome must remain visually and structurally distinct from customer-facing menu content.
7. A new stacking context is justified only when it establishes a real component boundary; it is not a workaround for incorrect layout.

## Safe-area rules
- **VERIFIED:** public-menu root metadata uses `viewport-fit=cover`.
- **VERIFIED:** protected themes already use `env(safe-area-inset-bottom, 0px)` for bottom clearance.
- **VERIFIED:** the recovery layer extends equivalent bottom clearance to Heritage.
- **UNKNOWN:** physical iOS/Android safe-area rendering because no physical device is available in this connector environment.

## Overlap audit matrix

| Scenario | Source-level result | Browser status |
|---|---|---|
| Top of menu | No new recovery overlay | UNKNOWN |
| Mid-scroll | Product content remains normal flow | UNKNOWN |
| Bottom of menu | Heritage clearance added; other protected themes retain existing clearance | UNKNOWN |
| Product dialog open | Existing modal layer remains owner | UNKNOWN |
| Cart open | Existing cart layer remains owner | UNKNOWN |
| Fixed action + product card | Recovery does not add a competing fixed action | UNKNOWN |
| RTL | Logical direction rules preserved | UNKNOWN |
| LTR | Explicit LTR price runs preserved | UNKNOWN |
| Reduced motion | Recovery transition is disabled | UNKNOWN |

## Anti-patterns explicitly avoided
- Giant z-index values.
- Arbitrary `setTimeout()` delays.
- Duplicate cart systems.
- Duplicate customer action bars.
- Absolute positioning for normal product content.
- Full-viewport decorative layers used to hide a broken layout.
- Transparent overlays as the sole readability solution for mandatory product information.

## Verification
- **VERIFIED:** repository source and current branch diff reviewed.
- **VERIFIED:** no database/schema/auth/authz/subscription/tenant/branch/deployment configuration changes in the recovery branch.
- **UNKNOWN:** interactive browser/device pixel inspection.
- **UNKNOWN:** manual screen-reader focus traversal.
- **BLOCKED:** production deployment status for this branch is not claimed; no Vercel deployment was intentionally triggered.

## Required manual/browser closure
At minimum, verify each canonical theme at 360px, 390px, 430px, tablet, and desktop where supported; then repeat in Arabic RTL and English LTR with long names, mixed-direction content, long prices, missing images, dense categories, product dialog, cart, and bottom-of-page states.
