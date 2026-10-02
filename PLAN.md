# 2026-10-02 — P1.1 Closeout — VERIFIED / PR #351

- VERIFIED: P1.1 final implementation passed Quality #2756 and W9 Orders QA #892.
- VERIFIED: public content caching is separated from anonymous-session attribution.
- VERIFIED: anonymous-session last_seen_at writes are throttled to five-minute intervals.
- UNKNOWN: production TTFB/DB/cache-hit/HTML/LCP before-after measurements.
- BLOCKED: Vercel Preview is VERIFIED / SUCCESS; Production was not attempted.
- IMPLEMENTATION STATUS: PUSHED / VERIFIED / HOLD FOR OWNER MERGE.
- DEPLOYMENT STATUS: NOT_DEPLOYED.

## EXACT NEXT TASK

**P1.2 — Theme Code Splitting**

Measure selected-theme bundle/runtime cost first. Preserve all five themes, RTL/LTR, Arabic/English behavior, shared public-menu contracts, and tenant isolation.

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

- VERIFIED: PR #349 merged as 5e2cdf847251f0bc6a8688667a7d3e060e768419 after Quality #2731 and W9 Orders QA #869 passed.
- VERIFIED: layered session/IP accepted-order protection and separate invalid-request throttling are now on main.
- VERIFIED: accepted quota is consumed only after structural/business validation.
- VERIFIED: P0.1 atomic order creation remains preserved.
- DEPLOYMENT STATUS: NOT_PERFORMED.

## EXACT NEXT TASK

P1.1 — Public Menu Cache/Session Decoupling.

---
# 2026-10-02 — P0.2 Layered Public Order Abuse Protection — IMPLEMENTATION IN PROGRESS

- VERIFIED: P0.1 is merged in main at 7bfa8ceafff4340466d776d5410fe455d07d2f15.
- VERIFIED: P0.2 is the next canonical task in the comprehensive audit.
- IMPLEMENTATION_IN_PROGRESS: layered session/IP accepted limits, separate invalid traffic throttle, and post-validation accepted quota.
- UNKNOWN: final CI/browser gates until PR verification.
- DEPLOYMENT STATUS: NOT_REQUESTED / NOT_PERFORMED.

## EXACT NEXT TASK

Verify GitHub Quality/W9 for the P0.2 PR and review the final diff before controlled merge.

---

# 2026-10-02 — Order Value Analytics Tenant Scope — CLOSED / DEPLOYED
- VERIFIED: Order Value Analytics now supports explicit authorized tenant scope in addition to server-enforced branch scope.
- VERIFIED: Multi-tenant owners/admins see only tenants for which they hold active `analytics.read` permission; the server validates the selected tenant membership and never trusts client role/permission claims.
- VERIFIED: PR #345 merged as `e7a2d42660d2b563cc473b6845236d89de61025f` and Production deployment `dpl_6wCbjhxQJyZ8RKicBs7mhEX1Jvo2` is READY.
- VERIFIED: Quality `36961095902` and W9 Orders QA `36961095916` passed.
- UNKNOWN: authenticated live UI smoke remains owner-side evidence pending.

## Exact Next Task

No additional implementation is authorized for Order Value Analytics. Perform the single authenticated Production smoke described in `PROJECT_STATE.md`; if it passes, stop.

---
# 2026-10-02 — Preparation Time + Estimated Ready Time — VERIFIED / MERGED
- VERIFIED: PR #339 is merged; its three-file scope is documentation-only (PROJECT_STATE.md, PLAN.md, TASKS.md) and contains no runtime/application changes.
- UNKNOWN: direct real-device Production QA evidence is not established by the current GitHub evidence.

