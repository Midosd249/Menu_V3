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

- VERIFIED: the prior blocker was resolved by using the correct menu_v3 schema in the connected Supabase project. The earlier public-schema query was the wrong source and must not be repeated.
- VERIFIED: demo-nafas is a real tenant in menu_v3, with 12 current products, 5 categories, 1 branch, 7 branch-hour rows, and 1 active product offer.
- IMPLEMENTED: DEMO_MENU now uses the current 12 Studio products and their selected product image URLs.
- IMPLEMENTED: exact Studio logo and cover are packaged as public/demo/nafas-logo.webp and public/demo/nafas-cover.webp; this avoids CI/preview 404s from the Studio media endpoint and avoids embedding large Base64 media in the JS fixture.
- IMPLEMENTED: demo-only enrichment remains limited to selected real products: variants, modifier groups/options, and the existing V60 offer.
- VERIFIED: GitHub Quality #2888 = SUCCESS; W9 Orders QA #1006 = SUCCESS.
- VERIFIED: Vercel Preview for head 79e9d73e931b43c12714932229cd47a06b29995b = READY.
- UNKNOWN: direct physical-device QA remains unverified.
- BLOCKED: none for the authorized demo implementation.
- PRODUCTION: unchanged; no production deployment and no merge to main.

## EXACT CURRENT STATE

Official Nafas Demo Sync: IMPLEMENTATION COMPLETE / VERIFIED LOCALLY + CI / PREVIEW

Branch: feat/official-nafas-demo-2026-10-04
PR: #377
Verified head: 79e9d73e931b43c12714932229cd47a06b29995b

## EXACT NEXT TASK

Final diff review → owner approval → merge PR #377 → one production deployment → real-device QA. P1.9 remains deferred.

# 2026-10-04 — Official Nafas Demo Hardening — IMPLEMENTED / VERIFICATION PENDING

- VERIFIED: `main` HEAD before this task was `fad0ad90ece050631dea668138ed4a70c8ba1db2` (P1.8 Performance Gates).
- VERIFIED: the public demo is intentionally served from static `DEMO_MENU` for the `nafas` slug; this task preserves deterministic separation from real tenant data.
- IMPLEMENTED: the official Nafas demo was expanded to 20+ products across five categories while preserving the existing logo path, cover image, and core products.
- IMPLEMENTED: demo-only branch data, opening hours, social/contact links, allergens, dietary labels, tags, variants, modifier groups/options, and item offers.
- IMPLEMENTED: focused regression coverage protects demo richness and rejects the old placeholder Instagram/WhatsApp values.
- RESEARCH: repository-first review plus Exa/Unsplash licensing research; Unsplash states its images are available for commercial and noncommercial use subject to its license and restrictions.
- SCOPE: no database mutation, tenant data mutation, auth/RLS change, schema change, Vercel deployment, or production release.
- VERIFIED: GitHub Quality run `37175844434` / run #2870 passed all repository quality, build, browser-template, Menuun brand, performance-fixture, Studio, and Platform Admin gates; W9 Orders QA run `37175844371` / run #988 also passed.
- VERIFIED: the final preview deployment for head `1f68f1cdd177c2a9b74522083a2d11449ff59e7b` reached Vercel `READY`.
- DEPLOYMENT STATUS: NOT_PERFORMED.
- EXACT NEXT TASK: P1.9 — Real-route performance evidence and budget decision, unless the owner explicitly authorizes another atomic task first.

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

- VERIFIED: current `main` = `d9d83c89c0070413c61f8a75e3120447006e4828` and P1.4 is closed/merged.
- VERIFIED: repository audit identified correlated `order_items` aggregation in `getOrdersDashboard` and `getPlatformOrders`, plus per-tenant correlated count subqueries in `getPlatformDashboard`.
- IMPLEMENTED: bounded order pages now aggregate `order_items` once and join the aggregate; Platform dashboard tenant counts use grouped CTEs.
- PROTECTED: auth/Better Auth, RLS, tenant/branch isolation, order lifecycle, analytics authorization, preparation-time/ETA, themes, subscriptions, SEO, and migrations.
- UNKNOWN: exact runtime DB execution time, exact DB round-trip reduction, and deep pagination requirements.
- BLOCKED: local shell execution unavailable; GitHub CI is the available automated verification source.
- DEPLOYMENT STATUS: NOT_PERFORMED.

## EXACT CURRENT STATE

**P1.5 — Database Query Consolidation: IMPLEMENTATION_IN_PROGRESS**

Branch: `perf/p1-5-query-consolidation-2026-10-03`
Base: `main` at `d9d83c89c0070413c61f8a75e3120447006e4828`

## ACCEPTANCE STATUS

