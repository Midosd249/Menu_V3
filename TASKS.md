# TASKS

## Current Atomic Task
### Preview layer isolation + responsive theme rendering — IN_PROGRESS
- **Objective:** remove preview layer race/stacking ambiguity, render each selected theme through its intended visual family, and preserve mobile/desktop safety.
- **Protected:** G1–G7.2, the five-theme catalog, demo resilience, authentication correction, tenant isolation, ordering and analytics.
- **Completed:** `src/routes/studio/preview.tsx` now uses the selected theme's `getThemeFamily` instead of forcing every Studio preview through `PublicMenuView`.
- **Completed:** `src/routes/themes/preview.tsx` now resolves the requested theme during initial client render.
- **Completed:** preview shells now expose explicit preview markers for CSS isolation.
- **Completed:** `src/components/menu-theme-controller.tsx` uses `useLayoutEffect` to prevent the default-theme paint race on preview routes.
- **Completed:** `src/menu-preview-layer.css` isolates preview decoration and keeps the rendered content above shell-level visual layers.
- **Verified:** Essential refinement treatment remains removed; Editorial and Noir refinements remain.
- **Verified:** Premium preview access does not bypass `saveTenantTheme` plan enforcement.
- **PENDING:** Vercel deployment for the latest code state.
- **UNKNOWN:** physical-device pixel-level QA until the latest deployment is live.

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
- **IN_PROGRESS:** preview layer isolation and responsive QA for Themes 1–3.
- **UNKNOWN:** final visual/manual QA of the latest preview fixes until the new Vercel deployment is live.
