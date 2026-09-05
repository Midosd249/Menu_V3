# TASKS

## Current Task
### Editorial Premium Refinement + Contact/Location Action System + Language-Switch Verification + Temporary Public Theme Testing Access — IMPLEMENTED / VERIFIED / MERGED
- **VERIFIED:** repository continuity was reconciled before Editorial work; Essential is deployed and its post-type-fix quality workflow is green.
- **VERIFIED:** supplied Editorial screenshots and current source were audited before implementation.
- **VERIFIED:** Editorial hero, typography, editorial grid rhythm, stable product media, search/category rail, hours, responsive rules, and semantic regions were refined without creating a sixth theme.
- **VERIFIED:** reusable data-driven WhatsApp/map/phone/Instagram action logic uses existing tenant/branch fields and hides invalid/missing destinations.
- **VERIFIED:** language switching preserves route search state and does not fabricate English content when English identity data is unavailable.
- **VERIFIED:** temporary premium-theme testing override is server-only, expiry-bound, owner/admin-gated, tenant-scoped, and subscription-status-safe.
- **VERIFIED:** layering audit, design brief, research log, and regression coverage were added.
- **VERIFIED:** final verification workflow `33941534592` passed typecheck, tests, lint, production build, browser template QA for all themes, performance baseline upload, and cleanup.
- **VERIFIED:** PR #13 was squash-merged into `main` as `81a7e0efbdf46bcf320699d0945e1a5d7d29c964`.

## Deployment Gate
- **UNKNOWN:** Vercel deployment corresponding to merged commit `81a7e0efbdf46bcf320699d0945e1a5d7d29c964` is not yet visible in the available deployment list.
- **UNKNOWN:** manual Opera/real-device screenshots and post-hydration console inspection.
- **BLOCKED:** do not mark Editorial `DEPLOYED` until Vercel evidence points to the merged main release.

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
- Review and disable before commercial production launch.

## Permanent Quality Gate
Every future template/public-menu UI task must use `AGENTS.md`, `docs/design-intelligence.md`, `docs/template-review-checklist.md`, `docs/visual-functional-audit.md`, and `docs/design-research-log.md`.

## Exact Next Task
Verify Vercel deployment for merged commit `81a7e0efbdf46bcf320699d0945e1a5d7d29c964`, inspect available runtime evidence, update deployment status, and stop. Do not begin another theme.
