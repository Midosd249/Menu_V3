# Premium Digital Menu Design Intelligence

Permanent design-quality reference for Menu V3 public menus, templates, SEO, conversion flows, and customer-facing UI.

## Product context
Menu V3 is an Arabic-first, bilingual, mobile-first, multi-tenant digital-menu SaaS for restaurants and cafes. The repository and verified runtime capabilities are the source of truth.

## Permanent workflow
**DISCOVER → AUDIT → SEGMENT → RESEARCH → DESIGN BRIEF → PLAN → IMPLEMENT → REAL-DATA TEST → VISUAL REVIEW → FUNCTIONAL REVIEW → VERIFY → DOCUMENT → STOP**

Use only the expert lenses relevant to the task: restaurant product strategy, Saudi-market research, digital-menu UX/UI, mobile interaction, Arabic/RTL typography, design systems, frontend engineering, accessibility, performance, local SEO, QA/visual regression, and security/privacy for customer actions and external links.

## Saudi and MENA principles
- Treat QR entry as a mobile-first arrival point.
- Prioritize Arabic readability and intentional RTL behavior; English LTR must remain equally coherent when enabled.
- Keep branch identity, availability, pricing, contact and location information truthful to configured data.
- Treat SAR formatting as a first-class content state.
- Make browsing, category discovery, search, product detail, and supported ordering/contact actions obvious without visual noise.
- Use Saudi/MENA examples as evidence for transferable patterns, not as templates to copy.

## Visual quality
- Information hierarchy beats decoration.
- Restaurant identity should be visible immediately without sacrificing menu utility.
- Typography must survive long Arabic, English, and mixed-direction strings.
- Product names and prices remain stronger than decorative treatment.
- Cards must remain stable with missing descriptions, missing images, sold-out states, and varied image ratios.
- Sticky, fixed, modal, pseudo-element, and animated layers must never obscure content or intercept input unexpectedly.
- A premium theme is not premium if readability, scanability, contrast, or interaction quality is degraded.

## Functional quality
Every existing interactive element requires an evidence-backed purpose, expected placement, adequate reachability, accessible naming, visible focus where relevant, correct RTL/LTR placement, clear feedback, and safe failure behavior.

Important mobile controls should generally target approximately 44×44 CSS pixels when practical; the WCAG 2.2 minimum pointer target is 24×24 CSS pixels with defined exceptions.

## Customer actions
Audit only capabilities that actually exist:
- Cart/order: visibility, count, add feedback, quantity, modifiers, totals, empty/error/loading states, persistence, and localization.
- WhatsApp: verified configured number, sanitized action, useful placement, accessible label, and privacy-safe parameters.
- Phone: verified number, `tel:` behavior, accessible labeling, and correct conversion priority.
- Map/location: verified destination, branch identity, safe external behavior.
- Social: verified configured links only; no empty decorative icons.
- Search/category navigation: useful visibility, Arabic/English behavior, active state, many-category resilience, and keyboard/mobile behavior.

Never create or imply payment, checkout, contact, location, booking, or ordering behavior that is not supported by the repository.

## Real-data resilience
Every material template review should include:
- short/long restaurant, category, and product names;
- Arabic-only, English-only, bilingual, and mixed-direction content;
- varied SAR price lengths;
- missing descriptions and images;
- portrait, square, landscape, and poor-quality images;
- available and sold-out products;
- modifiers/variants and discounts when supported;
- sparse and dense category sets;
- one and multiple branches;
- loading, empty, error, offline, and unavailable states when supported.

## Arabic / RTL
Use logical CSS properties where practical. Verify punctuation, Latin tokens, phone numbers, prices, hashtags, mixed scripts, alignment, and truncation. Do not assume that mirroring an LTR layout produces good Arabic UX.

## Performance
- Preserve stable image boxes using dimensions or aspect ratios.
- Use lazy loading for appropriate below-fold media and avoid delaying critical above-fold media without reason.
- Prefer responsive image delivery when the repository's image pipeline supports it.
- Keep decorative effects lightweight and avoid dependencies for cosmetic effects without evidence.

## SEO and public pages
- Canonical URLs must represent the real public menu.
- Preview-only variants should not become indexable duplicate pages.
- Metadata and structured data must describe verified page/business facts only.
- Branch identity, hours, location, telephone, menu URL, and cuisine data should be emitted only when supported and truthful.

## Research discipline
Repository evidence comes first. Then use connected sources only when actually connected, followed by authoritative public documentation, maintained open-source references, credible UX research, and relevant Saudi/MENA public examples.

