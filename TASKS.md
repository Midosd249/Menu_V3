# TASKS

## Current Atomic Task
### Preview layer isolation + responsive theme rendering — IN_PROGRESS / DEPLOYMENT-VERIFIED
- **Objective:** remove the actual nested preview presentation boundary that was obscuring the rendered menu, preserve theme-family routing, add regression protection, and complete release-level responsive visual QA.
- **Root cause:** `/studio/preview` and `/themes/preview` each wrapped a menu template that already rendered its own `.menu-public-shell`, creating nested theme shells and ambiguous stacking/decoration behavior.
- **Completed:** `src/routes/studio/preview.tsx` no longer creates an outer `.menu-public-shell`.
- **Completed:** `src/routes/themes/preview.tsx` no longer creates an outer `.menu-public-shell`.
- **Completed:** selected theme resolution and `getThemeFamily` routing remain intact.
- **Completed:** `tests/preview-shell.test.mjs` prevents either preview route from reintroducing a nested menu shell.
- **Completed:** the regression test is registered in `package.json` without changing dependency versions.
- **Verified:** Premium preview access does not bypass `saveTenantTheme` plan enforcement.
- **Verified:** current Vercel production deployment is `READY` and is linked to `Midosd249/Menu_V3`.
- **Verified:** `/studio/preview` returns HTTP 200 for `essential`, `editorial`, `noir`, `heritage`, and `gallery` on the current deployment.
- **Verified:** no error-level runtime logs were found for the current deployment in the checked 24-hour window.
- **PENDING:** local CI execution of the new regression test and normal quality gates; repository checkout is not mounted in the current execution environment.
- **UNKNOWN:** authenticated browser/device visual QA, including post-hydration menu visibility and pixel-level mobile/desktop rendering.

## Planned Theme Sequence
1. Theme 1 — Essential — DONE / VERIFIED / MERGED; original baseline preserved.
2. Theme 2 — Editorial — DONE / VERIFIED / MERGED; preview rendering stabilized.
3. Theme 3 — Noir — DONE / VERIFIED / MERGED; preview rendering stabilized.
4. Theme 4 — Heritage — TODO after final Theme 1–3 live QA.
5. Theme 5 — Gallery — TODO.
6. G7.3 — Premium Theme Commercialization & Billing UX — TODO after the visual sequence.

## Completed
### Premium Theme System — 8 → 5 — DONE / VERIFIED / MERGED
- **Catalog:** `essential` (Free), `editorial` (Premium), `noir` (Premium), `heritage` (Premium), `gallery` (Premium).
- **VERIFIED:** five themes only; exactly one Free and four Premium.
- **VERIFIED:** themes are complete visual systems rather than color-only skins.

### Theme 1 — Essential — DONE / VERIFIED / MERGED
- Dedicated Free-theme art direction implemented and isolated from domain/business logic.
- Original visual baseline is preserved.

### Theme 2 — Editorial — DONE / VERIFIED / MERGED
- Dedicated Premium art direction implemented and isolated from domain/business logic.
- Preview integration now uses its intended template family and refinement layers.

### Theme 3 — Noir — DONE / VERIFIED / MERGED
- Dedicated cinematic Premium art direction implemented and isolated from domain/business logic.
- Preview integration now uses its intended template family and refinement layers.

### Authentication — Legacy credential reconciliation — DONE / VERIFIED
- Better Auth accepts native scrypt credentials and migrated Supabase bcrypt credentials.
- Production login was subsequently confirmed by the user after the qualified `extensions.crypt(...)` correction was deployed.

## Notes
- **VERIFIED:** current subscription plans are `free`, `starter`, and `pro`.
- **VERIFIED:** Vercel project `menu-v3` is linked to `Midosd249/Menu_V3`.
- **VERIFIED:** corrected authentication is live.
- **DONE / SOURCE-VERIFIED:** nested preview shell was removed from both preview routes.
- **VERIFIED:** current deployment serves all five theme preview variants with HTTP 200.
- **PENDING:** complete authenticated mobile/desktop browser QA and local quality gates before closing the current task.
