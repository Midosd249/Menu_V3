# Heritage — Quality Recovery

## Theme and route
- Theme ID: `heritage`
- Template family: `contemporary-restaurant`
- Public routes: `/m/$slug`, `/m/$slug/$branch`
- Preview: `/themes/preview?theme=heritage`
- Identity: contemporary Arabic/Saudi hospitality

## Status
- Implementation: **VERIFIED** in repository source.
- Browser/device visual closure: **UNKNOWN**.
- Deployment: **NOT CLAIMED**.

## Problems found
- **VERIFIED:** previous Heritage audit identified oversized brand treatment, dominant cover imagery, dense metadata, and asymmetric product-card geometry.
- **VERIFIED:** existing Heritage hardening already addressed hero/logo isolation and baseline card geometry.
- **VERIFIED:** this recovery adds a final information-first pass for content width, image bounds, price separation, and bottom safe-area clearance.

## Design decision
Retain the warm parchment/material identity and Arabic hospitality character. Reduce visual competition by making product identity, description, price, and action structurally predictable. Do not add new ornament or new customer-action logic.

## Implementation
- **VERIFIED:** `src/theme-public-quality-recovery.css` is scoped exclusively to Heritage.
- **VERIFIED:** product cards use stable `minmax()` columns and bounded 4:3 media.
- **VERIFIED:** product copy uses `min-width: 0` and overflow-safe wrapping.
- **VERIFIED:** price is an isolated LTR numeric run.
- **VERIFIED:** high-value cards use stable 4:3 media and separate content rows.
- **VERIFIED:** main content reserves bottom safe-area clearance.
- **VERIFIED:** no new fixed control, cart, or ordering system was introduced.

## Tested data scenarios
Source-level contracts cover:
- stable horizontal card geometry;
- 4:3 media;
- long-content wrapping;
- bidi-safe price presentation;
- reduced-motion compatibility;
- hero/logo isolation through the existing Heritage hardening layer.

Browser-level scenarios still requiring execution:
- 360/390/430px mobile;
- tablet/desktop;
- long Arabic/English names;
- long category names;
- varied SAR prices;
- missing/poor images;
- sparse/dense categories;
- product dialog/cart open;
- bottom-of-page safe-area state.

## Acceptance criteria
- No image/title/description/price collision.
- Hero does not delay useful menu content unnecessarily.
- Product cards remain readable with real data variation.
- Heritage remains visually distinct from Editorial.
- RTL/LTR and numeric price runs remain correct.

## Regression risk
- Low: rules are scoped to `data-menu-theme="heritage"` and presentation only.

## Verification
- **VERIFIED:** repository source, existing Heritage audit, current diff, and regression contracts.
- **UNKNOWN:** final browser pixels, physical-device safe-area rendering, and manual screen-reader output.
- **BLOCKED:** deployment verification until direct Vercel evidence exists.

## Rollback
Remove the Heritage-specific rules from `src/theme-public-quality-recovery.css` and retain all pre-existing Heritage hardening unchanged.
