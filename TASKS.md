# TASKS

## Current Section
- **Premium Theme System — IN_PROGRESS.** Explicit product direction: reduce the catalog from eight themes to five complete visual systems, with one Free theme and four Premium themes.

## Current Atomic Task
### Premium Theme System — 8 → 5
- **Objective:** replace the existing color/skin-oriented theme catalog with five clearly differentiated visual experiences while preserving Menu V3 business behavior, tenant isolation, URLs, SEO, and menu data.
- **Catalog:** `essential` (Free), `editorial` (Premium), `noir` (Premium), `heritage` (Premium), `gallery` (Premium).
- **Acceptance:** five themes only; four Premium; server-side entitlement enforcement; legacy keys migrate safely; distinct layout/typography/surface/image/motion treatment; RTL/LTR; mobile/tablet/desktop; reduced-motion support; no horizontal overflow; accessible names; no runtime console errors; typecheck/tests/lint/build pass; browser QA exercises all five themes.
- **Research basis:** Menu Author complete-theme model; MENU TIGER restaurant templates; Popmenu mobile-first/custom website approach; maintained open-source UI/motion patterns; WAI reduced-motion guidance.
- **Rollback:** branch/commit-based rollback; legacy theme aliases remain resolvable until migration has completed.

## Unified Queue
1. **Premium Theme System — IN_PROGRESS.**
2. **G7 — Analytics, Search Console, Growth, Rollout:** IN_PROGRESS (existing milestone; no separate G7.3 task is being invented).
3. **G4 — Arabic/English SEO Architecture:** DONE / VERIFIED / CLOSED.
4. **G5 — Template Ecosystem Expansion:** DONE / VERIFIED / CLOSED.
5. **G6 — Performance + Media:** DONE / VERIFIED / CLOSED.

## Completed Work Preserved
- G4 — Arabic/English SEO Architecture: DONE / VERIFIED / CLOSED.
- G5 — Template Ecosystem Expansion: DONE / VERIFIED / CLOSED.
- G6 — Performance + Media: DONE / VERIFIED / CLOSED.
- G7.1 — Production analytics integrity hardening: DONE / VERIFIED.
- G7.2 — Search Console production readiness: DONE / VERIFIED / CLOSED.
- Repository Organization Maintenance: DONE / VERIFIED.
- Dependency Manifest Reconciliation: DONE / VERIFIED.

## Verification Notes
- **VERIFIED:** current repository has a real theme registry, theme controller, public theme gallery, studio design page, theme persistence, template QA, and subscription-plan tables.
- **VERIFIED:** current subscription plans are `free`, `starter`, and `pro`; Premium theme publishing is now designed to require a non-free plan.
- **VERIFIED:** a dedicated branch `feat/premium-theme-redesign` was created from the known `main` commit `040e625889f203e07e7fc87dd275c5be949d9566`.
- **VERIFIED:** migration maps legacy keys before constraining the tenant theme column to the new five keys.
- **UNKNOWN:** final CI/browser verification until the branch's quality workflow completes.
- **UNKNOWN:** local working-tree status outside GitHub remains unavailable.
