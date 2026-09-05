# TASKS

## Current Atomic Task
### Repository-wide public-menu rendering and action visibility stabilization — IMPLEMENTED / VERIFICATION BLOCKED
- **Objective:** eliminate theme/layer flash and restore discoverable shared customer actions across all five themes without changing theme entitlements or security contracts.
- **VERIFIED:** removed redundant route-level `.menu-public-shell` ownership from published public routes.
- **VERIFIED:** added SSR/head theme bootstrap from loader-known theme data before hydration.
- **VERIFIED:** stopped `MenuThemeController` from clearing tokens during ordinary dependency changes.
- **VERIFIED:** added persistent Cart, WhatsApp, map, and phone quick actions to the shared public-menu when configured; Cart remains available when empty.
- **VERIFIED:** added bottom clearance for the persistent action surface.
- **VERIFIED:** added structural regression assertions.
- **UNKNOWN:** real browser/device screenshots, Opera behavior, exact first-paint timing, and console output.
- **BLOCKED:** local quality gates cannot run in the current GitHub-only environment.

## Required Verification Before Closure
1. Verify all five themes on `/m/<slug>` and `/m/<slug>/<branch>` using real branch data.
2. Verify theme preview URLs remain presentation-only and no entitlement is changed.
3. Capture small/standard/large mobile and supported desktop/tablet screenshots in Arabic RTL and English LTR.
4. Confirm no old/default theme layer appears before the intended theme and no content/control is obscured.
5. Confirm Cart is visible and opens when empty and after adding an item.
6. Confirm configured WhatsApp, map, and phone quick actions are visible, correctly linked, accessible, and non-overlapping.
7. Verify long Arabic/English names, mixed-direction text, SAR prices, missing images, sold-out items, modifiers, sparse/dense categories, and multiple branches where supported.
8. Run `npm run typecheck`, `npm test`, `npm run test:platform`, `npm run lint`, `npm run build`, `npm run qa:template`, and `npm run performance:audit`.
9. Review the final diff and Vercel deployment evidence before closure.

## Planned Theme Sequence
1. Theme 1 — Essential — implementation refinement complete; final verification blocked.
2. Theme 2 — Editorial — DONE / VERIFIED / MERGED; protected.
3. Theme 3 — Noir — implementation refinement complete; verification remains blocked; protected.
4. Theme 4 — Heritage — TODO after current stabilization verification closes.
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
- **VERIFIED:** stabilization is implemented on `main`; browser/runtime verification remains blocked.
