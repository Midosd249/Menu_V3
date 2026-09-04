# TASKS

## Current Atomic Task
### Theme preview integration + Essential baseline restoration — IN_PROGRESS
- **Objective:** make Studio/public theme previews render the selected theme, expose Premium themes for preview without weakening publish entitlement enforcement, and restore Essential to its original completed visual baseline.
- **Protected:** G1–G7.2, the five-theme catalog, demo resilience, authentication correction, tenant isolation, ordering and analytics.
- **Verified:** `src/routes/studio/preview.tsx` and `src/routes/themes/preview.tsx` select valid `ThemeKey` values for previews.
- **Completed:** `PublicMenuView` and `ContemporaryRestaurantTemplate` now expose the `menu-public-shell` hook required by the refinement layer.
- **Completed:** preview routes no longer receive a transient default Essential paint from the root `MenuThemeController`.
- **Completed:** Essential refinement treatment was removed from both `theme-refinements.css` and `theme-refinements-v2.css`; Editorial and Noir refinement treatment remains.
- **Verified:** Premium preview access does not bypass `saveTenantTheme` plan enforcement.
- **PENDING:** Vercel deployment for the latest code state.
- **UNKNOWN:** physical-device pixel-level visual QA until the latest deployment is live.

## Planned Theme Sequence
1. Theme 1 — Essential — DONE / VERIFIED / MERGED; original baseline restored in current task.
2. Theme 2 — Editorial — DONE / VERIFIED / MERGED; preview refinement integration fixed in current task.
3. Theme 3 — Noir — DONE / VERIFIED / MERGED; preview refinement integration fixed in current task.
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
- Original visual baseline is preserved; refinement overlays were removed in the current task.

### Theme 2 — Editorial — DONE / VERIFIED / MERGED
- Dedicated Premium art direction implemented and isolated from domain/business logic.
- Preview integration now activates its refinement layers.

### Theme 3 — Noir — DONE / VERIFIED / MERGED
- Dedicated cinematic Premium art direction implemented and isolated from domain/business logic.
- Preview integration now activates its refinement layers.

### Authentication — Legacy credential reconciliation — DONE / VERIFIED
- Better Auth accepts native scrypt credentials and migrated Supabase bcrypt credentials.
- Production login was subsequently confirmed by the user after the qualified `extensions.crypt(...)` correction was deployed.

## Notes
- **VERIFIED:** current subscription plans are `free`, `starter`, and `pro`.
- **VERIFIED:** Vercel project `menu-v3` is linked to `Midosd249/Menu_V3`.
- **VERIFIED:** corrected authentication is live.
- **IN_PROGRESS:** theme preview integration and live responsive QA for Themes 1–3.
- **UNKNOWN:** final visual/manual QA of the latest preview integration until the new Vercel deployment is live.
