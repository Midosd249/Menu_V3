# Editorial Layering and UI Audit

## Scope
- Theme: `editorial`
- Family: `contemporary-restaurant`
- Routes: `/m/$slug`, `/studio/preview?theme=editorial`, `/themes/preview?theme=editorial`
- Audit date: 2026-09-05

## Evidence
- **VERIFIED:** supplied Editorial screenshots show the restaurant logo rendered at an oversized scale, a dark hero/canvas occupying excessive vertical space, large circular-looking product media/clipping, and fixed Studio navigation visible below the preview.
- **VERIFIED:** the previous Editorial stylesheet used broad selectors such as `.menu-public-shell header img`, `.menu-public-shell header > div`, and generic sticky/button selectors. Because the Editorial component's logo was an `img` inside the header, the hero rule could style the logo as full-bleed media.
- **VERIFIED:** `theme-refinements.css` and `theme-refinements-v2.css` contained additional Editorial overrides, including mobile forced image heights and scroll-driven image animation.
- **INFERRED:** the screenshot's oversized logo is explained by the broad `header img` selector; source evidence does not prove every screenshot geometry without browser inspection.

## Layering scale
| Layer | Z-index | Purpose |
|---|---:|---|
| Base content | 0 | hero/content/background |
| Hero media/content | 1–2 | visual cover and readable brand content |
| Preview/action banner | 5–10 | non-modal context only |
| Sticky search/category | 20 | discovery controls |
| Cart trigger | 40 | populated-order entry point |
| Product/cart dialogs | 60 | modal interaction layer |
| Order-success dialog | 70 | terminal confirmation |

The Studio mobile navigation remains owned by `StudioShell` at its existing z-index. Editorial preview mode does not render the cart trigger, so it cannot compete with that owner navigation.

## Stacking-context rules
- **VERIFIED:** `menu-preview-layer.css` intentionally avoids creating an additional isolated stacking context for preview shells.
- **PROPOSED:** Editorial uses one intentional hero stacking context only for its media/shade/content layers.
- **PROPOSED:** no arbitrary `z-index: 9999` values; no overlay is added to hide another component.
- **PROPOSED:** dialogs use fixed layers and safe-area-aware content; search remains below dialogs.
- **PROPOSED:** fixed cart content reserves bottom document space so the trigger does not cover menu content.

## Fixes
1. **Hero media isolation:** cover media is a dedicated `.editorial-hero-media` region rather than an arbitrary `header img`.
2. **Logo isolation:** `.editorial-brand-logo` has an explicit bounded size and overrides legacy generic image positioning.
3. **Product geometry:** product cards use stable grid dimensions and explicit image geometry; transforms are disabled for layout positioning.
4. **No scroll-dependent visibility:** Editorial no longer relies on `animation-timeline: view()` for product visibility.
5. **Final CSS ordering:** Editorial stylesheet is loaded after the shared premium refinement layers so its scoped final rules own the Editorial presentation.
6. **Preview behavior:** fixed cart is hidden in owner preview; the owner shell remains responsible for its own bottom navigation.

## Test scenarios
- Top, middle, and bottom scroll positions.
- Search focused while sticky rail is visible.
- Product dialog open/closed.
- Cart open/closed with one and many items.
- Order-success dialog open.
- Studio preview with mobile bottom navigation.
- Public menu without Studio chrome.
- Arabic RTL and English LTR.
- Small 320–360px viewport, standard mobile, tablet, desktop.
- Reduced motion enabled.
- Missing cover/logo/product images.

## Remaining risks
- **UNKNOWN:** real-device safe-area behavior until browser/device testing is available.
- **UNKNOWN:** exact post-hydration computed stacking order until browser automation is available.
- **UNKNOWN:** whether any browser-specific rendering quirk remains in Opera/Safari.