Record material research in `docs/design-research-log.md` with source, access date, category, VERIFIED finding, transferable principle, relevance, limitation, confidence, and what must not be copied.

## Anti-copy rule
Do not copy proprietary competitor layouts, branding, assets, screenshots, text, code, or interaction designs. Extract principles such as hierarchy, navigation clarity, information density, accessibility, or performance strategy and re-express them within Menu V3's existing architecture.

## Typography Decision — 2026-09-06

### Status
**CLOSED / VERIFIED as a decision. Implementation is intentionally separate.**

### Repository evidence
- `package.json` has no current IBM Plex, Noto, Tajawal, Cairo, Mada, Amiri, or other explicit font dependency; no candidate was found in the repository typography search. This means the decision can be introduced without replacing an existing named font contract.
- The design-system contract already requires explicit roles for display, headings, body, buttons, prices, numerals, and code, plus mixed Arabic/Latin/SAR/bidi validation.
- No application code, theme, dependency, schema, or deployment configuration was changed in this decision task.

### Candidate matrix
| Candidate | Arabic | Latin strategy | Weights / delivery | License | Fit | Decision |
|---|---|---|---|---|---|---|
| **IBM Plex Sans Arabic + IBM Plex Sans** | Purpose-built Arabic family; broad Arabic support | Same Plex family; coherent global UI system | Arabic package exposes regular/semibold/bold by default and additional weights; official project provides web WOFF/WOFF2 and split subsets | OFL-1.1 | Excellent for product UI + premium technology/hospitality balance | **DEFAULT** |
| **Noto Sans Arabic + Noto Sans** | Broad Arabic-script coverage; Google Noto Arabic project | Matching Noto Sans family | Variable Arabic family with weight/width axes; Noto documentation explicitly recommends Noto Sans Arabic UI for constrained UI elements | OFL-1.1 | Excellent coverage and fallback/resilience; slightly more neutral | **ALTERNATE 1** |
| **Tajawal** | Modern Arabic with matching Latin | Native family pairing | Seven weights; web-friendly; Google Fonts ecosystem | OFL-1.1 | Strong contemporary Arabic/MENA character; good branding alternate | **ALTERNATE 2** |
| Mada | Modern geometric, low contrast | Latin based on Source Sans | Variable font, ExtraLight through Black | OFL-1.1 | Excellent compact UI and signage character; less distinctive as a complete product identity | Candidate |
| Amiri | Classical Naskh | Arabic-first literary system | Regular/Bold/Italic variants | OFL-1.1 | Excellent editorial/heritage display or long-form Arabic; wrong default for operational SaaS UI | Candidate |
| Noto Kufi Arabic | Simplified Kufic Arabic | Noto Latin pairing | Noto Arabic family ecosystem | OFL-1.1 | Strong headline/display option; too geometric for the universal body system | Candidate |
| Lemonada | Contemporary Arabic/Latin | Native matched Arabic + Latin | Four main weights; wide/open counters | OFL-1.1 | Expressive hospitality/marketing option; too opinionated for system-wide UI | Candidate |
| Changa | Display-oriented Arabic/Latin | Native matched family | Multi-weight display family | OFL-1.1 | Useful campaign/display accent; not appropriate as default body/UI font | Candidate |

### Evidence
- IBM states that IBM Plex is open source under OFL and that IBM Plex Sans supports Arabic and many other scripts; the project provides an `@ibm/plex-sans-arabic` package and describes Plex as suitable for UI environments. Source: https://github.com/IBM/plex
- The IBM Arabic package documents WOFF/WOFF2 web files, split performance subsets, and a default import set of Light/Regular/Semibold; the repository also lists additional weights. Source: https://github.com/IBM/plex/tree/master/packages/plex-sans-arabic
- Noto's official documentation explicitly recommends Noto Sans Arabic UI for Arabic UI elements with limited vertical space and distinguishes it from the broader document-oriented Noto Sans Arabic family. Source: https://github.com/notofonts/noto-docs/blob/main/docs/website/use.md
- The Noto Arabic source project is maintained under the Noto organization and is licensed under SIL OFL 1.1. Source: https://github.com/notofonts/arabic
- Tajawal's maintained source describes it as a distinctive modern Arabic typeface with a matching sans-serif Latin approach and seven weights; the project is OFL-1.1. Source: https://github.com/googlefonts/tajawal
- Mada's maintained source describes a geometric, low-contrast Arabic face suited to small sizes, interfaces, signage, and display; it is OFL-1.1. Source: https://github.com/aliftype/mada
- Amiri's maintained source describes a Naskh body-text typeface designed for running text and licensed under OFL-1.1. Source: https://github.com/aliftype/amiri
- Lemonada's maintained source describes a contemporary Arabic/Latin family with four weights, wide/open counters, and OFL-1.1 licensing. Source: https://github.com/Gue3bara/Lemonada
- Changa's maintained source describes a Latin/Arabic display family intended for headlines and titles and licensed under OFL-1.1. Source: https://github.com/googlefonts/changa-vf

