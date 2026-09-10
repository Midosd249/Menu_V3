# Menu V3 — Active Plan

## Status
- Status: IN_PROGRESS.
- Repository: `Midosd249/Menu_V3`.
- Canonical branch: `main`.
- Source of truth: `main`.
- Current verified implementation head: `41f2d2cee93f76427f5022ce725db5aa88048dc9`.
- Premium Theme System — DONE / VERIFIED / MERGED.
- Essential, Editorial, Noir, Heritage, and Gallery — protected.
- Permanent visual/functional/research quality workflow — DONE / VERIFIED.
- P0 Public Order Hardening — DONE / VERIFIED.
- P1 Production/Continuity Hardening — DONE for implemented scope.
- P1-H1 package manifest / lockfile reconciliation — CLOSED / VERIFIED.
- P2 Growth & Differentiation — DONE / VERIFIED / DEPLOYED.
- W16 owner-accepted results — CLOSED FOR CURRENT EXECUTION.
- Current active atomic task: P1-H2 main branch protection.

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
- OPEN: `main` branch protection / required status checks.
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
- VERIFIED: PR #57 was merged to `main`.
- VERIFIED: merge SHA: `65314826bdb652c541d66071ea9d2401067f35d2`.
- VERIFIED: final PR diff contained only `package-lock.json`; the temporary reconciliation workflow was removed before merge.
- VERIFIED: the final quality gate passed install, route tree generation, typecheck, tests, lint, build, Playwright browser QA, performance baseline, and cleanup.
- VERIFIED: no product/UI/auth/security/theme implementation was changed by P1-H1.
- Evidence: PR #57 and GitHub Actions run `34451068766` for the reconciliation branch.

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

## P1-H2 — Main Branch Protection
### Objective
Protect `main` with required quality checks and the minimum appropriate branch protection/ruleset configuration without changing application code.

### Direct verification
- VERIFIED: `main` currently reports `protected: false`.
- VERIFIED: required status checks are off.
- VERIFIED: repository rulesets collection is empty (`[]`).
- VERIFIED: the relevant quality check is named `quality`.
- BLOCKED: the installed GitHub connector cannot perform the administration-level branch-protection write; the required endpoint returned HTTP 403 because administration access is not exposed by the managed connection.

### Required scope
1. Owner enables the minimum required protection/status checks for `main`.
2. Require the existing `quality` status check before merging.
3. Require pull requests before merging.
4. Do not allow force-pushes or branch deletion.
5. Re-read and directly verify the resulting state.
6. Record exact rules and evidence.
7. Do not alter application behavior, dependencies, themes, auth, database, or deployment configuration.

### Acceptance criteria
- `main` protection/ruleset state is directly verified after owner configuration.
- The existing `quality` check is required for changes entering `main`.
- No unrelated repository or application changes are introduced.
- Any owner-access limitation is recorded precisely rather than inferred around.

## P2-H1 — Small Analytics UX Improvement
- INFERRED: Local Visibility readiness is currently hidden when analytics has no events because the analytics content is gated by `hasData`.
- PROPOSED: expose the readiness check independently from analytics event availability.
- This is a separate atomic UX task and is not part of P1-H2.

## Release-Only Vercel Policy
Normal release path:

**LOCAL DEVELOPMENT → LOCAL QA → LOCAL BROWSER / VISUAL QA → TESTS → GITHUB ACTIONS QUALITY GATES → DIFF REVIEW → ONE COHERENT RELEASE BATCH → MERGE TO MAIN → ONE VERCEL PRODUCTION DEPLOYMENT → REAL-DEVICE PRODUCTION QA → RECORD RESULT**

- Do not use Vercel for ordinary CSS/theme iteration.
- Do not intentionally trigger repeated Preview/Production deployments.
- CI success is not deployment evidence.
- `DEPLOYED` requires direct Vercel evidence.

## Exact Next TODO
### P1-H2 — GitHub main branch protection
1. Owner enables the documented minimum protection/ruleset for `main`.
2. Re-read the protection/ruleset state directly.
3. Confirm `quality` is required and force-push/delete protections are active.
4. Record the verified result.
5. Close P1-H2 only after direct verification.
6. Do not start P2-H1 automatically.

## Continuity Rule
At the end of each atomic task, reconcile current Git/CI/deployment evidence, update continuity and material audit/research/memory records, record exactly one next task, and stop.
