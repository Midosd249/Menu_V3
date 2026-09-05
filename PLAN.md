# Menu V3 — Active Plan

## Status
- Status: IN_PROGRESS.
- Repository: `Midosd249/Menu_V3`.
- Source of truth: `main`.
- Premium Theme System is DONE / VERIFIED / MERGED.
- **Essential Premium Refinement — IMPLEMENTED and DEPLOYED; quality-gate closure pending.**
- Editorial remains protected.
- Noir implementation refinement is complete; final browser/device closure remains separately blocked and Noir is not being reopened.
- Heritage and Gallery remain untouched.
- Permanent visual/functional/research quality workflow is DONE / VERIFIED and mandatory.
- External theme preview QR mode is DONE / VERIFIED.

## Essential Refinement Result
- **VERIFIED:** `SmallMenuTemplate` now delegates directly to `PublicMenuView`; duplicate template chrome is removed.
- **VERIFIED:** Essential has a complete scoped presentation system for hero, typography, spacing, search/categories, featured cards, product cards, contrast rhythm, hours, action dock, safe areas, focus, bidi, fallbacks, responsive behavior, and reduced motion.
- **VERIFIED:** existing shared customer behavior remains the source of truth for cart/order, product details/modifiers, search/category, language, WhatsApp, map, phone, social, analytics, tenant/branch routing, and authorization.
- **VERIFIED:** Vercel production deployment for commit `48430b67a5d6cd9154db237b4cb801e6ee58109e` is `READY`.
- **VERIFIED:** deployed `/m/mndy-alwtnya` returns HTTP 200 and has deterministic Essential first-paint theme data plus a single public header/renderer.
- **BLOCKED:** GitHub Actions quality workflow stopped at its existing project-wide TypeScript React declaration gap before tests/lint/browser QA.
- **UNKNOWN:** Opera/real-device behavior, exact first-paint timing, hydrated computed-style screenshots, and console output.

## Quality-Gate Finding
The current `package.json` has React 19 runtime packages but no `@types/react` / `@types/react-dom` development packages. CI therefore fails at Typecheck in existing routes before the Essential test suite can run. This is a pre-existing project-wide maintenance issue, not an Essential regression. It remains intentionally outside this theme-scoped batch.

## Verification Required for Closure
1. Run/inspect full `npm run typecheck`, `npm test`, `npm run test:platform`, `npm run lint`, `npm run build`, `npm run qa:template`, and `npm run performance:audit` after the type-declaration issue is handled in its own maintenance task.
2. Run Chromium template QA for Essential public and preview routes.
3. Verify RTL, LTR, bilingual, mixed-direction, long content, image fallbacks, featured counts, sold-out/modifier states, branch navigation, and contact-action presence/absence.
4. Verify fixed/sticky layering, cart/dialog priority, safe-area clearance, focus visibility, and keyboard interaction.
5. Verify Opera and at least one real mobile browser/device before closing the reported cross-browser defects.
6. Confirm Vercel deployment evidence before marking `DEPLOYED`.

## Release Policy
- Essential implementation remains one coherent release batch: `48430b67a5d6cd9154db237b4cb801e6ee58109e`.
- Follow-up changes must be limited to verified Essential defects or separately scoped project-wide quality maintenance.
- Do not change other themes while closing Essential.
- Do not start Heritage until Essential closure is satisfied.

## Exact Next Task
Treat the React type-declaration failure as a separate project-wide quality maintenance task, then rerun the complete quality pipeline and browser evidence for Essential. Do not hide the failure by weakening the quality workflow.
