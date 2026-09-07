# Design Research Log — 2026-09-07 Public Theme Recovery

## Scope
Gallery and Heritage public-menu recovery, with cross-theme layering and responsive-quality review.

## W3C — Arabic & Persian Layout Requirements
- Source: https://www.w3.org/International/alreq/
- Access date: 2026-09-07
- Category: authoritative internationalization guidance
- VERIFIED finding: Arabic is RTL at page/layout level, while numbers and embedded LTR content require bidirectional handling; Arabic line breaking and alignment have script-specific requirements.
- Transferable principle: product names and numeric SAR values need deliberate direction handling; logical layout is preferable to physical left/right duplication.
- Relevance: Gallery and Heritage product cards.
- Limitation: W3C does not prescribe restaurant card composition.
- Confidence: HIGH
- Must not copy: no proprietary design.

## W3C — WCAG 2.2 Contrast
- Source: https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum
- Access date: 2026-09-07
- Category: authoritative accessibility standard
- VERIFIED finding: normal text should meet a 4.5:1 contrast ratio, with defined exceptions for large text and other cases.
- Transferable principle: mandatory product information should sit on a stable surface rather than depending on food photography for contrast.
- Relevance: Gallery Most Popular and Heritage product information.
- Limitation: final contrast still requires rendered browser measurement for every actual theme/content combination.
- Confidence: HIGH
- Must not copy: no external visual treatment.

## WCAG 2.2 — Target Size
- Source: https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/
- Access date: 2026-09-07
- Category: authoritative accessibility standard
- VERIFIED finding: pointer targets have a 24×24 CSS-pixel minimum with exceptions; important mobile controls should be larger when practical.
- Transferable principle: recovery must not reduce existing action reachability while tightening visual density.
- Relevance: product cards, language, cart, and fixed customer actions.
- Limitation: target size alone does not prove usability.
- Confidence: HIGH
- Must not copy: no external UI.

## MDN — Aspect ratio and responsive images
- Source: https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Box_sizing/Aspect_ratios
- Source: https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Performance/Multimedia
- Access date: 2026-09-07
- Category: authoritative web platform/performance guidance
- VERIFIED finding: explicit aspect ratios reserve media space and reduce layout shift; `object-fit` controls how replaced media fits its allocated box.
- Transferable principle: stable image boxes are preferable to arbitrary image heights when source assets have varied ratios.
- Relevance: Gallery portrait catalogue and Heritage landscape cards.
- Limitation: exact crop/focal-point quality requires browser inspection with real assets.
- Confidence: HIGH
- Must not copy: no proprietary layout or assets.

## MDN — CSS logical properties
- Source: https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Logical_properties_and_values/Margins_borders_padding
- Access date: 2026-09-07
- Category: authoritative web platform guidance
- VERIFIED finding: logical margin/padding/border properties follow writing direction and are preferable for direction-aware layout.
- Transferable principle: theme presentation should not fork purely because Arabic is RTL.
- Relevance: Heritage/Gallery recovery selectors and future theme work.
- Limitation: existing DOM structure still constrains some selectors.
- Confidence: HIGH
- Must not copy: no proprietary implementation.

## Saudi/MENA digital-menu pattern research
- Source: https://nasjmenu.sa/
- Source: https://tablegreet.com/en-sa
- Access date: 2026-09-07
- Category: Saudi/MENA market pattern research
- VERIFIED finding: public positioning emphasizes QR-first mobile access, bilingual Arabic/English presentation, imagery, prices, categories, and direct customer actions.
- Transferable principle: Saudi visual identity should sit on top of a fast, readable mobile menu; imagery should strengthen discovery rather than obscure menu facts.
- Relevance: Heritage Arabic/Saudi identity and Gallery image-led catalogue.
- Limitation: vendor claims are market-pattern evidence, not independent controlled usability research.
- Confidence: MEDIUM
- Must not copy: no layouts, branding, copy, assets, screenshots, or code.

## Repository evidence — current five-theme system
- Source: `src/lib/theme/registry.ts`, existing theme styles/hardening files, public-menu renderer, tests, and Git history.
- Access date: 2026-09-07
- Category: repository evidence
- VERIFIED finding: Menu V3 has five canonical public themes: `essential`, `editorial`, `noir`, `heritage`, and `gallery`. The shared public renderer owns customer interactions; theme layers should remain presentation-only.
- Transferable principle: fix theme defects with scoped presentation layers before considering shared architectural changes.
- Relevance: recovery architecture.
- Limitation: source inspection cannot prove browser pixels.
- Confidence: HIGH
- Must not copy: no external implementation.

## Recovery decision
- VERIFIED: Gallery and Heritage already had dedicated theme hardening layers from the prior refinement batch.
- VERIFIED: the new recovery layer is additive, theme-scoped, loaded after existing theme hardening, and introduces no database, ordering, auth/authz, dependency, or deployment changes.
- INFERRED: the safest response to the reported visual failures is to strengthen information-region geometry rather than add more decorative layers or stacking contexts.
- PROPOSED: complete interactive browser/device validation before declaring the milestone visually closed.
