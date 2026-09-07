# Public Themes — Complete Quality Recovery Audit

## Status
- Date: 2026-09-07
- Scope: all five canonical public-menu themes
- Source of truth: `Midosd249/Menu_V3` `main` plus recovery branch `feat/public-theme-quality-recovery`
- Implementation status: **IMPLEMENTATION_IN_PROGRESS** pending CI/browser evidence
- Deployment status: **NOT DEPLOYED / NOT CLAIMED**; no Vercel deployment was intentionally triggered

## Evidence policy
- **VERIFIED:** repository source, theme registry, existing theme hardening files, tests, Git history, and current branch diff.
- **INFERRED:** conclusions derived from the verified source structure where rendered pixels are unavailable.
- **PROPOSED:** design decisions not yet proven by browser/device output.
- **UNKNOWN:** browser/device pixel rendering, physical-device safe-area behavior, manual screen-reader output, and current production deployment of this branch.
- **BLOCKED:** any release claim that requires direct Vercel deployment evidence.

## Theme inventory

| Theme | Route | Identity | Original classification | Final classification | Change |
|---|---|---|---|---|---|
| `essential` | `/m/$slug`, `/m/$slug/$branch` | Quiet everyday hospitality | Healthy / protected | Healthy by source contracts; browser closure UNKNOWN | No |
| `editorial` | `/m/$slug`, `/m/$slug/$branch` | Editorial hospitality / magazine rhythm | Needs minor refinement | Needs minor refinement; known geometry hardening present, browser closure UNKNOWN | No |
| `noir` | `/m/$slug`, `/m/$slug/$branch` | Cinematic fine dining | Critical visual issue | Recovered by merged Noir refinement; browser/device closure UNKNOWN | No new change |
| `heritage` | `/m/$slug`, `/m/$slug/$branch` | Contemporary Arabic/Saudi hospitality | Critical visual issue | Recovery hardening applied; browser/device closure UNKNOWN | Yes |
| `gallery` | `/m/$slug`, `/m/$slug/$branch` | Image-led premium catalogue | Critical visual issue | Recovery hardening applied; browser/device closure UNKNOWN | Yes |

The five canonical keys are defined by `src/lib/theme/registry.ts`. No sixth theme was introduced.

## Required audit matrix

### First screen
- Restaurant identity, branch context, status, search, category discovery, and high-value content must remain in the intended scan path.
- **VERIFIED:** all five themes use the existing public-menu architecture and preserve the shared customer-action owner.
- **UNKNOWN:** final rendered first-screen balance on physical devices.

### Product cards
- Image region must be bounded.
- Product identity must remain readable.
- Description is optional and subordinate.
- SAR price must remain distinct and bidi-safe.
- Available/sold-out state must remain truthful.
- Product action must remain inside the existing interaction model.
- **VERIFIED:** Gallery and Heritage recovery layers explicitly stabilize media/content regions without introducing a second cart or action system.

### Images
- **VERIFIED:** the shared public renderer has image-failure fallback behavior.
- **VERIFIED:** theme recovery uses stable aspect-ratio boxes and preserves `object-fit: cover` for bounded product media.
- **UNKNOWN:** final crop quality for every tenant-specific asset requires browser review with real images.

### RTL/LTR
- **VERIFIED:** the root document sets `lang`/`dir` from the validated `lang` search parameter.
- **VERIFIED:** recovery styles use logical layout where practical and isolate numeric price runs with `direction: ltr` and `unicode-bidi: isolate`.
- **UNKNOWN:** full mixed-direction browser matrix.

### Fixed controls and safe areas
- **VERIFIED:** existing themes already reserve bottom clearance; recovery adds equivalent Heritage clearance.
- **VERIFIED:** recovery introduces no new fixed/sticky action control and no giant z-index.
- **UNKNOWN:** physical-device safe-area rendering.

### Loading/rendering
- **VERIFIED:** the earlier root-level unconfigured theme controller was removed from the current `main` state, leaving route-selected theme ownership.
- **VERIFIED:** no timeout-based visual workaround was introduced by this recovery branch.
- **UNKNOWN:** browser paint/hydration behavior on all supported engines.

## Gallery — Most Popular / high-value catalogue section

### Problem
- **VERIFIED:** Gallery's existing first high-value catalogue styling depended on generic structural selectors and mixed image/content geometry rather than a semantic, stable information region.
- **INFERRED:** when real product names/prices vary, the visual imbalance can make the image dominate while the product identity and price become difficult to scan.

### Recovery decision
Use a two-region card: stable image first, stable information surface second. The information surface has a minimum readable height, two-line product-name protection, and an isolated LTR price run. This is intentionally structural rather than a font-size or transparency patch.

