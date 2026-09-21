# Gallery — Featured Presentation Refinement

Date: 2026-09-07

## Target
- Template ID: `gallery`
- Template family: `bakery-dessert`
- Public menu renderer: shared `PublicMenuView`
- Scope: Gallery featured section only.

## Evidence
- **VERIFIED:** User-supplied mobile screenshot shows two featured product cards rendered side-by-side under `الأكثر تميزاً`, with two separate food images visible simultaneously.
- **VERIFIED:** `src/components/public-menu.tsx` renders every item in `featured` inside a `grid grid-cols-2 ... sm:grid-cols-3` container.
- **VERIFIED:** `src/theme-gallery.css` intentionally defines the featured area as a two-column image-led grid on mobile and three columns on larger screens.
- **VERIFIED:** `src/theme-gallery-hardening.css` is loaded after the base Gallery stylesheet and is scoped to `data-menu-theme="gallery"`.

## Diagnosis
- **VERIFIED:** The reported defect is the featured-section composition: multiple featured cards are simultaneously visible, while the requested Gallery presentation is one image-led featured item at a time.
- **INFERRED:** A single full-width featured card better preserves Gallery's image-first character and removes the competing split-image composition visible in the screenshot.

## Design decision
- Keep the existing Gallery palette, typography, card language, image treatment, product interaction, and shared renderer unchanged.
- Present only one featured item in the featured presentation.
- Make that item span the available content width.
- Use a stable `4 / 3` featured image ratio on mobile and `16 / 9` on wider screens to keep the image prominent without creating excessive first-screen height.
- Preserve the existing product list below, so featured products remain available through normal category browsing.

## Implementation
- **VERIFIED:** Added a Gallery-only hardening rule in `src/theme-gallery-hardening.css` that changes the featured container to a single full-width presentation and hides subsequent featured buttons from this presentation.
- **VERIFIED:** Added a regression contract to `tests/gallery-browser-hardening.test.mjs` covering the one-item presentation.
- **VERIFIED:** No application logic, data model, routing, backend, authentication, tenant/branch isolation, or deployment configuration was changed.

## Acceptance criteria
- **VERIFIED by source contract:** Featured container is a single presentation unit.
- **VERIFIED by source contract:** Only the first featured button is displayed by the Gallery hardening layer.
- **VERIFIED by source contract:** Featured media has a stable aspect ratio.
- **UNKNOWN:** Final physical-browser pixel output has not been executed in this connector environment.

## Verification
- Source inspection completed for the Gallery renderer, theme CSS, hardening CSS, and stylesheet load order.
- Regression contract updated.
- **BLOCKED:** Local `npm test`, lint, typecheck, build, and physical-device/browser execution cannot be run in this connector environment because the repository cannot be cloned through the available runtime.

## Remaining issue
- The requested one-at-a-time presentation is implemented as one visible featured item per render, not as an automatic carousel. No automatic rotation was introduced because that would add interaction/motion behavior beyond the requested visual correction.

## Exact next task
- Browser-verify the Gallery featured section at small/standard/large mobile and desktop widths, confirm the screenshot defect is visually resolved, then record release/deployment status separately.
