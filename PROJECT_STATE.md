# PROJECT STATE

## Identity
- Status: IN_PROGRESS.
- Repository: `Midosd249/Menu_V3`.
- Canonical branch: `main`.
- Source of truth: `main`.
- Product: Menu V3, Arabic-first bilingual multi-tenant digital-menu SaaS for restaurants and cafes.

## Canonical Backend Identity
- VERIFIED: Supabase project ref `ublxptcqefujkbeepylc`.
- VERIFIED: canonical database schema `menu_v3`.
- VERIFIED: Menu V3 is separated from legacy application data by schema boundary.
- Canonical infrastructure reference: `docs/project-infrastructure.md`.

## Current Verified Position — 2026-09-10
- VERIFIED: P0 Public Order Hardening is completed and protected.
- VERIFIED: P1-H1 package manifest / lockfile reconciliation is CLOSED on `main`.
- VERIFIED: P1-H2 `main-protection` ruleset is active and directly verified.
- VERIFIED: P2 Growth & Differentiation remains completed and protected.
- VERIFIED: W16 owner-accepted direct-device results remain accepted and are not being reopened.
- VERIFIED: Essential, Editorial, Noir, Heritage/Taste, and Gallery remain protected.
- VERIFIED: Quick Add, Item Notes, Cart, canonical public rendering, authentication/authorization, tenant/branch isolation, and customer action surfaces remain protected.
- VERIFIED: P2-H1 is implemented on PR #59 with a two-file application/test diff and no database/auth/theme/dependency changes.
- VERIFIED: P2-H1 quality run `34454958196` passed route generation, typecheck, 198 tests, lint, production build, Playwright runtime installation, all-theme browser QA, performance artifact handling, and cleanup.
- VERIFIED: P2-H1 preserves the canonical `getOwnerAnalytics` source and the existing populated analytics path; it only makes `VisibilityReadiness` visible alongside the no-data message when analytics events are absent.
- VERIFIED: P2-H2 production deployment identity reconciliation is currently `DEPLOYMENT_BLOCKED`; GitHub reports the `Vercel` status for the latest application commit as `failure` with a Vercel `build-rate-limit` target.
- VERIFIED: the latest `main` documentation closure commit is `32aaae291634fba6219d18d10e9d47c136bb4587`; the application change remains at ancestor `356b7b68d8765a96fc623098b1f9da062a7c3abd`.

## Manus Continuity Protection
- VERIFIED: `docs/project-memory/manus-engineering-lessons.md` records durable lessons from Manus execution, including security trust-boundary rules, targeted theme verification, structural layering diagnosis, CI-vs-local evidence separation, and Preview-vs-Production deployment distinction.
- VERIFIED: P1-H1, P1-H2, and P2-H1 did not modify Manus-derived theme/security/product infrastructure.
- RULE: future tasks must inspect Manus lessons and current Git evidence before touching related areas; no completed Manus work is to be repeated without a proven defect.

## Completed Milestones — Protected
- G1–G7.2 — CLOSED / VERIFIED.
- Premium Theme System — DONE / VERIFIED / MERGED.
- Essential, Editorial, Noir, Heritage, Gallery — protected.
- Visual/Functional Quality System — DONE / VERIFIED / MERGED.
- External Theme Preview QR Mode — DONE / VERIFIED.
- Shared Public Menu Rendering Stabilization — VERIFIED.
- Design Intelligence & Product Experience Research — CLOSED / VERIFIED at planning level.
- Shared Design System Contract — BASELINE ESTABLISHED / VERIFIED.
- Design Agent — DEFINED / VERIFIED as documentation-level workflow.
- Research/Connected-Tools Agent — DEFINED / VERIFIED as internal AI workflow.
- Automatic Specialist Routing — DEFINED / VERIFIED as governance workflow.
- P0-01 Canonical Content & Publishing Model Audit — CLOSED / VERIFIED.
- P0 Public Content Propagation — CLOSED / VERIFIED.
- W6, W6-01, W7, W8, W9, W10, W11, W12-01, W12-02, W12-03, W13 — CLOSED / VERIFIED.
- W14 — CLOSED / VERIFIED / MERGED.
- W15 — CLOSED / VERIFIED.
- W16 — OWNER-ACCEPTED / CLOSED FOR CURRENT EXECUTION; no implementation reopen without reproducible defect evidence.
- W17 Public Pages & Themes Integration — W17-Q recovery COMPLETED / MERGED.
- P0 Public Order Hardening — COMPLETED / VERIFIED.
- P1 Production/Continuity Hardening — COMPLETED / VERIFIED for implemented scope.
- P2 Growth & Differentiation — COMPLETED / VERIFIED / DEPLOYED.

