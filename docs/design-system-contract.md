# Menu V3 — Design System Contract

## Status
- Status: CONTRACT BASELINE / IMPLEMENTATION NOT STARTED.
- Scope: shared product/site usability primitives above the protected five-theme system.
- Themes remain outside this task. No sixth theme is introduced.
- Repository source of truth: `main`.

## Purpose
This contract converts the completed design-intelligence program into implementation constraints that can be applied consistently across the marketing website, public customer menu, Owner Studio, and future restaurant web presence.

The contract intentionally separates:
- shared usability and accessibility primitives;
- Menu V3 brand identity;
- restaurant-specific theme personality.

Restaurant themes may remain expressive. Shared behavior, semantics, accessibility, RTL quality, action hierarchy, and status meaning must remain consistent.

## Evidence Basis
### VERIFIED
- The repository defines Menu V3 as Arabic-first, bilingual, mobile-first, and multi-tenant.
- The repository protects the five existing themes and shared public-menu behavior.
- The master design strategy identifies the strongest strategic territory as `Premium Arabic-first Restaurant Presence Platform`.
- The strategy requires evidence before broad visual implementation and explicitly protects authentication, authorization, tenant/branch isolation, SEO, deployment controls, and existing customer actions.
- W3C guidance requires explicit directional markup for RTL and mixed-direction content rather than relying on visual CSS mirroring.
- W6 typography evidence selected **IBM Plex Sans Arabic + IBM Plex Sans** as the default shared typography system, with Noto Sans Arabic + Noto Sans and Tajawal as alternates.

### PROPOSED
- Use a restrained editorial hospitality foundation: warm neutral surfaces, deep ink, controlled accent color, strong Arabic hierarchy, generous but purposeful whitespace, and high information clarity.
- Keep brand identity recognizable without forcing the same restaurant aesthetic onto every tenant.
- Prefer semantic tokens and logical CSS properties so RTL/LTR behavior is structural rather than duplicated visual styling.

### UNKNOWN
- Final primary accent color until contrast, photography interaction, and conversion testing are completed.
- Final homepage copy hierarchy until actual capability and conversion evidence is measured.
- Final runtime font payload, CLS/font-swap behavior, and visual fit across every protected theme until W6-01 implementation benchmark completes.

## 1. Design Tokens

### 1.1 Color roles
Use semantic names, not component-specific color names.

Required roles:
- `surface.canvas`
- `surface.primary`
- `surface.secondary`
- `surface.inverse`
- `content.primary`
- `content.secondary`
- `content.muted`
- `content.inverse`
- `border.subtle`
- `border.strong`
- `action.primary`
- `action.primary-hover`
- `action.secondary`
- `focus.ring`
- `status.success`
- `status.warning`
- `status.danger`
- `status.info`

Rules:
- Never use a theme accent as the semantic meaning of success, warning, or danger.
- Primary actions must remain distinguishable from decorative accents.
- Contrast must be validated for every text/action pairing actually shipped.
- Photography must not be required for text contrast.
- Dark/light behavior is defined by semantic roles, not by swapping arbitrary hex values.

### 1.2 Typography roles
Required roles:
- `type.display`
- `type.heading-1`
- `type.heading-2`
- `type.heading-3`
- `type.body`
- `type.body-small`
- `type.label`
- `type.button`
- `type.caption`
- `type.price`
- `type.numeric`
- `type.code`

**Selected shared family:**
- Arabic: `IBM Plex Sans Arabic`
- Latin: `IBM Plex Sans`
- Alternate 1: `Noto Sans Arabic` + `Noto Sans`
- Alternate 2: `Tajawal`

Initial semantic mapping:
- display/headings: 600–700;
- body/body-small: 400;
- labels/buttons/prices: 500–600;
- numeric: Plex Arabic/Latin with explicit bidi validation;
- code: existing monospace stack.

Rules:
- Arabic and Latin pairing must be evaluated together.
- Numerals, SAR values, phone numbers, URLs, and Latin brand names must have explicit bidi test cases.
- Do not ship all available font weights by default; use the smallest real set.
- Prefer official self-hosted WOFF2/subset delivery where the existing asset pipeline permits it.
- Do not add a font npm dependency solely for delivery.
- Avoid using font weight as the only hierarchy mechanism.
- Long Arabic labels must wrap without clipping or forced visual truncation unless the component explicitly provides an accessible expansion path.
- W6-01 must benchmark payload, font swap, CLS/layout stability, and visual fit before broad rollout.

### 1.3 Spacing
Use a consistent spacing scale with a small number of reusable steps. Components must consume tokens rather than arbitrary values.

Minimum semantic tiers:
- `space.1` — micro separation
- `space.2` — inline/control separation
- `space.3` — compact component padding
- `space.4` — standard component gap
- `space.5` — section-local gap
- `space.6` — major section gap
- `space.7` — large page rhythm
- `space.8` — hero/major transition rhythm

Exact pixel values are implementation details and must be tuned against the existing layout rather than imposed as a rewrite.

### 1.4 Radius
Use a small radius vocabulary:
- `radius.none`
- `radius.sm`
- `radius.md`
- `radius.lg`
- `radius.xl`
- `radius.full`

