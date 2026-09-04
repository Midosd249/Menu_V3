# TASKS

## Current Atomic Task
### Theme 3 — Noir Visual Refinement — IN_PROGRESS
- **Objective:** make `noir` a premium cinematic fine-dining experience without changing business behavior.
- **Acceptance:** distinctive layered dark surfaces; dramatic typography; immersive media; refined category rail/cards/dialogs/forms; Arabic RTL + English LTR; responsive behavior; accessibility; reduced motion; no regressions; full quality/browser verification.

## Planned Theme Sequence
1. Theme 1 — Essential — DONE / VERIFIED / MERGED.
2. Theme 2 — Editorial — DONE / VERIFIED / MERGED.
3. Theme 3 — Noir — IN_PROGRESS.
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
- **VERIFIED:** quality workflow passed typecheck, tests, lint, production build, browser QA and performance gates.
- **VERIFIED:** merged as `cdc591bec58eea0f3b0d2985ed7581b4effc9dcb`.

### Theme 2 — Editorial — DONE / VERIFIED / MERGED
- **VERIFIED:** dedicated Premium art direction was implemented and isolated from domain/business logic.
- **VERIFIED:** quality run #465 passed typecheck, tests, lint, production build, all-theme browser QA and performance baseline.
- **VERIFIED:** merged as `fe8b791ec891e1163005d5b2bf23e10b38d90928`.

### Theme 3 — Noir — IN_PROGRESS
- **VERIFIED:** isolated `src/theme-noir.css` added and wired from `src/routes/__root.tsx`.
- **VERIFIED:** implementation is presentation-only and preserves existing route/template/data contracts.
- **VERIFIED:** cinematic hero, layered charcoal surfaces, warm bronze lighting, refined category rail, immersive image treatment, premium product cards and fine-dining signature styling are included.
- **VERIFIED:** responsive, focus-visible and reduced-motion safeguards are included in the stylesheet.
- **UNKNOWN:** full local/CI/browser verification until the GitHub Actions run for the branch is available.

## Notes
- **VERIFIED:** current subscription plans are `free`, `starter`, and `pro`.
- **VERIFIED:** Vercel project `menu-v3` is linked to `Midosd249/Menu_V3`.
- **BLOCKED:** Vercel deployment remains constrained by the Hobby build-rate limit.
- **UNKNOWN:** current production deployment after Theme 3 merge.
