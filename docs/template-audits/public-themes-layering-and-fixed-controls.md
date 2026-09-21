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

## PR #32 Quick Add / Cart refinement review — 2026-09-07
- **VERIFIED:** PR #32 remains open and Draft on `feat/global-quick-add-cart-refinement-v2`, head `3137a74c791ca90e307cf3b8549bfd6e5c315a93`, base `main` at `f3c37d4f17b8f8862cf200c0cae10ed3f6127ee9`.
- **VERIFIED:** the implementation keeps one cart state per public renderer and reuses the existing `submitPublicOrder` path; no second cart/order API was introduced.
- **VERIFIED:** direct Quick Add is conservative: unavailable or invalid-price products are rejected; any configured variant or active modifier group remains on the existing options/details flow.
- **VERIFIED:** the persistent Editorial cart trigger is rendered whenever the public menu is not in preview mode, including an empty cart state.
- **VERIFIED:** shared Quick Add/options controls use a minimum 44px height and the shared bottom action bar includes safe-area spacing.
- **VERIFIED:** source inspection found no giant z-index escalation or timeout/delay workaround in the PR #32 additions.
- **VERIFIED:** Quick Add controls are sibling interactive controls rather than nested buttons.
- **UNKNOWN:** browser rendering, focus visibility, RTL/LTR visual placement, and physical-device safe-area behavior for PR #32 remain unobserved.
- **BLOCKED:** the available local runtime does not contain a checkout of the repository, so local typecheck/lint/test/build and Playwright execution cannot be performed in this session.
- **VERIFIED:** GitHub Actions run `34154971479` for the final head failed at `Generate route tree`; Typecheck, Tests, Lint, Production build, Playwright installation, and all-theme browser QA were skipped. A rerun of the failed job reproduced the same failure state.
- **BLOCKED:** the exact route-tree error text is not exposed by the available GitHub connector job-step surface, so the root cause remains UNKNOWN.
- **VERIFIED:** GitHub reports a Vercel `failure` status for the head pointing to the `build-rate-limit` upgrade target. This is deployment/platform evidence only and is not treated as an application build failure.

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
- **VERIFIED:** PR #32 extends equivalent bottom safe-area handling to the shared public-menu bottom action bar and Editorial cart trigger.
- **UNKNOWN:** physical iOS/Android safe-area rendering because no physical device is available in this connector environment.

## Overlap audit matrix

| Scenario | Source-level result | Browser status |
|---|---|---|
| Top of menu | No new recovery overlay | UNKNOWN |
| Mid-scroll | Product content remains normal flow | UNKNOWN |
| Bottom of menu | Shared PR #32 action surface reserves safe-area spacing; existing theme clearance retained | UNKNOWN |
| Product dialog open | Existing modal layer remains owner | UNKNOWN |
| Cart open | Existing cart layer remains owner | UNKNOWN |
| Fixed action + product card | PR #32 adds sibling actions only; no competing fixed cart system | UNKNOWN |
| RTL | Logical direction rules preserved in source | UNKNOWN |
| LTR | Explicit LTR price runs preserved in source | UNKNOWN |
| Reduced motion | Recovery transition remains governed by existing motion rules | UNKNOWN |

## Anti-patterns explicitly avoided
- Giant z-index values.
- Arbitrary `setTimeout()` delays.
- Duplicate cart systems.
- Duplicate customer action bars.
- Absolute positioning for normal product content.
- Full-viewport decorative layers used to hide a broken layout.
- Transparent overlays as the sole readability solution for mandatory product information.
- Direct Quick Add for configurable products.
- Client-side replacement of the existing order submission path.

## Verification
- **VERIFIED:** repository source and current PR #32 diff reviewed.
- **VERIFIED:** all five canonical themes remain the active registry inventory: `essential`, `editorial`, `noir`, `heritage`, `gallery`.
- **VERIFIED:** no database/schema/auth/authz/subscription/tenant/branch/deployment configuration changes are present in the PR #32 changed-file list.
- **VERIFIED:** current GitHub Actions run and one failed-job rerun both stop at route-tree generation before application quality gates.
- **UNKNOWN:** local runtime, browser/device pixel inspection, manual screen-reader focus traversal, and exact route-tree failure cause.
- **BLOCKED:** production deployment status for this branch is not claimed; no Vercel deployment was intentionally triggered.

## Required manual/browser closure
At minimum, verify each canonical theme at 360px, 390px, 430px, tablet, and desktop where supported; then repeat in Arabic RTL and English LTR with long names, mixed-direction content, long prices, missing images, dense categories, product dialog, Quick Add, cart, and bottom-of-page states.
