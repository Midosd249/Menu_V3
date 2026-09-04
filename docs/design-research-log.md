# Design Research Log

Permanent evidence log for template, UX, visual, conversion, accessibility, performance, SEO, and Saudi-market decisions.

## Recording rules
For every material research activity record: source, access date, source category, VERIFIED finding, transferable principle, relevance to Menu V3, limitation, confidence, and what must not be copied.

## 2026-09-05 — Baseline research

### W3C — WCAG 2.2
- Source: https://www.w3.org/TR/WCAG22/
- Access date: 2026-09-05
- Category: authoritative accessibility standard
- VERIFIED finding: WCAG 2.2 includes a 24×24 CSS-pixel minimum pointer target requirement under SC 2.5.8, with defined exceptions; 44×44 is the enhanced AAA target under SC 2.5.5.
- Transferable principle: controls must be comfortably reachable and sufficiently separated; important mobile controls should use a larger practical target where layout permits.
- Relevance: menu, search, category, cart, close, modifier, language, contact, and location controls.
- Limitation: conformance criteria do not determine visual style or exact component design.
- Confidence: HIGH
- Must not copy: no proprietary visual treatment.

### Google Search Central — LocalBusiness structured data
- Source: https://developers.google.com/search/docs/appearance/structured-data/local-business
- Access date: 2026-09-05
- Category: authoritative SEO guidance
- VERIFIED finding: LocalBusiness structured data communicates verified local-business information and should describe the actual page content.
- Transferable principle: public menu SEO should expose only verified business/menu facts and preserve canonical page identity.
- Relevance: restaurant menu pages, branch identity, hours, location, and local discovery.
- Limitation: structured data does not guarantee a rich result.
- Confidence: HIGH
- Must not copy: no competitor implementation.

### web.dev — Responsive images
- Source: https://web.dev/learn/design/responsive-images
- Access date: 2026-09-05
- Category: authoritative web performance guidance
- VERIFIED finding: responsive image sizing reduces unnecessary transfer; aspect ratio and dimensions help preserve layout stability; appropriate lazy loading reduces below-fold work.
- Transferable principle: food media should use stable containers and appropriate loading priority.
- Relevance: product cards and immersive hero media.
- Limitation: exact thresholds depend on real assets/runtime.
- Confidence: HIGH
- Must not copy: no visual composition or asset.

### Toast — online ordering menus
- Source: https://support.toasttab.com/en/article/Online-Ordering-FAQ
- Access date: 2026-09-05
- Category: official restaurant-platform documentation
- VERIFIED finding: Toast documents mobile menu navigation, search, category navigation, and featured items.
- Transferable principle: discovery and search are core menu infrastructure, especially as menu size grows.
- Relevance: search/category audits and conversion hierarchy.
- Limitation: broader POS/ordering product.
- Confidence: HIGH
- Must not copy: proprietary layout, branding, copy, assets, or interaction styling.

### Saudi/MENA examples — Al Qaima, Nasj Menu, TableGreet
- Sources: https://www.alqaima.com/en ; https://nasjmenu.sa/ ; https://tablegreet.com/en-sa
- Access date: 2026-09-05
- Category: Saudi/MENA digital-menu examples
- VERIFIED finding: public positioning emphasizes QR-first mobile access, Arabic/English presentation, SAR pricing, categories, imagery, and fast browsing/order paths.
- Transferable principle: Noir should remain fast and readable even when its visual language is cinematic; mobile scanning and next actions remain primary.
- Relevance: Saudi-market fit and QR-entry expectations for premium restaurant menus.
- Limitation: public vendor claims are not independent customer-behavior research.
- Confidence: MEDIUM
- Must not copy: no layouts, branding, copy, assets, screenshots, or code.

## 2026-09-05 — Noir premium refinement research

### Repository evidence — Noir theme and fine-dining template
- Source: `Midosd249/Menu_V3` `main`, `src/theme-noir.css`, `src/components/templates/fine-dining-hospitality.tsx`, `src/components/public-menu.tsx`, `src/components/menu-theme-controller.tsx`
- Access date: 2026-09-05
- Category: repository evidence
- VERIFIED finding: `noir` maps to the `fine-dining-hospitality` family; the current theme already uses a dark cinematic canvas, immersive hero, sticky category rail, horizontal product cards, and reduced-motion/focus rules. The shared public-menu owns cart/order, search, category navigation, product details, modifiers, and configured customer actions.
- Transferable principle: refine the existing Noir system instead of introducing a new template or duplicating shared customer-action logic.
- Relevance: defines the exact safe change boundary for this milestone.
- Limitation: source inspection cannot prove rendered browser behavior.
- Confidence: HIGH
- Must not copy: no external visual assets or proprietary layouts.

### Circular-card screenshot claim
- Source: user-provided screenshot referenced by task; current repository source
- Access date: 2026-09-05
- Category: supplied visual evidence + repository cross-check
- VERIFIED finding: current `fine-dining-hospitality` source renders featured items as a three-column card grid at medium widths and the main shared renderer uses structured horizontal product cards. No circular product-card CSS was found in the current Noir source reviewed.
- Transferable principle: do not rewrite or preserve a layout based on an unverified runtime-only observation; first establish whether the composition exists in the current implementation.
- Relevance: circular-versus-grouped-card decision.
- Limitation: the agent lacks a live browser/device screenshot session to compare the deployed rendering.
- Confidence: MEDIUM
- Must not copy: no screenshot-derived proprietary design.

### Theme paint/first-render behavior
- Source: `src/components/menu-theme-controller.tsx`, `src/styles.css`
- Access date: 2026-09-05
- Category: repository rendering evidence
- VERIFIED finding: theme CSS is available in the application stylesheet, while `MenuThemeController` applies theme data attributes and token variables with `useLayoutEffect`. The shared base CSS falls back to a light paper canvas when menu tokens are absent.
- Transferable principle: first-paint defects must be diagnosed from actual server HTML/paint/browser evidence; do not mask them with arbitrary delays.
- Relevance: reported old-theme flash and browser background inconsistency.
- Limitation: no executable browser/device trace is available in this environment.
- Confidence: HIGH for source behavior; LOW for reported runtime symptom.

### Visual performance — web.dev
- Source: https://web.dev/articles/optimize-cls and https://web.dev/articles/serve-responsive-images
- Access date: 2026-09-05
- Category: authoritative performance guidance
- VERIFIED finding: reserved image space and responsive image delivery reduce layout movement and unnecessary mobile transfer.
- Transferable principle: Noir media should remain dimensionally stable and effects should not require heavier assets than the viewport needs.
- Relevance: immersive hero and product cards.
- Limitation: exact runtime impact requires performance tooling.
- Confidence: HIGH
- Must not copy: no assets or layouts.

## Research decision rule
Research is mandatory when the design choice is material, unfamiliar, consequential, or likely to affect accessibility, performance, SEO, conversion, or Saudi-market fit. Skip broad browsing when repository evidence already answers the question.
