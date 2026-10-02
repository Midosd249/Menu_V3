# Order Value Analytics — Approved Data Contract and Task 1 Backend Design

Status: APPROVED / TASK 1 DOCUMENTED  
Date: 2026-10-02  
Repository baseline: main `e370caabe179a9795409e76b5357530de4ccb63d`

## 1. Purpose and boundary

Order Value Analytics (تحليلات قيمة الطلبات) provides an operational view of recorded order totals. It is not payment analytics and is not accounting revenue analytics.

Primary metric:
- Order Value / قيمة الطلبات

Approved transparency notice:
- EN: “Order values are based on recorded order totals. Payment settlement, refunds, taxes, and fees are not included.”
- AR: “تعتمد قيمة الطلبات على إجماليات الطلبات المسجلة، ولا تشمل تسوية المدفوعات أو الاستردادات أو الضرائب أو الرسوم.”

Out of scope for this milestone:
- Revenue, Paid Revenue, Net Revenue, Gross Sales, Profit, Net Payout, Realized Revenue.
- Payment, refund, tax, fee, profit, reconciliation, ledger, or settlement logic.
- Category Order Value.
- Multi-currency UI or currency conversion.
- Order lifecycle changes.
- Preparation-time / estimated-ready-time changes.
- Public ordering, WhatsApp, Vercel settings, deployment, real orders, or PR creation.

Implementation has not started before this task. This document records the approved contract and Task 1 backend design only.

## 2. Approved order data contract

Source: `orders`.

Eligible rows:
```text
status IN ('confirmed', 'preparing', 'ready', 'completed')
```

Excluded rows:
```text
status IN ('new', 'cancelled')
```

Formula:
```text
Order Value = SUM(orders.total)
WHERE status IN ('confirmed','preparing','ready','completed')
```

Order Count:
```text
COUNT(*)
WHERE status IN ('confirmed','preparing','ready','completed')
```

Average Order Value:
```text
SUM(orders.total) / COUNT(*)
```
The average is NULL/empty when the eligible order count is zero; the UI should present an honest no-data state rather than zero.

Completed Order Value is not part of Version 1's required KPI set. If exposed later, it means `SUM(orders.total) WHERE status = 'completed'`; it never means paid value.

Confirmed does not mean paid. Completed does not mean paid.

## 3. Geography, timezone, and date boundaries

Market scope: Saudi Arabia only for this milestone.  
Timezone: `Asia/Riyadh`.  
Currency: `SAR`.

All period boundaries are resolved server-side. Browser-local time and the server machine's unconfigured timezone are not authoritative.

Use half-open intervals:
```text
[start, end)
```

Definitions:
- Today: local start of today through local start of tomorrow.
- This Week: local start of the configured week through the next week boundary.
- This Month: local start of the current month through the first instant of the next month.
- Custom Period: selected local start through the selected local end boundary.

Task 1 design requirement: convert each Asia/Riyadh local boundary to an absolute timestamp before PostgreSQL filtering. Query predicates must be equivalent to:
```sql
created_at >= start AND created_at < end
```

No rolling 7-day or rolling 30-day interpretation is permitted for Today, This Week, or This Month.

Week-start configuration must be an explicit application constant/configuration decision. Do not infer it from browser locale.

## 4. Currency safety

Version 1 displays/calculates SAR only.

Expected query invariant:
```text
orders.currency = 'SAR'
```

Historical inconsistency handling:
1. Never sum rows with a different currency into the SAR metric.
2. Detect the presence of non-SAR eligible rows within the requested tenant/branch/date scope.
3. Treat the metric as unsafe for that scope unless the implementation can explicitly exclude the inconsistent rows and surface a truthful data-quality state.
4. Do not silently convert currencies.
5. Do not introduce a currency selector in Version 1.

Task 1 recommendation: perform the currency consistency check in the same server-side analytics operation so the output cannot be mistaken for a complete SAR total when incompatible eligible records exist.

## 5. Authorization contract

Every request must establish trusted server-side context:
1. Authenticated user via existing `authMiddleware`.
2. Authorized tenant membership.
3. Explicit analytics-read permission.
4. Authorized branch scope.

