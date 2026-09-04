# Menu V3 — Active Plan

## Status
- Status: IN_PROGRESS.
- Repository: `Midosd249/Menu_V3`.
- Source of truth: `main`.
- Premium Theme System is DONE / VERIFIED / MERGED.
- Theme 1 Essential, Theme 2 Editorial and Theme 3 Noir remain completed milestones; the current work is preview rendering integration and responsive QA, not a rebuild.
- Authentication legacy credential reconciliation is DONE / VERIFIED and live sign-in was confirmed by the user after deployment.
- Existing G1–G7.2 completed work remains protected.

## Current Atomic Task
### Preview layer isolation + responsive theme rendering

**Objective:** remove the preview presentation layer race/stacking ambiguity, make each selected theme render through its intended visual family, and keep preview behavior safe on mobile and desktop without changing production business logic.

### Evidence and implementation
1. `src/routes/studio/preview.tsx` resolves the requested `ThemeKey` during initial client render and now renders the selected theme through `getThemeFamily`.
2. `src/routes/themes/preview.tsx` resolves the requested `ThemeKey` during initial client render and uses the same family-aware rendering path.
3. Preview shells expose `data-menu-preview` and `data-menu-preview-theme` markers.
4. `src/menu-preview-layer.css` provides an explicit stacking/isolation boundary so shell decoration cannot cover the actual preview content or capture pointer input.
5. `MenuThemeController` uses `useLayoutEffect` so preview tokens are applied before the browser paints the selected preview state.
6. Premium preview remains separate from publishing authorization; `saveTenantTheme` plan enforcement is unchanged.

### Design baseline
- Essential: original completed free theme; no refinement overlay.
- Editorial: Premium kinetic food-magazine refinement with its intended contemporary restaurant family.
- Noir: Premium cinematic refinement with its intended fine-dining family.
- Mobile-first: touch-safe hover behavior, compact media sizing and reduced-motion safeguards remain.

### Acceptance criteria
1. `/studio/preview?theme=essential` renders Essential without a covering preview layer.
2. `/studio/preview?theme=editorial` renders Editorial through its intended template family.
3. `/studio/preview?theme=noir` renders Noir through its intended template family.
4. `/themes/preview?theme=editorial` and `/themes/preview?theme=noir` render the requested themes.
5. No preview route flashes the default theme before the selected theme.
6. Preview decoration cannot cover or intercept the rendered menu content.
7. Premium preview access does not weaken Premium publish/save authorization.
8. Mobile and desktop layouts remain stable, RTL/LTR remain valid, and reduced-motion remains usable.
9. CI/Vercel quality gates pass before the task is marked DONE.

## Theme Sequence
- Theme 1 — Essential — DONE / VERIFIED / MERGED; baseline preserved.
- Theme 2 — Editorial — DONE / VERIFIED / MERGED; preview integration stabilized.
- Theme 3 — Noir — DONE / VERIFIED / MERGED; preview integration stabilized.
- Theme 4 — Heritage — TODO only after final Theme 1–3 live QA.
- Theme 5 — Gallery — TODO.
- G7.3 — Premium Theme Commercialization & Billing UX — TODO after the visual sequence.

## Stop condition
Stop after preview layer isolation and responsive verification. Do not begin Theme 4 until the three completed themes have been manually verified on the latest deployment.

## Research decisions
- Progressive CSS enhancement remains preferred for this task; no new animation dependency is added.
- `prefers-reduced-motion` remains the accessibility baseline.
- GPU/WebGL remains a future option only if live QA demonstrates a concrete need.
