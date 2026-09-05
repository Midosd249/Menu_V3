# TASKS

## Current Atomic Task
### Editorial Premium Refinement + Contact/Location Action System + Language-Switch Verification + Temporary Public Theme Testing Access — IN PROGRESS
- **Objective:** make `editorial` / `contemporary-restaurant` a premium, distinct, Arabic-first restaurant menu and complete its action/language/testing-access quality system without redesigning unrelated themes.
- **VERIFIED:** repository continuity was reconciled before implementation. Essential is deployed and its post-type-fix quality workflow is green.
- **VERIFIED:** supplied Editorial screenshots and current source were audited before implementation.
- **IMPLEMENTED:** Editorial hero, typography, editorial grid rhythm, stable product media, search/category rail, hours, responsive rules, and explicit semantic regions.
- **IMPLEMENTED:** reusable data-driven WhatsApp/map/phone/Instagram action helper using existing tenant/branch fields.
- **IMPLEMENTED:** language switcher preserves validated route search state and disables English when the current menu identity lacks English availability.
- **IMPLEMENTED:** server-only, expiry-bound temporary premium theme testing override; existing auth, owner/admin role, tenant scope, and subscription-status checks remain in place.
- **IMPLEMENTED:** layering audit, design brief, research log, and regression coverage.

## Quality Gates Pending
1. `npm run typecheck`
2. `npm test`
3. `npm run test:platform`
4. `npm run lint`
5. `npm run build`
6. `npm run qa:template`
7. `npm run performance:audit`
8. Browser visual/functional QA for Editorial public and owner preview.
9. Language switch verification with bilingual and Arabic-only real data.
10. Action visibility verification with configured, missing, and invalid data.
11. Cart/order, modifier, sold-out, branch, search, and category interaction checks.
12. Mobile safe-area and layering checks across scroll/modal states.
13. Essential + other-theme regression review.
14. Final diff and deployment evidence review.

## Protected Scope
- Essential is not being redesigned or reopened.
- Noir, Heritage, and Gallery are not redesigned by this milestone.
- No database schema/migration changes.
- No weakening of authentication, authorization, tenant/branch isolation, subscription status, SEO, routing, CI/CD, or deployment controls.
- No client-controlled entitlement bypass.

## Temporary Testing Access
- `MENU_THEME_TESTING_OVERRIDE=true`
- `MENU_THEME_TESTING_OVERRIDE_EXPIRES_AT=<future ISO-8601 timestamp>`
- Both are required; expired/missing override is OFF.
- Override applies only to premium theme entitlement checks for authenticated owner/admin users; subscription status remains enforced.

## Permanent Quality Gate
Every future template/public-menu UI task must use `AGENTS.md`, `docs/design-intelligence.md`, `docs/template-review-checklist.md`, `docs/visual-functional-audit.md`, and `docs/design-research-log.md`.

## Exact Next Task
Run the complete Editorial quality gates and inspect the Vercel branch preview. Fix only verified failures, then record final evidence and stop without beginning another theme.
