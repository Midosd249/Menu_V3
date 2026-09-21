# Noir Premium Refinement Audit

## Scope
- Actual theme ID: `noir`
- Template family: `fine-dining-hospitality`
- Public route: `/m/$slug` and `/m/$slug/$branch`
- Scope boundary: Theme 3 / Noir only; other themes remain protected.

## Evidence status
- **VERIFIED:** `noir` is a Premium theme using the `fine-dining-hospitality` family.
- **VERIFIED:** the public menu supports product details, modifiers, cart/order behavior, language switching, search/category navigation, and configured customer actions through the shared public-menu surface.
- **VERIFIED:** current Noir CSS already provides a dark canvas, cinematic hero, sticky category rail, editorial product cards, reduced-motion handling, and focus styling.
- **VERIFIED:** current source does not contain the screenshot's alleged circular product-card implementation; the circular-vs-grouped issue is therefore treated as **UNKNOWN** from repository evidence and is not reproduced as a source-level defect.
- **UNKNOWN:** real browser screenshots, QR scanning, Opera reproduction, and device-level visual comparison are unavailable in the current agent environment.

## Research basis
- W3C WCAG 2.2: pointer target minimum 24×24 CSS pixels; 44×44 is the enhanced AAA target with exceptions.
- Google Search Central LocalBusiness guidance: structured data should describe the real local business and page content.
- web.dev responsive-image guidance: preserve aspect ratio, reserve image space, and use responsive/lazy loading appropriately.
- Saudi/MENA public examples reviewed: Al Qaima, Nasj Menu, and TableGreet. These were used for transferable bilingual/mobile/QR/menu principles only.

## Intended segment
Luxury restaurants, fine dining, chef-led hospitality, and premium evening concepts that benefit from cinematic presentation while still requiring fast menu scanning and clear conversion actions.

## Visual personality
Cinematic, dark, warm-metal, tactile, restrained, editorial, and hospitality-led. Decoration must remain subordinate to item name, description, price, availability, and action.

## Screenshot findings
1. **PROPOSED:** upper content should have stronger alignment and a more deliberate relationship between title, image, description, and price.
2. **UNKNOWN:** the reported circular upper-card layout cannot be verified against current `main` source and must not be recreated or preserved speculatively.
3. **VERIFIED:** the current product pattern is a structured horizontal card, which is the safer information architecture for long names and SAR prices.
4. **VERIFIED:** the hero currently uses restaurant/branch data and optional configured tagline; the small eyebrow copy is generic.
5. **VERIFIED:** the shared public-menu surface owns supported search, category, cart, ordering, and customer-action behavior; the refinement should style and prioritize these rather than duplicate them.

## Header / hero
- Keep restaurant and branch identity data-driven.
- Make configured tagline the primary descriptive copy when present.
- Use a neutral fallback rather than inventing permanent marketing claims.
- Keep language control reachable and visually subordinate to restaurant identity.
- Preserve the dark first paint as a priority.

## Circular vs grouped-card decision
- **Decision: Option B only if circular presentation is actually present in runtime evidence.**
- Current repository evidence shows no circular product implementation in the Noir template. Therefore no speculative circular rewrite is authorized from source inspection alone.
- The refinement uses the existing structured card grammar and improves hierarchy, alignment, density, and resilience instead.
- If a later screenshot proves a separate runtime circular composition, that composition must be audited against long names, prices, accessibility, and scanability before any change.

## Typography / alignment
- Preserve Arabic-specific `IBM Plex Sans Arabic` treatment.
- Use `text-wrap: balance` where supported for headings.
- Prevent price wrapping and preserve numeric readability.
- Keep descriptions visually secondary but readable.
- Avoid fixed-width text assumptions in RTL.

## Pricing / SAR
- Preserve existing `MenuPrice` / `formatSar` behavior.
- Ensure price remains visually distinct from body copy.
- Do not hard-code currency or alter pricing truth.

## Images / fallbacks
- Preserve existing image/fallback behavior.
- Maintain stable aspect-ratio containers.
- Keep below-fold product imagery lazy-loaded through the existing component contract.
- Avoid decorative filters that reduce food recognition.

## Icons / actions
- Existing shared controls are audited through the public-menu implementation.
- Do not add unsupported actions.
- Cart, WhatsApp, phone, map, and social actions must appear only when configured/supported.
- Icon-only controls require accessible names and adequate touch targets.

## Cart / ordering
- **VERIFIED:** ordering/cart capability exists in the shared public-menu implementation.
- **Required refinement:** ensure Noir styling does not obscure or visually demote cart entry, product-detail add action, quantity controls, or order submission.
- Preserve existing ordering validation and totals.

## WhatsApp / phone / map / social
- **VERIFIED:** these capabilities are represented in the shared public-menu surface; visibility depends on configured data.
- No new business data or actions are introduced by this refinement.

## RTL / LTR
- **VERIFIED:** theme CSS contains explicit RTL typography overrides.
- **Required:** long Arabic, English, and mixed-direction strings must remain readable without clipping or overlap.

## Opera background issue
- **UNKNOWN:** no authenticated Opera browser/device environment is available to reproduce the reported white background.
- The refinement adds no browser-specific hack and does not claim a root cause without reproduction evidence.

## Initial old-theme flash
- **UNKNOWN:** no browser trace or first-paint screenshot is available to verify the reported flash.
- **INFERRED:** theme tokens are applied client-side by `MenuThemeController`; the route already renders the template shell from loader data. A first-paint flash can therefore only be conclusively diagnosed with server HTML/paint evidence.
- No timeout or forced delay is introduced.

## Acceptance criteria
- Restaurant identity and configured tagline have clear hierarchy.
- Noir remains visibly dark from first meaningful paint where server/runtime evidence permits.
- Product name and price remain stronger than decoration.
- Long Arabic/English/mixed text does not clip or overlap.
- Structured cards remain stable with missing images/descriptions and varied SAR prices.
- Existing cart/order/search/category/customer actions remain functional and correctly prioritized.
- No unsupported action is introduced.
- Reduced-motion and focus behavior remain intact.
- SEO/canonical behavior remains unchanged.

## Test plan
- Source inspection of theme registry, template, public-menu, theme controller, and shared styles.
- `npm run typecheck`
- `npm test`
- `npm run lint`
- `npm run build`
- `npm run qa:template`
- `npm run performance:audit`
- Browser/device screenshots when an executable browser environment is available.
- Edge and Opera comparison when available.

## Rollback plan
Revert only the Noir-specific template/CSS refinement commits. Do not revert preview routing, other themes, database, auth, subscription, or deployment changes.
