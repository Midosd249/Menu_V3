# SESSION_PROTOCOL

## Start
1. Read all applicable `AGENTS.md` files, then `PROJECT_STATE.md`, `PLAN.md`, `TASKS.md`, `SESSION_PROTOCOL.md`, README/relevant documentation, task-related source, tests, and configuration.
2. Treat `main` as the source of truth; inspect repository status, recent history, relevant diffs, and available CI/deployment evidence.
3. Use `VERIFIED`, `INFERRED`, `UNKNOWN`, `BLOCKED`, and `PROPOSED` explicitly; reconcile continuity state against code and git evidence.
4. Identify the highest-value unblocked atomic task from repository evidence and explicit user scope.
5. For template/public-menu work, complete the permanent quality gate before implementation.

## Permanent Release-Only Vercel Workflow
Vercel is a release platform, not the normal development or design-iteration environment. The normal path is:

**LOCAL DEVELOPMENT → LOCAL QA → LOCAL BROWSER / VISUAL QA → TESTS → GITHUB ACTIONS QUALITY GATES → DIFF REVIEW → ONE COHERENT RELEASE BATCH → MERGE TO MAIN → ONE VERCEL PRODUCTION DEPLOYMENT → REAL-DEVICE PRODUCTION QA → RECORD RESULT**

### Local-first rules
- `main` must remain stable and deployable.
- When a local workflow is available, use a milestone/release branch for the atomic task and local commits as safe checkpoints.
- Do not push each small implementation change merely to obtain visual feedback.
- Visual CSS/theme iteration must not require Vercel deployment.
- Typography, spacing, card layout, theme styling, RTL, responsive behavior, and ordinary animation refinement are verified locally first.

### GitHub quality and release-batch gate
Before merging to `main`, complete applicable unit/integration/E2E, lint, typecheck, build, browser/visual, accessibility, mobile/responsive, Arabic RTL, English LTR, mixed-direction, security/authz/tenant/branch/input-validation, public-menu/critical-flow, SEO, database-safety, final-diff, continuity, and rollback checks. Then form one coherent release batch and merge only after the batch is verified.

### Preview Deployment exception policy
Vercel Preview Deployments are exceptions, not ordinary development environments. Use one only when local verification cannot prove deployment-specific behavior, such as production-like environment variables, third-party integrations, domain/routing/edge behavior, deployment-specific runtime behavior, stable candidate sharing, or significant release risk that cannot be locally verified. Before creating a preview, record why local verification is insufficient, the exact behavior being tested, branch/commit, and success criteria.

### Production deployment policy
Production deployment occurs only after a complete verified release batch is merged to `main`. Prefer one Vercel production deployment for the batch. Do not intentionally trigger repeated deployments, Redeploy, or failed-build retries without a documented reason. CI success is not deployment evidence. `DEPLOYED` requires direct Vercel evidence.

### Quota, rate, pause, and build-block handling
Before deployment decisions, inspect actual Vercel Usage/Billing and identify the limited resource. If blocked, do not retry randomly; record `DEPLOYMENT_BLOCKED`, do not claim Production equals `main`, and preserve verified work.

### Work
1. Preserve completed work; do not restart, rebuild, replace, or remove completed features.
2. Before material template changes, create/update the template brief and visual/functional audit.
3. Record material research in `docs/design-research-log.md`.
4. Implement the smallest complete, reversible change using existing architecture.
5. Run relevant tests, typecheck, lint, build, performance, accessibility, and manual checks available for the task.
6. Inspect final diff and confirm every changed line belongs to the single task.
7. Update `PROJECT_STATE.md`, `PLAN.md`, and `TASKS.md`; update this protocol whenever workflow rules change.
8. Stop after one atomic task.

## Visual and Functional Gate
Review first-screen clarity, restaurant identity, typography, hierarchy, spacing, alignment, wrapping, clipping, overlap, contrast, cards, categories, search, prices, images, fixed controls, safe areas, dialogs, scroll, RTL/LTR, mobile usability, and theme fit. Test realistic Arabic/English/mixed content, long names, SAR prices, missing/poor images, availability states, sparse/dense categories, and branch states where supported. Interactive controls require clear purpose, reachability, accessible naming, focus, touch targets, correct states, and feedback.

## Incident Learning: Preview Covering-Layer Failure
1. Treat visible covering layers as rendering/stacking problems first.
2. Inspect DOM structure, positioning/sizing, stacking contexts, pseudo-elements, animation/paint timing, and responsive constraints before targeted z-index changes.
3. Do not introduce defensive stacking contexts without evidence.
4. Preview must not depend on scroll progress to make content visible.
5. Keep the template as owner of its presentation shell and avoid duplicated route/template shells.
6. Prefer structural regression tests over HTTP 200 as proof of visibility.
7. Convert successful fixes into reusable engineering principles.

## Incident Learning: Public Theme Flash and Action Visibility
1. Bootstrap route-known theme identity before hydration when the server knows the theme.
2. Avoid effect cleanup that clears shared theme tokens during ordinary updates.
3. Avoid duplicate `.menu-public-shell` ownership.
4. Supported shared customer actions must remain discoverable through one consistent action surface.
5. Fixed action surfaces must reserve document space and remain outside owner preview mode.
6. Test empty and populated cart states explicitly.

## Source-of-Truth Reconciliation Outcome — 2026-09-05
- **VERIFIED:** homepage live menu CTA/card uses slug `nafas`.
- **VERIFIED:** production Menu V3 database project `ublxptcqefujkbeepylc` contains `menu_v3.tenants.id=demo-nafas`, slug `nafas`, published tenant, Editorial theme, and one active branch.
- **VERIFIED:** `demo-nafas.owner_user_id` maps to `midosd2.mm@gmail.com` in `menu_v3."user"`; that same user has `owner` membership in `menu_v3.tenant_members`.
- **VERIFIED:** `demo-nafas` was inactive and was activated so the public published loader can serve the tenant.
- **VERIFIED:** the previous `getPublicMenu` implementation returned static `DEMO_MENU` for `nafas`, which broke the expected dashboard-edit → public-menu reflection path.
- **IMPLEMENTED:** removed the hard-coded `nafas` short-circuit. The published database tenant is now the public-menu source of truth.
- **UNKNOWN:** final deployed/browser proof of the reflection path until the branch passes CI and is released.

## Stop
1. Stop after the single current task is completed or blocked.
2. Update `PROJECT_STATE.md`, `PLAN.md`, and `TASKS.md`; append a dated session record.
3. Record files changed, commands/results, commit evidence, uncertainty, blockers, and exactly one next task.
4. Do not begin another template automatically.

## Status Labels
- `VERIFIED` — directly confirmed by repository/tool/test/source evidence.
- `INFERRED` — derived from verified evidence but not directly observed.
- `UNKNOWN` — insufficient evidence.
- `BLOCKED` — cannot proceed due to a hard blocker.
- `PROPOSED` — recommended but not proven.
- `TODO` — planned and not started.
- `IN_PROGRESS` — current execution task.
- `DONE` — completed with explicit evidence.
- `CLOSED` — milestone completed and verified to release criteria.
- `IMPLEMENTATION_IN_PROGRESS`, `VERIFIED_LOCALLY`, `READY_TO_PUSH`, `PUSHED`, `DEPLOYED`, `DEPLOYMENT_BLOCKED`, `IMPLEMENTATION_BLOCKED` — release/implementation lifecycle states.