Rules:
- Avoid mixing many unrelated radii.
- Restaurant theme personality may alter the visual treatment within the approved range, but interactive controls should remain predictable.

### 1.5 Elevation and borders
Required semantic roles:
- `elevation.none`
- `elevation.surface`
- `elevation.raised`
- `elevation.overlay`
- `border.subtle`
- `border.strong`

Rules:
- Prefer borders and surface contrast over heavy shadows.
- Do not use blur/glass effects as the default product identity.
- Overlay elevation must never become a stacking-context workaround for broken layout.

### 1.6 Motion
Required motion roles:
- `motion.instant`
- `motion.fast`
- `motion.standard`
- `motion.slow`
- `motion.emphasis`

Rules:
- Motion communicates state change, orientation, or hierarchy.
- Never hide essential content behind an animation.
- Every non-essential animation must respect reduced-motion preferences.
- Avoid perpetual decorative motion, excessive parallax, and delayed first content.

## 2. Layout Contract

### 2.1 Containers
- Use a predictable content container with responsive horizontal padding.
- Marketing sections may use wider editorial compositions, but reading measure must remain controlled.
- Public menus should prioritize scanability over maximal desktop width.
- Owner Studio should optimize for task density without creating cramped controls.

### 2.2 Responsive behavior
Required validation states:
- small mobile;
- standard mobile;
- large mobile;
- tablet;
- desktop.

Every material layout must be checked with:
- long Arabic names;
- long English names;
- mixed Arabic/English strings;
- long categories;
- long restaurant names;
- long prices;
- missing descriptions;
- missing/poor images;
- sparse and dense menus.

### 2.3 Logical CSS
Prefer logical properties and semantic structure:
- `margin-inline`
- `padding-inline`
- `inset-inline-*`
- `border-inline-*`
- `text-align: start/end`
- flex/grid ordering that follows document meaning.

Do not build separate visual layouts solely because Arabic is RTL.

## 3. RTL / LTR / Bidi Contract

### 3.1 Structural direction
- Set the document base direction using HTML direction metadata.
- Use `dir` on localized or directionally distinct blocks when needed.
- Do not use CSS alone to encode semantic text direction.
- Preserve logical DOM order.

W3C specifically recommends structural direction markup and warns against treating RTL as visual mirroring.

### 3.2 Mixed-direction content
Mandatory test cases:
- Arabic sentence + Latin brand name;
- Arabic sentence + numeric price;
- Arabic product + English product name;
- phone number inside Arabic text;
- URL inside Arabic text;
- SAR + decimal value;
- English UI containing Arabic restaurant/product name;
- form input with unknown-direction content.

Where a run has a known opposite direction, tightly scoped markup should establish that direction. W3C recommends markup for inline bidi handling rather than relying on control characters where markup is available.

### 3.3 Forms
- Inputs containing user-entered mixed-direction content should use appropriate direction behavior such as `dir="auto"` where supported and semantically correct.
- Do not hard-code alignment based only on the selected language.

## 4. Component Contract

### 4.1 Buttons
Every button must define:
- purpose;
- label/icon meaning;
- primary/secondary/destructive status;
- hover/pressed/focus/disabled/loading states;
- RTL placement;
- keyboard behavior;
- safe-area behavior when fixed;
- analytics semantics where an existing event contract applies.

Important mobile controls should target approximately 44×44 CSS pixels where practical; the repository's WCAG baseline is 24×24 CSS pixels with applicable exceptions.

### 4.2 Inputs
Required states:
- default;
- focus;
- filled;
- invalid;
- disabled;
- loading where applicable;
- success where applicable.

Errors must be understandable, associated with the relevant field, and recoverable.

### 4.3 Cards
Cards must have a clear semantic purpose. Do not turn every section into a card.

For menu items, the hierarchy should normally prioritize:
1. product identity;
2. image when available;
3. description where available;
4. price;
5. availability;
6. customer action where supported.

### 4.4 Search and category navigation
- Search must have a clear accessible name.
- Category navigation must remain usable with long labels.
- Horizontal scrolling must not hide the selected state or important affordances.
- Search and category state should remain understandable after navigation or refresh where architecture supports it.

### 4.5 Dialogs / drawers / bottom sheets
- Preserve focus behavior.
- Provide an accessible name.
- Prevent background interaction when modal semantics require it.
- Respect safe areas.
- Keep close actions reachable in RTL and LTR.
- Avoid using a drawer where a simple inline state would be clearer.

### 4.6 Fixed actions
Every fixed/sticky control must reserve document clearance.

Never solve overlap by increasing arbitrary `z-index` values.

## 5. Public Menu Contract

First-screen priority:
1. restaurant identity;
2. current availability/status when supported;
3. location/contact utility when verified;
4. category discovery;
5. search when supported;
6. high-value menu content;
7. intended customer action.

The exact order may adapt to restaurant capabilities, but no decorative element should displace core guest utility.

Required states:
- loading;
- populated;
- sparse;
- empty;
- unavailable/sold-out where supported;
- error;
- missing/poor imagery.

