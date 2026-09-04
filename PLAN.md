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
### Theme 1–3 creative refinement + public demo resilience

**Objective:** repair the homepage/theme-preview public menu path and make the first three themes visibly different at a professional art-direction level while preserving the shared product architecture.

### Root-cause evidence
1. `src/routes/index.tsx` links the marketing demo to `/m/nafas`.
2. `src/routes/themes/preview.tsx` also loads `/m/nafas` for all theme previews.
3. `src/lib/menu/public.ts` previously returned `not_found` when `nafas` was not an active published tenant.
4. This made the marketing demo and theme previews depend on production seed data.

### Implementation
- **VERIFIED:** added `src/lib/menu/demo.ts` containing a stable bilingual `PublicMenu` fixture with representative coffee, pastry and cold-drink content.
- **VERIFIED:** `getPublicMenu` now returns the local fixture only for the reserved `nafas` demo slug without a branch, leaving real tenant lookup behavior unchanged.
- **VERIFIED:** added `src/theme-refinements.css` and loaded it after the existing theme layers.
- **VERIFIED:** Essential now uses an asymmetric modern-atelier/print direction.
- **VERIFIED:** Editorial now uses a food-magazine cover/column direction with oversized type and image-led grid rhythm.
- **VERIFIED:** Noir now uses cinematic dark-dining composition, bronze light pools and image-first cards.
- **VERIFIED:** no new package dependency was introduced; reduced-motion safeguards remain in place.

### Research and design decisions
- Adobe Express's current restaurant-menu guidance emphasizes personality, hierarchy, imagery, typography and spacing as core design levers. citeturn0search0turn0search2
- MDN's current scroll-driven animation guidance supports scroll-linked motion as progressive enhancement and warns that browser support is not universal; therefore the refinement avoids making interaction depend on these effects. citeturn0search1turn0search4
- The repository design system explicitly requires themes to be complete visual systems rather than color skins and requires accessibility/performance/reduced-motion safeguards. This task follows that contract.

### Acceptance criteria
1. `/m/nafas` no longer depends on seeded production tenant data for the marketing demo.
2. Theme previews for Essential, Editorial and Noir load the same demo content and visibly use different compositions.
3. Existing real tenant/public-menu lookup behavior is unchanged outside the reserved demo slug.
4. Arabic/English, RTL, mobile layout, focus states and reduced motion remain usable.
5. Typecheck, tests, lint and production build pass in CI.
6. No credentials, secrets or tenant data are exposed by the demo fixture.

### Verification
- GitHub Actions `Menu V3 Quality` was triggered for the implementation commits.
- **IN_PROGRESS:** final quality run must finish successfully.
- **UNKNOWN:** live visual/manual checks until a fresh deployment is available.

## Theme Sequence
- Theme 1 — Essential — refinement in current task.
- Theme 2 — Editorial — refinement in current task.
- Theme 3 — Noir — refinement in current task.
- Theme 4 — Heritage — TODO only after final Theme 1–3 QA passes.
- Theme 5 — Gallery — TODO.
- G7.3 — Premium Theme Commercialization & Billing UX — TODO after the visual sequence.

## Stop condition
Do not begin Theme 4 until the final CI run is successful and the three refined previews plus `/m/nafas` have passed live mobile/desktop manual QA.
