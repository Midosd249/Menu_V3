# Menu V3 — Active Plan

## Status
- Status: IN_PROGRESS.
- Repository: `Midosd249/Menu_V3`.
- Source of truth: `main`; current work is isolated on `editorial-premium-refinement`.
- Premium Theme System is DONE / VERIFIED / MERGED.
- **Essential Premium Refinement — DEPLOYED / VERIFIED.** Its implementation is protected; manual real-device/Opera evidence remains UNKNOWN.
- **Editorial Premium Refinement + Contact/Location Action System + Language-Switch Verification + Temporary Public Theme Testing Access — ACTIVE.**
- Noir implementation refinement is complete; final browser/device closure remains separately blocked and Noir is not being reopened.
- Heritage and Gallery remain untouched.
- Permanent visual/functional/research quality workflow is DONE / VERIFIED and mandatory.
- External theme preview QR mode is DONE / VERIFIED.

## Essential Reconciliation
- **VERIFIED:** Essential delegates to `PublicMenuView` and no longer owns duplicate public renderer chrome.
- **VERIFIED:** Essential scoped presentation system covers hero, typography, spacing, search/categories, featured cards, product hierarchy, hours, action dock, safe areas, focus, bidi, fallbacks, responsive behavior, and reduced motion.
- **VERIFIED:** GitHub Actions quality run `33938789743` for commit `ed030657bd95f31a180f21118611f9665c5e0836` passed typecheck, tests, lint, production build, Playwright Chromium installation, browser template QA for all themes, performance baseline upload, and cleanup.
- **VERIFIED:** Vercel production deployment `dpl_APYCcu1PbR2cgvd9ALjtZBBSTKJf` is `READY` for commit `ed030657bd95f31a180f21118611f9665c5e0836`.
- **UNKNOWN:** manual Opera/real-device screenshots and post-hydration console inspection.

## Editorial Milestone — Objective
Turn `editorial` / `contemporary-restaurant` into a genuinely premium, distinct, Arabic-first restaurant menu without rebuilding the public menu or weakening auth, authorization, tenant/branch isolation, subscription security, SEO, routing, or deployment behavior.

### Planned implementation
1. Audit existing Editorial component, theme layers, preview routes, language path, action data, and entitlement enforcement.
2. Refine Editorial hero, typography, grid rhythm, image geometry, product cards, search/category rail, hours, and responsive behavior.
3. Add reusable data-driven contact/location/social actions using existing tenant/branch fields with safe validation.
4. Verify/fix Arabic/English language switching and explicit English availability behavior.
5. Add a server-only, expiry-bound temporary theme testing override without bypassing auth/role/tenant/branch/subscription-status controls.
6. Document z-index/stacking behavior and prevent duplicate/covering layers.
7. Run complete quality and browser evidence before any merge/deployment claim.

## Editorial acceptance gates
- **VERIFIED by source implementation:** Editorial has dedicated semantic regions and no longer relies on generic header/image descendants for hero identity.
- **VERIFIED by source implementation:** product image geometry is stable and scroll-driven visibility is removed from the final Editorial layer.
- **VERIFIED by source implementation:** action links are data-driven, HTTPS/host-validated where external, and hidden when destinations are missing/invalid.
- **VERIFIED by source implementation:** English selection is disabled when the existing menu identity data does not support an English locale; when available, public navigation updates validated `lang` search state.
- **VERIFIED by source implementation:** temporary premium-theme testing access is server-only and requires a future expiry timestamp.
- **UNKNOWN until CI/runtime:** actual computed styles, browser paint, mobile safe areas, cross-browser behavior, and end-to-end language/action interaction.

## Verification Required for Closure
1. `npm run typecheck`
2. `npm test`
3. `npm run test:platform`
4. `npm run lint`
5. `npm run build`
6. `npm run qa:template`
7. `npm run performance:audit`
8. Chromium public/preview Editorial visual-functional QA.
9. Arabic RTL, English LTR, mixed-direction, long names, SAR, missing images, sold-out/modifier, branches, and contact-action presence/absence.
10. Layering at top/middle/bottom scroll and all modal states.
11. Opera/real-device checks where tools/devices are actually available.
12. Final diff review, Essential/other-theme regression review, and Vercel deployment evidence.

## Release Policy
- Essential remains protected at its deployed main state.
- Editorial work must remain one coherent batch and must not be merged while quality gates are incomplete.
- Do not start Heritage or Gallery during this milestone.
- Temporary theme testing override must be reviewed and disabled before commercial production launch.

## Exact Next Task
Complete the Editorial branch quality gates and inspect its Vercel preview deployment. Fix only verified Editorial failures, then update continuity files with final implementation/deployment evidence.
