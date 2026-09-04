# Visual & Functional Audit

## Purpose
Permanent audit record for public-menu templates, visual refinements, SEO/public-page work, and conversion-flow work. This document records evidence; it does not authorize product or template changes by itself.

## Audit status
- Date: 2026-09-05
- Scope: repository-level baseline and future audit contract
- Current product template catalog: `essential`, `editorial`, `noir`, `heritage`, `gallery`
- Visual browser/device execution: **UNKNOWN** in the current agent environment
- Repository evidence: **VERIFIED**

## Evidence baseline
- `src/components/public-menu.tsx` is the shared public-menu renderer and currently imports Search, ShoppingBag, MapPin, Phone, Instagram, and related menu/order behavior.
- The public renderer contains product details, modifiers, cart/order behavior, language handling, and public actions; exact runtime behavior must be tested rather than inferred from icon presence.
- `src/lib/theme/registry.ts` defines five current themes, their families, tokens, layouts, capabilities, and preview classes.
- `package.json` includes Playwright as a development dependency and a `qa:template` script, but this agent session does not have an executable browser/device session or mounted repository checkout. Therefore screenshot execution is not claimed.
- The preview-layer incident is documented in `docs/INCIDENT_PREVIEW_COVERING_LAYER.md`; its diagnostic lesson is to inspect DOM structure, sizing, stacking contexts, pseudo-elements, animation, and responsive constraints before reaching for `z-index`.

## Required visual audit matrix
Every relevant template change must inspect:
- small mobile
- standard mobile
- large mobile
- tablet when supported
- desktop when supported
- Arabic RTL
- English LTR
- mixed-direction text
- short and long restaurant/category/item names
- Arabic-only, English-only, and mixed content
- short and long prices with SAR formatting
- available and sold-out items
- modifiers when supported
- discount states when supported
- missing descriptions and missing images
- portrait, square, landscape, and low-quality images
- sparse and dense category/item counts
- one and multiple branches
- loading, empty, error, offline, and unavailable states

## Visual findings
### Current repository-level findings
- **VERIFIED / MEDIUM:** five theme definitions exist with distinct family metadata, token sets, layout vocabulary, capabilities, and preview classes. A visual distinction is encoded in CSS/theme configuration, but pixel-level quality has not been observed in this session.
- **VERIFIED / HIGH:** public-menu presentation is shared; future audits must distinguish theme-level styling from shared interaction behavior.
- **VERIFIED / HIGH:** preview has a documented history of covering-layer/stacking failures; structural paint-chain inspection is mandatory for future visual regressions.
- **UNKNOWN / HIGH:** final post-hydration rendering at real mobile/desktop viewports, including overlay and sticky-control interaction, because browser/device screenshots were not available.

## Interaction audit
For every interactive control, record: purpose, placement, reachability, touch target, accessible name, focus state, RTL/LTR behavior, success feedback, loading/disabled/error behavior, duplicate-action protection, privacy-safe analytics, and conversion value.

### Cart / ordering
- **VERIFIED:** cart/order implementation exists in the public-menu renderer.
- **UNKNOWN / HIGH:** end-to-end browser behavior, badge accuracy, quantity/modifier editing, persistence during navigation, and final checkout/order-state presentation require runtime testing.
- **Rule:** never imply payment or checkout capability beyond verified repository behavior.

### WhatsApp
- **VERIFIED:** a WhatsApp action is implemented in the public-menu renderer.
- **UNKNOWN / HIGH:** live URL sanitization, mobile/desktop activation, placement, and privacy-safe parameter behavior require runtime verification against configured business data.
- **Rule:** render only when a verified business WhatsApp action exists.

### Phone
- **VERIFIED:** a phone action is implemented in the public-menu renderer.
- **UNKNOWN / MEDIUM:** final `tel:` behavior, label presentation, and competition with ordering CTA require browser/device verification.
- **Rule:** render only when a verified phone number exists.

### Map / location
- **VERIFIED:** MapPin is used by the public-menu renderer.
- **UNKNOWN / MEDIUM:** exact destination/link behavior and multi-branch labeling require runtime verification.
- **Rule:** never show a location action without a usable verified destination.

### Search
- **VERIFIED:** Search is part of the public-menu renderer.
- **UNKNOWN / HIGH:** Arabic, English, mixed-language search, reset, empty results, keyboard behavior, and interaction with sticky navigation require runtime verification.
- **Rule:** retain search only where repository behavior and menu size/value justify it.

### Category navigation
- **VERIFIED:** category navigation is part of the public menu and theme metadata includes navigation variants.
- **UNKNOWN / HIGH:** many-category behavior, active-state clarity, horizontal-scroll traps, sticky overlap, and RTL/LTR behavior require visual/device verification.

### Icons
- **VERIFIED:** the public renderer uses semantic icon components including Search, ShoppingBag, MapPin, Phone, and Instagram, plus a custom WhatsApp icon.
- **Rule:** an icon is not accepted because it merely renders. Verify semantic purpose, accessible naming, touch target, placement, state, and whether text/context is needed.

## Accessibility baseline
- Minimum pointer target requirement: 24×24 CSS pixels or an applicable WCAG exception; important mobile controls should generally target approximately 44×44 CSS pixels when layout permits.
- Visible focus must remain available.
- Essential state/meaning must not depend on color alone.
- Native semantic HTML is preferred; ARIA is added only when required.
- Dialogs, category navigation, selectors, and ordering controls must preserve keyboard/focus behavior.

## Performance baseline
- Preserve stable image aspect ratios/dimensions to reduce layout shift.
- Below-the-fold product imagery should remain lazy-loaded where appropriate.
- Critical above-the-fold imagery must not be lazily loaded by default without evidence.
- Avoid decorative DOM or animation that increases cost without improving comprehension.

## SEO / public-page baseline
- Verify title, description, canonical URL, locale, Open Graph/Twitter preview metadata, headings, branch identity, and structured data against the actual public route and available data.
- Do not add schema claims for unsupported facts.
- Validate `LocalBusiness` data only from verified business/menu fields.

## Severity model
- **CRITICAL:** blocks access, obscures the menu, causes data/action failure, creates a serious privacy/security risk, or prevents the primary journey.
- **HIGH:** materially harms comprehension, conversion, accessibility, responsive behavior, or a core interaction.
- **MEDIUM:** noticeable inconsistency or usability/performance defect with a viable workaround.
- **LOW:** polish issue with limited functional impact.

## Evidence record format
For each finding use:
1. ID and severity
2. Route/theme/state
3. viewport and locale
4. exact evidence (screenshot, DOM/source line, test result, deployment observation, or external source)
5. VERIFIED / INFERRED / UNKNOWN status
6. recommended improvement
7. acceptance criteria
8. verification method
9. status

## Visual tooling status
- **VERIFIED:** Playwright is declared in repository devDependencies and `qa:template` exists.
- **UNKNOWN:** whether a complete stable browser harness, authenticated session, device emulation, screenshot capture, and pixel-diff workflow can be executed from the current environment.
- **UNKNOWN:** current physical-device rendering and post-hydration screenshots.
- Required later evidence: screenshots of relevant routes at small/standard/large mobile and desktop, both RTL and LTR, with realistic fixtures; plus interaction traces for core controls.
