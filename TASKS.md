# TASKS

## Completed Tasks

### P0 — Public Order Hardening — CLOSED / VERIFIED
- VERIFIED: database-backed public-order rate limiting and idempotency are implemented.
- VERIFIED: server-side product, availability, variant, modifier, quantity, note, tenant, and price validation remains authoritative.

### P1 — Production/Continuity Hardening — CLOSED / VERIFIED
- VERIFIED: P0/P1 security and continuity work is present on the current main line.
- CLOSED: package manifest / lockfile reconciliation for deterministic `npm ci` installation.
- CLOSED: GitHub `main` branch protection / required status checks.
- Evidence: PR #57, quality run `34451068766`, and `main-protection` ruleset `22744795`.

### P2 — Growth & Differentiation — CLOSED / VERIFIED / DEPLOYED
- VERIFIED: advanced analytics storytelling uses the canonical owner analytics source.
- VERIFIED: local visibility readiness uses verified tenant/branch fields only and does not claim Google ranking.
- VERIFIED: experimentation is hypothesis-led and does not invent measured significance.
- VERIFIED: no second analytics event source was introduced.

### W13 — Trust, Security, and Data Ownership — CLOSED / VERIFIED
### P0 — Runtime Public Content Propagation — CLOSED / VERIFIED
### Project Infrastructure Identity — CLOSED / VERIFIED
### W6 — Typography Evidence & Decision — CLOSED / VERIFIED
### W6-01 — Typography Implementation — CLOSED / VERIFIED
### W7 — Color / Surface / Contrast System — CLOSED / VERIFIED
### W8 — Imagery and Art Direction — CLOSED / VERIFIED
### W9 — Motion and Interaction — CLOSED / VERIFIED
### W10 — Accessibility and RTL Quality — CLOSED / VERIFIED
### W11 — SEO, Local Discovery, and Shareability — CLOSED / VERIFIED
### W12-01 — Public Menu Hydration Performance — CLOSED / VERIFIED
### W12-02 — Public Menu Resource & Bundle Efficiency — CLOSED / VERIFIED
### W12-03 — Reliability and Failure-Path Audit — CLOSED / VERIFIED
### W14 — Pricing, Packaging, and Commercial UX — CLOSED / VERIFIED / MERGED
### W15 — Growth, Analytics, and Experimentation — CLOSED / VERIFIED
### W16 — QA, Browser/Device, and Release — CLOSED FOR CURRENT EXECUTION / OWNER-ACCEPTED
### W17-Q — Public Theme Quality Recovery — COMPLETED / MERGED
### Noir Full Refinement — COMPLETED / MERGED
### Gallery Latest Refinement — COMPLETED / VERIFIED

## Closed Task Evidence — P2-H1
### P2-H1 — Analytics no-data UX — CLOSED / VERIFIED
- VERIFIED: PR #59 contains only the analytics route and focused regression test changes.
- VERIFIED: the no-data state keeps its existing message and now renders `VisibilityReadiness` alongside it.
- VERIFIED: populated analytics behavior remains unchanged.
- VERIFIED: the canonical `getOwnerAnalytics` source and tenant/branch authorization boundaries remain unchanged.
- VERIFIED: the regression test covers the zero-event visibility contract.
- VERIFIED: quality run `34454958196` passed route generation, typecheck, 198 tests, lint, production build, Playwright browser QA for all themes, performance handling, and cleanup.
- VERIFIED: no dependency, database, auth, theme, Vercel, or deployment configuration change was made.

## Closed Task Evidence — P1-H1
- VERIFIED: npm regenerated `package-lock.json` from the current `package.json` in GitHub Actions.
- VERIFIED: `npm ci --ignore-scripts --dry-run` passed before commit.
- VERIFIED: PR #57 merged to `main` as `65314826bdb652c541d66071ea9d2401067f35d2`.

## Closed Task Evidence — P1-H2
- VERIFIED: `main-protection` ruleset is active and targets the default branch.
- VERIFIED: deletion and non-fast-forward updates are blocked.
- VERIFIED: pull requests are required and `quality` is required with strict/up-to-date policy.
- VERIFIED: bypass list is empty.

## Closed Task Evidence — P2-H2 Verification Boundary
### P2-H2 — Production deployment identity reconciliation — DEPLOYMENT BLOCKED
- VERIFIED: PR #59 is merged and its application commit is `356b7b68d8765a96fc623098b1f9da062a7c3abd`.
- VERIFIED: GitHub `Vercel` status for that commit is `failure` with a target containing `upgradeToPro=build-rate-limit`.
- VERIFIED: public Vercel menu URLs return HTTP 200, but HTTP 200 is not accepted as deployment identity evidence.
- VERIFIED: connected Vercel deployment-management access returns HTTP 403 for the project/team scope.
- VERIFIED: no deployment side effect was created by the failed deployment-tool invocation.
- Decision: do not claim `DEPLOYED`; Production identity remains UNKNOWN and the task is `DEPLOYMENT_BLOCKED`.

## Closed Task Evidence — Platform Approval Center — CLOSED / VERIFIED
- VERIFIED: PR #69 merged to `main` as `6ee127cd8f25bfc0cc2efb6ad8e2ab7c622a9323`.
- VERIFIED: overview and CRM approval-center entry points use native `/admin/onboarding` links.
- VERIFIED: the approval workspace retains server-side `requirePlatformAdmin` authorization and existing secure onboarding token generation.
- VERIFIED: the approval workspace now exposes explicit contact, approve/create-link, reject, revoke-link, copy-link, and open-link controls.
- VERIFIED: rejection uses the existing `lost` lead status; no new database status or schema was introduced.
- VERIFIED: regression coverage protects the native entry link and rejection action.
- VERIFIED: quality run `34530262325` passed route generation, typecheck, 202 tests, lint, production build, Playwright runtime/Chromium, all-theme browser QA, performance handling, and cleanup.
- VERIFIED: no database schema, auth, RLS, tenant isolation, dependency, Manus theme, or unrelated admin feature was changed.

## Protected Scope
- Essential, Editorial, Noir, Heritage/Taste, and Gallery implementation milestones are protected.
- Shared public-menu behavior, customer actions, authentication, authorization, tenant/branch isolation, routing, migrations, and deployment controls remain protected.
- Quick Add, Item Notes, Cart, canonical public rendering, and customer action surfaces remain protected.
- Do not create a sixth theme as a substitute for product/design strategy.
- Do not repeat Manus-completed work unless a current reproducible defect is proven.

## Permanent Specialist Workflows
- VERIFIED: `docs/agents/design-agent.md` is the Design workflow for significant visual/layout/image/theme/site-consistency work.
- VERIFIED: `docs/agents/research-connected-tools-agent.md` is the repository-first dynamic research workflow.
- VERIFIED: `docs/automatic-specialist-routing.md` is the routing/orchestration contract.
- VERIFIED: `docs/project-memory/manus-engineering-lessons.md` records durable Manus execution lessons.
- All specialist roles are internal AI workflows; the user remains the sole human owner and primary developer.

## UNKNOWN / BLOCKED Register
- BLOCKED: Vercel Production deployment reconciliation is blocked by the observed `build-rate-limit` failure and unavailable direct deployment metadata in the connected Vercel scope.
- UNKNOWN/BLOCKED: some physical-device/accessibility observations remain unavailable in the connector environment.
- No current GitHub branch-protection blocker remains.

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
