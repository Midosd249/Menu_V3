# W7.8 Platform Admin

## Status
`DONE / VERIFIED` — 2026-09-15.

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

## Verification — 2026-09-15
- VERIFIED: final current-head quality run `34915257732` / run 1601 passed.
- VERIFIED: implementation HEAD `4a4c5963961715e1a7eaec67508255480aff4bb1` was the workflow head; the workflow checked out the PR merge ref for that exact head against `main` `9995848b747bdb238e45b7ed6fe6b551c6779fcc`.
- VERIFIED: route generation and generated route freshness passed.
- VERIFIED: typecheck passed.
- VERIFIED: repository suite passed with 266 tests.
- VERIFIED: W7.4, W7.5, W7.6, W7.7 and W7.8 focused contract tests passed.
- VERIFIED: lint passed; only the repository's existing warnings remained.
- VERIFIED: production build passed.
- VERIFIED: Playwright runtime and Chromium installation passed.
- VERIFIED: public all-theme browser QA passed.
- VERIFIED: Studio Shell/Home/Menu/Growth/Customers browser QA passed.
- VERIFIED: Platform Admin browser QA passed in the actual `/admin` application using the existing auth-disabled CI user semantics and configured platform-admin authorization contract.
- VERIFIED: browser matrix covered 390×844, 430×932, 768×1024, and 1280×800; RTL document structure, grouped navigation, active semantics, keyboard focus, tab reachability, and no horizontal overflow were checked.
- VERIFIED: all existing Admin tab identifiers remained reachable.
- VERIFIED: unavailable Security, Platform Health, and Configuration destinations were explicitly represented as unavailable rather than dead links.
- VERIFIED: performance baseline, diagnostics, and cleanup stages passed.

## Explicit non-goals
- No `/admin/*` route splitting.
- No backend/data-layer rewrite.
- No auth/RLS/permission changes.
- No database/Supabase changes.
- No subscription, AI, orders, public menu, or Studio business-logic changes.
- No dependency additions.
- No merge or deployment.
