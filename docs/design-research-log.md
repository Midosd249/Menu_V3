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
- Relevance: applies to menu, search, category, cart, close, modifier, language, contact, and location controls.
- Limitation: conformance criteria do not determine the visual style or exact component design.
- Confidence: HIGH
- Must not copy: no proprietary visual treatment exists to copy; apply the accessibility principle only.

### Google Search Central — LocalBusiness structured data
- Source: https://developers.google.com/search/docs/appearance/structured-data/local-business
- Access date: 2026-09-05
- Category: authoritative SEO guidance
- VERIFIED finding: LocalBusiness structured data can communicate business information such as hours and help search engines understand local business pages; markup must describe actual page content.
- Transferable principle: public menu SEO should expose only verified business/menu facts and should align structured data with visible and canonical page content.
- Relevance: public restaurant menu pages, branch identity, hours, and local discovery.
- Limitation: structured data does not guarantee a search feature or rich result.
- Confidence: HIGH
- Must not copy: no competitor implementation; only the documented SEO principle.

### web.dev — Responsive images and lazy loading
- Source: https://web.dev/learn/design/responsive-images
- Access date: 2026-09-05
- Category: authoritative web performance guidance
- VERIFIED finding: responsive image sizing reduces unnecessary transfer; explicit dimensions preserve layout space; below-fold images are candidates for lazy loading while critical above-fold imagery should not be lazily loaded by default.
- Transferable principle: template image contracts must distinguish critical media from below-fold media and preserve stable aspect ratios.
- Relevance: product cards, hero media, Gallery/Editorial imagery, mobile performance, and layout stability.
- Limitation: exact thresholds depend on real assets and runtime conditions.
- Confidence: HIGH
- Must not copy: no visual composition or asset from the source.

### Toast — online ordering menus
- Source: https://support.toasttab.com/en/article/Online-Ordering-FAQ
- Access date: 2026-09-05
- Category: official restaurant-platform documentation
- VERIFIED finding: Toast documents mobile/desktop menu navigation, high-performance search, and a mobile bottom-sheet category navigator; it also supports featured/special items.
- Transferable principle: category discovery and search should be treated as core menu infrastructure, particularly for large menus, rather than ornamental UI.
- Relevance: search/category navigation and conversion-flow audits.
- Limitation: Toast is a broader ordering/POS platform and its constraints do not define Menu V3.
- Confidence: HIGH
- Must not copy: proprietary layout, branding, copy, assets, or interaction styling.

### Square — QR ordering
- Source: https://squareup.com/us/en/online-ordering/qr-code-ordering
- Access date: 2026-09-05
- Category: official restaurant-platform documentation
- VERIFIED finding: Square describes a mobile-optimized browsing/order experience initiated through QR codes and ties QR destinations to specific ordering locations.
- Transferable principle: when a menu is accessed through QR, the first interaction should make browsing and the next useful action obvious on mobile; branch/table context must remain clear when applicable.
- Relevance: QR-driven public menu entry and conversion audits.
- Limitation: Square's ordering/payment stack is broader than the capabilities that may exist in Menu V3.
- Confidence: HIGH
- Must not copy: proprietary screens, branding, text, assets, or product architecture.

### GitHub / Menu V3 repository
- Source: Midosd249/Menu_V3 `main`
- Access date: 2026-09-05
- Category: repository evidence
- VERIFIED finding: current repository state defines five theme keys and a shared public-menu renderer; Playwright and a template-QA script are present in the package manifest.
- Transferable principle: repository behavior is the first source of truth; visual claims must not outrun runtime evidence.
- Relevance: all future template and public-menu work.
- Limitation: connected GitHub access does not provide an authenticated browser/device session in this agent environment.
- Confidence: HIGH
- Must not copy: no external code or proprietary assets.

## Market-source policy
Saudi/MENA examples may be added when a material design decision requires regional evidence. Use primary sources, credible research, or directly observable public product behavior. Do not treat a single restaurant site or social post as representative customer behavior.

## Research decision rule
Research is mandatory when the design choice is material, unfamiliar, consequential, or likely to affect accessibility, performance, SEO, conversion, or the Saudi-market fit. Skip broad browsing when repository evidence already answers the question.
