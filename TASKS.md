# TASKS

## Current Atomic Task
### Theme 1–3 creative refinement + public demo resilience — IN_PROGRESS
- **Objective:** fix the broken homepage/theme-preview demo and materially differentiate Essential, Editorial and Noir without changing business/data contracts.
- **Root cause found:** homepage and theme preview both depend on `/m/nafas`, while `getPublicMenu` returns `not_found` when that tenant is not seeded/published.
- **Completed:** added a stable bilingual demo fixture in `src/lib/menu/demo.ts` and a reserved `nafas` fallback in `src/lib/menu/public.ts`.
- **Completed:** added `src/theme-refinements.css` with distinct art directions for the first three themes and loaded it after the existing theme layers.
- **Design:** Essential = modern atelier/print; Editorial = food magazine; Noir = cinematic dark dining.
- **Safety:** no new dependency; no credential/tenant data exposure; reduced-motion safeguards retained.
- **Research recorded:** Adobe Express menu design guidance and MDN scroll-driven animation documentation are captured in `PLAN.md`.
- **Verification:** GitHub Actions quality workflows were triggered for the implementation commits; final run is still pending.
- **Blocker:** none for implementation. Live visual/manual QA remains pending until a fresh deployment is available.

## Planned Theme Sequence
1. Theme 1 — Essential — DONE / VERIFIED / MERGED; current refinement pass.
2. Theme 2 — Editorial — DONE / VERIFIED / MERGED; current refinement pass.
3. Theme 3 — Noir — DONE / VERIFIED / MERGED; current refinement pass.
4. Theme 4 — Heritage — TODO after final Theme 1–3 QA.
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
- **IN_PROGRESS:** final quality CI for the visual refinement task.
- **UNKNOWN:** live visual/manual QA until a fresh deployment is available.
