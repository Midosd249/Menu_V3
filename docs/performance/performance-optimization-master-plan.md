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

- VERIFIED: P1.4 is closed/merged on `main`.
- VERIFIED: correlated `order_items` aggregation was present in Studio and Platform order readers; Platform dashboard also had per-tenant correlated counts.
- IMPLEMENTED: order-item aggregation now runs once for each bounded page; Platform tenant counts now use grouped CTEs and joins.
- UNKNOWN: runtime DB latency/round-trip measurements until representative query plans are captured.
- UNKNOWN: deep cursor pagination beyond bounded pages; no speculative pagination API was added.
- BLOCKED: local shell execution is unavailable; GitHub CI is the current verification gate.
- DEPLOYMENT STATUS: NOT_PERFORMED.

## EXACT CURRENT TASK

**P1.5 — Database Query Consolidation and Pagination**

Finish CI verification and continuity closeout for the proven query-consolidation slice. Do not add indexes, migrations, or broad pagination APIs without new evidence.

---
# 2026-10-03 — P1.4 Request Waterfall Consolidation — CLOSED / VERIFIED

- VERIFIED: repository request mapping was completed across public menu, Studio, Admin, Auth, preview, and not-found flows.
- VERIFIED: duplicate `getMyStudio()` requests were removed from Studio Analytics and Reports by reusing the existing authorized `StudioGate` snapshot.
- VERIFIED: independent analytics, Order Value Analytics, Team, Home, auth, and public-menu boundaries were preserved where no stronger consolidation evidence existed.
- VERIFIED: Quality #2824 and W9 Orders QA #949 passed; final PR #370 was merged into `main` as `1bb30fc675ee2cdf448cba380223dd00240dee0a`.
- UNKNOWN: exact browser/network request counts and DCL/LCP remain runtime evidence gaps; the P1.4 change is proven by source and CI, not by a production request-budget benchmark.
- DEPLOYMENT STATUS: NOT_PERFORMED.

## P1.4 acceptance

- request map: VERIFIED
- proven duplicate consolidation: VERIFIED
- regression contract: VERIFIED
- full CI/browser verification: VERIFIED
- exact request-budget measurement: UNKNOWN

## EXACT NEXT TASK

**P1.5 — Database Query Consolidation and Pagination**

Start with repository-first query/code audit and identify one concrete, evidence-backed DB round-trip, N+1, oversized dashboard payload, or pagination issue. Do not introduce schema/query changes or caching without evidence.

# Menu V3 — Universal Performance, Network & Quality Master Plan

**Date:** 2026-10-03  
**Status:** ACTIVE — performance program  
**Repository:** `Midosd249/Menu_V3`  
**Canonical branch:** `main`  
**Current implementation branch:** `perf/p1-5-query-consolidation-2026-10-03`

## 1. Purpose

This document is the permanent cross-chat execution contract for the Menu V3 performance program. A new chat must recover the current repository/Git state and this document before continuing. Conversation memory is not a source of truth.

The program exists to remove measurable network, rendering, database, bundle, and architecture waste without rebuilding completed Menu V3 systems.

### Primary goals

1. Reduce the public homepage/menu initial request waterfall from the user-observed **117 HTTP requests** toward a controlled budget.
2. Target **fewer than 15 initial HTTP requests per route load** where the route is under repository control.
3. Target **fewer than 5 requests on ordinary client-side route/theme transitions**.
4. Target **DOMContentLoaded under 500ms** on the agreed controlled benchmark environment.
5. Eliminate classic API/DB N+1 patterns and unnecessary fragmented relational reads.
6. Prevent large dashboard/table/analytics payloads from loading entire datasets.
7. Preserve Arabic-first RTL, English LTR, all five themes, tenant/branch isolation, auth/RLS, ordering, analytics integrity, subscriptions, and existing public-menu behavior.
8. Keep architecture clean: UI, server/business logic, and migrations remain clearly separated.
9. Make performance measurable and regression-resistant rather than relying on subjective impressions.

