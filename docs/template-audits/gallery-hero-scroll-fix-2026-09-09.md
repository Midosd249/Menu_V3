# Gallery Hero Scroll Fix — 2026-09-09

## Scope
- Theme: `gallery`
- Surface: public-menu home/hero only
- Evidence: Android screenshot supplied on 2026-09-09 showing the Gallery hero remaining visually pinned while menu content scrolls beneath it.

## Findings
- **VERIFIED:** the canonical Gallery renderer is `BakeryDessertTemplate` → `PublicMenuView`; the template comment explicitly protects against a second pinned hero/header.
- **VERIFIED:** the shared public header is intended to remain in normal document flow (`position: relative`).
- **VERIFIED:** Gallery has legacy hardening selectors around an older `.gallery-brand-header` surface that no longer exists in the current renderer.
- **INFERRED:** the reported pinned appearance is a stale/legacy presentation-layer interaction rather than an intentional Gallery interaction pattern.
- **PROPOSED:** make the Gallery hero a strict normal-flow, non-sticky surface and remove visual treatments that can create a fixed-canvas impression. Keep the existing Gallery identity, logo, language control, and valid contact actions.

## Implemented contract
- Gallery `header` must use normal document flow: `position: relative !important`, `top/inset: auto`, and no transform.
- The cover media layer remains absolutely positioned **inside the header only**, so it scrolls with the hero rather than the viewport.
- `background-attachment` is explicitly `scroll` for Gallery.
- Hero height is bounded to a compact mobile-first range so the catalogue appears promptly.
- Header controls remain reachable and visually consistent with the existing public action system.
- No fixed/sticky customer-action behavior is changed.
- No other theme is modified.

## Preservation
- Essential, Editorial, Noir, Heritage/Taste, and all existing Gallery catalogue/Quick Add behavior remain untouched.
- No theme registry, renderer mapping, data, auth, order, or deployment behavior changes.

## Verification plan
- Source contract test: no Gallery hero `position: fixed/sticky` or `background-attachment: fixed`.
- Typecheck, tests, lint, build.
- Browser Template QA for all themes, with particular attention to Gallery mobile scroll and hero/action stacking.

## Evidence labels
- `VERIFIED`: repository structure and screenshot evidence.
- `INFERRED`: stale/legacy presentation interaction as the likely cause.
- `PROPOSED`: exact visual bounds until browser evidence confirms final pixels.
