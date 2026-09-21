# Taste Quick Add + Item Notes Refinement — 2026-09-09

## Scope

Atomic refinement for the Taste public-menu renderer (Heritage compatibility key) only.

- Restore a compact Quick Add control for eligible simple products.
- Keep products with variants or active modifier groups on the existing product-details/options flow.
- Add an optional item-specific customer note inside the product details/options surface.
- Persist the item note through the existing `order_items.selected_options` JSONB field without changing the database schema.
- Surface item notes in Studio order details.

## Evidence

- **VERIFIED:** `src/lib/menu/quick-add.ts` already defines the canonical conservative eligibility rule: unavailable/invalid-price products are blocked, and any configured variants or active modifier groups require the existing options flow.
- **VERIFIED:** `src/components/templates/taste.tsx` owns the Taste public renderer and already has product details, cart, public order submission, analytics, and floating cart behavior.
- **VERIFIED:** `migrations/0009_orders.sql` stores `order_items.selected_options` as JSONB, so item-level note metadata can be persisted without a schema migration.
- **VERIFIED:** `src/lib/menu/orders.ts` is the authenticated Studio order reader and maps `selected_options` into order item details.
- **VERIFIED:** `src/routes/studio/orders.tsx` renders the authenticated order detail surface.

## Design decision

The Quick Add control is a small 44px touch target with a 20px plus icon, white translucent surface, restrained shadow, and no card-level visual chrome. It is rendered only when `getQuickAddDecision(...) === "eligible"`.

The product note is deliberately inside the existing product details/options surface, below variants/modifiers and above the final add-to-order action. It is optional, capped at 500 characters, and supports Arabic/English placeholder text.

## Functional behavior

1. Simple available product → compact plus control → directly enters the existing cart.
2. Product with a variant or active modifier group → no Quick Add control → existing ProductSheet remains the only add path.
3. ProductSheet note is trimmed and persisted with the exact cart line.
4. Two otherwise identical products with different notes remain separate cart lines because the note participates in the cart key.
5. Server validation caps the item note at 500 characters and persists it as a `note` entry in `selected_options`.
6. Studio order details display the item note separately from priced selections.

## Verification status

- **VERIFIED:** source-level integration and regression assertions were added.
- **UNKNOWN:** local `npm test`, `npm run typecheck`, `npm run lint`, and browser/device visual QA could not be executed through the available GitHub-only execution surface in this session.
- **UNKNOWN:** physical-device rendering remains unobserved.
- **DEPLOYMENT_BLOCKED:** the latest branch commit reports a Vercel status failure caused by the linked Vercel project/rate-limit surface; no deployment retry was initiated.

## Files changed

- `src/components/templates/taste.tsx`
- `src/lib/menu/order-public.ts`
- `src/lib/menu/orders.ts`
- `src/routes/studio/orders.tsx`
- `tests/taste-theme.test.mjs`

## Acceptance criteria

- [x] Quick Add uses the existing centralized eligibility rule.
- [x] Quick Add does not bypass required product options.
- [x] Quick Add uses the existing cart state and quantity cap.
- [x] Item notes are optional and Arabic/English aware.
- [x] Item notes are validated server-side.
- [x] Item notes persist without a database migration.
- [x] Studio can distinguish item notes from priced selections.
- [x] No other theme renderer was intentionally modified.
- [ ] Local/browser/device verification remains to be performed before production release.
