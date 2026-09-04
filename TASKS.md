# TASKS

## Current Atomic Task
### Theme 2 — Editorial Visual Refinement — IN_PROGRESS
- **Objective:** make `editorial` a premium, art-directed food-magazine experience without changing business behavior.
- **Acceptance:** distinctive cover/header; typographic hierarchy; controlled asymmetry; refined category rail/cards/dialogs/forms; Arabic RTL + English LTR; responsive behavior; accessibility; reduced motion; no regressions; full quality/browser verification.

## Planned Theme Sequence
1. Theme 1 — Essential — DONE / VERIFIED / MERGED.
2. Theme 2 — Editorial — IN_PROGRESS.
3. Theme 3 — Noir — TODO.
4. Theme 4 — Heritage — TODO.
5. Theme 5 — Gallery — TODO.
6. G7.3 — Premium Theme Commercialization & Billing UX — TODO after the visual sequence.

## Completed
### Premium Theme System — 8 → 5 — DONE / VERIFIED / MERGED
- **Catalog:** `essential` (Free), `editorial` (Premium), `noir` (Premium), `heritage` (Premium), `gallery` (Premium).
- **VERIFIED:** five themes only; exactly one Free and four Premium.
- **VERIFIED:** coordinated visual systems include layout rhythm, typography, image treatment, surfaces, geometry, hero composition, hover depth and motion personality.
- **VERIFIED:** Premium preview is available; publishing is server-authorized against the existing subscription model.
- **VERIFIED:** legacy keys normalize and database migration maps existing records before enforcing the five-key catalog.

### Theme 1 — Essential — DONE / VERIFIED / MERGED
- **VERIFIED:** dedicated Free-theme art direction was implemented and isolated from domain/business logic.
- **VERIFIED:** GitHub quality workflow passed typecheck, tests, lint, production build, browser QA and performance gates.
- **VERIFIED:** merged to `main` as `cdc591bec58eea0f3b0d2985ed7581b4effc9dcb`.

## Notes
- **VERIFIED:** current subscription plans are `free`, `starter`, and `pro`.
- **BLOCKED:** Vercel deployment is externally rate limited; user will deploy manually.
- **UNKNOWN:** post-merge production deployment status after manual Vercel action.
- **UNKNOWN:** local working-tree status outside the GitHub connector.
