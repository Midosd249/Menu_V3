# Menu V3 — Active Plan

## Status
- Status: IN_PROGRESS.
- Repository: `Midosd249/Menu_V3`.
- Source of truth: `main`.
- Premium Theme System is DONE / VERIFIED / MERGED.
- Theme 1 Essential, Theme 2 Editorial and Theme 3 Noir remain completed milestones; the current task is a refinement pass, not a rebuild.
- Authentication legacy credential reconciliation is DONE / VERIFIED and live sign-in was confirmed by the user after deployment.
- Existing G1–G7.2 completed work remains protected.

## Current Atomic Task
### Public menu production incident + responsive/theme integration audit

**Objective:** restore the user's published public menu URL and verify that the first three theme refinement layers are actually present in the deployed application, without changing business/data contracts.

### Verified repository and production evidence
1. Current `main` is `e2518fb71bf09492333a0f6fd8f6d3974e1f3abd`.
2. `src/routes/m.$slug.tsx` resolves public menus through `getPublicMenu` and renders the selected theme family.
3. `src/routes/themes/preview.tsx` uses the reserved `nafas` demo fixture for theme previews.
4. `src/routes/__root.tsx` imports `theme-refinements-v2.css` after the existing theme layers.
5. Production `menu_v3.tenants` contains `mndy-alwtnya` with `is_published = true` and, before correction, `is_active = false`.
6. The tenant has 1 branch, 7 categories, and 26 products.

### Implementation
- **COMPLETED:** reactivated only the published `mndy-alwtnya` production tenant (`is_active = true`). No tenant content, branch, product, authorization, or schema changes were made.
- **VERIFIED:** `mndy-alwtnya` now satisfies the public resolver conditions and resolves to `مندي الوطنية`, theme `essential`, active branch `main-branch`.
- **VERIFIED:** `src/theme-refinements.css` and `src/theme-refinements-v2.css` are both present in `main` and loaded by the root document.
- **VERIFIED:** the Theme Preview route still resolves its demo fixture independently of production tenant availability.

### Theme refinement baseline preserved
- Essential: tactile atelier / material paper, asymmetric image treatment, restrained rules, progressive scroll reveal.
- Editorial: kinetic food magazine / issue markers, framed imagery, typographic rhythm, progressive image reveal.
- Noir: cinematic dining / atmospheric grain, spotlight pools, bronze framing, progressive cinematic reveal.
- Mobile: compact media sizing, removal of desktop offsets/transforms, stable single-column behavior where appropriate, touch-safe hover behavior.
- Accessibility: reduced-motion disables enhancement animation; existing focus-visible behavior remains intact.
- Performance: no new dependency was introduced.

### Acceptance criteria
1. The published `mndy-alwtnya` tenant resolves through the public-menu server function.
2. Theme 1–3 refinement CSS remains loaded and does not alter business/data contracts.
3. No tenant isolation, authorization, publishing, branch, product, or analytics boundaries are weakened.
4. Mobile and desktop layouts remain stable; pixel-level visual verification is still required.
5. Arabic RTL and English LTR remain structurally valid.
6. Reduced-motion remains usable.
7. CI quality gates pass for the final code state before the task is marked DONE.

## Theme Sequence
- Theme 1 — Essential — refinement pass in progress.
- Theme 2 — Editorial — refinement pass in progress.
- Theme 3 — Noir — refinement pass in progress.
- Theme 4 — Heritage — TODO only after final Theme 1–3 live QA.
- Theme 5 — Gallery — TODO.
- G7.3 — Premium Theme Commercialization & Billing UX — TODO after the visual sequence.

## Stop condition
Stop after the current public-menu incident and integration audit. Do not begin Theme 4. The next task is live mobile/desktop QA of the public menu and refined first three themes, followed only by evidence-backed fixes if needed.
