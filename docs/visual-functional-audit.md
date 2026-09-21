# Visual & Functional Audit

## Purpose
Permanent audit record for public-menu templates, visual refinements, SEO/public-page work, and conversion-flow work. This document records evidence; it does not authorize product or template changes by itself.

## Audit status
- Date: 2026-09-05
- Scope: repository-level baseline, Essential refinement record, and Noir premium refinement
- Current product template catalog: `essential`, `editorial`, `noir`, `heritage`, `gallery`
- Visual browser/device execution: **UNKNOWN** in the current agent environment
- Repository evidence: **VERIFIED**

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

## Noir premium refinement — 2026-09-05
### Scope
- Theme: `noir`
- Family: `fine-dining-hospitality`
- Routes: `/m/$slug` and `/m/$slug/$branch`
- **VERIFIED:** theme registry, template component, shared public-menu renderer, theme controller, and Noir stylesheet were inspected before implementation.

### Visual findings
- **VERIFIED / HIGH:** Noir already has a coherent dark cinematic system with warm bronze accent, immersive hero, sticky category rail, and structured horizontal product cards.
- **VERIFIED / HIGH:** the current repository source does not contain the screenshot-reported circular product-card implementation. The circular issue is therefore not treated as a source-level defect without runtime evidence.
- **PROPOSED / HIGH:** preserve the structured card model and refine hierarchy rather than introduce a new circular composition. Readability and scanability outrank novelty.
- **VERIFIED / MEDIUM:** current Arabic typography has explicit RTL overrides; long-text resilience and price separation remain important review targets.
- **UNKNOWN / HIGH:** actual rendered alignment, clipping, overlap, and sticky-layer behavior until browser/device screenshots are captured.

### Hero/header
- **VERIFIED:** restaurant name, branch name, optional configured tagline, logo/fallback, and language control are data-driven.
- **REFINEMENT TARGET:** configured tagline should carry the descriptive identity when present; generic eyebrow text should remain subordinate and must not imply unsupported restaurant claims.
- **ACCEPTANCE:** missing tagline must not create broken spacing or invented marketing copy.

### Typography / cards
- **REFINEMENT TARGET:** strengthen text hierarchy, preserve readable Arabic line-height, use balanced headings, keep prices visually distinct, and prevent long names from forcing unstable card dimensions.
- **REFINEMENT TARGET:** preserve stable image containers and food recognition; avoid filters that make products visually unclear.
- **ACCEPTANCE:** no clipping, overlap, price wrapping that obscures meaning, or unstable card height caused by realistic Arabic/English/mixed content.

### Circular vs grouped decision
- **DECISION: Option B only if runtime evidence later confirms the circular composition exists.**
- Current source uses structured cards; no speculative circular rewrite is made.
- If the screenshot represents a deployed-only state not present in source, the next browser audit must capture it before any targeted rewrite.

### Interaction findings
- **VERIFIED:** shared public-menu contains product details, modifiers, cart/order behavior, search/category navigation, language handling, and configured customer actions.
- **RULE:** Noir styling must not duplicate or replace these business interactions.
- **RULE:** WhatsApp, phone, map/location, and social actions remain conditional on verified configured data.
- **RULE:** cart and add-to-order behavior must remain visible and usable when ordering is enabled.
- **UNKNOWN / HIGH:** end-to-end browser activation, feedback, focus, and mobile reachability until runtime evidence exists.

### Opera background
- **UNKNOWN / HIGH:** the reported white background in Opera cannot be reproduced without an Opera browser session.
- **VERIFIED:** shared CSS has a light fallback when menu theme tokens are absent; `MenuThemeController` applies theme tokens in `useLayoutEffect`.
- **Decision:** no browser-specific hack or timeout is added without reproduction evidence.

### Initial old-theme flash
- **UNKNOWN / HIGH:** no first-paint browser trace is available.
- **VERIFIED:** theme tokens/data attributes are applied by `MenuThemeController`; shared base styles provide a default light canvas before theme tokens are present.
- **INFERRED:** a first-paint mismatch is possible, but root cause cannot be certified from source alone.
- **Decision:** do not conceal the issue with forced delays or heavy client-only rendering.

