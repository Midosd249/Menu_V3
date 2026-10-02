# 2026-10-02 — P1.1 Public Menu Cache/Session Decoupling — VERIFIED / PR #351

- VERIFIED: main remains 9e2272f5cf626e0b7a8546f1442ff2172ab473f0; P0.1/P0.2 remain merged and untouched.
- VERIFIED: PR #351 is open against main; final implementation head before this continuity commit is the final P1.1 PR head.
- VERIFIED: public menu GET/SSR no longer resolves or creates anonymous sessions; attribution is a separate POST with private, no-store.
- VERIFIED: public menu routes use public, max-age=0, s-maxage=15, stale-while-revalidate=30; cache identity remains tenant + branch + content revision.
- VERIFIED: last_seen_at updates are throttled to five minutes while tenant binding remains enforced.
- VERIFIED: Quality #2756 and W9 Orders QA #892 passed on the final implementation head.
- VERIFIED: browser/performance CI gates passed where configured.
- PROTECTED: P0.1/P0.2, Order Value Analytics, preparation-time/ETA, image delivery, five themes, auth/RLS, and unrelated migrations were not changed.
- UNKNOWN: production TTFB, DB read/write counters, CDN hit ratio, HTML/SSR payload size, and production LCP before/after.
- BLOCKED: Vercel Preview for the final PR head is VERIFIED / SUCCESS; no Production deployment was attempted.
- IMPLEMENTATION STATUS: PUSHED / VERIFIED / HOLD FOR OWNER MERGE.
- DEPLOYMENT STATUS: NOT_DEPLOYED.

## EXACT NEXT TASK

**P1.2 — Theme Code Splitting**

Before implementation, establish bundle/runtime baselines for the five themes. Do not start P1.3 or deploy automatically.

# 2026-10-02 — P0.2 Closeout + Cross-Chat Handoff — VERIFIED

- VERIFIED: P0.2 PR #349 merged into `main` as `5e2cdf847251f0bc6a8688667a7d3e060e768419`.
- VERIFIED: Quality #2731 and W9 Orders QA #869 passed on the final P0.2 head.
- VERIFIED: PR #350 continuity branch now also has current audit/continuity reconciliation work.
- VERIFIED: PR #350 head `917809310cd0a0c56b09ec8f52e69d52a472456f` currently has successful GitHub Quality #2733, W9 Orders QA #870, and Vercel status.
- VERIFIED: No Production deployment was performed as part of P0.2 or this continuity closeout.
- VERIFIED: P0.1 and P0.2 are closed implementation milestones and must not be reimplemented without new evidence.
- PROTECTED: Order Value Analytics tenant scope, preparation-time system, image delivery, auth/RLS boundaries, and existing theme implementations are not part of P1.1.
- UNKNOWN: authenticated Production browser smoke, physical Android/iOS QA, and production cache/DB/LCP measurements remain outside current GitHub evidence.
- BLOCKED: local shell/test execution is unavailable through the current connector-only execution surface; CI evidence is therefore the available verification source for this documentation closeout.

## CROSS-CHAT HANDOFF — DO NOT LOSE CONTEXT

The next canonical implementation task is exactly:

**P1.1 — Public Menu Cache/Session Decoupling**

Start the next chat by re-reading the repository, not by relying on conversation memory. The required starting point is:

1. verify current `main` HEAD and PR #350 merge state;
2. read `AGENTS.md`, `PROJECT_STATE.md`, `PLAN.md`, `TASKS.md`, `SESSION_PROTOCOL.md`, README, `docs/audits/2026-10-02-comprehensive-architecture-security-performance-audit.md`, `docs/project-memory/problems-learned.md`, and relevant routing/research docs;
3. prove P0.1/P0.2 remain merged before touching code;
4. inspect current public-menu/session/cache code and tests;
5. establish a focused measurement baseline before changing caching;
6. preserve tenant/user isolation and do not introduce shared/CDN caching without evidence;
7. keep this task atomic and stop after verification/documentation.

**P1.1 acceptance criteria:**
- public-menu content caching is separated from anonymous-session attribution;
- `last_seen_at` writes are reduced/stabilized without breaking attribution semantics;
- no cross-user or cross-tenant cache leakage is possible;
- TTFB, DB reads/writes, cache-hit behavior, HTML/SSR payload and LCP are measured before/after where tooling permits;
- no unrelated theme, analytics, auth/RLS, order, preparation-time, or migration work is included;
- Production deployment is not automatic.

**STOP CONDITION FOR THE NEW CHAT:** Do not start P1.2 or any deployment after P1.1. End with exactly one next task recorded in continuity.

# 2026-10-02 — P0.2 Layered Public Order Abuse Protection — MERGED / VERIFIED

- VERIFIED: PR #349 merged into main as 5e2cdf847251f0bc6a8688667a7d3e060e768419.
- VERIFIED: Quality #2731 completed successfully; all quality job steps passed.
- VERIFIED: W9 Orders QA #869 completed successfully.
- VERIFIED: Vercel PR preview for the verified P0.2 head reached READY.
- VERIFIED: P0.2 acceptance criteria are implemented: layered server-issued session + request-IP limits, separate invalid-request throttling, post-validation accepted quota, and server-side tenant/branch authority.
- VERIFIED: P0.1 atomic order/idempotency boundary remains intact.
- VERIFIED: final diff was reviewed before merge; no review threads were pending.
- IMPLEMENTATION STATUS: MERGED / VERIFIED.
- DEPLOYMENT STATUS: NOT_PERFORMED / Production status not established by this merge verification.

## EXACT NEXT TASK

P1.1 — Public Menu Cache/Session Decoupling: measure and then safely separate public-menu content caching from anonymous-session attribution work. Preserve tenant/user isolation and do not introduce shared caching without evidence.

---
# 2026-10-02 — P0.2 Layered Public Order Abuse Protection — IMPLEMENTATION IN PROGRESS

- VERIFIED: current main HEAD is 7bfa8ceafff4340466d776d5410fe455d07d2f15, merging PR #348/P0.1.
- VERIFIED: P0.1 is merged; its audited atomicity defect is resolved in current main.
- VERIFIED: the pre-existing public-order limiter was phone/client-token based and incremented accepted quota before full business validation.
- IMPLEMENTATION_IN_PROGRESS: P0.2 adds server-issued anonymous-session + request-IP layered limits, separate invalid-request throttling, and moves accepted quota consumption after full business validation while preserving server-side tenant/branch authority and P0.1 transactionality.
- UNKNOWN: GitHub Quality/W9 results until the implementation PR completes.
- BLOCKED: local command execution is unavailable in the connector-only environment.
- DEPLOYMENT STATUS: NOT_REQUESTED / NOT_PERFORMED.

## EXACT NEXT TASK

Open and verify the P0.2 implementation PR through GitHub Quality/W9, review the final diff, then hold for controlled merge. Do not deploy automatically.

---

# 2026-10-02 — Order Value Analytics Tenant Scope — MERGED / DEPLOYED / VERIFIED
- VERIFIED: Production data for `مقهى زهر النعناع` contains 3 eligible SAR orders for the current Asia/Riyadh day totaling 265 SAR; the latest eligible order is inside the day boundary.
- VERIFIED: root cause of the empty analytics observation was multi-tenant scope resolution: the authenticated account has multiple active tenant memberships, while the previous Order Value Analytics handler resolved the earliest membership when no tenant was explicitly selected.
- VERIFIED: PR #345 adds server-authorized tenant discovery, explicit tenant selection, selected-tenant branch scope, and server-side membership/analytics.read validation.
- VERIFIED: Quality run `36961095902` passed all configured gates; W9 Orders QA run `36961095916` passed.
- VERIFIED: PR #345 merged to `main` as `e7a2d42660d2b563cc473b6845236d89de61025f`.
- VERIFIED: Vercel Production deployment `dpl_6wCbjhxQJyZ8RKicBs7mhEX1Jvo2` is READY and serves `main` commit `e7a2d42660d2b563cc473b6845236d89de61025f`.
- VERIFIED: Production `/studio/analytics` returns HTTP 200; the checked 10-minute production error/warning window has no logs.
- UNKNOWN: an authenticated browser session for the owner was not available to independently click the tenant selector and visually confirm the 265 SAR result in the live UI.
- IMPLEMENTATION STATUS: MERGED / VERIFIED.
- DEPLOYMENT STATUS: DEPLOYED / VERIFIED.

## EXACT NEXT ACTION

Owner performs one authenticated Production smoke on `/studio/analytics`: select `مقهى زهر النعناع` → `اليوم` → `كل الفروع` and confirm `265 SAR`, `3 orders`, and approximately `88.33 SAR` average. If that live UI check fails, return the visible error/state for the next scoped diagnostic; otherwise stop.

---
# 2026-10-02 — Preparation Time + Estimated Ready Time — VERIFIED / MERGED
- VERIFIED: PR #339 is merged; its three-file scope is documentation-only (PROJECT_STATE.md, PLAN.md, TASKS.md) and contains no runtime/application changes.
- UNKNOWN: direct real-device Production QA evidence is not established by the current GitHub evidence.

