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
- VERIFIED: the latest Platform Owner approval-control fix is merged to `main` as `d11455f5d9a69b12bed4ba7804353065dccfaa2b`.
- VERIFIED: the latest `main` quality run `34534791703` passed route generation, typecheck, tests, lint, production build, Playwright installation, Chromium installation, all-theme browser QA, performance handling, and cleanup.
- VERIFIED: GitHub Vercel status for the latest `main` commit is `success`.

## Manus Continuity Protection
- VERIFIED: `docs/project-memory/manus-engineering-lessons.md` records durable lessons from Manus execution, including security trust-boundary rules, targeted theme verification, structural layering diagnosis, CI-vs-local evidence separation, and Preview-vs-Production deployment distinction.
- VERIFIED: P1-H1, P1-H2, P2-H1, and the Platform Owner approval-control fix did not modify Manus-derived theme/security/product infrastructure.
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
- VERIFIED: the reported defect was reproduced at the UI level: the approval entry returned to the existing Platform Owner page where only the lead list and contact controls were visible.
- VERIFIED: the existing `/admin/onboarding` source contains the full approval workflow, but the deployed user path was not reliably reaching that workspace.
- VERIFIED: the robust fix uses the existing `/admin` Platform Owner route as the deterministic approval entry and opens the `leads` control surface in-place.
- VERIFIED: the existing server-authorized `approveLead` operation is used for `اعتماد وإنشاء رابط التسجيل`.
- VERIFIED: the existing `updateLead` operation is used for `تم التواصل`, `رفض الطلب`, and saving notes; rejection maps to the existing `lost` status model.
- VERIFIED: the control surface displays restaurant, city, contact name, phone, email, status, submitted date, notes, Call, WhatsApp, Email, Approve & create registration link, Contacted, Reject, and Save Notes.
- VERIFIED: no database schema, authentication, RLS, tenant isolation, dependency, or Manus-derived infrastructure was changed.
- VERIFIED: PR #71 merged to `main` as `d11455f5d9a69b12bed4ba7804353065dccfaa2b`.
- VERIFIED: final `main` quality run `34534791703` passed all configured quality stages.
- VERIFIED: GitHub Vercel status for `d11455f5d9a69b12bed4ba7804353065dccfaa2b` is `success`.
- STATUS: `VERIFIED` / merged / Vercel integration successful.

## Current Release / Deployment State
- VERIFIED: latest `main` is `d11455f5d9a69b12bed4ba7804353065dccfaa2b`.
- VERIFIED: GitHub Vercel integration reports `success` for that commit.
- UNKNOWN: direct Vercel Production deployment metadata is not independently available from the repository integration response.
- RULE: do not claim Production = main solely from CI or a public HTTP response when direct deployment metadata is unavailable.

## Exact Current TODO
### Next atomic task — Real-device verification of the Platform Owner approval flow
1. Open the latest deployed application as Platform Owner.
2. Click `فتح مركز الاعتماد`.
3. Verify the page switches to the lead-control surface instead of returning to the overview.
4. Select one lead and verify the full control set is visible.
5. If a real lead is available, execute only one controlled approval and verify the registration-link result.
6. Record the direct-device result and stop.

## Continuity Rule
At the end of every atomic task:
1. reconcile current Git head;
2. verify CI evidence;
3. verify deployment separately when relevant;
4. update `PROJECT_STATE.md`, `PLAN.md`, and `TASKS.md`;
5. update the audit/research/project-memory record when material;
6. record one exact next task;
7. stop.
