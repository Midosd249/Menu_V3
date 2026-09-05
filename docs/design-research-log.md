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
- Transferable principle: mobile scanning and next actions remain primary in a Saudi QR-menu context.
- Relevance: Saudi-market fit and QR-entry expectations.
- Limitation: public vendor claims are not independent customer-behavior research.
- Confidence: MEDIUM
- Must not copy: no layouts, branding, copy, assets, screenshots, or code.

## 2026-09-05 — Noir premium refinement research

### Repository evidence — Noir theme and fine-dining template
- Source: `Midosd249/Menu_V3` `main`, `src/theme-noir.css`, `src/components/templates/fine-dining-hospitality.tsx`, `src/components/public-menu.tsx`, `src/components/menu-theme-controller.tsx`
- Access date: 2026-09-05
- Category: repository evidence
- VERIFIED finding: `noir` maps to the `fine-dining-hospitality` family; the current theme already uses a dark cinematic canvas, immersive hero, sticky category rail, horizontal product cards, and reduced-motion/focus rules. The shared public-menu owns cart/order, search, category navigation, product details, modifiers, and configured customer actions.
- Transferable principle: refine the existing theme instead of introducing a new template or duplicating shared customer-action logic.
- Relevance: defines the exact safe change boundary for premium theme work.
- Limitation: source inspection cannot prove rendered browser behavior.
- Confidence: HIGH
- Must not copy: no external visual assets or proprietary layouts.

### Theme paint/first-render behavior
- Source: `src/components/menu-theme-controller.tsx`, `src/styles.css`
- Access date: 2026-09-05
- Category: repository rendering evidence
- VERIFIED finding: theme CSS is available in the application stylesheet, while `MenuThemeController` applies theme data attributes and token variables with `useLayoutEffect`. The shared base CSS falls back to a light paper canvas when menu tokens are absent.
- Transferable principle: first-paint defects must be diagnosed from actual server HTML/paint/browser evidence; do not mask them with arbitrary delays.
- Relevance: reported old-theme flash and browser background inconsistency.
- Limitation: no executable browser/device trace is available in this environment.
- Confidence: HIGH for source behavior; LOW for reported runtime symptom.

## 2026-09-05 — Essential premium refinement research

### W3C — WCAG 2.2 target size and focus visibility
- Source: https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/ and https://www.w3.org/WAI/WCAG21/Understanding/focus-visible
- Access date: 2026-09-05
- Category: authoritative accessibility standard
- VERIFIED finding: WCAG 2.2 adds Target Size (Minimum) at 24×24 CSS pixels with exceptions; visible keyboard focus remains required, and WCAG 2.2 includes focus-not-obscured guidance relevant to sticky/fixed UI.
- Transferable principle: important mobile controls should be comfortably sized, visibly focused, and kept clear of fixed action surfaces.
- Relevance: Essential category chips, search, language, cart, product cards, and fixed action dock.
- Limitation: standards define conformance requirements, not restaurant-specific visual composition.
- Confidence: HIGH
- Must not copy: no proprietary visual treatment.

### MDN — CSS environment variables and `color-scheme`
- Source: https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Environment_variables/Using and https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/color-scheme
- Access date: 2026-09-05
- Category: authoritative web platform documentation
- VERIFIED finding: `env(safe-area-inset-bottom)` can reserve space for device/browser UI; `color-scheme` controls browser-provided canvas, form controls, and related UI colors.
- Transferable principle: fixed mobile controls should use safe-area environment values, while a deterministic light theme should explicitly declare its color scheme.
- Relevance: Essential action dock and reported browser-background inconsistency.
- Limitation: actual Opera behavior still requires browser reproduction.
- Confidence: HIGH
- Must not copy: no external design.

### web.dev / modern CSS layout principles
- Source: https://web.dev/examples/test
- Access date: 2026-09-05
- Category: web platform/performance guidance
- VERIFIED finding: explicit aspect-ratio containers provide predictable media geometry across responsive layouts.
- Transferable principle: featured and product media need stable boxes so mixed source ratios do not destabilize scanning or layout.
- Relevance: Essential featured cards and product-card media.
- Limitation: exact asset sizes and Core Web Vitals require runtime measurement.
- Confidence: HIGH
- Must not copy: no proprietary layout or assets.

### User-provided Essential screenshots — visual baseline
- Source: five screenshots supplied in this task
- Access date: 2026-09-05
- Category: supplied visual evidence
- VERIFIED finding: the observed Essential states show first-screen congestion, visually dominant WhatsApp treatment, uneven featured composition, dense product-card copy, a fixed bottom owner navigation in preview, and a need for stronger contrast/spacing rhythm. A light public-menu state also confirms that Essential's intended identity is warm/light rather than a dark-only theme.
- Transferable principle: reduce competing first-screen elements, make product information the primary scan path, and keep fixed controls visually subordinate to content.
- Relevance: direct acceptance evidence for the refinement milestone.
- Limitation: screenshots do not prove browser paint timing, console state, exact CSS geometry, or cross-browser behavior.
- Confidence: HIGH for visual observations; LOW for runtime causality.
- Must not copy: screenshot-specific branding, imagery, or layout.

### Repository cross-check — Essential ownership and stabilization
- Source: `src/components/templates/small-menu.tsx`, `src/components/public-menu.tsx`, `src/theme-essential.css`, `src/lib/theme/registry.ts`, `tests/preview-shell.test.mjs`
- Access date: 2026-09-05
- Category: repository evidence
- VERIFIED finding: `essential` maps to the `small-menu` family and is the only free theme; the shared public renderer already owns the customer header/hero, search, categories, featured items, product details, cart, and configured contact actions. The prior stabilization commit already moved theme bootstrap into the document head and removed route-level duplicate public-menu shell ownership.
- Transferable principle: Essential refinement should remove its duplicate template chrome and refine the shared renderer through scoped theme presentation, preserving shared business behavior.
- Relevance: defines the smallest safe implementation boundary.
- Limitation: repository evidence cannot prove rendered visual behavior.
- Confidence: HIGH
- Must not copy: no external implementation.

## Research decision rule
Research is mandatory when the design choice is material, unfamiliar, consequential, or likely to affect accessibility, performance, SEO, conversion, or Saudi-market fit. Skip broad browsing when repository evidence already answers the question.
