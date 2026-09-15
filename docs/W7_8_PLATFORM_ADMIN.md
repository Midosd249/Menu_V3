# W7.8 Platform Admin

## Status
`IMPLEMENTATION_IN_PROGRESS` — implementation staged after W7.7 current-head verification.

## Scope
W7.8 reorganizes the existing `/admin` presentation into an operator-oriented grouped shell while preserving the existing route, local tab state, data sources, actions, and authorization boundaries.

### Implemented grouping
- Overview: existing `overview` tab.
- Customers: `tenants`, `clients`, `branches`.
- Commerce: `orders`, `subscriptions`, `requests`.
- Sales: `leads`, `projects`.
- Intelligence: `analytics`, `activity`.
- System: existing combined `system` view.

No new URL routes are introduced. Route splitting is explicitly deferred to W7.9.

## Presentation changes
- Added grouped Platform Admin navigation with explicit active semantics.
- Preserved all existing tab identifiers and click behavior.
- Replaced the flat overview metric strip with a compact operational snapshot using the existing `MetricRow` primitive.
- Reorganized the overview into operator workspaces instead of a single undifferentiated card wall.
- Reused `PageHeader`, `SectionHeader`, `MetricRow`, `LoadingState`, and `ErrorState` from the existing W7.2 internal design system.
- Added an explicit unavailable-capability boundary for Security, Platform Health, and Configuration as separate screens; no such destinations are created because the current Admin source does not provide them.
- Preserved real tables, filters, order actions, lead approval, tenant activation, subscription summary, analytics, activity, and system/security presentation.

## Data and permission boundaries
- `getPlatformDashboard()` remains the platform overview source.
- `getPlatformOrders()` remains the order source.
- Existing `updatePlatformTenantStatus`, `updatePlatformOrderStatus`, and `archivePlatformOrder` remain unchanged.
- Existing `getAdminDashboard`, `updateLead`, and `approveLead` remain unchanged.
- `requirePlatformAdmin` remains the server-side authorization contract.
- No new client-supplied tenant, role, identity, entitlement, or privilege is trusted.

## Data honesty
No fake Admin metrics, totals, health scores, activity, security events, charts, recommendations, or operator records were added. All displayed values remain derived from the existing platform/admin sources.

## Responsive/accessibility intent
- Arabic-first, RTL-native navigation.
- Group headings are semantic.
- Active controls expose `aria-current="page"`.
- Existing keyboard focus styling is preserved.
- Tables keep deliberate horizontal overflow inside their existing containers.
- Browser QA covers 390×844, 430×932, 768×1024, and 1280×800.

## Explicit non-goals
- No `/admin/*` route splitting.
- No backend/data-layer rewrite.
- No auth/RLS/permission changes.
- No database/Supabase changes.
- No subscription, AI, orders, public menu, or Studio business-logic changes.
- No dependency additions.
- No merge or deployment.