### Final decision
**Use IBM Plex Sans Arabic as the Menu V3 Arabic family, paired with IBM Plex Sans for Latin.**

Recommended semantic mapping:
- `type.display`: IBM Plex Sans Arabic / IBM Plex Sans, weight 700 initially
- `type.heading-1`: 700
- `type.heading-2`: 700
- `type.heading-3`: 600
- `type.body`: 400
- `type.body-small`: 400
- `type.label`: 500–600
- `type.button`: 600
- `type.price`: 600
- `type.numeric`: IBM Plex Sans / IBM Plex Sans Arabic with explicit bidi validation
- `type.code`: existing monospace stack; do not force Plex into code

Do not ship all available weights by default. Start with the smallest real set required by the rendered UI and subset/self-host where the application pipeline permits.

### Why IBM Plex wins
1. **One coherent system rather than a visual patchwork:** Arabic and Latin belong to the same Plex family, reducing pairing drift.
2. **Product credibility:** it reads as serious technology infrastructure without looking like a generic enterprise dashboard.
3. **Hospitality compatibility:** it can carry restrained editorial headings and dense menu/body UI without forcing a decorative restaurant personality onto every tenant.
4. **Arabic-first readiness:** Arabic is a first-class family rather than a fallback afterthought.
5. **Engineering fit:** the official project already provides web formats and split subsets, supporting a controlled self-hosted delivery strategy.
6. **Theme compatibility:** the five existing themes can keep their personality through size, weight, spacing, imagery, and semantic tokens instead of requiring different core fonts.

### What we explicitly reject
- No font chosen solely because it looks fashionable in a screenshot.
- No Google Fonts runtime dependency if self-hosting can provide predictable performance/privacy.
- No addition of the IBM npm font package merely to obtain CSS, because the package documentation indicates IBM telemetry; implementation should use the official web font assets/licensing directly if self-hosting is chosen.
- No global font replacement until real Menu V3 Arabic/English/mixed content passes visual and performance verification.
- No font-specific theme rewrites.

### Required implementation benchmark
The next atomic implementation task must render and verify:
- `مطعم النفس` / `Nafas Restaurant`
- `برجر لحم ٢٥٫٥٠ ر.س`
- `Burger 25.50 SAR`
- Arabic description containing `WhatsApp`, a phone number, and a URL
- long Arabic category/product names
- English UI containing Arabic restaurant names
- numerals, decimal prices, parentheses, punctuation, and mixed-direction labels

Verify at small mobile, standard mobile, tablet, and desktop widths; compare first-load font behavior, wrapping, line-height, layout shift, and payload impact.

### Smallest next implementation task
**W6-01 — Introduce IBM Plex Sans Arabic + IBM Plex Sans as the shared typography foundation, self-hosted and subsetted, without changing theme architecture.**

Files expected to change must be limited to the existing font/style entry points, design-token/style files, relevant regression/specimen tests, and required license/asset documentation. No new dependency is justified.

### Sources
- IBM Plex: https://github.com/IBM/plex
- IBM Plex Sans Arabic web package: https://github.com/IBM/plex/tree/master/packages/plex-sans-arabic
- Noto Arabic docs: https://github.com/notofonts/noto-docs/blob/main/docs/website/use.md
- Noto Arabic: https://github.com/notofonts/arabic
- Tajawal: https://github.com/googlefonts/tajawal
- Mada: https://github.com/aliftype/mada
- Amiri: https://github.com/aliftype/amiri
- Lemonada: https://github.com/Gue3bara/Lemonada
- Changa: https://github.com/googlefonts/changa-vf

## Evidence states
- `VERIFIED` — directly confirmed by repository, tool, test, or authoritative source evidence.
- `INFERRED` — derived from verified evidence but not directly observed.
- `PROPOSED` — a recommended decision not yet proven.
- `UNKNOWN` — insufficient evidence.
- `BLOCKED` — verification or implementation cannot proceed because of a hard dependency/environment/permission constraint.
