# Theme 1 — Essential Refinement Brief

## Identity
- Template / family: Essential / `small-menu`
- Supported `ThemeKey`: `essential`
- Tier: Free
- Target restaurant concept: everyday Saudi restaurant, cafe, bakery, or casual hospitality venue that needs a polished menu without visual overhead.
- Primary visual promise: quiet, dependable hospitality with warm paper, strong Arabic-first typography, and food-led clarity.
- Art direction: restrained atelier/editorial cues, not luxury ornament and not a generic app shell.
- Research references: `docs/design-research-log.md` (2026-09-05 baseline and Essential-specific research).

## Customer and conversion intent
- Primary action: discover categories and dishes quickly, then open an item when more detail or ordering is useful.
- Secondary action: use the existing search, language, contact/location, and ordering actions when repository data/capabilities expose them.
- Conversion goal: reduce browsing friction and make the next useful action obvious without competing with the menu.
- Critical information: restaurant identity, category context, item name, description when present, availability, price in SAR, and supported action state.

## Content and language
- Default language: Arabic when the menu is configured for Arabic.
- Arabic RTL: native reading order; accent rules and spacing use logical positioning.
- English LTR: preserve the same hierarchy without mirrored visual awkwardness.
- Mixed direction: names, prices, Latin brand terms, and Arabic copy must remain legible without overflow.
- Sample content style: concise, appetizing, factual hospitality copy; avoid invented claims, fake offers, or unsupported ordering/payment promises.
- Long text: clamp only where the existing information architecture permits; otherwise allow natural wrapping without clipping.

## Layout and hierarchy
- First screen: compact identity/header, clear menu purpose, then category discovery and first products; no decorative layer may obscure content.
- Header: compact branded identity with quiet language control.
- Category navigation: sticky, horizontally scrollable where required, visually tactile but subordinate to the menu.
- Section rhythm: generous enough to separate categories while retaining the efficient Free-theme character.
- Product cards: horizontal, image + copy, with name and price carrying the first scan.
- Images: square card media with stable dimensions; missing images use the existing neutral fallback.
- Price: accent color and tabular numerals; never rely on color alone for price or availability meaning.
- Featured items: restrained emphasis only; do not turn Essential into an image-heavy premium theme.
- Density: compact enough for real menus, with predictable spacing and no horizontal traps.

## Interaction hierarchy
- Primary interactive controls: item cards and the existing order/cart action when enabled.
- Secondary: category buttons, search, language toggle, and verified contact/location actions.
- Icons: semantic, familiar, consistently sized, with accessible names for icon-only controls.
- Visible labels: prefer labels for high-value actions; icons support scanning rather than replace meaning.
- Focus: visible and theme-consistent; focused controls must not be hidden behind sticky/fixed UI.
- Feedback: preserve existing loading, disabled, validation, unavailable, and error behavior.

## Cart and ordering
- Preserve the repository's existing cart/order capability exactly; do not add checkout/payment claims.
- Keep the cart reachable without allowing it to visually dominate the menu.
- Preserve quantity/modifier validation and existing order submission semantics.
- Empty/error/unavailable states remain explicit and readable.

## Contact and location actions
- WhatsApp, phone, and map actions appear only when existing verified data exposes them.
- Their placement should support the restaurant identity without competing with the menu's primary browse path.
- Icon-only actions require accessible names and practical touch targets.

## Mobile safe-area behavior
- Preserve bottom safe-area padding for public content.
- Sticky category controls must not cover focused content.
- Maintain one-handed reachability and avoid stacked fixed controls that consume excessive viewport height.
- Preserve the existing modal/drawer behavior; visual refinement must not create a new stacking context or overlay trap.

## Real-data resilience
- Long restaurant/category/item names: wrap naturally and preserve hierarchy.
- Missing descriptions: card remains balanced without a phantom gap.
- Missing/low-quality images: fallback remains intentional and stable.
- Mixed image ratios: crop inside a stable media box.
- SAR prices: tabular, readable, and resistant to wrapping.
- Sold-out items: preserve existing truth/state and make it distinguishable without color alone.
- Modifiers/variants: preserve existing dialog behavior and validation.
- Few/many categories: navigation remains usable and scrollable.
- Few/many products: whitespace scales without collapsing hierarchy.
- Multiple branches: preserve existing branch context and verified location data.
- Loading/empty/error/offline: retain existing semantics and clear state communication.

## Refinement plan
1. Tighten Essential's typography and spacing tokens without changing the theme family or data contract.
2. Clarify header, category, item, and action hierarchy through existing selectors and theme-scoped styles.
3. Harden long-content, narrow-phone, RTL/LTR, focus, safe-area, and sticky-navigation behavior.
4. Remove preview-only animation risk by forcing Essential preview content to remain visible after hydration.
5. Keep motion progressive and disabled for reduced-motion users.
6. Preserve all existing business interactions and other theme styles.
7. Verify source-level invariants and run repository quality gates; browser/device evidence remains mandatory before the milestone can be called fully closed.

## Acceptance criteria
- Essential remains the same `ThemeKey`, Free tier, and `small-menu` family.
- No other theme receives changes.
- No new product behavior, payment flow, dependency, database, auth, or deployment behavior is introduced.
- Arabic RTL, English LTR, mixed-direction, long text, missing images, sold-out, modifiers, and category-density states remain visually stable by source-level design rules.
- Interactive targets remain comfortably usable and visible under keyboard focus.
- Preview mode cannot hide Essential content through scroll-linked animation.
- Public SEO/business facts remain controlled by existing data and route logic.
- Final milestone requires browser/device visual evidence for mobile and desktop; if unavailable, the state is `BLOCKED`, not `DONE`.

## Verification plan
- Source review: `src/theme-essential.css`, `src/lib/theme/registry.ts`, shared public-menu renderer, preview-layer rules.
- Automated: `npm run typecheck`, `npm test`, `npm run test:platform`, `npm run lint`, `npm run build` when the environment can execute them safely.
- Browser/device: Essential at small/standard/large mobile and desktop, post-hydration, Arabic RTL, English LTR, mixed-direction, long text, missing image, sold-out, modifiers, sparse/dense categories, and supported contact/order actions.
- Required evidence: screenshots plus interaction observations for sticky navigation, item dialog, cart/order, search, language, phone, WhatsApp, map, focus, and safe-area behavior.
- Known limitation: authenticated browser/device execution is not available in this agent environment as of 2026-09-05.
