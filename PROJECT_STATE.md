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

## Current Verified Position — 2026-09-11
- VERIFIED: P0 Public Order Hardening is completed and protected.
- VERIFIED: P1-H1 package manifest / lockfile reconciliation is CLOSED on `main`.
- VERIFIED: P1-H2 `main-protection` ruleset is active and directly verified.
- VERIFIED: P2 Growth & Differentiation remains completed and protected.
- VERIFIED: W16 owner-accepted direct-device results remain accepted and are not being reopened.
- VERIFIED: Essential, Editorial, Noir, Heritage/Taste, and Gallery remain protected.
- VERIFIED: Quick Add, Item Notes, Cart, canonical public rendering, authentication/authorization, tenant/branch isolation, and customer action surfaces remain protected.
- VERIFIED: the Platform Owner approval controls remain server-authorized and use the existing lead status model.
- VERIFIED: the registration-link rendering defect is fixed on `main` as `66a4985e2a13c4d77a86ebfd8fa8ce8a6c1fa33f`.
- VERIFIED: GitHub Quality run `34539814074` passed all configured stages, including route generation, typecheck, tests, lint, production build, Playwright/Chromium, all-theme browser QA, performance handling, and cleanup.
- VERIFIED: Vercel Production deployment `dpl_AsU4MDSBLvqz19T4ToRDhuesinRh` is `READY` and targets `production` for the same `main` commit.
- VERIFIED: Production `/admin` serves the updated `admin` bundle containing the registration URL rendering, copy, and open actions.

## Manus Continuity Protection
- VERIFIED: `docs/project-memory/manus-engineering-lessons.md` records durable lessons from Manus execution, including security trust-boundary rules, targeted theme verification, structural layering diagnosis, CI-vs-local evidence separation, and Preview-vs-Production deployment distinction.
- VERIFIED: P1-H1, P1-H2, P2-H1, Platform Owner approval-control work, and the registration-link fix did not modify Manus-derived theme/security/product infrastructure.
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

### Current Atomic Defect — Platform Approval Center — CLOSED / VERIFIED
- VERIFIED: the approval entry now opens the existing `leads` control surface inside the Platform Owner route.
- VERIFIED: the selected lead exposes request details and the existing server-authorized decision controls.
- VERIFIED: the selected lead now renders the one-time registration URL returned by `approveLead` immediately after successful approval.
- VERIFIED: the rendered URL has `نسخ الرابط` and `فتح الرابط` actions and explains the existing 7-day/single-use behavior.
- VERIFIED: the secret token is not persisted to the lead record by this UI change.
- VERIFIED: PR #73 merged to `main` as `66a4985e2a13c4d77a86ebfd8fa8ce8a6c1fa33f`.
- VERIFIED: Quality run `34539814074` passed all configured quality stages.
- VERIFIED: Vercel Production deployment `dpl_AsU4MDSBLvqz19T4ToRDhuesinRh` is `READY` for the same `main` commit.
- STATUS: `VERIFIED` / merged / deployed.

## Current Release / Deployment State
- VERIFIED: latest `main` is `66a4985e2a13c4d77a86ebfd8fa8ce8a6c1fa33f`.
- VERIFIED: Vercel Production deployment `dpl_AsU4MDSBLvqz19T4ToRDhuesinRh` is `READY` and targets `production`.
- VERIFIED: Production aliases include `menu-v3-kohl.vercel.app` and `menu-v3-midosd2s-projects.vercel.app`.
- VERIFIED: production `/admin` returns HTTP 200 and its shipped admin bundle contains the new registration-link UI.

## Exact Current TODO
### Next atomic task — Real-device verification of the completed Platform Owner approval flow
1. Open the latest Production application as Platform Owner.
2. Open `اعتماد العملاء الجدد` / the approval controls.
3. Select one real lead that has not already consumed its onboarding link.
4. Perform one controlled approval.
5. Verify that the generated registration URL is visible, copyable, and opens the public onboarding route.
6. Verify the client onboarding handoff and record the result.
7. Stop.

## Continuity Rule
At the end of every atomic task:
1. reconcile current Git head;
2. verify CI evidence;
3. verify deployment separately when relevant;
4. update `PROJECT_STATE.md`, `PLAN.md`, and `TASKS.md`;
5. update the audit/research/project-memory record when material;
6. record one exact next task;
7. stop.

## 2026-09-11 — Registration Link Rendering Fix
- VERIFIED: root cause was UI state loss: `approveLead` already returned `registrationUrl`, but the `/admin` `Leads` component discarded the returned field and displayed only a generic success message.
- VERIFIED: the fix stores the returned URL in component state and renders it immediately with copy/open actions.
- VERIFIED: the change is limited to `src/routes/admin.tsx` plus focused regression coverage in `tests/platform-onboarding-contract.test.mjs`.
- VERIFIED: no database schema, authentication, RLS, tenant isolation, dependency, theme, or Manus-derived infrastructure changed.
- VERIFIED: Production build completed and Vercel Production is `READY` for `66a4985e2a13c4d77a86ebfd8fa8ce8a6c1fa33f`.

## 2026-09-11 — Onboarding Creation Recovery
- VERIFIED: Production Vercel runtime logs showed `createRestaurant failed` with PostgreSQL error `23505`, duplicate key on `tenants_owner_user_id_uidx`.
- VERIFIED: the affected authenticated user had one existing tenant owned by that user and zero active `tenant_members` rows, proving a partially-created/orphaned onboarding state.
- VERIFIED: the live `menu_v3` schema contains the owner uniqueness index and the canonical `tenant_owner` access-role contract.
- FIXED IN BRANCH: `src/lib/menu/onboarding-recovery.ts` repairs an orphaned owner membership using only authenticated server context and `tenants.owner_user_id`.
- FIXED IN BRANCH: `src/routes/onboarding.tsx` performs recovery before creation and retries once after a failed creation; it also reconciles the canonical `tenant_owner` role.
- FIXED IN BRANCH: onboarding wording is now business-neutral (`منشأتك`, `اسم المنشأة`) so cafes and other menu-based businesses are not incorrectly presented as restaurants.
- VERIFIED: no dependency, auth, RLS, tenant-isolation, theme, ordering, analytics, approval-center, or Manus infrastructure was changed.
- STATUS: `IMPLEMENTATION_IN_PROGRESS`; PR #75 is awaiting the GitHub `quality` gate before merge.
- DEPLOYMENT: `DEPLOYMENT_BLOCKED` for this branch by Vercel's current rate-limit status; no deployment retry was attempted.
- EXACT NEXT TASK: after quality passes, merge PR #75, verify the resulting `main` quality/deployment evidence, then perform one controlled real onboarding attempt using the existing affected account to confirm recovery.