- [x] Repository-first audit.
- [x] Proven correlated order-item paths identified.
- [x] Proven Platform tenant count paths identified.
- [x] Query consolidation implemented.
- [x] Regression coverage added.
- [ ] GitHub Quality/W9 verification.
- [ ] Final diff review after CI.
- [ ] Runtime query-plan measurement.

## EXACT NEXT TASK

**Finish P1.5 verification and continuity closeout.**

---
# 2026-10-03 — P1.4 Request Waterfall Consolidation — CLOSED / VERIFIED

- VERIFIED: P1.4 started from main `6b2eef2b619c7aa003649b516a1ca0fbbbab88e4` after P1.2/P1.3 closeout.
- VERIFIED: repository audit proved duplicate `getMyStudio()` calls on `/studio/analytics` and `/studio/reports`; `StudioGate` already loaded the same authorized `StudioSnapshot` and exposed it through `useStudio()`.
- VERIFIED: Analytics and Reports now reuse `useStudio().snapshot`; `getOwnerAnalytics()` remains an independent loading boundary.
- VERIFIED: `tests/p1-4-request-waterfall.test.mjs` was added and registered in `npm test`.
- VERIFIED: GitHub Quality #2824 = SUCCESS and W9 Orders QA #949 = SUCCESS on head `5ee71e1ae7c64bf6d359f171126675fb56955259`.
- VERIFIED: final PR #370 diff was reviewed and squash-merged into `main` as `1bb30fc675ee2cdf448cba380223dd00240dee0a`.
- UNKNOWN: exact browser/network request-count reduction, production DCL/LCP, physical-device performance, and local-shell verification remain unmeasured/unavailable.
- DEPLOYMENT STATUS: NOT_PERFORMED.

## EXACT CURRENT STATE

**P1.4 — Request Waterfall Consolidation: CLOSED / VERIFIED**

PR: #370
Verified implementation head: `5ee71e1ae7c64bf6d359f171126675fb56955259`
Merge commit: `1bb30fc675ee2cdf448cba380223dd00240dee0a`

## ACCEPTANCE STATUS

- [x] Request boundaries audited across public menu, Studio, Admin, Auth, preview, and not-found flows.
- [x] Proven duplicate Studio snapshot request identified.
- [x] Duplicate removed from Analytics.
- [x] Duplicate removed from Reports.
- [x] Regression contract added and registered.
- [x] Full GitHub Quality/W9 verification passed.
- [x] Final diff reviewed and PR merged.
- [ ] Exact production/browser request-budget measurement.

## EXACT NEXT TASK

**P1.5 — Database Query Consolidation and Pagination**

Do not begin implementation from the roadmap wording alone. Start with repository-first query/code audit and evidence for `owner.ts`, `orders.ts`, `platform.ts`, analytics modules, and any N+1 path. Preserve tenant/branch authorization and do not introduce migrations or query changes until a concrete DB/request inefficiency is proven.

# 2026-10-03 — P1.2 Active Theme Stylesheet Code Splitting — VERIFIED / PR #366

- VERIFIED: PR #366 targets `main` and its final implementation head `d1809de4f5ff02032c5bd443a511a625d0c23b75` has passed GitHub Quality #2816 and W9 Orders QA #943.
- VERIFIED: Quality #2816 completed with conclusion `success`.
- VERIFIED: W9 Orders QA #943 completed with conclusion `success`.
- VERIFIED: Vercel status for the verified PR head is `success`; the latest Preview deployment is `Ready`.
- VERIFIED: P1.2 acceptance contracts are satisfied by repository/GitHub evidence: no eager theme CSS in root, active-theme SSR stylesheet mapping, client stylesheet synchronization, five-theme registry, and regression coverage.
- VERIFIED: no Production deployment was performed by P1.2.
- UNKNOWN: direct physical-device and independent production performance measurements remain unknown; the <15-request and <500ms DCL targets are engineering targets, not yet runtime-verified budgets.
- BLOCKED: local shell execution is unavailable through the current connector-only execution surface; GitHub CI is the available automated verification evidence.
- PROTECTED: existing lazy theme template architecture, auth/RLS, tenant/branch isolation, ordering, analytics authorization, preparation-time/ETA, image delivery, subscriptions, SEO, and migrations were not intentionally changed by P1.2.

## EXACT CURRENT STATE

**P1.2 — Active Theme Stylesheet Code Splitting: CLOSED / VERIFIED**

Branch: `perf/p1-2-theme-css-code-splitting-2026-10-03`
PR: #366
Verified head: `d1809de4f5ff02032c5bd443a511a625d0c23b75`

## EXACT NEXT TASK

**P1.3 — Route Code-Splitting / Client Transition Budget**

Start with repository-first boot, current `main`/PR verification, and a measurement baseline. Do not assume the <5 client-transition target is currently met. Inspect the actual TanStack Start/Vite integration before changing code-splitting configuration. Do not deploy automatically.

