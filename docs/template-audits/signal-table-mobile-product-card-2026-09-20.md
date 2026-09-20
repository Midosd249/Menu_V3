# SIGNAL TABLE — Mobile Product Card Structural Audit

## Status

- Classification: public-menu visual regression / structural layout remediation
- Theme identifier: `editorial` compatibility key → SIGNAL TABLE presentation
- Scope: `src/components/templates/signal-table.tsx` and `src/theme-signal-table.css` only, plus targeted regression contracts and continuity documentation.
- Implementation status: CLOSED / MERGED / VERIFIED
- Evidence status: repository + CI/browser verified; physical-device visual rendering remains UNKNOWN until directly observed.

## Acceptance failure

The supplied mobile screenshot shows Arabic product names collapsing into a narrow vertical column, detached/sideways price placement, and excessive row height. This is treated as a structural layout failure, not a content or image-quality issue.

## Root cause — VERIFIED from current source

1. The menu-item DOM placed the title and price in a shared `signal-product-topline` grid, so the price was a sibling column rather than part of the protected text flow.
2. The product card used a proportional media track (`minmax(7rem,22%)`) and a second flexible track. This made the content geometry dependent on intrinsic sizing rather than guaranteeing the requested fixed mobile media width.
3. The text column was a grid item but did not have the explicit flex-style contract requested for this repair (`flex: 1 1 auto; min-inline-size: 0`).
4. Quick-add was absolutely positioned over the product-card wrapper. Although it did not directly define the text width, it created an additional overlapping layer and could compete with the card content at narrow widths.
5. The existing regression test asserted the old two-column title/price pattern instead of asserting the required title → description → price document flow.

## Final structural contract

- Card root: one product-card button with no fixed height.
- Media: fixed `92px × 92px` square on mobile; non-shrinking and object-cover.
- Content: one protected `min-inline-size: 0` column with `flex: 1 1 auto`.
- Information order: title → description (when present) → price → optional tags.
- Title: maximum two lines with safe clipping/ellipsis.
- Description: maximum two lines with safe clipping/ellipsis.
- Price: its own block in normal flow, `white-space: nowrap`, normal word wrapping, isolated bidi handling.
- Quick-add/options: separate in-flow action row; never absolutely positioned over the card.
- RTL/LTR: the grid follows document direction; the fixed media track remains the side column while the text remains one protected column.
- No product/category numbering or generated numeric prefixes.

## Research basis

- MDN documents that grid/flex items can retain intrinsic minimum sizes unless `min-width: 0` is explicitly used; the repair therefore makes the text column explicitly shrinkable.
- MDN documents `minmax(0, 1fr)` as the safe flexible grid track pattern and explains that writing direction affects grid placement.
- MDN documents `-webkit-line-clamp` compatibility behavior and the requirement for overflow clipping when using the legacy interoperable form.
- WCAG 2.2 requires pointer targets to be at least 24×24 CSS px unless an exception applies; important mobile actions remain substantially larger than that baseline.

## Verification plan

- Targeted Node regression contracts.
- Repository typecheck, tests, lint, and production build.
- GitHub Quality and W9 Orders QA.
- Browser visual verification at 320/375/430px Arabic RTL plus English LTR.
- Physical Android/iOS verification remains UNKNOWN until directly observed.


## Final Verification — 2026-09-21

- VERIFIED: PR #227 merged into `main` as `dd8db716d0170543590b875f15e3dec99d8cba4c`.
- VERIFIED: final Quality gate passed after isolating the shared legacy `theme-price-consistency.css` selectors from SIGNAL TABLE.
- VERIFIED: main Quality run #2187 (`35539242443`) passed.
- VERIFIED: W9 Orders QA passed on the final implementation head.
- VERIFIED: Browser template QA passed all themes across 320/360/375/390/430/768/1024/1280/1440; SIGNAL TABLE passed Arabic RTL and English LTR.
- VERIFIED: price-below-description, price no-wrap, fixed square media, and protected text-width checks passed.
- UNKNOWN: physical Android/iOS pixel evidence, real-device QR evidence, and standalone local `npm run check:auth`.
- Deployment status: NOT_REQUESTED / NOT_PERFORMED.
