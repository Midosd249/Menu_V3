# TASKS

## Current Atomic Task
### Theme 3 — Noir premium refinement — IMPLEMENTATION COMPLETE / VERIFICATION BLOCKED
- **Objective:** complete a full evidence-based premium refinement of the existing dark `noir` theme in the `fine-dining-hospitality` family.
- **VERIFIED:** Part 1 permanent premium design/functional quality guidance and required documentation are active.
- **VERIFIED:** Noir masthead now uses verified restaurant/branch data and configured tagline with neutral fallback wording.
- **VERIFIED:** Noir visual hierarchy now strengthens featured/product cards, long-text resilience, SAR price stability, image treatment, focus states, sticky navigation, dark document background, and mobile safe-area behavior.
- **VERIFIED:** shared cart/order, product details/modifiers, search/category navigation, language, WhatsApp, phone, map, and social behavior remain owned by the shared public-menu surface.
- **VERIFIED:** no unsupported customer action was added and no other theme definition was changed.
- **UNKNOWN:** live browser/device screenshots, QR scanning, Opera reproduction, and post-hydration visual evidence.
- **BLOCKED:** local quality gates cannot run in the current GitHub-only environment.

## Required Verification Before Closure
1. Run the Noir external preview QR on a real phone/browser for one configured branch.
2. Capture small/standard/large mobile and supported desktop/tablet screenshots in Arabic RTL and English LTR.
3. Verify first-paint dark background and reproduce the reported Opera white-background issue.
4. Verify absence of old-theme flash after hydration.
5. Verify long names, mixed-direction text, SAR prices, missing images/descriptions, sold-out items, modifiers, sparse/dense categories, and multiple branches where supported.
6. Verify search, category navigation, product details, cart/order, language, icons, WhatsApp, phone, map/location, and loading/error/empty/unavailable states where supported.
7. Run `npm run typecheck`, `npm test`, `npm run test:platform`, `npm run lint`, `npm run build`, `npm run qa:template`, and `npm run performance:audit` in an executable repository runtime.
8. Update this file, `PROJECT_STATE.md`, `PLAN.md`, and the Noir audit with the evidence before declaring `DONE`.

## Planned Theme Sequence
1. Theme 1 — Essential — DONE / VERIFIED / MERGED; protected.
2. Theme 2 — Editorial — DONE / VERIFIED / MERGED; protected.
3. Theme 3 — Noir — implementation complete; verification blocked; current atomic task.
4. Theme 4 — Heritage — TODO after Noir verification closes.
5. Theme 5 — Gallery — TODO.
6. G7.3 — Premium Theme Commercialization & Billing UX — TODO after the visual sequence.

## Permanent Quality Gate
Every future template/public-menu UI task must use `AGENTS.md`, `docs/design-intelligence.md`, `docs/template-review-checklist.md`, and the evidence records in `docs/visual-functional-audit.md` and `docs/design-research-log.md`.

## Completed Milestones
### Premium Theme System — 8 → 5 — DONE / VERIFIED / MERGED
- `essential` (Free), `editorial` (Premium), `noir` (Premium), `heritage` (Premium), `gallery` (Premium).

### External Theme Preview QR Mode — DONE / VERIFIED
- All five themes can be inspected against real branch data through presentation-only `theme` preview URLs without changing saved theme entitlement.

### Visual/Functional Quality System — DONE / VERIFIED / MERGED
- Permanent audit, research, checklist, template-brief, and evidence rules are repository policy.

## Notes
- **VERIFIED:** current subscription plans remain `free`, `starter`, and `pro`.
- **VERIFIED:** persistent Premium theme authorization remains enforced.
- **VERIFIED:** no theme is deleted or replaced by the current task.
- **BLOCKED:** final visual/device validation until an executable browser/device environment is available.
