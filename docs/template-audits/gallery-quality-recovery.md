# Gallery — Quality Recovery

## Theme and route
- Theme ID: `gallery`
- Template family: `bakery-dessert`
- Public routes: `/m/$slug`, `/m/$slug/$branch`
- Preview: `/themes/preview?theme=gallery`
- Identity: image-led premium catalogue

## Status
- Implementation: **VERIFIED** in repository source.
- Browser/device visual closure: **UNKNOWN**.
- Deployment: **NOT CLAIMED**.

## Problems found
- **VERIFIED:** the first high-value catalogue section used structural selectors tied to the first section and `h2.text-sm`, making the intended information hierarchy brittle.
- **INFERRED:** real data variation in product names, descriptions, and prices can create uneven card information regions and make the image dominate the scan.
- **VERIFIED:** image failure fallback exists in the shared renderer; Gallery needed a stable visual surface for the fallback region.

## Design decision
Keep Gallery image-first. Do not place mandatory product information on top of food photography. Use a stable image row followed by a dedicated information row with predictable height, readable name wrapping, and an isolated price run.

## Implementation
- **VERIFIED:** added `src/theme-public-quality-recovery.css`, scoped to `data-menu-theme="gallery"`.
- **VERIFIED:** Most Popular/high-value cards use separate image/content rows.
- **VERIFIED:** the content region has a minimum height so cards remain visually balanced with short or long copy.
- **VERIFIED:** names are limited to two lines instead of clipping or expanding unpredictably.
- **VERIFIED:** prices are kept in a single LTR/bidi-isolated line.
- **VERIFIED:** image fallback surfaces remain bounded.
- **VERIFIED:** mobile spacing is reduced slightly while preserving the existing portrait-gallery identity.
- **VERIFIED:** existing Gallery stylesheet and hardening remain loaded before the new recovery layer.

## Tested data scenarios
Source-level contracts cover:
- Arabic and English direction.
- Long product names.
- Missing image fallback.
- Stable aspect-ratio media.
- Price direction isolation.

Browser-level scenarios still requiring execution:
- 360/390/430px mobile.
- Tablet/desktop.
- Odd item counts.
- Very long Arabic/English names.
- Long SAR prices.
- Missing descriptions.
- Sold-out products.
- Product dialog/cart open over the section.

## Acceptance criteria
- Product image and product information are visually separate.
- Product name is readable without depending on photography contrast.
- Price remains immediately identifiable.
- Card height remains stable for realistic content variation.
- RTL/LTR behavior is correct.
- Existing card click/product-details behavior remains unchanged.

## Regression risk
- Low-to-medium: recovery selectors intentionally target the current shared public-menu card structure.
- No shared business logic was changed.

## Verification
- **VERIFIED:** branch diff and repository source contracts.
- **UNKNOWN:** final browser pixels and physical safe-area behavior.
- **UNKNOWN:** screen-reader output.
- **BLOCKED:** deployment verification until direct Vercel evidence exists.

## Rollback
Remove the Gallery-specific rules from `src/theme-public-quality-recovery.css` and the stylesheet import from `src/routes/__root.tsx`; no data or migration rollback is required.
