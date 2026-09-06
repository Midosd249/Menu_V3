# Menu V3 — Design Strategy Master Plan

## Status
- Status: RESEARCH COMPLETE / IMPLEMENTATION NOT STARTED.
- Scope: product, marketing website, public customer experience, Owner Studio, brand system, typography, color, content, conversion, accessibility, RTL, SEO, performance, trust, and growth.
- Existing five-theme implementation remains protected. Themes are not the current focus.
- Repository source of truth: `main`.

## Strategic Objective
Build Menu V3 into a distinctive Arabic-first restaurant presence platform for Saudi Arabia and MENA rather than a generic QR-menu SaaS. The product should make a restaurant look better, become easier for guests to use, become easier for owners to operate, and create measurable direct customer value.

## Evidence Position
### VERIFIED
- Menu V3 already has five protected visual themes and a mature shared public-menu architecture.
- Shared public-menu behavior already owns core discovery and customer actions.
- Saudi/MENA competitors increasingly bundle digital menus with ordering, branded presence, analytics, branches, compliance/local-market fit, and customer-data ownership.
- Global restaurant platforms increasingly treat menus, websites, ordering, discoverability, and operational data as one connected product story.
- Arabic/RTL, mixed-direction content, mobile behavior, accessibility, performance, and local-business SEO are material product requirements.
- Existing Canva direction supports a premium hospitality/editorial visual language with warm neutrals, deep ink, muted terracotta, strong Arabic hierarchy, whitespace, and operational clarity.

### INFERRED
The strongest product territory is `Premium Arabic-first Restaurant Presence Platform`: a connected system spanning public menu, branded web presence, direct customer actions, owner operations, and local discoverability.

### UNKNOWN
- Final conversion priorities without analytics and controlled user testing.
- Final font choice until measured against the current stack and real content.
- Final homepage information architecture until the complete external research synthesis is reconciled with current product capabilities.
- Which future website/local-visibility features have sufficient backend support for immediate implementation.

## North-Star Experience
A restaurant owner should be able to understand the product in seconds, create a credible branded presence with minimal setup, preview the exact customer result while editing, publish confidently, and see actionable health/visibility signals. A guest arriving from QR, search, social, or a shared link should immediately recognize the restaurant, find the desired item, understand price/availability, and reach the intended action with minimal friction.

## Workstreams

### W0 — Evidence, Measurement, and Product Positioning
**Goal:** establish the decision baseline before visual implementation.
- Audit current homepage/product copy against actual capabilities.
- Define primary audiences: owner/operator, manager, guest/customer.
- Define jobs-to-be-done and top conversion actions.
- Instrument baseline metrics where analytics infrastructure supports them.
- Define success metrics: activation, publish rate, menu scan-to-action, contact/order conversion, search/category usage, bounce/exit, and performance/accessibility budgets.
- Maintain an explicit capability matrix so marketing never promises unsupported functionality.

### W1 — Brand Positioning and Content System
**Goal:** make Menu V3 recognizable and commercially clear.
- Establish one-sentence value proposition.
- Establish supporting proof pillars.
- Define Arabic-first brand voice and English counterpart.
- Build terminology glossary for menu, branch, publish, QR, visibility, health, ordering, and analytics.
- Define CTA hierarchy and conversion vocabulary.
- Create proof/trust framework: real outcomes, merchant evidence, supported capabilities, privacy/security, and local fit.

### W2 — Marketing Website / Homepage
**Goal:** convert qualified restaurant traffic.
- Design information architecture from first impression to CTA.
- Hero must show a real restaurant outcome/product result, not a generic abstract SaaS graphic.
- Demonstrate public menu, Owner Studio, branded website, QR, analytics, and local visibility in outcome order.
- Add proof, use cases, comparison/objection handling, pricing/packaging where supported, FAQ, and final CTA.
- Make Arabic-first positioning visible.
- Make mobile conversion first-class.
- Define SEO metadata, headings, internal links, structured data, and share previews.

### W3 — Public Customer Menu
**Goal:** maximize guest clarity and action completion.
- First-screen restaurant identity and status.
- Clear branch/location/hours/contact utility.
- Fast category discovery and search.
- Product hierarchy: image → name → description → price → availability/action.
- Strong product detail and modifier presentation where supported.
- Stable cart/order/contact action surface.
- Empty/loading/error states.
- Arabic, English, mixed-direction, numbers, SAR, phone, URLs, and brand names.
- Image performance and stable geometry.
- Keyboard/focus/touch target/safe-area behavior.

### W4 — Owner Studio / Admin UX
**Goal:** turn configuration into a fast path to a published restaurant.
- Outcome-oriented onboarding.
- Restaurant/branch setup.
- Menu/product editing.
- Branding and theme selection.
- Live preview beside/within the editing workflow where architecture permits.
- Publish readiness and rollback-safe status.
- QR management.
- Customer actions.
- Analytics.
- Menu Health.
- Local Visibility opportunities.
- Mobile-first high-frequency tasks.
- Clear empty/error/success states.

