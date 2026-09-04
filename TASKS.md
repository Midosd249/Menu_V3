# TASKS

## Current Atomic Task
### Theme 1–3 creative refinement + responsive visual hardening — IN_PROGRESS
- **Objective:** deepen the first three completed themes into clearly distinct art directions while treating mobile as the primary layout constraint and preserving all business/data contracts.
- **Protected:** G1–G7.2, the five-theme catalog, demo resilience, authentication correction, tenant isolation, ordering and analytics.
- **Completed:** `src/theme-refinements.css` established the first refinement layer.
- **Completed:** `src/theme-refinements-v2.css` adds a stronger presentation-only layer with distinct interaction and motion languages.
- **Essential:** tactile atelier / material paper, asymmetric image treatment, restrained rules, progressive scroll reveal.
- **Editorial:** kinetic food magazine / issue markers, framed imagery, typographic rhythm, progressive image reveal.
- **Noir:** cinematic dining / atmospheric grain, spotlight pools, bronze framing, progressive cinematic reveal.
- **Mobile:** explicit compact image sizing, removal of desktop transforms/offsets, stable single-column behavior where appropriate, touch-safe hover behavior.
- **Accessibility:** reduced-motion disables enhancement animation; focus-visible remains usable through the existing interactive controls.
- **Performance:** no new dependency; advanced WebGL libraries were researched but deliberately not introduced before mobile performance evidence.
- **Research recorded:** MDN scroll-driven animation, GSAP/ScrollTrigger, Lenis, Three.js post-processing, pmndrs/postprocessing, and Codrops creative WebGL/parallax references are recorded in `PLAN.md`.
- **Verification:** implementation is committed to `main`; CI/live visual QA still must be checked after the user deploys the new `main` to Vercel.

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
- **IN_PROGRESS:** responsive creative refinement for Themes 1–3.
- **UNKNOWN:** live visual/manual QA of the new refinement layer until the user deploys the current `main`.
