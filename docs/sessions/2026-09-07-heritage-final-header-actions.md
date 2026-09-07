# Heritage Final Header and Numbering Refinement

## Classification
- Visual/theme/layout refinement for the Heritage public menu.
- Atomic scope: remove all decorative item/category numbering from Heritage, refine the hero/header, improve language-switch placement, and preserve valid customer action icons.

## Evidence
- `VERIFIED`: current `main` includes the Heritage readability merge `ce9ae28748dfed4675db2748a10fa03cc85e321d`.
- `VERIFIED`: Design Agent requires image/name/description/price hierarchy, stable layout, RTL/LTR quality, and customer actions only when supported by valid configured data.
- `VERIFIED`: previous Heritage work removed the visible first `01` numbering but the requested contract is now broader: no decorative numbering for categories or dishes.
- `UNKNOWN`: browser/device pixels are not directly observable through the current GitHub connector surface.

## Design decisions
- Remove decorative sequence/ordinal markers from Heritage category and product presentation; content itself is the navigation hierarchy.
- Keep hero compact, editorial, premium, and information-led rather than ornamental.
- Place language switching in the header as a compact, clearly labeled control with adequate touch target and RTL/LTR-safe ordering.
- Preserve WhatsApp, phone, map/location, and social controls only when valid configured data exists; do not fabricate actions.
- Keep product information order: image, name, description, price, action.
- Do not alter data ownership, cart logic, tenant/branch isolation, auth, subscriptions, or customer-action semantics.

## Verification boundary
- Repository/source verification can confirm selectors and contracts.
- `UNKNOWN`: final browser/device visual verification until rendered screenshots or browser access are available.

## Next action
- Run the relevant Heritage/browser quality checks in an environment with browser execution and inspect mobile/desktop RTL/LTR rendering.
