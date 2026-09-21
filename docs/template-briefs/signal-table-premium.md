# SIGNAL TABLE — Template Brief

## Status
IMPLEMENTATION_IN_PROGRESS

## Intent
Replace the Editorial Canvas presentation with one premium hospitality presentation called SIGNAL TABLE. Preserve the existing public-menu data, cart/order, analytics, tenant/branch, locale, QR, SEO, and configured-action contracts.

## Visual thesis
Identity → Signature Stage → Cuisine Rail → Menu Stream → Product Detail → Order Bar → Cart / Order.

SIGNAL TABLE is intentionally not a card-grid restyle. The menu reads as a calm hospitality interface with strong editorial hierarchy, restrained surfaces, food-led imagery, and compact utilities.

## Hard rules
- Product numbers are forbidden.
- Category numbers are forbidden.
- No CSS counters or generated numeric prefixes.
- No fixed heights around unpredictable Arabic text.
- No overflow masking as a text-layout fix.
- No scroll-driven visibility.
- No duplicate public-menu architecture.

## Type
- Body/UI: Readex Pro candidate.
- Arabic display: Alexandria candidate.
- English accent: Playfair Display candidate.
- Runtime choice must remain repository-safe and verified for loading/licensing/performance.

## Palette
- Porcelain: #F7F5F0
- Deep Navy: #101827
- Cobalt: #315BFF
- Warm Signal: #F0A43C
- Soft Gray: #E5E7EA
- Muted Ink: #667085

## Responsive
Mobile primary: 360 / 375 / 390 / 412 / 430.
Tablet: 768 / 834.
Desktop: 1024 / 1280 / 1440.

## Product unit
Image → name → description → price → availability → action.

Use logical properties and direction-aware text isolation. Prices stay independent from title wrapping.

## Verification
Required before DONE:
typecheck, tests, platform tests, lint, build, auth invariant, GitHub Quality, W9 Orders, browser/Playwright, accessibility, performance, RTL/LTR/mixed-direction, and final diff audit.
