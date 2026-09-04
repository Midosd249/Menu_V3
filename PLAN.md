# Menu V3 — Active Plan

## Status
- Status: IN_PROGRESS.
- Repository: `Midosd249/Menu_V3`.
- Source of truth: `main`.
- Premium Theme System is DONE / VERIFIED / MERGED.
- Theme 1 Essential, Theme 2 Editorial and Theme 3 Noir remain completed milestones; the current work is preview rendering integration and responsive QA, not a rebuild.
- Authentication legacy credential reconciliation is DONE / VERIFIED and live sign-in was confirmed by the user after deployment.
- Existing G1–G7.2 completed work remains protected.

## Current Atomic Task
### Preview layer isolation + responsive theme rendering — IN_PROGRESS / DEPLOYMENT-VERIFIED

**Root cause:** the two preview routes (`/studio/preview` and `/themes/preview`) wrapped the menu template in an additional `.menu-public-shell`, even though `PublicMenuView` and `ContemporaryRestaurantTemplate` already own and render their own menu shell. This created nested theme presentation boundaries and ambiguous stacking/decoration behavior, matching the reported transparent layer that obscured the menu.

### Fix
1. Removed the outer `.menu-public-shell` from `src/routes/studio/preview.tsx`.
2. Removed the outer `.menu-public-shell` from `src/routes/themes/preview.tsx`.
3. Kept the selected `ThemeKey` resolution and `getThemeFamily` routing unchanged.
4. Added `tests/preview-shell.test.mjs` to prevent either preview route from reintroducing a nested shell.
5. Registered the regression test in `package.json` without changing dependency versions.

### Deployment evidence
- Vercel project `menu-v3` is linked to `Midosd249/Menu_V3`.
- The production deployment built from commit `2258642a97560a94df109a73bc1f83708979531d` is `READY` and its Vercel status check is successful.
- The deployed `/studio/preview` route returned HTTP 200 for all five registered theme keys: `essential`, `editorial`, `noir`, `heritage`, and `gallery`.
- The deployed `/themes/preview?theme=essential` route also returned HTTP 200.
- No error-level runtime logs were found for that deployment in the checked 24-hour window.

### Acceptance criteria
1. `/studio/preview?theme=essential` renders the self-contained Essential menu without a second shell.
2. `/studio/preview?theme=editorial` renders Editorial through its intended template family.
3. `/studio/preview?theme=noir` renders Noir through its intended template family.
4. `/studio/preview?theme=heritage` and `/studio/preview?theme=gallery` remain selectable and render through their registered families.
5. `/themes/preview?theme=editorial` and `/themes/preview?theme=noir` remain functional.
6. No preview route introduces a second `.menu-public-shell`.
7. Preview decoration cannot create the reported covering layer through a nested shell.
8. Premium preview access does not weaken Premium publish/save authorization.
9. Mobile and desktop layouts remain unchanged outside the preview-shell ownership correction.
10. CI/quality gates pass before the task is considered fully release-verified.
11. Authenticated browser/device QA confirms the final post-hydration visual state at mobile and desktop breakpoints.

## Theme Sequence
- Theme 1 — Essential — DONE / VERIFIED / MERGED; baseline preserved.
- Theme 2 — Editorial — DONE / VERIFIED / MERGED; preview integration stabilized.
- Theme 3 — Noir — DONE / VERIFIED / MERGED; preview integration stabilized.
- Theme 4 — Heritage — TODO only after final Theme 1–3 live QA.
- Theme 5 — Gallery — TODO.
- G7.3 — Premium Theme Commercialization & Billing UX — TODO after the visual sequence.

## Stop condition
Stop after the nested preview shell fix and regression verification. Do not begin Theme 4 until the five preview routes have been manually checked on the latest deployment.

## Research decisions
- No new dependency is required for this fix.
- Keep the existing theme-family architecture and template ownership model.
- Avoid adding another z-index or overlay workaround; remove the duplicated presentation boundary instead.
- `prefers-reduced-motion` remains the accessibility baseline.
- GPU/WebGL remains a future option only if live QA demonstrates a concrete need.

## Current blocker
- **UNKNOWN:** pixel-level mobile/desktop rendering after hydration cannot be verified from this environment because no authenticated browser/device session is available.
- **BLOCKED for full release verification:** local repository quality commands cannot be executed because the repository checkout is not mounted in the current execution environment. GitHub workflow evidence for commit `2258642a97560a94df109a73bc1f83708979531d` was also not available through the connected Actions lookup.
