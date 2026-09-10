# Menu V3 — Active Plan

## Status
- Status: IN_PROGRESS.
- Repository: `Midosd249/Menu_V3`.
- Canonical branch: `main`.
- Source of truth: `main`.
- Premium Theme System — DONE / VERIFIED / MERGED.
- Essential, Editorial, Noir, Heritage, and Gallery — protected.
- Permanent visual/functional/research quality workflow — DONE / VERIFIED.
- P0 Public Order Hardening — DONE / VERIFIED.
- P1 Production/Continuity Hardening — DONE / VERIFIED for implemented scope.
- P1-H1 package manifest / lockfile reconciliation — CLOSED / VERIFIED.
- P1-H2 main branch protection — CLOSED / VERIFIED.
- P2 Growth & Differentiation — DONE / VERIFIED / DEPLOYED.
- W16 owner-accepted results — CLOSED FOR CURRENT EXECUTION.
- P2-H1 analytics no-data UX — CLOSED / VERIFIED on PR #59.
- Current active atomic task: P2-H2 production deployment identity reconciliation — `DEPLOYMENT_BLOCKED`.

## Canonical Backend Identity
- VERIFIED: Supabase project ref `ublxptcqefujkbeepylc`.
- VERIFIED: canonical database schema is `menu_v3`.
- VERIFIED: Menu V3 is separated from legacy application data by schema boundary.

## Current Strategic Direction
Build Menu V3 as a distinctive `Premium Arabic-first Restaurant Presence Platform`: live menu + branded web presence + direct customer action + owner operations + local discoverability, while preserving existing architecture and completed work.

## Permanent Specialist Workflows
- VERIFIED: `docs/agents/design-agent.md` defines the specialist workflow for significant visual, image, layout, theme, and site-consistency work.
- VERIFIED: `docs/agents/research-connected-tools-agent.md` defines repository-first dynamic research/discovery for consequential or unfamiliar work.
- VERIFIED: `docs/automatic-specialist-routing.md` defines automatic routing/orchestration.
- VERIFIED: `docs/project-memory/manus-engineering-lessons.md` records durable Manus execution lessons and must be consulted before related changes.
- VERIFIED: all specialist roles are internal AI workflows; the user remains the sole human owner and primary developer.

## P0/P1/P2 Current Evidence
### P0 — Public Order Hardening
- VERIFIED: database-backed public-order rate limiting and idempotency are implemented.
- VERIFIED: server-side product, availability, variant, modifier, quantity, note, tenant, and price validation remains authoritative.
- VERIFIED: legacy sensitive RPC execution is closed to `anon` and `authenticated` in the canonical live database inspection.

### P1 — Production/Continuity Hardening
- VERIFIED: continuity, release, security, and deployment evidence was reconciled against repository/platform state.
- CLOSED: package manifest / lockfile reconciliation for deterministic `npm ci` installation.
- CLOSED: `main` branch protection / required status checks.
- No speculative dependency upgrade is authorized.

### P2 — Growth & Differentiation — COMPLETED / VERIFIED / DEPLOYED
- VERIFIED: advanced analytics storytelling is implemented using the canonical owner analytics source.
- VERIFIED: local visibility readiness uses only verified tenant/branch fields and does not claim Google ranking.
- VERIFIED: experimentation is hypothesis-led and does not invent results or statistical significance.
- VERIFIED: no second analytics event source was introduced.
- VERIFIED: `tests/p2-growth-differentiation.test.mjs` protects the P2 contracts.

## P1-H1 Closure Record
- VERIFIED: npm regenerated `package-lock.json` in GitHub Actions from the current `package.json`.
- VERIFIED: `npm ci --ignore-scripts --dry-run` passed before the generated lockfile was committed.
- VERIFIED: PR #57 was merged to `main` as `65314826bdb652c541d66071ea9d2401067f35d2`.
- VERIFIED: final PR diff contained only `package-lock.json`; the temporary reconciliation workflow was removed before merge.
- VERIFIED: final quality gate passed install, route tree generation, typecheck, tests, lint, build, Playwright browser QA, performance baseline, and cleanup.

## P1-H2 Closure Record
- VERIFIED: GitHub ruleset `main-protection` is active (ruleset ID `22744795`).
- VERIFIED: target is the repository default branch (`main`).
- VERIFIED: deletion protection and non-fast-forward protection are active.
- VERIFIED: Pull Requests are required; required approval count is `0`.
- VERIFIED: required status check `quality` is enforced with strict/up-to-date policy.
- VERIFIED: bypass actor list is empty.
- VERIFIED: no deployment, signed-commit, code-owner, or extra-review requirement was added.