> **Important:** these are engineering targets, not guarantees. Actual DCL/request counts depend on browser, network, CDN/Vercel behavior, fonts, third parties, runtime data, cache state, and deployment configuration. A target is only marked VERIFIED after a repeatable benchmark produces evidence.

## 2. Permanent performance rules

### Rule A — Network budget

- Initial route load target: **<15 HTTP requests**.
- Normal client transition target: **<5 additional requests**.
- Never eagerly ship inactive theme stylesheets.
- Prefer active-theme-only CSS and route-level code splitting.
- Do not add speculative preloads.
- Avoid sequential client requests when a single authorized server boundary can provide the required data.
- Do not count a request budget as passed from source inspection alone; use browser/network evidence.

### Rule B — Database/API shape

- Ban application-level N+1 loading.
- Prefer one authorized relational query or a deliberately bounded small set of parallel queries.
- Current repository evidence uses `getSql()`/raw SQL in several menu modules. **Do not introduce Drizzle merely to satisfy the guardian wording.**
- If/when Drizzle is introduced for a specific subsystem, use joins/relations deliberately rather than one query per parent row.
- Keep tenant and branch authority server-side.
- Never trust client-supplied tenant, branch, role, privilege, entitlement, or price.

### Rule C — Large datasets

- No full-table dumps for dashboards.
- Use server-side pagination.
- Prefer stable cursor/keyset pagination for large chronological datasets.
- Select only fields required by the current view.
- Use virtualized lists when a UI genuinely renders large lists.
- Use caching only when cache identity, invalidation, tenant isolation, and freshness semantics are proven.
- Redis/Edge caching is **not currently verified** and is not an automatic dependency.

### Rule D — Code quality

- Smallest safe diff.
- No unrelated rewrite/refactor.
- No explicit `any`.
- Reuse existing patterns and dependencies.
- Keep UI, server/business logic, and migrations separated.
- Preserve backwards compatibility unless the atomic task explicitly requires a breaking change.

## 3. Current verified findings

### Public CSS

**VERIFIED:** `src/routes/__root.tsx` previously linked the full set of theme/refinement stylesheets globally, including all five theme families and multiple refinement/hardening layers.

**USER-OBSERVED:** homepage request count was approximately 117 HTTP requests.

**VERIFIED:** `MenuThemeController` previously changed theme tokens/data attributes but did not own the lifecycle of theme stylesheets.

**VERIFIED:** the repository already has lazy theme *template/component* loading through `getLazyThemeTemplate()`. That earlier capability is protected and must not be rebuilt.

### Routing

**VERIFIED:** public menu routes already use SSR theme bootstrap through `createThemeBootstrapScript()`.

**VERIFIED:** TanStack Start file-based routes are already used.

**UNKNOWN:** current production route request counts and browser waterfall until browser/CI evidence is collected.

### Data/backend

**VERIFIED:** current repository menu data access includes raw SQL and multiple relational reads.

**VERIFIED:** Studio analytics currently uses separate server functions for owner analytics, Studio data, tenant discovery, and order-value analytics.

**VERIFIED:** order/platform dashboard code contains bounded but potentially heavy result sets and correlated relational aggregation that should be reviewed in later atomic tasks.

**UNKNOWN:** actual production query latency/DB round-trip counts without runtime database evidence.

## 4. Protected systems

The following are out of scope unless new evidence requires a narrowly scoped correction:

- authentication and Better Auth boundaries;
- RLS and tenant/branch isolation;
- public ordering and abuse protection;
- Order Value Analytics tenant authorization;
- preparation-time / estimated-ready-time system;
- image-delivery system;
- five canonical themes and their visual identity;
- existing lazy theme template architecture;
- subscription/entitlement boundaries;
- SEO semantics;
- existing migrations and schema integrity;
- production release/deployment workflow.

## 5. Execution roadmap

### P1.2 — Active Theme Stylesheet Code Splitting — CURRENT

**Goal:** stop loading inactive theme CSS on every route while preserving SSR first paint and theme transitions.

