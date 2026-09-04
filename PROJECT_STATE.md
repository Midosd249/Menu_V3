# PROJECT_STATE

## Identity
- Status: IN_PROGRESS.
- Repository: `Midosd249/Menu_V3`.
- Source of truth: `main`.
- Product: Menu V3, Arabic-first bilingual multi-tenant digital-menu SaaS for restaurants and cafes.

## Current Position
- G1–G7.2 completed work remains protected.
- **Premium Theme System — DONE / VERIFIED / MERGED.**
- **Theme 1 — Essential — refinement IN_PROGRESS; original theme family, Free tier, and product behavior preserved.**
- **Theme 2 — Editorial — DONE / VERIFIED / MERGED; preview rendering stabilized.**
- **Theme 3 — Noir — DONE / VERIFIED / MERGED; preview rendering stabilized.**
- Authentication reconciliation and the qualified `extensions.crypt(...)` fix are implemented and live authentication was verified by the user after deployment.
- The reserved `nafas` demo fixture remains the source for the marketing/theme-preview demo when no branch is requested.
- **Visual/Functional Quality System — DONE / VERIFIED / MERGED.** Permanent audit, research-log, checklist, and template-brief rules are now part of the repository workflow.
- **External Theme Preview QR Mode — DONE / VERIFIED.** All five themes can now be opened against real branch data through a non-persistent `theme` preview query; this does not change the tenant's saved theme or premium entitlement.

## Current Atomic Task
### External preview access for all five themes — DONE / VERIFIED

**Objective:** allow external QR/device inspection of all five existing themes against a real branch menu without requiring a Premium plan or changing the saved/public theme entitlement.

**Completed:**
- Added a validated `theme` query to the public menu route and branch route.
- A valid `theme` query changes presentation only for that request; it does not persist a tenant theme change.
- Preview requests are marked `noindex, nofollow` while keeping the canonical public menu URL clean.
- Added five theme-specific QR previews to the existing Studio QR page for every branch.
- Preserved the normal branch QR, download, and print behavior.

## Verification State
- **VERIFIED:** current theme registry contains five themes: `essential`, `editorial`, `noir`, `heritage`, `gallery`.
- **VERIFIED:** `saveTenantTheme` still enforces existing Premium plan eligibility for persistent theme changes; the new preview path does not bypass that authorization.
- **VERIFIED:** external preview QR URLs are presentation-only and do not update tenant data.
- **VERIFIED:** preview URLs are explicitly `noindex, nofollow` and canonicalize to the real public menu route.
- **VERIFIED:** no database schema, migrations, dependencies, CI/CD, Vercel settings, authentication, authorization, subscriptions, or existing theme definitions were changed by the preview-mode implementation.
- **VERIFIED:** current changes are limited to public route preview handling, Studio QR preview generation, and continuity documentation.
- **UNKNOWN:** authenticated browser/device execution, screenshot capture, pixel comparison, and live QR scanning from this agent environment.
- **UNKNOWN:** whether the current CI/Vercel run will pass until GitHub reports the result for the latest commit.

## Session Log
- 2026-09-05 — Reviewed repository guidance, continuity files, theme registry, public menu routes, theme preview route, Studio design and QR surfaces, and current theme persistence authorization before implementation.
- 2026-09-05 — Researched current Saudi digital-menu patterns and public mobile-menu guidance; retained repository-first evidence and did not copy proprietary layouts or assets.
- 2026-09-05 — Added presentation-only `theme` preview routing for both default and branch public menu URLs.
- 2026-09-05 — Added five branch-specific external preview QR codes to the existing Studio QR page.
- 2026-09-05 — Preserved persistent Premium enforcement in `saveTenantTheme`; no plan entitlement was removed.

## Exact Next Task
Scan the five generated theme-preview QR codes on a real phone for one configured branch, then verify each theme at small/standard/large mobile and desktop widths; inspect the menu after hydration for covering-layer, background, clipping, and RTL/LTR regressions. Do not begin a new theme refinement until this verification is complete.