Approved permission boundary: `analytics.read`, subject to repository naming conventions.

Current repository finding: `analytics.read` does not exist in the current `Permission` union. Existing permissions include `orders.read` and `orders.write`. Therefore adding/reusing `analytics.read` requires an explicit authorization change; do not pretend it already exists.

Owner and authorized administrator roles may read all branches in their tenant. Branch-scoped users may read only their authorized branches. Users without the analytics permission must be denied.

Client-supplied tenant ID, branch ID, role, or permission is never trusted.

## 6. Branch filtering

A branch filter is optional at the product level, but server enforcement is mandatory.

For an all-authorized-branches request:
- owner/admin: all active/in-scope tenant orders.
- branch-scoped user: only orders whose `branch_id` is in their server-derived authorized branch set.

For a requested branch:
- validate that the branch belongs to the authorized tenant;
- validate the caller can access that branch;
- add the branch predicate server-side.

Recommended predicate shape:
```sql
tenant_id = trustedTenantId
AND branch_id IN (trustedAuthorizedBranchIds)
AND created_at >= start
AND created_at < end
AND status IN (...)
AND currency = 'SAR'
```

Do not accept an arbitrary client-provided branch list without intersecting it with trusted authorization scope.

Orders with `branch_id IS NULL` must not be attributed to a branch breakdown. For the aggregate tenant-level metric, the product decision must be explicit before treating unassigned orders as tenant-wide value; Task 1 should therefore keep branch attribution separate from the base aggregate contract.

## 7. Dedicated backend function design

Do not extend `getOwnerAnalytics` with order-value aggregates if doing so would inherit its rolling-window, engagement-only, and incomplete branch-authorization behavior.

Recommended conceptual server function:
```text
getOwnerOrderValueAnalytics()
```
Use repository naming conventions during implementation.

The function must:
- run behind `authMiddleware`;
- resolve membership and role from the authenticated user;
- enforce `analytics.read`;
- derive tenant and authorized branches server-side;
- validate the requested period;
- convert Asia/Riyadh local boundaries to absolute timestamps;
- query `orders` directly for order-level aggregates;
- never join `order_items` for the base Order Value/Count/Average calculation;
- detect currency inconsistency;
- return deterministic empty/error states.

## 8. Input contract

Recommended validated input:

```ts
type OrderValueAnalyticsInput = {
  period:
    | { type: 'today' }
    | { type: 'week' }
    | { type: 'month' }
    | { type: 'custom'; startLocal: string; endLocal: string };
  branchId?: string;
};
```

Rules:
- `custom` values represent local Asia/Riyadh calendar boundaries, not UTC.
- Validate format and ordering server-side.
- Convert to `start` and `end` absolute timestamps server-side.
- Enforce `start < end`.
- Use `[start,end)`.
- Reject ambiguous/invalid custom ranges rather than guessing.
- Browser time is never used to derive the authoritative period.

## 9. Output contract

Recommended result:

```ts
type OrderValueAnalytics = {
  period: {
    type: 'today' | 'week' | 'month' | 'custom';
    start: string;
    end: string;
    timeZone: 'Asia/Riyadh';
  };
  currency: 'SAR';
  orderValue: number;
  orderCount: number;
  averageOrderValue: number | null;
  dailyTrend: Array<{
    day: string;
    orderValue: number;
  }>;
  dataQuality: {
    currencyConsistent: boolean;
  };
};
```

Optional branch/product breakdowns must be separate from the base aggregate contract and only added if their authorization/data guarantees are verified.

The daily trend must use the same resolved period and the same eligibility/currency rules as the KPI aggregate. It must group by Asia/Riyadh calendar day, not database/session/browser day.

## 10. Error and empty-state contract

Distinguish:
- unauthenticated: unauthorized;
- authenticated but not a tenant member: forbidden/not-found according to existing authorization semantics;
- missing analytics permission: forbidden;
- inaccessible requested branch: forbidden;
- invalid period: validation error;
- currency inconsistency: explicit data-quality/unsafe result, never a silent partial total;
- no eligible orders: successful result with `orderCount = 0`, `orderValue = 0`, `averageOrderValue = null`, and an empty daily trend (or a zero-filled trend only if the UI contract explicitly requires calendar continuity).