**Implementation:**
1. Remove theme CSS imports/links from `src/routes/__root.tsx`.
2. Add a theme stylesheet registry.
3. SSR-link only the active theme stylesheet set from public menu routes.
4. Client-sync the active stylesheet set when theme/preview changes.
5. Move mixed theme-specific rules out of the shared `theme-premium.css` layer.
6. Keep shared public-menu polish in a truly shared stylesheet.
7. Add contract tests preventing regression to eager root theme CSS.

**Acceptance:**
- only active theme-specific CSS is requested by the public menu;
- SSR theme bootstrap remains intact;
- theme preview and all five canonical themes continue to resolve;
- Arabic/English and RTL/LTR remain untouched;
- no root-level inactive theme CSS links remain;
- regression contract is registered in `npm test`.

**Verification required:**
- typecheck;
- focused theme CSS contract;
- full test suite;
- lint;
- production build;
- all-theme browser QA;
- network waterfall/request count when browser tooling is available.

### P1.3 — Route Code-Splitting / Client Transition Budget

**Goal:** reduce JS shipped for unrelated routes and keep client transitions small.

**Plan:**
1. Inspect actual `vite.config.ts`/TanStack Start plugin integration.
2. Do not blindly add `tanstackRouter({ autoCodeSplitting: true })` because the current repository uses `tanstackStart()` and the plugin integration must be verified first.
3. Measure route chunk graph before changes.
4. Enable or implement the smallest supported route-level splitting strategy.
5. Keep loaders in the initial route path unless evidence proves loader splitting beneficial; TanStack explicitly warns loader splitting can add a server round trip.
6. Re-test Studio, Admin, public menu, previews, auth, and not-found routes.

### P1.4 — Request Waterfall Consolidation

**Goal:** eliminate avoidable fragmented browser/server calls.

**Primary targets:**
- Studio Home;
- Studio Analytics;
- Studio Reports;
- Studio Team;
- other routes discovered by the repository-wide audit.

**Plan:**
- identify requests made per route and their authorization boundaries;
- combine data that always renders together behind one authorized server boundary;
- avoid duplicate `getMyStudio()`/analytics/team calls when the same snapshot can safely serve the view;
- preserve independent loading only where it materially improves UX or prevents oversized payloads.

### P1.5 — Database Query Consolidation and Pagination

**Goal:** reduce DB round trips and expensive correlated aggregation.

**Primary targets:**
- `src/lib/menu/owner.ts`;
- `src/lib/menu/orders.ts`;
- `src/lib/menu/platform.ts`;
- analytics modules;
- any N+1 path discovered by query/code audit.

**Plan:**
- consolidate tenant/branch/category/item/settings reads where payload shape allows;
- use SQL joins/CTEs/aggregations instead of per-row child queries;
- replace large dashboard result limits with paginated/cursor-based endpoints;
- add/verify supporting indexes only from actual query evidence;
- use EXPLAIN/ANALYZE only on representative queries and never expose private production data.

**Example target shape for order items:**
aggregate `order_items` once by `order_id`, then join the aggregate to the paginated `orders` result rather than running a correlated subquery for every order.

### P1.6 — Analytics Boundary and Caching

**Goal:** make analytics pages predictable and bounded.

**Plan:**
- create a single authorized analytics page boundary where multiple panels always load together;
- pass only validated filters;
- aggregate on the server;
- paginate detail tables;
- cache only immutable or safely scoped summaries;
- do not add Redis/Edge infrastructure until the workload and invalidation model justify it.

### P1.7 — Vite/Rolldown Chunk Optimization

**Goal:** optimize final production chunk graph after application-level splitting exists.

**Plan:**
1. inspect build output;
2. identify oversized or duplicated chunks;
3. use current Vite `build.rolldownOptions.output.codeSplitting` only when measurements show a benefit;
4. avoid speculative manual chunk naming;
5. preserve SSR/Nitro compatibility;
6. verify no client/server chunk leakage.

### P1.7 — Vite/Rolldown Chunk Optimization — CLOSED / VERIFIED

**Result:** no code/configuration change required.

