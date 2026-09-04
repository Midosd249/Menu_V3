# Template Review Checklist

Use this checklist for every new template, template redesign, public-menu UI refinement, SEO/public-page change, or conversion-flow change. Do not mark the work complete until every applicable section has evidence.

## 1. Brief and evidence
- [ ] Exact template/family and supported `ThemeKey` are identified.
- [ ] Repository evidence and existing architecture were inspected first.
- [ ] Material research was performed and logged in `docs/design-research-log.md`.
- [ ] Primary action, secondary action, and conversion objective are explicit.
- [ ] Unsupported capabilities are not implied or introduced.

## 2. Visual scan review
- [ ] Entire relevant customer journey inspected, not an isolated component.
- [ ] Small mobile reviewed.
- [ ] Standard mobile reviewed.
- [ ] Large mobile reviewed.
- [ ] Tablet reviewed when supported.
- [ ] Desktop reviewed when supported.
- [ ] Arabic RTL reviewed.
- [ ] English LTR reviewed.
- [ ] Mixed-direction content reviewed.
- [ ] First-screen clarity and restaurant identity are clear.
- [ ] Heading hierarchy, category navigation, product hierarchy, prices, spacing, density, contrast, and alignment are coherent.
- [ ] Long names/descriptions do not clip, overlap, or become unreadable.
- [ ] Missing/low-quality/mixed-ratio images degrade gracefully.
- [ ] Loading, empty, error, offline, sold-out, and unavailable states are reviewed where applicable.
- [ ] Decorative layers never obscure content or intercept input.
- [ ] Sticky/fixed controls, drawers, dialogs, and safe areas do not overlap important content.

## 3. Functional UI and icon audit
For every interactive control:
- [ ] Purpose is obvious.
- [ ] Icon meaning is understandable or supported by visible/accessibility text.
- [ ] Placement matches user expectation and interaction hierarchy.
- [ ] Reachable after scrolling when appropriate.
- [ ] No overlap with content, browser UI, sticky navigation, or decorative layers.
- [ ] Works in RTL and LTR.
- [ ] Touch target is at least 24×24 CSS pixels or meets a documented exception; important mobile controls should generally target ~44×44 when practical.
- [ ] Keyboard access works where relevant.
- [ ] Focus state is visible.
- [ ] Accessible name/state is meaningful.
- [ ] State is not communicated by color alone.
- [ ] Loading, disabled, error, permission-denied, and offline behavior is handled where relevant.
- [ ] Activation gives clear feedback and avoids unintended duplicate actions.
- [ ] Analytics is used only when an existing privacy-safe event model supports it.

## 4. Cart / order flow audit
- [ ] Cart appears only when ordering is enabled.
- [ ] Cart placement does not cover menu content.
- [ ] Cart has an accessible name and clear count behavior.
- [ ] Add-to-cart feedback is immediate and understandable.
- [ ] Quantity, modifiers, and removal are clear.
- [ ] Totals and SAR formatting are accurate.
- [ ] Arabic/RTL and English/LTR states are correct.
- [ ] Navigation does not unexpectedly lose cart state.
- [ ] Empty/loading/error/unavailable states are clear.
- [ ] Checkout/payment is not implied unless actually supported.

## 5. WhatsApp / phone / map audit
### WhatsApp
- [ ] Rendered only for a verified business action.
- [ ] Link is valid and sanitized.
- [ ] Accessible label/text exists.
- [ ] Placement supports conversion without becoming decoration.
- [ ] Mobile and desktop behavior verified.
- [ ] No sensitive customer/order data is exposed in parameters.

### Phone
- [ ] Rendered only for a verified phone number.
- [ ] Valid `tel:` behavior verified.
- [ ] Number or accessible label is clear.
- [ ] Primary ordering action is not unnecessarily displaced.

### Map / location
- [ ] Rendered only for a verified location destination.
- [ ] Destination behavior is safe and understandable.
- [ ] Multi-branch labels identify the correct branch.
- [ ] No decorative map icon without a usable destination.