### W5 — Shared Design System
**Goal:** create a recognizable Menu V3 signature without flattening restaurant individuality.
- Typography tokens.
- Semantic color tokens.
- Spacing scale.
- Container/grid rules.
- Surface/elevation rules.
- Radius/border rules.
- Button/input/chip/badge patterns.
- Cards and media containers.
- Navigation/category/search.
- Dialog/drawer/bottom-sheet patterns.
- Fixed action hierarchy.
- Status/health states.
- Empty/loading/error patterns.
- Focus/hover/pressed/disabled states.
- Reduced-motion behavior.
- RTL/LTR/mixed-direction rules.
- Theme personality remains separate from shared usability primitives.

### W6 — Typography
**Goal:** choose a durable Arabic-first type system.
- Test 5–8 candidate systems.
- Evaluate Arabic shaping, Latin pairing, numerals, weights, line-height, dense UI, headings, menu descriptions, and mixed strings.
- Evaluate licensing and self-hosting/subsetting.
- Measure font loading impact.
- Select one default system plus fallbacks.
- Do not change fonts globally without visual and performance evidence.

### W7 — Color and Brand Tokens
**Goal:** create a coherent core identity that survives restaurant themes.
- Define neutral canvas/surface/ink hierarchy.
- Define primary/secondary/accent/semantic colors.
- Validate WCAG contrast.
- Define dark/light behavior.
- Test against food photography.
- Avoid generic gradients/glassmorphism as the core identity.
- Allow themes to remain expressive while shared actions and status semantics stay consistent.

### W8 — Imagery and Art Direction
**Goal:** make hospitality quality visible.
- Define photography direction for hero, menu items, restaurants, branches, and product screenshots.
- Prefer real restaurant outcomes over abstract stock imagery.
- Establish aspect-ratio rules and crop behavior.
- Define missing/poor-image fallback.
- Define compression, responsive sizing, loading priority, and alt-text rules.
- Never use unlicensed competitor imagery or copy.

### W9 — Motion and Interaction
**Goal:** add perceived quality without sacrificing speed or clarity.
- Define a small motion vocabulary.
- Use motion for state change and orientation, not decoration.
- Respect reduced-motion preferences.
- Avoid animation-dependent visibility.
- Avoid excessive parallax, floating effects, and delayed first content.
- Test mobile CPU/battery impact.

### W10 — Accessibility and RTL Quality
**Goal:** make Arabic-first a genuine quality advantage.
- WCAG 2.2 target sizes and focus.
- Focus not obscured by fixed UI.
- Keyboard operation.
- Screen-reader names and state announcements.
- Contrast.
- Error identification/recovery.
- Arabic/English/mixed-direction.
- Numerals, currency, dates, phones, URLs, brand names.
- Logical DOM order rather than visual-only mirroring.

### W11 — SEO / Local Discovery / Shareability
**Goal:** make restaurant presence discoverable beyond QR scans.
- Canonical URLs.
- Indexability rules by route.
- Restaurant/branch/menu/item metadata only where supported by actual content.
- LocalBusiness structured data where accurate.
- Open Graph/social previews.
- Sitemap/robots behavior.
- Page titles/descriptions.
- Internal linking.
- Fast mobile rendering.
- Local intent content without fabricated claims.

### W12 — Performance and Reliability
**Goal:** premium feel includes speed and stability.
- Define budgets for LCP/CLS/INP where measurement infrastructure supports them.
- Responsive images.
- Font loading/subsetting.
- CSS payload discipline.
- Avoid unnecessary JS for visual effects.
- Stable media dimensions.
- Hydration/first-paint checks.
- Error/loading boundaries.
- Cache strategy where architecture supports it.

### W13 — Trust, Security, and Data Ownership
**Goal:** make the product commercially credible.
- Authentication and authorization remain protected.
- Tenant/branch isolation remains protected.
- Customer actions must use verified configuration.
- No client entitlement bypass.
- Validate public inputs.
- Avoid sensitive data exposure in logs or page payloads.
- Explain privacy/data ownership accurately.
- Ensure marketing claims match actual controls.

### W14 — Pricing, Packaging, and Commercial UX
**Goal:** reduce buying friction without inventing plans.
- Audit existing entitlement model.
- Clarify free vs premium capabilities.
- Explain value in business outcomes.
- Compare plans only using verified features.
- Strong upgrade prompts inside relevant Owner Studio contexts.
- No dark patterns.
- Test pricing comprehension in Arabic and English.