## STOP CONDITION

Do not begin P1.4, database consolidation, analytics caching, or unrelated cleanup during P1.3. After P1.3 verification, update continuity with exactly one next task and stop.


## 2026-10-03 — P1.3 CLOSEOUT — VERIFIED / NO CODE CHANGE

- VERIFIED: P1.3 was evaluated against the actual TanStack Start/Vite integration on main.
- VERIFIED: the repository uses tanstackStart(); a standalone tanstackRouter() plugin is not present.
- VERIFIED: official TanStack evidence indicates Start has automatic route code splitting enabled by default; the attempted explicit router.autoCodeSplitting setting was redundant and was not merged.
- VERIFIED: PR #367 was closed without merge.
- VERIFIED: Quality #2820 = SUCCESS; W9 Orders QA #946 = SUCCESS.
- VERIFIED: production-build client chunk inventory before/after the explicit setting remained 145 unique JS chunks, with route chunk sizes unchanged.
- UNKNOWN: exact production client-transition request count and quantified initial-route JS reduction remain unverified; the existing build already produces route-specific chunks.
- BLOCKED: Vercel Preview for PR #367 reported a platform build-rate-limit failure; no production deployment was attempted.
- PROTECTED: auth/RLS, tenant/branch isolation, ordering, analytics authorization, themes, SEO, subscriptions, migrations, and P1.2 were not changed by P1.3.

## EXACT CURRENT STATE

**P1.3 — Route Code-Splitting / Client Transition Budget: CLOSED / VERIFIED — NO CODE CHANGE REQUIRED**

## EXACT NEXT TASK

**P1.4 — Request Waterfall Consolidation**

Start with repository-first request mapping and evidence for public menu, Studio, Admin, Auth, preview, and not-found flows. Do not begin database/query consolidation or caching unless request evidence directly requires it.


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


## 2026-10-05 — P1.9 Admin Critical Route Split — VERIFIED / MERGED
- VERIFIED: PR #382 was reviewed against current `main` and the current TanStack Router/Vite architecture; the change isolates the heavy Platform Admin UI from the Admin route reference module and moves Admin route metadata into a dedicated lightweight module.
- IMPLEMENTED: `src/components/admin/platform-admin-page.tsx` owns the Platform Admin UI; `src/lib/admin/routes.ts` owns route/tab metadata; `src/routes/admin.tsx` is now a lightweight route/configuration shell; `src/routes/admin/$workspace.tsx` remains the dynamic workspace adapter.
- PROTECTED: server-side Platform Admin authorization, tenant/branch boundaries, customer/account operations, order lifecycle, client-side TanStack navigation, legacy tab compatibility, and existing public-menu/theme behavior.
- IMPLEMENTED: P1.9 real-route five-run evidence harness remains scoped to `perf/p1-9-*` branches only.
- VERIFIED: PR #382 head `323d548ba96d94c856578b6401a77c53f9176f95` passed GitHub Quality #2921 and W9 Orders QA #1037; Vercel Preview status for the head was SUCCESS.
- VERIFIED: five-run evidence measured initial-request medians of 91 (`/m/nafas`), 96 (`/m/nafas?lang=en`), and 92 (`/m/nafas/olaya`); DCL medians were 496.9ms, 485.0ms, and 462.3ms; EN transition median was 10 requests / 559ms; CLS was 0 and long tasks were 0 in route samples.
- VERIFIED: built public HTML contained 28 modulepreload links and 0 Admin-named modulepreload links on the P1.9 head.
- DECISION: this is a proven route-graph reduction, not proof of the original <15 initial-request target. The strict request budget remains unmet.
- RESEARCH: current TanStack Router documentation confirms exported route properties can defeat automatic code splitting and route components are non-critical/lazy configuration.
- MERGED: PR #382 squash-merged into `main` as `a449d1f3ac81366431addd2c2b2637355f72131f`.
- POST-MERGE: GitHub Actions for the merge commit have not yet produced a workflow run; Vercel status is PENDING. Production deployment is NOT_VERIFIED.
- UNKNOWN: production-host performance, real-device performance, LCP/INP, authorized DB query-plan evidence, and whether further public-route preload reduction is safe remain unverified.

## EXACT CURRENT STATE
**P1.9 Admin Critical Route Split: MERGED / VERIFIED CI — PRODUCTION VERIFICATION PENDING**
Main: `a449d1f3ac81366431addd2c2b2637355f72131f`
PR: #382

## EXACT NEXT TASK
**P1.9-B — Production/real-device performance validation and remaining public-route preload investigation.** Re-run the established five-run protocol against production-equivalent conditions, capture LCP/INP where available, compare request/transfer composition, and only introduce another code change if a new causal inefficiency is proven. Do not claim <15 initial requests or <500ms DCL as globally passed until production-equivalent evidence supports it.