## Release Hygiene Follow-ups
### P1-H2 — main branch protection — CLOSED / VERIFIED
- VERIFIED: GitHub repository ruleset `main-protection` is active.
- VERIFIED: target is the repository default branch (`main`).
- VERIFIED: deletion protection and non-fast-forward protection are active.
- VERIFIED: Pull Requests are required; required approval count is `0`.
- VERIFIED: required status check `quality` is enforced with strict/up-to-date policy.
- VERIFIED: bypass actor list is empty.
- Evidence: ruleset ID `22744795`, directly read from GitHub on 2026-09-10.

### P2-H1 — Analytics no-data UX — CLOSED / VERIFIED / PR #59
- VERIFIED: when analytics has no events, the existing no-data message remains visible and `VisibilityReadiness` is rendered alongside it.
- VERIFIED: populated analytics behavior remains unchanged.
- VERIFIED: readiness continues to use only verified tenant/branch fields and the canonical owner analytics source.
- VERIFIED: no second analytics event source was introduced.
- VERIFIED: focused regression coverage was added.
- VERIFIED: no Google ranking, retention, revenue attribution, conversion, or statistical-significance claims were introduced.
- Evidence: PR #59 and quality run `34454958196`.

### P2-H2 — Production deployment identity reconciliation — DEPLOYMENT BLOCKED
- VERIFIED: `main` application commit under reconciliation is `356b7b68d8765a96fc623098b1f9da062a7c3abd`.
- VERIFIED: GitHub `Vercel` status for that commit is `failure` and its target contains `upgradeToPro=build-rate-limit`.
- UNKNOWN: direct Production deployment commit identity because the connected Vercel deployment-management scope returns HTTP 403.
- RULE: do not claim `DEPLOYED` from public HTTP 200, CI, or Preview evidence.
- RULE: do not repeatedly trigger Vercel deployments to create evidence.

## Current Release / Deployment State
- VERIFIED: P2-H1 implementation and CI are complete.
- VERIFIED: GitHub Vercel integration is currently blocked by a build-rate-limit gate for the reconciled application commit.
- UNKNOWN: exact Production deployment commit identity until direct Vercel deployment metadata becomes accessible.
- STATUS: `DEPLOYMENT_BLOCKED`.

## Exact Current TODO
### P2-H2 — Resolve deployment blocker and reconcile Production identity
1. Resolve the Vercel build-rate-limit / deployment-access blocker.
2. Re-check the existing Production deployment identity against `356b7b68d8765a96fc623098b1f9da062a7c3abd`.
3. If aligned, record `DEPLOYED` and do not redeploy.
4. If not aligned, perform one authorized release deployment through the release-only workflow.
5. Run real-device Production QA after a successful release deployment.
6. Update continuity records and close P2-H2 only after direct evidence.

## Current Atomic Defect — Platform Approval Center — CLOSED / VERIFIED
- VERIFIED: PR #69 merged to `main` as `6ee127cd8f25bfc0cc2efb6ad8e2ab7c622a9323`.
- VERIFIED: the Platform Owner overview and CRM entry points now use a native `/admin/onboarding` link instead of imperative navigation.
- VERIFIED: `/admin/onboarding` exposes the existing server-authorized contact/approval workflow and now includes an explicit `رفض الطلب` action backed by the existing `lost` lead status.
- VERIFIED: no database, auth, RLS, tenant isolation, dependency, or Manus theme infrastructure was changed.
- VERIFIED: quality run `34530262325` passed route generation, typecheck, 202 tests, lint, production build, Playwright runtime installation, Chromium installation, all-theme browser QA, performance artifact handling, and cleanup.
- VERIFIED: the failing intermediate quality run was caused only by a regression-test assertion mistake; the test was corrected and the final quality run passed.
- VERIFIED: Vercel status for the merged application commit is pending while the deployment is being processed.
- STATUS: `PUSHED` / implementation verified; Production deployment must remain separate until direct Vercel evidence is available.

## Continuity Rule
At the end of every atomic task:
1. reconcile current Git head;
2. verify CI evidence;
3. verify deployment separately when relevant;
4. update `PROJECT_STATE.md`, `PLAN.md`, and `TASKS.md`;
5. update the audit/research/project-memory record when material;
6. record one exact next task;
7. stop.
