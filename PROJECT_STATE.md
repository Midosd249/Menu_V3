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
- VERIFIED: Vercel Production deployment `dpl_AsU4MDSBLvqz19T4ToRDhuesinRh` is `READY` and targets `production` for the same `main` commit.
- STATUS: `VERIFIED` / merged / deployed.

## Current Release / Deployment State
- VERIFIED: latest verified historical `main` state in this continuity snapshot is `66a4985e2a13c4d77a86ebfd8fa8ce8a6c1fa33f`.
- VERIFIED: Vercel Production deployment `dpl_AsU4MDSBLvqz19T4ToRDhuesinRh` is `READY` for that historical commit.
- VERIFIED: Production aliases include `menu-v3-kohl.vercel.app` and `menu-v3-midosd2s-projects.vercel.app`.

## Exact Current TODO
### Complete verification and release of the current V5 report center
1. Wait for PR #81 GitHub `quality` to complete.
2. If the quality gate passes, review the final diff and merge PR #81 to `main`.
3. Verify the resulting `main` CI and Vercel status separately.
4. On the next available Production deployment, run one controlled report-center check: open the report, switch 7/30 days, print/save PDF, and verify email handoff without exposing secrets.
5. Stop.

## Continuity Rule
At the end of every atomic task:
1. reconcile current Git head;
2. verify CI evidence;
3. verify deployment separately when relevant;
4. update `PROJECT_STATE.md`, `PLAN.md`, and `TASKS.md`;
5. update the audit/research/project-memory record when material;
6. record one exact next task;
7. stop.

## 2026-09-11 — Menu Intelligence V5 Report Center
- IMPLEMENTED: `src/lib/menu/reports.ts` builds a deterministic localized report from the canonical owner analytics, existing Menu Intelligence, and Growth Advisor.
- IMPLEMENTED: `src/routes/studio/reports.tsx` provides 7/30-day reports, print/save-to-PDF, email handoff, Web Share when supported, and a responsive Arabic/English report surface.
- IMPLEMENTED: Studio navigation exposes Reports on desktop and mobile.
- VERIFIED: no new AI provider, API key, database migration, automatic outbound messaging, auth/RLS, tenant isolation, ordering, pricing, or customer-action contract was introduced.
- VERIFIED: report wording avoids fabricated sales/revenue/conversion claims and does not present the report as a legal compliance certificate.
- STATUS: `IMPLEMENTATION_IN_PROGRESS` pending GitHub Quality and merge.
- DEPLOYMENT: no feature-branch Vercel deployment requested; release-only policy applies.

## 2026-09-11 — AI Provider Routing & Multimodal Fallback
- VERIFIED: PR #89 branch `feat/ai-provider-routing-and-multimodal-fallback` adds a replaceable server-side AI provider boundary without changing the database source-of-truth model.
- VERIFIED: structured routing supports Inception/Mercury, Gemini, Z.AI, OpenRouter, and xKiro with configurable order and Inception key rotation.
- VERIFIED: image/PDF menu extraction no longer requires a hard-coded OpenAI credential; multimodal routing defaults to Gemini → OpenRouter → Z.AI → xKiro.
- VERIFIED: AI output remains schema-validated; existing tenant/user rate limiting and prompt-injection safeguards remain in force.
- VERIFIED: GitHub Quality run `34632139918` passed all configured stages, including route generation, typecheck, 254 tests, lint, production build, Playwright/Chromium, all-theme browser QA, performance handling, and cleanup.
- VERIFIED: no Vercel production deployment was intentionally triggered for this milestone.
- STATUS: `READY_TO_PUSH` on the milestone branch; production status for this new code is `UNKNOWN` until a controlled release.

## Current Exact Next Task — AI Provider Routing Release
1. Review PR #89 final diff against `main`.
2. Merge PR #89 once the branch remains quality-green.
3. Verify the resulting `main` commit and GitHub quality separately.
4. Do not intentionally trigger a Vercel deployment while the existing release condition/rate limit blocks it.
5. On the next permitted production deployment, perform one controlled authenticated AI smoke test for structured output and one image/PDF ingestion test using non-sensitive sample content.
6. Stop; do not start another AI milestone automatically.
