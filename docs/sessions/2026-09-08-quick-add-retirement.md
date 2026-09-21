# Session — 2026-09-08 — Quick Add Retirement

## Classification
- Public-menu visual/interaction cleanup.
- Scope: remove the Quick Add control from every active public-menu theme.
- Preserve: product details/options flow, cart state, checkout/order submission, pricing, availability, and theme layouts.

## Verified Evidence
- Current `main` is `f371ab34ed0f466507c25e7081165f1252960112` before this change.
- The repository contains the shared `public-menu-quick-add` presentation layer and theme-specific rules for Essential, Editorial, Noir, Heritage, and Gallery.
- Existing public renderers and cart infrastructure remain in place.

## Implementation
- Replaced `src/quick-add-compact-refinement.css` with a retirement layer that force-hides `.public-menu-quick-add` after all public theme CSS layers.
- Added explicit theme selectors for all five active public themes so legacy theme geometry cannot re-display the control.
- Replaced the two Quick Add-specific regression contracts with retirement-focused assertions.
- No product/order/cart business logic was removed.

## Verification Plan
- Confirm the new CSS contains the retirement rule and all five theme selectors.
- Confirm the public renderers and ProductSheet/cart flow remain present.
- Run the repository's existing CI quality gates on the resulting `main` commit.
- Real-device Android visual QA remains required for final physical-pixel confirmation.

## Status
- Implementation: committed directly to `main`.
- Deployment: pending CI/Vercel evidence.
- UNKNOWN: final production-rendered Android pixels until the deployment is observed on-device.
