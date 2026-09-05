# PROJECT_STATE

## Identity
- Status: IN_PROGRESS.
- Repository: `Midosd249/Menu_V3`.
- Source of truth: `main`; current Editorial work is isolated on `editorial-premium-refinement`.
- Product: Menu V3, Arabic-first bilingual multi-tenant digital-menu SaaS for restaurants and cafes.

## Current Position
- G1–G7.2 completed work remains protected.
- **Premium Theme System — DONE / VERIFIED / MERGED.**
- **Theme 1 — Essential — DEPLOYED / VERIFIED; visual refinement is protected.**
- **Theme 2 — Editorial — PREMIUM REFINEMENT IN PROGRESS on `editorial-premium-refinement`; not merged or production-deployed.**
- **Theme 3 — Noir — implementation refinement COMPLETE; final browser/device closure remains separately blocked.**
- Heritage and Gallery remain untouched.
- **Visual/Functional Quality System — DONE / VERIFIED / MERGED.**
- **External Theme Preview QR Mode — DONE / VERIFIED.**
- **Shared Public Menu Rendering Stabilization — VERIFIED in repository.**

## Essential Reconciliation — Current Evidence
- **VERIFIED:** Essential `SmallMenuTemplate` delegates directly to `PublicMenuView`; duplicate template chrome is removed.
- **VERIFIED:** Essential scoped presentation covers canvas, typography, hero, search/categories, featured composition, product hierarchy, hours, fixed action dock, safe areas, focus, bidi handling, fallbacks, responsive behavior, and reduced motion.
- **VERIFIED:** commit `ed030657bd95f31a180f21118611f9665c5e0836` restored the missing React type declarations needed by the quality workflow.
- **VERIFIED:** GitHub Actions quality run `33938789743` completed successfully for `ed030657bd95f31a180f21118611f9665c5e0836`: typecheck, tests, lint, production build, Playwright Chromium installation, browser template QA for all themes, performance baseline upload, and cleanup all passed.
- **VERIFIED:** Vercel production deployment `dpl_APYCcu1PbR2cgvd9ALjtZBBSTKJf` is `READY` and points to `ed030657bd95f31a180f21118611f9665c5e0836`.
- **UNKNOWN:** manual real-device/Opera screenshots and post-hydration console inspection remain outside repository/CI evidence.

## Editorial Milestone — Active
- **VERIFIED:** `editorial` maps to `contemporary-restaurant` in the canonical theme registry.
- **VERIFIED:** existing Editorial supports featured products, search/category filtering, product details/modifiers, cart/order, branches, opening hours, and configured WhatsApp/map/phone/Instagram actions.
- **VERIFIED:** supplied Editorial screenshots expose oversized logo treatment, excessive hero occupation, unstable/large product media presentation, and owner-preview chrome beneath the public menu.
- **VERIFIED:** source audit found broad Editorial selectors in the previous stylesheet (`header img`, `header > div`, generic sticky/button descendants) plus additional Editorial rules in shared refinement layers.
- **INFERRED:** the oversized logo symptom is explained by the previous generic `header img` rule; exact browser paint causality remains unproven until runtime inspection.
- **IMPLEMENTED on branch:** dedicated Editorial semantic regions, stable media geometry, controlled editorial asymmetry, Arabic/LTR typography treatment, compact action rail, explicit English availability, Escape-close dialogs, safe-area-aware cart, and documented layer ordering.
- **IMPLEMENTED on branch:** reusable validated public action logic for WhatsApp, map, phone, and Instagram using existing tenant/branch fields.
- **IMPLEMENTED on branch:** server-side, expiry-bound temporary premium-theme testing override with existing auth/role/tenant/subscription-status checks preserved.
- **IMPLEMENTED on branch:** Editorial design brief, layering audit, research evidence, and regression tests.

## Runtime / Browser State
- **VERIFIED:** current `main` production deployment is READY.
- **VERIFIED:** CI's Playwright browser template QA passes for all themes on the Essential/type-fix commit.
- **UNKNOWN:** browser rendering of the new Editorial branch until a deployment containing the Editorial changes is available and inspected.
- **UNKNOWN:** Opera/real-device behavior for Editorial.
- **BLOCKED for milestone closure:** no production claim can be made for Editorial before branch quality gates and deployment evidence pass.

## Repository Changes in Active Editorial Batch
- `src/components/templates/contemporary-restaurant.tsx`
- `src/components/public-action-links.tsx`
- `src/lib/menu/public-actions.ts`
- `src/components/lang-toggle.tsx`
- `src/lib/theme/testing-access.ts`
- `src/lib/theme/server.ts`
- `src/theme-editorial.css`
- `src/routes/__root.tsx`
- `tests/preview-shell.test.mjs`
- `src/components/public-action-links.test.ts`
- `src/lib/theme/testing-access.test.ts`
- `docs/template-briefs/editorial-premium-refinement.md`
- `docs/editorial-layering-and-ui-audit.md`
- `docs/temporary-theme-testing-access.md`
- `docs/design-research-log.md`
- `package.json` (test command only; dependency manifest reconciled to `main`)

## Session Log
- 2026-09-05 — Reconciled Essential against `main`, recent commits, CI, and Vercel evidence. Confirmed Essential deployment and full quality workflow success after the React type declaration repair.
- 2026-09-05 — Audited supplied Editorial screenshots and actual `contemporary-restaurant` implementation; identified generic header/image and shared refinement selector conflicts.
- 2026-09-05 — Implemented Editorial premium refinement, validated public contact-action helper, language availability behavior, expiry-bound theme testing access, layering documentation, and regression coverage on `editorial-premium-refinement`.

## Exact Next Task
Run the full quality gates against the completed Editorial branch, inspect the resulting Vercel preview deployment, perform available browser/visual/functional checks for Editorial, fix only verified Editorial regressions, then update this state to reflect the final implementation/deployment status. Do not begin another theme.