**Evidence:**
- Vite 8.2.2/Rolldown production client build is already active.
- Current production client output contains 142 JavaScript asset rows.
- Largest client chunk: `index-BDOzjaAe.js` — 272.62 kB raw / 88.49 kB gzip.
- No client chunk exceeds the default 500 kB warning threshold.
- No current `manualChunks` or `rolldownOptions` override exists.
- Automatic code splitting is already enabled.
- No duplicated module ownership or safe manual grouping with proven net benefit was established.
- Manual splitting was intentionally not introduced because it can increase requests/cache fragmentation and may affect side-effect execution order.

**UNKNOWN:** browser-level initial JS transfer, client-transition requests, cache reuse, main-thread cost, and route-specific dependency graphs.

**Audit:** `docs/performance/p1-7-vite-rolldown-chunk-audit.md`.

### P1.8 — Performance Gates

**Goal:** turn the targets into repeatable regression checks.

Required evidence where tooling supports it:
- initial HTTP request count;
- client-transition request count;
- DOMContentLoaded;
- LCP;
- JS transfer size;
- CSS transfer size;
- HTML/SSR payload size;
- main-thread blocking/long tasks;
- representative DB query duration;
- DB round-trip count;
- analytics/table payload size.

Budgets:
- initial requests: **<15 target**;
- normal client transition: **<5 target**;
- DCL: **<500ms target**;
- no critical N+1;
- no full-table dashboard load;
- no cross-tenant/cross-branch data exposure.

A failed target is not automatically a reason for unsafe optimization. Investigate the cause and document the trade-off.

### P1.9 — Final Audit and Controlled Release

Order:
1. local development;
2. local QA;
3. browser/visual QA;
4. tests;
5. GitHub Actions quality gates;
6. final diff review;
7. one coherent release batch;
8. owner-authorized merge;
9. one Production deployment;
10. real-device QA;
11. record exact deployed commit and remaining UNKNOWN/BLOCKED items.

No automatic deployment from performance implementation branches.

## 6. Task boundaries

Only one implementation task may be IN_PROGRESS.

After each task:
- update `PROJECT_STATE.md`;
- update `PLAN.md`;
- update `TASKS.md`;
- update relevant project-memory/audit documents when a new hard problem is discovered;
- record exact branch/head;
- record files changed;
- record verification commands/results;
- record UNKNOWN/BLOCKED;
- record exactly one next task;
- STOP.

## 7. Cross-chat recovery procedure

A new chat must:

1. verify `main` HEAD;
2. verify open PRs and relevant checks;
3. read `AGENTS.md`, `PROJECT_STATE.md`, `PLAN.md`, `TASKS.md`, `SESSION_PROTOCOL.md`, README;
4. read this master plan;
5. read `docs/project-memory/problems-learned.md` for complex work;
6. inspect the exact current task files;
7. prove completed/protected work before editing;
8. run the research preflight;
9. report classification/workflows/scope/risks/acceptance/verification before edits;
10. execute exactly one atomic task;
11. verify and review the diff;
12. update continuity and stop.

**Never infer current status from a previous chat message.**

## 8. Evidence vocabulary

- **VERIFIED:** directly established by current repository/Git/test/runtime evidence.
- **INFERRED:** reasonable conclusion derived from verified evidence.
- **PROPOSED:** intended design or future action.
- **UNKNOWN:** missing evidence.
- **BLOCKED:** work cannot proceed because a required dependency/permission/environment is unavailable.

## 9. Current task handoff

**Current task:** P1.8 — Performance Gates.

**P1.7 status:** CLOSED / VERIFIED — NO CODE CHANGE REQUIRED.

**P1.7 evidence:** production client build on GitHub Quality #2846 / job #111286147999 used Vite 8.2.2/Rolldown and produced 142 client JavaScript asset rows; largest client chunk was 272.62 kB raw / 88.49 kB gzip; no client chunk exceeded the default 500 kB warning threshold. No safe manual chunking change was proven.

**Next required work:** establish repeatable browser/performance regression evidence for initial requests, client transitions, DCL/LCP, JS/CSS transfer, main-thread work, and representative DB/API measurements where tooling supports them.

**Deployment status:** NOT_PERFORMED.

Do not deploy automatically. Do not reopen P1.7 unless new evidence identifies a concrete chunk regression or a measurable safe optimization.
