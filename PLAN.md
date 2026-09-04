# Menu V3 — Active Plan

## Status
- Status: IN_PROGRESS.
- Repository: `Midosd249/Menu_V3`.
- Source of truth: `main`.
- Premium Theme System is DONE / VERIFIED / MERGED.
- Theme 1 Essential, Theme 2 Editorial and Theme 3 Noir remain completed milestones; the current work is preview integration and refinement, not a rebuild.
- Authentication legacy credential reconciliation is DONE / VERIFIED and live sign-in was confirmed by the user after deployment.
- Existing G1–G7.2 completed work remains protected.

## Current Atomic Task
### Theme preview integration + Essential baseline restoration

**Objective:** make the Studio theme previews render the selected theme instead of the default/base presentation, expose Premium themes for preview without weakening entitlement enforcement, and remove the new refinement treatment from Essential so its original completed visual baseline is preserved.

### Evidence and implementation
1. `src/routes/studio/preview.tsx` selects a valid `ThemeKey` from the preview query and renders the selected preview.
2. `src/routes/themes/preview.tsx` selects a valid `ThemeKey` from the public preview query and renders the selected preview.
3. The refinement CSS required a `menu-public-shell` integration hook. `PublicMenuView` and `ContemporaryRestaurantTemplate` now expose that hook.
4. The root `MenuThemeController` now leaves dedicated preview routes to their route-specific controller, preventing a transient Essential paint before the requested theme.
5. `theme-refinements-v2.css` no longer contains Essential refinement rules. Editorial and Noir retain their refinement pass.
6. `saveTenantTheme` entitlement enforcement is unchanged: Premium themes may be previewed, but publishing remains plan-gated.

### Design baseline
- Essential: original completed free theme; no refinement-v2 treatment.
- Editorial: Premium kinetic food-magazine refinement with editorial framing, typography rhythm and progressive image reveal.
- Noir: Premium cinematic refinement with atmospheric light, bronze framing and progressive reveal.
- Mobile-first: touch-safe hover behavior, compact media sizing and reduced-motion safeguards remain.

### Acceptance criteria
1. `/themes/preview?theme=essential` renders the original Essential presentation without refinement-v2 styling.
2. `/themes/preview?theme=editorial` visibly renders Editorial rather than the default presentation.
3. `/themes/preview?theme=noir` visibly renders Noir rather than the default presentation.
4. `/studio/preview?theme=editorial` and `/studio/preview?theme=noir` render the requested Premium themes.
5. No preview route flashes the default Essential theme before the selected theme.
6. Premium preview access does not weaken Premium publish/save authorization.
7. Mobile and desktop layouts remain stable, RTL/LTR remain valid, and reduced-motion remains usable.
8. CI/Vercel quality gates pass before the task is marked DONE.

## Theme Sequence
- Theme 1 — Essential — DONE / VERIFIED / MERGED; baseline restoration complete in this task.
- Theme 2 — Editorial — DONE / VERIFIED / MERGED; preview integration complete in this task.
- Theme 3 — Noir — DONE / VERIFIED / MERGED; preview integration complete in this task.
- Theme 4 — Heritage — TODO only after final Theme 1–3 live QA.
- Theme 5 — Gallery — TODO.
- G7.3 — Premium Theme Commercialization & Billing UX — TODO after the visual sequence.

## Stop condition
Stop after the current preview integration and Essential restoration. Do not begin Theme 4. The next task is live mobile/desktop QA of the three preview routes and the public menu, followed only by evidence-backed fixes if needed.

## Research decisions
- MDN `prefers-reduced-motion` remains the accessibility baseline for motion-heavy refinement.
- GSAP/ScrollTrigger was reviewed as a reference for future scroll-driven work, but no dependency is added in this task.
- Progressive CSS enhancement is preferred until live QA demonstrates that GPU/WebGL is necessary.
