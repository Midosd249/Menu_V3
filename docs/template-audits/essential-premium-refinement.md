# Essential Premium Refinement Audit

## Status
- Date: 2026-09-05
- Template: `essential`
- Family: `small-menu`
- Tier: `free`
- Routes: `/m/$slug` and `/m/$slug/$branch`
- Implementation status: VERIFIED
- Browser/device sign-off: UNKNOWN / BLOCKED

## Scope
This is a focused refinement milestone for the existing Essential public-menu theme. The theme key, family, tier, shared public-menu behavior, routes, tenant/branch boundaries, and business-data contracts are preserved.

## Evidence reviewed
- `src/lib/theme/registry.ts`
- `src/theme-essential.css`
- `src/components/public-menu.tsx`
- `src/components/menu-theme-controller.tsx`
- `docs/template-brief-essential.md`
- `docs/design-intelligence.md`
- `docs/template-review-checklist.md`
- `docs/visual-functional-audit.md`
- `package.json`
- Git history for `src/theme-essential.css`
- External research recorded in `docs/design-research-log.md`

## Capability audit
- **VERIFIED:** shared public-menu owns item details, modifiers, cart/order, search, category navigation, language switching, and configured customer actions.
- **VERIFIED:** Essential remains presentation-only within the existing shared interaction architecture.
- **VERIFIED:** no new customer-facing action was introduced by the Essential refinement.
- **VERIFIED:** WhatsApp, phone, map/location, and social actions remain conditional on verified configured data.

## Visual findings
### First screen / identity
- **VERIFIED:** Essential uses a compact branded header and a paper-based hero panel.
- **VERIFIED:** the hero is data-driven through the shared public-menu rather than a hard-coded restaurant identity.
- **ACCEPTANCE:** restaurant name, branch context, and available configured content remain the first meaningful identity layer.

### Typography and hierarchy
- **VERIFIED:** Essential has explicit heading, body, accent, and price treatments.
- **VERIFIED:** long item names and descriptions are allowed to wrap rather than forcing horizontal overflow.
- **VERIFIED:** Arabic and Latin/mixed-direction content receive bidi-aware treatment.
- **ACCEPTANCE:** no clipping or meaning loss with long Arabic, English, or mixed strings.

### Category navigation
- **VERIFIED:** Essential retains sticky category navigation.
- **VERIFIED:** navigation controls receive practical minimum dimensions and theme-specific styling.
- **UNKNOWN:** actual touch ergonomics, sticky overlap, and many-category behavior require browser/device evidence.

### Product cards
- **VERIFIED:** Essential retains the existing horizontal card architecture.
- **VERIFIED:** card media has a stable square treatment and missing images use the existing fallback.
- **VERIFIED:** product names/descriptions use overflow-safe wrapping and prices are kept on one line.
- **PROPOSED:** keep the horizontal model as the defining Essential pattern; do not introduce premium-only image-heavy composition into the Free theme.

### Responsive behavior
- **VERIFIED:** narrow-phone and desktop breakpoints explicitly adjust card proportions and content width.
- **VERIFIED:** the theme contains a narrow-phone guard at `max-width: 360px`.
- **UNKNOWN:** actual viewport screenshots and device browser rendering.

## Interaction audit
### Cart / ordering
- **VERIFIED:** cart/order functionality exists in the shared public-menu renderer.
- **VERIFIED:** Essential does not duplicate or alter order business logic.
- **UNKNOWN:** end-to-end activation, badge accuracy, quantity/modifier editing, navigation persistence, and final submission feedback without browser execution.

### WhatsApp / phone / map / social
- **VERIFIED:** these capabilities are implemented at the shared public-menu layer.
- **VERIFIED:** Essential styling does not fabricate or hard-code them.
- **UNKNOWN:** real configured-link activation and mobile behavior without browser/device execution.

### Search / categories
- **VERIFIED:** search and category navigation are existing public-menu capabilities.
- **UNKNOWN:** Arabic/English/mixed search behavior, keyboard interaction, empty results, and sticky navigation under a real browser session.

### Icons
- **VERIFIED:** existing icons remain owned by the shared public-menu.
- **VERIFIED:** Essential increases minimum sizing for sticky controls and preserves focus treatment.
- **UNKNOWN:** final icon placement and reachability at each supported viewport until visual QA is run.

