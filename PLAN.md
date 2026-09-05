# Menu V3 — Active Plan

## Status
- Status: IN_PROGRESS.
- Repository: `Midosd249/Menu_V3`.
- Source of truth: `main`.
- Premium Theme System is DONE / VERIFIED / MERGED.
- **Essential Premium Refinement — IMPLEMENTED; browser/CI verification pending.**
- Editorial remains protected.
- Noir implementation refinement is complete; final browser/device closure remains separately blocked and Noir is not being reopened.
- Heritage and Gallery remain untouched.
- Permanent visual/functional/research quality workflow is DONE / VERIFIED and mandatory.
- External theme preview QR mode is DONE / VERIFIED.

## Current Atomic Task
### Essential Premium Refinement — IMPLEMENTATION BATCH COMPLETE / VERIFICATION PENDING

**Objective:** refine the existing Essential `small-menu` experience into a production-premium Arabic-first restaurant menu without rebuilding the Public Menu or changing other themes.

## Implementation
- **VERIFIED:** `src/components/templates/small-menu.tsx` no longer duplicates the public renderer's header/concept shell; Essential delegates directly to `PublicMenuView`.
- **VERIFIED:** `src/theme-essential.css` defines a complete scoped Essential system for typography, canvas, hero, search/categories, featured cards, product cards, hours, action dock, safe areas, focus, bidi, fallbacks, responsive behavior, and reduced motion.
- **VERIFIED:** fixed customer actions retain the existing shared renderer and use the documented z-index/safe-area model.
- **VERIFIED:** the prior SSR theme bootstrap and controller cleanup stabilization remain intact.
- **VERIFIED:** no other theme stylesheet or theme registry definition was modified.
- **VERIFIED:** source-level Essential regression assertions were added to the existing preview-shell test suite.
- **VERIFIED:** design brief, layering audit, and research log were updated.

## Design Decision
Essential remains the Free everyday-hospitality theme. The refinement prioritizes fast scanning, Arabic readability, clear product hierarchy, restrained terracotta accent, warm/light canvas, stable media, and quiet customer actions. It deliberately avoids image-heavy premium effects, circular clipping, arbitrary high z-index values, and decorative motion that can hide content.

## Verification
Required:
1. `npm run typecheck`
2. `npm test`
3. `npm run test:platform`
4. `npm run lint`
5. `npm run build`
6. `npm run qa:template`
7. `npm run performance:audit`
8. GitHub Actions Chromium browser QA for all five themes.
9. Real-device/Opera verification where available.

Current environment limitation:
- **BLOCKED:** local repository runtime is unavailable; commands cannot be executed from this GitHub-only session.
- **UNKNOWN:** Opera-specific rendering, real-device screenshots, QR scan, exact first-paint timing, post-hydration console output, and pixel comparison.

## Release Policy
- Keep Essential as one coherent release batch.
- Do not change other themes while closing Essential.
- Do not claim `DEPLOYED` without Vercel evidence.
- Do not start Heritage until the Essential closure gate is satisfied.

## Exact Next Task
Inspect the GitHub Actions result for the Essential refinement commit. Resolve only any Essential-scoped failures, then review browser evidence and capture remaining Opera/real-device evidence before `CLOSED`.