### Accessibility
- **VERIFIED:** WCAG 2.2 target-size guidance is recorded in the research log.
- **REFINEMENT TARGET:** preserve visible focus, meaningful accessible names, adequate touch targets, and non-color-only state communication.
- **UNKNOWN:** actual keyboard/focus traversal and device tap ergonomics until browser/device execution.

### Performance
- **VERIFIED:** product media uses lazy loading in the shared renderer and Noir uses stable image containers.
- **REFINEMENT TARGET:** keep hero/media priority intentional and avoid unnecessary decorative runtime cost.
- **UNKNOWN:** actual Core Web Vitals until performance tooling is executed against the rendered route.

## Essential refinement — 2026-09-05
- **VERIFIED / HIGH:** Essential retains its original `essential` key, Free tier, `small-menu` family, horizontal product-card model, sticky category model, and quiet visual direction.
- **VERIFIED / MEDIUM:** Essential presentation protects narrow layouts and long bilingual/mixed-direction content from avoidable overflow, keeps SAR prices from wrapping, and raises key control minimum heights to a practical mobile target.
- **VERIFIED / HIGH:** Essential preview sections are explicitly forced to visible state when preview mode is active, addressing the known scroll-linked preview visibility failure mode.
- **UNKNOWN / HIGH:** actual screenshots and complete interaction journeys remain unobserved until browser/device QA.

## Interaction audit baseline
For every interactive control, record: purpose, placement, reachability, touch target, accessible name, focus state, RTL/LTR behavior, success feedback, loading/disabled/error behavior, duplicate-action protection, privacy-safe analytics, and conversion value.

### Cart / ordering
- **VERIFIED:** cart/order implementation exists in the public-menu renderer.
- **UNKNOWN / HIGH:** end-to-end browser behavior, badge accuracy, quantity/modifier editing, persistence during navigation, and final order-state presentation require runtime testing.
- **Rule:** never imply payment or checkout capability beyond verified repository behavior.

### WhatsApp
- **VERIFIED:** a WhatsApp action is implemented in the public-menu renderer.
- **UNKNOWN / HIGH:** live activation, placement, and privacy-safe parameter behavior require runtime verification against configured business data.
- **Rule:** render only when a verified business WhatsApp action exists.

### Phone
- **VERIFIED:** a phone action is implemented in the public-menu renderer.
- **UNKNOWN / MEDIUM:** final `tel:` behavior and label presentation require browser/device verification.

### Map / location
- **VERIFIED:** MapPin is used by the public-menu renderer.
- **UNKNOWN / MEDIUM:** exact destination/link behavior and multi-branch labeling require runtime verification.

### Search
- **VERIFIED:** Search is part of the public-menu renderer.
- **UNKNOWN / HIGH:** Arabic, English, mixed-language search, reset, empty results, keyboard behavior, and sticky interaction require runtime verification.

### Category navigation
- **VERIFIED:** category navigation is part of the public menu and theme metadata includes navigation variants.
- **UNKNOWN / HIGH:** many-category behavior, active-state clarity, horizontal-scroll traps, sticky overlap, and RTL/LTR behavior require visual/device verification.

### Icons
- **VERIFIED:** the renderer uses Search, ShoppingBag, MapPin, Phone, Instagram, and a custom WhatsApp icon.
- **Rule:** icon presence is not proof of usability; verify semantic purpose, accessible naming, touch target, placement, state, and context.

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
5. VERIFIED / INFERRED / UNKNOWN / PROPOSED status
6. recommended improvement
7. acceptance criteria
8. verification method
9. status

## Visual tooling status
- **VERIFIED:** Playwright is declared in repository devDependencies and `qa:template` exists.
- **UNKNOWN:** whether a complete stable browser harness, authenticated session, device emulation, screenshot capture, and pixel-diff workflow can be executed from the current environment.
- **UNKNOWN:** physical-device rendering, QR scanning, Opera behavior, and post-hydration screenshots.
- Required later evidence: Noir screenshots at small/standard/large mobile and supported desktop/tablet widths, both RTL and LTR, with realistic fixtures; plus interaction traces for core controls and Opera comparison.
