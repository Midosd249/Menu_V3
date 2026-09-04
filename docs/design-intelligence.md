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

## Evidence states
- `VERIFIED` — directly confirmed by repository, tool, test, or authoritative source evidence.
- `INFERRED` — derived from verified evidence but not directly observed.
- `PROPOSED` — a recommended decision not yet proven.
- `UNKNOWN` — insufficient evidence.
- `BLOCKED` — verification or implementation cannot proceed because of a hard dependency/environment/permission constraint.
