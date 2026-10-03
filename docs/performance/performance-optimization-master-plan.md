# Menu V3 — Universal Performance, Network & Quality Master Plan

**Date:** 2026-10-03  
**Status:** ACTIVE — performance program  
**Repository:** `Midosd249/Menu_V3`  
**Canonical branch:** `main`  
**Current implementation branch:** `perf/p1-2-theme-css-code-splitting-2026-10-03`

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

**Current task:** P1.2 — Active Theme Stylesheet Code Splitting.

**Implementation branch:** `perf/p1-2-theme-css-code-splitting-2026-10-03`.

**Next required verification:** focused contract test → typecheck → full tests → lint → build → browser/all-theme network evidence → final diff review.

**Do not start P1.3 until P1.2 is closed and continuity is updated.**


## 2026-10-03 — P1.2 CLOSEOUT — VERIFIED

- VERIFIED: P1.2 Active Theme Stylesheet Code Splitting is complete on PR #366 head `d1809de4f5ff02032c5bd443a511a625d0c23b75`.
- VERIFIED: Quality #2816 = SUCCESS; W9 Orders QA #943 = SUCCESS.
- VERIFIED: Vercel Preview status = SUCCESS / Ready.
- UNKNOWN: direct production/physical-device request-count and DCL measurements remain unverified.
- EXACT NEXT TASK: **P1.3 — Route Code-Splitting / Client Transition Budget**.
- P1.3 must begin with repository-first measurement and verification of the actual TanStack Start/Vite integration; do not blindly enable an unverified splitting option.


## 2026-10-03 — P1.3 CLOSEOUT — VERIFIED / NO CODE CHANGE

- VERIFIED: P1.3 was evaluated against the repository's actual TanStack Start/Vite integration.
- VERIFIED: TanStack Start already enables automatic route code splitting by default; adding `router.autoCodeSplitting: true` was redundant.
- VERIFIED: PR #367 was closed without merge.
- VERIFIED: Quality #2820 = SUCCESS; W9 Orders QA #946 = SUCCESS.
- VERIFIED: before/after production-build client chunk inventory remained 145 unique JS chunks; route chunk sizes were unchanged.
- UNKNOWN: exact production client-transition request count and quantified initial-route JS reduction remain unverified.
- BLOCKED: Vercel Preview for PR #367 returned build-rate-limit failure; no production deployment was attempted.

### P1.4 — Request Waterfall Consolidation — NEXT

Map actual browser/server requests first across public menu, Studio, Admin, Auth, preview, and not-found flows. Consolidate only requests proven redundant while preserving authorization, tenant/branch isolation, SEO, and independent UX loading boundaries.

**Current task:** P1.4 — Request Waterfall Consolidation.
**Implementation status:** NOT_STARTED.
**Deployment status:** NOT_PERFORMED.
