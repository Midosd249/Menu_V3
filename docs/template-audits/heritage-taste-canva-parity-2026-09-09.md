# Heritage / Taste — Canva-Parity Replacement Audit

## Status
- `VERIFIED` the active implementation branch is `feat/taste-canva-parity`.
- `VERIFIED` ThemeKey remains `heritage` for compatibility; the visual implementation is the Taste presentation.
- `VERIFIED` the Taste product flow now includes a compact Quick Add action for eligible simple products while preserving the existing details/options flow for configurable products.
- `VERIFIED` item-level notes are supported inside the product details sheet, carried into the cart, and serialized into the existing `selected_options` order record without changing the database schema.
- Main remains intentionally unchanged; merge/deploy is deferred until final visual/device acceptance.

## Request classification
- Major public-menu theme redesign and integration.
- Follow-up: compact Quick Add + internal item notes.
- Research level: Focused.
- Design workflow: repository-first Design Agent methodology.

## Reference evidence
- User supplied the public Taste Canva site URL and full-page mobile screenshot.
- User supplied the HTML/Tailwind implementation as the structural reference.
- The supplied public Canva site URL could not be opened as a Canva design share URL through the connected Canva design API. The supplied screenshot and code remain the direct reference evidence.

## VERIFIED repository findings
- `heritage` remains a canonical ThemeKey and is routed to the Taste presentation.
- The shared public order path is `submitPublicOrder`; no replacement ordering backend was introduced.
- Public action links remain capability/data driven through `PublicActionLinks`.
- The historical shared `public-menu-quick-add` presentation layer remains retired so other themes do not inherit a generic control.
- Taste uses the existing `getQuickAddDecision` and `quickAddKey` logic for eligibility and cart identity.
- Taste product options use the existing `ProductOptions` model.
- The product detail sheet accepts an optional 500-character item note.
- The order validator accepts the item note, and the server persists it as a typed `note` entry inside the existing `selected_options` JSONB field.

## Implemented direction
- New `TasteTemplate` mirrors the supplied reference information architecture: top navigation, image hero, sticky search/categories, featured dishes, borderless editorial product rows, offer section, hours/branches/information cards, customer actions, allergy footer, floating cart, product detail sheet, cart sheet, and order confirmation.
- Heritage now selects `TasteTemplate` on public menu, public theme preview, and authenticated Studio preview.
- `theme-heritage.css` is the scoped Taste visual system rather than an additional historical cascade layer.
- Product descriptions are not line-clamped or card-clipped; price is a separate bottom element in the product copy area.
- Product rows use stable 4:3 media and no surrounding card frame.
- RTL swaps media/copy columns without changing semantic order.
- Hours render from branch-hours data and branches/maps render from branch data.
- Customer actions remain data/capability driven.
- Eligible simple products can be added directly to the cart from the product row using a small borderless plus action positioned over the image.
- Products requiring a variant/modifier remain on the existing product-details/options flow.
- The compact Quick Add visible mark is intentionally small and transparent: the mobile visual is approximately 32px while the control remains comfortably tappable.
- Item notes are collected only inside the product details sheet and are displayed again in the cart before checkout.
- Order submission carries item notes through the existing validated server path and stores them in `selected_options`.

## What is deliberately not copied
- No proprietary Canva assets, hidden source code, private design metadata, or non-public branding was copied.
- The supplied public visual principles and user-provided code structure are transformed into the existing Menu V3 architecture.
- No database migration was introduced for item notes because the existing `selected_options` JSONB column is sufficient for the typed note entry.

## Acceptance criteria
- Heritage visually follows the supplied Taste direction rather than the previous Heritage treatment.
- Existing public menu data, ordering, options, cart, analytics, language routing, branch selection, and tenant isolation remain on the existing paths.
- Quick Add is available only for products that the existing eligibility function marks as eligible.
- Quick Add is compact, borderless, visually subordinate to the product image, and does not become a pill/circle UI.
- Products requiring options continue through the details/options flow.
- Item notes are optional, limited to 500 characters, visible in the cart, and persisted with the item order record.
- Arabic RTL and English LTR remain supported.
- Product text and price remain readable for long names/descriptions and SAR values.
- Mobile, tablet, and desktop layouts remain structurally stable.
- Theme preview and Studio preview both render the Taste template.

## Verification results
- `VERIFIED` current branch contains the Taste implementation and the Quick Add visual refinement.
- `VERIFIED` `src/components/templates/taste.tsx` already uses `getQuickAddDecision`, `quickAddKey`, `addSimpleProduct`, and the item-note field.
- `VERIFIED` `src/lib/menu/order-public.ts` validates the item note and stores it in the existing `selected_options` JSONB payload.
- `VERIFIED` `src/quick-add-compact-refinement.css` keeps the historical shared `.public-menu-quick-add` class retired and scopes the new visual treatment to the Taste product action.
- `NOT RUN` direct local `npm run typecheck`, `npm test`, `npm run lint`, and `npm run qa:template` execution was not available in this environment.
- `NOT RUN` physical-device/browser visual QA and real QR-camera scan were not available through the connected tools.
- `BLOCKED` direct authenticated Vercel page rendering could not be inspected through the connected fetch surface.

## UNKNOWN / BLOCKED
- Physical-device pixel fidelity and QR-camera scanning require user/device evidence.
- Production deployment is intentionally not part of this implementation iteration.