## Accessibility
- **VERIFIED:** visible `:focus-visible` treatment exists for Essential product cards and focused fields.
- **VERIFIED:** key control dimensions use practical mobile minimums; WCAG 2.2 SC 2.5.8 research is recorded.
- **UNKNOWN:** full keyboard traversal and assistive-technology behavior without executable browser tooling.

## Performance
- **VERIFIED:** shared product media uses lazy loading for below-fold product images.
- **VERIFIED:** Essential preview mode disables scroll-linked section animation so preview content remains visible.
- **VERIFIED:** the theme uses CSS-only effects and no new dependency.
- **UNKNOWN:** actual Core Web Vitals until the performance audit runs against a rendered deployment.

## SEO / public page
- **VERIFIED:** Essential refinement does not change public routing, metadata, canonical logic, or structured-data generation.
- **VERIFIED:** no preview-only SEO behavior was introduced by this refinement.
- **UNKNOWN:** rendered metadata inspection in a browser/crawler environment.

## Real-data test matrix
Required cases:
- Arabic-only: VERIFIED by source-safe wrapping rules; runtime rendering UNKNOWN.
- English-only: VERIFIED by source-safe wrapping rules; runtime rendering UNKNOWN.
- Bilingual: VERIFIED by source-safe wrapping rules; runtime rendering UNKNOWN.
- Mixed-direction: VERIFIED by `unicode-bidi: plaintext` scoped rules; runtime rendering UNKNOWN.
- Long restaurant/category/item names: VERIFIED by overflow-safe CSS; runtime rendering UNKNOWN.
- Varied SAR prices: VERIFIED by nowrap/tabular price treatment; runtime rendering UNKNOWN.
- Missing image: VERIFIED by existing fallback path; runtime appearance UNKNOWN.
- Varied image ratios: VERIFIED by stable object-fit containers; runtime appearance UNKNOWN.
- Sold-out: capability preserved; runtime visual state UNKNOWN.
- Modifiers/options: shared dialog preserved; runtime behavior UNKNOWN.
- Sparse/dense categories: source supports sticky navigation; runtime behavior UNKNOWN.
- One/multiple branches: shared route/data architecture preserved; runtime verification UNKNOWN.
- Loading/empty/error/offline/unavailable: shared state architecture preserved; runtime appearance UNKNOWN.

## Design decision
**PROPOSED / VERIFIED implementation decision:** retain Essential's horizontal product-card model and restrained warm-paper visual language. The theme is the Free `small-menu` option, so the refinement improves hierarchy, legibility, and tactile quality without turning it into an image-heavy Premium template.

## Known runtime issues
- **UNKNOWN:** Opera white-background inconsistency is not an Essential-specific issue established by repository evidence; no Opera session is available.
- **UNKNOWN:** old-theme/first-paint flash requires actual browser first-paint evidence. Essential preview CSS already prevents scroll-linked sections from hiding content after hydration.

## Acceptance criteria
- Essential remains `free`, `small-menu`, and `essential`.
- No other theme is modified.
- No application feature, database behavior, auth, authorization, tenant isolation, branch isolation, subscription logic, route contract, or deployment setting is changed.
- No clipping, horizontal trap, or obscured primary content is introduced by the theme-scoped CSS.
- Product name and price remain stronger than decoration.
- Existing cart/order/contact/search/category capabilities remain owned by the shared renderer.
- Browser/device visual evidence is required before declaring the milestone fully closed.

## Verification plan
Run in an executable repository/browser environment:
1. `npm run typecheck`
2. `npm test`
3. `npm run test:platform`
4. `npm run lint`
5. `npm run build`
6. `npm run qa:template`
7. `npm run performance:audit`
8. Capture Essential at small/standard/large mobile and supported desktop/tablet sizes.
9. Capture Arabic RTL, English LTR, and mixed-direction states.
10. Exercise search, category navigation, product details, modifiers, cart/order, language, and configured contact/location actions.
11. Inspect first paint, hydration, sticky controls, safe areas, console errors, overflow, and image layout.

## Rollback
- Revert only the Essential-specific presentation commit(s) if runtime evidence identifies a regression.
- Do not modify shared business logic to correct a presentation issue.
- Do not alter subscription enforcement to make the theme preview or saved theme behavior pass.
