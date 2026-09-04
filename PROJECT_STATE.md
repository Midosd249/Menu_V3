# PROJECT_STATE

## Identity
- Status: IN_PROGRESS.
- Repository: `Midosd249/Menu_V3`.
- Source of truth: `main`.
- Product: Menu V3, Arabic-first bilingual multi-tenant digital-menu SaaS for restaurants and cafes.

## Current Position
- G1–G7.2 completed work remains protected.
- **Premium Theme System — DONE / VERIFIED / MERGED.**
- **Theme 1 — Essential — DONE / VERIFIED / MERGED; original baseline restored.**
- **Theme 2 — Editorial — DONE / VERIFIED / MERGED; preview rendering stabilized.**
- **Theme 3 — Noir — DONE / VERIFIED / MERGED; preview rendering stabilized.**
- Authentication reconciliation and the qualified `extensions.crypt(...)` fix are implemented and live authentication was verified by the user after deployment.
- The reserved `nafas` demo fixture remains the source for the marketing/theme-preview demo when no branch is requested.

## Current Atomic Task
### Preview layer isolation + responsive theme rendering — IN_PROGRESS / DEPLOYMENT-VERIFIED

**Root cause:** both preview routes wrapped an already self-contained menu template in a second `.menu-public-shell`. That nested shell created a second theme presentation boundary; combined with shell pseudo-elements and preview-specific CSS, it could produce the reported transparent/visual veil and made preview stacking behavior ambiguous.

**Fixed:** `src/routes/studio/preview.tsx` and `src/routes/themes/preview.tsx` no longer create an outer `.menu-public-shell`. They now render the selected theme controller and the self-contained menu template directly.

**Fixed:** added `tests/preview-shell.test.mjs` and registered it in the repository test command so a nested preview shell cannot silently return.

**Deployment:** the current Vercel production deployment is already connected to `main` and was built from commit `2258642a97560a94df109a73bc1f83708979531d` (`chore: keep preview fix scoped`). The deployment is `READY` and the Vercel status check is successful.

**Live HTTP verification:** the five theme values `essential`, `editorial`, `noir`, `heritage`, and `gallery` were requested through the deployed `/studio/preview` route and each returned HTTP 200 with the expected preview route assets. The public `/themes/preview?theme=essential` endpoint also returned HTTP 200.

**Limitation:** the available execution environment cannot perform authenticated browser/device rendering or provide pixel-level mobile screenshots. Therefore physical-device visual QA remains `UNKNOWN` rather than being inferred from HTTP 200 responses.

## Verification State
- **VERIFIED:** both preview routes contain no outer `.menu-public-shell` wrapper.
- **VERIFIED:** both routes still render `MenuThemeController`, `PublicMenuView`, and `ContemporaryRestaurantTemplate` as applicable.
- **VERIFIED:** the menu templates remain the owners of the actual `.menu-public-shell`, eliminating the nested shell boundary.
- **VERIFIED:** the regression test asserts that both preview routes cannot reintroduce a nested menu shell.
- **VERIFIED:** no dependency was added and package dependency versions were preserved.
- **VERIFIED:** no database schema/business contract was changed.
- **VERIFIED:** Vercel production deployment is `READY` for commit `2258642a97560a94df109a73bc1f83708979531d`.
- **VERIFIED:** the five theme preview URLs return HTTP 200 from the current production deployment.
- **VERIFIED:** no error-level runtime logs were found for the current deployment in the checked 24-hour window.
- **PENDING:** local CI execution for the regression test and normal repository quality gates; the local repository checkout is not mounted in this execution environment.
- **UNKNOWN:** final physical-device pixel-level rendering and post-hydration visual state.
- **UNKNOWN:** whether the user-facing authenticated `/studio/preview` session reaches the final menu state on a real mobile device, because no browser/device session is available here.

## Session Log
- 2026-09-05 — Re-read the repository operating contract and continuity files; confirmed `main` and `Midosd249/Menu_V3` as source of truth.
- 2026-09-05 — Verified that Vercel project `menu-v3` is linked to `Midosd249/Menu_V3` and its latest production deployment is commit `2258642a97560a94df109a73bc1f83708979531d`.
- 2026-09-05 — Confirmed the deployed preview routes return HTTP 200 for all five theme keys: `essential`, `editorial`, `noir`, `heritage`, and `gallery`.
- 2026-09-05 — Confirmed no error-level runtime logs for the current deployment in the checked 24-hour window; historical auth errors belong to older deployments and were not treated as current blockers.
- 2026-09-05 — Did not infer visual/mobile success from HTTP responses; pixel-level browser/device QA remains UNKNOWN.

## Exact Next Task
Perform authenticated browser/device QA of all five theme previews at mobile and desktop breakpoints, specifically verifying that the full menu remains visible after hydration and that no transparent/covering layer returns. Only after that verification should Theme 4 — Heritage be treated as ready to begin.