# Heritage Final Numbering and Action Refinement — 2026-09-07

## Scope
- Theme: `heritage`
- Template family: `contemporary-restaurant`
- Scope: presentation-only refinement of decorative numbering, hero metadata, language-control placement, and existing customer-action presentation.

## Evidence
- **VERIFIED:** `src/components/templates/contemporary-restaurant.tsx` renders the shared Heritage-compatible hero, action rail, language toggle, featured cards, category headings, product numbers, and section metadata.
- **VERIFIED:** the shared renderer emits decorative ordinals through `.editorial-card-index`, `.editorial-product-number`, section-heading leading spans, and a `VOL. 03` hero kicker value.
- **VERIFIED:** `src/components/public-action-links.tsx` already renders action icons and delegates visibility/destination selection to `getPublicActions`.
- **VERIFIED:** `src/lib/menu/public-actions.ts` conditionally exposes only valid configured WhatsApp, map/location, phone, and Instagram destinations.
- **VERIFIED:** the existing action ownership and analytics behavior were not changed.

## Design decisions
- **VERIFIED:** Heritage now suppresses all decorative numbering in featured cards, product rows, category headings, information headings, and the hero volume marker.
- **VERIFIED:** product information remains ordered as image → name → description/tags, with price isolated in its own grid cell and normal document flow.
- **VERIFIED:** the language switch is visually promoted into the Heritage header/action rail instead of reading as an unrelated control below the hero.
- **VERIFIED:** the existing WhatsApp, location, phone, and Instagram controls retain their data-driven visibility rules and iconography.
- **PROPOSED:** if future public-action types are added, extend the existing action registry/component rather than adding theme-specific fake links.

## Accessibility / responsive intent
- Important controls retain mobile-sized touch targets.
- RTL/LTR price isolation remains explicit through `direction: ltr` and `unicode-bidi: isolate`.
- Mobile action controls remain horizontally scrollable rather than wrapping into an unstable multi-row cluster.
- **UNKNOWN:** final physical-device pixels remain unobserved in the current connector environment.

## Verification
- **VERIFIED:** GitHub diff from baseline `ce9ae28748dfed4675db2748a10fa03cc85e321d` is limited to Heritage CSS and its focused browser-hardening contract before documentation changes.
- **UNKNOWN:** local `npm test`, typecheck, lint, and build could not be executed because the repository is not mounted in the local execution environment.
- **UNKNOWN:** browser/device visual QA is unavailable in the current environment.
