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

## Permanent Release-Only Vercel Gate
- **VERIFIED:** Vercel is a release platform, not the normal development or design-iteration environment.
- **VERIFIED:** required path is `LOCAL DEVELOPMENT → LOCAL QA → LOCAL BROWSER / VISUAL QA → TESTS → GITHUB ACTIONS QUALITY GATES → DIFF REVIEW → ONE COHERENT RELEASE BATCH → MERGE TO MAIN → ONE VERCEL PRODUCTION DEPLOYMENT → REAL-DEVICE PRODUCTION QA → RECORD RESULT`.
- **VERIFIED:** `main` must remain stable/deployable; milestone/release branches are preferred when local workflow exists; local commits are allowed as checkpoints; do not push each small implementation change for visual iteration.
- **VERIFIED:** Preview Deployments are exception-only for production-like deployment behavior that local verification cannot prove, stable candidate sharing, or significant deployment-specific release risk. They are not for ordinary CSS, typography, spacing, theme, RTL, responsive, or small visual changes.
- **VERIFIED:** production deployment is allowed only after a complete verified release batch; random Redeploy/failed-build retries are prohibited.
- **VERIFIED:** implementation status and deployment status are separate. Use `IMPLEMENTATION_IN_PROGRESS`, `VERIFIED_LOCALLY`, `READY_TO_PUSH`, `PUSHED`, `DEPLOYED`, `DEPLOYMENT_BLOCKED`, `IMPLEMENTATION_BLOCKED`, `DONE`.
- **VERIFIED:** `DEPLOYED` requires direct Vercel evidence.
- **VERIFIED:** quota/rate/paused/unavailable Vercel conditions require `DEPLOYMENT_BLOCKED`, no random retry, no claim that Production equals `main`, and preservation of verified work as `VERIFIED_LOCALLY` or `READY_TO_PUSH` when justified.
- **VERIFIED:** urgent production outage, critical security/privacy, or data-loss fix is the only release-process exception and must be narrowly documented.
- **VERIFIED:** post-release breakage may use Instant Rollback only when an eligible previous production deployment exists; record target/reason and then fix through the normal verified release batch.
- **VERIFIED:** before any future deployment-related decision, inspect the actual Vercel Usage/Billing page to identify the limited resource.
- **VERIFIED:** exact rule: visual CSS/theme iteration must not require Vercel deployment.

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

## Project Memory and Learning System
- **VERIFIED:** permanent learned-problem memory is maintained at `docs/project-memory/problems-learned.md`.
- **VERIFIED:** complex tasks and long debugging/design loops must consult this memory before trying new approaches when a similar pattern may exist.
- **VERIFIED:** current memory covers Vercel/release strategy, theme visual QA, UI layering/overlays, RTL/language switching, continuity drift, branching/release batching, build/dependency tooling, and authentication runtime behavior.
- **TODO:** update the memory after future major incidents, expensive milestones, or newly discovered hard problems.

## Documentation Milestone
- **IN_PROGRESS:** project-memory learning system is being established using only authorized governance/documentation paths.
- **VERIFIED:** no application code, template, schema, migration, authentication, authorization, subscription, tenant/branch isolation, product feature, dependency, CI/CD, Vercel setting, `vercel.json`, environment variable, or deployment configuration is being changed.
- **VERIFIED:** no intentional Vercel deployment is part of this milestone.

## Exact Next Task
Verify Vercel deployment for merged commit `81a7e0efbdf46bcf320699d0945e1a5d7d29c964`, inspect available runtime evidence, update deployment status, and stop. Do not begin another theme.
