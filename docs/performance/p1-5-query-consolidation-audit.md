# P1.5 — Database Query Consolidation Audit and Implementation

**Date:** 2026-10-03  
**Status:** IMPLEMENTATION_IN_PROGRESS  
**Branch:** `perf/p1-5-query-consolidation-2026-10-03`  
**Base:** `main` at `d9d83c89c0070413c61f8a75e3120447006e4828`

## Scope

P1.5 began as a repository-first query/code audit. The implementation boundary is limited to proven query-shape inefficiencies in the existing Studio and Platform order/dashboard readers. No migration, index, auth/RLS, tenant/branch authorization, UI, or deployment change is included.

## Verified findings

1. `src/lib/menu/orders.ts::getOrdersDashboard` loaded up to 100 orders and executed two correlated `order_items` subqueries per order: one `count(*)` and one `jsonb_agg`.
2. `src/lib/menu/platform.ts::getPlatformOrders` loaded up to 200 orders and used the same correlated `order_items` count/JSON aggregation pattern.
3. `src/lib/menu/platform.ts::getPlatformDashboard` loaded up to 500 tenants and computed branch/product/order/member counts with separate correlated subqueries for each tenant row, plus a per-tenant subscription lookup.
4. Existing order/dashboard authorization remains server-derived through the existing auth/platform-admin boundaries.
5. Existing limits are bounded, but they are not cursor pagination. P1.5 therefore does **not** claim that pagination is complete; a separate pagination slice remains required if the UI needs deeper historical traversal.

## Implemented query shape

- Studio orders: filter the authorized tenant scope, select the newest 100 orders into `page_orders`, aggregate `order_items` once for those page orders in `item_agg`, and join the aggregate back to the page.
- Platform orders: filter, select the newest 200 orders into `page_orders`, aggregate `order_items` once for those page orders, and join the aggregate back.
- Platform dashboard: pre-aggregate branch/product/order/member counts by tenant and join those aggregates to the tenant page; subscription plan is joined from the existing one-row-per-tenant `tenant_subscriptions` table.
- Stable `created_at desc, id desc` ordering was used for bounded order pages so equal timestamps do not produce an ambiguous subset.

## Not changed

- No schema or migration changes.
- No new indexes. PostgreSQL/Supabase guidance requires query-plan evidence before adding indexes.
- No auth/RLS or tenant/branch boundary changes.
- No public menu, ordering, subscription, analytics-authorization, theme, SEO, or deployment changes.
- No broad cursor-pagination API was introduced without a concrete UI contract for consuming it.

## Research evidence

- PostgreSQL documents that `EXPLAIN ANALYZE` executes the query and reports actual timing/row counts, making it the appropriate evidence source before declaring a query or index improvement.
- PostgreSQL documents that `WITH` queries can structure complex queries and can avoid redundant work when an expensive calculation is referenced more than once.
- PostgreSQL documents that large `OFFSET` values still require skipped rows to be computed, so cursor/keyset pagination is preferred for large chronological datasets when deeper traversal is actually required.
- Supabase documents using EXPLAIN/EXPLAIN ANALYZE and query statistics to validate query plans and warns against indiscriminate indexing.

Sources:
- PostgreSQL EXPLAIN: https://www.postgresql.org/docs/current/using-explain.html
- PostgreSQL WITH queries: https://www.postgresql.org/docs/current/queries-with.html
- PostgreSQL LIMIT/OFFSET: https://www.postgresql.org/docs/current/queries-limit.html
- Supabase Query Optimization: https://supabase.com/docs/guides/database/query-optimization
- Supabase Debugging Performance: https://supabase.com/docs/guides/database/debugging-performance

## Verification plan

1. GitHub Quality must run the new P1.5 regression test plus the existing typecheck, full tests, lint, build, and browser gates.
2. Review the final Git diff and confirm only task-scoped files changed.
3. If database runtime evidence becomes available, compare representative pre/post `EXPLAIN (ANALYZE, BUFFERS)` plans before claiming a measured latency improvement.
4. Do not mark Production deployed from this branch.

## UNKNOWN / BLOCKED

- Exact production DB execution-time improvement: UNKNOWN until representative query plans/runtime metrics are captured.
- Exact DB round-trip reduction: INFERRED from the SQL shape; not yet measured at runtime.
- Deep pagination beyond the existing 100/200 page bounds: UNKNOWN/NOT_IMPLEMENTED.
- Local shell execution: BLOCKED in the current connector-only execution surface.

## Exact handoff

If CI and diff review pass, close P1.5 as query-consolidation VERIFIED, retain pagination as the next explicit performance slice, and stop. Do not add indexes or deployment work without new evidence.
