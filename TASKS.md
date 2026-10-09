## 2026-10-09 — Marketing Footer Structure Fix — IMPLEMENTATION_IN_PROGRESS

- Changed: `src/components/marketing-footer.tsx`; `tests/public-pages-themes-contract.test.mjs`; `tests/menuun-brand-browser.spec.ts`.
- Footer structure: Brand → Links → Contact → Copyright.
- Contact email and WhatsApp are each rendered once, under Contact only.
- Brand tagline consolidated; duplicate About paragraph removed.
- Footer links include Pricing, Preview, Sign in, `/terms`, and `/privacy` in Arabic and English.
- Regression contract added for structure/order, contact uniqueness, legal destinations, and RTL/LTR direction.
- Initial browser QA caught stale expectations for the removed About block; the Playwright browser spec now asserts the intended bilingual footer instead.
- VERIFIED: Quality run `37878156218` passed typecheck, tests, lint, production build, all-theme browser QA, and Menuun homepage/login browser QA in Arabic and English on code/test head `7056b42edca4602e9382ab523b34ee1898de2073`.
- VERIFIED: W9 Orders QA run `37878156194` passed; Vercel PR preview status is SUCCESS.
- UNKNOWN: local shell execution and physical-device QA remain unverified; no Production deployment was triggered.
- Deployment: NOT REQUESTED; hold merge and deployment for owner review.

## Exact next task
PR #385 remains open as Draft for owner review. Do not merge or deploy without explicit approval.

---

## 2026-10-09 — Public Legal Pages & Share Metadata — IMPLEMENTATION_IN_PROGRESS

- VERIFIED: the current homepage uses the shared `MarketingFooter`; before this change its links included Pricing, Preview, and Sign in, while `/terms` and `/privacy` did not exist.
- IMPLEMENTED: added bilingual `/terms` and `/privacy` routes, linked them from the shared marketing footer, and added Arabic/English homepage Open Graph and Twitter Card metadata.
- VERIFIED: `public/og.jpg` is a JPEG with dimensions 1200 × 630 (blob SHA `9efe69d064762539c2d16a0da46261412a0665d8`).
- RESEARCH: official SDAIA/National Data Governance Platform guidance describes Saudi PDPL and its implementing regulations as the relevant personal-data framework. The policy explicitly avoids claiming certification or a completed compliance audit.
- UNKNOWN: local typecheck/test/lint/build could not be run in this connected GitHub-only workspace; the PR's GitHub Actions quality run must be checked.
- UNKNOWN: visual rendering of `og.jpg` in actual social platforms has not been directly observed; its file format and dimensions are verified.
- RELEASE: one review PR only; do not merge or deploy until owner reviews the legal wording.

## Exact next task

Review the open PR's legal wording and CI evidence with the owner. Do not merge or deploy without explicit owner approval.

---

## 2026-10-04 — Official Nafas Studio Sync — VERIFIED

- Completed the authorized Nafas demo task against the correct menu_v3 schema.
- Replaced the previous synthetic product set with the current 12 demo-nafas Studio products and all five current categories.
- Added exact Studio logo/cover assets to public/demo/.
- Preserved current branch, hours, contact, allergens, availability, nutrition fields, and selected image URLs.
- Preserved demo-only option/offer enrichment for showcasing the existing product-option and offer UX.
- Fixed and verified regression tests that still referenced the previous synthetic demo IDs/products.
- VERIFIED: Quality #2888 = SUCCESS.
- VERIFIED: W9 Orders QA #1006 = SUCCESS.
- VERIFIED: Vercel Preview = READY.
- UNKNOWN: physical-device QA.
- PRODUCTION: NOT_DEPLOYED.

## EXACT NEXT TASK

Final diff review → owner approval → merge PR #377 → one production deployment → real-device QA. P1.9 remains deferred.

# 2026-10-04 — Official Nafas Demo Hardening — IMPLEMENTATION / VERIFICATION PENDING

- Scope: official static Nafas showcase data.
- Completed: 20+ products, five categories, two branches, hours, social/contact links, allergens, dietary labels, tags, variants, modifier groups/options, and three item offers.
- Completed: focused regression coverage in `tests/theme-renderer-contract.test.mjs`.
- Protected: existing `DEMO_MENU` architecture and recent P1.4–P1.8 performance work.
- Verified: GitHub Quality #2870 and W9 Orders QA #988 passed on the final implementation head; Vercel preview is READY.
- Production release remains intentionally unperformed.
- Deployment: NOT_PERFORMED.
- Next: P1.9 — Real-route performance evidence and budget decision.

---

# 2026-10-03 — P1.8 Performance Gates — CLOSED / VERIFIED

- VERIFIED: P1.7 PR #375 was merged into `main` before P1.8 started; current P1.8 implementation head is `dfbecb52d765169668c48184215f24a031719a48`.
- IMPLEMENTED: `scripts/performance-audit.mjs` now captures Playwright initial request count, HTML/JS/CSS/image/font transfer evidence, long-task evidence, and optional client-transition evidence.
- IMPLEMENTED: LCP/CLS/INP fields remain nullable/explicitly supported rather than being fabricated when the headless environment does not expose them.
- IMPLEMENTED: regression coverage was added to `scripts/quality-workflow.test.mjs`.
- VERIFIED: GitHub Quality #2860 passed, including typecheck, tests, lint, production build, browser QA, golden performance fixture, Studio QA, Platform Admin QA, and browser performance baseline upload.
- VERIFIED: W9 Orders QA #979 passed.
- VERIFIED: controlled preview baseline recorded 103 initial requests, 771.7ms DCL, 776ms FCP, 0 long tasks, and 48,957 transferred JS bytes.
- VERIFIED: golden 30-product fixture recorded 32 initial requests, 28.4ms DCL, 44ms FCP, and 20,587 transferred HTML bytes.
- UNKNOWN: client-transition numeric baseline because no real transition selector is configured in the current harness.
- UNKNOWN: LCP in the current headless measurement.
- DECISION: no hard numeric performance budget was introduced yet; current evidence is sufficient for repeatable measurement, not for a stable production-equivalent threshold.
- DEPLOYMENT STATUS: NOT_PERFORMED.

## EXACT CURRENT STATE

**P1.8 — Performance Gates: CLOSED / VERIFIED**

Branch: `perf/p1-8-performance-gates-2026-10-03`

Audit: `docs/performance/p1-8-performance-gates-audit.md`

## ACCEPTANCE STATUS

- [x] Initial request count evidence.
- [x] DCL/load evidence.
- [x] HTML/JS/CSS/image/font transfer evidence.
- [x] Long-task/main-thread evidence.
- [x] Optional client-transition measurement path.
- [x] LCP/CLS/INP support state recorded.
- [x] Regression contract.
- [x] Quality #2860.
- [x] W9 Orders QA #979.
- [ ] Client-transition numeric baseline.
- [ ] Production/real-device LCP.
- [ ] Hard numeric budgets.

## EXACT NEXT TASK

**P1.9 — Real-route performance evidence and budget decision**

Use the new measurement surface on representative public-menu and ordinary client-transition flows. Only after stable repeated evidence exists should hard numeric regression budgets be proposed.

---

# 2026-10-03 — P1.7 Vite/Rolldown Chunk Optimization — CLOSED / VERIFIED — NO CODE CHANGE

- VERIFIED: P1.6 continuity PR #374 was squash-merged into `main` as `1f1dbc3a853efcfaa3aca620989635dcc3ffecc5`.
- VERIFIED: current production client build uses Vite 8.2.2/Rolldown.
- VERIFIED: the current production client build produced 142 JavaScript asset rows; the largest client chunk was `index-BDOzjaAe.js` at 272.62 kB raw / 88.49 kB gzip.
- VERIFIED: no client chunk exceeded Vite's default 500 kB warning threshold.
- VERIFIED: automatic code splitting is already enabled; no `manualChunks` or `rolldownOptions` override exists.
- VERIFIED: current evidence does not identify duplicated module ownership or a safe manual grouping with a proven net request/transfer benefit.
- VERIFIED: no runtime/configuration code was changed by P1.7.
- UNKNOWN: browser-level initial JS transfer, client-transition request count, cache reuse, main-thread execution cost, and route-specific module dependency graphs.
- DEPLOYMENT STATUS: NOT_PERFORMED.

## EXACT CURRENT STATE

**P1.7 — Vite/Rolldown Chunk Optimization: CLOSED / VERIFIED — NO CODE CHANGE REQUIRED**

Branch: `perf/p1-7-vite-rolldown-chunk-optimization-2026-10-03`

Audit: `docs/performance/p1-7-vite-rolldown-chunk-audit.md`

## ACCEPTANCE STATUS

- [x] Current main and P1.6 continuity merge verified.
- [x] Vite/Rolldown production build baseline captured from GitHub Quality.
- [x] Client chunk inventory analyzed.
- [x] Oversized/duplicated chunk evidence assessed.
- [x] Manual chunking risk assessed against current Rolldown behavior.
- [x] No speculative chunking introduced.
- [ ] Browser-level JS transfer/cache/client-transition measurements remain UNKNOWN.
- [x] Deployment not performed.

## EXACT NEXT TASK

**P1.8 — Performance Gates**

Turn the existing performance targets into repeatable regression evidence for request count, client transitions, DCL/LCP, JS/CSS transfer, main-thread work, and representative DB/API measurements where the available tooling supports them.

---

# 2026-10-03 — P1.6 Analytics Boundary & Caching — CLOSED / VERIFIED

- VERIFIED: PR #373 was squash-merged into `main` as `f2f1271d4ffb146ffe64ffb2dac5f3665d324855`.
- VERIFIED: `getOwnerAnalytics` now uses one authorized server-side SQL boundary with a tenant-scoped `MATERIALIZED` CTE and server-side JSON aggregation.
- VERIFIED: `authMiddleware`, server-derived tenant membership, validated `days` input, response shape, and analytics semantics were preserved.
- VERIFIED: GitHub Quality #2836 and W9 Orders QA #958 passed on the final P1.6 head.
- VERIFIED: no personalized analytics caching was added because current evidence does not justify shared/private cache complexity.
- VERIFIED: no schema, migration, index, auth/RLS, or tenant-isolation change was made.
- VERIFIED: no current UI was proven to require traversal beyond existing bounded analytics/dashboard result pages, so no speculative cursor pagination API was introduced.
- UNKNOWN: end-to-end browser/network request reduction and production analytics latency remain unmeasured.
- DEPLOYMENT STATUS: NOT_PERFORMED.

## EXACT NEXT TASK

**P1.7 — Vite/Rolldown Chunk Optimization**

