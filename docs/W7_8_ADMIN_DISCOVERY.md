# W7.8 Platform Admin Discovery

## Status
`VERIFIED DISCOVERY COMPLETE` — 2026-09-15.

## Scope boundary
W7.8 is presentation and information architecture work inside the existing `/admin` route. No route splitting, backend rewrite, data-hook replacement, authorization change, schema work, dependency addition, merge, or deployment is in scope. Route architecture is explicitly deferred to W7.9.

## Current Admin route
- Route: `/admin`.
- Source: `src/routes/admin.tsx`.
- State model: local React `useState<Tab>` with the existing tab identifiers.
- Current tab identifiers: `overview`, `tenants`, `orders`, `clients`, `branches`, `leads`, `projects`, `requests`, `subscriptions`, `analytics`, `activity`, `system`.
- Navigation is presentation-only local tab switching; no child URL is created for these tabs.
- Existing user gate redirects unauthenticated users to `/login?redirect=/admin`.
- Existing server functions enforce Platform Admin authorization.

## Permission boundary
`VERIFIED`
- `src/lib/auth/platform-admin.server.ts` exposes `requirePlatformAdmin(userId)`.
- `requirePlatformAdmin` checks the durable `menu_v3.is_platform_admin(userId)` result first, then the existing configured platform-admin fallback.
- `src/lib/menu/platform.ts` calls the authorization contract before `getPlatformDashboard`, `getPlatformOrders`, and Platform Admin mutations.
- `src/lib/menu/admin.ts` provides the existing lead dashboard/update path used by Admin.
- W7.8 must not change these contracts.

## Current data dependencies
`VERIFIED`
- Platform dashboard source: `getPlatformDashboard()` from `src/lib/menu/platform.ts`.
- Platform order source: `getPlatformOrders()` plus existing `updatePlatformOrderStatus()` and `archivePlatformOrder()`.
- Lead source/actions: `getAdminDashboard()`, `updateLead()`, and `approveLead()`.
- Existing platform data includes tenants/restaurants, branches, tenant members/accounts, projects, service requests, order activity, analytics aggregates, subscription aggregates, and real counts.
- No new data source is justified by W7.8.

## Current views and actions

| Current tab | Real capability | Existing data/action | Target group |
|---|---|---|---|
| `overview` | platform overview | existing dashboard + leads | Overview |
| `tenants` | restaurants | tenants + `updatePlatformTenantStatus` + public menu link | Customers |
| `orders` | platform orders | orders + status/archive actions | Commerce |
| `clients` | tenant members/accounts | dashboard members | Customers |
| `branches` | branches | dashboard branches | Customers |
| `leads` | lead/approval workspace | lead dashboard + update/approve | Sales |
| `projects` | website projects | dashboard projects | Sales |
| `requests` | service requests | dashboard service requests | Commerce |
| `subscriptions` | subscription summary | active/trial counts + plan distribution | Commerce |
| `analytics` | platform analytics | real menu/order aggregates | Intelligence |
| `activity` | order activity | real order status events | Intelligence |
| `system` | combined system/security presentation | existing security assertions + real operational indicators | System |

## Current presentation issues
`VERIFIED / PROPOSED`
- Current navigation is a flat 12-item list and does not communicate operator workspaces.
- Overview duplicates the same data in a dense metric strip plus a large card wall.
- Active tab semantics are visual only; grouped navigation should add accessible `aria-current="page"` without changing state behavior.
- Mobile currently receives the full flat list in a single column; grouped sections are clearer and reduce scan cost.
- Existing loading/error behavior is generic and should be presented through the internal state primitives where safe.

## Target grouping
`PROPOSED, constrained to VERIFIED capabilities`

### Platform Admin
- Overview
- Customers: Restaurants, Clients, Branches
- Commerce: Orders, Subscriptions, Service Requests
- Sales: Leads, Projects
- Intelligence: Analytics, Activity
- System: existing combined System/Security view only

No separate Security, Platform Health, or Configuration destinations are created because the current route does not expose separate real capabilities for them.

## Operator jobs-to-be-done
- Understand the current platform state without entering Restaurant Studio.
- Move from platform-level attention to the relevant operational workspace quickly.
- Review and act on real restaurant, order, lead, project, service, subscription, analytics, activity, and system information.
- Distinguish available data from unavailable capability rather than seeing dead navigation.

## State behavior
`VERIFIED`
- Initial dashboard load is asynchronous.
- Orders have a dedicated loading state.
- Empty data states already exist in each current view.
- Server failures return an `unavailable` result and are surfaced in the current error path.
- Platform authorization failures return a `forbidden` result from the existing server contract.

`PROPOSED`
- W7.8 presentation will expose loading/error/permission-denied states more explicitly without changing the underlying data contract.

## Accessibility / responsive requirements
- Arabic-first and RTL-native.
- Active tab uses `aria-current="page"`.
- Group headings are semantic and visible.
- Navigation controls remain keyboard reachable with visible focus.
- Mixed Arabic/English values remain directionally readable.
- Tables retain deliberate horizontal overflow inside accessible regions.
- 390×844, 430×932, 768×1024, and 1280×800 are required browser viewports.

## Data honesty boundary
`VERIFIED`
- Existing metrics are backed by `getPlatformDashboard()`.
- No fake tenants, branches, clients, orders, revenue, subscriptions, leads, projects, requests, analytics, activity, security events, health scores, recommendations, or charts may be added.
- Existing system/security text is presentation of current verified security contracts, not a new monitoring system.

## W7.8 non-goals
- No `/admin/*` route splitting.
- No data-hook rewrite.
- No backend or authorization changes.
- No database/Supabase/RLS changes.
- No new security/health/configuration features.
- No dashboard/charting dependency.
- No Admin framework.
- No merge/deployment.
