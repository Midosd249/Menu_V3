# Saudi Food Disclosure Extension — 2026-09-13

## Status

**VERIFIED LOCALLY / NOT DEPLOYED.** This note records a focused implementation pass for Saudi food disclosure support. It does not certify any restaurant, menu, or product as legally compliant.

## Official evidence

The Saudi Food and Drug Authority (SFDA) announcement states that the relevant menu regulations take effect on 1 July 2025 and apply to physical and electronic menus and online food-ordering platforms. The announcement identifies caffeine-content disclosure, high-salt labeling, and physical-activity calorie-burn labeling for restaurants and cafes. [1]

The SFDA announcement describes caffeine disclosure in milligrams per 100 ml or per cup and references a 400 mg maximum daily caffeine intake for adults. The product implementation stores the measurement basis explicitly and does not calculate or claim daily intake. [1]

The SFDA announcement describes high-salt labeling for menu items exceeding 5 g salt, stated as approximately 2,000 mg sodium, using a salt indicator. The implementation derives a warning from stored sodium data at or above 2,000 mg and does not accept a client-controlled warning flag. [1]

The SFDA announcement identifies physical-activity calorie-burn labeling but does not provide the calculation formula in the accessed announcement. Walking-time calculation remains **UNKNOWN** and was not implemented. [1]

## Repository mapping

| Requirement | Current implementation | Evidence status |
|---|---|---|
| Calories | Existing nullable `products.calories` field and public display preserved | VERIFIED in repository |
| Sodium | New nullable `products.sodium_mg` numeric field, server validation, owner input, public display | VERIFIED implementation; regulatory mapping based on [1] |
| High salt | Server-independent derived helper at sodium >= 2,000 mg | VERIFIED implementation; exact legal presentation remains to be validated against the technical regulation |
| Caffeine | New nullable `products.caffeine_mg` and `caffeine_basis` (`per_100ml` or `per_cup`) | VERIFIED implementation; exact serving and presentation details require the technical regulation |
| Allergens | Existing owner text field and public display preserved | Existing functionality; controlled 14-category model remains UNKNOWN and was not duplicated |
| Physical activity | Not implemented | UNKNOWN formula; intentionally deferred |
| Children’s menu rules | Not implemented | UNKNOWN and outside this focused pass |
| VAT/pricing claims | No change | Separate commercial/tax verification required |

## Safety decisions

Nutritional fields remain nullable. Empty values are not replaced with guesses. AI/import behavior was not expanded to invent nutrition, caffeine, sodium, salt, allergen, or compliance facts. The user-facing copy states that Menu V3 does not independently certify nutritional accuracy or legal compliance.

The migration targets `menu_v3.products` explicitly. It adds backward-compatible nullable fields and database checks for non-negative bounded values and the two supported caffeine bases.

## Verification

The canonical Supabase migration was applied successfully to project `ublxptcqefujkbeepylc`. A read-only schema check confirmed `calories`, `sodium_mg`, `caffeine_mg`, and `caffeine_basis` in `menu_v3.products`.

The focused contract tests passed: 7 tests, 0 failures. ESLint passed with 0 errors and existing warnings. TypeScript remains blocked by pre-existing route/type-generation errors outside this change; the changed Product fields no longer appear among the reported errors after the duplicate type definition was corrected.

## References

[1]: https://www.sfda.gov.sa/en/news/17639 "The SFDA Issues Three New Regulations to Promote Healthy Community Nutrition"
[2]: https://www.sfda.gov.sa/en/news/18680 "SFDA to Implement New Food Rules for Transparency and Consumer Health"
[3]: https://mwasfah.sfda.gov.sa/Home "Mwasfah official technical-regulation store"
