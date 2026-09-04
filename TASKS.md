# TASKS

## Current Atomic Task
### Public menu production incident + responsive/theme integration audit — IN_PROGRESS
- **Objective:** restore the published public menu URL and verify that the first three theme refinement layers remain present and loaded without changing business/data contracts.
- **Protected:** G1–G7.2, the five-theme catalog, demo resilience, authentication correction, tenant isolation, ordering and analytics.
- **Verified:** current `main` is `e2518fb71bf09492333a0f6fd8f6d3974e1f3abd`.
- **Verified:** `src/theme-refinements.css` and `src/theme-refinements-v2.css` are present, and the root route loads the second layer after the existing theme layers.
- **Verified:** `mndy-alwtnya` existed in production `menu_v3.tenants` with `is_published = true` but `is_active = false`.
- **Completed:** reactivated only the published `mndy-alwtnya` tenant. No tenant content or schema was changed.
- **Verified:** `mndy-alwtnya` now has `is_published = true`, `is_active = true`, theme `essential`, one active branch, 7 categories, and 26 products.
- **Verified:** Theme Preview continues to use the stable local `nafas` demo fixture.
- **UNKNOWN:** physical-device pixel-level visual QA until the deployed pages can be directly inspected.
- **UNKNOWN:** local shell test execution in this session.

## Planned Theme Sequence
1. Theme 1 — Essential — DONE / VERIFIED / MERGED; refinement pass IN_PROGRESS.
2. Theme 2 — Editorial — DONE / VERIFIED / MERGED; refinement pass IN_PROGRESS.
3. Theme 3 — Noir — DONE / VERIFIED / MERGED; refinement pass IN_PROGRESS.
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
- Quality workflow and browser/performance gates previously passed.

### Theme 2 — Editorial — DONE / VERIFIED / MERGED
- Dedicated Premium art direction implemented and isolated from domain/business logic.
- Quality workflow and all-theme browser/performance baseline previously passed.

### Theme 3 — Noir — DONE / VERIFIED / MERGED
- Dedicated cinematic Premium art direction implemented and isolated from domain/business logic.
- Responsive, focus-visible and reduced-motion safeguards previously passed.

### Authentication — Legacy credential reconciliation — DONE / VERIFIED
- Better Auth accepts native scrypt credentials and migrated Supabase bcrypt credentials.
- Production login was subsequently confirmed by the user after the qualified `extensions.crypt(...)` correction was deployed.

## Notes
- **VERIFIED:** current subscription plans are `free`, `starter`, and `pro`.
- **VERIFIED:** Vercel project `menu-v3` is linked to `Midosd249/Menu_V3`.
- **VERIFIED:** corrected authentication is live.
- **IN_PROGRESS:** public menu incident resolution and responsive creative refinement QA for Themes 1–3.
- **UNKNOWN:** final visual/manual QA of the deployed refinement layer until the live pages can be directly inspected.