## P2-H1 Closure Record
- VERIFIED: PR #59 changes only `src/routes/studio/analytics.tsx` and `tests/p2-growth-differentiation.test.mjs`.
- VERIFIED: the no-data state now keeps the existing empty-state message and renders `VisibilityReadiness` alongside it.
- VERIFIED: the populated analytics path is unchanged.
- VERIFIED: focused regression coverage protects the zero-event visibility behavior.
- VERIFIED: quality run `34454958196` passed route generation, typecheck, 198 tests, lint, production build, Playwright runtime/browser QA for all themes, performance handling, and cleanup.
- VERIFIED: temporary patch automation was removed after applying the exact two-file change; it is not part of the PR diff.
- VERIFIED: no database, authorization, tenant isolation, dependency, theme, or Vercel configuration was changed.

## Protected Completed Work
- Essential, Editorial, Noir, Heritage, and Gallery implementation milestones are protected.
- Shared public-menu behavior, customer actions, authentication, authorization, tenant/branch isolation, routing, migrations, and deployment controls remain protected.
- Quick Add, Item Notes, Cart, canonical public rendering, and customer action surfaces remain protected.
- Do not create a sixth theme as a substitute for product/design strategy.
- Do not repeat Manus-completed work unless a current reproducible defect is proven.

## W16 — Human Device & Manual Accessibility Gate
- OWNER-ACCEPTED: the latest direct-device results are accepted for the current milestone.
- Do not reopen completed theme/architecture work without reproducible defect evidence.
- Remaining unsupported/unknown observations are not silently converted into implementation failures.

## P2-H2 — Production Deployment Identity Reconciliation
### Objective
Determine whether the latest verified `main` state is already deployed to Vercel Production, using direct deployment evidence only and without triggering an unnecessary deployment.

### Verified boundary
- `main` application commit under reconciliation: `356b7b68d8765a96fc623098b1f9da062a7c3abd`.
- GitHub `Vercel` status for that commit is `failure` with a target containing `upgradeToPro=build-rate-limit`.
- Public Vercel menu URLs return HTTP 200, but this is not accepted as deployment identity evidence.
- Connected Vercel deployment-management access returns HTTP 403 for the project/team scope.
- Status: `DEPLOYMENT_BLOCKED`.

### Acceptance criteria
- Direct Vercel evidence identifies the Production deployment commit and status.
- The deployment commit is compared with the verified `main` commit after PR #59 merge.
- If already aligned, no deployment is triggered.
- If not aligned, perform one authorized release deployment only after the blocker is resolved.
- Continuity records distinguish implementation, CI, and Production evidence.

## Current Atomic Defect — Platform Approval Center — CLOSED / VERIFIED
### Objective
Make the Platform Owner approval-center entry point deterministic and expose the missing explicit request decision control without redesigning the existing onboarding system.

### Root cause
- The overview and CRM entry points depended on imperative navigation from a button, while the user needed a deterministic route into the existing `/admin/onboarding` workspace.
- The approval workspace already had contact and approval infrastructure but did not expose an explicit `Reject request` action even though `lost` is already part of the lead status model.

### Implemented
- `src/routes/admin.tsx`: replaced the approval-center buttons with native `/admin/onboarding` links.
- `src/routes/admin/onboarding.tsx`: added the explicit `رفض الطلب` action using the existing `save("lost")` path; preserved server authorization and onboarding token flow.
- `tests/platform-onboarding-contract.test.mjs`: added regression coverage for native navigation and explicit rejection.

### Verification
- Quality run `34530262325`: SUCCESS.
- Route generation: PASS.
- Typecheck: PASS.
- Tests: PASS — 202/202.
- Lint: PASS.
- Production build: PASS.
- Playwright runtime and Chromium: PASS.
- Browser template QA — all themes: PASS.
- Performance artifact handling: PASS.
- Cleanup: PASS.
- PR #69 merged to `main` as `6ee127cd8f25bfc0cc2efb6ad8e2ab7c622a9323`.

## Release-Only Vercel Policy
Normal release path:

**LOCAL DEVELOPMENT → LOCAL QA → LOCAL BROWSER / VISUAL QA → TESTS → GITHUB ACTIONS QUALITY GATES → DIFF REVIEW → ONE COHERENT RELEASE BATCH → MERGE TO MAIN → ONE VERCEL PRODUCTION DEPLOYMENT → REAL-DEVICE PRODUCTION QA → RECORD RESULT**

- Do not use Vercel for ordinary CSS/theme iteration.
- Do not intentionally trigger repeated Preview/Production deployments.
- CI success is not deployment evidence.
- `DEPLOYED` requires direct Vercel evidence.

## Exact Next TODO
### P2-H2 — Resolve Vercel deployment blocker and reconcile Production identity
1. Resolve the Vercel build-rate-limit / deployment-access blocker.
2. Re-check the existing Production deployment identity against the latest `main` application state after PR #69.
3. If aligned, record `DEPLOYED` and do not redeploy.
4. If not aligned, perform one authorized release deployment through the release-only workflow.
5. Run real-device Production QA after a successful release deployment.
6. Close P2-H2 only after direct Production evidence.

## Continuity Rule
At the end of each atomic task, reconcile current Git/CI/deployment evidence, update continuity and material audit/research/memory records, record exactly one next task, and stop.
