# Gallery — Final Borderless Card and Description Clipping Fix — 2026-09-08

## Scope
- Theme: `gallery` only.
- Template family: `bakery-dessert`.
- Surface: public-menu product catalogue cards.
- Protected: Essential, Editorial, Noir, Heritage, shared ordering/cart logic, data/auth/authz, tenant/branch isolation, CI/CD, and deployment configuration.

## Evidence
- **VERIFIED:** user-provided device screenshots show a visible rounded border enclosing Gallery product image, name, price, and description; the lower edge can visually cut into description text.
- **VERIFIED:** current repository loads `theme-gallery.css` followed by `theme-gallery-hardening.css`, with `theme-price-consistency.css` loaded last.
- **VERIFIED:** the shared-renderer product path is represented by `li > div > button` in the Gallery price/card contracts.
- **VERIFIED:** the previous Gallery hardening removed card chrome from the shared-renderer button but still left the possibility of legacy border/overflow rules on the surrounding `li` or wrapper and retained `overflow: hidden` on the card button.

## Diagnosis
- **INFERRED:** the screenshot symptom is consistent with a presentation-layer chrome/overflow conflict rather than a data or product-rendering logic problem.
- The correction therefore stays entirely inside the Gallery presentation layer and does not change product markup, ordering behavior, or shared action logic.

## Final design decision
Gallery product cards are an open editorial catalogue unit:
1. no enclosing border;
2. no enclosing border radius;
3. no enclosing background or shadow;
4. the image wrapper owns the only deliberate radius and its own clipping;
5. the text region grows naturally with content;
6. the product card itself must not clip descriptions;
7. quick-add/options action styling remains protected through explicit selector exclusions.

## Implementation
- Updated `src/theme-gallery-hardening.css` with a final Gallery-only hard stop that clears border, radius, background, and shadow from:
  - the product `li`;
  - the immediate product wrapper;
  - the legacy direct product button path;
  - the current `li > div > button` path.
- Set the Gallery product card button height to `auto`, removed max-height constraints, and changed its overflow to `visible` so description content cannot be clipped by the card shell.
- Kept the image wrapper as the only clipping surface and retained a controlled `1rem` image radius.
- Kept `.public-menu-quick-add` and `.public-menu-options-action` excluded from card reset selectors.
- Added a regression test asserting the wrapper reset and non-clipping text behavior.

## Verification plan
- Automated: run `npm test`, `npm run typecheck`, `npm run lint`, and `npm run build` through the repository CI gate.
- Browser: Gallery at 360/390/430px, tablet, and desktop; Arabic RTL, English LTR, mixed-direction content; long names/descriptions; varied SAR prices; missing images; odd product counts; cart/fixed actions.
- Device: re-check the exact Android screenshot scenario after the release candidate is deployed.

## Current evidence status
- **VERIFIED:** source-level selector scope and regression assertions.
- **UNKNOWN:** final browser pixels until the branch is executed in the browser QA environment.
- **UNKNOWN:** final physical-device pixels until the user rechecks the released build.
- **NOT CLAIMED:** deployment.

## Rollback
Revert the Gallery-specific hard-stop block and its regression assertion. No data, migration, auth, or infrastructure rollback is required.
