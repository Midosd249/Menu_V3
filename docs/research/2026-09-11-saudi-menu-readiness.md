# Saudi Menu Readiness — 2026-09-11

## Status
- Research basis: VERIFIED against official SFDA pages available on 2026-09-11.
- Product implementation: V4 `Saudi Menu Readiness`.
- This feature is an internal readiness aid, not a legal compliance certification.

## Verified SFDA signals
- SFDA publishes requirements for calorie information on food menus and states that calorie information must be displayed clearly and against the relevant menu item; the guidance covers electronic menu formats as well as other menu forms.
- SFDA's allergen disclosure material states that food establishments serving food outside the home must disclose relevant food allergens in menus. The published list includes gluten-containing cereals, crustaceans, fish, eggs, peanuts, mustard, nuts, sesame, milk, mollusks, sulfites, lupin, celery, and soybeans.
- SFDA announced additional nutrition-related menu requirements effective from 2025-07-01, including high-salt meal labeling, caffeine disclosure for beverages, and physical-activity time information. The announcement states that these requirements apply to physical and electronic menus and online food-ordering platforms.

## Product boundary
The current Menu V3 `Product` contract contains `calories`, `allergens`, Arabic/English names and descriptions, but does not contain dedicated fields for caffeine, high-salt labeling, or physical-activity equivalence.

Therefore V4:
1. scores only supported data fields;
2. flags missing supported information;
3. explicitly reports unsupported nutrition fields as `not_supported`;
4. never infers or fabricates nutrition values;
5. never claims legal compliance.

## Next authorized direction
If a future milestone adds Saudi nutrition data capture, first verify the exact current SFDA technical requirements and then introduce only the minimum schema fields required, with server-side validation and migration tests.
