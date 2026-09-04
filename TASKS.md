# TASKS

## Current Atomic Task
### Theme 3 — Noir premium refinement — IN_PROGRESS
- **Objective:** complete a full evidence-based premium refinement of the existing dark `noir` theme in the `fine-dining-hospitality` family.
- **VERIFIED:** five existing themes remain present and protected.
- **VERIFIED:** external preview QR mode exists for all five themes and does not alter Premium entitlement.
- **VERIFIED:** Part 1 permanent premium design/functional quality guidance and research documentation are active.
- **VERIFIED:** Noir currently has a cinematic dark hero, sticky category rail, structured product cards, focus styling, and reduced-motion handling.
- **UNKNOWN:** live browser/device screenshots, QR scanning, Opera reproduction, and post-hydration visual evidence are unavailable in the current environment.
- **UNKNOWN:** the reported circular-card composition is not present in the current source reviewed; runtime evidence is required before changing that composition.

## Required Verification Before Closure
1. Review the complete Noir customer journey.
2. Verify small/standard/large mobile and supported tablet/desktop layouts.
3. Verify Arabic RTL, English LTR, and mixed-direction content.
4. Verify long restaurant/category/item names, varied SAR prices, missing descriptions/images, varied image ratios, sold-out items, modifiers, sparse/dense categories, and multiple branches where supported.
5. Verify search, category navigation, product details, cart/order, language, icons, WhatsApp, phone, map/location, and failure/disabled/loading states where capability/data exists.
6. Reproduce Opera background behavior and initial old-theme flash when browser tooling is available; otherwise preserve them as UNKNOWN and document exact evidence needed.
7. Run `npm run typecheck`, `npm test`, `npm run test:platform`, `npm run lint`, `npm run build`, `npm run qa:template`, and `npm run performance:audit` when an executable repository runtime is available.
8. Review final diff and update continuity/audit documentation before declaring DONE.

## Planned Theme Sequence
1. Theme 1 — Essential — DONE / VERIFIED / MERGED; protected.
2. Theme 2 — Editorial — DONE / VERIFIED / MERGED; protected.
3. Theme 3 — Noir — IN_PROGRESS; current atomic task.
4. Theme 4 — Heritage — TODO after Noir refinement closes.
5. Theme 5 — Gallery — TODO.
6. G7.3 — Premium Theme Commercialization & Billing UX — TODO after the visual sequence.

## Permanent Quality Gate
Every future template/public-menu UI task must use the workflow in `AGENTS.md` and the evidence checklist in `docs/template-review-checklist.md`: relevant research, design brief, visual audit, functional audit, realistic-data testing, responsive/browser verification when possible, final visual/functional review, and documented evidence.

## Completed Milestones
### Premium Theme System — 8 → 5 — DONE / VERIFIED / MERGED
- `essential` (Free), `editorial` (Premium), `noir` (Premium), `heritage` (Premium), `gallery` (Premium).
- Five themes only; exactly one Free and four Premium.

### External Theme Preview QR Mode — DONE / VERIFIED
- All five themes can be inspected against real branch data through presentation-only `theme` preview URLs without changing saved theme entitlement.

### Visual/Functional Quality System — DONE / VERIFIED / MERGED
- Permanent audit, research, checklist, template-brief, and evidence rules are repository policy.

## Notes
- **VERIFIED:** current subscription plans remain `free`, `starter`, and `pro`.
- **VERIFIED:** persistent Premium theme authorization remains enforced.
- **VERIFIED:** no theme is deleted or replaced by the current task.
- **UNKNOWN:** final visual/device validation until an executable browser/device environment is available.
