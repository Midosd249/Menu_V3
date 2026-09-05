# SESSION_PROTOCOL

## Start
1. Read all applicable `AGENTS.md` files, then `PROJECT_STATE.md`, `PLAN.md`, `TASKS.md`, `SESSION_PROTOCOL.md`, README/relevant documentation, task-related source, tests, and configuration.
2. Treat `main` as the source of truth; inspect repository status, recent history, relevant diffs, and available CI/deployment evidence.
3. Use `VERIFIED`, `INFERRED`, `UNKNOWN`, `BLOCKED`, and `PROPOSED` explicitly; reconcile continuity state against code and git evidence.
4. Identify the highest-value unblocked atomic task from repository evidence and explicit user scope.
5. For template/public-menu work, complete the permanent quality gate before implementation.
6. For complex tasks or when symptoms resemble a known incident, read `docs/project-memory/problems-learned.md` before beginning a long debugging or design-iteration loop.

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
Before merging to `main`, complete the applicable unit/integration/E2E, lint, typecheck, build, browser/visual, accessibility, mobile/responsive, Arabic RTL, English LTR, mixed-direction, security/authz/tenant/branch/input-validation, public-menu/critical-flow, SEO, database-safety, final-diff, continuity, and rollback checks. Then form one coherent release batch and merge only after the batch is verified.

### Preview Deployment exception policy
Vercel Preview Deployments are exceptions, not ordinary development environments. Use one only when local verification cannot prove deployment-specific behavior, such as production-like environment variables, third-party integrations, domain/routing/edge behavior, deployment-specific runtime behavior, stable candidate sharing, or significant release risk that cannot be locally verified. Before creating a preview, record why local verification is insufficient, the exact behavior being tested, branch/commit, and success criteria. Do not use previews for ordinary CSS, typography, spacing, theme, RTL, responsive, or small visual changes.

### Production deployment policy
Production deployment occurs only after a complete verified release batch is merged to `main`. Prefer one Vercel production deployment for the batch. Do not intentionally trigger repeated deployments, Redeploy, or failed-build retries without a documented reason. CI success is not deployment evidence. `DEPLOYED` requires direct Vercel evidence showing the deployed production commit/state.

### Quota, rate, pause, and build-block handling
Before any future deployment-related decision, inspect the actual Vercel Usage/Billing page and determine which resource is limited. If Vercel is quota-limited, rate-limited, paused, or unavailable:
- do not retry randomly;
- record `DEPLOYMENT_BLOCKED`;
- do not claim Production equals `main`;
- preserve verified work as `VERIFIED_LOCALLY` or `READY_TO_PUSH` when justified;
- record the exact blocker and evidence;
- continue local work only when it does not depend on the blocked deployment.

### Urgent exception
Urgent production outages, critical security/privacy issues, and data-loss fixes are the only release-process exception. Scope the exception narrowly, document why the normal path could not be followed, verify the fix, and return to the normal release workflow immediately afterward.

### Rollback
If production is broken after a release, use Vercel Instant Rollback only when an eligible previous production-serving healthy deployment exists. Record the rollback target and reason. Do not delete or invalidate the rollback target. Then fix forward through the normal local verification → quality gates → coherent release batch → `main` → production workflow. Not every preview deployment is an eligible rollback target.

## Work
1. Preserve completed work; do not restart, rebuild, replace, or remove completed features.
2. Before material template changes, create/update the template brief and visual/functional audit.
3. Record material research in `docs/design-research-log.md`.
4. Implement the smallest complete, reversible change using existing architecture.
5. Run relevant tests, typecheck, lint, build, performance, accessibility, and manual checks available for the task.
6. Inspect final diff and confirm every changed line belongs to the single task.
7. Update `PROJECT_STATE.md`, `PLAN.md`, and `TASKS.md`; update this protocol when workflow rules change.
8. Stop after one atomic task.

## Visual and Functional Gate
- First-screen clarity, restaurant identity, typography, hierarchy, spacing, alignment, wrapping, clipping, overlap, contrast, cards, categories, search, prices, image behavior, sticky/fixed controls, safe areas, dialogs, scroll, RTL/LTR, and theme/segment fit must be reviewed.
- Interactive controls require clear purpose, expected placement, reachability, accessible naming, visible focus where relevant, adequate touch targets, correct states, and clear feedback.
- Real-data tests must include long names, Arabic/English/mixed content, SAR price variation, missing/poor images, sold-out states, modifiers where supported, sparse/dense categories, and multiple branches where supported.
- No theme is premium if decoration compromises readability, scanability, contrast, or conversion clarity.

