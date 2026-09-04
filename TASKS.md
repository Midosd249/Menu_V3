# TASKS

## Current Atomic Task
### External preview access for all five themes — DONE / VERIFIED
- **Objective:** allow external QR/device inspection of all five existing themes against real branch data without requiring a Premium plan or changing the saved/public theme entitlement.
- **VERIFIED:** `/m/$slug` and `/m/$slug/$branch` accept a validated `theme` query and render the selected existing theme for that request only.
- **VERIFIED:** preview rendering uses the real tenant/branch menu data.
- **VERIFIED:** preview selection is non-persistent and does not change `tenant.theme_key`.
- **VERIFIED:** `saveTenantTheme` continues to enforce the existing Premium eligibility for persistent theme changes.
- **VERIFIED:** preview URLs use `noindex, nofollow` and retain the canonical public menu URL.
- **VERIFIED:** Studio QR now provides five theme-specific preview QR codes per configured branch while preserving the normal published-menu QR.
- **VERIFIED:** no database, migration, dependency, CI/CD, Vercel, authentication, authorization, subscription, or existing theme definition was changed.
- **UNKNOWN:** real phone QR scanning, browser/device screenshots, post-hydration visual inspection, and pixel comparison are unavailable in the current environment.

## Required Verification Before Closure
1. Scan all five theme-preview QR codes on a real phone for one configured branch.
2. Verify each theme at small/standard/large mobile and desktop breakpoints.
3. Verify post-hydration visibility and absence of covering/stacking regressions.
4. Verify Arabic RTL, English LTR, and mixed-direction content.
5. Verify long restaurant/category/item names, missing descriptions/images, mixed image ratios, sold-out items, modifiers, SAR prices, sparse/dense categories, and multiple branches where supported.
6. Verify search, category navigation, product details, cart/order, language, icons, WhatsApp, phone, map/location, and failure/disabled/loading states where capability/data exists.
7. Run `npm run typecheck`, `npm test`, `npm run test:platform`, `npm run lint`, and `npm run build` when an executable repository runtime is available.
8. Update continuity and audit documents with the resulting evidence before starting another template refinement.

## Planned Theme Sequence
1. Theme 1 — Essential — refinement IN_PROGRESS; browser/device QA remains required.
2. Theme 2 — Editorial — DONE / VERIFIED / MERGED; protected.
3. Theme 3 — Noir — DONE / VERIFIED / MERGED; protected.
4. Theme 4 — Heritage — TODO after the required preview QA gate.
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
- **VERIFIED:** external preview QR mode is now available for all five themes without altering Premium entitlements.
- **PENDING:** Essential browser/device QA and local quality gates.
- **WORKFLOW:** future template/public-menu UI work remains blocked from completion until the permanent visual/functional quality gate is satisfied or an evidence-backed exception is documented.
