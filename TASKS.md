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

## Closed Task Evidence — Platform Approval Center — UPDATED / VERIFIED
- VERIFIED: PR #71 merged to `main` as `d11455f5d9a69b12bed4ba7804353065dccfaa2b`.
- VERIFIED: the reported failure was the approval entry returning to the overview where only the lead list/contact actions were visible.
- VERIFIED: the deterministic fix keeps the Platform Owner inside `/admin` and switches directly to the existing `leads` control surface.
- VERIFIED: selected lead details now expose restaurant, city, contact name, phone, email, status, submitted date, notes, Call, WhatsApp, Email, `تم التواصل`, `رفض الطلب`, `حفظ الملاحظات`, and `اعتماد وإنشاء رابط التسجيل`.
- VERIFIED: approval uses the existing server-authorized `approveLead` operation; rejection uses the existing `lost` lead status through `updateLead`.
- VERIFIED: no database, auth, RLS, tenant isolation, dependency, theme, or Manus infrastructure was changed.
- VERIFIED: final `main` quality run `34534791703` passed route generation, typecheck, tests, lint, production build, Playwright runtime/Chromium, all-theme browser QA, performance handling, and cleanup.
- VERIFIED: GitHub Vercel status for the latest `main` commit is `success`.

## Closed Task Evidence — Registration Link Rendering — CLOSED / VERIFIED
- VERIFIED: PR #73 merged to `main` as `66a4985e2a13c4d77a86ebfd8fa8ce8a6c1fa33f`.
- VERIFIED: `approveLead` already returned `registrationUrl`; the `/admin` lead UI was discarding it and showing only a generic success message.
- VERIFIED: the fix stores the returned URL in local UI state and renders it immediately after successful approval.
- VERIFIED: the UI provides `نسخ الرابط` and `فتح الرابط` actions.
- VERIFIED: the UI explains that the existing registration token is valid for 7 days and single-use.
- VERIFIED: the secret token remains non-persistent; no database schema or authorization boundary changed.
- VERIFIED: GitHub Quality run `34539814074` passed all configured stages.
- VERIFIED: Vercel Production deployment `dpl_AsU4MDSBLvqz19T4ToRDhuesinRh` is `READY` for the same `main` commit.

## Closed Task Evidence — Onboarding Creation Recovery — IN PROGRESS
- VERIFIED: production Vercel runtime logs showed repeated `createRestaurant failed` errors with PostgreSQL error `23505` on `tenants_owner_user_id_uidx`.
- VERIFIED: direct Supabase inspection showed the affected owner had one existing tenant and zero active memberships, proving an interrupted/orphaned onboarding state.
- VERIFIED: the owner uniqueness constraint is intentionally present and must not be weakened.
- IMPLEMENTED: `src/lib/menu/onboarding-recovery.ts` restores the owner membership and canonical `tenant_owner` access role from authenticated server context.
- IMPLEMENTED: `src/routes/onboarding.tsx` recovers before creation and retries once after a failed creation.
- IMPLEMENTED: onboarding wording is business-neutral so cafes and other menu-based businesses are not incorrectly presented as restaurants.
- IMPLEMENTED: focused regression coverage exists in `tests/onboarding-recovery.test.mjs`.
- VERIFIED: no dependency, auth, RLS, tenant isolation, theme, ordering, analytics, approval-center, or Manus infrastructure was changed.
- IN PROGRESS: PR #75 quality run `34542725711`; typecheck, tests, lint, and production build passed, while Playwright runtime/browser stages were still running at the latest check.
- DEPLOYMENT_BLOCKED: Vercel status for the branch reports `Deployment rate limited — retry in 24 hours`; no deployment retry was attempted.

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
- UNKNOWN: some physical-device/accessibility observations remain unavailable in the connector environment.
- BLOCKED: Vercel deployment creation for new branch commits is currently rate-limited; do not retry until the limit clears or a verified account-level resolution is available.

## Exact Next TODO
### Complete verification and release of onboarding creation recovery
1. Wait for PR #75 GitHub `quality` to complete.
2. If the quality gate passes, review the final diff and merge PR #75 to `main`.
3. Verify `main` CI and Vercel status separately.
4. Do not retry Vercel deployment while the current rate limit is active.
5. On the next available Production deployment, run one controlled onboarding attempt using the existing affected account and verify recovery, Studio access, and menu creation.
6. Stop.

## Continuity Rule
At the end of each atomic task, reconcile current Git/CI/deployment evidence, update continuity and material audit/research/memory records, record exactly one next task, and stop.

## 2026-09-11 — Onboarding Creation Recovery Session
- Scope: fix only the production onboarding creation failure and make onboarding wording suitable for non-restaurant menu businesses.
- Root cause: a previous onboarding request left a tenant row without an active owner membership; the next request only checked active membership and attempted a duplicate owner insert, correctly rejected by `tenants_owner_user_id_uidx`.
- Fix: authenticated server-side recovery restores the membership and canonical owner access role; onboarding retries once after recovery.
- Verification evidence: Vercel runtime logs, live Supabase schema/constraint inspection, focused regression test, and PR #75 quality run in progress.
- Deployment status: `DEPLOYMENT_BLOCKED` by Vercel rate limiting; no deployment retry performed.