- VERIFIED: the preparation-time implementation is integrated on current `main` from commit `3d19e408a3d6212cb6d95bf0d1bfa163de41e81d`.
- VERIFIED: nullable `preparation_duration_minutes` and `estimated_ready_at` fields are added without backfill, index, or trigger.
- VERIFIED: Studio `new -> confirmed` requires a server-validated whole-minute duration from 1–120 minutes; presets are 3/5/10/15/20/30 minutes.
- VERIFIED: ETA uses database server time and is persisted atomically with status and the existing status-audit event under row locking.
- VERIFIED: tenant/branch/actor authorization remains server-derived; concurrent confirmations retain compare-and-set protection.
- VERIFIED: Studio Orders supports Arabic/English, RTL/LTR-safe ETA presentation, and mobile preset/custom controls.
- VERIFIED: GitHub Quality run `36932980800` passed all stages, including typecheck, tests, lint, production build, browser/template QA, Studio/Admin browser QA, and performance fixtures.
- VERIFIED: GitHub W9 Orders QA run `36932980956` passed.
- VERIFIED: Vercel Preview for the final feature head passed.
- VERIFIED: no real order was created and no WhatsApp message was sent.
- DEPLOYMENT STATUS: DEPLOYED / VERIFIED.
- VERIFIED: Production deployment `dpl_58LkHc6RByWjfSnzFwNitsvbytgu` is READY and targets `production`.
- VERIFIED: the runtime Production deployment `dpl_58LkHc6RByWjfSnzFwNitsvbytgu` is READY and serves release commit `ed995f264c0c821eeafade563c250c374f19f88f`. The subsequent continuity PRs (#339, #340, and this closeout) are documentation-only; Production therefore intentionally remains on the verified runtime release while `main` carries only continuity-documentation changes.

## EXACT NEXT TASK

No further implementation work for this feature. Wait for the next explicitly scoped task.

---
# 2026-09-30 — Part C Offers/Promotions — PROPOSED / PLAN ONLY

1. Data model: add one tenant-owned product_offers record per product for the MVP, with tenant_id, product_id, offer_type (sale_price, percent_off, fixed_amount, bogo), numeric value fields, starts_at, ends_at, is_active, and audit timestamps. Enforce tenant/product ownership and a single active offer per product.
2. Studio UI: add an Offer section inside the existing product editor. Owner/admin/editor can create, edit, disable one offer for the item, choose the type, value, schedule, and bilingual customer-facing label. An offer is metadata on an existing product and does not create another menu item.
3. Public menu: for an active offer, show the normal price plus a clear treatment such as was X → now Y for sale-price/fixed/percentage offers, or a concise BOGO badge. Use existing text(lang, ...) and RTL/LTR conventions; render only server-validated active offers.
4. Order pricing: never trust the client-displayed discounted price. At submitPublicOrder, load the current active offer server-side, validate its time window, calculate the effective unit/line price, and persist the pricing snapshot into order_items. Recommended snapshot fields: original_unit_price, discount_amount, offer_id; existing unit_price and line_total remain the final charged values.
5. Variants/modifiers: proposed MVP rule is percentage/fixed discounts apply to the selected variant price; modifier price deltas remain additive and are not discounted. A fixed sale_price is base-product-only unless variant-specific sale prices are introduced. BOGO initially applies only to identical product quantities and does not discount modifier deltas.
6. Receipt/invoice flow: receipts already read persisted order_items.unit_price and line_total. Do not add client-side receipt math. Display the final unit price and line total; optionally show original price/discount only if the receipt product decision requires it. Existing orders.subtotal and orders.total remain authoritative.
7. Stacking: default to no stacking for item-level offers. One product has at most one active offer, keeping calculations deterministic.
8. Expiry/timezone: store timestamptz and evaluate validity on the server. Before implementation, confirm an explicit branch/tenant timezone contract; if absent, add that prerequisite rather than guessing from city or browser settings.
9. Subscription limits: offers do not increase product count because they are metadata on an existing product. If a future plan limits promotional campaigns, enforce that as a distinct entitlement.
10. Concurrency/audit: snapshot the applied offer and final price into the order so later edits/expiry cannot retroactively change existing orders or receipts. Test active/inactive/expired offers, fixed/percentage/BOGO math, variant/modifier interaction, tenant/branch isolation, and receipt totals.
11. Migration/release: implement only after owner approval of the pricing rules above. No Offers/Promotions code is included in PR #327.

---
# 2026-09-30 — Menuun Platform Attribution — CLOSED / VERIFIED / DEPLOYED

- VERIFIED: PR #324 introduced the Menuun platform-attribution implementation and merged as `78550457a7ba7e2c23f2190856c1fb5c8cf71c3e`.
- VERIFIED: GitHub Quality #2590 passed typecheck, tests, lint, production build, all-theme browser QA, Menuun brand browser QA, performance fixture, Studio/Admin browser QA, and diagnostics.
- VERIFIED: W9 Orders QA #751 passed.
- VERIFIED: Production deployment `dpl_APMeXne3rQkaVa9VtjDuHYMpSpW4` verified the implementation merge commit in production.
- VERIFIED: the final continuity merge was subsequently deployed from `main` as `dpl_8io82PjFjwhrLYVdKSVLZ9G3EQWB`, READY, target production.
- VERIFIED: Production aliases include `www.menuun.com` and `menuun.com`.
- VERIFIED: no runtime errors were found in the checked 30-minute post-deployment window after the final continuity deployment.
- VERIFIED: tenant-specific `logoUrl` remains separate from Menuun platform branding.
- UNKNOWN: direct physical Android/iOS rendering of the new attribution footer was not captured in this task.
- IMPLEMENTATION STATUS: DONE.
- DEPLOYMENT STATUS: DEPLOYED / VERIFIED.

## EXACT NEXT TASK

No further work for this atomic branding task. Wait for the next explicitly scoped task.

- VERIFIED: PR #324 was merged into `main` as `78550457a7ba7e2c23f2190856c1fb5c8cf71c3e`.
- VERIFIED: GitHub Quality #2590 passed typecheck, tests, lint, production build, all-theme browser QA, Menuun brand browser QA, performance fixture, Studio/Admin browser QA, and diagnostics.
- VERIFIED: W9 Orders QA #751 passed.
- VERIFIED: Vercel Production deployment `dpl_APMeXne3rQkaVa9VtjDuHYMpSpW4` is READY and targets production.
- VERIFIED: Production deployment commit exactly matches `main`: `78550457a7ba7e2c23f2190856c1fb5c8cf71c3e`.
- VERIFIED: Production aliases include `www.menuun.com` and `menuun.com`.
- VERIFIED: no runtime errors were found in the checked 30-minute post-deployment window.
- VERIFIED: tenant-specific `logoUrl` remains separate from Menuun platform branding.
- UNKNOWN: direct physical Android/iOS rendering of the new attribution footer was not captured in this task.
- IMPLEMENTATION STATUS: DONE.
- DEPLOYMENT STATUS: DEPLOYED / VERIFIED.

## EXACT NEXT TASK

No further work for this atomic branding task. Wait for the next explicitly scoped task.

- VERIFIED: canonical `main` is `2e38263dfdc5d73a3e21f97fe029bf5fdd2d22cd`.
- VERIFIED: Menuun production logo assets and the existing platform-brand component are already present on `main`; tenant-specific `logoUrl` remains separate.
- VERIFIED: the supplied mobile screenshot shows a compact dark footer attribution pattern with a platform logo and a short "مقدم من" label.
- PROPOSED: add a shared Menuun platform-attribution footer to every public-menu render, using the existing production logo on a restrained charcoal strip and keeping it outside restaurant identity/actions.
- PROPOSED: surface the existing Menuun logo in the customer Studio shell sidebar and mobile header without changing tenant branding.
- UNKNOWN: real-device/browser visual rendering of the new attribution on all five theme families until the repository browser QA runs.
- DEPLOYMENT STATUS: NOT_REQUESTED / NOT_PERFORMED.

## EXACT NEXT TASK

Run the repository quality/browser gates for the attribution change, review the final diff, and only then prepare the controlled merge/release decision. Do not deploy automatically.
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


## Performance Remediation — Current Position — 2026-09-22

- VERIFIED: canonical `main` HEAD after Phase 4 continuity closeout is `93c2d8a7f4524986346f4439b5f829cb51308a95`.
- VERIFIED: Phase 0 is CLOSED.
- VERIFIED: Phase 1 is COMPLETE / MERGED.
- VERIFIED: Phase 2 is COMPLETE / MERGED.
- VERIFIED: Phase 3 is COMPLETE / MERGED at `fb4c5dba311d5f77c3bcb943f13e35cb92ab8584`.
- VERIFIED: Phase 4 is COMPLETE / MERGED at `aa1ac6ba942228e8ad2e32f6c76b485b4706ea78`.
- VERIFIED: Quality #2282 passed; W9 Orders QA #507 passed.
- VERIFIED: Phase 4 bounds dedicated Featured presentation to 6 items without changing stored `isFeatured` truth or normal product discovery.
- VERIFIED: Vercel preview status is rate-limit failure only; no Production deployment was performed.
- UNKNOWN: real-device waterfall/LCP and Production performance for the 30-item golden tenant.

## Exact Next Task

**Phase 5 — Public HTML / SSR Payload Reduction for the 30-item `saudi-shopping-world` golden case.**

Do not repeat Phase 1–4. Measure first, then reduce only unnecessary SSR/HTML payload while preserving deterministic hydration, SEO/structured data, and public-menu behavior.


# CURRENT CONTINUITY SNAPSHOT — 2026-09-22

- VERIFIED: Canonical branch: `main`.
- VERIFIED: Current `main` HEAD: `b5e5e0f7fa000b1451b605e2fb9b484cde690170`.
- VERIFIED: Phase 4 merge commit `aa1ac6ba942228e8ad2e32f6c76b485b4706ea78` is the runtime/code parent of current `main`.
- VERIFIED: Phase 4 Quality #2282 and W9 Orders QA #507 passed.
- VERIFIED: Phase 4 was not deployed to Production; current Production identity/performance for this new head is UNKNOWN.
- UNKNOWN: real-device waterfall/LCP for the 30-item golden tenant.
- VERIFIED: 7-table RLS remediation remains applied and verified.
- UNKNOWN: Physical Android/iOS/QR/device QA.
- REMAINING SECURITY WARNINGS: one mutable function `search_path` warning and one Auth leaked-password-protection warning remain separate from the closed RLS task.

## Exact Next Task

**Physical Android/iOS/QR/theme/order/RTL smoke QA for current `main` `d6e2b6e9ed13dda4a7cd82d82d4205137a4ef5e0`.**

## Protected / Not Next

- Do not start another theme, homepage redesign, or unrelated feature.
- Do not reopen the completed 7-table RLS remediation without new evidence.
- Do not start Payment Provider / Commercial Launch / PH-07 / R10 prerequisite work.
- Treat the two remaining Supabase warnings as separate scoped security tasks.

# Menu V3 — Active Plan


## Status
- Status: RELEASE_STAGE_VERIFIED_WITH_DEVICE_QA_PENDING.
- Repository: `Midosd249/Menu_V3`.
- Canonical branch: `main`.
- Source of truth: `main`.

## Current Release-Stage Evidence
- VERIFIED: release-stage verification was completed against verified main b78b69ea0921571a1ca454c30ca81a43e5cf20b5 before this documentation batch.
- VERIFIED: Production deployment was READY and matched GitHub commit b78b69ea0921571a1ca454c30ca81a43e5cf20b5 at verification time.
- VERIFIED: production root HTTP 200.
- VERIFIED: invalid public menu HTTP 404.
- VERIFIED: invalid branch variant HTTP 404.
- VERIFIED: no error/fatal runtime logs were found for the checked production deployment in the inspected 2-hour window.
- VERIFIED: production theme-testing override is disabled by server-side `VERCEL_ENV=production` guard; no code removal is justified.
- UNKNOWN: exact production environment-variable secret values.
- UNKNOWN / EXTERNAL: physical Android/iOS QA.

## PH Lifecycle — Completed

PH-01 through PH-06 are completed historical milestones. No additional PH milestone is currently defined.

## PH-01 — Self-Serve Customer Lifecycle — CLOSED / VERIFIED / MERGED

PR #170 — `fix: retire legacy customer approval and request flows`

Merge commit:
`7e91778bfafa67b24efd1edf4387e1f3014fae9d`

### Final contract
- New customer: Home → Registration → secure workspace provisioning → Studio.
- Existing customer: Home → Login → email OR phone + password → existing workspace / Studio.
- New customer access no longer depends on manual approval/request gating.
- `/admin/users` remains the server-authorized customer-control surface.
- Legacy Leads and Service Requests are retired from the active lifecycle/admin surface.
- Tenant isolation, branch isolation, server authorization, fail-closed provisioning, and security boundaries remain protected.

### Documentation / verification provenance
- GitHub directly verifies PR #170 merged at `7e91778...`.
- Manus reported successful repository Quality gates, W9 Orders QA, and Vercel deployment for the completed batch.
- A local TypeScript/baseUrl check was reported by Manus as a local toolchain/version mismatch; official CI was the authoritative quality gate for the merged implementation.

## Homepage Runtime Fix — CLOSED / VERIFIED

PR #172 — `fix: prevent homepage React.Children.only crash`

- Root cause: `Button asChild` received a `Link` plus a sibling `ArrowUpLeft` icon; Radix Slot requires `Slottable` for this multi-child composition pattern.
- Fix: `src/components/ui/button.tsx` now preserves the first child as the slotted interactive element and preserves trailing sibling content using `Slottable`.
- Regression protection: `tests/public-pages-themes-contract.test.mjs` verifies the homepage pattern and Button `Slottable` contract.
- VERIFIED: Quality run `35266109690` passed typecheck, full tests, lint, production build, public all-theme browser QA, Studio browser QA, Platform Admin browser QA, performance/diagnostic stages, and cleanup.
- VERIFIED: W9 Orders QA run `35266109691` passed.
- VERIFIED: merge commit `8050d2f08a2904f5ee2d9085454c47bdba601392` is on `main`.
- UNKNOWN: physical real-device Production QA for the latest `main`.

## Completed Strategic Milestones
- Premium Theme System — DONE / VERIFIED / MERGED.
- Essential, Editorial, Noir, Heritage/Taste, Gallery — protected.
- Permanent visual/functional/research quality workflow — DONE / VERIFIED.
- P0 Public Order Hardening — DONE / VERIFIED.
- P1 Production/Continuity Hardening — DONE / VERIFIED for implemented scope.
- P1-H1 package/lockfile reconciliation — CLOSED / VERIFIED.
- P1-H2 main protection — CLOSED / VERIFIED.
- P2 Growth & Differentiation — DONE / VERIFIED / DEPLOYED.
- Platform Approval Center — CLOSED / VERIFIED.
- Registration-link rendering — CLOSED / VERIFIED.
- Onboarding Creation Recovery — CLOSED / VERIFIED / MERGED.
- R2.1–R2.7 Menu Intelligence — CLOSED / VERIFIED.
- R4.1–R4.5 Owner Intelligence — CLOSED / VERIFIED.
- R5 Growth Extensions — CLOSED / VERIFIED.
- R6 bounded WhatsApp CTA experiment — CLOSED / VERIFIED for implementation; outcome pending meaningful real exposure.
- R7 initial evidence review — IN PROGRESS / NON-BLOCKING while exposure remains insufficient.
- R8.1–R8.5 Closed-Loop Menu Growth Engine — CLOSED / VERIFIED / MERGED.
- R9 Guest CRM / Loyalty / Campaigns / Feedback / Retention — CLOSED / VERIFIED / MERGED.
- AI Provider Routing & Multimodal Fallback — CLOSED / VERIFIED / MERGED.
- Grounded Guest Menu Assistant — CLOSED / VERIFIED.
- Gallery + Noir theme hardening — CLOSED / VERIFIED / MERGED.
- W7.1–W7.12 — CLOSED / VERIFIED for implemented scope; physical Android/iOS QA remains release-stage evidence.
- W8 Internal Visual System — DONE / VERIFIED for implemented scope; existing draft PR history remains separate and protected.

## Production / Release Readiness
- VERIFIED: repository-side product work through PH-06 plus the homepage runtime fix is present in `main`.
- UNKNOWN: physical Android/iOS production QA.
- UNKNOWN: current production environment-variable values.
- Do not use Vercel as the development iteration loop.

## Product Direction
Menu V3 remains a premium Arabic-first restaurant platform:

```text
Live Menu
→ Guest Experience
→ Menu Intelligence
→ Owner Intelligence
→ Growth Extensions
→ Experiments
→ Guest Relationships
→ Self-Serve Customer Lifecycle
```

The current Activation workstream is closed; the repository is awaiting the owner's next explicitly scoped task.

## A.1 Closeout — VERIFIED
- Audit-only task completed.
- Audit: `docs/audits/2026-09-18-a1-customer-journey-event-truth-audit.md`.
- No runtime implementation, migration, UI redesign, or deployment.
- Main gaps: search/category/add-to-cart measurement and authoritative event → order linkage.
- Existing `menu_events`, Owner Analytics, Growth, Reports, R2–R9, and R6 experiment contracts remain protected.

## A.2 — CLOSED / VERIFIED BY CI
- Added `search`, `category_view`, and `add_to_cart` to the canonical `menu_events` event contract.
- Added tenant-scoped `category_id` storage and server-side category ownership validation.
- Added 30-minute duplicate suppression for `search`.
- Instrumented `PublicMenuView`, Taste/Heritage, Editorial, Specialty Cafe, and Fast Casual renderers.
- Added focused regression tests.
- Preserved R6, existing analytics consumers, themes, order flow, and tenant/branch boundaries.
- CI Quality and W9 Orders QA passed.

## A.3 — CLOSED / VERIFIED BY CI — Server-Controlled Anonymous Session → Order Attribution
- Implemented the approved server-issued opaque cookie + tenant-bound session model.
- Canonical `menu_events` uses server-resolved session identity; client event payloads no longer carry `sessionId`.
- Public orders attach nullable `anonymous_session_id` only from a valid tenant-bound server session.
- Composite database foreign key enforces tenant/session consistency.
- Existing order validation, pricing, rate limiting, idempotency, R9 boundaries, and public themes were preserved.
- GitHub Quality run `35353500574` passed after the final R6 experiment-session alignment correction.
- GitHub W9 Orders QA run `35353500533` passed.
- No production deployment occurred.
- Vercel PR status failed due to the connected account's build/deployment rate limit; no retry was performed.

## Release Evidence — 2026-09-18 — IN_PROGRESS / REPOSITORY EVIDENCE ASSEMBLED
- VERIFIED: canonical `main` is `99cc9338257b7ae6125a30579c445504fdfeaaaa` after PR #197 merge.
- VERIFIED: PR #197 is CLOSED / MERGED at `99cc9338257b7ae6125a30579c445504fdfeaaaa`.
- VERIFIED: Quality run `35364239274` passed all configured quality, browser, and performance stages.
- VERIFIED: W9 Orders QA run `35364239435` passed.
- VERIFIED: GitHub combined status for current `main` contains only the Vercel `failure` context caused by the documented build/deployment rate-limit surface; this is not CI Quality failure.
- UNKNOWN: direct Vercel Production deployment identity/configuration for this `main`.
- UNKNOWN: physical real-device production QA.
- UNKNOWN: direct production HTTP 404 verification for invalid public menu URLs.

## Historical Next Task
**Real-device production QA — execute the prepared Android/iOS/QR/theme/order/RTL smoke matrix on a physical device and record the evidence.**

Do not begin product/category deep links or native Web Share automatically.

## A.5 — CLOSED / VERIFIED — Public Shareability / Deep-Link Audit
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
- VERIFIED: PR #196 merged into `main` at `b98e3e1ae832c389157de2205979be4801fce63b`.
- VERIFIED: public discovery ownership is unified under `server/middleware/seo-discovery.ts`; superseded `src/lib/seo/crawl.ts` and its `grok-pwa.ts` ownership were removed.
- VERIFIED: both public route variants convert `not_found` to router-level `notFound()`.
- VERIFIED: canonical sitemap behavior preserves locale alternates and deterministic duplicate suppression.
- VERIFIED: Quality run `35363323737` passed; W9 Orders QA run `35363323728` passed.
- BLOCKED / NON-BLOCKING: Vercel remains rate-limited; no deployment was performed.
- UNKNOWN: direct production HTTP 404 verification and physical device QA remain release-stage evidence.

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

## Historical Next Task
**Real-device production QA — execute the prepared Android/iOS/QR/theme/order/RTL smoke matrix on a physical device, and include the QR single-print + multi-copy print-preview checks.**

Do not begin product/category deep links or native Web Share automatically.


## 2026-09-19 — Homepage Implementation Slice — IN PROGRESS

- VERIFIED: implementation authorized by owner after the documented homepage execution plan.
- VERIFIED: permanent Research, Innovation & Creative Intelligence workflow is now stored in `docs/agents/research-innovation-creative-agent.md` and routed by `docs/automatic-specialist-routing.md`.
- VERIFIED: PR #206 implements the homepage information architecture around guest journey, restaurant presence, Studio control, Arabic-first proof, pricing, FAQ, and CTA.
- VERIFIED: implementation uses existing `MENU_THEMES` and `COMMERCIAL_PLANS`; no parallel product data or backend contract was introduced.
- VERIFIED: no new external images are required for this slice.
- UNKNOWN: local/browser visual verification and GitHub Quality execution for PR #206.
- BLOCKED / NON-BLOCKING: Vercel remains rate-limited; no deployment was performed.

### Historical Next Task

Review PR #206 quality evidence and final diff; if clean, prepare one controlled merge to `main`. Production deployment remains a separate release-stage action.


## 2026-09-19 — Homepage Implementation Slice — COMPLETE

- VERIFIED: PR #206 merged into `main` at `0f2f145b64d41f670ee2508582f76e2196b53b67`.
- VERIFIED: Quality run #2097 passed and W9 Orders QA run #357 passed.
- VERIFIED: homepage redesign and permanent innovation workflow are now in canonical `main`.
- BLOCKED / NON-BLOCKING: Vercel deployment is still rate-limited; no deployment was performed.

### Historical Next Task

Release-stage production verification of the merged homepage, then physical Android/iOS/QR/theme/order/RTL smoke QA.

## 2026-09-19 — Homepage Realistic Visuals — CLOSED / VERIFIED

- VERIFIED: PR #213 `feat: add realistic homepage menu and analytics visuals` was merged into canonical `main`.
- VERIFIED: merge commit: `ccf25a80f9f3f6000cebed8c2b3d8162edfd3f24`.
- VERIFIED: PR #213 changed only homepage presentation/assets: realistic menu cover/dish imagery, realistic Studio analytics preview, theme preview imagery, and related homepage wiring in `src/routes/index.tsx` / `src/routes/index.css`.
- VERIFIED: GitHub combined status for PR head reported `Vercel: success` before merge.
- VERIFIED: PR diff was ahead of the prior `main` by 2 commits and included the expected homepage asset/source changes.
- UNKNOWN: physical-device visual QA of the merged homepage.
- UNKNOWN: current Vercel Production deployment identity for merge commit `ccf25a80f9f3f6000cebed8c2b3d8162edfd3f24`.
- Implementation status: `DONE`.
- Deployment status: `UNKNOWN` / no production deployment performed by this task.

### Historical Next Task

Release-stage verification of the merged homepage when the deployment window is available, followed by the prepared physical Android/iOS/QR/theme/order/RTL smoke matrix. Do not redesign the homepage again before verification.


## 2026-09-20 — Public Menu Reliability / Brand Social / Image Contract — VERIFIED / READY TO MERGE

- VERIFIED: implementation is complete on branch `fix/public-menu-social-images-performance-2026-09-20`.
- VERIFIED: final head `b3bbf92c3fbaef52511162f2b340ea179878603d`.
- VERIFIED: GitHub Quality run `35477401543` passed typecheck, full tests (319/319), W7.4–W7.10 contracts, lint, production build, Playwright/Chromium, all-theme browser QA, Studio browser QA, Platform Admin/W7.10 browser QA, performance diagnostics, and cleanup.
- VERIFIED: W9 Orders QA run `35477401542` passed.
- VERIFIED: Vercel status for final head is `success`.
- VERIFIED: final diff and PR #217 were reviewed; no unresolved review threads or submitted reviews.
- VERIFIED: branch map links remain branch-scoped in `/studio/branches`; Brand now provides an explicit navigation link to `Manage branches & map` instead of duplicating branch location data.
- UNKNOWN: Production deployment identity and physical Android/iOS/QR/device evidence until release-stage verification.

### Historical Next Task

Merge PR #217 once using the verified head `b3bbf92c3fbaef52511162f2b340ea179878603d`, then verify the resulting `main` SHA and release-stage Production/device evidence.

## 2026-09-20 — Public Menu Reliability / Brand Social / Image Contract — MERGED / RELEASE-STAGE PENDING

- VERIFIED: PR #217 merged successfully into `main` at `679f72aca993f5a8001ef5f158877b2c48b79265` from verified head `e82d2652a1cc9f4d69f1e73ff9efc6dbf9a8a98b`.
- VERIFIED: Quality rerun `35477790515` completed successfully; typecheck, tests, lint, production build, all-theme browser QA, Studio browser QA, Platform Admin/W7.10 browser QA, performance diagnostics, and cleanup all passed.
- VERIFIED: PR #217 had no unresolved review threads and no submitted reviews.
- VERIFIED: GitHub reports Vercel status `pending` for merged `main`; this is not Production deployment evidence.
- UNKNOWN: direct Production deployment identity/status and physical Android/iOS/QR/theme/order/RTL verification.
- Implementation status: `PUSHED` / merged to `main`.
- Deployment status: `UNKNOWN` / release-stage verification pending.

### Historical Next Task

**Release-stage verification of `main` at `679f72aca993f5a8001ef5f158877b2c48b79265`, then the prepared physical Android/iOS/QR/theme/order/RTL smoke matrix. Do not start another redesign or feature task before this evidence is closed.**


## 2026-09-20 — Release Verification — PRODUCTION DEPLOYED / DEVICE QA PENDING

- VERIFIED: canonical `main` is `1fcb287072c47746e5f0a7a4a376a87783ab74e5` after continuity PR #218.
- VERIFIED: Vercel Production deployment `dpl_21u9f1K7ninyd6JBi5ayrJJ8TekF` is `READY`, target `production`, and is built from `main` commit `1fcb287072c47746e5f0a7a4a376a87783ab74e5`.
- VERIFIED: GitHub Vercel status for `main` is `success`.
- VERIFIED: Production runtime-error aggregation reports no runtime errors in the selected last-1-hour window.
- VERIFIED: PR #217 implementation is therefore present in a Vercel Production deployment; no additional deployment was intentionally triggered.
- UNKNOWN: physical Android/iOS QR scanning, all-theme visual rendering, ordering, RTL/LTR, and QR print-preview evidence on real devices.
- NOTE: direct deployment URL fetch is protected by Vercel authentication, so no anonymous HTTP page-content verification was claimed from that check.

### Historical Next Task

**Physical Android/iOS production QA — execute the prepared QR/theme/order/RTL smoke matrix, including QR single-print and multi-copy print-preview checks, against `main` `1fcb287072c47746e5f0a7a4a376a87783ab74e5`.**


## 2026-09-20 — Editorial Atelier Replacement — IN PROGRESS
- VERIFIED: main baseline is `5f7932df3cdf212cbf2f154b65c9c8abdf7cc2c2`.
- VERIFIED: owner screenshots show unresolved Editorial runtime defects after PR #220.
- VERIFIED: AppDeploy Atelier prototype is ready.
- IMPLEMENTED: old Editorial presentation files were replaced by `src/theme-editorial-atelier.css`; legacy shared Editorial selectors are being removed.
- UNKNOWN: GitHub Quality/browser/device verification.

### Historical Next Task
**Run GitHub Quality/browser checks for `redesign/editorial-atelier-premium-2026-09-20`, review the diff, then perform real-device Editorial Arabic/English QA before merge.**



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

### Historical Next Task
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

### Historical Next Task
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

### Historical Next Task
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

### Historical Next Task
**Run the repository quality suite and browser visual QA for this branch at 320/375/430px Arabic RTL plus English LTR, then review the final diff and merge one coherent fix if all gates pass.**


## 2026-09-21 — SIGNAL TABLE Mobile Language / Selection Cleanup — READY_TO_MERGE

- VERIFIED: PR #230 head `8bbd22f28fc160359223a2902b6ae7c2ba944645`.
- VERIFIED: Quality #2203 and W9 #443 passed.
- VERIFIED: mobile language visibility defect was caused by an explicit mobile `display:none` rule and is corrected.
- IMPLEMENTED: language control, selection/hero cleanup, dead CSS cleanup, and regression coverage.
- UNKNOWN: physical device evidence and Production deployment identity.

### Historical Next Task
**Merge PR #230 once, verify `main`, then execute the single authorized Production deployment and record its verified SHA/identity.**


## 2026-09-21 — Focused Public UX / WhatsApp / Footer Pass
- VERIFIED: current task scope is recorded in docs/sessions/2026-09-21-focused-public-ux-whatsapp-footer.md.
- IMPLEMENTED: homepage demo data/media bilingual correction, Essential/Noir Featured geometry hardening, structured WhatsApp cart-order messaging/click tracking, and shared marketing/account footer.
- BLOCKED: plan-specific WhatsApp entitlement gating is deferred because the current public-menu contract does not expose a server-authoritative WhatsApp feature entitlement; no unsafe client-side gate was introduced.
- UNKNOWN: local quality commands and physical-device visual QA; GitHub PR CI/browser verification remains required.

### Historical Next Task
Run the repository Quality/test/typecheck/lint/build and browser visual verification for this branch at 320/375/430px Arabic RTL and English LTR, review the final diff, resolve only task-scoped failures, then stop.


## 2026-09-21 — Focused Public UX Follow-up — IMPLEMENTATION_IN_PROGRESS
- VERIFIED: task is scoped to Featured card information hierarchy, all-plan WhatsApp messaging, and duplicate brand-name removal from signup.
- IMPLEMENTED: explicit Featured title/price classes and theme-owned surfaces for Essential/Noir; no new theme or z-index workaround.
- IMPLEMENTED: WhatsApp ordering copy added to every commercial plan and core feature list.
- IMPLEMENTED: signup brand-name field removed from account creation; onboarding remains the single collection point.
- UNKNOWN: final CI for this follow-up until the current PR checks complete; physical-device evidence remains release-stage.

### Historical Next Task
Review PR #232 final checks and diff, merge once if green, then perform one release deployment and real-device QA.

## Final verification — 2026-09-21
- VERIFIED: PR #232 final verified head is `6047080fcfa3e289d89538b6f28d520bbdfc7328`.
- VERIFIED: GitHub Quality #2216 passed and GitHub W9 Orders QA #454 passed.
- VERIFIED: Vercel PR status is SUCCESS preview evidence only; no Production deployment was triggered.
- BLOCKED: server-authoritative plan-specific WhatsApp entitlement remains intentionally deferred.
- UNKNOWN: physical Android/iOS QA remains release-stage evidence.

### Historical Next Task
Merge PR #232 once, verify resulting `main` SHA, then execute the single authorized Production deployment and record direct Production identity before real-device QA.


## 2026-09-22 — RLS Security Remediation — CLOSED / VERIFIED

- VERIFIED: PR #235 merged into `main` at `33bd3ea43bee5112de0d3b8d513cd1aea3a86e92`.
- VERIFIED: the repository migration `20260922080000_harden_server_only_rls_tables.sql` was applied successfully to Supabase.
- VERIFIED: all seven audited tables have RLS enabled, no client policies, and no `anon`/`authenticated` table privileges.
- VERIFIED: server-side `postgres` reads succeeded for all seven tables.
- VERIFIED: GitHub Quality #2224 and W9 Orders QA #460 passed.
- VERIFIED: Issue #233 closed.
- UNKNOWN: direct Production deployment identity and physical-device QA.


## 2026-09-22 — Release Verification — PRODUCTION VERIFIED / DEVICE QA PENDING

- VERIFIED: `main` is `d6e2b6e9ed13dda4a7cd82d82d4205137a4ef5e0`.
- VERIFIED: Vercel Production deployment `dpl_4TFFTfLKJSFJtojrthNS85gjNWGe` is READY and targets that exact `main` commit.
- VERIFIED: production root HTTP 200.
- VERIFIED: valid-format nonexistent public menu HTTP 404.
- VERIFIED: no runtime error clusters in the selected last-1-hour production window.
- UNKNOWN: physical Android/iOS/QR/device QA.

### Exact Next Task
**Physical Android/iOS/QR/theme/order/RTL smoke QA for current `main` `d6e2b6e9ed13dda4a7cd82d82d4205137a4ef5e0`.**
## 2026-09-22 — Public Menu Image Performance Remediation — IN_PROGRESS

- VERIFIED: root-cause investigation for the `saudi-shopping-world` 30-product reproduction is documented in `docs/performance/2026-09-22-public-menu-image-performance-remediation.md`.
- VERIFIED: Phase 1 implementation branch is `perf/saudi-menu-image-delivery-2026-09-22`.
- IMPLEMENTED: shared Unsplash URL normalization, optimized public product media, lazy Studio thumbnails, and removal of Editorial all-product prefetch.
- IMPLEMENTED: regression coverage in `tests/image-delivery.test.mjs` and updated public-media contract coverage.
- UNKNOWN: final GitHub Quality/W9 results for PR #239; they are currently running.
- UNKNOWN: browser/device network waterfall for the real Android reproduction.
- Exact Next Task: **Review PR #239 Quality/W9 to completion, fix only task-scoped failures, then run final diff/performance review for Phase 1.**


### Verification Update — Phase 1 CI attempt
- VERIFIED: GitHub Quality run #2232 and W9 Orders QA #464 reached the new Phase 1 code and failed before full verification because `src/lib/menu/image.ts` contained an accidental literal \\n marker at line 62.
- VERIFIED: the failure was isolated from application logic and corrected in commit `8347a3204f501f6a08a085616a3e2cea10e00882`.
- UNKNOWN: CI rerun for the corrected head has not yet completed/appeared through the connected GitHub workflow surface.
- Exact Next Task: **Obtain the corrected-head CI result; if green, perform final diff review and Phase 1 performance verification; if red, fix only the reported Phase 1 issue.**


## 2026-09-22 — Final Phase 1 Continuity Update

**Public Menu Image Performance Phase 1 is VERIFIED COMPLETE. PR #239 merged as `c33d3b308b76776ec69c65abec7221f534850317`. Quality #2242 and W9 #474 passed. Exact next task: Phase 2 — Public Image Geometry and Responsive Delivery. Production deployment is NOT claimed.**


## 2026-09-22 — Public Menu Image Performance Phase 2 — IMPLEMENTATION COMPLETE / VERIFICATION BLOCKED

- VERIFIED: Phase 1 is merged on main at a5073612d162d6d7d6776de6df9e422c1d6dc43e2; Phase 2 branch starts directly from that SHA.
- VERIFIED: PR #241 is open against main.
- IMPLEMENTED: responsive srcset width candidates and layout-specific sizes across public media roles; safe passthrough remains for non-transformable sources.
- IMPLEMENTED: regression coverage for responsive source generation and updated media contracts.
- VERIFIED: no database, auth, RLS, tenant-data, ordering, subscription, or deployment configuration changes.
- UNKNOWN: GitHub Quality/W9 results are not yet exposed; current combined status is Vercel PENDING.

### Exact Next Task
**Complete PR #241 verification, resolve only task-scoped failures, review the final diff, merge once if all required gates are green, verify the resulting main SHA, then stop.**


## 2026-09-22 — Public Menu Image Performance Phase 2 — VERIFIED COMPLETE

- VERIFIED: PR #241 merged once by squash as `9c262f43970384ba71faab67f88d74fd62672bc3`.
- VERIFIED: resulting `main` SHA is `9c262f43970384ba71faab67f88d74fd62672bc3`.
- VERIFIED: Quality #2256 passed and W9 Orders QA #486 passed for the final PR head `41f07720621486472cdf04053fdf06f53add7f3e`.
- VERIFIED: Vercel PR preview status is SUCCESS; this is preview evidence only.
- VERIFIED: final diff remains scoped to responsive public image delivery, its contract tests, and continuity documentation; no database, auth, RLS, tenant-data, ordering, subscription, or Production deployment configuration change was introduced.
- UNKNOWN: real-device 320/375/390/430px waterfall/LCP and Production performance for this image-delivery change.
- Deployment status: NOT_PERFORMED by this task.

### Exact Next Task
**Run the dedicated real-device/public-menu performance evidence pass for the 30-item Saudi shopping world test menu, measuring Studio and QR/public-menu image waterfalls plus LCP at 320/375/390/430px. Do not redesign or re-implement Phase 2 unless measured evidence requires it.**


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


# CURRENT VERIFIED AI EXPANSION POSITION — 2026-09-24

- VERIFIED: Phase 1 CLOSED.
- VERIFIED: Phase 2 CLOSED / VERIFIED.
- VERIFIED: all requested credential names and pool sizes are documented and implemented server-side.
- VERIFIED: Quality #2345 passed.
- VERIFIED: W9 Orders QA #553 passed.
- VERIFIED: no secrets, runtime activation, migration, or deployment.
- UNKNOWN: live credential validity until credentials are supplied through the environment/secret store.

## EXACT NEXT TASK

**Phase 3 — execution adapters, beginning with Groq.**



## 2026-09-24 — AI Provider Expansion / Phase 3 Groq Adapter — IMPLEMENTED / LIVE SMOKE PENDING

- VERIFIED: Phase 1 and Phase 2 are closed.
- IMPLEMENTED: `src/lib/menu/ai-groq.ts` provides the dedicated Groq structured execution adapter.
- IMPLEMENTED: `src/lib/menu/ai-providers.ts` preserves the single AI boundary and routes structured Groq calls through the dedicated adapter.
- IMPLEMENTED: Groq uses the official OpenAI-compatible Chat Completions endpoint and `GROQ_API_KEY`.
- IMPLEMENTED: default model `openai/gpt-oss-20b`, configurable through `GROQ_MODEL`.
- IMPLEMENTED: bounded 60-second timeout, normalized errors, best-effort JSON Schema output, prompt-injection boundary, and fail-closed missing credential behavior.
- VERIFIED: Quality #2353 passed.
- VERIFIED: W9 Orders QA #561 passed.
- VERIFIED: Vercel Preview deployment is READY.
- UNKNOWN: live provider smoke and real provider quota/latency/error behavior because the secret value is not accessible to the connected GitHub session.
- Deployment status: Preview READY; Production NOT_PERFORMED.

### Exact Next Task

**Execute one authenticated Groq smoke request against the current Vercel Preview, record valid structured output + failure behavior, then review the final diff. Do not merge or start NVIDIA before that evidence exists.**


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


## 2026-09-24 — AI Provider Expansion Continuity

- VERIFIED: Cerebras adapter task is complete and merged as `ba9da375398998a444e5a89bdad249cc8ab6c86d`.
- VERIFIED: full Quality #2373 and W9 Orders QA #578 passed.
- VERIFIED: no Production deployment was requested.
- UNKNOWN: authenticated Cerebras live smoke remains unverified.

### Exact Next Task
**Implement and verify the Mistral document/OCR specialist adapter, isolated from generic text routing and preserving Smart Menu Import boundaries.**


## 2026-09-24 — AI Provider Expansion / Mistral Closure

- VERIFIED: Mistral Document AI/OCR specialist merged as `9d57186788fd9b91669bb52e201bb492551eb9fc`.
- VERIFIED: Quality #2378 and W9 Orders QA #581 passed.
- VERIFIED: Vercel PR status succeeded; no Production deployment was requested.
- UNKNOWN: authenticated Mistral live document smoke remains unverified.

### Exact Next Task
**Implement and verify the Deepgram isolated STT/audio specialist adapter, without entering generic LLM routing.**
\n\n## 2026-09-24 — AI Provider Expansion / Phase 3 Deepgram — CLOSED / VERIFIED

- VERIFIED: PR #279 merged by squash as `e5ca7dbe854f6788875a6ee5233214c5a1cc6b53`.
- VERIFIED: official Deepgram pre-recorded STT contract researched through primary documentation.
- VERIFIED: dedicated adapter, existing-boundary integration, audio-only capability activation, regression contracts, normalized failures, bounded timeout, and fail-closed credential behavior.
- VERIFIED: Quality #2387 passed.
- VERIFIED: W9 Orders QA #588 passed.
- VERIFIED: no database, auth/RLS, subscription, tenant/branch, Smart Menu Import, public-menu/performance, or Production deployment changes were introduced by the task.
- UNKNOWN: authenticated Deepgram live smoke.
- UNKNOWN: direct Production deployment identity/status for merged main.

### EXACT NEXT TASK
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
\n\n## 2026-09-24 — AI Provider Expansion / Phase 5 TypeSafe/Jev — IMPLEMENTED / CI PENDING\n\n- IMPLEMENTED: dedicated `src/lib/menu/ai-typesafe.ts` decision-orchestrator adapter.\n- IMPLEMENTED: three-key rotation, official System One endpoint, typed Noul/Choice/Score handling, bounded request size, candidate-set boundary, and malformed-decision rejection.\n- VERIFIED: TypeSafe is not added to generic structured or multimodal routing.\n- UNKNOWN: live authenticated TypeSafe behavior.\n- PROTECTED: existing provider adapters, Smart Menu Import, public-menu/performance phases 0–8, auth/RLS/subscription/tenant/branch boundaries.\n\n### EXACT NEXT TASK\n**Run Quality/W9 verification for the TypeSafe branch and one authenticated smoke when the configured key is available; keep runtime activation disabled until verified.**\n

## 2026-09-24 — AI Provider Expansion / Phase 6 — CAPABILITY-AWARE ROUTING

- IMPLEMENTED: isolated capability-aware routing boundary in `src/lib/menu/ai-capability-router.ts`.
- Candidate generation is hard-filtered by `runtimeEligible`, execution role, and requested capability.
- Candidate selection is fail-closed against server-generated membership and current provider/model capability state.
- Admission requires verified authorization, entitlement, tenant scope, branch scope, and pricing policy.
- TypeSafe/Jev remains gated by `runtimeEligible:false`; no generic routing activation.
- Existing structured/multimodal routing order remains unchanged.

### Exact next task
**Run and review Phase 6 CI/W9, merge once if green, and record the resulting `main` SHA.**

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


# 2026-09-24 — TypeSafe/Jev Live Smoke Evidence

- VERIFIED: main is `850c9baa8aac0aa80123ab5d83742db577a5477e`.
- VERIFIED: continuity PR #291 is merged and the merged commit's Vercel status is `success`.
- VERIFIED: exactly one GitHub Actions TypeSafe/Jev smoke was attempted in run `36033142672`.
- VERIFIED: `TYPESAFE_API_KEY` was missing from that authorized GitHub Actions runtime; the step stopped before any HTTP request.
- VERIFIED: no secret was exposed and PR #292 was closed without merge.
- VERIFIED: current code has TypeSafe/Jev `runtimeEligible:true` from the already-merged PR #288 guarded selector.
- UNKNOWN: live TypeSafe API behavior and Production credential availability.
- BLOCKED: do not repeat the smoke until an authorized runtime has the configured credential.

## EXACT NEXT TASK

**Provide the TypeSafe credential to the authorized smoke runtime securely, then run exactly one authenticated smoke and record HTTP status, decision validity, selected candidate, confidence when returned, latency, and any bounded usage metadata.**
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


## 2026-09-25 — Guest Assistant Cost-Abuse Hardening / PR #304

- VERIFIED: The public Guest Assistant admission boundary now ignores client-supplied `sessionId`.
- VERIFIED: Existing server-issued anonymous session identity is used for the existing 20/minute AI limiter.
- VERIFIED: Trusted Vercel requester IP is added as a separate hashed limiter key with a configurable 60/minute default.
- VERIFIED: Tenant-wide daily Guest Assistant cap is configurable via `AI_GUEST_ASSISTANT_REQUESTS_PER_TENANT_PER_DAY`, default 500.
- VERIFIED: Daily circuit breaker is evaluated before provider execution and preserves the existing grounded fallback behavior.
- VERIFIED: No provider changes were made.
- IN_PROGRESS: PR #304 CI verification is still running; merge/deployment remain held.

### EXACT NEXT TASK
**Review PR #304 CI results; if all gates pass, owner reviews and authorizes merge. Do not merge or deploy automatically.**


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


# 2026-09-27 — Self-Serve 14-Day Pro Trial — PR #309

- Current atomic task: implement the owner-approved 14-day Pro trial for new tenants and lazy expiry reversion to Free.
- Mechanism: lazy/on-access enforcement because the repository has no existing scheduled execution mechanism to reuse.
- PR: #309.
- Merge/deployment: HOLD for owner review.
- Next task: owner review PR #309 after required checks complete.


# 2026-09-27 — PR #309 Verification

- VERIFIED: Quality #2515 = SUCCESS.
- VERIFIED: W9 Orders QA #690 = SUCCESS.
- PR #309 remains open; merge/deployment held for owner review.


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


# 2026-09-29 — Menuun Auth Email Flow — ACTIVE TASK

- VERIFIED: Resend domain verification is complete and the owner created a restricted Sending access API key.
- IMPLEMENTED: Better Auth now has server-side verification email delivery through Resend, required verification for email/password login, password reset email delivery, session revocation on password reset, and guarded account hard-delete support for accounts with no restaurant linkage.
- IMPLEMENTED: bilingual verification, forgot-password, and reset-password routes; signup now sends the user to verification before onboarding rather than creating an authenticated session immediately.
- IMPLEMENTED: pending signup phone data remains in sessionStorage until the first verified login, then existing server-side phone persistence is used.
- UNKNOWN: Vercel Preview does not yet have verified `RESEND_API_KEY` evidence for this change.
- UNKNOWN: real email inbox delivery and full Preview browser flow.

## EXACT NEXT TASK

CI verification for the auth-email PR, followed by safe Preview environment configuration and end-to-end auth email verification. Do not deploy Production manually.

## 2026-09-30 — Combined Batch — CLOSED FOR REVIEW
- VERIFIED: PR #327 now contains Part A public ordering fix, Part B item-internal ordering, and Part C Offers/Promotions implementation.
- VERIFIED: Quality 2617 and W9 Orders QA 775 passed on the final code head b9a71e02c59676b885baea9cbd938cc9a0706c81.
- HOLD: merge/deployment waits for owner review so this batch receives exactly one production deployment.
- NEXT: owner review only.

## 2026-09-30 — Public Offers Visibility Follow-up — CLOSED
- VERIFIED: the existing public data path already loaded active product offers, but the public product-card and product-detail rendering did not consume that data; this was the direct visibility gap.
- FIXED: active offers now render in featured cards, category product cards, and product details with bilingual labels and old/new pricing; BOGO uses a bilingual fallback label.
- FIXED: quick-add now seeds the displayed active offer price for simple products; checkout remains server-authoritative.
- ADDED: regression contract verifies the public renderer consumes productOffers and exposes the offer UI contract.
- UNKNOWN: physical-device QA remains pending.
- HOLD: PR #327 remains open; merge/deployment waits for owner review and the single release batch.

## EXACT NEXT TASK
Owner reviews PR #327. Do not merge or deploy automatically.
## 2026-09-30 — PR #327 Public Offers Release Evidence
- VERIFIED: public category/product ordering, item-internal ordering, and Offers/Promotions are implemented in one PR.
- VERIFIED: public offer data is present in the canonical database and reaches the public SSR payload for a published menu.
- VERIFIED: public renderer contract, typecheck, tests, lint, production build, all-theme browser QA, and W9 Orders QA are green on the current head.
- BLOCKED: Production release is held by the Vercel deployment rate limit; do not retry randomly.
- EXACT NEXT ACTION: merge PR #327, then one production deployment when the Vercel release gate is available.


## 2026-10-01 — Orders Status Presentation

- IN_PROGRESS: Focused Studio Orders status presentation improvement on `feat/orders-status-presentation`.
- VERIFIED: Base is main merge commit `fc143c525190cfc60241113bb885a22e4836bb70`.
- Scope: six existing order statuses only; shared bilingual label/icon/tone presentation; RTL/LTR-safe badge layout; preserve current actions and lifecycle behavior.
- Out of scope: lifecycle rules, database schema/migrations/triggers, auth/authz, tenant/branch isolation, polling/notifications, sound, WhatsApp, payments, public ordering, production settings, and manual deployment.
- Verification target: focused unit mapping coverage plus repository typecheck/tests/lint/build and applicable Studio/Orders browser QA through GitHub CI.
- NEXT TASK: review the resulting PR and CI evidence; do not merge or deploy automatically.


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

- VERIFIED: `/studio/analytics` now consumes `getOwnerOrderValueAnalytics` for the approved Order Value v1 contract.
- VERIFIED: period selectors, branch scope selection, bilingual copy, transparency notice, and daily trend presentation are implemented without changing the backend contract.
- VERIFIED: Quality `2705` and W9 Orders QA `848` both passed on head `0445ac2f8875b736966733f6c76c3bca3b3a74f1`.
- DEPLOYMENT: not performed; Vercel is intentionally outside the development gate.
- NEXT TASK: owner review PR #343 and authorize merge; no automatic merge/deployment.

# 2026-10-02 — Order Value Analytics UI — MERGED / VERIFIED

- VERIFIED: PR #343 was squash-merged into `main` as `1e732522c7ab9509acfa007cfb7c26bebc874a84`.
- VERIFIED: Quality #2706 and W9 Orders QA #849 passed on the final UI head `cf49ad3998c95cc54a67a673ec73b948e75b1ca3`.
- VERIFIED: the Studio Order Value Analytics UI is now on `main`; backend contract and authorization boundaries remain unchanged.
- DEPLOYMENT STATUS: NOT DEPLOYED.

## EXACT NEXT TASK

Wait for the next explicitly scoped task. Do not deploy or begin unrelated work automatically.

# 2026-10-02 — P0.1 Atomic Public Order Creation — IMPLEMENTED / REVIEW HOLD

- VERIFIED: PR #348 implements the approved P0.1 scope on fix/p0-1-atomic-public-order-2026-10-02.
- VERIFIED: public-order reservation, order/order_items/status-event creation, and idempotency finalization now share one database transaction.
- VERIFIED: TDD RED was proven before implementation; Quality #2717 failed on the missing transaction contract.
- VERIFIED: current head 29328dc4422c67dbdc0cd7dbd613a68de5aebf7c passed typecheck, full npm tests, contract gates, lint, and production build in Quality #2726.
- VERIFIED: W9 Orders browser QA #865 attempt 1 passes the Orders browser flow.
- UNKNOWN/BLOCKED: Studio browser QA in Quality #2726 failed on workspace/onboarding expectations that passed on main Quality #2716.
- DEPLOYMENT STATUS: NOT_PERFORMED.
- IMPLEMENTATION STATUS: PUSHED / FULL CI VERIFIED / PR OPEN.

## EXACT NEXT TASK

Owner reviews PR #348 and explicitly authorizes merge/release if accepted. Do not merge, deploy, or begin P0.2 automatically.

# 2026-10-02 — P1.2 Closeout — VERIFIED / PR #352

- VERIFIED: PR #352 merged into `main` as `66d46d0512f9d50120f053e4826dcfc3ca62278b`.
- VERIFIED: selected public-menu themes are now lazy-loaded through a typed canonical theme loader; static theme implementation imports were removed from the public route and shared renderer.
- VERIFIED: Quality #2769 passed; W9 Orders QA #904 passed; Vercel Preview reached Ready.
- VERIFIED: all five canonical themes, preview/shared renderer contracts, Arabic/English and RTL/LTR behavior, and protected security/order systems remain covered by the implementation/CI scope.
- UNKNOWN: Production bundle transfer/parse/evaluation and physical-device performance evidence.
- DEPLOYMENT STATUS: NOT_DEPLOYED.

## EXACT NEXT TASK

**P1.3 — Public Menu Runtime Performance / Observability**

Measure the current post-P1.2 public-menu baseline first. Do not begin unrelated optimization, do not redesign themes, and do not deploy automatically.


# 2026-10-02 — P1.2 Continuity Closeout — VERIFIED

- VERIFIED: PR #352 merged into `main` as `66d46d0512f9d50120f053e4826dcfc3ca62278b`.
- VERIFIED: Quality #2769 = SUCCESS; W9 Orders QA #904 = SUCCESS.
- VERIFIED: five canonical public themes use the lazy theme loader and static theme implementation imports were removed from the public route/shared renderer.
- UNKNOWN: Production/physical-device performance evidence.
- DEPLOYMENT STATUS: NOT_DEPLOYED.

## EXACT NEXT TASK

**P1.3 — Public Menu Runtime Performance / Observability**

Measure first. Keep the task atomic and do not start another task or deployment automatically.

# 2026-10-02 — P1.3 Runtime Performance / Observability — MERGED / VERIFIED

- VERIFIED: PR #354 squash-merged to `main` as `67f05fff4f7f6c07e87b56df1a9a676f2aee896d`.
- VERIFIED: one evidence-backed atomic improvement completed: tenant/branch-scoped fast path for the existing 15-second public-menu process-local cache, eliminating the redundant `public_content_version` DB read on fresh in-process hits.
- VERIFIED: Quality #2785 = SUCCESS; W9 Orders QA #918 = SUCCESS.
- VERIFIED: all configured typecheck/test/lint/build/browser/performance gates in Quality #2785 passed.
- VERIFIED: no Production deployment.
- UNKNOWN: Production TTFB, cache-hit ratio, real DB read/write volume and physical-device performance.
- BLOCKED: Vercel Preview is independently rate-limited by deployment quota and did not block GitHub verification.

## EXACT NEXT TASK

**P1.4 — Leaked Password Protection**

Do not start automatically. Treat `main@67f05fff4f7f6c07e87b56df1a9a676f2aee896d` as the source of truth.

# 2026-10-02 — Audit Reprioritization — P1.4 Deferred

- DECISION: **P1.4 — Leaked Password Protection is deferred/out of current scope.**
- REASON: current Supabase subscription does not expose the capability and the owner does not currently require it.
- VERIFIED: this is consistent with current Supabase documentation, which states that leaked-password protection is available on Pro Plan and above.
- IMPORTANT: the audit finding remains historically valid and is not marked resolved; it is simply not an active implementation task.
- VERIFIED: P0.1/P0.2 and P1.1/P1.2/P1.3 completed their current scoped work.
- NEXT PRIORITY: **Audit Follow-up — Supabase Migration Three-Way Reconciliation**.
- PURPOSE: reconcile repository migrations, `supabase_migrations.schema_migrations`, and actual live `pg_catalog` schema/functions/triggers/RLS before the next schema release.
- GUARDRAIL: do not blindly replay missing migrations or make schema changes during the reconciliation unless a separate, explicitly authorized implementation task is created.

## EXACT NEXT TASK

**Audit Follow-up — Supabase Migration Three-Way Reconciliation**

Do not start automatically.


# 2026-10-02 — Migration Reconciliation Closeout — VERIFIED

- VERIFIED: PR #356 merged as `3291243387874c6543dc3e6d9a3250550ddf9ba1`.
- VERIFIED: active application ledger = `menu_v3._migrations`; 69/69 top-level repository migrations are applied.
- VERIFIED: Supabase `schema_migrations` has 46 legacy/parallel entries and is not the complete active application chain.
- VERIFIED: live schema contains current latest migration objects; no unvalidated FKs found.
- ORDERING ANOMALY: 20 filename/application-time order mismatches; no automatic repair authorized.
- NO SCHEMA ACTION: reconciliation was read-only.

## EXACT NEXT TASK

**Migration Ledger Strategy — decide whether to retain the custom `menu_v3._migrations` architecture or migrate to canonical Supabase CLI migration tracking.**

Do not implement or repair either path automatically.


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

# 2026-10-02 — Supabase PostgreSQL 17.11 Security-Patch Readiness Audit — VERIFIED

- VERIFIED: Supabase project `ublxptcqefujkbeepylc` is `ACTIVE_HEALTHY` and reports PostgreSQL `17.6.1.166` / server `17.6`.
- VERIFIED: official Supabase changelog states PostgreSQL `15.19 / 17.11` is rolling out from `15.14 / 17.6`, with existing-project upgrades available in the Dashboard from 2026-09-28.
- VERIFIED: official PostgreSQL documentation identifies 17.11 as the fixed version for multiple 17.x security issues, including CVE-2026-14666, CVE-2026-14664, and CVE-2026-14662.
- VERIFIED: project database size is approximately 18 MB.
- VERIFIED: no logical replication slots were present and no active streaming replicas were visible through the database session.
- VERIFIED: no user-schema `reg*` columns were found.
- VERIFIED: `ltree` is not installed, there are no user-schema `ltree` columns/indexes, and no `btree_gist` extension is installed.
- VERIFIED: `pgcrypto` is installed, but there are no user-schema `bytea` columns and no repository/database function references to `pgp_sym_*` or `pgp_pub_*`; no affected application data was identified by this evidence.
- VERIFIED: no affected non-extension custom operators were returned by the official detection query.
- VERIFIED: the only `reg*` columns are internal `realtime` objects and therefore are outside the user-schema upgrade check.
- INFERRED: the project is on the pre-17.11 upstream minor version line and should be treated as requiring owner-controlled upgrade readiness/patch verification, but provider-side backport status for this exact project is not exposed by the connected project metadata.
- UNKNOWN: project-specific Dashboard upgrade eligibility, scheduled maintenance window, and any provider-side patch/backport status for `17.6.1.166`.
- NO DATABASE MUTATION: no upgrade, reindex, extension change, data rewrite, or configuration change was performed.

## EXACT NEXT TASK

**Owner-controlled Supabase PostgreSQL 17.6.1 → 17.11 upgrade execution readiness:** verify the Dashboard shows the project as eligible, review any provider-reported blockers, choose a maintenance window, confirm backup readiness, and only then authorize the actual upgrade. Do not trigger the upgrade automatically from the AI workflow.

## 2026-10-02 — PostgreSQL 17.11 Pre-Upgrade Safety Check — VERIFIED / BLOCKED ON BACKUP GATE

- VERIFIED: main baseline is `83d0dce84de97a46c0ddec7372babd24dcd4ceb5`; PR #359/#360/#361 remain open and documentation-only. Inspected GitHub workflow runs passed; Vercel for #360/#361 currently reports `failure` with a `build-rate-limit` target, so no deployment success is claimed.
- VERIFIED: Supabase project `ublxptcqefujkbeepylc` is `ACTIVE_HEALTHY`, PostgreSQL `17.6.1.166` / server `17.6`, database size `18 MB`.
- VERIFIED: owner-provided Dashboard evidence shows upgrade target `17.11.0.002`; no upgrade was triggered.
- VERIFIED: installed extensions are `pg_stat_statements 1.11`, `pgcrypto 1.3`, `plpgsql 1.0`, `supabase_vault 0.3.1`, and `uuid-ossp 1.1`; no deprecated PG17 extension is installed.
- VERIFIED: 0 logical replication slots, 0 streaming replicas, 0 affected `reg*` columns in `menu_v3/public`, 0 custom operators in `menu_v3/public`, 0 user `ltree` objects, no `btree_gist` extension, and 0 login roles using md5 passwords.
- VERIFIED: live `menu_v3` snapshot remains 45 tables, 441 columns, 189 constraints, 148 indexes, 30 functions, 33 non-internal triggers, 7 policies, and 0 unvalidated constraints; 44/45 tables have RLS enabled.
- VERIFIED: canonical `menu_v3._migrations` has 69 applied migrations; latest is `20261002090000_layered_public_order_abuse_controls.sql`. No migration or schema mutation was performed.
- VERIFIED: current workload snapshot shows 1 non-idle DB session; inspected 24-hour PostgreSQL logs show no ERROR/FATAL/PANIC outside `mgmt-api` audit/tooling activity.
- VERIFIED: organization plan is `free`. Supabase documents daily automated backups for Pro/Team/Enterprise and recommends free-tier projects maintain their own logical/off-site exports; PITR is a Pro/Team/Enterprise add-on.
- UNKNOWN / BLOCKED: no current backup artifact, backup timestamp, restore test, or PITR recovery window was exposed by connected project metadata. Backup/recovery readiness is therefore not verified.
- DECISION: do not execute the PostgreSQL upgrade yet. Compatibility checks are clear enough to continue, but the backup/recovery gate is not cleared.

### Exact next action
**Create and verify a fresh logical backup of the ~18 MB database using `pg_dump`/Supabase CLI, record its timestamp/location and recovery evidence, then choose a maintenance window. Only after that should the Dashboard `Upgrade project` action be explicitly authorized.**
