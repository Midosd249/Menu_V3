# TASKS

## Current Atomic Task
### Theme 1 — Essential refinement — IN_PROGRESS
- **Objective:** refine the existing Essential template only, using the permanent visual/functional/research/premium-template workflow.
- **VERIFIED:** `docs/template-brief-essential.md` created before implementation with customer journey, hierarchy, interactions, real-data resilience, acceptance criteria, and verification plan.
- **VERIFIED:** `src/theme-essential.css` refined for touch targets, long Arabic/English/mixed-direction content, price wrapping, sticky navigation/focus safety, and preview-mode visibility.
- **VERIFIED:** `src/lib/theme/registry.ts` Essential description/promise/tags sharpened to match quiet everyday hospitality.
- **VERIFIED:** Saudi-market and accessibility research recorded in `docs/design-research-log.md`.
- **VERIFIED:** no new theme was created and no other theme was intentionally changed.
- **VERIFIED:** no database, auth, authorization, subscriptions, dependencies, CI/CD, or deployment behavior was intentionally changed.
- **UNKNOWN:** browser/device screenshots, post-hydration visual inspection, real-device interactions, and pixel comparison are unavailable in the current environment.
- **BLOCKED:** cannot mark the Essential milestone DONE until required browser/device and repository quality verification evidence exists.

## Required Verification Before Closure
1. Essential preview at small/standard/large mobile and desktop breakpoints.
2. Post-hydration check for full menu visibility and absence of covering/stacking layers.
3. Arabic RTL, English LTR, and mixed-direction content.
4. Long restaurant/category/item names, missing descriptions/images, low-quality/mixed-ratio images, sold-out items, modifiers, SAR prices, sparse/dense categories, and multiple branches where supported.
5. Search, category navigation, product details, cart/order, language, icons, WhatsApp, phone, map/location, and failure/disabled/loading states where capability/data exists.
6. Keyboard focus and sticky/fixed safe-area behavior.
7. `npm run typecheck`, `npm test`, `npm run test:platform`, `npm run lint`, `npm run build` when an executable repository runtime is available.
8. Update `docs/visual-functional-audit.md`, `PROJECT_STATE.md`, `PLAN.md`, and this file with evidence before closure.

## Planned Theme Sequence
1. Theme 1 — Essential — refinement IN_PROGRESS.
2. Theme 2 — Editorial — DONE / VERIFIED / MERGED; protected.
3. Theme 3 — Noir — DONE / VERIFIED / MERGED; protected.
4. Theme 4 — Heritage — TODO after Essential closure and preview QA gate.
5. Theme 5 — Gallery — TODO.
6. G7.3 — Premium Theme Commercialization & Billing UX — TODO after the visual sequence.

## Completed Milestones
### Premium Theme System — 8 → 5 — DONE / VERIFIED / MERGED
- **Catalog:** `essential` (Free), `editorial` (Premium), `noir` (Premium), `heritage` (Premium), `gallery` (Premium).
- **VERIFIED:** five themes only; exactly one Free and four Premium.
- **VERIFIED:** themes are complete visual systems rather than color-only skins.

### Theme 1 — Essential baseline — DONE / VERIFIED / MERGED
- Dedicated Free-theme art direction implemented and isolated from domain/business logic.
- Original visual baseline remains protected; the current task is a refinement, not a rebuild.

### Theme 2 — Editorial — DONE / VERIFIED / MERGED
- Dedicated Premium art direction implemented and isolated from domain/business logic.
- Preview integration stabilized.

### Theme 3 — Noir — DONE / VERIFIED / MERGED
- Dedicated cinematic Premium art direction implemented and isolated from domain/business logic.
- Preview integration stabilized.

### Authentication — Legacy credential reconciliation — DONE / VERIFIED
- Better Auth accepts native scrypt credentials and migrated Supabase bcrypt credentials.
- Production login was subsequently confirmed by the user after the qualified `extensions.crypt(...)` correction was deployed.

## Notes
- **VERIFIED:** current subscription plans are `free`, `starter`, and `pro`.
- **VERIFIED:** Vercel project `menu-v3` is linked to `Midosd249/Menu_V3`.
- **VERIFIED:** corrected authentication is live.
- **DONE / SOURCE-VERIFIED:** nested preview shell was removed from both preview routes.
- **VERIFIED:** current deployment serves all five theme preview variants with HTTP 200.
- **PENDING:** Essential browser/device QA and local quality gates.
- **WORKFLOW:** future template/public-menu UI work remains blocked from completion until the permanent visual/functional quality gate is satisfied or an evidence-backed exception is documented.