### W15 — Growth, Analytics, and Experimentation
**Goal:** turn design into a measurable system.
- Define event taxonomy.
- Measure homepage CTA progression.
- Measure QR → menu → item → action funnel.
- Measure owner onboarding → publish funnel.
- Identify high-friction screens.
- Use controlled experiments only after instrumentation is trustworthy.
- Record experiment hypothesis, metric, duration, and decision.

### W16 — QA, Browser, Device, and Release
**Goal:** close the evidence gap before commercial launch.
- Automated quality gates.
- Authenticated browser QA.
- Real mobile/tablet/desktop.
- Arabic RTL / English LTR / mixed direction.
- Supported browsers including Opera where required.
- Console/hydration checks.
- Accessibility checks.
- Performance checks.
- Production verification after the single controlled Vercel deployment.
- Record evidence and rollback readiness.

## Design Decision Principles
1. Product clarity beats decoration.
2. Restaurant identity beats generic SaaS identity.
3. Arabic-first must be visible in behavior, typography, and content—not only translation.
4. Mobile-first means thumb reach, scanability, speed, and safe-area correctness.
5. Real content beats placeholder perfection.
6. Every fixed action must have clear priority and content clearance.
7. Motion never controls visibility.
8. Shared usability primitives should remain stable across themes.
9. Do not create new architecture when the existing renderer can support the requirement safely.
10. Do not add a feature to marketing copy until its backend and entitlement behavior are verified.
11. Use evidence before subjective redesign.
12. Prefer small reversible changes and measure before broad replacement.

## Protected Work — Do Not Redo
- Premium Theme System architecture.
- Essential, Editorial, Noir, Heritage, and Gallery implementations unless direct evidence identifies a defect.
- Shared public-menu business behavior.
- Customer actions already verified.
- Authentication, authorization, tenant/branch isolation.
- Existing migrations/schema without a proven product requirement.
- Release-only Vercel workflow.
- Existing visual/functional quality system.

## Priority Backlog
### P0 — Must establish before broad visual implementation
1. Final product positioning and message hierarchy.
2. Current homepage/product capability audit.
3. Shared design-system contract.
4. Typography decision with real Arabic/English/mixed content.
5. Public-menu first-screen/action hierarchy audit.
6. Owner Studio activation/publish journey audit.
7. Measurement baseline and event taxonomy where infrastructure supports it.
8. Accessibility/RTL/performance acceptance contract.

### P1 — High-value product/design improvements
1. Marketing homepage redesign based on evidence.
2. Public menu conversion and business-information hierarchy improvements.
3. Owner Studio onboarding and preview/publish UX improvements.
4. Shared component/state consistency.
5. SEO/local-discovery improvements supported by actual routes/data.
6. Image and font performance improvements.
7. Trust/proof/pricing/packaging improvements.

### P2 — Differentiation and growth
1. Deeper local visibility workflows.
2. Advanced analytics storytelling.
3. Experimentation framework.
4. Advanced personalization where supported.
5. Enhanced restaurant website capabilities.
6. Additional integrations only when validated by demand.

## Execution Sequence
`Evidence → Positioning → Design System Contract → Typography/Color Decisions → Homepage IA → Public Menu UX → Owner Studio UX → SEO/Local Discovery → Performance/Accessibility → Prototype/Visual QA → Atomic Implementation Tasks → Quality Gates → Controlled Release`

## Research Governance
- Record material sources in `docs/design-research-log.md`.
- Use official standards for accessibility, i18n, web platform, and SEO.
- Use competitor sites as positioning/pattern evidence, not as design assets.
- Use design galleries and UI libraries as inspiration only.
- Label conclusions `VERIFIED`, `INFERRED`, `PROPOSED`, or `UNKNOWN`.
- Do not convert an unverified trend into a product requirement.

## Definition of Design-System Readiness
The design system is ready for implementation only when:
- typography is selected and measured;
- semantic colors have contrast evidence;
- spacing/grid/radius/elevation rules are defined;
- core components and states are enumerated;
- RTL/LTR/mixed-direction behavior is defined;
- mobile/responsive rules are defined;
- accessibility acceptance criteria are defined;
- performance budgets are defined where measurable;
- homepage/public-menu/Owner Studio information architecture is approved from evidence;
- protected architecture boundaries are explicit.

## Next Atomic Tasks
1. **Design Intelligence Synthesis — close external research and reconcile it with repository evidence.**
2. **Design System Contract — create implementation-ready tokens/component rules.**
3. **Typography Decision — benchmark candidates against actual Menu V3 content.**
4. **Marketing Homepage IA + copy architecture.**
5. **Public Menu UX hierarchy audit.**
6. **Owner Studio activation/publish UX audit.**
7. **SEO/local discovery implementation plan.**
8. **Accessibility/RTL/performance acceptance matrix.**

Only one item above may be active at a time.