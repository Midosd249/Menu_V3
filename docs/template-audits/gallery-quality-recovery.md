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
- **VERIFIED — 2026-09-08:** the current shared-renderer Gallery product wrapper uses `li > div > button`, while the earlier border-removal contract only covered the legacy `li > button` structure. This left the visible border around the image/text/price composition on the current Gallery rendering.

## Design decision
Keep Gallery image-first. Do not place mandatory product information on top of food photography. Use a stable image row followed by a dedicated information row with predictable height, readable name wrapping, and an isolated price run. Gallery product tiles should read as an open editorial catalogue: no enclosing card border, no enclosing card shadow, and no enclosing card background; the image remains the visual anchor with a controlled radius, while typography sits directly on the Gallery canvas.

## Implementation
- **VERIFIED:** added `src/theme-public-quality-recovery.css`, scoped to `data-menu-theme="gallery"`.
- **VERIFIED:** Most Popular/high-value cards use separate image/content rows.
- **VERIFIED:** the content region has a minimum height so cards remain visually balanced with short or long copy.
- **VERIFIED:** names are limited to two lines instead of clipping or expanding unpredictably.
- **VERIFIED:** prices are kept in a single LTR/bidi-isolated line.
- **VERIFIED:** image fallback surfaces remain bounded.
- **VERIFIED:** mobile spacing is reduced slightly while preserving the existing portrait-gallery identity.
- **VERIFIED:** existing Gallery stylesheet and hardening remain loaded before the new recovery layer.
- **VERIFIED — 2026-09-08:** `src/theme-gallery-hardening.css` now explicitly removes `border`, `border-color`, `background`, `box-shadow`, and padding from the current shared-renderer Gallery product card selector while excluding `.public-menu-quick-add` and `.public-menu-options-action`.
- **VERIFIED — 2026-09-08:** the image region retains a controlled `1rem` radius; the text region is borderless and aligned to the Gallery canvas.
- **VERIFIED — 2026-09-08:** hover/focus states no longer reintroduce card chrome; keyboard focus uses an outline instead of a border.
- **VERIFIED — 2026-09-08:** the correction is scoped to `data-menu-theme="gallery"` and does not alter Essential, Editorial, Noir, or Heritage card chrome.

## Tested data scenarios
Source-level contracts cover:
- Arabic and English direction.
- Long product names.
- Missing image fallback.
- Stable aspect-ratio media.
- Price direction isolation.
- Current shared-renderer Gallery card structure.
- Preservation of quick-add/options action classes.

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
- Gallery product cards have no enclosing border, shadow, or background chrome.
- Gallery image retains a deliberate radius and remains visually anchored.
- Existing card click/product-details and customer-action behavior remains unchanged.
- Other themes are not visually modified by the Gallery correction.

## Regression risk
- Low: selectors are explicitly scoped to `data-menu-theme="gallery"` and target only the current Gallery shared-renderer card wrapper.
- The quick-add/options exclusions prevent the correction from stripping action-specific styling.
- No shared business logic was changed.

## Verification
- **VERIFIED:** branch diff and repository source contracts.
- **VERIFIED:** dedicated regression assertions cover the current shared-renderer selector and preserve quick-add/options exclusions.
- **UNKNOWN:** final browser pixels and physical safe-area behavior until the branch is exercised in a browser/device environment.
- **UNKNOWN:** screen-reader output.
- **NOT CLAIMED:** deployment.

## Rollback
Revert the Gallery-specific additions in `src/theme-gallery-hardening.css` and the associated regression assertion. No data or migration rollback is required.