Start with repository-first production build/chunk evidence. Optimize only a proven oversized or duplicated chunk; do not add speculative manual chunking and do not deploy automatically.

---

# 2026-10-03 — P1.5 Database Query Consolidation — IMPLEMENTATION_IN_PROGRESS

- VERIFIED: P1.4 is closed/merged; current `main` is `d9d83c89c0070413c61f8a75e3120447006e4828`.
- VERIFIED: `getOrdersDashboard` and `getPlatformOrders` contained correlated `order_items` count/JSON aggregation per returned order.
- VERIFIED: `getPlatformDashboard` contained correlated per-tenant branch/product/order/member count subqueries.
- IMPLEMENTED: grouped `item_agg` + bounded `page_orders` for Studio and Platform order readers.
- IMPLEMENTED: grouped tenant count CTEs + joins for Platform dashboard tenants.
- IMPLEMENTED: `tests/p1-5-query-consolidation.test.mjs` registered in `npm test`.
- UNKNOWN: runtime query-plan/latency improvement and exact DB round-trip counts.
- BLOCKED: local shell execution unavailable; CI is the verification gate.
- DEPLOYMENT STATUS: NOT_PERFORMED.

## ACCEPTANCE STATUS

- [x] Repository-first query audit completed.
- [x] Concrete correlated order-item inefficiency proven.
- [x] Concrete Platform per-tenant count inefficiency proven.
- [x] Query consolidation implemented without schema changes.
- [x] Regression contract added and registered.
- [ ] GitHub Quality/W9 verification passed.
- [ ] Final diff reviewed after CI.
- [ ] Runtime DB plan/latency measurement.

## EXACT NEXT TASK

**Finish P1.5 verification and continuity closeout.** Do not start cursor pagination, indexes, migrations, or deployment until this task is closed.

---
# 2026-10-03 — P1.4 Request Waterfall Consolidation — CLOSED / VERIFIED

- VERIFIED: repository-wide request-boundary audit identified the redundant Studio snapshot calls in Analytics and Reports.
- IMPLEMENTED: both routes reuse the existing authorized `StudioGate` snapshot.
- VERIFIED: regression contract `tests/p1-4-request-waterfall.test.mjs` is registered in `npm test`.
- VERIFIED: Quality #2824 = SUCCESS; W9 Orders QA #949 = SUCCESS.
- VERIFIED: final diff review completed; PR #370 squash-merged into `main` as `1bb30fc675ee2cdf448cba380223dd00240dee0a`.
- UNKNOWN: exact production/browser request count, production DCL/LCP, and physical-device performance.
- DEPLOYMENT STATUS: NOT_PERFORMED.

## ACCEPTANCE STATUS

- [x] Proven duplicate identified.
- [x] Analytics duplicate removed.
- [x] Reports duplicate removed.
- [x] Regression coverage added.
- [x] Full automated/browser CI verification passed.
- [x] Final diff reviewed.
- [x] PR merged.
- [ ] Runtime request-budget measurement.

## EXACT NEXT TASK

**P1.5 — Database Query Consolidation and Pagination**

Perform repository-first query/code audit only. Inspect `owner.ts`, `orders.ts`, `platform.ts`, analytics modules, and N+1/pagination candidates. Stop at evidence; do not start DB changes without a proven target.

# 2026-10-03 — P1.2 Active Theme Stylesheet Code Splitting — IMPLEMENTATION_IN_PROGRESS

- VERIFIED: canonical `main` at task start is `ad428e13d3a2f483d342829df11cff3d7fe99692`.
- VERIFIED: PR #365 is a separate documentation-only Performance Guardian registration branch; it is not the implementation branch for this task.
- VERIFIED: the repository already has lazy theme *template/component* loading through `getLazyThemeTemplate()`; that completed capability is protected and is not being reimplemented.
- VERIFIED: `src/routes/__root.tsx` previously linked the full theme/refinement stylesheet set eagerly.
- VERIFIED: `MenuThemeController` previously changed theme tokens but did not own stylesheet lifecycle.
- VERIFIED: public menu routes already have SSR theme bootstrap through `createThemeBootstrapScript()`.
- USER-OBSERVED: homepage request count was approximately 117 HTTP requests; this has not been independently browser-verified in the current connector-only session.
- VERIFIED: a permanent performance master plan is now recorded at `docs/performance/performance-optimization-master-plan.md`.
- VERIFIED: implementation branch is `perf/p1-2-theme-css-code-splitting-2026-10-03`.
- IMPLEMENTATION_IN_PROGRESS: active-theme stylesheet registry, SSR active-theme links, client stylesheet synchronization, shared/theme-specific CSS separation, and regression contract are being implemented.
- PROTECTED: auth/RLS, tenant/branch isolation, order lifecycle, analytics authorization, preparation-time/ETA, image delivery, five theme identities, and existing lazy theme template architecture.
- UNKNOWN: browser request waterfall, DCL, LCP, CSS/JS transfer sizes, production DB timings, and production cache behavior until browser/runtime evidence is collected.
- DEPLOYMENT STATUS: NOT_PERFORMED.

## EXACT CURRENT TASK

**P1.2 — Active Theme Stylesheet Code Splitting**

### Acceptance criteria
1. No theme stylesheet is eagerly linked from `src/routes/__root.tsx`.
2. Public menu SSR links only the stylesheet set for the active canonical theme.
3. Client theme/preview changes remove obsolete managed stylesheets and load only the new active set.
4. SSR theme bootstrap remains intact.
5. All five canonical themes remain available: `essential`, `editorial`, `noir`, `heritage`, `gallery`.
6. Arabic/English and RTL/LTR behavior are unchanged.
7. A regression contract prevents reintroducing root-level eager theme CSS.
8. Relevant tests/typecheck/lint/build/browser checks are run when tooling permits.
9. Final diff contains only task-scoped changes.
10. No Production deployment occurs automatically.

## EXACT NEXT VERIFICATION

Run focused theme CSS contract, then typecheck, full test suite, lint, production build, and browser/all-theme network evidence where available. Review the final diff. If verification is blocked by the connector-only environment, record the exact command and remaining risk.

## EXACT NEXT TASK AFTER P1.2

**P1.3 — Route Code-Splitting / Client Transition Budget**

Do not start P1.3 until P1.2 is closed and this continuity state is updated.


# 2026-10-03 — CI Studio Fixture Dependency — VERIFIED / MERGED

- VERIFIED: the Quality #2801 failure was caused by the Studio browser fixture omitting the existing PH-04 migration `20260917120000_ph04_platform_admin_subscription_controls.sql`, which creates `menu_v3.platform_admin_subscription_audit` consumed by the Studio subscription runtime.
- VERIFIED: the fix is CI/test-only; no production database, migration, RLS, auth, tenant/branch, or application-runtime change was made.
- VERIFIED: PR #363 was squash-merged into `main` as `968f8bd30a8f5c82e35cb02a26e5e16a1f11bce9`.
- VERIFIED: final Quality #2804 passed all stages, including Studio browser fixture preparation and Studio/Admin browser QA.
- VERIFIED: W9 Orders QA #933 passed on the same final head.
- VERIFIED: the regression guard in `scripts/quality-workflow.test.mjs` now protects the Studio fixture from dropping this migration dependency.
- DEPLOYMENT STATUS: NOT_PERFORMED. This was a CI/test infrastructure fix only.

## EXACT NEXT TASK

**Owner-select the next explicitly scoped Menu V3 task. Do not start another implementation, deployment, or audit automatically.**

# 2026-10-02 — P1.1 Closeout — VERIFIED / PR #351

- VERIFIED: P1.1 is complete on the implementation head the final P1.1 PR head.
- VERIFIED: Quality #2756 passed all configured quality/browser/performance gates.
- VERIFIED: W9 Orders QA #892 passed.
- VERIFIED: no Production deployment was performed.
- UNKNOWN: production TTFB, DB reads/writes, cache hit ratio, HTML/SSR payload size, and LCP before/after.
- BLOCKED: Vercel Preview is VERIFIED / SUCCESS; no Production deployment was performed.
- IMPLEMENTATION STATUS: PUSHED / VERIFIED / HOLD FOR OWNER MERGE.
- DEPLOYMENT STATUS: NOT_DEPLOYED.

## EXACT NEXT TASK

**P1.2 — Theme Code Splitting**

Do not begin P1.3, deployment, or unrelated cleanup.
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

- VERIFIED: PR #349 merged into main at 5e2cdf847251f0bc6a8688667a7d3e060e768419.
- VERIFIED: Quality #2731 and W9 Orders QA #869 passed.
- VERIFIED: P0.2 acceptance criteria are satisfied and final diff review completed.
- DEPLOYMENT STATUS: NOT_PERFORMED.

## EXACT NEXT TASK

P1.1 — Public Menu Cache/Session Decoupling.

---
# 2026-10-02 — P0.2 Layered Public Order Abuse Protection — IMPLEMENTATION IN PROGRESS

- VERIFIED: P0.1 merged as 7bfa8ceafff4340466d776d5410fe455d07d2f15.
- IMPLEMENTATION_IN_PROGRESS: P0.2 implementation is scoped to public-order abuse controls only.
- VERIFIED: focused regression contracts were added for layered identity, post-validation quota, and separate invalid throttling.
- UNKNOWN: CI execution results until PR verification.
- DEPLOYMENT STATUS: NOT_REQUESTED / NOT_PERFORMED.

## EXACT NEXT TASK

Verify the P0.2 PR quality gates and review the final diff before merge.

---

# 2026-10-02 — Order Value Analytics Tenant Scope — DONE / DEPLOYED / VERIFICATION CLOSEOUT
- VERIFIED: Empty Order Value Analytics observation reproduced at the data-scope level for a multi-tenant account: the previous implementation selected the first active membership rather than the tested restaurant tenant.
- VERIFIED: PR #345 adds tenant-aware Order Value Analytics selection without weakening tenant/branch isolation.
- VERIFIED: Focused Order Value tests, UI contract tests, TypeScript, full npm test suite, lint, production build, Studio browser QA, Platform Admin browser QA, and W9 Orders QA passed through GitHub Actions.
- VERIFIED: PR #345 merged into `main` at `e7a2d42660d2b563cc473b6845236d89de61025f`.
- VERIFIED: Production deployment `dpl_6wCbjhxQJyZ8RKicBs7mhEX1Jvo2` is READY for the merged `main` commit.
- UNKNOWN: authenticated owner-side visual confirmation of the selected tenant result in Production.
- IMPLEMENTATION STATUS: DONE.
- DEPLOYMENT STATUS: DEPLOYED / VERIFIED.

## EXACT NEXT ACTION

