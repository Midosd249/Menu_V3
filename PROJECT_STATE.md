# PROJECT_STATE

## Identity
- Status: IN_PROGRESS.
- Repository: `Midosd249/Menu_V3`.
- Source of truth: `main`.
- Product: Menu V3, Arabic-first bilingual multi-tenant digital-menu SaaS for restaurants and cafes.

## Current Position
- G1–G7.2 completed work remains protected.
- **Premium Theme System — DONE / VERIFIED / MERGED.**
- **Theme 1 — Essential — Premium Refinement IMPLEMENTED; automated/browser verification pending.**
- **Theme 2 — Editorial — DONE / VERIFIED / MERGED; protected.**
- **Theme 3 — Noir — implementation refinement COMPLETE; final browser/device closure remains blocked pending browser/device evidence.**
- Heritage and Gallery remain untouched.
- **Visual/Functional Quality System — DONE / VERIFIED / MERGED.**
- **External Theme Preview QR Mode — DONE / VERIFIED.**
- **Shared Public Menu Rendering Stabilization — VERIFIED in repository; browser evidence pending.**

## Current Atomic Task
### Essential Premium Refinement

**Objective:** turn Essential into a production-premium Arabic-first restaurant menu experience without rebuilding the Public Menu or touching other themes.

**VERIFIED implementation in this batch:**
- Removed duplicate Essential template chrome; `SmallMenuTemplate` now delegates directly to the existing `PublicMenuView`.
- Replaced Essential presentation rules with a coherent scoped design system covering canvas, typography, hero, search/categories, featured composition, product hierarchy, hours, action dock, safe areas, focus, bidi handling, and reduced motion.
- Preserved existing shared cart/order, product details/modifiers, search/category navigation, language, WhatsApp, map, phone, social, analytics, tenant/branch routing, and authorization semantics.
- Added source-level regression assertions for Essential ownership, deterministic light canvas, safe-area clearance, overlay priority, touch targets, and readable hierarchy.
- Added Essential design brief and dedicated layering/UI audit.
- Added material research evidence to `docs/design-research-log.md`.

## Root-Cause / Incident Evidence
- **VERIFIED:** the prior public-menu stabilization removed route-level duplicate presentation shell ownership and moved server-known theme identity into the document head before hydration.
- **VERIFIED:** Essential itself also had an unnecessary `small-menu` header/concept wrapper around `PublicMenuView`; this batch removes that duplicate customer-facing chrome.
- **INFERRED:** the previous first-screen congestion was materially amplified by that duplicate template wrapper and by competing shared hero actions.
- **UNKNOWN:** exact Opera paint behavior and real-device first-paint timing until browser evidence is collected.

## Verification State
- **VERIFIED:** `essential` remains the Free theme and maps to `small-menu`.
- **VERIFIED:** no other theme definition was changed by the Essential refinement.
- **VERIFIED:** no database schema, migration, dependency, authentication, authorization, subscription, tenant/branch isolation, CI/CD, or Vercel configuration was changed.
- **VERIFIED:** Essential source contract tests were added to `tests/preview-shell.test.mjs`.
- **BLOCKED:** this session cannot execute the repository runtime locally; GitHub Actions Chromium/browser verification is required after the batch commit.
- **UNKNOWN:** Opera-specific rendering, real-device screenshots, QR scan behavior, post-hydration console output, and pixel comparison until browser evidence is available.

## Files changed in the Essential batch
- `src/components/templates/small-menu.tsx`
- `src/theme-essential.css`
- `tests/preview-shell.test.mjs`
- `docs/essential-design-brief.md`
- `docs/essential-layering-and-ui-audit.md`
- `docs/design-research-log.md`
- `PROJECT_STATE.md`
- `PLAN.md`
- `TASKS.md`

## Session Log
- 2026-09-05 — Reviewed repository state, Essential source, shared public renderer, theme registry, existing regression tests, and five supplied screenshots.
- 2026-09-05 — Researched WCAG target/focus guidance, MDN safe-area and color-scheme behavior, and responsive media principles.
- 2026-09-05 — Implemented Essential Premium Refinement as one scoped batch: removed duplicate template chrome and replaced Essential presentation with a cohesive mobile-first design system.
- 2026-09-05 — Added source-level regression coverage, design brief, layering audit, and research evidence.

## Exact Next Task
Inspect the GitHub Actions result for the Essential refinement commit. If quality/browser QA passes, review the generated browser evidence and verify the Essential public route and owner preview against the supplied screenshots; separately capture Opera/real-device evidence before declaring the milestone `CLOSED`. If CI fails, fix only the Essential batch failure and rerun the affected gates.