## Incident Learning: Preview Covering-Layer Failure
1. Treat a visible covering layer as a rendering/stacking-system problem first.
2. Inspect DOM structure, positioning/sizing, stacking contexts, pseudo-elements, animation/paint timing, responsive constraints, then targeted z-index changes.
3. Do not introduce `isolation` or defensive stacking contexts without evidence; the prior successful fix removed a stacking trap rather than adding another one.
4. Preview must not depend on scroll progress to make content visible.
5. Keep the template as the owner of its presentation shell; avoid duplicated route/template shells.
6. Prefer structural regression tests over HTTP 200 as proof of visibility.
7. When another agent discovers a successful fix, study the exact successful diff and convert its engineering principle into protocol.

## Incident Learning: Public Theme Flash and Action Visibility
1. Do not rely on a client-only effect to establish the theme for the first paint when the server already knows the theme.
2. Bootstrap the route-known theme identity/tokens in the document head before hydration.
3. Do not return dependency-effect cleanup that clears shared theme tokens during ordinary theme/location updates; clear only on true controller unmount.
4. Avoid duplicate `.menu-public-shell` ownership between route and template layers.
5. Shared customer actions that are supported and verified must not depend solely on a deep nested template section for discoverability; use one consistent shared action surface.
6. Keep fixed action surfaces outside owner preview mode and reserve document space so they cannot obscure content.
7. Test empty and populated Cart states explicitly; absence of a populated state must not remove the entry point.

## Project Memory and Learning System
- `docs/project-memory/problems-learned.md` is the permanent evidence-based record of hard problems, root causes, failed/wasteful approaches, working solutions, lessons, anti-patterns, and detection checklists.
- Before entering a long debugging or design-iteration loop, check the memory for similar symptoms and apply its detection checklist first.
- If symptoms match a recorded problem, do not repeat the recorded anti-pattern merely because it is familiar; first test the recorded causal explanation.
- After any major incident or expensive milestone, propose an update to the memory. After resolving a new hard problem, add the root cause, lessons, anti-patterns, and detection checklist.
- Keep uncertain details marked `INFERRED` or `UNKNOWN`; memory must not become a second source of truth that overrides code, tests, Git, or direct platform evidence.

## Stop
1. Stop after the single current task is completed or blocked.
2. Update continuity files and append a dated session log. If the task has an explicitly restricted file allowlist, record the session entry in an already-authorized continuity file rather than creating an unapproved path.
3. Record files changed, commands/results, commit evidence, uncertainty, blockers, and exactly one next task.
4. Do not begin another template automatically.

## Status Labels
- `VERIFIED` — directly confirmed by repository/tool/test/source evidence.
- `INFERRED` — derived from verified evidence but not directly observed.
- `UNKNOWN` — insufficient evidence.
- `BLOCKED` — cannot proceed due to environment, dependency, permission, or other hard constraint.
- `PROPOSED` — recommended but not yet proven.
- `TODO` — planned and not started.
- `IN_PROGRESS` — the single current execution task.
- `DONE` — completed with explicit evidence.
- `CLOSED` — milestone completed and verified to release criteria.
- `IMPLEMENTATION_IN_PROGRESS` — implementation work is active and not yet locally verified.
- `VERIFIED_LOCALLY` — implementation has passed applicable local verification but is not yet pushed/released.
- `READY_TO_PUSH` — local release batch is verified and ready for the controlled push/merge step.
- `PUSHED` — the release batch has been pushed to its intended remote branch; this is not deployment evidence.
- `DEPLOYED` — direct Vercel evidence confirms the intended production deployment.
- `DEPLOYMENT_BLOCKED` — implementation/release is blocked specifically by Vercel availability, quota, rate, pause, build, or platform conditions.
- `IMPLEMENTATION_BLOCKED` — implementation cannot proceed because of a hard technical, permission, dependency, or environment blocker.
