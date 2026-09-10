# Menu V3 — Active Plan

## Status
- Status: IN_PROGRESS.
- Repository: `Midosd249/Menu_V3`.
- Canonical branch: `main`.
- Source of truth: `main`.
- Current verified implementation head before this documentation batch: `ccf1cc76d11bfb95eac8dc0971730d62979803fc`.
- Premium Theme System — DONE / VERIFIED / MERGED.
- Essential, Editorial, Noir, Heritage, and Gallery — protected.
- Permanent visual/functional/research quality workflow — DONE / VERIFIED.
- P0 Public Order Hardening — DONE / VERIFIED.
- P1 Production/Continuity Hardening — DONE / VERIFIED for implemented scope.
- P1-H1 package manifest / lockfile reconciliation — CLOSED / VERIFIED.
- P1-H2 main branch protection — CLOSED / VERIFIED.
- P2 Growth & Differentiation — DONE / VERIFIED / DEPLOYED.
- W16 owner-accepted results — CLOSED FOR CURRENT EXECUTION.
- Current active atomic task: P2-H1 analytics no-data UX.

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
- VERIFIED: PR #57 was merged to `main`.
- VERIFIED: merge SHA: `65314826bdb652c541d66071ea9d2401067f35d2`.
- VERIFIED: final PR diff contained only `package-lock.json`; the temporary reconciliation workflow was removed before merge.
- VERIFIED: the final quality gate passed install, route tree generation, typecheck, tests, lint, build, Playwright browser QA, performance baseline, and cleanup.
- VERIFIED: no product/UI/auth/security/theme implementation was changed by P1-H1.
- Evidence: PR #57 and GitHub Actions run `34451068766` for the reconciliation branch.

## P1-H2 Closure Record
- VERIFIED: GitHub ruleset `main-protection` is active (ruleset ID `22744795`).
- VERIFIED: target is the repository default branch (`main`).
- VERIFIED: deletion protection is active.
- VERIFIED: non-fast-forward updates are blocked, preventing force-pushes.
- VERIFIED: Pull Requests are required before merging; required approval count is `0`.
- VERIFIED: required status check `quality` is enforced with strict/up-to-date policy.
- VERIFIED: bypass actor list is empty.
- VERIFIED: no deployment, signed-commit, code-owner, or extra-review requirement was added.
- VERIFIED: this task changed repository governance only; no application code, dependency, theme, auth, database, or product behavior was changed.
- Evidence: direct GitHub ruleset reads on 2026-09-10.

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

## P2-H1 — Analytics No-Data UX
### Objective
Expose Local Visibility readiness independently from analytics event availability while preserving the canonical analytics source and all tenant/branch authorization boundaries.

### Current evidence
- INFERRED: current Local Visibility readiness is hidden when analytics has no events because the analytics content is gated by `hasData`.
- PROPOSED: decouple the readiness presentation from the analytics-event presence gate without inventing metrics or claims.

### Required scope
1. Inspect the current owner analytics source and focused tests.
2. Confirm the `hasData` gate and its authorization boundary.
3. Implement the smallest compatible UX change.
4. Add/update focused regression coverage for zero-event and populated states.
5. Run applicable tests, typecheck, lint, build, and targeted browser/manual checks.
6. Review the final diff and update continuity.

### Acceptance criteria
- Local Visibility readiness remains visible and honest when there are zero analytics events.
- Populated analytics behavior remains unchanged.
- No second analytics event source is introduced.
- No Google ranking, retention, revenue attribution, conversion, or statistical-significance claims are invented.
- Tenant/branch authorization remains fail-closed and unchanged.

## P2-H2 — Production deployment identity reconciliation
- UNKNOWN: current Production deployment identity for the latest documentation-only `main` state until direct Vercel evidence is inspected.
- Do not trigger a deployment merely to satisfy documentation; inspect existing Vercel evidence first when relevant.

## Release-Only Vercel Policy
Normal release path:

**LOCAL DEVELOPMENT → LOCAL QA → LOCAL BROWSER / VISUAL QA → TESTS → GITHUB ACTIONS QUALITY GATES → DIFF REVIEW → ONE COHERENT RELEASE BATCH → MERGE TO MAIN → ONE VERCEL PRODUCTION DEPLOYMENT → REAL-DEVICE PRODUCTION QA → RECORD RESULT**

- Do not use Vercel for ordinary CSS/theme iteration.
- Do not intentionally trigger repeated Preview/Production deployments.
- CI success is not deployment evidence.
- `DEPLOYED` requires direct Vercel evidence.

## Exact Next TODO
### P2-H1 — Analytics no-data UX
1. Read the current owner analytics source and focused tests.
2. Confirm the `hasData` gating path and tenant/branch authorization boundary.
3. Implement the smallest compatible UX change.
4. Add/update focused regression coverage.
5. Run applicable tests, typecheck, lint, build, and targeted browser/manual checks.
6. Review diff and update `PROJECT_STATE.md`, `PLAN.md`, `TASKS.md`, and the session log.
7. Stop after P2-H1.

## Continuity Rule
At the end of each atomic task, reconcile current Git/CI/deployment evidence, update continuity and material audit/research/memory records, record exactly one next task, and stop.