## 6. Search / category navigation audit
### Search
- [ ] Search is justified by menu size/user value.
- [ ] Arabic search verified.
- [ ] English search verified.
- [ ] Mixed-language search verified when supported.
- [ ] Empty results and reset/clear behavior verified.
- [ ] Keyboard behavior verified.
- [ ] Search does not conflict with sticky navigation or mobile keyboard.

### Categories
- [ ] Many categories remain readable and reachable.
- [ ] Active state is obvious without color alone.
- [ ] RTL/LTR behavior verified.
- [ ] No clipping or accidental taps.
- [ ] Horizontal scrolling does not trap the user.
- [ ] Sticky/category controls do not hide content.

## 7. Real-data resilience audit
- [ ] Short/long restaurant names.
- [ ] Short/long category names.
- [ ] Short/long product names.
- [ ] Arabic-only content.
- [ ] English-only content.
- [ ] Mixed Arabic/English content.
- [ ] Different SAR price lengths.
- [ ] Available/sold-out products.
- [ ] Modifiers/variants where supported.
- [ ] Discount states where supported.
- [ ] Missing descriptions/images.
- [ ] Portrait/square/landscape/low-quality images.
- [ ] Few/many categories.
- [ ] Few/many products.
- [ ] One/multiple branches.

## 8. Mobile safe-area and touch-target audit
- [ ] Bottom actions avoid device safe-area collisions.
- [ ] Fixed/sticky elements do not cover content.
- [ ] Important actions remain reachable with one hand.
- [ ] Touch targets and spacing are measured rather than visually guessed.
- [ ] Browser zoom/text expansion does not destroy the hierarchy where relevant.

## 9. Accessibility audit
- [ ] Semantic HTML is used first.
- [ ] ARIA is limited to necessary semantics.
- [ ] Focus order is logical.
- [ ] Dialog focus behavior is correct where applicable.
- [ ] Contrast is adequate for text and controls.
- [ ] Essential state is not color-only.
- [ ] Reduced-motion behavior is respected.
- [ ] Screen-reader names/state are meaningful for important controls.

## 10. SEO and public-menu audit
- [ ] Title and description reflect the actual menu.
- [ ] Canonical public URL is correct.
- [ ] Locale and language behavior are correct.
- [ ] Open Graph/social metadata is accurate.
- [ ] Headings describe actual content hierarchy.
- [ ] Branch identity and hours are represented only when verified.
- [ ] Structured data reflects real page content and supported facts.
- [ ] No unsupported SEO claims or duplicate canonical identities are introduced.

## 11. Performance audit
- [ ] Critical media is prioritized appropriately.
- [ ] Below-fold images use lazy loading where appropriate.
- [ ] Image dimensions/aspect ratios reduce layout shift.
- [ ] Decorative effects do not create disproportionate runtime cost.
- [ ] No dependency is added for a visual effect without an evidence-backed need.

## 12. Final screenshot / visual-regression review
- [ ] Screenshots captured for all required viewports.
- [ ] RTL/LTR screenshots captured.
- [ ] Before/after comparison performed for refinements.
- [ ] Overflow/clipping/overlap reviewed.
- [ ] Sticky, modal, cart, and category states reviewed.
- [ ] Post-hydration state reviewed.
- [ ] Automated visual regression run when the repository harness supports it.
- [ ] Any unavailable visual tooling is explicitly marked UNKNOWN with exact follow-up evidence required.

## 13. Completion gate
- [ ] All CRITICAL/HIGH findings resolved or explicitly blocked with evidence.
- [ ] Medium/low findings are recorded with status and rationale.
- [ ] Functional verification is complete.
- [ ] Visual verification is complete or its limitation is explicitly recorded.
- [ ] Documentation/evidence updated.
- [ ] No unsupported product behavior was added.
- [ ] Existing product behavior and architecture were preserved.