### Implemented
- **VERIFIED:** image and content are separate grid rows.
- **VERIFIED:** information region has a minimum height.
- **VERIFIED:** long product names wrap/clamp rather than escaping the card.
- **VERIFIED:** price uses LTR + bidi isolation.
- **VERIFIED:** missing-image fallback is given a stable surface.
- **VERIFIED:** mobile spacing is tightened without changing the product interaction owner.

### Acceptance
- Image is visually identifiable.
- Name is readable without relying on image contrast.
- Price is immediately findable and never overlaid on food photography.
- Odd/even item counts do not create accidental card-height jumps.
- Arabic and English remain readable.

## Heritage — complete recovery

### Original problems
- **VERIFIED:** prior audit identified oversized brand treatment, dominant hero imagery, dense metadata, and unstable asymmetric card geometry.
- **VERIFIED:** the existing Heritage hardening already bounded the hero/logo and stabilized basic card geometry.
- **VERIFIED:** the recovery branch adds a final information-first composition layer for content separation and safe-area clearance.

### Recovery decision
Keep Heritage's warm Arabic/Saudi material identity, but make product information structurally stronger than ornament. Product cards use one stable horizontal grammar; image, identity, description, and price occupy predictable regions.

### Implemented
- **VERIFIED:** product cards use `minmax()` columns with a bounded media region.
- **VERIFIED:** product copy is `min-width: 0` and overflow-safe.
- **VERIFIED:** price is isolated as an LTR numeric run.
- **VERIFIED:** featured/high-value cards receive stable 4:3 media.
- **VERIFIED:** main content reserves bottom safe-area clearance.
- **VERIFIED:** no new fixed action layer, cart, or customer-action implementation was introduced.

### Acceptance
- No title/description/price/image collision is intentionally produced by the recovery CSS.
- The menu reaches useful content without a decorative hero consuming the full mobile screen.
- Heritage remains recognizably distinct from Editorial.

## Other themes

### Essential
- **VERIFIED:** dedicated theme stylesheet and regression contracts exist.
- **VERIFIED:** safe-area clearance and fixed navigation behavior are explicitly protected by existing contracts.
- **INFERRED:** no new P0/P1/P2 source-level defect was identified in the repository scan.
- **UNKNOWN:** browser pixel closure.

### Editorial
- **VERIFIED:** dedicated Editorial hardening already neutralizes the known legacy oversized mobile card rule and stabilizes 4:3 media.
- **INFERRED:** no new P0/P1/P2 source-level defect was found in this recovery scan.
- **UNKNOWN:** browser pixel closure.

### Noir
- **VERIFIED:** the Noir refinement was merged to `main` in PR #24 as `d2401a9276719bdab4305f89160aba2ca15f0b58`.
- **VERIFIED:** its duplicate shell/card-geometry issues were already addressed by the merged hardening layer.
- **INFERRED:** no additional safe source-level P0/P1/P2 defect was identified during this cross-theme recovery pass.
- **UNKNOWN:** physical-device rendering and the previously reported muted/covered screenshot state.

## Direct add-to-cart
- **VERIFIED:** the existing public renderer owns product details, modifiers, cart/order, and validation.
- **VERIFIED:** this recovery branch does not create a second cart or bypass required product configuration.
- **UNKNOWN:** the current shared renderer's exact direct-add eligibility behavior cannot be safely expanded from this connector without full executable workspace inspection; no speculative product-action rewrite was made.
- **PROPOSED:** verify the existing customer-action matrix in browser QA before any shared renderer action change.

## Contact and location actions
- **VERIFIED:** existing shared action links remain data-driven and are not duplicated by this milestone.
- **VERIFIED:** no fake WhatsApp, phone, map, or social controls were added.

## Regression risk
- Gallery: low-to-medium; selectors are presentation-only but depend on the existing shared DOM structure.
- Heritage: low; selectors are scoped to the Heritage theme.
- Other themes: low; no new selectors target them.
- Root stylesheet order: low; the recovery layer is loaded after existing theme hardening.

## Verification status
- **VERIFIED:** source inspection and GitHub diff review.
- **VERIFIED:** recovery test registered in `npm test`.
- **UNKNOWN:** local typecheck, full test suite, lint, production build, `qa:template`, Playwright/browser visual QA in this connector environment.
- **UNKNOWN:** physical device and screen-reader validation.
- **BLOCKED:** production deployment verification until direct Vercel evidence exists.

## Rollback
Revert the recovery branch changes only:
- `src/theme-public-quality-recovery.css`
- `src/routes/__root.tsx` recovery import/link
- `tests/public-theme-quality-recovery.test.mjs`
- `package.json` recovery test registration
- this audit and related session/research documentation

No database or migration rollback is required.