Do not fabricate zeros for authorization failures or data-quality failures.

## 11. Daily trend aggregation

The trend is an order-level aggregation:
```text
GROUP BY Asia/Riyadh local calendar day
SUM(orders.total)
WHERE the same eligibility, tenant, branch, currency, and [start,end) predicates apply.
```

Do not join `order_items` because an order with multiple items would duplicate `orders.total`.

Product breakdown, if later approved, must aggregate `order_items.line_total` separately. Category breakdown remains deferred because historical category identity is not guaranteed.

## 12. Existing repository constraints affecting Task 1

VERIFIED:
- `orders` stores `tenant_id`, nullable `branch_id`, `status`, `currency`, `total`, and `created_at`.
- `orders.total` has a non-negative check and is persisted server-side at order creation.
- The six lifecycle states are `new`, `confirmed`, `preparing`, `ready`, `completed`, `cancelled`.
- Existing `getOwnerAnalytics` uses rolling 7/30-day event windows and `menu_events`; its daily grouping uses database `date_trunc('day', created_at)`.
- Existing `Permission` does not contain `analytics.read`.
- Existing authorization supports tenant membership and branch scope through `branch_scope` / `member_branch_access` and `canAccessBranch`.
- No tenant/branch timezone field was verified in the current order/tenant model.
- No historical category snapshot exists in `order_items`.

INFERRED:
- `orders.total` is effectively fixed by current application paths after creation, but the database does not enforce immutability.
- Historical non-SAR records can exist if tenant currency changes because the order row stores its own currency.

## 13. Tests required before implementation is considered complete

- eligibility: include confirmed/preparing/ready/completed; exclude new/cancelled;
- sum/count/average correctness;
- zero eligible orders;
- exact start/end boundary behavior using `[start,end)`;
- Asia/Riyadh Today/Week/Month/custom boundaries;
- no rolling-window substitution;
- daily trend uses Riyadh calendar days;
- tenant isolation;
- branch isolation and branch filter denial;
- explicit `analytics.read` denial/allowance;
- owner/admin all-branch access;
- branch-scoped access;
- client-supplied tenant/role/branch/permission cannot expand scope;
- SAR-only behavior;
- inconsistent historical currency detection and no silent conversion;
- no order-total duplication from order_items joins;
- regression coverage for existing engagement analytics and order lifecycle.

## 14. Risks and stop/go conditions

STOP before broader implementation if:
- the approved `analytics.read` boundary cannot be introduced without weakening existing authorization;
- Asia/Riyadh boundary conversion cannot be made deterministic server-side;
- historical currency inconsistency cannot be detected safely;
- branch scope cannot be enforced server-side;
- a schema change becomes necessary to satisfy the approved contract.

If a migration is strictly required, stop and report the exact reason before creating it.

## 15. Expected later file impact

Likely, subject to implementation evidence:
- `src/lib/menu/owner.ts` or a dedicated analytics server module;
- `src/lib/menu/types.ts`;
- `src/lib/auth/permissions.ts`;
- `src/lib/auth/authorization.server.ts`;
- date/time helper module if an existing safe utility is insufficient;
- `src/routes/studio/analytics.tsx` for later UI work;
- focused analytics/auth/date/currency tests;
- continuity documentation.

No migration is justified by Task 1 findings yet.

## 16. Task 1 result

Status: VERIFIED / DOCUMENTED.

Task 1 formalized:
- dedicated server-side order-level query boundary;
- trusted authorization inputs;
- approved status eligibility;
- Asia/Riyadh `[start,end)` period conversion;
- SAR-only safety;
- branch-scope enforcement;
- order-level aggregation without item joins;
- daily trend semantics;
- input/output/error contracts;
- required tests and stop/go conditions.

No application code was implemented in Task 1. No migration was created.

## 17. Exact next task

Implement the smallest backend server contract from this document, including the required authorization boundary and tests. Do not build the complete UI, create a migration, open a PR, merge, or deploy unless later evidence and explicit scope authorize it.