Run one authenticated Production smoke for `مقهى زهر النعناع` → Today → all permitted branches and confirm the expected live metrics; do not begin another implementation task automatically.

---
# 2026-10-02 — Preparation Time + Estimated Ready Time — CLOSED / VERIFIED
- VERIFIED: PR #339 is merged; its three-file scope is documentation-only (PROJECT_STATE.md, PLAN.md, TASKS.md) and contains no runtime/application changes.
- UNKNOWN: direct real-device Production QA evidence is not established by the current GitHub evidence.

- VERIFIED: preparation duration and estimated ready time are implemented and merged onto the current `main` lineage.
- VERIFIED: focused security, authorization, validation, atomicity, concurrency, legacy-null, and bilingual/RTL contracts passed.
- VERIFIED: Quality `36932980800` passed.
- VERIFIED: W9 Orders QA `36932980956` passed.
- VERIFIED: Vercel Preview passed.
- DEPLOYMENT STATUS: DEPLOYED / VERIFIED.
- VERIFIED: Production deployment `dpl_58LkHc6RByWjfSnzFwNitsvbytgu` is READY and targets `production`.
- VERIFIED: the runtime Production deployment `dpl_58LkHc6RByWjfSnzFwNitsvbytgu` is READY and serves release commit `ed995f264c0c821eeafade563c250c374f19f88f`. The subsequent continuity PRs (#339, #340, and this closeout) are documentation-only; Production therefore intentionally remains on the verified runtime release while `main` carries only continuity-documentation changes.

## EXACT NEXT TASK

No further work for this atomic feature. Wait for the next explicitly scoped task.

---
# 2026-10-01 — Safe Order Lifecycle Enforcement — PR #333 / CI REPAIR IN PROGRESS

- VERIFIED: PR #333 remains open and unmerged; previous head was `cb3f3d218b309b859ce9f407412edcbbe789f25a`.
- VERIFIED: implementation scope remains the six-file PR scope; no migration or unrelated subsystem changes are authorized.
- VERIFIED: lifecycle matrix, same-status/no-audit semantics, server-side authorization, tenant boundary, branch behavior, row locking, and atomic audit behavior remain unchanged.
- VERIFIED: Vercel status for the previous head is success/Ready.
- FIXING: Quality/W9 previously failed at the TypeScript parse/typecheck stage because the new test contained a literal `\n`; the test is being repaired now.
- UNKNOWN: new-head Quality/W9 results until CI completes.
- DEPLOYMENT STATUS: NOT DEPLOYED.

### EXACT NEXT TASK

Verify the repaired PR #333 head through Quality and W9. Do not merge or deploy automatically.
---

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

- VERIFIED: PR #324 merged the application implementation at `78550457a7ba7e2c23f2190856c1fb5c8cf71c3e`.
- VERIFIED: GitHub Quality #2590 and W9 Orders QA #751 passed.
- VERIFIED: Implementation deployment `dpl_APMeXne3rQkaVa9VtjDuHYMpSpW4` was READY for the implementation merge.
- VERIFIED: Continuity deployment `dpl_8io82PjFjwhrLYVdKSVLZ9G3EQWB` was READY for `main` after the continuity closeout.
- VERIFIED: Menuun attribution is wired into the public menu and Studio workspace without replacing tenant branding.
- VERIFIED: Menuun brand manifest records `integration_status: WIRED`.
- UNKNOWN: direct physical Android/iOS rendering evidence for the new footer.
- IMPLEMENTATION STATUS: DONE.
- DEPLOYMENT STATUS: DEPLOYED / VERIFIED.

## EXACT NEXT TASK

No further work for this atomic task. Wait for the next explicitly scoped task.

- VERIFIED: PR #324 was merged into `main` as `78550457a7ba7e2c23f2190856c1fb5c8cf71c3e`.
- VERIFIED: GitHub Quality #2590 and W9 Orders QA #751 passed.
- VERIFIED: Vercel Production deployment `dpl_APMeXne3rQkaVa9VtjDuHYMpSpW4` is READY for `main` commit `78550457a7ba7e2c23f2190856c1fb5c8cf71c3e`.
- VERIFIED: Menuun attribution is wired into the public menu and the Studio workspace without replacing tenant branding.
- VERIFIED: Menuun brand manifest records `integration_status: WIRED`.
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

- VERIFIED: PR #303 `feat(orders): unify receipt preview and printing` is open and mergeable against `main`.
- VERIFIED: Head `61065efc2d64f7c60e236dc7f681460241616aa3` passed Quality and W9 Orders QA.
- VERIFIED: All Studio and public-menu receipt surfaces continue to use the single shared receipt renderer.
- VERIFIED: The owner/Studio receipt action now opens the same professional receipt preview used by the unified receipt flow before print.
- VERIFIED: Print isolation, Gregorian date formatting, optional VAT registration display, and informal/non-ZATCA labeling are covered by the receipt contract tests.
- UNKNOWN: Physical printer output on a real device.
- BLOCKED: Vercel preview deployment is currently limited by the account deployment-rate limit.
- IMPLEMENTATION STATUS: READY_TO_REVIEW
- DEPLOYMENT STATUS: NOT_DEPLOYED
- EXACT NEXT TASK: Owner reviews PR #303; merge/deploy only with explicit release authorization.
# 2026-09-25 — Order Receipt Print Isolation — MERGED / DEPLOYED

- VERIFIED: PR #301 `fix(orders): isolate receipt print output` passed full Quality #2476 and W9 Orders QA #658.
- VERIFIED: PR #301 squash merge commit is `027d765a11a7e6bf8e40468ea79ac7c3c5eda2de`.
- VERIFIED: Vercel Production deployment is `dpl_7G9JMXYrdCXkQaDTZ7dtjVeBbHZh`, target `production`, state `READY`.
- VERIFIED: deployed commit `027d765a11a7e6bf8e40468ea79ac7c3c5eda2de` matched `main` HEAD at deployment time.
- VERIFIED: no Vercel build-rate-limit retry was required.
- UNKNOWN: no physical printer/device output capture was performed in this session.
- STATUS: **MERGED + DEPLOYED**.

## EXACT NEXT TASK

**No further receipt-print work. Wait for the next explicitly authorized task.**

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


## Performance Remediation — Current Task State — 2026-09-22

- VERIFIED: `main` HEAD after Phase 4 continuity closeout is `93c2d8a7f4524986346f4439b5f829cb51308a95`.
- VERIFIED: Phase 0 Evidence Lock — CLOSED.
- VERIFIED: Phase 1 Shared Image Delivery Foundation — COMPLETE / MERGED.
- VERIFIED: Phase 2 Responsive Public Media — COMPLETE / MERGED.
- VERIFIED: Phase 3 Branding / Cover Decoupling — COMPLETE / MERGED, PR #247, merge `fb4c5dba311d5f77c3bcb943f13e35cb92ab8584`.
- VERIFIED: Phase 4 Featured Presentation Bound — COMPLETE / MERGED, PR #249, merge `aa1ac6ba942228e8ad2e32f6c76b485b4706ea78`.
- VERIFIED: Quality #2282 passed; W9 Orders QA #507 passed.
- VERIFIED: Vercel preview failed only on the documented build-rate-limit surface; no retry and no Production deployment.
- UNKNOWN: real-device/Production performance evidence.

## Exact Next Task

**Phase 5 — Public HTML / SSR Payload Reduction.**

Measure the golden 30-item menu first. Identify repeated serialized media and unnecessary SSR payload; make only evidence-backed reductions; preserve hydration, SEO, structured data, and all product/order semantics.


# CURRENT TASK STATE — 2026-09-22

## Current Position

- VERIFIED: `main` HEAD is `b5e5e0f7fa000b1451b605e2fb9b484cde690170`.
- VERIFIED: Phase 4 runtime merge is `aa1ac6ba942228e8ad2e32f6c76b485b4706ea78`.
- VERIFIED: Quality #2282 passed and W9 Orders QA #507 passed.
- VERIFIED: Phase 4 was not deployed to Production.
- UNKNOWN: current Production identity/performance and real-device waterfall/LCP for the 30-item golden tenant.
- VERIFIED: all 7 audited RLS-disabled tables are now RLS-enabled and server-only.
- VERIFIED: Issue #233 is CLOSED / COMPLETED.
- UNKNOWN: physical Android/iOS/QR/device evidence.
- REMAINING SECURITY WARNINGS: one mutable function `search_path` warning and one Auth leaked-password-protection warning remain separate.

## Exact Next Task

**Physical Android/iOS/QR/theme/order/RTL smoke QA for current `main` `d6e2b6e9ed13dda4a7cd82d82d4205137a4ef5e0`.**

## Not Next

- No new theme or homepage redesign.
- No unrelated feature work.
- Do not reopen the completed RLS remediation without new evidence.
- Do not start Payment Provider / Commercial Launch / PH-07 / R10 prerequisite work.
- Treat the two remaining Supabase warnings as separate scoped security tasks.

# TASKS


## Current State — 2026-09-18

- VERIFIED: release-stage operational verification completed against verified main b78b69ea0921571a1ca454c30ca81a43e5cf20b5 before this documentation batch.
- VERIFIED: Vercel Production deployment was READY and matched GitHub commit b78b69ea0921571a1ca454c30ca81a43e5cf20b5 at verification time.
- VERIFIED: production root returned HTTP 200.
- VERIFIED: invalid public menu probe returned HTTP 404.
- VERIFIED: invalid branch variant returned HTTP 404.
- VERIFIED: no error/fatal runtime logs were found for the checked production deployment in the inspected 2-hour window.
- VERIFIED: production theme-testing override is hard-disabled server-side in production; no code change is justified.
- UNKNOWN: exact production environment-variable secret values.
- UNKNOWN / EXTERNAL: physical Android/iOS production QA.

## PH Lifecycle — Completed

PH-01 through PH-06 are completed historical milestones. No additional PH milestone is currently defined.

## PH-01 — CLOSED / VERIFIED / MERGED

PR #170: `fix: retire legacy customer approval and request flows`

Merge commit: `7e91778bfafa67b24efd1edf4387e1f3014fae9d`

### Acceptance state
- New customer: Home → Registration → secure workspace provisioning → Studio.
- Existing customer: Home → Login → email OR phone + password → existing workspace / Studio.
- New customers no longer depend on manual approval/request gating.
- `/admin/users` remains the server-authorized customer-control surface.
- Legacy Leads and Service Requests are retired from the active Platform Admin lifecycle surface.
- Tenant/branch isolation, fail-closed provisioning, auth, authorization, and server-side trust boundaries remain protected.

### Verification provenance
- GitHub confirms PR #170 merged into `main` at `7e91778...`.
- Manus reported successful Quality and W9 Orders QA gates.
- Manus reported the remaining local TypeScript/baseUrl check was a local toolchain/version mismatch rather than an application failure.

## Homepage Runtime Fix — CLOSED / VERIFIED / MERGED

PR #172: `fix: prevent homepage React.Children.only crash`

Merge commit: `8050d2f08a2904f5ee2d9085454c47bdba601392`

### Acceptance state
- Public homepage signup CTAs no longer crash when `Button asChild` contains a Link plus an icon.
- Radix `Slottable` keeps the Link as the slotted interactive element while preserving sibling content.
- Regression contract covers the homepage multi-child `asChild` pattern.
- No backend, database, authentication, RLS, tenant isolation, pricing, theme renderer, or deployment configuration changes were introduced.

### Verification
- GitHub Actions Quality run `35266109690` — SUCCESS.
- Typecheck — SUCCESS.
- Full repository tests — SUCCESS.
- Lint — SUCCESS.
- Production build — SUCCESS.
- Public all-theme browser QA — SUCCESS.
- Studio browser QA — SUCCESS.
- Platform Admin browser QA — SUCCESS.
- W9 Orders QA run `35266109691` — SUCCESS.
- Physical production device QA — UNKNOWN / release-stage pending.

## Completed Strategic Tasks

- P0 Public Order Hardening — CLOSED / VERIFIED.
- P1 Production/Continuity Hardening — CLOSED / VERIFIED.
- P2 Growth & Differentiation — CLOSED / VERIFIED / DEPLOYED.
- Platform Approval Center — CLOSED / VERIFIED.
- Registration-link rendering — CLOSED / VERIFIED.
- Onboarding Creation Recovery — CLOSED / VERIFIED / MERGED.
- Menu Intelligence V5 Report Center — CLOSED / VERIFIED / MERGED.
- AI Provider Routing & Multimodal Fallback — CLOSED / VERIFIED / MERGED.
- Grounded Guest Menu Assistant — CLOSED / VERIFIED.
- Gallery + Noir Theme Hardening — CLOSED / VERIFIED / MERGED.
- Continuity reconciliation — CLOSED / VERIFIED / MERGED.
- R2.1–R2.7 Menu Intelligence — CLOSED / VERIFIED.
- R4.1–R4.5 Owner Intelligence — CLOSED / VERIFIED.
- R5 Growth Extensions — CLOSED / VERIFIED.
- R6 bounded WhatsApp CTA experiment — CLOSED / VERIFIED for implementation; outcome pending meaningful real exposure.
- R7 evidence review — IN PROGRESS / NON-BLOCKING while exposure remains insufficient.
- R8.1–R8.5 Closed-Loop Menu Growth Engine — CLOSED / VERIFIED / MERGED.
- R9 Guest CRM / Loyalty / Campaigns / Feedback / Retention — CLOSED / VERIFIED / MERGED.
- W7.1–W7.12 — CLOSED / VERIFIED for implemented scope; physical Android/iOS QA remains release-stage evidence.
- W8 Internal Visual System — DONE / VERIFIED for implemented scope; existing draft PR history remains separate.

## Production / Commercial Readiness

- Repository-side implementation through the completed PH lifecycle plus the homepage runtime fix is present in `main`.
- Physical Android/iOS production QA remains UNKNOWN / release-stage pending.
- Current production environment-variable values remain UNKNOWN from repository evidence.
- Do not use Vercel as the development iteration loop.

## Protected Scope

- Essential, Editorial, Noir, Heritage/Taste, and Gallery.- Public menu behavior, customer actions, authentication, authorization, tenant/branch isolation, routing, migrations, and deployment controls.
- Quick Add, Item Notes, Cart, Orders, Notifications, Import, AI provider infrastructure, Platform Admin security, subscription protection, and release-only Vercel workflow.
- Do not repeat completed work without current reproducible regression evidence.

## A.1 — CLOSED / VERIFIED
- Customer Journey & Event Truth Audit completed.
- Audit: `docs/audits/2026-09-18-a1-customer-journey-event-truth-audit.md`.
- No runtime/schema/deployment changes.
- Verified gaps: search/category/add-to-cart measurement and direct anonymous session → order linkage.
- Live RLS-disabled tables are recorded as a separate security blocker.

## A.2 — CLOSED / VERIFIED BY CI
- Search measurement added with session-level duplicate protection.
- Category selection measurement added with tenant-scoped `category_id` validation/storage.
- Add-to-cart measurement added to all active public renderer families.
- Focused regression coverage added.
- Existing analytics, R6, order, theme, and security boundaries preserved.

## A.3 — CLOSED / VERIFIED BY CI — Server-Controlled Anonymous Session → Order Attribution
- Implementation complete on `feat/a3-session-order-attribution-2026-09-18`.
- Final head: `3dfda5e9b4dc93f4f33855595993e1ce568210a5`.
- PR #192 is CLOSED / MERGED at `42f0a7e3caf8939b28672685ac2d578578c9d90c`.
- Server-controlled `__Host-menu_v3_sid`, tenant-bound `anonymous_sessions`, server-side event attribution, and tenant-safe order attribution are implemented.
- Client-supplied canonical event session IDs are removed.
- Quality run `35344719541` and W9 Orders QA run `35353500533` passed.
- No production deployment occurred.
- Vercel preview status is rate-limit failure only; no retry was performed.

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
- VERIFIED: PR #196 merged to `main`: `b98e3e1ae832c389157de2205979be4801fce63b`.
- VERIFIED: `server/middleware/seo-discovery.ts` is the sole active discovery owner; `src/lib/seo/crawl.ts` was removed and `grok-pwa.ts` no longer handles robots/sitemap.
- VERIFIED: public tenant and branch routes now throw `notFound()` for `not_found` menu resolution.
- VERIFIED: Quality `35363323737` and W9 Orders QA `35363323728` passed.
- VERIFIED: final PR diff was reviewed before merge.
- BLOCKED / NON-BLOCKING: Vercel rate limit; no deployment/retry.
- UNKNOWN: direct production HTTP 404 verification and physical device QA.

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


## 2026-09-19 — Homepage Redesign + Innovation Workflow — IN PROGRESS

- VERIFIED: owner authorized implementation of the prepared homepage redesign.
- VERIFIED: PR #206 `feat: redesign homepage and add permanent innovation research workflow` is open.
- VERIFIED: homepage proof now covers guest journey, restaurant presence/themes, Studio/control, intelligence/growth framing, Arabic/English/mixed-direction proof, pricing, FAQ, and CTA.
- VERIFIED: permanent innovation research workflow added and connected to specialist routing.
- VERIFIED: protected backend/auth/theme/business boundaries remain untouched.
- UNKNOWN: local typecheck/lint/build/browser verification.
- UNKNOWN: GitHub Actions Quality run for PR #206; no workflow run is currently visible through the connector.
- BLOCKED / NON-BLOCKING: Vercel build-rate-limit status; no deployment or retry.
- Implementation status: `IMPLEMENTATION_IN_PROGRESS`.
- Deployment status: `DEPLOYMENT_BLOCKED` / not deployed.

### Historical Next Task

Review PR #206 quality evidence and final diff; if clean, prepare one controlled merge to `main` without deploying.


## 2026-09-19 — Homepage Redesign + Innovation Workflow — COMPLETE

- VERIFIED: PR #206 merged into `main` at `0f2f145b64d41f670ee2508582f76e2196b53b67`.
- VERIFIED: Quality run #2097 passed.
- VERIFIED: W9 Orders QA run #357 passed.
- VERIFIED: permanent Research, Innovation & Creative Intelligence workflow is now part of the repository routing contract.
- BLOCKED / NON-BLOCKING: Vercel deployment remains blocked by the free daily deployment limit; no deployment was performed.
- Implementation status: `DONE`.
- Deployment status: `DEPLOYMENT_BLOCKED`.

### Historical Next Task

Release-stage production verification of the merged homepage, then physical Android/iOS/QR/theme/order/RTL smoke QA.

## 2026-09-19 — Commercial Packaging + Arabic Homepage Refinement — CLOSED / VERIFIED

- VERIFIED: PR #208 merged into `main` at `df2569e92e25380c6fc4957eba8b2d96353bd1f9`.
- VERIFIED: Free = 20 products / 1 branch / 2 team members.
- VERIFIED: Growth = 49 SAR monthly / 490 SAR annual / 300 products / 3 branches / 10 team members.
- VERIFIED: Pro = 149 SAR monthly / 1,490 SAR annual / unlimited products / 10 branches / 25 team members.
- VERIFIED: plan-specific feature packaging is surfaced in homepage and `/pricing`.
- VERIFIED: Pro unlimited display no longer exposes the numeric sentinel.
- VERIFIED: Arabic menu examples were refined using Saudi restaurant-native wording after competitor research.
- VERIFIED: image slots are wired to `public/homepage/menu-cover.webp` and `public/homepage/menu-dish.webp`.
- VERIFIED: Quality #2103 passed all configured quality/browser stages.
- VERIFIED: W9 Orders QA #361 passed.
- UNKNOWN: final owner artwork files are not yet present.
- UNKNOWN: production deployment of this merged commit has not been performed/verified by this task.

## Historical Next Task

**Owner image placement + one controlled release verification for `df2569e92e25380c6fc4957eba8b2d96353bd1f9`.**

Do not begin another homepage redesign or commercial packaging redesign before this release verification is complete.


## 2026-09-19 — Homepage Realistic Visuals — CLOSED / VERIFIED

- VERIFIED: PR #213 `feat: add realistic homepage menu and analytics visuals` merged into `main`.
- VERIFIED: merge commit: `ccf25a80f9f3f6000cebed8c2b3d8162edfd3f24`.
- VERIFIED: expected homepage assets are present in the merged PR diff, including `public/homepage/menu-cover.webp`, `public/homepage/menu-dish.webp`, and `public/homepage-analytics-real.png`, plus the new theme preview assets.
- VERIFIED: `src/routes/index.tsx` and `src/routes/index.css` were the application source files changed by the homepage visual implementation.
- VERIFIED: PR head had successful Vercel status before merge; no unresolved review threads were reported.
- UNKNOWN: physical Android/iOS visual verification after merge.
- UNKNOWN: direct current Production deployment identity.
- Implementation status: `DONE`.
- Deployment status: `UNKNOWN` / no production deployment performed by this task.

## Historical Next Task

**Release-stage verification of `main` after PR #213, then physical Android/iOS/QR/theme/order/RTL smoke QA.**

Do not start another homepage redesign or replace these visuals again unless verification identifies a concrete defect.


## 2026-09-20 — Public Menu Reliability / Brand Social / Image Contract — VERIFIED / READY TO MERGE

### Scope
- Double Espresso theme-preview image reliability.
- Public customer QR/menu loading path efficiency.
- Studio Website + Instagram + Snapchat + Facebook + TikTok registration.
- Permanent image payload-size contract for logo/cover/product uploads.
- Recognizable social brand marks and theme-compatible action presentation.
- Explicit Studio discoverability for branch-scoped map management.

### Branch
`fix/public-menu-social-images-performance-2026-09-20`

### Verification
- VERIFIED: final head `b3bbf92c3fbaef52511162f2b340ea179878603d`.
- VERIFIED: Quality `35477401543` passed typecheck, 319/319 tests, W7.4–W7.10 contracts, lint, production build, all-theme browser QA, Studio browser QA, Platform Admin/W7.10 browser QA, and performance/cleanup stages.
- VERIFIED: W9 Orders QA `35477401542` passed.
- VERIFIED: Vercel status is success.
- VERIFIED: no PR reviews or unresolved review threads.
- VERIFIED: map URL capability exists at `/studio/branches`; `/studio/brand` now links directly to it without duplicating branch data.
- UNKNOWN: Production deployment identity and physical-device QA.

### Historical Next Task
Merge PR #217 once, verify the resulting `main` SHA, then perform release-stage Production and physical Android/iOS/QR/theme/order/RTL smoke QA.

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
- VERIFIED: branch `redesign/editorial-atelier-premium-2026-09-20` created from current main.
- VERIFIED: AppDeploy prototype is ready with no frontend/backend errors.
- IMPLEMENTED: Atelier is the new single-owner Editorial presentation direction.
- BLOCKED: repository CI/browser and real-device evidence remain outstanding.

### Historical Next Task
**Run GitHub Quality/browser checks, review the final diff, then test Atelier Editorial on a real Android viewport using the owner's failing cases.**



## 2026-09-20 — Editorial Atelier Replacement — CLOSED / VERIFIED / MERGED

- VERIFIED: PR #221 `redesign: replace Editorial with Atelier premium system` was merged into `main`.
- VERIFIED: merge commit / current `main` HEAD at implementation closeout: `bff4a03be234f3d011f35c935cc0ee57746b5a2d`.
- VERIFIED: the prior Editorial presentation stack was replaced by the scoped `src/theme-editorial-atelier.css` owner while ThemeKey `editorial` and the existing `contemporary-restaurant` renderer were preserved.
- VERIFIED: legacy Editorial presentation files `src/theme-editorial.css` and `src/theme-editorial-hardening.css` were removed; Editorial selectors were removed from shared legacy layers.
- VERIFIED: Quality run `35490043010` succeeded on retry attempt 2, including typecheck, tests, lint, production build, all-theme browser QA, Studio browser QA, Platform Admin browser QA, and performance/diagnostic stages.
- VERIFIED: W9 Orders QA run `35489610007` succeeded on the Atelier implementation head before merge.
- VERIFIED: PR #221 had no unresolved review threads.
- VERIFIED: GitHub combined status for the implementation merge commit is successful; Vercel reports success for `bff4a03be234f3d011f35c935cc0ee57746b5a2d`.- UNKNOWN: whether that successful Vercel deployment is the current Production deployment identity versus a non-production deployment; no direct Production identity was established here.
- UNKNOWN / EXTERNAL: physical Android/iOS QA of the merged Atelier public menu, including QR scanning and real-device typography, remains unverified.
- Note: the first Quality attempt failed in an unrelated Studio responsive Playwright run with an execution-context-destroyed navigation race; the failed job was rerun without code changes and passed completely.

### Historical Next Task
**Physical Android QA of merged Atelier Editorial — repeat the owner's failing Arabic/English mobile cases and verify QR/public-menu rendering, RTL/LTR, title/price geometry, fixed actions, search/categories, cart/order, and configured external actions.**


## 2026-09-20 — Editorial Canvas replacement — IN PROGRESS

- VERIFIED: owner authorized a complete Editorial presentation replacement using the supplied Canva/HTML direction.
- VERIFIED: implementation is isolated to the Editorial renderer/theme/semantic adapter and regression contracts; shared order/cart/data architecture remains unchanged.
- VERIFIED: branch `redesign/editorial-canvas-menu-2026-09-20` created from main `65dd5944f64203b74c80924098adf68fa15ccbce`.
- VERIFIED: the prior Atelier stylesheet has been replaced and renamed to `src/theme-editorial-canvas.css`.
- UNKNOWN: GitHub Quality and browser QA for this branch until CI executes.
- UNKNOWN: physical Android/iOS rendering; not part of this implementation verification.
- Deployment: NOT REQUESTED / NOT PERFORMED.

### Exact Next
Complete CI/browser verification for the Editorial Canvas branch, review the final diff, then merge only if all required quality gates pass.


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
- VERIFIED: Quality #2203 passed; W9 #443 passed.
- VERIFIED: mobile language control is visible in the SIGNAL TABLE browser QA matrix.
- IMPLEMENTED: removed obsolete featured-selection chrome and preserved product-card/cart/search/category/order contracts.
- UNKNOWN: physical Android/iOS evidence and final Production deployment identity.

### Historical Next Task
**Merge PR #230 once, verify the resulting `main` SHA, then execute the single authorized Production deployment and record the direct Production identity.**


## 2026-09-21 — Focused Public UX / WhatsApp / Footer Pass
- VERIFIED: current task scope is recorded in docs/sessions/2026-09-21-focused-public-ux-whatsapp-footer.md.
- IMPLEMENTED: homepage demo data/media bilingual correction, Essential/Noir Featured geometry hardening, structured WhatsApp cart-order messaging/click tracking, and shared marketing/account footer.
- BLOCKED: plan-specific WhatsApp entitlement gating is deferred because the current public-menu contract does not expose a server-authoritative WhatsApp feature entitlement; no unsafe client-side gate was introduced.
- UNKNOWN: local quality commands and physical-device visual QA; GitHub PR CI/browser verification remains required.

### Historical Next Task
Run the repository Quality/test/typecheck/lint/build and browser visual verification for this branch at 320/375/430px Arabic RTL and English LTR, review the final diff, resolve only task-scoped failures, then stop.


## 2026-09-21 — Focused Public UX Follow-up — IMPLEMENTATION_IN_PROGRESS
- Scope: restore explicit Featured title/price hierarchy in Essential/Noir, remove the duplicate signup brand-name field, and expose truthful WhatsApp ordering copy in every commercial plan.
- Protected: existing WhatsApp structured-order runtime, theme registry, tenant/branch isolation, server-side pricing/order validation, and onboarding workspace provisioning.
- No migration or entitlement change.

### Historical Next Task
Review PR #232 checks and final diff; merge once after all gates pass, then use the single release batch for Production and real-device QA.

## Final verification — 2026-09-21
- VERIFIED: PR #232 final verified head is `6047080fcfa3e289d89538b6f28d520bbdfc7328`.
- VERIFIED: GitHub Quality #2216 passed and GitHub W9 Orders QA #454 passed.
- VERIFIED: Vercel PR status is SUCCESS preview evidence only; no Production deployment was triggered.
- BLOCKED: server-authoritative plan-specific WhatsApp entitlement remains intentionally deferred.
- UNKNOWN: physical Android/iOS QA remains release-stage evidence.

### Historical Next Task
Merge PR #232 once, verify resulting `main` SHA, then execute the single authorized Production deployment and record direct Production identity before real-device QA.


## 2026-09-22 — RLS Security Remediation — CLOSED / VERIFIED

- VERIFIED: PR #235 merged to `main` at `33bd3ea43bee5112de0d3b8d513cd1aea3a86e92`.
- VERIFIED: live migration `20260922080000_harden_server_only_rls_tables.sql` applied.
- VERIFIED: all seven audited tables are RLS-enabled, client roles have no table access, and server-side reads remain functional.
- VERIFIED: Quality #2224 and W9 #460 passed.
- VERIFIED: Issue #233 closed as completed.
- UNKNOWN: direct Production identity and physical-device QA.


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

- VERIFIED: investigation and durable plan are recorded in `docs/performance/2026-09-22-public-menu-image-performance-remediation.md`.
- VERIFIED: PR #239 contains Phase 1 implementation.
- IMPLEMENTED: known Unsplash URLs are normalized; public product media remains lazy; Studio product thumbnails are lazy/async/dimensioned; Editorial all-product prefetch is removed.
- UNKNOWN: GitHub Quality #2232 and W9 #464 final conclusions.
- UNKNOWN: real-device network waterfall and LCP.

### Exact Next Task
**Review PR #239 Quality/W9 to completion, fix only task-scoped failures, then run final diff/performance review for Phase 1.**


### Verification Update — Phase 1 CI attempt
- VERIFIED: GitHub Quality run #2232 and W9 Orders QA #464 reached the new Phase 1 code and failed before full verification because `src/lib/menu/image.ts` contained an accidental literal \\n marker at line 62.
- VERIFIED: the failure was isolated from application logic and corrected in commit `8347a3204f501f6a08a085616a3e2cea10e00882`.
- UNKNOWN: CI rerun for the corrected head has not yet completed/appeared through the connected GitHub workflow surface.
- Exact Next Task: **Obtain the corrected-head CI result; if green, perform final diff review and Phase 1 performance verification; if red, fix only the reported Phase 1 issue.**


## 2026-09-22 — Final Phase 1 Continuity Update

**Public Menu Image Performance Phase 1 is VERIFIED COMPLETE. PR #239 merged as `c33d3b308b76776ec69c65abec7221f534850317`. Quality #2242 and W9 #474 passed. Exact next task: Phase 2 — Public Image Geometry and Responsive Delivery. Production deployment is NOT claimed.**


## 2026-09-22 — Public Menu Image Performance Phase 2 — VERIFIED COMPLETE

- VERIFIED: PR #241 merged once by squash as `9c262f43970384ba71faab67f88d74fd62672bc3`.
- VERIFIED: `main` is now `9c262f43970384ba71faab67f88d74fd62672bc3`.
- VERIFIED: Quality #2256 and W9 Orders QA #486 passed for the final PR head; Vercel PR preview status is SUCCESS.
- UNKNOWN: real-device/public-menu waterfall and LCP evidence for the 30-item customer test menu.
- Deployment status: NOT_PERFORMED.

### Exact Next Task
**Run the dedicated real-device/public-menu performance evidence pass for the 30-item Saudi shopping world test menu at 320/375/390/430px.**


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


## 2026-09-24 — AI Provider Expansion / Phase 1

**Status: IN_PROGRESS**

Goal: establish the shared capability vocabulary and provider registry before adding credentials or runtime adapters.

Completed in this phase:
- Added `src/lib/menu/ai-capabilities.ts`.
- Added `src/lib/menu/ai-provider-registry.ts`.
- Centralized the existing `AiCapability` type in the shared capability module.
- Added regression contracts proving planned providers remain outside runtime routing.
- Added the complete AI provider expansion continuity document at `docs/ai-provider-expansion.md`.
- Preserved the existing runtime provider order and multimodal behavior.

Protected / MUST NOT redo:
- Existing AI provider routing.
- Smart Menu Import OCR → Smart Extract → normalization → batching → AI organization flow.
- Existing Mercury/Gemini/Z.AI/OpenRouter/xKiro adapters.

Verification state:
- Static GitHub source review: completed.
- Official provider research: completed.
- Local commands: BLOCKED because this connected GitHub session has repository read/write access but no local checkout/runtime.
- CI: pending final PR/quality run.

Exact next task after closure:
**Phase 2 — fail-closed credential validation/key pools for TypeSafe (3), NVIDIA (2), Groq (1), Cloudflare (token + Account ID), Cerebras, Mistral, and Deepgram.**


## 2026-09-24 — AI Provider Expansion / Phase 1 CLOSED

- VERIFIED: capability vocabulary and provider registry implemented on `feat/ai-provider-expansion-foundation`.
- VERIFIED: planned providers are explicitly `runtimeEligible: false`.
- VERIFIED: complete architecture/roadmap documented in `docs/ai-provider-expansion.md`.
- VERIFIED: GitHub Quality #2337 passed.
- VERIFIED: GitHub W9 Orders QA #545 passed.
- VERIFIED: PR #270 is open and not merged.
- VERIFIED: no secrets, migrations, runtime activation, or production deployment were performed.
- UNKNOWN: provider credential validity because no secret values were supplied or tested.
- Protected / MUST NOT redo: existing AI provider routing and Smart Menu Import flow.

Exact next task:
**Phase 2 — fail-closed credential validation/key pools for TypeSafe/Jev (3), NVIDIA (2), Groq (1), Cloudflare (token + Account ID), Cerebras, Mistral, and Deepgram; no runtime activation.**

## 2026-09-24 — AI Provider Expansion / Phase 2 IN PROGRESS

- Credential contract implemented as server-only module.
- Key-pool inventory locked to owner-provided counts.
- Cloudflare token + Account ID dependency documented.
- Runtime provider activation explicitly remains disabled.
- Live credential validity is UNKNOWN because secret values are not available to this connected GitHub session.

Verification:
- Static contract tests added.
- GitHub Quality/W9 pending for the final Phase-2 head.

Exact next task:
**Close Phase 2 after final Quality/W9 verification; then Phase 3 adapters.**


## 2026-09-24 — AI Provider Expansion / Phase 2 CLOSED

- VERIFIED: server-only credential contract implemented.
- VERIFIED: owner-provided key-pool inventory locked.
- VERIFIED: Cloudflare token + Account ID dependency locked.
- VERIFIED: fail-closed credential state implemented.
- VERIFIED: Quality #2345 passed.
- VERIFIED: W9 Orders QA #553 passed.
- VERIFIED: no secrets committed.
- VERIFIED: no runtime provider activation.
- VERIFIED: no deployment.

Protected / MUST NOT REDO:
- Phase 1 capability vocabulary.
- Provider registry.
- Existing Mercury/Gemini/Z.AI/OpenRouter/xKiro runtime routing.
- Smart Menu Import OCR → Smart Extract → normalization → batching → AI organization → review → save.

UNKNOWN:
- Live credential validity until environment secrets are supplied.

Exact next task:
**Phase 3 — Groq execution adapter and targeted verification.**



## 2026-09-24 — AI Provider Expansion / Phase 3 Groq Adapter — IN PROGRESS

- VERIFIED: Phase 1 capability/provider registry is closed.
- VERIFIED: Phase 2 credential contract is closed.
- IMPLEMENTED: dedicated Groq structured adapter `src/lib/menu/ai-groq.ts`.
- IMPLEMENTED: Groq integration into the existing structured provider boundary.
- IMPLEMENTED: `GROQ_API_KEY` credential usage and configurable `GROQ_MODEL`.
- IMPLEMENTED: production default model `openai/gpt-oss-20b`.
- IMPLEMENTED: timeout/error normalization and prompt-injection boundary.
- VERIFIED: Groq remains outside multimodal routing; vision is not activated by this task.
- VERIFIED: Quality #2353 passed.
- VERIFIED: W9 Orders QA #561 passed.
- VERIFIED: Vercel Preview is READY.
- UNKNOWN: live Groq smoke and live credential/provider behavior.

### Protected / MUST NOT REDO
- Existing AI provider routing architecture.
- Phase 1 capability registry.
- Phase 2 credential contracts/key pools.
- Smart Menu Import OCR → Smart Extract → normalization → batching → AI organization → review → save.
- Existing public-menu, theme, performance, auth, RLS, subscription, tenant/branch boundaries.

### EXACT NEXT TASK
**Execute one authenticated Groq smoke request against the current Vercel Preview using the configured `GROQ_API_KEY`; verify structured output and normalized failure behavior, then review the final diff. Do not merge PR #270 or start NVIDIA before Groq smoke evidence is recorded.**


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


## 2026-09-24 — AI Provider Expansion / Cerebras CLOSED

- VERIFIED: PR #275 merged at `ba9da375398998a444e5a89bdad249cc8ab6c86d`.
- VERIFIED: Quality #2373 and W9 Orders QA #578 passed.
- UNKNOWN: authenticated Cerebras live smoke remains pending due to inaccessible secret values in the connected GitHub session.
- MUST NOT REDO: Phase 1 registry, Phase 2 credentials, Groq, NVIDIA, Cloudflare, Cerebras, Smart Menu Import, and public-menu/performance phases 0–8.

### Exact Next Task
**Implement and verify the Mistral document/OCR specialist adapter.**


## 2026-09-24 — AI Provider Expansion / Mistral CLOSED

- VERIFIED: PR #277 merged at `9d57186788fd9b91669bb52e201bb492551eb9fc`.
- VERIFIED: Quality #2378 and W9 Orders QA #581 passed.
- UNKNOWN: authenticated Mistral live document smoke remains pending because secret values are inaccessible through the connected GitHub session.
- MUST NOT REDO: Groq, NVIDIA, Cloudflare, Cerebras, Phase 1 registry, Phase 2 credentials, Mistral, Smart Menu Import, and public-menu/performance phases 0–8.

### Exact Next Task
**Implement and verify the Deepgram isolated STT/audio specialist adapter.**
\n\n## 2026-09-24 — AI Provider Expansion / Phase 3 Deepgram — CLOSED / VERIFIED

- VERIFIED: PR #279 merged by squash as `e5ca7dbe854f6788875a6ee5233214c5a1cc6b53`.
- VERIFIED: Deepgram isolated pre-recorded STT adapter is active only for `audio_stt`.
- VERIFIED: Quality #2387 passed.
- VERIFIED: W9 Orders QA #588 passed.
- VERIFIED: final PR Vercel Preview status succeeded.
- UNKNOWN: authenticated Deepgram live smoke.
- UNKNOWN: direct Production deployment identity/status for merged main.
- MUST NOT REDO: Groq, NVIDIA, Cloudflare, Cerebras, Mistral, Phase 1/2, Smart Menu Import, public-menu/performance phases 0–8, auth/RLS/subscription/tenant/branch boundaries.

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
\n\n## 2026-09-24 — AI Provider Expansion / Phase 5 TypeSafe/Jev — IMPLEMENTED / CI PENDING\n\n- IMPLEMENTED: `src/lib/menu/ai-typesafe.ts` dedicated System One / Jev decision adapter.\n- IMPLEMENTED: `TYPESAFE_API_KEY`, `TYPESAFE_API_KEY_2`, `TYPESAFE_API_KEY_3` rotation without secret logging.\n- IMPLEMENTED: Noul/Choice/Score validation, candidate membership guard, bounded state/questions/candidates, and 60-second timeout.\n- VERIFIED: no generic routing activation; registry remains `runtimeEligible:false`.\n- UNKNOWN: authenticated live TypeSafe smoke.\n- MUST NOT REDO: completed provider adapters and all protected product/security/data boundaries.\n\n### EXACT NEXT TASK\n**Run the TypeSafe/Jev CI gates and one authenticated smoke if the configured credential is available; otherwise record the real credential blocker. Do not activate TypeSafe before the smoke is verified.**\n

## 2026-09-24 — AI Provider Expansion / Phase 6 — CAPABILITY-AWARE ROUTING

- IMPLEMENTED: `src/lib/menu/ai-capability-router.ts`.
- VERIFIED: capability filtering, candidate membership validation, provider/model revalidation, and fail-closed policy admission are present.
- VERIFIED: TypeSafe remains disabled in the registry and generic provider routing remains unchanged.
- UNKNOWN: branch CI/W9 final results until the connected GitHub workflow reports them.

### EXACT NEXT TASK
**Review Phase 6 GitHub Quality/W9 results; fix only task-scoped failures, then merge once if all gates pass.**

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


# 2026-09-24 — TypeSafe/Jev Smoke Blocker

- CLOSED: PR #291 continuity documentation.
- VERIFIED: main `850c9baa8aac0aa80123ab5d83742db577a5477e`.
- VERIFIED: Vercel status for the merged continuity commit is `success`.
- VERIFIED: exactly one TypeSafe/Jev smoke attempt was made: GitHub Actions run `36033142672`.
- BLOCKED: `TYPESAFE_API_KEY` was not present in the GitHub Actions runtime, so no TypeSafe HTTP request occurred.
- CLOSED WITHOUT MERGE: temporary smoke PR #292.
- PROTECTED: do not repeat the smoke, modify provider adapters, or create another temporary smoke workflow until an authorized credentialed runtime is available.

## EXACT NEXT TASK

**Securely expose the configured TypeSafe credential to one authorized smoke runtime, then run exactly one authenticated TypeSafe/Jev smoke and record the real evidence.**
\n\n# 2026-09-24 — Post-Merge Continuity Anchor\n\n- VERIFIED: canonical `main` HEAD is now `4e47f783e3a189b760daf71fff92cd81b2881501`.\n- VERIFIED: this commit contains the continuity record for the single blocked TypeSafe/Jev smoke attempt.\n- VERIFIED: the smoke was not repeated after the credential blocker was observed.\n- BLOCKED: the next TypeSafe/Jev smoke requires an authorized runtime with the configured credential.\n\n## EXACT NEXT TASK\n\n**Securely make the configured TypeSafe credential available to the authorized smoke runtime, then run exactly one authenticated TypeSafe/Jev smoke and record the real HTTP/decision evidence. Do not repeat the smoke before that prerequisite is verified.**\n

# 2026-09-25 — Platform-Admin Invoice Ownership Correction — IMPLEMENTED / VERIFIED / PR #297

- VERIFIED: Current main at task start was `ea8f4582f60953e7a8029d5f6905e18454e85114`.
- VERIFIED: Before this task, tenant `/studio/billing` contained the `issueSubscriptionInvoice` server function and an Issue Invoice button; there was no Platform Admin invoice-issuance UI.
- VERIFIED: PR #297 moves issuance to the Platform Admin `/admin/users` subscription screen and removes tenant-side issuance.
- VERIFIED: Invoice creation is server-authorized by `requirePlatformAdmin`, records `created_by_user_id`, and tenant history filters to invoices whose creator is a Platform Admin.- VERIFIED: `subscription_invoices` is reused. Migration `20260925130000_platform_admin_invoice_issuance.sql` adds only `notes` and a cache-1 sequential invoice-number sequence.
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

## 2026-09-25 — Guest Assistant Cost-Abuse Hardening — PR #304

- VERIFIED: Removed the client-controlled Guest Assistant `sessionId` from the request contract.
- VERIFIED: Bound Guest Assistant minute limiting to the existing server-issued anonymous session.
- VERIFIED: Added trusted Vercel requester-IP rate limiting with hashed IP storage.
- VERIFIED: Added configurable tenant-wide daily Guest Assistant circuit breaker, default 500/day.
- VERIFIED: Admission checks occur before provider execution; existing grounded fallback handles denial.
- VERIFIED: No AI provider was added, removed, paused, reordered, or modified.
- IN_PROGRESS: GitHub Quality/W9 verification is running on PR #304 head `40ac0534c184907b000df9009e67c0121d24e0c9`.
- DEPLOYMENT: NOT DEPLOYED; merge/deployment held for owner review.

### EXACT NEXT TASK
**Review PR #304 CI results; if all applicable gates pass, owner reviews and authorizes merge. Do not merge or deploy automatically.**


## 2026-09-26 — Guest Assistant Cost-Abuse Hardening

- VERIFIED: PR #304 merged by squash.
- VERIFIED: `main` HEAD = `abb124101531242a6cabf070db1864dcda4aa9c1`.
- VERIFIED: GitHub Quality `36200820867` = SUCCESS, including typecheck, tests, lint, production build, Browser QA and remaining quality gates.
- VERIFIED: W9 Orders QA `36200820957` = SUCCESS.
- VERIFIED: No AI provider was added, removed, paused, reordered, or modified.
- BLOCKED: Vercel production deployment API rejected deployment because `api-deployments-free-per-day` reached its 100/day limit with 0 remaining.
- VERIFIED: Current production is still the prior main deployment on `b552a7d6a0c8b369a6b6b54774a0fd9b26461aa1`; Production != current main HEAD.
- IMPLEMENTATION STATUS: MERGED.
- DEPLOYMENT STATUS: DEPLOYMENT_BLOCKED.

### EXACT NEXT TASK
Deploy `main` SHA `abb124101531242a6cabf070db1864dcda4aa9c1` once Vercel deployment quota resets; verify READY, production target, exact commit SHA, and Production == main HEAD.


## 2026-09-26 — Guest Assistant Cost-Abuse Hardening — MERGED + DEPLOYED

- VERIFIED: PR #304 merged by squash at application commit `abb124101531242a6cabf070db1864dcda4aa9c1`.
- VERIFIED: Continuity PR #305 merged; current main HEAD `58019aff93a552c07717bb45abe2eca46d609a73`.
- VERIFIED: GitHub Quality `36200820867` = SUCCESS.
- VERIFIED: W9 Orders QA `36200820957` = SUCCESS.
- VERIFIED: Vercel production deployment `dpl_FhF8sWoimr7s5UdTUEGq5ZGVwqmK` = READY, target production, exact commit `58019aff93a552c07717bb45abe2eca46d609a73`.
- VERIFIED: Production == main HEAD.
- VERIFIED: No AI provider was added, removed, paused, reordered, or modified.
- IMPLEMENTATION STATUS: MERGED.
- DEPLOYMENT STATUS: DEPLOYED.

### EXACT NEXT TASK
None for this atomic task. Stop.


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

- IMPLEMENTED: New tenants provision as `pro / trialing / +14 days`.
- IMPLEMENTED: Untouched expired trials lazily revert to `free / active / trial_ends_at = NULL`.
- IMPLEMENTED: Platform Admin trial actions continue to win over automatic reversion.
- IMPLEMENTED: Studio trial-days and post-reversion banners; no standalone billing contact CTA added.
- IMPLEMENTED: Regression coverage added.
- PR #309 OPEN — merge/deployment held for owner review.

## EXACT NEXT TASK
Owner review PR #309 after GitHub Quality/W9 are green. Do not merge/deploy automatically.


# 2026-09-27 — PR #309 Verification

- VERIFIED: Quality #2515 = SUCCESS.
- VERIFIED: W9 Orders QA #690 = SUCCESS.
- PR #309 OPEN; merge/deployment held for owner review.


# 2026-09-27 — Self-Serve Pro Trial — MERGED + DEPLOYED

- VERIFIED: PR #309 merged by squash at application commit `36d0accbff092df7d179bc54e0c2e383cd4ff4d4`.
- VERIFIED: Quality #2518 = SUCCESS.
- VERIFIED: W9 Orders QA #693 = SUCCESS.
- VERIFIED: Vercel production deployment `dpl_71bSNP27oFvtYCDTNNRV7dC7pRFn` = READY, target production, exact commit `36d0accbff092df7d179bc54e0c2e383cd4ff4d4`.
- STATUS: MERGED + DEPLOYED.
- Continuity-only follow-up required to make Production == final main HEAD after this documentation update.


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


# 2026-09-29 — Menuun Auth Email Flow — ACTIVE

- VERIFIED: Resend `mail.menuun.com` is fully verified and the owner created a restricted Sending access API key.
- IMPLEMENTED: server-side Resend email service without adding a new dependency; Better Auth verification and password recovery callbacks; bilingual verification/recovery UI; guarded account deletion path.
- IMPLEMENTED: signup no longer proceeds directly to onboarding before email verification; existing registration phone persistence is resumed after verified login.
- VERIFIED: repository diff is scoped to auth email flow files plus its regression contract.
- UNKNOWN: local command execution in the connector-only environment.
- UNKNOWN: GitHub CI result for this branch until checks complete.
- UNKNOWN: Vercel Preview environment has not yet been independently verified with `RESEND_API_KEY`.
- DEPLOYMENT STATUS: NOT DEPLOYED.

## EXACT NEXT TASK

Verify the auth-email PR through GitHub CI. If green, configure the restricted Resend key in Vercel Preview and run safe end-to-end email/auth browser verification with a dedicated test account.

## 2026-09-30 — Combined Batch — READY FOR OWNER REVIEW
- VERIFIED: public category/product ordering, item-internal ordering, and offers are implemented together in PR #327.
- VERIFIED: final GitHub CI passed: Quality 2617; W9 Orders QA 775.
- UNKNOWN: physical-device QA remains pending.
- NEXT TASK: owner review PR #327; after approval, perform the single release/deployment batch.

## 2026-09-30 — Public Offers Visibility Follow-up — READY FOR REVIEW
- VERIFIED: the existing public data path already loaded active product offers, but the public product-card and product-detail rendering did not consume that data; this was the direct visibility gap.
- FIXED: active offers now render in featured cards, category product cards, and product details with bilingual labels and old/new pricing; BOGO uses a bilingual fallback label.
- FIXED: quick-add now seeds the displayed active offer price for simple products; checkout remains server-authoritative.
- ADDED: regression contract verifies the public renderer consumes productOffers and exposes the offer UI contract.
- UNKNOWN: physical-device QA remains pending.
- HOLD: PR #327 remains open; merge/deployment waits for owner review and the single release batch.

## EXACT NEXT TASK
Owner reviews PR #327. Do not merge or deploy automatically.
## 2026-09-30 — PR #327 Public Offers Verification — VERIFIED / RELEASE HOLD
- VERIFIED: Quality 2634 and W9 Orders QA 792 passed on head `e620bb43f347bde538575d4c0dac13583f15e4b3`.
- VERIFIED: Vercel preview commit `52a7bb70e14ac99a77a2c0befcd4a3efdd52f809` served the published `mndy-alwtnya` menu and SSR payload contained both active offers, including BOGO bilingual labels.
- VERIFIED: Supabase data confirms two active offers for available/featured products in the published tenant.
- FIXED: public renderer contract test and RLS migration.
- UNKNOWN: physical-device QA.
- BLOCKED: Vercel deployment requests are rate-limited; Production is not deployed from PR #327.
- EXACT NEXT TASK: merge PR #327, then execute the single controlled production release once the Vercel deployment gate is available.


## 2026-10-01 — Safe Order Lifecycle Enforcement — PR #333 / VERIFICATION PENDING

- VERIFIED: server-side lifecycle enforcement implemented on `feat/safe-order-lifecycle-enforcement`.
- VERIFIED: existing legal transitions, same-status behavior, authorization, audit semantics, and DB trigger were preserved.
- VERIFIED: concurrency-safe status mutation and audit insertion were added without a migration.
- VERIFIED: focused lifecycle contract tests were added and included in `npm test`.
- IN_PROGRESS: GitHub Quality/W9 verification is still running; final latest-head results are not yet verified.
- DEPLOYMENT: NOT DEPLOYED / no Production deployment performed.

### EXACT NEXT TASK
Owner reviews PR #333 after CI completes. Do not merge or deploy automatically.


## 2026-10-01 — Orders Status Presentation

- IN_PROGRESS: PR for focused Orders status presentation is being prepared on `feat/orders-status-presentation`.
- VERIFIED: main baseline is `fc143c525190cfc60241113bb885a22e4836bb70`.
- Implemented: shared status presentation mapping for `new`, `confirmed`, `preparing`, `ready`, `completed`, and `cancelled`; bilingual labels; status-specific token tones; Lucide icons; shared badge usage in Studio Orders and Studio Home recent activity.
- Tests added: `src/lib/menu/order-status-presentation.test.ts`.
- NOT CHANGED: lifecycle enforcement, database schema/migrations/triggers, auth/authz, tenant/branch isolation, polling/notifications, sound, WhatsApp, payments, public ordering, production settings.
- PENDING: GitHub CI and browser/visual QA evidence.
- NEXT TASK: review PR CI and visual evidence, then wait for explicit merge authorization.


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


# 2026-10-02 — Order Value Analytics UI — PR #343 — VERIFIED / RELEASE HOLD

- VERIFIED: PR #343 is open against `main` from `feat/order-value-analytics-ui`.
- VERIFIED: final implementation head before continuity-only documentation is `0445ac2f8875b736966733f6c76c3bca3b3a74f1`.
- VERIFIED: Quality `2705` = SUCCESS.
- VERIFIED: W9 Orders QA `848` = SUCCESS.
- VERIFIED: scope is limited to Studio Order Value Analytics UI, bilingual copy, focused UI contract coverage, and test registration.
- UNKNOWN: Production deployment is intentionally not part of this task.
- EXACT NEXT TASK: owner reviews PR #343 and authorizes merge. Do not merge or deploy automatically.

# 2026-10-02 — Order Value Analytics UI — MERGED / VERIFIED

- VERIFIED: PR #343 was squash-merged into `main` at `1e732522c7ab9509acfa007cfb7c26bebc874a84`.
- VERIFIED: Quality #2706 = SUCCESS.
- VERIFIED: W9 Orders QA #849 = SUCCESS.
- VERIFIED: the approved Order Value Analytics UI scope is now on `main`; no Production deployment was performed.
- IMPLEMENTATION STATUS: MERGED / VERIFIED.
- DEPLOYMENT STATUS: NOT DEPLOYED.

## EXACT NEXT TASK

Wait for the next explicitly scoped task. Do not deploy or start unrelated work automatically.

# 2026-10-02 — P0.1 Atomic Public Order Creation — IMPLEMENTED / CI VERIFIED / PR OPEN

- VERIFIED: PR #348 fix(order): make public order creation atomic is open against main.
- VERIFIED: current head is 29328dc4422c67dbdc0cd7dbd613a68de5aebf7c.
- VERIFIED: database transaction support is implemented for PostgreSQL and PGlite.
- VERIFIED: public-order idempotency reservation and finalization now occur in the same transaction as order/order_items/order_status_events creation.
- VERIFIED: TDD RED was demonstrated by Quality #2717 before the implementation; the transaction contract then passes in the current Quality run.
- VERIFIED: Quality #2726 passed typecheck, full npm test, contract tests, lint, and production build.
- VERIFIED: W9 Orders browser QA #865 attempt 1 passes the Orders browser flow.
- UNKNOWN/BLOCKED: Studio browser QA in Quality #2726 failed on existing workspace/onboarding expectations; main Quality #2716 had passed the same suite immediately before this branch.
- DEPLOYMENT STATUS: NOT_PERFORMED.
- IMPLEMENTATION STATUS: PUSHED / FULL CI VERIFIED / PR OPEN.

## EXACT NEXT TASK

Owner reviews PR #348 and authorizes merge/release if accepted. Do not merge, deploy, or start P0.2 automatically.

# 2026-10-02 — P1.2 Closeout — VERIFIED / PR #352

- VERIFIED: P1.2 Theme Code Splitting is complete and merged at `66d46d0512f9d50120f053e4826dcfc3ca62278b`.
- VERIFIED: Quality #2769 = SUCCESS.
- VERIFIED: W9 Orders QA #904 = SUCCESS.
- VERIFIED: Vercel Preview = Ready / SUCCESS.
- VERIFIED: final implementation uses the canonical lazy theme loader and preserves the five-theme registry and public-menu contracts.
- UNKNOWN: real-device and Production performance measurements.
- DEPLOYMENT STATUS: NOT_DEPLOYED.

## EXACT NEXT TASK

**P1.3 — Public Menu Runtime Performance / Observability**

Repository-first investigation and measurement baseline only before implementation. Keep the task atomic and preserve P0.1/P0.2/P1.1/P1.2 protections.


# 2026-10-02 — P1.2 Continuity Closeout — VERIFIED

- VERIFIED: P1.2 Theme Code Splitting is complete and merged as `66d46d0512f9d50120f053e4826dcfc3ca62278b`.
- VERIFIED: Quality #2769 = SUCCESS.
- VERIFIED: W9 Orders QA #904 = SUCCESS.
- UNKNOWN: direct physical-device and Production performance measurements.
- DEPLOYMENT STATUS: NOT_DEPLOYED.

## EXACT NEXT TASK

**P1.3 — Public Menu Runtime Performance / Observability**

Repository-first baseline and evidence before implementation; preserve all completed milestones.

# 2026-10-02 — P1.3 Runtime Performance / Observability — MERGED / VERIFIED

- VERIFIED: PR #354 merged into `main` as `67f05fff4f7f6c07e87b56df1a9a676f2aee896d`.
- VERIFIED: changed runtime/test scope was limited to `src/lib/menu/public.ts`, `tests/public-menu-cache-session.test.mjs`, and `package.json` test registration.
- VERIFIED: fresh tenant/branch cache hits avoid the revision lookup while preserving the existing 15-second TTL and revision-keyed miss path.
- VERIFIED: Quality #2785 = SUCCESS; W9 Orders QA #918 = SUCCESS.
- VERIFIED: no Production deployment.
- UNKNOWN: Production/physical-device performance evidence.
- BLOCKED: Vercel Preview deployment remains blocked by the platform deployment quota.
- IMPLEMENTATION STATUS: MERGED / VERIFIED.
- DEPLOYMENT STATUS: NOT_DEPLOYED.

## EXACT NEXT TASK

**P1.4 — Leaked Password Protection**

No P1.4 implementation has started. Do not deploy or perform unrelated work automatically.

# 2026-10-02 — P1.4 Deferred / Severity Matrix Reprioritized

- VERIFIED: P1.4 leaked-password protection is not currently actionable under the owner's present Supabase subscription and is not required for the current product scope.
- DECISION: remove P1.4 from the active task queue and mark it **DEFERRED / OUT OF CURRENT SCOPE**.
- PROTECTED: retain the historical audit/security finding so future plan upgrades can reactivate it without losing evidence.
- VERIFIED: the major P0 security/reliability findings were already resolved through P0.1 and P0.2.
- VERIFIED: the current P1.1/P1.2/P1.3 performance/cache/theme work is complete.
- NEXT PRIORITY: **Audit Follow-up — Supabase Migration Three-Way Reconciliation**.
- ACCEPTANCE: repository migration inventory, Supabase migration history, and live schema/functions/triggers/RLS are compared; every discrepancy is classified; no migration is blindly replayed; no production schema change occurs unless separately authorized.

## EXACT NEXT TASK

**Audit Follow-up — Supabase Migration Three-Way Reconciliation**

Do not begin automatically. 


# 2026-10-02 — Migration Reconciliation Closeout — VERIFIED

- VERIFIED: PR #356 merged at `3291243387874c6543dc3e6d9a3250550ddf9ba1`.
- VERIFIED: repository migration inventory = 69 active top-level migrations + 1 intentionally excluded nested auth migration.
- VERIFIED: active application ledger = 69/69 applied in `menu_v3._migrations`.
- VERIFIED: Supabase CLI history = 46 entries and is not the active application ledger.
- VERIFIED: live PostgreSQL catalog was inspected for tables, columns, constraints, indexes, functions, triggers, RLS, policies, grants, and extensions.
- VERIFIED: no unvalidated FKs found.
- ORDERING ANOMALY: 20 historical application-time positions differ from filename order.
- UNKNOWN: exact provenance of every legacy Supabase history row cannot be reconstructed from current repository files alone.
- NO IMPLEMENTATION: no database or deployment mutation was performed.

## EXACT NEXT TASK

**Migration Ledger Strategy — choose and document the canonical migration tracking workflow before any migration-history repair or schema release.**


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


## 2026-10-03 — P1.2 CLOSEOUT — VERIFIED

- VERIFIED: P1.2 is complete on PR #366 head `d1809de4f5ff02032c5bd443a511a625d0c23b75`.
- VERIFIED: Quality #2816 = SUCCESS; W9 Orders QA #943 = SUCCESS.
- VERIFIED: Vercel Preview = Ready / SUCCESS.
- UNKNOWN: direct production/physical-device performance measurements remain unverified.
- EXACT NEXT TASK: **P1.3 — Route Code-Splitting / Client Transition Budget**.
- Do not start P1.4 or unrelated optimization before P1.3 is completed and continuity is updated.


## 2026-10-03 — P1.3 CLOSEOUT — VERIFIED / NO CODE CHANGE

- VERIFIED: P1.3 was evaluated against the actual TanStack Start/Vite integration.
- VERIFIED: automatic route code splitting is already provided by the existing TanStack Start integration; PR #367's explicit setting was redundant and was closed without merge.
- VERIFIED: Quality #2820 = SUCCESS; W9 Orders QA #946 = SUCCESS.
- VERIFIED: production-build client chunk inventory remained 145 unique JS chunks with unchanged route chunk sizes.
- UNKNOWN: exact production client-transition request count and quantified initial-route JS reduction remain unverified.
- BLOCKED: Vercel Preview for PR #367 failed due build-rate-limit; no Production deployment was attempted.

## EXACT NEXT TASK

**P1.4 — Request Waterfall Consolidation**

Do not begin database consolidation, analytics caching, or unrelated cleanup before request-level evidence identifies a direct need.


# 2026-10-04 — External Product Action Retirement — VERIFIED / PR #378

- VERIFIED: main baseline before this task is a7f642d5fe8a7f46abfa84f80c74ac129995b3fa, which already includes the official Nafas demo and P1.4–P1.8 performance work.
- VERIFIED: external Quick Add was still visible in Gallery because the existing retirement stylesheet was loaded only for Heritage/Taste; Heritage/Taste also had a local product action.
- IMPLEMENTED: quick-add-compact-refinement.css now retires both .public-menu-quick-add and .public-menu-options-action, plus the local Heritage/Taste control.
- IMPLEMENTED: the existing stylesheet is loaded last for all five canonical themes; no new network dependency was introduced.
- PROTECTED: product details/options, modifiers, variants, notes, cart/order behavior, analytics, auth/RLS, tenant isolation, Supabase data, and P1.4–P1.8 performance architecture.
- VERIFIED: GitHub W9 Orders QA #1011 passed; GitHub Quality #2894 passed through browser template QA for all themes and the remaining Studio/Platform browser gates on implementation head 2466b20f681c2b9dff2fee3f32a72109be896460.
- UNKNOWN: direct real-device production visual verification of the final merged state has not been performed; no deployment was requested or executed.
- STATUS: PR #378 is open and implementation head is pushed/CI-verified. P1.9 remains deferred.
- EXACT NEXT TASK: Review/merge PR #378 when release authorization is given; do not deploy as part of this task.