## 6. Owner Studio Contract

The primary journey is:
`Understand → Set up → Edit → Preview → Validate → Publish → Measure → Improve`

Required UX principles:
- outcome-first onboarding;
- visible publish readiness;
- preview reflects customer reality where architecture permits;
- destructive changes require appropriate confirmation;
- errors explain recovery;
- empty states provide the next useful action;
- analytics and Menu Health should lead to actionable decisions, not vanity metrics.

Do not introduce new owner capabilities until backend support and entitlement behavior are verified.

## 7. Marketing Website Contract

The homepage must answer quickly:
1. What is Menu V3?
2. Who is it for?
3. What does the restaurant/customer get?
4. Why should the owner trust it?
5. What should the visitor do next?

Recommended story order:
`Outcome → Product proof → Customer experience → Owner experience → Business value → Trust → Pricing/objections → CTA`

A hero should show a credible restaurant/product outcome rather than an abstract SaaS illustration whenever real product evidence is available.

## 8. Imagery Contract
- Prefer authentic restaurant outcomes and real product UI over generic stock imagery.
- Define stable aspect ratios before loading images.
- Use responsive image sizing and appropriate loading priority.
- Provide meaningful alt text when the image conveys information.
- Decorative images must not become accessibility noise.
- Never copy competitor imagery, screenshots, logos, or proprietary assets.

## 9. Accessibility Contract
Target:
- WCAG 2.2-aligned implementation.
- Keyboard accessibility.
- Visible focus.
- Accessible names and states.
- Adequate contrast.
- Pointer target baseline consistent with repository guidance.
- Reduced motion.
- Focus not obscured by fixed UI.
- Errors identified and recoverable.

Accessibility is a product quality requirement, not a final audit-only activity.

## 10. Performance Contract
Design decisions must consider:
- font loading;
- image bytes;
- responsive image selection;
- layout stability;
- CSS size;
- JavaScript required for interaction;
- hydration/first-paint behavior;
- animation cost on mobile.

Do not add visual effects that require large client-side libraries unless a measurable product benefit justifies them.

## 11. SEO / Discoverability Contract
Where actual routes and data support it:
- semantic headings;
- accurate titles/descriptions;
- canonical URLs;
- Open Graph/share metadata;
- sitemap/robots behavior;
- appropriate local-business structured data;
- internal linking;
- fast mobile rendering.

Never generate structured data for unsupported or fabricated business facts.

## 12. Trust / Security Contract
Design work must not weaken:
- authentication;
- authorization;
- tenant isolation;
- branch isolation;
- subscription/entitlement checks;
- input validation;
- privacy boundaries;
- secret handling.

Marketing copy must not promise controls or features that are not implemented and verified.

## 13. Theme Boundary
The five existing themes remain restaurant personality layers.

They may control:
- decorative treatment;
- accent personality;
- surface character;
- typography personality within the approved font contract;
- imagery treatment;
- selected motion flavor.

They must not independently redefine:
- semantic status colors;
- accessibility behavior;
- core action semantics;
- RTL structure;
- tenant/security behavior;
- customer-action logic;
- fixed-action clearance;
- component state meaning.

## 14. Acceptance Gate for Future UI Work
A UI/design implementation cannot be considered complete until:
- real Arabic/English/mixed content has been checked;
- responsive states are checked;
- empty/loading/error states relevant to the component are checked;
- accessibility states are checked;
- fixed/sticky interactions are checked;
- performance implications are considered;
- existing business logic is preserved;
- diff is task-scoped;
- relevant tests/quality gates pass;
- continuity files are updated.

## 15. Decision Queue
The contract intentionally does not finalize unresolved decisions.

Next atomic decisions:
1. W6-01 Typography implementation benchmark.
2. Color territory and semantic token values.
3. Marketing homepage IA and copy hierarchy.
4. Public-menu first-screen/action hierarchy.
5. Owner Studio activation/publish journey.

Only one decision/implementation task may be active at a time.

## Sources
- W3C, Authoring HTML: Handling Right-to-left Scripts: https://www.w3.org/TR/i18n-html-tech-bidi/
- W3C, Inline markup and bidirectional text in HTML: https://www.w3.org/International/articles/inline-bidi-markup/
- W3C, Unicode controls vs. markup for bidi support: https://www.w3.org/International/questions/qa-bidi-controls.en
- IBM Plex: https://github.com/IBM/plex
- IBM Plex Sans Arabic web package: https://github.com/IBM/plex/tree/master/packages/plex-sans-arabic
- Noto Arabic docs: https://github.com/notofonts/noto-docs/blob/main/docs/website/use.md
- Noto Arabic: https://github.com/notofonts/arabic
- Tajawal: https://github.com/googlefonts/tajawal
- Mada: https://github.com/aliftype/mada
- Amiri: https://github.com/aliftype/amiri
- Lemonada: https://github.com/Gue3bara/Lemonada
- Changa: https://github.com/googlefonts/changa-vf
- Repository source of truth: `AGENTS.md`, `PROJECT_STATE.md`, `PLAN.md`, `TASKS.md`, and `docs/design-strategy-master-plan.md`.