- VERIFIED: preparation-time feature is on the current release branch and passed final GitHub Quality and W9 Orders QA.
- VERIFIED: commit `3d19e408a3d6212cb6d95bf0d1bfa163de41e81d` contains the feature on top of the security-remediated current main.
- VERIFIED: preparation duration is server-validated to 1–120 whole minutes with presets 3/5/10/15/20/30.
- VERIFIED: server-derived ETA, atomic status/audit persistence, tenant/branch authorization, row locking, and compare-and-set concurrency protection are preserved.
- VERIFIED: legacy null preparation fields remain readable and no automatic `ready` transition exists.
- VERIFIED: final Quality run `36932980800` passed; final W9 Orders QA run `36932980956` passed.
- VERIFIED: Vercel Preview passed for the final feature head.
- DEPLOYMENT STATUS: DEPLOYED / VERIFIED.
- VERIFIED: Production deployment `dpl_58LkHc6RByWjfSnzFwNitsvbytgu` is READY and targets `production`.
- VERIFIED: the runtime Production deployment `dpl_58LkHc6RByWjfSnzFwNitsvbytgu` is READY and serves release commit `ed995f264c0c821eeafade563c250c374f19f88f`. The subsequent continuity PRs (#339, #340, and this closeout) are documentation-only; Production therefore intentionally remains on the verified runtime release while `main` carries only continuity-documentation changes.

## EXACT NEXT TASK

No further implementation work for this feature. Wait for the next explicitly scoped task.

---
# 2026-10-01 — Safe Order Lifecycle Enforcement — PR #333 / CI REPAIR IN PROGRESS

- VERIFIED: `main` is `96402b5eda86ba6531afa48e93a0e8852572101b`; PR #333 is open, targets `main`, and the previous branch head was `cb3f3d218b309b859ce9f407412edcbbe789f25a`.
- VERIFIED: the PR remains unmerged and outside `main`.
- VERIFIED: the scoped changed files remain exactly `PROJECT_STATE.md`, `TASKS.md`, `package.json`, `src/lib/menu/order-lifecycle.test.ts`, `src/lib/menu/orders.ts`, and `src/lib/menu/platform.ts`.
- VERIFIED: legal transitions remain `new -> confirmed/cancelled`, `confirmed -> preparing/cancelled`, `preparing -> ready/cancelled`, `ready -> completed/cancelled`; `completed` and `cancelled` remain terminal; same-status remains allowed without a new audit event.
- VERIFIED: order and platform mutation paths retain server-side authentication/authorization boundaries and use row locking with atomic audit insertion.
- VERIFIED: existing lifecycle migrations and database trigger were not changed; sound, status colors/icons, WhatsApp, polling, payment, public ordering, and production configuration remain outside scope.
- VERIFIED: the GitHub `Vercel` status for the previous head is `success`, and the latest Vercel PR comment reports the Preview as `Ready`.
- VERIFIED: Quality run #2660 and W9 Orders QA run #813 failed on the previous head because `src/lib/menu/order-lifecycle.test.ts` contained an invalid literal `\n` sequence.
- FIXING: the test-only syntax defect and its concurrency-source assertion are being corrected without changing production behavior.
- UNKNOWN: CI results for the new head until the workflows complete.
- UNKNOWN: local command execution is unavailable in the connector-only environment.
- DEPLOYMENT STATUS: no Production deployment was performed.

## EXACT NEXT TASK

Verify Quality/W9 on the repaired head. If all applicable gates pass, review the final diff and hold for owner merge authorization. Do not merge or deploy automatically.
---

# 2026-10-01 — Safe Order Lifecycle Enforcement — PR #333 / VERIFICATION PENDING

- VERIFIED: implementation branch is `feat/safe-order-lifecycle-enforcement`, based directly on `main` SHA `96402b5eda86ba6531afa48e93a0e8852572101b`.
- VERIFIED: PR #333 targets `main`, is open, not merged, and currently contains the scoped lifecycle implementation.
- VERIFIED: legal transitions remain `new -> confirmed/cancelled`, `confirmed -> preparing/cancelled`, `preparing -> ready/cancelled`, `ready -> completed/cancelled`; `completed` and `cancelled` remain terminal.
- VERIFIED: same-status requests remain accepted and do not create audit events.
- VERIFIED: authorization remains behind `authMiddleware` and `assertOrderAccess`; Platform Admin status updates retain `authMiddleware` and `assertPlatformAdmin`.
- VERIFIED: status mutation and audit insertion are now one concurrency-safe SQL operation using row locking; accepted changes create one event, while rejected changes create none.
- VERIFIED: existing database transition trigger and migrations were not modified.
- VERIFIED: safe domain errors are returned for invalid lifecycle transitions; concurrent status changes return a safe conflict error.
- VERIFIED: no sound subsystem, status colors/icons, WhatsApp behavior, production configuration, or real orders were changed.
- VERIFIED: current PR diff is limited to `package.json`, `src/lib/menu/order-lifecycle.test.ts`, `src/lib/menu/orders.ts`, and `src/lib/menu/platform.ts`.
- IN_PROGRESS: GitHub Quality and W9 Orders workflows were triggered for PR #333; current visible runs are still in progress and final results for the latest branch HEAD are not yet verified.
- UNKNOWN: local command execution is unavailable in the connector-only environment.
- DEPLOYMENT STATUS: NOT DEPLOYED. An automatic Vercel PR/preview status was observed as pending; no Production deployment was requested or performed by this task.

## EXACT NEXT TASK

Owner reviews the final PR #333 CI results for the latest head `b21110321f22ae03fe0a304127c4f3b2cf94a6f2`; if all applicable gates pass, owner decides whether to merge. Do not merge or deploy automatically.


# 2026-09-30 — Mazaq badge fix + branch-scoped menu ordering — PR #327 / READY FOR OWNER REVIEW

- VERIFIED: current main HEAD at task start is 4f53e397fac357b7dcada23d6a3e069d8fc64aa7.
- VERIFIED: PR #327 is open, mergeable, not merged, and targets main; head is 31f7fa4e84a5ab3053d3a8210bed26b12f632d09.
- VERIFIED: Part A changed only the Taste/Mazaq template path and its regression contract; no other theme template was changed.
- VERIFIED: Part B adds branch-scoped ordering overrides for categories and products, Studio up/down controls, server-side tenant/branch authorization, and public-menu ordering by saved branch order with fallback to existing sort_order.
- VERIFIED: GitHub Quality run #2596 passed typecheck, tests, lint, production build, all-theme browser QA, Menuun brand browser QA, performance, Studio browser QA, and Platform Admin browser QA.
- VERIFIED: W9 Orders QA #754 passed.
- VERIFIED: Vercel PR preview status is success; this is preview evidence only, not Production deployment evidence.
- UNKNOWN: direct physical-device interaction with the new ordering controls was not performed in this session.
- IMPLEMENTATION STATUS: VERIFIED via CI repository execution evidence; READY_TO_PUSH / pushed to PR branch.
- DEPLOYMENT STATUS: NOT_DEPLOYED / HOLD FOR OWNER REVIEW.

## EXACT NEXT TASK

Owner reviews PR #327. Do not merge or deploy automatically. After approval, perform the normal controlled release workflow; Part C remains plan-only until explicitly approved.

---
# 2026-09-30 — Menuun Platform Attribution — CLOSED / VERIFIED / DEPLOYED

- VERIFIED: PR #324 merged the Menuun platform-attribution implementation at `78550457a7ba7e2c23f2190856c1fb5c8cf71c3e`.
- VERIFIED: GitHub Quality #2590 and W9 Orders QA #751 passed.
- VERIFIED: implementation deployment `dpl_APMeXne3rQkaVa9VtjDuHYMpSpW4` was READY.
- VERIFIED: continuity deployment `dpl_8io82PjFjwhrLYVdKSVLZ9G3EQWB` was READY for the final `main` continuity state.
- VERIFIED: Production aliases include `www.menuun.com` and `menuun.com`.
- VERIFIED: no runtime errors were found in the checked 30-minute post-deployment window.
- VERIFIED: public-menu attribution and Studio Menuun identity are deployed; restaurant tenant branding remains separate.
- UNKNOWN: direct physical Android/iOS rendering evidence for the new footer.
- IMPLEMENTATION STATUS: DONE.
- DEPLOYMENT STATUS: DEPLOYED / VERIFIED.

## EXACT NEXT TASK

No further work for this atomic task. Wait for the next explicitly scoped task.

- VERIFIED: current `main` HEAD is `78550457a7ba7e2c23f2190856c1fb5c8cf71c3e`.
- VERIFIED: PR #324 merged the Menuun platform-attribution implementation.
- VERIFIED: GitHub Quality #2590 and W9 Orders QA #751 passed.
- VERIFIED: Vercel Production `dpl_APMeXne3rQkaVa9VtjDuHYMpSpW4` is READY and targets production.
- VERIFIED: Production == `main` HEAD exactly.
- VERIFIED: Production aliases include `www.menuun.com` and `menuun.com`.
- VERIFIED: no runtime errors were found in the checked 30-minute post-deployment window.
- VERIFIED: public-menu attribution and Studio Menuun identity are deployed; restaurant tenant branding remains separate.
- UNKNOWN: direct physical Android/iOS rendering evidence for the new footer.
- IMPLEMENTATION STATUS: DONE.
- DEPLOYMENT STATUS: DEPLOYED / VERIFIED.

## EXACT NEXT TASK

No further work for this atomic task. Wait for the next explicitly scoped task.

- VERIFIED: canonical `main` is `2e38263dfdc5d73a3e21f97fe029bf5fdd2d22cd`.
- VERIFIED: Menuun production logo assets and the existing platform-brand component are already present on `main`; tenant-specific `logoUrl` remains separate.
- VERIFIED: the supplied mobile screenshot shows a compact dark footer attribution pattern with a platform logo and a short "مقدم من" label.
- PROPOSED: add a shared Menuun platform-attribution footer to every public-menu render, using the existing production logo on a restrained charcoal strip and keeping it outside restaurant identity/actions.
- PROPOSED: surface the existing Menuun logo in the customer Studio shell sidebar and mobile header without changing tenant branding.
- UNKNOWN: real-device/browser visual rendering of the new attribution on all five theme families until the repository browser QA runs.
- DEPLOYMENT STATUS: NOT_REQUESTED / NOT_PERFORMED.

## EXACT NEXT TASK

Run the repository quality/browser gates for the attribution change, review the final diff, and only then prepare the controlled merge/release decision. Do not deploy automatically.
# 2026-09-25 — Unified Order Receipt Preview — READY FOR REVIEW

- VERIFIED: PR #303 `feat(orders): unify receipt preview and printing` is open against `main`.
- VERIFIED: PR #303 head is `61065efc2d64f7c60e236dc7f681460241616aa3`.
- VERIFIED: The shared `OrderReceiptButton` / `ReceiptView` now provides one receipt presentation for Studio and public-menu flows.
- VERIFIED: The Studio/owner flow opens a professional on-screen receipt preview before printing.
- VERIFIED: Printed output remains isolated to the receipt portal at 80mm and keeps the dynamic `Receipt-{orderNumber}` title lifecycle.
- VERIFIED: Arabic receipt dates explicitly use the Gregorian calendar.
- VERIFIED: Receipt content excludes customer notes, customer contact actions, workflow/status controls, and source metadata.
- VERIFIED: VAT registration is optional metadata only; no VAT amount is invented.
- VERIFIED: GitHub Quality completed successfully on head `61065efc2d64f7c60e236dc7f681460241616aa3`.
- VERIFIED: W9 Orders QA completed successfully on the same head.
- UNKNOWN: Physical printer output on a real 57mm/80mm printer has not been directly observed.
- BLOCKED: Vercel preview deployment is constrained by the current account deployment-rate limit; no retry was performed.
- DEPLOYMENT: NOT DEPLOYED. Production remains on the previously verified receipt-print deployment.
- EXACT NEXT TASK: Owner reviews PR #303 and authorizes merge/release if accepted; do not merge or deploy automatically.
# 2026-09-25 — Order Receipt Print Isolation — MERGED / DEPLOYED

- VERIFIED: PR #301 `fix(orders): isolate receipt print output` passed the full GitHub Quality run #2476, including all-theme browser QA, golden performance fixture, Studio browser QA, Platform Admin browser QA, performance evidence upload, and cleanup.
- VERIFIED: GitHub W9 Orders QA #658 passed.
- VERIFIED: PR #301 was squash-merged into `main` as `027d765a11a7e6bf8e40468ea79ac7c3c5eda2de`.
- VERIFIED: canonical `main` HEAD at deployment time is `027d765a11a7e6bf8e40468ea79ac7c3c5eda2de`.
- VERIFIED: Vercel Production deployment `dpl_7G9JMXYrdCXkQaDTZ7dtjVeBbHZh` reached READY for target `production`.
- VERIFIED: Vercel deployment commit is `027d765a11a7e6bf8e40468ea79ac7c3c5eda2de`, exactly matching `main` HEAD at deployment time.
- VERIFIED: deployment source is Git and the Production aliases were assigned successfully.
- VERIFIED: no build-rate-limit retry was required; the post-merge Git-connected Production deployment completed successfully.
- VERIFIED: receipt print isolation remains limited to the scoped receipt output: business identity/logo, branch, order number, Gregorian date/time, itemized lines, subtotal, optional VAT registration metadata, total, and the existing bilingual informal-receipt disclaimer.
- VERIFIED: customer/contact controls, notes, internal workflow/status controls, and source metadata are excluded from the printed output.
- VERIFIED: dynamic print title is `Receipt-{orderNumber}` and is restored after printing.
- UNKNOWN: real-device physical printer output was not captured in this release session; CI/browser evidence and the implemented print structure are the verified evidence.
- DEPLOYMENT STATUS: **DEPLOYED / VERIFIED**.
- IMPLEMENTATION STATUS: **MERGED / VERIFIED**.

## EXACT NEXT TASK

**No further receipt-print work is authorized. Stop and wait for the next explicitly scoped task. Do not redo, redesign, or redeploy this receipt scope unless new evidence requires it.**

---

# CURRENT VERIFIED POSITION — 2026-09-25 — ORDER RECEIPT PART CLOSED

- VERIFIED: PR #298 `feat(orders): add informal customer receipts` is merged into `main`.
- VERIFIED: merge commit is `a6f9ff63a360cdb65d5c831b46659829cf512e57`.
- VERIFIED: `main` contains PR #298 merge commit `a6f9ff63a360cdb65d5c831b46659829cf512e57`; the current continuity documentation merge commit is `c87a6f0e6a57cd9e79a4b2ac19918399d5275a2e`.
- VERIFIED: Pre-merge Quality #2470 and W9 Orders QA #655 passed on final implementation HEAD `25a1c75b6911c9c49a503e4e5bd9453f4142366e`.
- VERIFIED: staff receipt access is server-authorized and branch-scoped; guest receipt access is bound to the server-controlled anonymous session.
- VERIFIED: first-order anonymous-session binding was fixed and covered by contract tests.
- VERIFIED: receipt uses existing `orders`/`order_items` data; no receipt ledger/table was added.
- VERIFIED: optional tenant VAT registration metadata was added; no tax amount is invented.
- VERIFIED: no payment processing, payment-status claim, ZATCA integration, or automated e-invoicing was introduced.
- VERIFIED: PR #297 remains merged at `66e0a21ad19ea0fb15acd81582792f3f10d02753`.
- UNKNOWN: post-merge GitHub Actions runs for the squash merge commit are not exposed by the PR-triggered workflow lookup; pre-merge quality gates are the verified CI evidence.
- UNKNOWN: Production deployment of this merged change. No Production deployment was performed by this task.

## EXACT NEXT TASK

**No further implementation work for the order-receipt task. Treat PR #298 and this receipt scope as CLOSED. Do not redo, redesign, or redeploy this scope unless a new explicit task provides new evidence.**

---

# CURRENT VERIFIED AI POSITION — 2026-09-24 — PHASE 6 CLOSED / VERIFIED / MERGED


# 2026-09-25 — Supabase Security Hardening — IMPLEMENTED / VERIFIED / PR #295 OPEN

- VERIFIED: current canonical `main` at task start was `1f70da5046efa43712cffe29b85610f18524a35d`.
- VERIFIED: live Supabase Security Advisor initially reported the mutable `menu_v3.sync_guest_profile_from_order` search_path warning and leaked-password-protection warning; the seven previously reported tables were already RLS-enabled and default-deny with no `anon`/`authenticated` table grants.
- VERIFIED: live SQL confirmed all seven tables have RLS enabled, zero `anon`/`authenticated` SELECT/INSERT table privileges, and no pre-existing policies.
- VERIFIED: live migration `security_rls_and_search_path_hardening` applied successfully.
- VERIFIED: live advisor after the migration no longer reports any of the seven tables or the mutable function search_path. The remaining Security Advisor finding is only Auth leaked-password protection disabled; 33 unrelated RLS-enabled/no-policy INFO findings remain outside this scoped task.
- VERIFIED: explicit restrictive deny policies were added for `anon`/`authenticated` on the seven server-only tables; server-side PostgreSQL access remains the application's actual DB path via `getSql()`.
- VERIFIED: function `menu_v3.sync_guest_profile_from_order()` now has `search_path=menu_v3, pg_catalog`.
- VERIFIED: GitHub Quality #2424 passed typecheck, `npm test`, lint, build, all-theme browser QA, Studio/Customers browser QA, and Platform Admin browser QA.
- VERIFIED: GitHub W9 Orders QA #611 passed the order browser suite.
- UNKNOWN: `npm run test:platform` was not a separately executed CI command in the existing workflows.
- UNKNOWN: `npm run check:auth` was not separately executed; its script requires a live dev server observation.
- BLOCKED: leaked-password protection still requires the hosted Supabase Auth setting; the available Supabase MCP actions do not expose Auth security configuration. Supabase documents this under project Auth settings. 
- VERIFIED: PR #295 is open at `d37eed14348b9ca86f2061cc30adbad57b277f2e`; no Production deployment was manually performed or authorized by this task.

## EXACT NEXT ACTION

**Enable Supabase Auth leaked-password protection in the project's Auth settings, then re-run Security Advisor once and confirm the Auth warning is gone. Do not merge/deploy PR #295 automatically in this task.**


- VERIFIED: canonical `main` HEAD before this continuity commit is `2dc9f7322b454625a6904c5838e7f016ecc4fe19`.
- VERIFIED: PR #285 capability-aware routing is merged at `99dfd0c5b83baff890eecb89971ea2d0056e351e`.
- VERIFIED: PR #286 Phase 6 continuity closure is merged at `2dc9f7322b454625a6904c5838e7f016ecc4fe19`.
- VERIFIED: `docs/ai-phase6-closure-2026-09-24.md` is present on `main`.
- VERIFIED: GitHub Quality `35966976169` and W9 Orders QA `35966976170` passed for Phase 6.
- VERIFIED: TypeSafe/Jev remains `runtimeEligible:false` and is not activated or added as a generic fallback.
- VERIFIED: no provider rebuild, Smart Menu Import change, database/auth/RLS/subscription/tenant/branch change, or public-menu/performance change was introduced by Phase 6.
- VERIFIED: no Production deployment was requested for Phase 6.
- UNKNOWN: authenticated live TypeSafe/Jev API behavior, quota, and latency.
- BLOCKED: TypeSafe activation until one authenticated smoke and the activation review are completed.
- UNKNOWN: whether the current `main` commit is the Production deployment identity.
- DEPLOYMENT STATUS: NOT_REQUESTED / NOT_PERFORMED for Phase 6.

## EXACT NEXT TASK

**Run exactly one authenticated TypeSafe/Jev smoke on an authorized runtime using the configured TypeSafe credential, record the real response/failure evidence, and keep `runtimeEligible:false` until the activation review is complete.**

Do not start another provider implementation, deployment, redesign, or unrelated cleanup before that task is explicitly authorized.

# CURRENT VERIFIED RELEASE POSITION — 2026-09-22 — PHASE 8 CLOSED / VERIFIED

- VERIFIED: owner completed the physical Android/iOS/QR production preview and confirmed the image-performance remediation is functioning correctly.
- VERIFIED: Phase 0–7 were already CLOSED; no runtime reimplementation was required.
- VERIFIED: Production deployment `dpl_2Ypk1yKSpW4JBMMR5DjkTq2uyZqp` is READY and targets production.
- VERIFIED: deployed Production commit was `488b982e93185caf6908d4b7bf56699952f65463`.
- VERIFIED: GitHub Quality/W9 evidence passed for the release closeout.
- VERIFIED: production root returned HTTP 200 with Arabic RTL output and no selected last-24-hour runtime error clusters.
- VERIFIED: owner physical preview found no blocking regression in the tested production experience.
- UNKNOWN: no additional device-side numeric LCP/waterfall measurements were captured as structured repository artifacts.
- Deployment status: DEPLOYED / VERIFIED.
- Implementation status: DONE.

## EXACT NEXT TASK

**No further work is authorized for this remediation. Phase 0–8 are CLOSED. Stop and wait for the next explicitly scoped task.**

# CURRENT PERFORMANCE REMEDIATION POSITION — 2026-09-22

- VERIFIED: canonical `main` HEAD is `99a526dc875c1ad5bf50367632f78108681454af`.
- VERIFIED: Phase 0 Evidence Lock — CLOSED.
- VERIFIED: Phase 1 Shared Image Delivery — COMPLETE / MERGED.
- VERIFIED: Phase 2 Responsive Public Media — COMPLETE / MERGED.
- VERIFIED: Phase 3 Branding / Cover Decoupling — COMPLETE / MERGED.
- VERIFIED: Phase 4 Featured Presentation Bound — COMPLETE / MERGED.
- VERIFIED: Phase 5 Public HTML / SSR Payload Reduction — COMPLETE / MERGED.
- VERIFIED: Phase 5 core merge is `45552759054f11b4b37a89caacf73c795040a955`; Phase 5 evidence instrumentation is `99a526dc875c1ad5bf50367632f78108681454af`.
- VERIFIED: Quality #2297 passed for the Phase 5 implementation; W9 Orders QA #512 passed.
- VERIFIED: Quality #2299 passed for the Phase 5 SSR document-metrics instrumentation; W9 Orders QA #518 passed.
- VERIFIED: public loader no longer serializes whole tenant/branch/category/product rows via `to_jsonb(table)`; it uses explicit public projections.
- VERIFIED: public tenant lifecycle fields not required by the browser are no longer returned in `PublicTenant`.
- VERIFIED: empty `productOptions` entries are no longer created for every product. A 30-product empty-options structural payload drops from 1,411 bytes to 2 bytes, a measured 1,409-byte reduction before HTML/script overhead.
- VERIFIED: the existing SSR `initialMenu` hydration path remains intact; no new duplicate public-menu fetch was introduced.
- VERIFIED: the performance audit now records document transfer, encoded response, and decoded/uncompressed document bytes.
- VERIFIED: CI G6 audit for the existing Editorial theme-preview fixture at 390×844 recorded document transfer 7,805 bytes, encoded 7,505 bytes, decoded 7,505 bytes. This is a CI fixture, not the real 30-item customer reproduction.
- UNKNOWN: direct post-change HTML size/LCP/waterfall for the real `saudi-shopping-world` tenant because Phase 5 was not deployed to Production and the CI fixture is not that tenant.
- UNKNOWN: physical Android/iOS/QR waterfall and LCP.
- Deployment status: NOT_PERFORMED.

## EXACT NEXT TASK

**Phase 6 — Golden Performance Fixture.**

Create a deterministic, repository-owned 30-item public-menu fixture matching the real performance characteristics needed for this remediation, then use the Phase 5 document metrics to establish repeatable HTML/document-transfer/image-request baselines. Do not re-implement Phase 1–5 unless the fixture proves a regression.


## Current Performance Remediation Position — 2026-09-22

- VERIFIED: canonical `main` HEAD is `93c2d8a7f4524986346f4439b5f829cb51308a95`.
- VERIFIED: Phase 1 and Phase 2 are complete and must not be reimplemented.
- VERIFIED: Phase 3 is complete / merged as `fb4c5dba311d5f77c3bcb943f13e35cb92ab8584`.
- VERIFIED: Phase 4 is complete / merged as `aa1ac6ba942228e8ad2e32f6c76b485b4706ea78`.
- VERIFIED: Phase 4 uses a shared six-item Featured presentation bound across protected public renderer families.
- VERIFIED: Quality #2282 passed; W9 Orders QA #507 passed.
- VERIFIED: no tenant data, schema, auth/RLS, order, pricing, subscription, or deployment configuration was changed by Phase 4.
- VERIFIED: no Production deployment was performed.
- UNKNOWN: real-device waterfall/LCP and Production performance for the 30-item golden tenant.

### Exact Next Task

**Phase 5 — Public HTML / SSR Payload Reduction for the 30-item `saudi-shopping-world` golden case.**

Do not repeat Phase 1–4. Measure current HTML/SSR payload first and make only evidence-backed reductions.


# PROJECT STATE

## Identity
- Status: RELEASE_STAGE_VERIFIED_WITH_DEVICE_QA_PENDING.
- Repository: `Midosd249/Menu_V3`.
- Canonical branch: `main`.
- Source of truth: `main`.
- Product: Menu V3, Arabic-first bilingual multi-tenant digital-menu SaaS for restaurants and cafes.

## Current Verified Position — 2026-09-22
- VERIFIED: canonical `main` HEAD is `b5e5e0f7fa000b1451b605e2fb9b484cde690170`.
- VERIFIED: Phase 4 runtime merge is `aa1ac6ba942228e8ad2e32f6c76b485b4706ea78`.
- VERIFIED: Phase 4 Quality #2282 passed; W9 Orders QA #507 passed.
- VERIFIED: Phase 4 continuity documentation is merged in current `main`.
- VERIFIED: no Production deployment was performed for Phase 4.
- UNKNOWN: current Production identity/performance and real-device waterfall/LCP for the 30-item golden tenant.
- VERIFIED: the seven audited server-only tables remain RLS-enabled with no client policies and server-side access verified.
- UNKNOWN: physical Android/iOS/QR/device QA for current `main`.
- REMAINING SECURITY WARNINGS: one mutable function `search_path` warning and one Auth leaked-password-protection warning remain separate scoped findings.

## Current Release Boundary
Production identity and basic HTTP/runtime release verification are now closed for current `main`. Physical Android/iOS/QR/device QA is the only active release-stage evidence gap. Separate Supabase warnings are documented and are not silently changed.

## Current Verified Position — 2026-09-20
- VERIFIED: GitHub `main` is now at `be7b79e5dec7d569aed1828e4376f57a8cbf9507` after merged PR #223.
- VERIFIED: PR #223 `redesign: replace Editorial with Canva-derived Canvas menu` was merged with squash after GitHub Quality and W9 Orders browser checks passed.
- VERIFIED: Quality run for PR #223 passed route generation, typecheck, full tests, W7.4–W7.10 contracts, lint, production build, Playwright installation, all-theme browser QA, Studio browser QA, Platform Admin/W7.10 browser QA, performance diagnostics, and cleanup.
- VERIFIED: W9 Orders browser QA for PR #223 passed.
- VERIFIED: the previous Editorial/Atelier presentation was replaced rather than incrementally patched.
- VERIFIED: the new Editorial Canvas system is data-driven and preserves tenant/branch data, search, category filtering, product details/options, cart/order, analytics, bilingual routing, and existing server-side trust boundaries.
- VERIFIED: `src/theme-editorial-atelier.css` was retired and replaced by `src/theme-editorial-canvas.css`.
- VERIFIED: Editorial now uses the owner-supplied warm-paper/ink/lime/copper visual direction, with mobile-safe product geometry and explicit Arabic/LTR wrapping rules.
- UNKNOWN: physical Android/iOS rendering and QR camera evidence for this newly merged theme.
- UNKNOWN: current Production deployment identity for `be7b79e5dec7d569aed1828e4376f57a8cbf9507`; no Production deployment was requested or performed in this task.

## PH Lifecycle — Completed

PH-01 through PH-06 are completed historical milestones. No additional PH milestone is currently defined.

## PH-01 — Self-Serve Customer Lifecycle — CLOSED / VERIFIED / MERGED
PR: #170
Merge commit: `7e91778bfafa67b24efd1edf4387e1f3014fae9d`

### Customer lifecycle contract
- New customer: Home → Registration → secure workspace provisioning → Studio.
- New customers do not depend on a manual approval/request queue before entering the product.
- Existing customer: Home → Login → email OR phone + password → existing workspace / Studio.
- Platform Admin customer control remains centered on `/admin/users` and is server-authorized.
- Tenant and branch isolation, fail-closed provisioning, authentication, authorization, and server-side trust boundaries remain protected.

### Legacy retirement
- Legacy Leads / Service Requests are removed from the active Platform Admin customer lifecycle surface.
- The previous approval/request gating dependency was retired rather than merely hidden.
- Legacy request-record/trigger cleanup included in PR #170 is recorded as completed in the PR scope.
- No replacement approval queue was introduced.

### Platform Admin
- `/admin/users` remains the supported customer-control surface.
- Legacy Service Requests / Leads are not the customer lifecycle control surface.
- Admin navigation and route behavior were corrected and verified during the PR work.

### Verification
- VERIFIED BY MANUS REPORT: Quality gates passed for the final PH-01 batch.
- VERIFIED BY MANUS REPORT: W9 Orders QA passed.
- VERIFIED FROM GITHUB: merge commit is verified.
- Manus reported that a prior local TypeScript/baseUrl check failed because of a local toolchain/version mismatch; official CI was the authoritative quality gate for the merged batch.

## Completed Protected Product Work
- G1–G7.2 — CLOSED / VERIFIED.
- Premium Theme System — DONE / VERIFIED / MERGED.
- Essential, Editorial, Noir, Heritage/Taste, Gallery — protected.
- Visual/Functional Quality System — DONE / VERIFIED / MERGED.
- P0 Public Order Hardening — DONE / VERIFIED.
- P1 Production/Continuity Hardening — DONE / VERIFIED for implemented scope.
- P1-H1 package/lockfile reconciliation — CLOSED / VERIFIED.
- P1-H2 main protection — CLOSED / VERIFIED.
- P2 Growth & Differentiation — DONE / VERIFIED / DEPLOYED.
- Platform Approval Center — CLOSED / VERIFIED.
- Registration-link rendering — CLOSED / VERIFIED.
- Onboarding Creation Recovery — CLOSED / VERIFIED / MERGED.
- Menu Intelligence V5 Report Center — CLOSED / VERIFIED / MERGED.
- R2.1–R2.7 Menu Intelligence — CLOSED / VERIFIED.
- R4.1–R4.5 Owner Intelligence — CLOSED / VERIFIED.
- R5 Growth Extensions — CLOSED / VERIFIED.
- R6 bounded WhatsApp CTA experiment — CLOSED / VERIFIED for activation/measurement implementation; outcome remains pending meaningful real exposure.
- R7 evidence review — IN PROGRESS / NON-BLOCKING while exposure remains insufficient.
- R8.1–R8.5 Closed-Loop Menu Growth Engine — CLOSED / VERIFIED / MERGED.
- R9 Guest CRM / Loyalty / Campaigns / Feedback / Retention — CLOSED / VERIFIED / MERGED.
- AI Provider Routing & Multimodal Fallback — CLOSED / VERIFIED / MERGED.
- Grounded Guest Menu Assistant — CLOSED / VERIFIED.
- Gallery + Noir theme hardening — CLOSED / VERIFIED / MERGED.
- W7.1–W7.12 internal product experience work — CLOSED / VERIFIED for implemented scope; physical Android/iOS QA remains release-stage evidence.
- W8 Internal Visual System — DONE / VERIFIED for implemented scope; its draft PR history remains protected separately.

## Production / Release Gates
- VERIFIED: GitHub `main` contains the PH-01 merge and protected prior work.
- VERIFIED: GitHub `main` now contains PR #172 homepage runtime fix.
- UNKNOWN: physical real-device Production QA for the latest `main`.
- UNKNOWN: current Production environment-variable values.
- BLOCKED / NON-BLOCKING: the PR #172 Vercel deployment attempt was rate-limited by the known free daily deployment quota; no retry was performed.
- Do not use Vercel as an iteration loop or trigger unnecessary deployment retries.

## Current Strategic Direction
The current Activation workstream is closed; the repository is awaiting the owner's next explicitly scoped task.

```text
Live Menu
→ Guest Experience
→ Menu Intelligence
→ Owner Intelligence
→ Growth Extensions
→ Experiments
→ Guest Relationships
→ Customer Self-Serve Lifecycle
→ Existing implemented commercial/admin capabilities
```

Do not turn the product into a generic AI chatbot, POS, accounting system, or autonomous restaurant operator.

## Continuity Rule
At the end of every atomic task:1. reconcile Git head against GitHub `main`;
2. distinguish implementation, CI, deployment, and device evidence;
3. update continuity files when canonical state changes;
4. record exactly one next authorized task;
5. never infer authorization for deferred payment/commercial work.

## 2026-09-18 — A.3 Implementation — CLOSED / VERIFIED
- VERIFIED: runtime implementation is on `feat/a3-session-order-attribution-2026-09-18`.
- VERIFIED: final implementation head before squash merge is `e1d406edb4def53355d7e6c623b70108a5940a9d`.
- VERIFIED: canonical `main` is `1cb3cce08f544e295ab550fa70e8123bf2fc7b1a`.
- VERIFIED: no production deployment was performed.
- VERIFIED: GitHub Quality run `35344719541` and W9 Orders QA run `35353500533` passed.

## 2026-09-17 — Homepage Runtime Regression — CLOSED / VERIFIED
- VERIFIED: PR #172 fixed the public homepage `React.Children.only` crash.
- VERIFIED: root cause was multi-child `Button asChild` composition: `Link` plus trailing `ArrowUpLeft` icon.
- VERIFIED: `src/components/ui/button.tsx` now uses Radix `Slottable` for multi-child `asChild` composition.
- VERIFIED: `tests/public-pages-themes-contract.test.mjs` contains regression protection.
- VERIFIED: Quality run `35266109690` and W9 Orders QA `35266109691` passed.
- VERIFIED: merge commit is `8050d2f08a2904f5ee2d9085454c47bdba601392`.
- UNKNOWN: physical real-device Production QA for the latest main.
- Durable incident record: `docs/project-memory/2026-09-17-homepage-react-children-only.md`.

## A.1 — Customer Journey & Event Truth Audit — CLOSED / VERIFIED
- VERIFIED: audit completed against repository baseline `c3afb623559ea1d6e015a5abeb6a59ebc26a4f27` and live Supabase.
- VERIFIED: no runtime code, schema, auth/RLS, theme, or deployment changes were made.
- VERIFIED: audit: `docs/audits/2026-09-18-a1-customer-journey-event-truth-audit.md`.
- VERIFIED: A.2 implementation is on branch `feat/a2-minimal-journey-instrumentation-2026-09-18` at `fb3b27218fcd8f732b0a2472ff72b2420e067b02`.
- VERIFIED: PR #191 is CLOSED / SUPERSEDED by PR #192.
- VERIFIED: A.2 adds canonical `search`, `category_view`, and `add_to_cart` events to `menu_events` with tenant-scoped category validation/storage.
- VERIFIED: GitHub Quality run `35340567488` passed; W9 Orders QA run `35340567487` passed.
- VERIFIED: no production deployment or synthetic traffic was used.
- VERIFIED: remaining gaps are authoritative event → order linkage, cart-open measurement, and the existing `menu_events.session_id` nullability mismatch.
- BLOCKED: Supabase security advisor reports RLS disabled on six live tables; separate security task required.
- UNKNOWN: physical Production device QA, current Production environment values, sufficient real R6 exposure.

## A.2 — Minimal Journey Instrumentation — CLOSED / VERIFIED BY CI
- Scope was limited to search/category/add-to-cart measurement.
- Canonical `menu_events` was extended; no parallel analytics stream was introduced.
- Existing tenant/branch validation, product ownership validation, R6 experiment semantics, Owner Analytics, Growth, Reports, R2–R9, and public-menu architecture were preserved.
- Focused regression coverage was added for the server contract and all live public renderer families.
- Quality and W9 Orders CI passed on the final head.

## A.3 — Server-Controlled Anonymous Session → Order Attribution — CLOSED / VERIFIED BY CI
- VERIFIED: implementation branch `feat/a3-session-order-attribution-2026-09-18`.
- VERIFIED: final implementation head before squash merge is `e1d406edb4def53355d7e6c623b70108a5940a9d`.
- VERIFIED: canonical `main` is `1cb3cce08f544e295ab550fa70e8123bf2fc7b1a`.
- VERIFIED: PR #192 is CLOSED / MERGED at `42f0a7e3caf8939b28672685ac2d578578c9d90c`.
- VERIFIED: server-issued `__Host-menu_v3_sid` is opaque, HttpOnly, Secure, SameSite=Lax, host-only, bounded, and server-validated.
- VERIFIED: canonical `menu_events` now receives the server-resolved session; public event calls no longer accept client-supplied `sessionId`.
- VERIFIED: public orders attach `anonymous_session_id` only from a valid server-issued tenant-bound session.
- VERIFIED: tenant/session consistency is enforced by a composite foreign key at the database boundary.
- VERIFIED: historical orders/events remain untouched; no retroactive relinking was introduced.
- VERIFIED: existing order validation, pricing, rate limiting, idempotency, and status-event flow remain protected.
- VERIFIED: GitHub Quality run `35353500574` passed after the final R6 experiment-session alignment correction.
- VERIFIED: GitHub W9 Orders QA run `35353500533` passed.
- VERIFIED: typecheck, full tests, lint, production build, public all-theme browser QA, Studio browser QA, Platform Admin browser QA, and performance stages passed in Quality.
- VERIFIED: no production deployment occurred.
- UNKNOWN: physical real-device QA and live production cookie behavior.
- BLOCKED / NON-BLOCKING: Vercel PR status failed because the connected Vercel account hit its build/deployment rate limit; no retry was performed.

## Exact Next Task
**Owner visual/device QA of the merged Editorial Canvas theme — inspect the Arabic mobile menu first (360–430px), then desktop and English LTR, with QR entry, search/category, product details/options, cart/order, and fixed-cart coverage.**

Do not deploy to Production automatically and do not begin another redesign until this QA is reviewed.

## 2026-09-18 — A.4 International Boundary Audit — CLOSED / VERIFIED
- VERIFIED: A.4 was authorized explicitly and audited against canonical `main` at `1cb3cce08f544e295ab550fa70e8123bf2fc7b1a`.
- VERIFIED: audit record: `docs/audits/2026-09-18-a4-international-boundary-audit.md`.
- VERIFIED: no runtime, schema, auth, RLS, theme, or deployment changes were made.
- VERIFIED: Menu V3 is Saudi-first but not fundamentally Saudi-architected; tenant country/currency are represented as data, while several formatting and lifecycle seams remain Saudi-bound.
- VERIFIED: largest technical gap identified is inconsistent explicit time-zone handling; reusable currency formatting also remains SAR-specific.
- VERIFIED: Saudi self-serve phone onboarding is an intentional commercial/security boundary and was not broadened.
- VERIFIED: external i18n research covered W3C Internationalization, Unicode CLDR, and JavaScript Intl guidance.
- UNKNOWN: local runtime/browser/device behavior for any future implementation derived from A.4.
- BLOCKED: no blocker for the audit itself; production deployment was not part of A.4.


## 2026-09-18 — A.5 Public Shareability / Deep-Link Audit — CLOSED / VERIFIED
- VERIFIED: A.5 audit completed against canonical `main` at `1cb3cce08f544e295ab550fa70e8123bf2fc7b1a`.
- VERIFIED: audit record: `docs/audits/2026-09-18-a5-public-shareability-deep-links.md`.
- VERIFIED: public tenant and branch routes are structurally direct-addressable and server-resolved.
- VERIFIED: QR URLs, locale state, canonical URLs, hreflang, theme-preview noindex behavior, tenant/branch isolation, and all-theme route architecture were inspected.
- VERIFIED: competing robots/sitemap implementations exist across `src/lib/menu/seo-discovery.ts` + `server/middleware/seo-discovery.ts` and `src/lib/seo/crawl.ts` + `server/middleware/grok-pwa.ts`.
- GAP: invalid public-menu handling returns an application-level `not_found` result rather than a proven route-level HTTP 404; runtime confirmation is still required.
- GAP: `/m/:slug` has first-active-branch ambiguity for multi-branch tenants; branch-specific sharing is deterministic via `/m/:slug/:branch`.
- DEFERRED: product/category deep links and native Web Share API are growth opportunities, not part of the remediation gate.
- UNKNOWN: current production HTTP behavior for invalid routes because runtime/device execution was not available in this audit.
- Exact next task: **A.5 Remediation — unify public discovery ownership and establish a verified HTTP 404 contract for public menu routes.**


## 2026-09-18 — A.5 Remediation — CLOSED / VERIFIED
- VERIFIED: PR #196 `fix: unify public discovery and establish route-level 404s` merged into `main` at `b98e3e1ae832c389157de2205979be4801fce63b`.
- VERIFIED: `server/middleware/seo-discovery.ts` is the sole active owner of `/robots.txt` and `/sitemap.xml`; superseded `src/lib/seo/crawl.ts` and PWA ownership were removed.
- VERIFIED: canonical sitemap retains locale-aware branch URLs, reciprocal `hreflang` alternates where English content exists, and deterministic duplicate suppression.
- VERIFIED: both public route variants now throw TanStack Router `notFound()` for `getPublicMenu` `not_found` results.
- VERIFIED: Quality run `35363323737` passed; W9 Orders QA run `35363323728` passed.
- BLOCKED / NON-BLOCKING: Vercel remains rate-limited; no deployment or retry was performed.
- UNKNOWN: direct production HTTP verification of invalid public URLs and physical real-device QA remain release-stage evidence.
- Protected public themes, ordering, analytics, tenant/branch isolation, auth/RLS boundaries, and deployment policy were not redesigned or weakened.

## 2026-09-19 — QR/Public Theme Visual Regression Remediation — CLOSED / VERIFIED
- VERIFIED: PR #201 `fix(themes): close QR visual regressions in Editorial, Noir, and Taste` was merged into `main`.
- VERIFIED: merge commit before this continuity-only commit: `dc4dbe61809d279491e00d7fc276644d3242aa98`.
- VERIFIED: GitHub Quality run `35400889545` passed route generation, typecheck, full tests, W7.4–W7.10 contract tests, lint, production build, Playwright Chromium installation, all-theme browser QA, Studio browser QA, Platform Admin/W7.10 browser QA, performance diagnostics, and cleanup.
- VERIFIED: GitHub W9 Orders browser run `35400889594` passed.
- VERIFIED: focused QR/theme regression contracts passed for Editorial Arabic wrapping/spacing, Noir restaurant cover + shared featured interaction, and Taste restaurant logo rendering.
- VERIFIED: final PR scope was limited to theme presentation/regression coverage; tenant data, ordering, analytics, auth/RLS, subscriptions, SEO architecture, and deployment configuration were not changed.
- VERIFIED: PR had no unresolved review threads; GitHub merge was performed with expected head `5322ade776fb0a91144c9ddd1812d633b827d5db`.
- UNKNOWN: physical Android/iOS QR verification of the merged main, including camera/real-device rendering and actual restaurant-selected media loading.
- UNKNOWN: direct current Vercel Production deployment identity for this newly merged main; no deployment was requested or performed by this task.
- NOTE: the repository Quality browser suite provides automated browser evidence across themes; it does not replace physical-device QR evidence.
- Files changed by PR #201: `package.json`, `src/components/templates/fine-dining-hospitality.tsx`, `src/components/templates/taste.tsx`, `src/routes/__root.tsx`, `src/theme-noir-hardening.css`, `src/theme-qr-final-fixes.css`, `tests/noir-browser-hardening.test.mjs`, `tests/theme-qr-final-fixes.test.mjs`.
- Continuity documentation is being reconciled in this single documentation commit after the verified code merge.

## 2026-09-19 — QR Printing + Editorial Typography + Theme Label Cleanup — CLOSED / VERIFIED

- VERIFIED: PR #203 `fix: restore QR printing, add batch sheets, and finalize Editorial typography` merged into `main` at `d55c6c7b8cc18807b7a20982d803761d8180fc61`.
- VERIFIED: QR single-print reliability was fixed by opening the print browsing context directly from the user click before the asynchronous QR generation step, avoiding the transient-user-activation failure mode of the previous implementation.
- VERIFIED: multi-copy QR printing now accepts 1–40 copies, defaults to 8, uses the exact same branch/menu URL for every copy, and lays out up to 8 codes per printed page in a 2×4 sheet.
- VERIFIED: the Editorial product card now reserves a dedicated title column, keeps the number separate, moves price to its own row, and uses normal Arabic word wrapping instead of character-level fragmentation.
- VERIFIED: active decorative `NOIR / 03`, `N / 03`, and `ISSUE / 03` labels were removed from the active Noir/Editorial presentation layers.
- VERIFIED: focused regression contracts were added for QR print/batch behavior and decorative-label removal.
- VERIFIED: Quality run `35407461902` passed typecheck, full tests, W7.4–W7.10 contract tests, lint, production build, Playwright/Chromium, all-theme browser QA, Studio/Platform Admin browser QA, performance baseline, diagnostics, and cleanup.
- VERIFIED: W9 Orders QA run `35407461827` passed.
- VERIFIED: PR #203 had no unresolved review threads.
- VERIFIED: no database, auth/RLS, ordering, analytics, subscription, SEO architecture, or deployment configuration changes were made.
- UNKNOWN: physical Android/iOS/QR print-preview/device rendering remains unverified.
- UNKNOWN: current Vercel Production deployment identity for this merged main; no Vercel production deployment was performed by this task.
- NOTE: the GitHub browser suite verifies automated browser behavior across all themes; it does not replace physical-device QR scanning/printing evidence.

## Exact Next Task
**Real-device production QA — execute the prepared Android/iOS/QR/theme/order/RTL smoke matrix on a physical device, and include the QR single-print + multi-copy print-preview checks.**

Do not begin product/category deep links or native Web Share automatically.


## 2026-09-19 — Homepage Redesign + Permanent Innovation Workflow — IMPLEMENTATION IN PROGRESS

- VERIFIED: owner explicitly authorized homepage implementation after the documented planning/approval gate.
- VERIFIED: implementation branch `feat/homepage-redesign-innovation-2026-09-19` is based directly on canonical `main` at `6c0ac3ffef3501698ecc2b93551d7d5f928896cb`.
- VERIFIED: PR #206 is open and targets `main`.
- VERIFIED: homepage runtime scope is limited to `src/routes/index.tsx` and `src/routes/index.css`, plus focused regression coverage.
- VERIFIED: a permanent `Research, Innovation & Creative Intelligence Agent` was added at `docs/agents/research-innovation-creative-agent.md` and wired into `docs/automatic-specialist-routing.md`.
- VERIFIED: fresh research was recorded in `docs/design-research-log.md`, including current Land-book discovery, W3C Arabic/RTL guidance, and Google page-experience guidance.
- VERIFIED: no database, migrations, auth/RLS, tenant/branch isolation, ordering/cart business logic, theme renderer, or Vercel configuration was changed.
- VERIFIED: no new external homepage asset is required; the implementation uses existing theme previews plus CSS product-proof compositions.
- VERIFIED: illustrative Studio metrics are intentionally non-numeric to avoid presenting fabricated customer data.
- UNKNOWN: local typecheck/lint/build/browser execution; the environment could not resolve GitHub for a local clone.
- UNKNOWN: GitHub Actions Quality run for PR #206; the connector currently reports no workflow run for the head commit.
- BLOCKED / NON-BLOCKING: Vercel status on the branch is failure due to the documented build-rate-limit surface; no deployment/retry was performed.
- Implementation status: `IMPLEMENTATION_IN_PROGRESS` pending quality evidence and final diff review.
- Deployment status: `DEPLOYMENT_BLOCKED` / no deployment performed.

### Exact Next Task

Review PR #206 quality evidence and final diff; if CI/browser gates are clean, prepare the homepage batch for one controlled merge to `main`. Do not deploy automatically.


## 2026-09-19 — Homepage Redesign + Innovation Workflow — VERIFIED / MERGED

- VERIFIED: PR #206 is merged into canonical `main`.
- VERIFIED: merged `main` commit is `0f2f145b64d41f670ee2508582f76e2196b53b67`.
- VERIFIED: `Menu V3 Quality` run #2097 passed: route generation, typecheck, 319 tests, W7 contract suites, lint, production build, Playwright/browser template QA, Studio/Platform Admin responsive browser QA.
- VERIFIED: `Menu V3 W9 Orders QA` run #357 passed.
- VERIFIED: the homepage implementation remains limited to presentation, focused regression coverage, permanent innovation workflow, research record, and continuity documentation; protected backend/auth/RLS/tenant/branch/order/theme boundaries were not changed.
- VERIFIED: permanent `Research, Innovation & Creative Intelligence Agent` is now stored in the repository and wired into specialist routing.
- BLOCKED / NON-BLOCKING: Vercel status remains rate-limited by `api-deployments-free-per-day`; no production deployment was performed.
- UNKNOWN: physical-device production QA for the new homepage and the exact currently deployed production SHA.
- Implementation status: `DONE` for the authorized homepage implementation slice.
- Deployment status: `DEPLOYMENT_BLOCKED` / no deployment performed.

### Exact Next Task

Release-stage production verification of the merged homepage on the permitted deployment window, followed by the prepared physical Android/iOS/QR/theme/order/RTL smoke matrix. Do not start another redesign before this verification.

## 2026-09-19 — Commercial Packaging + Arabic Homepage Refinement — CLOSED / VERIFIED

- VERIFIED: PR #208 merged into `main` at `df2569e92e25380c6fc4957eba8b2d96353bd1f9`.
- VERIFIED: Free commercial limit is now 20 products, 1 branch, and 2 team members.
- VERIFIED: Growth remains 49 SAR/month, 490 SAR/year, 3 branches, 300 products, and 10 team members.
- VERIFIED: Pro remains 149 SAR/month, 1,490 SAR/year, 10 branches, unlimited products, and 25 team members.
- VERIFIED: plan-specific commercial feature packaging is now represented by `COMMERCIAL_PLAN_FEATURES` and surfaced on the public homepage and `/pricing`.
- VERIFIED: the homepage no longer exposes the Pro `Number.MAX_SAFE_INTEGER` sentinel; Pro is displayed as unlimited products.
- VERIFIED: Arabic homepage menu proof was refined to restaurant-native wording: `كبسة لحم نجدية`, a specific culinary description, and a more natural second dish example.
- VERIFIED: two owner-supplied homepage image paths are wired with CSS fallbacks:
  - `public/homepage/menu-cover.webp`
  - `public/homepage/menu-dish.webp`
- VERIFIED: database migration `migrations/20260919050000_commercial_packaging_correction.sql` updates the Free limits at the server/database boundary.
- VERIFIED: server-side subscription fallback values were aligned to 20 products / 2 team members.
- VERIFIED: Quality run #2103 passed typecheck, tests, W7 contract suites, lint, production build, all-theme browser QA, Studio browser QA, Platform Admin browser QA, and responsive QA.
- VERIFIED: W9 Orders QA run #361 passed.
- VERIFIED: the first Quality run #2102 failed only because one existing commercial test still expected the old Free team limit of 3; the test was corrected and run #2103 passed.
- UNKNOWN: the two final owner artwork files have not been added to the repository yet.
- UNKNOWN: direct production deployment identity for `df2569e92e25380c6fc4957eba8b2d96353bd1f9` is not claimed by this task; no Vercel deployment was intentionally triggered.
- Implementation status: `DONE`.
- Deployment status: `UNKNOWN` / no deployment performed by this task.

### Exact Next Task

Owner supplies the two final homepage images and places them at the documented paths, then perform one controlled release verification against the merged `main` commit. Do not redesign the homepage again.


## 2026-09-19 — Homepage Realistic Visuals — CLOSED / VERIFIED

- VERIFIED: PR #213 `feat: add realistic homepage menu and analytics visuals` merged into canonical `main`.
- VERIFIED: merge commit: `ccf25a80f9f3f6000cebed8c2b3d8162edfd3f24`.
- VERIFIED: homepage visual assets were added by the merged PR, including the menu cover/dish imagery, realistic analytics preview, and five theme preview WebP assets.
- VERIFIED: homepage source wiring changed in `src/routes/index.tsx` and `src/routes/index.css`; protected backend/auth/RLS/tenant/branch/order boundaries were not part of the PR diff.
- VERIFIED: PR head had successful Vercel status before merge; no unresolved review threads were present.
- UNKNOWN: physical-device visual QA of the merged homepage.
- UNKNOWN: exact current Vercel Production deployment commit.
- Implementation status: `DONE`.
- Deployment status: `UNKNOWN` / no production deployment performed by this task.

### Exact Next Task

Release-stage verification of merged `main` for the homepage, followed by the prepared physical Android/iOS/QR/theme/order/RTL smoke matrix. Do not automatically begin another homepage redesign.


## 2026-09-20 — Live Digital Menu Homepage Closeout — VERIFIED

- VERIFIED FROM GITHUB: PR #215 `feat: publish live digital menu homepage` is CLOSED / MERGED into `main`.
- VERIFIED FROM GITHUB: merge commit is `a2e5e17178c4095f8a61def2af3e0eef8074f4fa`.
- VERIFIED FROM GITHUB: PR #215 changed only `src/routes/index.tsx` and `src/routes/index.css`.
- VERIFIED FROM GITHUB: the homepage phone mockup was replaced by a live digital-menu presentation containing restaurant identity, status/location, categories, product cards, search/cart affordances, order CTA, and bilingual AR/EN content.
- VERIFIED FROM GITHUB: the merged commit has a successful Vercel status on the PR.
- REPORTED BY MANUS / OWNER: Manus performed its quality verification and the owner independently tested the resulting homepage. These are owner-reported/manual evidence, not a substitute for direct CI or production evidence where those are still UNKNOWN.
- VERIFIED FROM PR #215: the implementation report states local typecheck, 25 contract tests, and production build passed before merge.
- VERIFIED FROM GITHUB: no unresolved review threads or submitted review blockers are present on PR #215.
- UNKNOWN: direct current Vercel Production deployment identity for `a2e5e17178c4095f8a61def2af3e0eef8074f4fa` is not established by the available GitHub evidence.
- UNKNOWN: physical Android/iOS production verification of the latest `main`, including QR scanning, theme rendering, ordering, RTL/LTR, and print preview.
- NON-BLOCKING: R7 experiment evidence remains pending meaningful real exposure.
- SEPARATE SECURITY WORK: the historical A.2 record still identifies six live RLS-disabled tables as a separate security/data task; this was not changed by PR #215.
- DEFERRED BY OWNER DIRECTION: Payment Provider, Commercial Launch, PH-07, and R10 are not prerequisites for the current activation/release sequence.

### Exact Next Task

**Release-stage verification of current `main` at `a2e5e17178c4095f8a61def2af3e0eef8074f4fa`, followed by the prepared physical Android/iOS/QR/theme/order/RTL smoke matrix, including QR single-print and multi-copy print-preview checks.**

Do not start another homepage redesign, theme redesign, product/category deep-link work, or native Web Share work before this release/device evidence is closed.


## 2026-09-20 — Public Menu Reliability / Brand Social / Image Contract — VERIFIED / READY TO MERGE

- VERIFIED: implementation branch `fix/public-menu-social-images-performance-2026-09-20` final head `b3bbf92c3fbaef52511162f2b340ea179878603d`.
- VERIFIED: Double Espresso uses repository-owned `/homepage/menu-dish.webp`; public menu removes the redundant tenant lookup while preserving server session/tenant boundaries.
- VERIFIED: Studio supports Website, Instagram, Snapchat, Facebook, and TikTok tenant links with server-side safe URL handling.
- VERIFIED: branch maps are already supported by `/studio/branches`; Brand now explicitly links to that surface and explains why map data is branch-scoped.
- VERIFIED: image uploads use a 450,000-character client/server contract with adaptive WebP compression.- VERIFIED: local recognizable social SVG marks are used without a runtime/CDN dependency.
- VERIFIED: GitHub Quality `35477401543` passed all configured quality/browser/performance stages; W9 Orders QA `35477401542` passed.
- VERIFIED: Vercel status for the final head is success; PR #217 has no unresolved review threads or submitted reviews.
- UNKNOWN: Production deployment identity and physical Android/iOS/QR/device evidence.
- Implementation status: `PUSHED` / `VERIFIED_LOCALLY` equivalent evidence is supplied by CI; not yet merged.
- Deployment status: `UNKNOWN` / no Production deployment by this task.

### Exact Next Task

**Merge PR #217 once at verified head `b3bbf92c3fbaef52511162f2b340ea179878603d`, then verify resulting `main` and release-stage Production/device evidence.**

## 2026-09-20 — Public Menu Reliability / Brand Social / Image Contract — MERGED / RELEASE-STAGE PENDING

- VERIFIED: PR #217 merged successfully into `main` at `679f72aca993f5a8001ef5f158877b2c48b79265` from verified head `e82d2652a1cc9f4d69f1e73ff9efc6dbf9a8a98b`.
- VERIFIED: Quality rerun `35477790515` completed successfully; typecheck, tests, lint, production build, all-theme browser QA, Studio browser QA, Platform Admin/W7.10 browser QA, performance diagnostics, and cleanup all passed.
- VERIFIED: PR #217 had no unresolved review threads and no submitted reviews.
- VERIFIED: GitHub reports Vercel status `pending` for merged `main`; this is not Production deployment evidence.
- UNKNOWN: direct Production deployment identity/status and physical Android/iOS/QR/theme/order/RTL verification.
- Implementation status: `PUSHED` / merged to `main`.
- Deployment status: `UNKNOWN` / release-stage verification pending.

### Exact Next Task

**Release-stage verification of `main` at `679f72aca993f5a8001ef5f158877b2c48b79265`, then the prepared physical Android/iOS/QR/theme/order/RTL smoke matrix. Do not start another redesign or feature task before this evidence is closed.**


## 2026-09-20 — Release Verification — PRODUCTION DEPLOYED / DEVICE QA PENDING

- VERIFIED: canonical `main` is `1fcb287072c47746e5f0a7a4a376a87783ab74e5` after continuity PR #218.
- VERIFIED: Vercel Production deployment `dpl_21u9f1K7ninyd6JBi5ayrJJ8TekF` is `READY`, target `production`, and is built from `main` commit `1fcb287072c47746e5f0a7a4a376a87783ab74e5`.
- VERIFIED: GitHub Vercel status for `main` is `success`.
- VERIFIED: Production runtime-error aggregation reports no runtime errors in the selected last-1-hour window.
- VERIFIED: PR #217 implementation is therefore present in a Vercel Production deployment; no additional deployment was intentionally triggered.
- UNKNOWN: physical Android/iOS QR scanning, all-theme visual rendering, ordering, RTL/LTR, and QR print-preview evidence on real devices.
- NOTE: direct deployment URL fetch is protected by Vercel authentication, so no anonymous HTTP page-content verification was claimed from that check.

### Exact Next Task

**Physical Android/iOS production QA — execute the prepared QR/theme/order/RTL smoke matrix, including QR single-print and multi-copy print-preview checks, against `main` `1fcb287072c47746e5f0a7a4a376a87783ab74e5`.**


## 2026-09-20 — Editorial Atelier Replacement
- Main baseline: `5f7932df3cdf212cbf2f154b65c9c8abdf7cc2c2`.
- Branch: `redesign/editorial-atelier-premium-2026-09-20`.
- Prototype: `https://menu-v3-atelier-editorial-h5h7es.v2.appdeploy.ai/`.
- Decision: replace Editorial visual ownership with Atelier while preserving ThemeKey `editorial` and the existing renderer/business behavior.
- Protected systems untouched: auth, DB/RLS, orders, analytics, tenant/branch isolation, SEO architecture, deployment configuration.
- UNKNOWN: CI/browser/device verification until branch checks complete.

### Exact Next Task
**Run GitHub Quality/browser QA for the Atelier branch, review the diff, then perform physical Android Editorial QA before merge.**



## 2026-09-20 — Editorial Atelier Replacement — CLOSED / VERIFIED / MERGED

- VERIFIED: PR #221 `redesign: replace Editorial with Atelier premium system` was merged into `main`.
- VERIFIED: merge commit / current `main` HEAD at implementation closeout: `bff4a03be234f3d011f35c935cc0ee57746b5a2d`.
- VERIFIED: the prior Editorial presentation stack was replaced by the scoped `src/theme-editorial-atelier.css` owner while ThemeKey `editorial` and the existing `contemporary-restaurant` renderer were preserved.
- VERIFIED: legacy Editorial presentation files `src/theme-editorial.css` and `src/theme-editorial-hardening.css` were removed; Editorial selectors were removed from shared legacy layers.
- VERIFIED: Quality run `35490043010` succeeded on retry attempt 2, including typecheck, tests, lint, production build, all-theme browser QA, Studio browser QA, Platform Admin browser QA, and performance/diagnostic stages.
- VERIFIED: W9 Orders QA run `35489610007` succeeded on the Atelier implementation head before merge.
- VERIFIED: PR #221 had no unresolved review threads.
- VERIFIED: GitHub combined status for the implementation merge commit is successful; Vercel reports success for `bff4a03be234f3d011f35c935cc0ee57746b5a2d`.
- UNKNOWN: whether that successful Vercel deployment is the current Production deployment identity versus a non-production deployment; no direct Production identity was established here.
- UNKNOWN / EXTERNAL: physical Android/iOS QA of the merged Atelier public menu, including QR scanning and real-device typography, remains unverified.
- Note: the first Quality attempt failed in an unrelated Studio responsive Playwright run with an execution-context-destroyed navigation race; the failed job was rerun without code changes and passed completely.

### Exact Next Task
**Physical Android QA of merged Atelier Editorial — repeat the owner's failing Arabic/English mobile cases and verify QR/public-menu rendering, RTL/LTR, title/price geometry, fixed actions, search/categories, cart/order, and configured external actions.**


## 2026-09-20 — SIGNAL TABLE Public Menu Redesign — IMPLEMENTATION_IN_PROGRESS

- VERIFIED: owner explicitly authorized the SIGNAL TABLE redesign execution.
- VERIFIED: task baseline main SHA: `6544be33126b13501b15b483ec56e997eaa44117`.
- VERIFIED: existing ThemeRenderer / contemporary-restaurant family is the presentation boundary; no new public-menu data/order/auth architecture was introduced.
- IMPLEMENTED: `src/components/templates/signal-table.tsx` and `src/theme-signal-table.css` provide the new scoped presentation owner.
- IMPLEMENTED: Editorial theme now renders through `SignalTableTemplate`; obsolete Canvas presentation stylesheet is removed.
- IMPLEMENTED: Signature Stage, cuisine rail, menu stream, focused detail, conditional Order Bar, RTL/LTR direction handling, and existing configured actions are preserved within the current contracts.
- IMPLEMENTED: no decorative product/category numbering or CSS counters exist in the new presentation.
- VERIFIED: Font Pairing and Color Designer were used for typography/palette validation only; no paid/unknown-cost dependency was introduced.
- UNKNOWN: local command execution, GitHub Quality/browser result, physical-device visual QA, accessibility/performance evidence, and production deployment identity.
- Deployment status: UNKNOWN / not deployed by this implementation step.

### Exact Next Task
**Run GitHub Quality/browser/accessibility/performance verification for the SIGNAL TABLE branch, review the complete diff, resolve failures, then create the single coherent PR.**


### Verification Update — PR #226
- VERIFIED: PR #226 is open with current head `46ef771378fe77f62e24c83daff68c2c84ad0a71`.
- IN_PROGRESS: GitHub Quality run `35529179532` (#2160) and W9 Orders QA run `35529179546` (#403).
- UNKNOWN: final CI conclusions, physical-device visual QA, and production deployment identity.
- Exact Next Task: **Review Quality #2160 and W9 #403 to completion, resolve failures, then perform the final diff/release gate for PR #226.**


## 2026-09-20 — SIGNAL TABLE Final Verification Gate

- VERIFIED: PR #226 head is `edf6ae157c9ce81e8d8148c2616058579ba6d91f`.
- VERIFIED: GitHub Quality run #2169 completed successfully after one transient Studio browser navigation failure was rerun.
- VERIFIED: W9 Orders QA run #412 completed successfully.
- VERIFIED: Quality included typecheck, full tests, lint, production build, browser template QA, Studio/Platform browser QA, responsive QA, and performance baseline steps; all completed successfully on the final rerun.
- VERIFIED: no unresolved pull-request review threads remain.
- VERIFIED: Vercel status for the final head is successful; this is preview/status evidence only, not Production deployment evidence.
- VERIFIED: final implementation enforces no product/category numbering and no CSS counters.
- UNKNOWN: physical Android/iOS device QA and Production deployment identity.
- Implementation status: READY_TO_MERGE.
- Deployment status: NOT_RELEASED.

### Exact Next Task
**Merge PR #226 once, verify the resulting `main` SHA, then stop. Production deployment and physical-device QA remain release-stage work and are not to be started automatically.**


## 2026-09-20 — SIGNAL TABLE Mobile Product Card Structural Remediation

- VERIFIED: current `main` before this task is `fb4dc99b1d8275cde9fddbd8256f3f3046285496`.
- VERIFIED: the supplied screenshot demonstrates a public-menu mobile product-card failure in the SIGNAL TABLE presentation.
- VERIFIED: current source had a `signal-product-topline` that placed title and price in competing grid columns; this violated the required hierarchy.
- VERIFIED: current source also used a proportional media track and absolute quick-add positioning.
- IMPLEMENTED: product-card DOM now keeps image + protected text column, with title → description → price in normal document flow.
- IMPLEMENTED: media is fixed `92px × 92px` on mobile; text column is explicitly shrinkable; title and description are clamped to two lines; price is isolated and non-wrapping.
- IMPLEMENTED: featured-card information flow was aligned to title → description → price as well.
- IMPLEMENTED: quick-add/options are in-flow rather than absolutely overlaid.
- IMPLEMENTED: targeted regression contracts now assert the structural hierarchy and reject the obsolete topline.
- UNKNOWN: local execution of npm commands and physical browser/device screenshots because this session does not have the repository working tree/browser runtime.
- Deployment: NOT_REQUESTED / NOT_PERFORMED.

### Exact Next Task
**Run the repository quality suite and browser visual QA for this branch at 320/375/430px Arabic RTL plus English LTR, then review the final diff and merge one coherent fix if all gates pass.**


## 2026-09-21 — SIGNAL TABLE Mobile Language / Selection Cleanup — VERIFIED / READY_TO_MERGE

- VERIFIED: PR #230 is open with head `8bbd22f28fc160359223a2902b6ae7c2ba944645`.
- VERIFIED: root cause of the missing mobile language control was the Editorial mobile rule `.signal-topbar-lang{display:none}`; it has been removed.
- IMPLEMENTED: SIGNAL TABLE now renders a dedicated bilingual language control with 🇸🇦 / 🇬🇧 target-language flags, accessible naming, preserved query state, and a mobile-safe target.
- IMPLEMENTED: the obsolete “Editor's selection / Start with these” block and hero “Signature selection” product overlay were removed; the hero now uses the configured restaurant cover or the existing identity fallback.
- IMPLEMENTED: dead SIGNAL TABLE featured-selection CSS was removed.
- VERIFIED: GitHub Quality run #2202 (`35552996462`) passed all stages, including typecheck, full tests, lint, production build, all-theme browser QA, Studio browser QA, Platform Admin/W7.10 browser QA, and performance diagnostics.
- VERIFIED: GitHub W9 Orders QA run #442 (`35552996512`) passed.
- VERIFIED: final PR diff is limited to 5 task-scoped files; no unresolved review threads remain.
- VERIFIED: Vercel status for the final PR head is successful preview/status evidence only.
- UNKNOWN: physical Android/iOS QA and current Production deployment identity for the final head.
- Deployment status: NOT_RELEASED.

### Exact Next Task

**Merge PR #230 once, verify the resulting `main` SHA, then perform the single authorized Vercel Production deployment and record the direct Production deployment identity before real-device QA.**


## 2026-09-21 — Focused Public UX / WhatsApp / Footer Pass
- VERIFIED: current task scope is recorded in docs/sessions/2026-09-21-focused-public-ux-whatsapp-footer.md.
- IMPLEMENTED: homepage demo data/media bilingual correction, Essential/Noir Featured geometry hardening, structured WhatsApp cart-order messaging/click tracking, and shared marketing/account footer.
- BLOCKED: plan-specific WhatsApp entitlement gating is deferred because the current public-menu contract does not expose a server-authoritative WhatsApp feature entitlement; no unsafe client-side gate was introduced.
- UNKNOWN: local quality commands and physical-device visual QA; GitHub PR CI/browser verification remains required.

### Exact Next Task
Run the repository Quality/test/typecheck/lint/build and browser visual verification for this branch at 320/375/430px Arabic RTL and English LTR, review the final diff, resolve only task-scoped failures, then stop.


## 2026-09-21 — Focused Public UX Follow-up — IMPLEMENTATION_IN_PROGRESS
- VERIFIED: implementation branch `feat/focused-public-whatsapp-footer-2026-09-21` is based on `main` `91b7e8e6d6b3e5e9be2070a203c501b77bde7feb`.
- IMPLEMENTED: Essential/Noir Featured cards now have explicit theme-owned title/price/copy hierarchy and a stable `#featured-heading` anchor.
- IMPLEMENTED: WhatsApp ordering is explicitly described in Free, Growth, and Pro commercial plan copy; no entitlement gate or database change was introduced.
- IMPLEMENTED: signup no longer collects brand name; `/onboarding` remains the single brand/workspace setup step.
- UNKNOWN: final CI for this follow-up until GitHub checks complete; physical Android/iOS QA remains release-stage evidence.

### Exact Next Task
Run and review the final GitHub Quality/W9 checks for the follow-up, then merge PR #232 once if all gates pass. Do not deploy automatically from this implementation task.

## Final verification — 2026-09-21
- VERIFIED: PR #232 final verified head is `6047080fcfa3e289d89538b6f28d520bbdfc7328`.
- VERIFIED: GitHub Quality #2216 passed and GitHub W9 Orders QA #454 passed.
- VERIFIED: Vercel PR status is SUCCESS preview evidence only; no Production deployment was triggered.
- BLOCKED: server-authoritative plan-specific WhatsApp entitlement remains intentionally deferred.
- UNKNOWN: physical Android/iOS QA remains release-stage evidence.

### Exact Next Task
Merge PR #232 once, verify resulting `main` SHA, then execute the single authorized Production deployment and record direct Production identity before real-device QA.

## 2026-09-22 — Main Stabilization / Security Task Reconciliation

- VERIFIED: canonical `main` is `84e0509da7de908aac3c863b093101ad4961aa81`; PR #232 is merged.
- VERIFIED: GitHub reports Vercel SUCCESS for this commit.
- UNKNOWN: direct Vercel Production deployment identity/match for this commit; no Production claim is made.
- VERIFIED: live Supabase advisor currently reports 7 RLS-disabled `menu_v3` tables: `public_order_rate_limits`, `public_order_idempotency`, `lead_onboarding`, `ai_request_rate_limits`, `menu_upsell_recommendations`, `guest_profiles`, and `anonymous_sessions`.
- VERIFIED: historical continuity records referring to six RLS-disabled tables are stale relative to the current live Supabase state.
- VERIFIED: a dedicated security task was created as GitHub Issue #233.
- VERIFIED: no RLS remediation SQL was applied; this is intentionally blocked until effective exposure, grants, and application paths are proven.
- UNKNOWN: physical Android/iOS/QR/device QA.

### Current Exact Next Task
**Physical Android/iOS/QR/theme/order/RTL smoke QA for current `main` `d6e2b6e9ed13dda4a7cd82d82d4205137a4ef5e0`.**


## 2026-09-22 — Release Verification — PRODUCTION VERIFIED / DEVICE QA PENDING

- VERIFIED: canonical `main` is `d6e2b6e9ed13dda4a7cd82d82d4205137a4ef5e0`.
- VERIFIED: Vercel Production deployment `dpl_4TFFTfLKJSFJtojrthNS85gjNWGe` is READY, target `production`, and built from `main` commit `d6e2b6e9ed13dda4a7cd82d82d4205137a4ef5e0`.
- VERIFIED: production alias `menu-v3-kohl.vercel.app` returned HTTP 200 for the root.
- VERIFIED: a valid-format nonexistent public menu slug returned HTTP 404 in Production.
- VERIFIED: Vercel reports no runtime error clusters in the selected last-1-hour production window.
- UNKNOWN: physical Android/iOS/QR/device QA.
- REMAINING SECURITY WARNINGS: `menu_v3.sync_guest_profile_from_order` mutable `search_path` and Supabase Auth leaked-password protection remain separate scoped findings.

### Current Exact Next Task
**Physical Android/iOS/QR/theme/order/RTL smoke QA for current `main` `d6e2b6e9ed13dda4a7cd82d82d4205137a4ef5e0`.**
## 2026-09-22 — Public Menu Image Performance Remediation — IN_PROGRESS

- VERIFIED: live reproduction identified a media-delivery bottleneck rather than a primary PostgreSQL query bottleneck.
- VERIFIED: the durable root-cause/remediation plan is `docs/performance/2026-09-22-public-menu-image-performance-remediation.md`.
- VERIFIED: Phase 1 branch is `perf/saudi-menu-image-delivery-2026-09-22`; PR #239 is open.
- IMPLEMENTED: safe Unsplash normalization, optimized public product media, lazy Studio thumbnails, and removal of Editorial all-product prefetch.
- UNKNOWN: Quality #2232 and W9 #464 final results.
- UNKNOWN: physical Android/browser network waterfall and LCP for the real tenant reproduction.

### Current Exact Next Task
**Review PR #239 Quality/W9 to completion, fix only task-scoped failures, then run final diff/performance review for Phase 1.**


### Verification Update — Phase 1 CI attempt
- VERIFIED: GitHub Quality run #2232 and W9 Orders QA #464 reached the new Phase 1 code and failed before full verification because `src/lib/menu/image.ts` contained an accidental literal \\n marker at line 62.
- VERIFIED: the failure was isolated from application logic and corrected in commit `8347a3204f501f6a08a085616a3e2cea10e00882`.
- UNKNOWN: CI rerun for the corrected head has not yet completed/appeared through the connected GitHub workflow surface.
- Exact Next Task: **Obtain the corrected-head CI result; if green, perform final diff review and Phase 1 performance verification; if red, fix only the reported Phase 1 issue.**


## 2026-09-22 — Final Phase 1 Continuity Update

**Public Menu Image Performance Phase 1 is VERIFIED COMPLETE. PR #239 merged as `c33d3b308b76776ec69c65abec7221f534850317`. Quality #2242 and W9 #474 passed. Exact next task: Phase 2 — Public Image Geometry and Responsive Delivery. Production deployment is NOT claimed. Real-device waterfall/LCP remains UNKNOWN.**


## 2026-09-22 — Public Menu Image Performance Phase 2 — IMPLEMENTATION COMPLETE / VERIFICATION BLOCKED

- VERIFIED: Phase 1 is already merged on main at a5073612d162d6d7d6776de6df9e422c1d6dc43e; Phase 2 branch starts directly from that SHA.
- VERIFIED: PR #241 is open against main.
- IMPLEMENTED: responsive width-descriptor srcset generation for known Unsplash URLs, with safe passthrough for arbitrary/data/blob sources.
- IMPLEMENTED: semantic media width profiles across the protected public-menu/theme surfaces, including product-card, featured-card, detail/dialog, hero/cover, and logo roles.
- IMPLEMENTED: shared/public media now emits sizes only with responsive width candidates; existing lazy/async/low-priority behavior is preserved.
- IMPLEMENTED: regression coverage for responsive source selection and updated media contracts.
- VERIFIED: no database, auth, RLS, tenant data, ordering, subscription, or deployment configuration changes.
- UNKNOWN: GitHub Quality/W9 workflow results for PR #241 are not yet exposed through the connected workflow surface; current combined status is Vercel PENDING.
- UNKNOWN: real-device 320/375/390/430px waterfall/LCP and production performance for the new head.
- Deployment status: NOT_PERFORMED.

### Exact Next Task
**Complete PR #241 verification, resolve only task-scoped failures, review the final diff, merge once if all required gates are green, verify the resulting main SHA, then stop. Do not deploy Production automatically.**


## 2026-09-22 — Public Menu Image Performance Phase 2 — VERIFIED COMPLETE
- VERIFIED: PR #241 merged once by squash as `9c262f43970384ba71faab67f88d74fd62672bc3`.
- VERIFIED: resulting `main` SHA is `9c262f43970384ba71faab67f88d74fd62672bc3`.
- VERIFIED: Quality #2256 passed and W9 Orders QA #486 passed for final PR head `41f07720621486472cdf04053fdf06f53add7f3e`.
- VERIFIED: Vercel PR preview status is SUCCESS; no Production deployment was performed by this task.
- VERIFIED: final implementation is limited to responsive image source generation, public/theme media geometry profiles, regression contracts, and continuity updates.
- UNKNOWN: physical-device waterfall/LCP and Production performance for the 30-item customer test menu.

### Exact Next Task
**Run the dedicated real-device/public-menu performance evidence pass for the 30-item Saudi shopping world test menu, measuring Studio and QR/public-menu image waterfalls plus LCP at 320/375/390/430px.**


## 2026-09-22 — Public Menu Image Performance Phase 3 — VERIFIED COMPLETE

- VERIFIED: Phase 1 and Phase 2 were already complete and were not reworked.
- VERIFIED: Phase 3 PR #247 merged once by squash as `fb4c5dba311d5f77c3bcb943f13e35cb92ab8584`.
- VERIFIED: public tenant `logo_url` / `cover_url` Base64 media is no longer embedded directly in the public tenant payload; public mapping uses versioned tenant-media URLs.
- VERIFIED: the tenant media endpoint is active/published gated, tenant-scoped, raster-only, cacheable and protected with `nosniff`.
- VERIFIED: Studio tenant media values remain unchanged; no schema, auth, RLS, ordering, subscription, or deployment configuration changes were introduced.
- VERIFIED: GitHub Quality #2276 and W9 Orders QA #503 passed on the final Phase 3 head.
- UNKNOWN: real-device 320/375/390/430px waterfall/LCP for the full 30-item Saudi Shopping World reproduction and Production performance after this merge.
- Deployment status: NOT_PERFORMED by this task.

### Exact Next Task
**Dedicated real-device/public-menu performance evidence pass for the 30-item Saudi Shopping World test menu: measure Studio and QR/public-menu image waterfalls plus LCP at 320/375/390/430px. Do not re-implement Phase 1–3 unless measured evidence requires it.**

## 2026-09-22 — Public Menu Image Performance Remediation — PHASE 8 CLOSED / VERIFIED

- VERIFIED: owner completed the final physical Android/iOS/QR production preview and reported that everything is good.
- VERIFIED: no blocking image-loading, public-menu, Studio, theme, RTL/LTR, or QR regression was reported from the final preview.
- VERIFIED: Phase 0–8 are now closed for this remediation; no Phase 1–7 work was repeated.
- VERIFIED: Production remains deployed from `488b982e93185caf6908d4b7bf56699952f65463` via deployment `dpl_2Ypk1yKSpW4JBMMR5DjkTq2uyZqp`.
- VERIFIED: no runtime code changes were required to close Phase 8 after owner device validation.
- UNKNOWN: structured device-side LCP/waterfall numbers were not captured into repository artifacts; this does not block closure because the owner completed the requested final preview successfully.

### Exact Next Task
**Wait for the next explicitly scoped task. Do not reopen Phase 0–8 or repeat completed performance work without new measured regression evidence.**


# AI Provider Expansion — 2026-09-24 — PHASE 1 IN PROGRESS

- VERIFIED: current main HEAD at task start is `17fbefd1c8a80c69e7fba28338c2121a97e7aea3`.
- VERIFIED: existing AI runtime boundary is `src/lib/menu/ai-providers.ts`.
- VERIFIED: existing executable providers remain Mercury/Inception, Gemini, Z.AI, OpenRouter, and xKiro.
- VERIFIED: owner confirmed availability of TypeSafe/Jev (3 keys), NVIDIA (2 keys), Groq (1 key), Cloudflare Workers AI, Cerebras, Mistral, and Deepgram.
- VERIFIED: Phase-1 registry and capability vocabulary are implemented on branch `feat/ai-provider-expansion-foundation`.
- VERIFIED: new providers are registered as planned but remain `runtimeEligible: false`; no new provider has been added to runtime routing.
- VERIFIED: no API secret values were added to GitHub, source, tests, or documentation.
- VERIFIED: official provider documentation was researched before implementation; see `docs/ai-provider-expansion.md`.
- IN_PROGRESS: Phase 1 verification and final diff/CI review.

## EXACT NEXT TASK

After Phase 1 closes, implement the fail-closed credential validation/key-pool contract for TypeSafe (3), NVIDIA (2), Groq (1), Cloudflare (token + Account ID), Cerebras, Mistral, and Deepgram. Do not activate provider routing in that credential-only phase.


# AI Provider Expansion — Phase 1 CLOSED / VERIFIED — 2026-09-24

- VERIFIED: Phase 1 completed on branch `feat/ai-provider-expansion-foundation`.
- VERIFIED: PR #270 is open and targets `main`; it is not merged.
- VERIFIED: Phase-1 head is `bbe75353b0bee595defd36af9d1f70aeada4b32f`.
- VERIFIED: GitHub Quality #2337 passed.
- VERIFIED: GitHub W9 Orders QA #545 passed.
- VERIFIED: typecheck, full tests, lint, production build, browser template QA, golden performance fixture, Studio browser QA, and Platform Admin browser QA passed in Quality.
- VERIFIED: planned providers remain disabled from runtime routing.
- VERIFIED: no provider secrets, database migrations, or production routing changes were introduced.
- VERIFIED: complete continuity plan is in `docs/ai-provider-expansion.md`.

Implementation status: READY_TO_PUSH.
Deployment status: NOT_PERFORMED.

## EXACT NEXT TASK

Phase 2 — implement fail-closed credential validation and key pools for TypeSafe/Jev (3), NVIDIA (2), Groq (1), Cloudflare Workers AI (token + Account ID), Cerebras, Mistral, and Deepgram. Do not activate provider routing during the credential-only phase.


# AI Provider Expansion — PHASE 2 IN PROGRESS — 2026-09-24

- VERIFIED: Phase 1 registry foundation remains intact.
- VERIFIED: Phase 2 credential contract is implemented in `src/lib/menu/ai-provider-credentials.server.ts`.
- VERIFIED: TypeSafe/Jev has a 3-key pool contract.
- VERIFIED: NVIDIA has a 2-key pool contract.
- VERIFIED: Groq, Cerebras, Mistral, and Deepgram each have a 1-key contract.
- VERIFIED: Cloudflare requires both `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`.
- VERIFIED: missing/partial credential configuration fails closed at the credential-contract layer.
- VERIFIED: no secret values were added.
- VERIFIED: no provider was activated in runtime routing.
- VERIFIED: no database migration or Vercel deployment was performed.
- UNKNOWN: live credential validity; no secret values have been supplied to this GitHub session.

## EXACT NEXT TASK

Complete Phase 2 verification and close the credential-contract phase. If Quality/W9 pass, Phase 3 is the execution-adapter phase, beginning with Groq and then NVIDIA/Cloudflare/Cerebras/Mistral/Deepgram according to the documented order.


# CURRENT VERIFIED POSITION — AI PROVIDER EXPANSION — 2026-09-24

- VERIFIED: Phase 1 provider registry/capability foundation is complete.
- VERIFIED: Phase 2 credential contract is CLOSED / VERIFIED.
- VERIFIED: current branch is `feat/ai-provider-expansion-foundation`.
- VERIFIED: current Phase-2 implementation head is the parent of the closure documentation commit.
- VERIFIED: TypeSafe/Jev 3-key, NVIDIA 2-key, Groq 1-key, Cloudflare token+Account ID, Cerebras 1-key, Mistral 1-key, Deepgram 1-key contracts exist.
- VERIFIED: credential module is server-only.
- VERIFIED: missing required credentials/context fail closed.
- VERIFIED: Quality #2345 passed.
- VERIFIED: W9 Orders QA #553 passed.
- VERIFIED: no provider runtime activation, database migration, or Vercel deployment occurred.
- UNKNOWN: live credential validity, because secret values are not present in the repository or this connected GitHub session.

## EXACT NEXT TASK

**Phase 3 — execution adapters.** Implement and verify one adapter at a time, beginning with Groq. Preserve the credential boundary and keep every new provider runtime-disabled until its adapter and targeted smoke verification are complete.



# 2026-09-24 — AI Provider Expansion / Phase 3 Groq Adapter — IN PROGRESS

- VERIFIED: current branch is `feat/ai-provider-expansion-foundation`.
- VERIFIED: current branch head before continuity-only updates is `ea8ad25082c90ce3dce1eb2b0cd4108c3d466cda`.
- VERIFIED: PR #270 remains OPEN / MERGEABLE / NOT MERGED.
- VERIFIED: Phase 1 and Phase 2 remain CLOSED / VERIFIED.
- IMPLEMENTED: dedicated Groq structured execution adapter in `src/lib/menu/ai-groq.ts`.
- IMPLEMENTED: Groq is wired only to the existing structured AI boundary; no second AI architecture was introduced.
- IMPLEMENTED: Groq default model is `openai/gpt-oss-20b`; `GROQ_MODEL` may override it.
- IMPLEMENTED: bounded timeout, normalized failures, server-only credential use, prompt-injection boundary, and no secret logging.
- VERIFIED: Groq is not part of multimodal routing; vision remains a separate future capability decision.
- VERIFIED: GitHub Quality #2353 passed.
- VERIFIED: GitHub W9 Orders QA #561 passed.
- VERIFIED: Quality passed typecheck, full tests, lint, production build, browser template QA, golden performance fixture, Studio browser QA, and Platform Admin browser QA.
- VERIFIED: Vercel Preview for the current branch head is READY.
- UNKNOWN: live Groq API smoke because the secret value is not accessible to the connected GitHub session.
- UNKNOWN: provider-specific live latency/error/quota behavior in the configured Preview environment.
- VERIFIED: no Production deployment, merge, migration, auth/RLS, subscription, or tenant/branch changes were performed.

Protected / MUST NOT REDO:
- Phase 1 capability vocabulary and provider registry foundation.
- Phase 2 server-only credential contract and key-pool inventory.
- Existing Mercury/Gemini/Z.AI/OpenRouter/xKiro runtime routing.
- Smart Menu Import OCR → Smart Extract → normalization → batching → AI organization → review → save.
- Public-menu/performance phases 0–8.

## EXACT NEXT TASK

**Execute one authenticated Groq smoke request against the current Vercel Preview using the configured `GROQ_API_KEY`; verify valid structured output and normalized failure behavior. Then review the final diff. Do not merge PR #270 or start NVIDIA until Groq smoke evidence is recorded.**


# 2026-09-24 — AI Provider Expansion / Phase 3 NVIDIA — IMPLEMENTED / LIVE SMOKE PENDING

- VERIFIED: owner confirmed Groq live smoke succeeds on `main`.
- IMPLEMENTED: NVIDIA structured adapter `src/lib/menu/ai-nvidia.ts` and two-key pool.
- IMPLEMENTED: default `openai/gpt-oss-120b`, optional `NVIDIA_MODEL`, bounded timeout and normalized failures.
- VERIFIED: NVIDIA remains outside multimodal routing.
- VERIFIED: no protected product/security/data boundaries changed.
- UNKNOWN: authenticated live NVIDIA behavior.

Protected / MUST NOT REDO: Groq adapter and smoke; Phase 1 registry; Phase 2 credentials; existing AI routing; Smart Menu Import; public-menu/performance phases 0–8.

## EXACT NEXT TASK
**Run the single authenticated NVIDIA structured-AI smoke on `main` with `AI_PROVIDER=nvidia`; if valid, record evidence and proceed to Cloudflare without unnecessary Vercel deployments.**


# 2026-09-24 — AI Provider Expansion / Cerebras — CLOSED / VERIFIED

- VERIFIED: PR #275 merged by squash as `ba9da375398998a444e5a89bdad249cc8ab6c86d`.
- VERIFIED: Cerebras structured execution adapter is active through the existing `src/lib/menu/ai-providers.ts` boundary.
- VERIFIED: Cerebras uses server-only `CEREBRAS_API_KEY`, optional `CEREBRAS_MODEL`, default `gpt-oss-120b`, official OpenAI-compatible Chat Completions, and `X-Cerebras-Version-Patch: 2`.
- VERIFIED: Cerebras is structured-only and excluded from image/PDF multimodal routing.
- VERIFIED: Quality #2373 passed Typecheck, Tests, W7.4–W7.10 contract tests, Lint, Production Build, Browser Template QA, Golden Performance Fixture, Studio browser QA, Platform Admin browser QA, and cleanup.
- VERIFIED: W9 Orders QA #578 passed.
- VERIFIED: Vercel PR status for the final head was SUCCESS; no Production deployment was requested by this task.
- UNKNOWN: authenticated live Cerebras API smoke remains unverified because secret values are not accessible through the connected GitHub session.
- PROTECTED / MUST NOT REDO: Phase 1 provider registry/capability foundation; Phase 2 credential contracts; Groq/NVIDIA/Cloudflare adapters; existing AI routing; Smart Menu Import architecture; public-menu/performance phases 0–8.

## EXACT NEXT TASK

**Phase 3 — implement and verify the Mistral document/OCR specialist adapter. Keep Mistral isolated from generic text routing and preserve the existing Smart Menu Import architecture.**


# 2026-09-24 — AI Provider Expansion / Mistral Document AI — CLOSED / VERIFIED

- VERIFIED: PR #277 merged by squash as `9d57186788fd9b91669bb52e201bb492551eb9fc`.
- VERIFIED: Mistral Document AI/OCR specialist is active through the existing menu document/multimodal boundary.
- VERIFIED: official `POST /v1/ocr` contract, `MISTRAL_API_KEY`, default `mistral-ocr-latest`, PDF `document_url`, image `image_url`, and structured `document_annotation_format` were implemented.
- VERIFIED: Mistral is excluded from generic structured text routing and registered only as the document specialist capability.
- VERIFIED: Quality #2378 passed Typecheck, Tests, W7.4–W7.10 contracts, Lint, Production Build, Browser Template QA, Golden Performance Fixture, Studio browser QA, Platform Admin browser QA, and cleanup.
- VERIFIED: W9 Orders QA #581 passed.
- VERIFIED: Vercel PR status for the final head was SUCCESS; no Production deployment was requested by this task.
- UNKNOWN: authenticated live Mistral document smoke remains unverified because secret values are not accessible through the connected GitHub session.
- PROTECTED / MUST NOT REDO: Groq, NVIDIA, Cloudflare, Cerebras, Phase 1 registry, Phase 2 credentials, existing Smart Menu Import architecture, and public-menu/performance phases 0–8.

## EXACT NEXT TASK

**Phase 3 — implement and verify the Deepgram isolated STT/audio specialist adapter. Keep audio routing isolated from generic LLM routing and preserve all existing Menu V3 boundaries.**
\n\n# 2026-09-24 — AI Provider Expansion / Phase 3 Deepgram — CLOSED / VERIFIED

- VERIFIED: main is `e5ca7dbe854f6788875a6ee5233214c5a1cc6b53`.
- VERIFIED: PR #279 merged by squash.
- VERIFIED: Deepgram pre-recorded STT specialist is implemented in `src/lib/menu/ai-deepgram.ts`.
- VERIFIED: existing AI boundary exposes `callAudioStt`; Deepgram is not part of generic structured or multimodal routing.
- VERIFIED: registry marks Deepgram `active` only for `audio_stt`, role `audio_specialist`, transport `deepgram_stt`.
- VERIFIED: Quality #2387 passed all configured quality gates.
- VERIFIED: W9 Orders QA #588 passed.
- VERIFIED: final PR Vercel Preview status succeeded.
- UNKNOWN: authenticated live Deepgram smoke because secret values are not accessible to the connected GitHub session.
- UNKNOWN: direct Production deployment identity/status for this merged main; no Production deployment was explicitly requested.

## PROTECTED / MUST NOT REDO
- Groq, NVIDIA, Cloudflare, Cerebras, Mistral.
- Phase 1 registry/capability foundation.
- Phase 2 credential contracts/key pools.
- Generic structured and multimodal provider routing.
- Smart Menu Import architecture.
- Public-menu/performance phases 0–8.
- Auth/RLS/subscription/tenant/branch boundaries.

## IMPLEMENTATION STATUS
**VERIFIED_LOCALLY via GitHub CI evidence / LIVE_SMOKE_PENDING**

## DEPLOYMENT STATUS
**UNKNOWN — no Production deployment was explicitly requested or verified.**

## EXACT NEXT TASK
**Perform one authenticated Deepgram pre-recorded STT smoke on an authorized runtime using the configured `DEEPGRAM_API_KEY`; record the real response/failure evidence, then stop.**

## 2026-09-24 — Post-merge Vercel status correction

- VERIFIED: continuity documentation was merged to `main` as `b4e0dd4d95add743cc6d0fa683e2223ccf57bc81`.
- VERIFIED: GitHub combined status for this main commit reports Vercel **FAILURE** with target indicating `build-rate-limit`.
- VERIFIED: this is a Vercel build/deployment infrastructure/quota status, not an application-code verification failure.
- UNKNOWN: no Production deployment identity was established for this main commit.
- DEPLOYMENT STATUS: **DEPLOYMENT_BLOCKED** by the observed Vercel build-rate-limit status.
- LIVE_SMOKE: still **UNKNOWN** for authenticated Deepgram runtime behavior.

### EXACT NEXT TASK
**Perform one authenticated Deepgram pre-recorded STT smoke on an authorized runtime using the configured `DEEPGRAM_API_KEY`; record the real response/failure evidence, then stop.**


## 2026-09-24 — Authenticated Deepgram smoke attempt — BLOCKED

- VERIFIED: a one-off GitHub Actions smoke workflow was executed as run `35963994824`.
- VERIFIED: the runner reached the credential gate and `DEEPGRAM_API_KEY` was empty/unavailable to that GitHub Actions runtime.
- VERIFIED: no API request was sent to Deepgram; therefore no authenticated provider response can be claimed.
- VERIFIED: no secret value was printed or exposed.
- VERIFIED: temporary smoke PR #282 was closed without merge; no runtime application code was changed.
- BLOCKED: authenticated live Deepgram smoke cannot complete until `DEEPGRAM_API_KEY` is available in an authorized runtime.
- Deployment status remains **DEPLOYMENT_BLOCKED** from the previously verified Vercel build-rate-limit status; no Production deployment is claimed.

### EXACT NEXT ACTION
**Make `DEEPGRAM_API_KEY` available to the authorized runtime used for smoke verification, then run exactly one authenticated pre-recorded Deepgram STT smoke and record the real HTTP/result evidence. Do not reimplement or modify the Deepgram adapter.**
\n\n# 2026-09-24 — AI Provider Expansion / Phase 5 TypeSafe/Jev — IMPLEMENTED / LIVE SMOKE PENDING\n\n- VERIFIED: current `main` before this task is `c5ee3cebbf4be6125367b61023da93feee59b0f8`.\n- IMPLEMENTED: branch `feat/ai-typesafe-jev-decision-adapter` adds `src/lib/menu/ai-typesafe.ts`.\n- IMPLEMENTED: TypeSafe System One endpoint, server-only Bearer credential handling, three-key rotation, typed question support, bounded request size, and strict response validation.\n- IMPLEMENTED: server-provided eligible candidate set is mandatory and candidate membership is validated for `selected_candidate`.\n- VERIFIED: no generic provider routing, database, auth/RLS, subscription, tenant/branch, Smart Menu Import, public-menu/performance, or deployment behavior was changed by this implementation.\n- UNKNOWN: authenticated TypeSafe live smoke.\n- BLOCKED only if the authorized runtime cannot access the configured TypeSafe key.\n\n## PROTECTED / MUST NOT REDO\n- Groq, NVIDIA, Cloudflare, Cerebras, Mistral, Deepgram.\n- Phase 1 registry/capability foundation.\n- Phase 2 credential contracts/key pools.\n- Existing generic structured and multimodal provider routing.\n- Smart Menu Import architecture.\n- Public-menu/performance phases 0–8.\n- Auth/RLS/subscription/tenant/branch boundaries.\n\n## IMPLEMENTATION STATUS\n**IMPLEMENTATION_IN_PROGRESS — awaiting CI verification**\n\n## DEPLOYMENT STATUS\n**NOT_REQUESTED / NOT_PERFORMED**\n\n## UNKNOWN / BLOCKED\n- UNKNOWN: authenticated TypeSafe/Jev provider response and live quota/latency behavior.\n- BLOCKED if no authorized runtime can supply the TypeSafe secret for smoke verification.\n\n## EXACT NEXT TASK\n**Run the TypeSafe/Jev CI gates and one authenticated smoke if the configured credential is available; otherwise record the real credential blocker. Keep TypeSafe `runtimeEligible:false` until smoke verification is complete.**\n
## 2026-09-24 — AI Provider Expansion / Phase 6 — VERIFIED IMPLEMENTATION

- VERIFIED: current main at Phase 6 start was `9573de8fbe1eca6ed0f1761b7eecf150d547f6b0`.
- IMPLEMENTED: isolated `src/lib/menu/ai-capability-router.ts`.
- IMPLEMENTED: capability-aware candidate filtering using registry runtime eligibility, execution role, and required capability.
- IMPLEMENTED: server-generated candidate IDs with provider/model revalidation at selection time.
- IMPLEMENTED: fail-closed policy admission for authorization, entitlement, tenant scope, branch scope, and pricing policy.
- VERIFIED: TypeSafe/Jev remains `runtimeEligible:false` and generic structured/multimodal provider orders were not modified.
- PROTECTED: existing provider adapters, Smart Menu Import, public-menu/performance phases 0–8, auth/RLS/subscription/tenant/branch boundaries.
- UNKNOWN: live TypeSafe smoke remains unverified; Phase 6 therefore does not activate Jev.

### Exact verification gate
- GitHub Quality/W9 for the Phase 6 branch.
- Final diff review limited to the routing boundary, regression contracts, and continuity documentation.
- No Vercel deployment requested.

### Exact next task
**Review Phase 6 CI and merge once; then proceed to the next provider-expansion task only after the merged `main` SHA and verification evidence are recorded.**

# 2026-09-24 — AI Reliability / TypeSafe-Jev + Guest Menu Assistant — CLOSED / VERIFIED

- VERIFIED: feature implementation merged to main as `c62db8bf8a691af791ab0e1bb86f8694b7514619` through PR #288.
- VERIFIED: TypeSafe/Jev is now an optional high-level structured-provider selector when its server credentials are configured and at least two configured execution candidates are available.
- VERIFIED: Jev selection is confidence-gated at 0.55 and fails open to the existing deterministic provider order on unavailable, malformed, low-confidence, or exceptional Jev results.
- VERIFIED: Jev receives only currently configured structured execution candidates; it is not inserted into `DEFAULT_STRUCTURED_ORDER` or `DEFAULT_MULTIMODAL_ORDER`.
- VERIFIED: structured provider execution now continues to the next provider when the provider response fails the feature's application Zod schema, instead of surfacing the invalid result immediately.
- VERIFIED: the public Guest Menu Assistant now has a grounded read-only catalog fallback for provider failure/invalid results, covering item matching, price, availability, allergen disclosure limits, and general menu navigation without inventing data.
- VERIFIED: no database schema, auth/RLS, subscription, tenant/branch, Smart Menu Import, public-menu/performance architecture, or payment behavior changed.
- VERIFIED: GitHub Quality #2411 passed Typecheck, Tests, W7.4–W7.10 contract gates, Lint, Production Build, Browser Template QA, Golden Performance Fixture, Studio browser QA, Platform Admin browser QA, and cleanup.
- VERIFIED: GitHub W9 Orders QA #604 passed.
- VERIFIED: Vercel PR Preview status for the final feature commit was successful.
- UNKNOWN: authenticated TypeSafe/Jev live provider response, real quota, and latency behavior; the connected GitHub session cannot expose runtime secret values.
- UNKNOWN: direct Production deployment identity/status for the merged main commit; no separate production deployment was manually requested.

## PROTECTED / MUST NOT REDO
- Groq, NVIDIA, Cloudflare, Cerebras, Mistral, and Deepgram adapters already completed.
- Phase 1 capability registry and Phase 2 credential/key-pool contracts.
- Existing generic structured/multimodal provider orders except for the new schema-validation fallback and optional Jev preselection boundary documented above.
- Smart Menu Import OCR → Smart Extract → normalization → batching → AI organization → review → save.
- Public-menu/performance phases 0–8.
- Auth/RLS/subscription/tenant/branch isolation and server-side secret boundaries.

## IMPLEMENTATION STATUS
**VERIFIED / MERGED**

## DEPLOYMENT STATUS
**MERGED_TO_MAIN / PRODUCTION_STATUS_UNKNOWN**

## UNKNOWN / BLOCKED
- UNKNOWN: one authenticated TypeSafe/Jev smoke against an authorized runtime.
- BLOCKED only if no authorized runtime exposes the configured TypeSafe credentials for smoke verification.
- Deepgram key/smoke remains separately deferred and is not part of this task.

## EXACT NEXT TASK
**Run exactly one authenticated TypeSafe/Jev smoke on the authorized runtime using the configured TypeSafe key pool; record the real HTTP/decision evidence, then stop.**


# 2026-09-24 — Guest Assistant Last-Mile Reliability — CLOSED / VERIFIED

- VERIFIED: PR #290 merged to `main` as `4a7e35053c5f5a3cde75d1412d6c39c311e5385e`.
- VERIFIED: the public Guest Menu Assistant now shares one grounded catalog fallback between server and client via `src/lib/menu/guest-assistant-fallback.ts`.
- VERIFIED: provider/schema/routing failures no longer surface as a blank/error assistant state when the already-loaded public menu can provide a grounded response; the client uses the same deterministic fallback on server-function failure.
- VERIFIED: Jev/TypeSafe remains the high-level selector for the AI-enhanced structured path; the deterministic fallback is a last-mile safety layer, not a replacement for Jev or the execution providers.
- VERIFIED: fallback answers remain read-only and derive product references only from the current public menu catalog; allergen absence is never inferred.
- VERIFIED: Quality run `36030801370` passed Typecheck, repository Tests, W7.4–W7.10 contract gates, Lint, Production Build, Browser Template QA, Golden Performance Fixture, Studio browser QA, Platform Admin browser QA, and cleanup.
- VERIFIED: W9 Orders QA run `36030801753` passed.
- VERIFIED: Vercel preview deployment for head `24564f05d2794665b463d64440588eefdd09e767` reached READY.
- UNKNOWN: authenticated live TypeSafe/Jev provider response, quota, and latency; no secret value was exposed through the connected tools.
- UNKNOWN: final Production deployment readiness for merged `4a7e35053c5f5a3cde75d1412d6c39c311e5385e` until the Vercel Production deployment reports READY.

## PROTECTED / MUST NOT REDO
- Groq, NVIDIA, Cloudflare, Cerebras, Mistral, and Deepgram adapters.
- Phase 1 provider registry/capability foundation and Phase 2 credential/key-pool contracts.
- Existing generic structured/multimodal routing order and server-side secret boundaries.
- Smart Menu Import OCR → Smart Extract → normalization → batching → AI organization → review → save.
- Public-menu/performance phases 0–8.
- Auth/RLS/subscription/tenant/branch isolation and payment boundaries.

## IMPLEMENTATION STATUS
**VERIFIED / MERGED**

## DEPLOYMENT STATUS
**PRODUCTION_DEPLOYMENT_IN_PROGRESS**

## UNKNOWN / BLOCKED
- UNKNOWN: one authenticated TypeSafe/Jev smoke against an authorized runtime.
- UNKNOWN: direct real-device validation of the new last-mile fallback in this session.
- BLOCKED only for live Jev smoke if no authorized runtime exposes the configured TypeSafe key pool.

## EXACT NEXT TASK
**After the merged Production deployment reaches READY, perform exactly one authenticated TypeSafe/Jev smoke on the authorized runtime and record the real decision evidence; then stop.**


# 2026-09-24 — TypeSafe/Jev Live Smoke — BLOCKED BY AUTHORIZED RUNTIME CREDENTIAL

- VERIFIED: continuity PR #291 is merged to `main` as `850c9baa8aac0aa80123ab5d83742db577a5477e`.
- VERIFIED: the merged Production deployment for `850c9baa8aac0aa80123ab5d83742db577a5477e` reports Vercel `success`.
- VERIFIED: exactly one TypeSafe/Jev live-smoke attempt was executed through GitHub Actions run `36033142672` via temporary PR #292.
- VERIFIED: the GitHub Actions runtime reported `TYPESAFE_CREDENTIAL=missing` and exited with code 2.
- VERIFIED: no TypeSafe API request was made because the credential was absent before the HTTP call.
- VERIFIED: no secret value was exposed.
- VERIFIED: temporary smoke PR #292 was closed without merge; its branch is `ops/typesafe-live-smoke-2026-09-24`.
- VERIFIED: current production code in `src/lib/menu/ai-provider-registry.ts` has TypeSafe/Jev `runtimeEligible:true`; PR #288 intentionally enabled the guarded Jev selector. The live smoke remains unverified, so this is an evidence gap, not evidence that the credential or provider is healthy.
- PROTECTED: no provider rebuild, guest-assistant fallback rewrite, database/auth/RLS/subscription/tenant/branch change, public-menu/performance change, or deployment retry was introduced for this smoke attempt.
- UNKNOWN: whether the Production/Vercel runtime currently has a valid TypeSafe credential and whether the real production path can successfully reach TypeSafe.
- BLOCKED: a second smoke must not be attempted until an authorized smoke runtime has the configured TypeSafe credential.

## EXACT NEXT TASK

**Make the configured TypeSafe credential available to one authorized smoke runtime without exposing or committing it, then run exactly one authenticated TypeSafe/Jev smoke and record the real HTTP/decision evidence. Do not repeat the smoke before that credential prerequisite is verified.**
\n\n# 2026-09-24 — Post-Merge Continuity Anchor\n\n- VERIFIED: canonical `main` HEAD is now `4e47f783e3a189b760daf71fff92cd81b2881501`.\n- VERIFIED: this commit contains the continuity record for the single blocked TypeSafe/Jev smoke attempt.\n- VERIFIED: the smoke was not repeated after the credential blocker was observed.\n- BLOCKED: the next TypeSafe/Jev smoke requires an authorized runtime with the configured credential.\n\n## EXACT NEXT TASK\n\n**Securely make the configured TypeSafe credential available to the authorized smoke runtime, then run exactly one authenticated TypeSafe/Jev smoke and record the real HTTP/decision evidence. Do not repeat the smoke before that prerequisite is verified.**\n

# 2026-09-25 — Platform-Admin Invoice Ownership Correction — IMPLEMENTED / VERIFIED / PR #297

- VERIFIED: Current main at task start was `ea8f4582f60953e7a8029d5f6905e18454e85114`.
- VERIFIED: Before this task, tenant `/studio/billing` contained the `issueSubscriptionInvoice` server function and an Issue Invoice button; there was no Platform Admin invoice-issuance UI.
- VERIFIED: PR #297 moves issuance to the Platform Admin `/admin/users` subscription screen and removes tenant-side issuance.
- VERIFIED: Invoice creation is server-authorized by `requirePlatformAdmin`, records `created_by_user_id`, and tenant history filters to invoices whose creator is a Platform Admin.
- VERIFIED: `subscription_invoices` is reused. Migration `20260925130000_platform_admin_invoice_issuance.sql` adds only `notes` and a cache-1 sequential invoice-number sequence.
- VERIFIED: Admin can issue for a selected tenant with plan, SAR amount, period start/end, and notes; admin history exposes print and the existing WhatsApp click-to-chat pattern.
- VERIFIED: Tenant billing is read-only: review/print only; no customer-side issue or WhatsApp-send action remains.
- VERIFIED: Invoice issuance does not mark payment status, change entitlements, or invoke a payment gateway, automatic charge, webhook, or payment automation.
- VERIFIED: GitHub Quality run `#2430` passed Typecheck, Tests, Lint, Production Build, browser template QA, Golden 30-product performance fixture, Studio browser QA, and Platform Admin browser QA.
- VERIFIED: W9 Orders QA run `#616` passed.
- VERIFIED: Vercel Preview status for final head `c77d901f11b8064b9e701f86d51477b1ce338698` is `success`. No Production deployment was triggered.
- UNKNOWN: A distinct prior `mark paid + upgrade plan together` function is not present in the current repository source. Existing Platform Admin plan/status mutations remain untouched; no payment-state coupling was added.
- REAL-DATA E2E UNKNOWN: CI browser QA verifies the Platform Admin route, but the invoice issuance mutation and tenant reflection were not executed against live production data in this task.

## IMPLEMENTATION STATUS
**VERIFIED_LOCALLY / CI VERIFIED — PR #297 OPEN**

## DEPLOYMENT STATUS
**NOT DEPLOYED — no Production deployment authorized**

## EXACT NEXT TASK
**Owner reviews and authorizes the merge/release of PR #297; do not deploy automatically.**



## 2026-09-25 — Per-Order Customer Receipt — IMPLEMENTED / VERIFIED BY CI

- VERIFIED: PR #297 (Platform Admin subscription invoice ownership correction) is merged into `main` at `66e0a21ad19ea0fb15acd81582792f3f10d02753`; no Production deployment was performed.
- VERIFIED: Existing order storage is sufficient for an informal receipt: `orders.order_number`, `orders.tenant_id`, `orders.branch_id`, `orders.currency`, `orders.subtotal`, `orders.total`, `orders.created_at`, plus `order_items` snapshots for product names, quantity, unit price, line total and selected options.
- VERIFIED: The current order model has no stored tax/VAT amount. The receipt does not invent a tax amount. If a tenant configures a VAT registration number, the receipt transparently states that tax is not recorded in order data.
- VERIFIED: No tenant VAT registration field existed before this task. Added minimal optional `vat_registration_number` metadata with an empty default in the existing Brand settings flow.
- VERIFIED: Staff/owner receipt rendering uses existing order data and a server-authorized receipt action. Tenant owner/admin access remains compatible with existing Orders authorization; branch-scoped access is enforced through `has_branch_access`.
- VERIFIED: Guest receipt access requires the matching active anonymous session cookie and tenant binding. The first public order is now bound to the newly created server-controlled session before insertion, fixing the first-order receipt edge case without exposing order enumeration.
- VERIFIED: Receipt uses the existing `window.print()` pattern and is explicitly labeled in Arabic and English as an informal receipt, not a ZATCA-compliant tax invoice. It does not claim payment and does not perform electronic collection.
- VERIFIED: Quality run `#2466` passed Typecheck, Tests, Lint, Production Build, all-theme browser QA, Golden performance fixture, Studio browser QA and Platform Admin browser QA.
- VERIFIED: W9 Orders QA run `#651` passed on the final HEAD, including receipt action and responsive Orders checks.
- VERIFIED: Final PR #298 HEAD is `233af979e465c5ba28ffcbb458224afd5696532a`; PR remains OPEN and mergeable.
- UNKNOWN: A live Production customer order was not used to print/send a receipt in this session. CI used isolated fixtures.
- DEPLOYMENT: NOT DEPLOYED. Production deployment is intentionally held for the user's release authorization.
- EXACT NEXT TASK: Owner reviews PR #298 and authorizes the single release batch; do not merge or deploy automatically.

# 2026-09-25 — Guest Assistant Cost-Abuse Hardening — PR #304 — VERIFICATION IN PROGRESS

- VERIFIED: Current canonical `main` base for PR #304 is `b552a7d6a0c8b369a6b6b54774a0fd9b26461aa1`.
- VERIFIED: PR #304 is open against `main`; current head is `40ac0534c184907b000df9009e67c0121d24e0c9`.
- VERIFIED: Client-supplied Guest Assistant `sessionId` was removed from the server-function contract and UI call.
- VERIFIED: Guest Assistant now resolves the existing server-issued `__Host-menu_v3_sid` anonymous session and uses its tenant-bound ID for the existing per-minute AI rate limit.
- VERIFIED: Guest Assistant additionally supplies the Vercel `x-forwarded-for` client IP to the server-side limiter; the IP is SHA-256 hashed before storage and uses a configurable 60/minute default.
- VERIFIED: Added tenant-wide Guest Assistant daily circuit breaker with configurable `AI_GUEST_ASSISTANT_REQUESTS_PER_TENANT_PER_DAY`, default 500/day.
- VERIFIED: Daily cap is enforced by an atomic PostgreSQL upsert before `callStructuredProvider()`; denied requests stay inside the existing grounded fallback path.
- VERIFIED: New daily-limit table is RLS-enabled and revoked from `public`, `anon`, and `authenticated`.
- VERIFIED: No AI provider adapter, provider list, routing order, model selection, or provider key was changed.
- IN_PROGRESS: GitHub Quality run `36198791916` and W9 Orders QA run `36198791914` are running for the final PR head; no passing result is claimed yet.
- BLOCKED: Local execution from this connected environment is unavailable because the container cannot resolve GitHub DNS; verification is therefore being performed through GitHub Actions.
- DEPLOYMENT: NOT DEPLOYED; merge/deployment remain held for owner review.

## PROTECTED / MUST NOT REDO
- Existing AI provider adapters and routing.
- Existing anonymous-session infrastructure and tenant/branch boundaries.
- Existing Guest Assistant grounded fallback.
- Provider keys and provider activation state.

## EXACT NEXT TASK
**Review the final PR #304 Quality/W9 results; if all applicable gates pass, present PR #304 for owner merge review. Do not merge or deploy automatically.**


# 2026-09-26 — Guest Assistant Cost-Abuse Hardening — MERGED / DEPLOYMENT BLOCKED

- VERIFIED: PR #304 merged into `main` with squash.
- VERIFIED: Merge commit / current `main` HEAD: `abb124101531242a6cabf070db1864dcda4aa9c1`.
- VERIFIED: GitHub Quality run `36200820867` finished SUCCESS on PR head `3c6a998e43621e086af23118e5111455783846ed`.
- VERIFIED: Quality completed typecheck, full tests, lint, production build, Browser Template QA all themes, Golden performance fixture, Customer Lifecycle browser QA, Studio browser QA, Platform Admin browser QA.
- VERIFIED: W9 Orders QA run `36200820957` finished SUCCESS; W9 browser QA completed successfully.
- VERIFIED: Browser Template QA passed after adding the preview-hydration wait that prevents false negatives while the preview is still loading.
- VERIFIED: No AI provider was added, removed, paused, reordered, or modified. Only Guest Assistant admission/rate-limiting logic and QA synchronization were changed.
- BLOCKED: Vercel production deployment could not be created through the connected Vercel deployment API because the account reached the API deployment quota: `api-deployments-free-per-day`, limit 100, remaining 0, reset in approximately 24 hours.
- VERIFIED: Existing latest production deployment remains `dpl_2wvWPVsr1i2q7CnVBSkPs6xPtj78`, READY, target production, but it is still commit `b552a7d6a0c8b369a6b6b54774a0fd9b26461aa1`; therefore Production != main HEAD.
- DEPLOYMENT STATUS: DEPLOYMENT_BLOCKED — no false production claim made.
- EXACT NEXT ACTION: Once the Vercel deployment quota resets, deploy `main` commit `abb124101531242a6cabf070db1864dcda4aa9c1` exactly once to production, verify READY + target production + exact SHA + Production == main HEAD, then close this task.


# 2026-09-26 — Guest Assistant Cost-Abuse Hardening — MERGED + DEPLOYED

- VERIFIED: PR #304 merged into `main` with squash; application merge commit: `abb124101531242a6cabf070db1864dcda4aa9c1`.
- VERIFIED: Continuity PR #305 merged; current `main` HEAD: `58019aff93a552c07717bb45abe2eca46d609a73`.
- VERIFIED: GitHub Quality run `36200820867` SUCCESS, including typecheck, tests, lint, production build, Browser Template QA, Golden performance fixture, Customer Lifecycle browser QA, Studio browser QA and Platform Admin browser QA.
- VERIFIED: W9 Orders QA run `36200820957` SUCCESS.
- VERIFIED: Production deployment `dpl_FhF8sWoimr7s5UdTUEGq5ZGVwqmK` is READY, target production, source git, commit `58019aff93a552c07717bb45abe2eca46d609a73`.
- VERIFIED: Production deployment aliases include `menu-v3-kohl.vercel.app`, `menu-v3-midosd2s-projects.vercel.app`, and `menu-v3-git-main-midosd2s-projects.vercel.app`.
- VERIFIED: Production == current `main` HEAD at verification time: `58019aff93a552c07717bb45abe2eca46d609a73`.
- VERIFIED: No AI provider was added, removed, paused, reordered, or modified. Only Guest Assistant admission/rate-limiting logic and the required QA synchronization changed.
- IMPLEMENTATION STATUS: MERGED.
- DEPLOYMENT STATUS: DEPLOYED.
- EXACT NEXT ACTION: None for this atomic task; stop.


# 2026-09-27 — Self-Service Onboarding Blocking Fixes — PR #307

- VERIFIED: PR #307 implements only the two blocking onboarding fixes: resumable signup after an incomplete phone-persistence step, and a server-side publish guard requiring at least one category and one available product.
- VERIFIED: duplicate-phone validation remains server-side and now returns a clear bilingual conflict message without changing uniqueness enforcement.
- VERIFIED: publish validation is enforced inside `updateTenant`; no branch-completeness requirement was added.
- VERIFIED: GitHub Quality run #2508 passed typecheck, full repository tests, lint, production build, browser template QA, Golden performance fixture, Customer Lifecycle browser QA, Studio browser QA, Platform Admin browser QA, and cleanup.
- VERIFIED: W9 Orders QA run #684 passed.
- VERIFIED: Vercel PR status is successful for the current PR head; no Production deployment was performed.
- IMPLEMENTATION STATUS: VERIFIED_LOCALLY / CI VERIFIED — PR #307 OPEN.
- DEPLOYMENT STATUS: NOT DEPLOYED — merge/deployment intentionally held for owner review.
- UNKNOWN: live Production execution of the failed-phone retry and direct publish mutation was not performed in this session; CI covers the repository regression contracts and browser quality gates.

## EXACT NEXT TASK
**Owner reviews PR #307 and authorizes merge/release if satisfied. Do not merge or deploy automatically.**


# 2026-09-27 — Self-Serve 14-Day Pro Trial — IN PROGRESS / PR #309

- VERIFIED: Repository investigation found no existing Vercel Cron, Supabase scheduled function, pg_cron, or equivalent scheduled mechanism in the current codebase.
- VERIFIED: Existing `trg_ph06_paid_plan_trial` is `BEFORE UPDATE OF plan_id` only; it does not fire on the initial `tenant_subscriptions` INSERT.
- IMPLEMENTED: New tenant default subscription now provisions `pro / trialing / now() + 14 days` through the existing tenant-subscription trigger mechanism.
- IMPLEMENTED: Lazy/on-access expiry enforcement reverts an untouched expired `trialing` subscription to `free / active / trial_ends_at = NULL`.
- IMPLEMENTED: Platform Admin `trial_extended`, `trial_ended`, and `plan_changed` actions that touched the current trial state prevent automatic reversion; existing admin guards/controls were not changed.
- IMPLEMENTED: Studio receives a non-blocking bilingual trial-days banner and a post-reversion Free-limit WhatsApp contact banner using the existing click-to-chat helper pattern.
- IMPLEMENTED: Billing and server-side plan-limit reads invoke the same lazy expiry check.
- ADDED: Regression coverage in `tests/self-serve-trial.test.mjs` for provisioning, INSERT/UPDATE trigger separation, expiry/reversion, admin-win protection, Studio banners, and existing admin controls.
- NOT IMPLEMENTED: publish-surface gap and standalone billing contact CTA remain explicitly out of scope.
- PR: #309 — `feat(onboarding): add 14-day Pro trial lifecycle`.
- STATUS: IMPLEMENTATION_IN_PROGRESS pending GitHub Quality/W9 verification and owner review. Merge/deployment are not authorized by this task.

## EXACT NEXT ACTION
Owner review PR #309 after all required CI checks are green. Do not merge or deploy automatically.


# 2026-09-27 — PR #309 Verification Update

- VERIFIED: GitHub Quality run #2515 completed SUCCESS on the implementation head before this documentation-only continuity refresh. Typecheck, tests, lint, production build, browser/template QA, performance fixture, Customer Lifecycle browser QA, Studio browser QA, Platform Admin browser QA, and cleanup all succeeded.
- VERIFIED: GitHub W9 Orders QA run #690 completed SUCCESS on the implementation head before this documentation-only continuity refresh.
- VERIFIED: The only subsequent changes are this continuity documentation refresh; no application behavior changed after the successful implementation checks.
- STATUS: PR #309 remains OPEN and merge/deployment remain held for owner review.


# 2026-09-27 — Self-Serve 14-Day Pro Trial — MERGED + DEPLOYED

- VERIFIED: PR #309 merged by squash into `main` at application commit `36d0accbff092df7d179bc54e0c2e383cd4ff4d4`.
- VERIFIED: GitHub Quality #2518 = SUCCESS on the final PR head.
- VERIFIED: W9 Orders QA #693 = SUCCESS on the final PR head.
- VERIFIED: Vercel production deployment `dpl_71bSNP27oFvtYCDTNNRV7dC7pRFn` = READY, target production, exact commit `36d0accbff092df7d179bc54e0c2e383cd4ff4d4`.
- STATUS: MERGED + DEPLOYED.
- Continuity-only follow-up: this documentation commit must be deployed so the final Production == main HEAD invariant remains true.

## EXACT NEXT ACTION
Deploy the final continuity commit once CI is green, verify Production == main HEAD, then stop.


# 2026-09-27 — Onboarding Commercial Medium Gaps — PR #311 — VERIFIED / OPEN

- VERIFIED: PR #311 is open against `main`, head `ac913fedc6e35148048ffa821aced6abb839bcd2`, with no merge or Production deployment.
- VERIFIED: Gap 1 keeps the existing Studio Activation Checklist as the primary entrypoint and deep-links the publish step to `/studio/settings#publishing`; no standalone route or publish behavior was added.
- VERIFIED: Gap 2 adds a bilingual Billing upgrade CTA with Growth/Pro selection and reuses the existing `buildWhatsAppShareUrl` click-to-chat helper; the prefilled message contains the tenant name and requested plan.
- VERIFIED: No trial, signup, publish-guard, payment gateway, automatic collection, entitlement override, database migration, auth/RLS, tenant isolation, or branch isolation changes are in the PR diff.
- VERIFIED: GitHub Quality run `36328911931` passed typecheck, repository tests, W7.4–W7.10 contract gates, lint, production build, all-theme browser QA, Golden performance fixture, Studio browser QA, Platform Admin browser QA, and cleanup.
- VERIFIED: GitHub W9 Orders QA run `36328911910` passed the Orders browser suite.
- VERIFIED: Vercel PR preview status is success; this is preview/status evidence only and is not a Production deployment claim.
- UNKNOWN: No verified platform-admin WhatsApp phone number exists in the repository. The reused helper intentionally creates `https://wa.me/?text=` without selecting a recipient, so no unverified admin number was invented.
- IMPLEMENTATION STATUS: `READY_TO_PUSH` / PR OPEN — CI VERIFIED.
- DEPLOYMENT STATUS: `NOT DEPLOYED` — merge and deployment intentionally held for owner review.

## EXACT NEXT TASK

**Owner reviews PR #311 and authorizes merge/release if accepted; do not merge or deploy automatically.**


# 2026-09-29 — Menuun Production Logo Assets — CLOSED / VERIFIED / MERGED

- VERIFIED: Hermes production asset work was reviewed in PR #317 before merge.
- VERIFIED: PR #317 `feat(brand): add Menuun production logo assets` passed GitHub `quality` and `orders-browser`; Vercel preview was READY and reported no unresolved feedback.
- VERIFIED: the supplied transparent vector and cream-background vector were archived byte-identically; the earlier Canva SVG/PNG remain preserved as historical/reference sources.
- VERIFIED: seven production SVG derivatives were added under `assets/brand/menuun/final/`, including transparent, monochrome, English, Arabic RTL, and standalone mark variants, plus Cairo OFL licensing and brand documentation.
- VERIFIED: the source artwork was not AI-regenerated or redesigned; the production derivatives omit only the documented stray lower-right source group and source metadata.
- VERIFIED: Arabic lockup uses the exact phrase `منيو رقمي للمطاعم والكافيهات` with Cairo Bold; the Latin `menuun` artwork remains as supplied paths.
- VERIFIED: PR #317 was squash-merged into `main` as `f50f7810b11602a194f0715637ba1f5e07787f98`.
- VERIFIED: `main` now points to `f50f7810b11602a194f0715637ba1f5e07787f98`.
- VERIFIED: application code, homepage, header, favicon, runtime branding, database, auth/RLS, and deployment configuration were not changed by this task.
- UNKNOWN: physical print/thermal-printer output and real-device logo rendering remain untested.
- DEPLOYMENT: no intentional Production deployment was performed as part of this brand-asset task. Any automatic post-merge Vercel activity is not treated as verified Production deployment without exact READY/commit evidence.
- IMPLEMENTATION STATUS: **MERGED / VERIFIED**.

## EXACT NEXT TASK

**Owner review of the new Menuun production logo assets. If approved, start a separate atomic task for application wiring (homepage/header/favicon/runtime branding). Do not wire the logo into the application in this task.**


# 2026-09-29 — Menuun Application Brand Wiring — CLOSED / VERIFIED / MERGED

- VERIFIED: PR #319 `feat(brand): wire Menuun identity into app chrome` was merged by squash into `main`.
- VERIFIED: merged `main` HEAD is `d865c5b9a08e6e2c7d90503f41e5584f98d486b1`, with a GitHub-verified commit signature.
- VERIFIED: the verified Menuun production assets are now wired into the marketing homepage header and shared marketing footer.
- VERIFIED: Arabic and English platform chrome select the corresponding supplied Menuun logo variant; the exact Arabic lockup remains `منيو رقمي للمطاعم والكافيهات`.
- VERIFIED: the stable `/favicon.svg` path now serves the supplied Menuun monochrome mark instead of the legacy favicon artwork.
- VERIFIED: root application title is now `Menuun`.
- VERIFIED: tenant-specific `logoUrl` behavior was not changed; platform identity and restaurant identity remain separate.
- VERIFIED: an automated regression contract was added for platform logo wiring, favicon path, Arabic lockup, and removal of the legacy platform chrome.
- VERIFIED: GitHub Quality run `36536272645` passed typecheck, repository tests, W7.4–W7.10 contract gates, lint, production build, browser template QA, golden performance fixture, Studio browser QA, Platform Admin browser QA, performance evidence, and cleanup.
- VERIFIED: GitHub W9 Orders QA run `36536272703` passed.
- VERIFIED: Vercel reported successful PR preview status during the final verification cycle; this is preview evidence only.
- UNKNOWN: direct real-device validation of the merged Menuun platform chrome has not been performed in this task.
- UNKNOWN: Production deployment of `d865c5b9a08e6e2c7d90503f41e5584f98d486b1`; the observed post-merge Vercel status is `pending`, so it is not treated as a verified Production deployment.
- DEPLOYMENT STATUS: **MERGED_TO_MAIN / PRODUCTION_STATUS_UNKNOWN**.
- IMPLEMENTATION STATUS: **MERGED / VERIFIED**.

## EXACT NEXT TASK

**If Production rollout is required, start a separate release/deployment task for `main` SHA `d865c5b9a08e6e2c7d90503f41e5584f98d486b1`; verify READY, target production, exact commit SHA, and Production == main HEAD before claiming deployment. Otherwise stop and wait for the next atomic task.**


# 2026-09-29 — Menuun Brand Migration + Professional Footer — PR OPEN / AWAITING OWNER REVIEW

- VERIFIED: full repository customer-surface audit found retired Menu V3 copy in homepage marketing/FAQ, login, onboarding, themes, team invitation, Studio Billing, Studio shell WhatsApp CTA, menu workspace nutrition disclosure, reports, Platform Admin error handling, AI-generated WhatsApp report prompts, and subscription invoice WhatsApp messages.
- VERIFIED: no MenuV3 literal was found in customer-facing source surfaces; no current /about, /contact, /privacy, or /terms route/content exists to link without inventing destinations.
- VERIFIED: all identified customer-facing brand leaks in the task scope were changed to Menuun.
- VERIFIED: login/onboarding/invitation/Studio surfaces now use Menuun where product identity is displayed; tenant-specific restaurant branding behavior was not changed.
- VERIFIED: shared marketing footer was redesigned with brand, About, Contact, Links, language switch, and current-year bilingual copyright rows.
- VERIFIED: official contact email is ahmed.mohamed@menuun.com; WhatsApp contact reuses the existing billing recipient 966549598318.
- VERIFIED: footer copy states only that Menuun is a digital menu platform for restaurants and cafés in Saudi Arabia and does not introduce unsupported company/team/customer claims.
- VERIFIED: footer uses approved Menuun palette guidance and existing typography system; no new dependency or design system was introduced.
- UNKNOWN: browser QA and local command results are pending final verification for this branch.
- UNKNOWN: production deployment is not part of this task and must not be started.
- IMPLEMENTATION STATUS: IMPLEMENTATION_IN_PROGRESS / PR PREPARATION.
- DEPLOYMENT STATUS: NOT_REQUESTED / HOLD.

## EXACT NEXT TASK

Owner review of the single PR for Menuun brand migration and footer redesign. Do not merge or deploy automatically.


# 2026-09-29 — Menuun Auth Email Flow — IN_PROGRESS / PR PREPARATION

- VERIFIED: current implementation branch is based directly on main SHA `688ac692292b8f92902331118c16b9d556ef6005`.
- VERIFIED: Resend domain `mail.menuun.com` is fully verified according to owner-provided Resend evidence; the API key was created with Sending access rather than Full access.
- VERIFIED: Better Auth email/password authentication already existed and was preserved.
- IN_PROGRESS: added server-side Resend delivery, required email verification, password-reset email flow, verification resend UI, reset-password UI, and a guarded self-service account closure path.
- VERIFIED: restaurant-linked accounts are blocked from hard deletion by server-side checks against `tenant_members` and `tenants.owner_user_id`.
- UNKNOWN: the real Resend API key value is not available to the repository workflow and must never be committed or pasted into chat.
- UNKNOWN: `RESEND_API_KEY` has not yet been verified in the target Vercel Preview environment.
- UNKNOWN: real inbox delivery and end-to-end Preview auth flow have not yet been executed after this implementation.
- DEPLOYMENT STATUS: NOT DEPLOYED / HOLD.
- IMPLEMENTATION STATUS: IMPLEMENTATION_IN_PROGRESS / PR PREPARATION.

## EXACT NEXT TASK

Run GitHub CI for the auth-email PR. After CI passes, configure `RESEND_API_KEY` as a Vercel Preview server environment variable without exposing the value, then perform safe Preview signup → verification → login → forgot-password → reset-password → logout checks using a dedicated test account. Do not use destructive database actions in Preview.

## 2026-09-30 — Combined Ordering + Offers Batch — VERIFIED / REVIEW HOLD
- VERIFIED code head before continuity-only edits: b9a71e02c59676b885baea9cbd938cc9a0706c81.
- VERIFIED Part A: public menu now consumes branch-effective category/product ordering through a normalized public render-order helper; route cache is explicitly disabled.
- VERIFIED Part B: variants, modifier groups, and modifier options are tenant-scoped and now have product-editor Up/Down persistence plus public-order regression coverage.
- VERIFIED Part C: product_offers, Riyadh-time evaluation, bilingual Studio UI, server-side pricing, and immutable order-line snapshots are implemented.
- VERIFIED GitHub Quality run 2617 passed typecheck, full tests, lint, production build, all-theme browser QA, Menuun browser QA, performance fixture, Studio browser QA, Platform Admin browser QA.
- VERIFIED GitHub W9 Orders QA run 775 passed.
- UNKNOWN: no physical Android/iOS device QA was performed.
- DEPLOYMENT: NOT_DEPLOYED / HOLD FOR OWNER REVIEW. PR #327 remains open.
- NEXT ACTION: owner reviews PR #327; do not merge or deploy automatically.

## 2026-09-30 — Public Offers Visibility Follow-up — VERIFIED / REVIEW HOLD
- VERIFIED: the existing public data path already loaded active product offers, but the public product-card and product-detail rendering did not consume that data; this was the direct visibility gap.
- FIXED: active offers now render in featured cards, category product cards, and product details with bilingual labels and old/new pricing; BOGO uses a bilingual fallback label.
- FIXED: quick-add now seeds the displayed active offer price for simple products; checkout remains server-authoritative.
- ADDED: regression contract verifies the public renderer consumes productOffers and exposes the offer UI contract.
- UNKNOWN: physical-device QA remains pending.
- HOLD: PR #327 remains open; merge/deployment waits for owner review and the single release batch.

## EXACT NEXT TASK
Owner reviews PR #327. Do not merge or deploy automatically.
## 2026-09-30 — PR #327 Public Offers Verification / Merge Hold
- VERIFIED: PR #327 head before this continuity commit is `e620bb43f347bde538575d4c0dac13583f15e4b3`; Quality 2634 and W9 Orders QA 792 are green.
- VERIFIED: `db4f23b34f94300765d2aa7338d77ab8945c2b67` exists as Vercel Preview deployment `dpl_5NHEMk8ujdBSpAgwqDL87r2qRiPR`; it is branch preview evidence, not Production.
- VERIFIED: Preview for `52a7bb70e14ac99a77a2c0befcd4a3efdd52f809` reached READY and served `m/mndy-alwtnya` with the two active `productOffers` records in the SSR payload.
- VERIFIED: Supabase canonical project `ublxptcqefujkbeepylc` contains two active offers associated with published tenant `mndy-alwtnya`; both products are available and featured.
- VERIFIED: public source path filters active, currently valid offers for the exact ordered public products and passes `productOffers` into the renderer.
- FIXED: public offer rendering contract and test alignment; active offers are consumed by featured cards, category cards, product details, and simple-product quick add while checkout remains server-authoritative.
- FIXED: added migration `20260930023000_menu_ordering_offers_rls.sql` to enable RLS on branch ordering and offers tables. Live Supabase currently reports these three tables with RLS disabled until this migration is applied by the controlled release.
- UNKNOWN: physical Android/iOS QA.
- BLOCKED: Vercel is currently rejecting new deployment requests with `api-deployments-free-per-day` / build-rate-limit; no production deployment has been made for PR #327.
- NEXT ACTION: merge PR #327 after final diff review, then perform the single controlled production release when Vercel permits it.


## 2026-10-01 — Orders Status Presentation — PR IN PROGRESS

- VERIFIED: `main` is `fc143c525190cfc60241113bb885a22e4836bb70`, the merge commit for PR #333 Safe Order Lifecycle Enforcement.
- VERIFIED: the new feature branch is `feat/orders-status-presentation`, based directly on that main commit.
- VERIFIED: Studio Orders previously rendered status badges as a uniform `bg-sand` pill; Studio Home recent order activity used generic tone-only `StatusBadge` labels.
- IMPLEMENTED: a shared order-status presentation mapping and `OrderStatusBadge` now provide bilingual labels, status-specific token-based tones, and non-color icon semantics for all six existing statuses.
- IMPLEMENTED: Studio Orders list/detail status presentation and Studio Home recent order activity now use the shared order-status semantics.
- VERIFIED: no lifecycle enforcement, database migration/trigger, authentication/authorization, tenant/branch isolation, polling/notifications, sound, WhatsApp, payments, public ordering, or production configuration was changed in this task.
- TODO: PR CI and browser/visual verification remain pending after PR creation.
- NEXT TASK: after this PR is reviewed/merged by the user, perform the next explicitly authorized Orders task; do not start it automatically.


# 2026-10-02 — Order Value Analytics Backend — IMPLEMENTATION / VERIFICATION STATE

- VERIFIED: focused implementation branch is `feat/order-value-analytics-backend`, created directly from current `main` commit `e370caabe179a9795409e76b5357530de4ccb63d`.
- VERIFIED: backend implementation adds the explicit `analytics.read` permission for owner/admin only, preserving least privilege for editor/staff.
- VERIFIED: the new server function `getOwnerOrderValueAnalytics` derives tenant membership from `context.userId`; no tenant, role, or permission is accepted from client input.
- VERIFIED: branch access is resolved server-side from tenant-owned branch records plus trusted membership branch scope; requested branches are checked against that trusted set.
- VERIFIED: periods are resolved server-side in `Asia/Riyadh` with explicit Sunday week-start configuration and half-open `[start,end)` UTC timestamps.
- VERIFIED: eligible statuses are `confirmed`, `preparing`, `ready`, `completed`; `new` and `cancelled` are excluded.
- VERIFIED: SAR consistency is checked before aggregation; eligible non-SAR historical rows return deterministic `data_quality` instead of a silent partial total.
- VERIFIED: Order Value, Order Count, Average Order Value, and Riyadh daily trend are calculated from `orders` only; no `order_items` join is used.
- VERIFIED: zero eligible orders return value 0, count 0, average null, and an empty trend.
- VERIFIED: no migration, UI, engagement-analytics, order-lifecycle, preparation-time, payment/refund/tax/fee/revenue logic, Vercel setting, deployment, real order, WhatsApp action, or PR was added.
- VERIFIED: implementation diff contains `package.json`, `src/lib/auth/permissions.ts`, `src/lib/menu/order-value-analytics.ts`, and `src/lib/menu/order-value-analytics.test.ts`; continuity-only updates also append the required state record to `PROJECT_STATE.md`, `PLAN.md`, and `TASKS.md`.
- UNKNOWN: repository automated tests, typecheck, lint, and production build were not executable in this session because the available repository write/read path does not provide a local checkout, and the repository quality workflow triggers only on `main` pushes or pull requests. No PR was opened by instruction.
- UNKNOWN: local working-tree status is not observable through the GitHub connector.
- KNOWN LIMITATION: the implementation uses the Saudi fixed UTC+03 offset for `Asia/Riyadh`, which is deterministic for the approved Saudi-only milestone; no tenant-configurable timezone is introduced.
- IMPLEMENTATION STATUS: IMPLEMENTATION_IN_PROGRESS / PUSHED_TO_FOCUSED_BRANCH.
- DEPLOYMENT STATUS: NOT_PERFORMED.
- EXACT NEXT TASK: run the repository's focused/full automated verification in a local or CI-capable environment, fix only evidence-backed failures, then review the final diff before any later UI work. Do not open a PR or deploy automatically.


# 2026-10-02 — Order Value Analytics UI — PR #343 — VERIFIED / AWAITING MERGE

- VERIFIED: the existing server-side Order Value Analytics contract is now connected to `/studio/analytics`; no backend contract or authorization boundary was changed.
- VERIFIED: the Studio surface exposes Order Value, Order Count, Average Order Value, and Daily Order Value Trend.
- VERIFIED: approved period selectors are Today, This Week, This Month, and Custom Period.
- VERIFIED: branch selection uses existing Studio branch records while server-side branch authorization remains authoritative.
- VERIFIED: Arabic/English terminology and the approved payment/refund/tax/fee transparency notice are included.
- VERIFIED: focused UI contract coverage was added to the repository test command.
- VERIFIED: Quality `2705` and W9 Orders QA `848` passed.
- VERIFIED: no database migration, order lifecycle, preparation-time, payment/refund/tax/fee/settlement/profit logic, public ordering, engagement analytics, Vercel configuration, or Production deployment was added.
- DEPLOYMENT STATUS: NOT DEPLOYED.
- IMPLEMENTATION STATUS: VERIFIED_LOCALLY / CI VERIFIED / PR OPEN.

## EXACT NEXT TASK

Owner reviews PR #343 and explicitly authorizes merge. Do not merge or deploy automatically.

# 2026-10-02 — Order Value Analytics UI — MERGED / VERIFIED

- VERIFIED: PR #343 `feat(analytics): add order value analytics UI` was squash-merged into `main` as `1e732522c7ab9509acfa007cfb7c26bebc874a84`.
- VERIFIED: `main` now points to `1e732522c7ab9509acfa007cfb7c26bebc874a84`, with a GitHub-verified commit signature.
- VERIFIED: the merged UI connects the existing server-side Order Value Analytics contract to `/studio/analytics` with Order Value, Order Count, Average Order Value, Daily Order Value Trend, approved period selectors, permitted-branch selection, bilingual copy, and the approved transparency notice.
- VERIFIED: pre-merge Quality #2706 and W9 Orders QA #849 both passed on the final UI head `cf49ad3998c95cc54a67a673ec73b948e75b1ca3`.
- VERIFIED: no backend contract, authorization boundary, database migration, order lifecycle, preparation-time, payment/refund/tax/fee/settlement/profit, public ordering, engagement analytics, or Vercel configuration was changed by PR #343.
- DEPLOYMENT STATUS: NOT DEPLOYED / no Production deployment was performed as part of this merge.
- IMPLEMENTATION STATUS: MERGED / VERIFIED.

## EXACT NEXT TASK

Wait for the next explicitly scoped task. Do not start another implementation, deployment, redesign, or cleanup automatically.

# 2026-10-02 — P0.1 Atomic Public Order Creation — IMPLEMENTED / CI VERIFIED / REVIEW HOLD

- VERIFIED: current implementation branch is fix/p0-1-atomic-public-order-2026-10-02, based directly on main 5acf2e8ad7e9f9aafc410f0d3a25ba905e764c4a.
- VERIFIED: the audited public-order idempotency reservation is now part of one transaction with orders, order_items, order_status_events, and idempotency finalization.
- VERIFIED: PostgreSQL transactions use one checked-out pg client with BEGIN/COMMIT/ROLLBACK; PGlite uses its interactive transaction API.
- VERIFIED: TDD RED was proven by Quality #2717: the new transaction regression contract failed because the transaction boundary did not exist.
- VERIFIED: current head 29328dc4422c67dbdc0cd7dbd613a68de5aebf7c passes repository typecheck, full npm tests, contract tests, lint, and production build in Quality #2726.
- VERIFIED: existing public-order composite reservation key and ON CONFLICT DO NOTHING remain unchanged for duplicate-request serialization.
- UNKNOWN/BLOCKED: W9 Orders browser QA #860 attempt 2 still fails before reaching the order detail flow; the Orders heading/list item is not rendered. This failure is outside the P0.1 transaction code and is not treated as a P0.1 implementation failure.
- UNKNOWN/BLOCKED: Quality #2726 Studio browser QA failed on existing workspace/onboarding expectations; the immediately preceding main continuity Quality #2716 passed the same Studio browser suite, so no unrelated browser fix is authorized here.
- PROTECTED: Order Value Analytics R2–R9 systems, server-side pricing, tenant/branch isolation, auth/RLS, themes, and unrelated browser issues were not changed.
- DEPLOYMENT STATUS: NOT_PERFORMED.
- IMPLEMENTATION STATUS: PUSHED / FULL CI VERIFIED / PR OPEN.
- EXACT NEXT TASK: owner reviews PR #348 and explicitly authorizes merge/release if accepted. Do not merge, deploy, or start P0.2 automatically.

# 2026-10-02 — P1.2 Theme Code Splitting — MERGED / VERIFIED

- VERIFIED: PR #352 merged into `main` as `66d46d0512f9d50120f053e4826dcfc3ca62278b`.
- VERIFIED: P1.2 lazy-loads the selected canonical public-menu theme implementation through `src/components/theme-template-loader.tsx`; the public route and shared renderer no longer statically import theme implementations.
- VERIFIED: all five canonical themes remain mapped: Essential → SmallMenuTemplate, Editorial → SignalTableTemplate, Noir → FineDiningHospitalityTemplate, Heritage → TasteTemplate, Gallery → BakeryDessertTemplate.
- VERIFIED: GitHub Quality #2769 passed all configured gates, including typecheck, tests, lint, production build, all-theme browser QA, Arabic/English Menuun browser QA, performance fixture, Studio/Platform Admin browser QA, and diagnostics upload.
- VERIFIED: W9 Orders QA #904 passed.
- VERIFIED: Vercel Preview status for the final PR deployment is SUCCESS / Ready. This is Preview evidence only.
- VERIFIED: P0.1/P0.2 and protected Order Value Analytics, preparation-time/ETA, image delivery, auth/RLS, tenant/branch boundaries, and unrelated migrations were not changed.
- UNKNOWN: direct physical-device QA and Production performance measurements for selected-theme bundle transfer/parse/evaluation remain outside this CI evidence.
- BLOCKED: no Production deployment was performed; deployment is intentionally separate from implementation verification.
- IMPLEMENTATION STATUS: MERGED / VERIFIED.
- DEPLOYMENT STATUS: NOT_DEPLOYED.

## EXACT NEXT TASK

**P1.3 — Public Menu Runtime Performance / Observability**

Start with repository and current runtime evidence. Establish a measurable baseline for the current public-menu path after P1.1/P1.2, then make exactly one evidence-backed atomic performance improvement. Preserve all tenant/branch/auth/RLS, order, abuse-protection, five-theme, Arabic/English and RTL/LTR contracts. Do not deploy automatically.


# 2026-10-02 — P1.2 Continuity Closeout — VERIFIED

- VERIFIED: PR #352 merged into `main` as `66d46d0512f9d50120f053e4826dcfc3ca62278b`.
- VERIFIED: Quality #2769 completed successfully and W9 Orders QA #904 completed successfully for the final P1.2 implementation.
- VERIFIED: final P1.2 implementation is limited to theme code-splitting and its regression contracts; protected order, auth/RLS, tenant/branch, analytics, preparation-time/ETA, image-delivery, and unrelated migration systems were not changed.
- VERIFIED: all five canonical themes remain mapped through `getLazyThemeTemplate()` and the public route/shared renderer no longer statically import theme implementations.
- VERIFIED: final PR preview reached Ready; this is Preview evidence only and does not establish Production deployment.
- UNKNOWN: direct physical-device QA and Production performance measurements remain outside this GitHub verification.
- BLOCKED: Production deployment was not performed and must remain a separate release decision.
- IMPLEMENTATION STATUS: MERGED / VERIFIED.
- DEPLOYMENT STATUS: NOT_DEPLOYED.

## EXACT NEXT TASK

**P1.3 — Public Menu Runtime Performance / Observability**

Start with repository-first measurement of the post-P1.2 public-menu runtime. Establish a numeric baseline where tooling permits, then make exactly one evidence-backed atomic improvement. Preserve P0.1/P0.2/P1.1/P1.2 and all tenant/branch/auth/RLS, Arabic/English, RTL/LTR, five-theme and order contracts. Do not deploy automatically.

# 2026-10-02 — P1.3 Public Menu Runtime Performance / Observability — MERGED / VERIFIED

- VERIFIED: PR #354 was squash-merged into `main` as `67f05fff4f7f6c07e87b56df1a9a676f2aee896d`.
- VERIFIED: P0.1, P0.2, P1.1, P1.2 and P1.2 continuity PR #353 remain merged before P1.3.
- VERIFIED: post-P1.2 CI baseline: golden 30-product fixture at 390x844 measured 20,587 bytes HTML transfer, 20,287 decoded HTML bytes, 31 image resources / 202,708 image-transfer bytes, FCP 116 ms. Separate Editorial browser evidence measured 40 JS requests / 48,957 transfer bytes, 6 font requests / 226,752 transfer bytes, and FCP 324 ms. These are CI measurements, not Production/device measurements.
- VERIFIED: every request previously queried `public_content_version` before checking the existing 15-second revision-keyed process-local cache, so fresh in-process cache hits still paid a DB read.
- VERIFIED: P1.3 adds a tenant/branch-scoped fast path using the same 15-second TTL; fresh hits return before `getSql()`/revision lookup, while misses retain the existing revision-keyed cache and server-authoritative SQL isolation.
- VERIFIED: `invalidatePublicMenuCache()` clears both cache layers. No client identity is used in the new cache key.
- VERIFIED: no changes to tenant/branch isolation, auth/RLS, SECURITY DEFINER, pricing, P0.1/P0.2, P1.1 session separation, P1.2 theme loading, Order Value Analytics, preparation/ETA, image delivery, or migrations.
- VERIFIED: Quality #2785 passed typecheck, tests, contract gates, lint, production build, all-theme browser QA, Arabic/English browser QA, golden performance fixture, Studio/Platform Admin browser QA and diagnostics.
- VERIFIED: W9 Orders QA #918 passed.
- VERIFIED: no Production deployment was performed.
- UNKNOWN: direct Production TTFB/cache-hit ratio/DB-query counts and physical-device performance.
- UNKNOWN: CI did not capture the pre-implementation RED state because the existing cache/session test file was not initially registered in `npm test`; registration was corrected before final GREEN verification, and the final suite passed.
- BLOCKED: Vercel Preview is independently blocked by `api-deployments-free-per-day`; this did not block GitHub Quality/W9 and no deployment retry was performed.
- IMPLEMENTATION STATUS: MERGED / VERIFIED.
- DEPLOYMENT STATUS: NOT_DEPLOYED.

## EXACT NEXT TASK

**P1.4 — Leaked Password Protection**

Do not begin automatically. Start from `main@67f05fff4f7f6c07e87b56df1a9a676f2aee896d` and boot repository/Git evidence before implementation.

# 2026-10-02 — P1.4 Deferred / Audit Reprioritization — OWNER DECISION

- VERIFIED: Supabase documents leaked-password protection as available on Pro Plan and above; the current owner decision is to defer this capability because the current subscription does not provide it and it is not currently required.
- DECISION: P1.4 — Leaked Password Protection is **DEFERRED / OUT OF CURRENT SCOPE**. It must not be treated as the active next task and must not block Menu V3 progress.
- PROTECTED: the historical audit finding remains recorded as evidence; this is a prioritization/dependency decision, not a claim that the Security Advisor warning has disappeared.
- VERIFIED: P0.1 atomic public-order creation and P0.2 layered public-order abuse protection are resolved/merged and must not be reimplemented without new evidence.
- VERIFIED: P1.1 public-menu cache/session decoupling, P1.2 theme code splitting, and P1.3 public-menu runtime performance/observability are completed on current main.
- DECISION: the highest remaining actionable audit item that is independent of the deferred Supabase Auth setting is **Audit Follow-up — Supabase Migration Three-Way Reconciliation**.
- SCOPE: compare repository migration files, recorded Supabase migration history, and live database schema/functions/triggers/RLS; explain discrepancies; do not blindly replay migrations.
- STATUS: DOCUMENTATION / REPRIORITIZATION ONLY. No runtime code, schema, auth, RLS, dependency, or deployment change was made.
- DEPLOYMENT STATUS: NOT_PERFORMED.

## EXACT NEXT TASK

**Audit Follow-up — Supabase Migration Three-Way Reconciliation**

Do not begin automatically. First boot from current `main`, verify current Git/CI/runtime evidence, then perform the reconciliation as one atomic task if explicitly authorized.


# 2026-10-02 — Audit Follow-up — Supabase Migration Three-Way Reconciliation — VERIFIED

- VERIFIED: PR #356 merged as `3291243387874c6543dc3e6d9a3250550ddf9ba1`; `main` is at that SHA.
- VERIFIED: repository has 70 SQL files: 69 active top-level migrations plus nested `migrations/auth/0001_auth.sql`, intentionally excluded by the custom runner.
- VERIFIED: `menu_v3._migrations` has 69 distinct rows matching the 69 active top-level migration basenames; latest is `20261002090000_layered_public_order_abuse_controls.sql`.
- VERIFIED: `supabase_migrations.schema_migrations` has 46 entries; only two exact version overlaps with repository filenames are `20260903025817` and `20260925105134`.
- VERIFIED: repository has no `supabase/config.toml` or `supabase/migrations/`; production migration execution is via `scripts/migrate.mjs` and `menu_v3._migrations`.
- INFERRED: Supabase CLI history is a legacy/parallel ledger, not the active application ledger; this mismatch is not a reason to replay migrations.
- VERIFIED: live `menu_v3` schema has 45 tables, 441 columns, 189 constraints, 148 indexes, 30 functions, 33 non-internal triggers, 7 policies, 44 RLS-enabled tables, and 0 unvalidated FKs.
- VERIFIED: latest branch-ordering, product-offer, order-offer, preparation-time, and layered public-order-abuse objects are present live.
- ORDERING ANOMALY: 20 migration positions differ between filename order and historical `applied_at` order; no repair was performed.
- EXPECTED / BENIGN: nested auth migration is excluded by design; two files share timestamp prefix `20260909001000`.
- SECURITY VERIFIED: `public_order_invalid_rate_limits` is the only `menu_v3` table without RLS and has no client table grants; 14/30 functions are SECURITY DEFINER and inspected server-only functions do not expose PUBLIC/anon/authenticated EXECUTE.
- SECURITY UNKNOWN/DEFERRED: leaked-password protection remains disabled; 37 RLS-enabled/no-policy informational findings remain. PERFORMANCE VERIFIED: 18 unindexed FK findings remain separate.
- DECISION: reconciliation was read-only. No migration replay, history repair, schema/RLS/function/trigger change, or deployment occurred.

## EXACT NEXT TASK

**Migration Ledger Strategy — decide whether to retain the custom `menu_v3._migrations` architecture or migrate to canonical Supabase CLI migration tracking.**


# 2026-10-02 — Migration Ledger Owner Decision — VERIFIED

- **DECISION:** The existing project operational migration ledger, `menu_v3._migrations`, remains the **canonical operational migration record** for Menu V3.
- **DECISION:** `supabase_migrations.schema_migrations` is **not** the operational source of truth and is excluded from operational migration tracking, replay, and repair decisions for the current architecture.
- **DECISION:** No migration repair, replay, reset, history modification, or migration-tracking migration is authorized by this decision.
- **CONTINUITY GUARDRAIL:** Future agents/workflows must not infer pending migrations, schema drift, or required replay solely from differences between `supabase_migrations.schema_migrations` and the repository/custom ledger.
- **ROLE BOUNDARY:** The project has one human owner/developer. ChatGPT is the internal AI orchestration workflow. Agent names in project documentation denote workflows, not additional human owners or teammates.
- **REQUIRED BOOT RULE:** Before any migration action, read the repository migration runner and this decision. Treat `menu_v3._migrations` plus the repository runner as the operational migration chain unless the owner explicitly changes this decision.
- **SUPABASE HISTORY RULE:** Supabase CLI history may be inspected for audit/evidence, but it must not be used as the operational canonical ledger under the current decision.

## EXACT NEXT TASK

**Audit Follow-up — prioritize the next actionable audit finding from the current repository audit, excluding deferred P1.4 and the already-completed migration reconciliation.**
