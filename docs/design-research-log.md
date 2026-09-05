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

## 2026-09-05 — Business information and opening-hours research

### Google Business Profile / Google Search — restaurant local intent
- Source: https://support.google.com/business/answer/3038177 and https://developers.google.com/search/docs/appearance/structured-data/local-business
- Access date: 2026-09-05
- Category: authoritative local-business guidance
- VERIFIED finding: business profiles and LocalBusiness markup center practical local facts such as address, phone, opening hours, and location context; those facts should remain accurate and reflect the real business.
- Transferable principle: business information should be presented as a compact, trustworthy utility block rather than buried in decorative content.
- Relevance: public menu branch identity, hours, address, phone, and map actions.
- Limitation: search documentation is not a UI specification.
- Confidence: HIGH
- Must not copy: no Google interface styling.

### Digital menu platform patterns — Toast, Square, and Saudi/MENA menu services
- Sources: https://pos.toasttab.com/ ; https://squareup.com/us/en/online-ordering ; https://www.alqaima.com/en ; https://nasjmenu.sa/ ; https://tablegreet.com/en-sa
- Access date: 2026-09-05
- Category: competitor/product-pattern research
- VERIFIED finding: restaurant ordering/menu products consistently prioritize menu discovery, branch/contact details, hours or availability context, category navigation, prices, imagery, and direct order/contact actions. Saudi/MENA offerings additionally emphasize Arabic/English support and QR-first access.
- Transferable principle: put the highest-intent utility facts—open/closed state, hours, branch, location, contact, and menu discovery—within the customer's natural scan path, while keeping the visual treatment subordinate to the menu itself.
- Relevance: business-information hierarchy and public-menu conversion.
- Limitation: these are product/vendor patterns, not controlled comparative usability studies; exact feature availability varies by product and plan.
- Confidence: MEDIUM-HIGH
- Must not copy: no proprietary layouts, branding, copy, assets, screenshots, or source code.

### Opening-hours UX decision for Menu V3
- Source: synthesis of repository schema plus the above public patterns
- Access date: 2026-09-05
- Category: product design decision
- VERIFIED finding: Menu V3 currently stores one opening interval and one closing interval per weekday; therefore the safe UI improvement is clearer status selection, readable localized time presentation, current-day emphasis in public presentation, and fast bulk application—not a new multi-interval data model.
- Transferable principle: make hours scannable in under a few seconds, clearly distinguish Open/Closed, and prevent repetitive data entry where the existing model supports a shared schedule.
- Relevance: `src/routes/studio/branches.tsx` and public menu business-information presentation.
- Limitation: multi-period schedules require a deliberate schema/product decision and are outside this task.
- Confidence: HIGH
- Must not copy: no external product UI.

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

## 2026-09-05 — Editorial premium refinement research

### Repository evidence — Editorial implementation
- Source: `src/lib/theme/registry.ts`, `src/components/templates/contemporary-restaurant.tsx`, `src/theme-editorial.css`, `src/theme-refinements.css`, `src/theme-refinements-v2.css`
- Access date: 2026-09-05
- Category: repository evidence
- VERIFIED finding: `editorial` maps to `contemporary-restaurant`; the template already supports featured products, search/category filtering, product details/modifiers, cart/order, branches, opening hours, WhatsApp, map, phone, and Instagram. The older presentation layers used broad descendant selectors that could style the logo as hero media and force mobile image geometry.
- Transferable principle: isolate Editorial regions with dedicated class/data selectors and let the final Editorial stylesheet own only its presentation.
- Relevance: direct source-level explanation for the screenshot defects and safe refinement boundary.
- Limitation: source inspection does not replace browser evidence.
- Confidence: HIGH
- Must not copy: no proprietary external UI.

### TanStack Router — search parameters
- Source: https://tanstack.com/router/latest/docs/how-to/navigate-with-search-params and https://tanstack.com/router/latest/docs/how-to/setup-basic-search-params
- Access date: 2026-09-05
- Category: official framework documentation
- VERIFIED finding: validated search parameters can be read by route loaders/components and updated with functional navigation while preserving existing search state.
- Transferable principle: public language selection should update the validated `lang` search parameter rather than maintain an unrelated route state.
- Relevance: Arabic/English public menu switching.
- Limitation: documentation does not prove this application's specific content availability.
- Confidence: HIGH
- Must not copy: no proprietary examples.

### MDN — `rel="noopener noreferrer"`
- Source: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/rel/noopener and https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/rel/noreferrer
- Access date: 2026-09-05
- Category: authoritative web platform documentation
- VERIFIED finding: `noopener` prevents a newly opened browsing context from accessing `window.opener`; `noreferrer` additionally omits the referrer and has the `noopener` behavior.
- Transferable principle: configured external restaurant actions opened in a new tab should use `rel="noopener noreferrer"`.
- Relevance: WhatsApp, map, and Instagram links.
- Limitation: link validation remains application-specific.
- Confidence: HIGH
- Must not copy: no proprietary implementation.

### W3C — Focus Not Obscured
- Source: https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/
- Access date: 2026-09-05
- Category: authoritative accessibility standard
- VERIFIED finding: WCAG 2.2 Focus Not Obscured requires focused components not to be entirely hidden by author-created content; sticky footers are a direct example.
- Transferable principle: fixed cart controls and owner preview chrome need explicit content clearance and a documented layer hierarchy.
- Relevance: Editorial cart, dialogs, sticky search, and Studio mobile navigation.
- Limitation: final conformance still requires browser/device inspection.
- Confidence: HIGH
- Must not copy: no external visual treatment.

### User-provided Editorial screenshots — visual evidence
- Source: four screenshots supplied for Editorial
- Access date: 2026-09-05
- Category: supplied visual evidence
- VERIFIED finding: the screenshots show a large logo dominating the hero, excessive hero vertical occupation, a very large rounded/circular-looking product presentation, sparse/blocked content regions, and Studio bottom navigation visible beneath the preview. The visual system reads more like an unstable preview composition than a controlled restaurant menu.
- Transferable principle: separate cover media from the logo, reduce hero height, use stable rectangular media geometry, and preserve normal content flow above owner chrome.
- Relevance: direct acceptance evidence for Editorial refinement.
- Limitation: screenshots alone cannot prove whether each symptom is caused by CSS, the host preview frame, or browser rendering.
- Confidence: HIGH for observed appearance; MEDIUM for source-level causal attribution because the repository confirms a broad header image rule.
- Must not copy: no screenshot-specific branding, assets, or composition.

## Research decision rule
Research is mandatory when the design choice is material, unfamiliar, consequential, or likely to affect accessibility, performance, SEO, conversion, or Saudi-market fit. Skip broad browsing when repository evidence already answers the question.
