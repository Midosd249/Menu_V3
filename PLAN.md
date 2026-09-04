# Menu V3 — Active Plan

## Status
- Status: IN_PROGRESS.
- Repository: `Midosd249/Menu_V3`.
- Source of truth: `main`.
- Premium Theme System is DONE / VERIFIED / MERGED.
- Theme 2 Editorial and Theme 3 Noir remain completed and protected.
- Theme 1 Essential remains the single active refinement task; Theme 4 Heritage must not begin yet.
- Authentication reconciliation and live authentication verification remain completed.
- Permanent visual/functional/research quality workflow is DONE / VERIFIED and remains mandatory.

## Current Atomic Task
### External preview access for all five themes — DONE / VERIFIED

**Objective:** allow external QR/device inspection of all five existing themes against real branch data without requiring a Premium plan or changing the saved/public theme entitlement.

**Files changed:**
- `src/routes/m.$slug.tsx`
- `src/routes/m.$slug.$branch.tsx`
- `src/routes/studio/qr.tsx`
- `PROJECT_STATE.md`
- `PLAN.md`
- `TASKS.md`

**Design/security decision:** preview access is presentation-only. A valid `theme` query temporarily selects one of the five existing theme keys for rendering. It never persists a tenant theme change and does not bypass the existing Premium authorization in `saveTenantTheme`. Preview URLs are `noindex, nofollow` and canonicalize to the real public menu URL so temporary QA variants do not become SEO pages.

## Acceptance criteria
1. All five existing themes are selectable through external preview URLs for a configured branch.
2. Preview URLs render the branch's real menu data, not a separate fake dataset.
3. Preview selection never writes `tenant.theme_key` or changes subscription entitlements.
4. Existing branch QR behavior remains unchanged.
5. Preview variants do not become indexable SEO pages.
6. Invalid theme values do not select an arbitrary theme.
7. No database, migration, dependency, CI/CD, Vercel, authentication, authorization, or subscription logic is weakened.

## Implementation verification
- **VERIFIED:** `src/lib/theme/registry.ts` contains exactly five theme keys: `essential`, `editorial`, `noir`, `heritage`, `gallery`.
- **VERIFIED:** `src/lib/theme/server.ts` still enforces Premium eligibility for persistent theme changes.
- **VERIFIED:** `/m/$slug` and `/m/$slug/$branch` now accept a validated `theme` query and pass it as a presentation-only preview override.
- **VERIFIED:** preview requests use the real `getPublicMenu` data for the requested tenant/branch.
- **VERIFIED:** preview requests are marked `noindex, nofollow` while retaining the canonical public menu URL.
- **VERIFIED:** Studio QR now exposes one preview QR per existing theme for every configured branch while retaining the normal published-menu QR.
- **VERIFIED:** no theme definition, database schema, subscription rule, or saved-theme entitlement was changed.
- **UNKNOWN:** real phone QR scanning, browser screenshots, pixel comparison, and post-hydration visual verification require an executable browser/device environment.
- **UNKNOWN:** final CI/Vercel result for the latest commit until GitHub reports it.

## Research note
Current Saudi-market examples emphasize QR-first mobile menus, bilingual Arabic/English presentation, branch-aware destinations, current prices/availability, and fast access. Google Search guidance recommends mobile-friendly responsive pages and keeping preview-only variants out of indexable search surfaces when they are not canonical content. These principles support a presentation-only external preview mode rather than weakening subscription authorization.

## Theme Sequence
- Theme 1 — Essential — refinement IN_PROGRESS; do not reopen other themes.
- Theme 2 — Editorial — DONE / VERIFIED / MERGED.
- Theme 3 — Noir — DONE / VERIFIED / MERGED.
- Theme 4 — Heritage — TODO after Essential and required preview QA.
- Theme 5 — Gallery — TODO.
- G7.3 — Premium Theme Commercialization & Billing UX — TODO after the visual sequence.

## Exact next task
Scan the five generated theme-preview QR codes on a real phone for one configured branch, then verify each theme at small/standard/large mobile and desktop widths, including post-hydration visibility, background, clipping, icons, sticky navigation, RTL/LTR, and supported customer actions. Do not begin a new theme refinement until this verification is complete.
