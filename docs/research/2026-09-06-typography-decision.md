# Typography Research Supplement — 2026-09-06

## Status
CLOSED / VERIFIED as a decision. Production implementation is a separate task.

## Scope
Arabic-first shared typography for the marketing website, public menu, Owner Studio, and future restaurant web presence. Themes remain protected and are not rewritten by this decision.

## Repository evidence
- `package.json` has no explicit IBM Plex, Noto, Tajawal, Cairo, Mada, Amiri, or other named font dependency.
- The design-system contract requires semantic roles for display, headings, body, buttons, prices, numerals, and code, plus Arabic/Latin/mixed-direction validation.
- No application code, theme, database, dependency, or deployment configuration changed during this decision.

## Candidate comparison
1. **IBM Plex Sans Arabic + IBM Plex Sans — SELECTED DEFAULT**
   - OFL-1.1.
   - Arabic is a first-class family and Plex supports Arabic plus multiple other scripts.
   - Official project provides WOFF/WOFF2 web assets and split subsets.
   - Strong UI orientation and coherent Arabic/Latin family pairing.
2. **Noto Sans Arabic + Noto Sans — ALTERNATE 1**
   - OFL-1.1.
   - Noto documentation explicitly recommends Noto Sans Arabic UI for constrained Arabic UI elements.
   - Strongest general coverage/resilience option.
3. **Tajawal — ALTERNATE 2**
   - OFL-1.1.
   - Modern Arabic/Latin family with seven weights and strong MENA character.
4. **Mada — candidate**
   - OFL-1.1.
   - Geometric, low-contrast, variable font; good for compact UI/signage/display.
5. **Amiri — candidate**
   - OFL-1.1.
   - Classical Naskh; excellent editorial/body-text character, not the universal SaaS UI default.
6. **Noto Kufi Arabic — candidate**
   - OFL-1.1 Noto Arabic family option; strong display/headline character, too geometric for the universal body system.
7. **Lemonada — candidate**
   - OFL-1.1.
   - Contemporary Arabic/Latin family with wide/open counters; expressive but too opinionated for the core system.
8. **Changa — candidate**
   - OFL-1.1.
   - Display-oriented Arabic/Latin family; appropriate for campaign/headline use, not the default UI family.

## Sources
- IBM Plex: https://github.com/IBM/plex
- IBM Plex Sans Arabic web package: https://github.com/IBM/plex/tree/master/packages/plex-sans-arabic
- Noto Arabic docs: https://github.com/notofonts/noto-docs/blob/main/docs/website/use.md
- Noto Arabic: https://github.com/notofonts/arabic
- Tajawal: https://github.com/googlefonts/tajawal
- Mada: https://github.com/aliftype/mada
- Amiri: https://github.com/aliftype/amiri
- Lemonada: https://github.com/Gue3bara/Lemonada
- Changa: https://github.com/googlefonts/changa-vf

## Decision rationale
IBM Plex wins because it provides a single coherent Arabic/Latin family, explicit Arabic support, UI suitability, OFL licensing, and official web delivery/subset options. It also balances premium hospitality/editorial presentation with dense operational UI without forcing one restaurant aesthetic onto every tenant.

## Rejected implementation shortcut
Do not add `@ibm/plex-sans-arabic` merely as a CSS/font dependency. The package documentation includes IBM telemetry. The implementation should use official font assets/licensing directly if self-hosting is adopted.

## Required implementation benchmark
Use real strings covering Arabic, English, mixed direction, SAR, decimals, phone numbers, URLs, long labels, and long product names. Verify small mobile, mobile, tablet, desktop, wrapping, line-height, font swap, layout shift, and payload impact.

## Next task
`W6-01 — Typography Implementation`.
