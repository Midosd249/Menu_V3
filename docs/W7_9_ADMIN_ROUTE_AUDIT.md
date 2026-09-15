# W7.9 Platform Admin Route Audit

## Status
`VERIFIED / FINAL` — 2026-09-15.

## Scope
W7.9 is progressive Platform Admin route architecture only. The current `/admin` implementation began as a single route with local `Tab` state. The existing business/data/auth contracts remain the source of truth. No backend, schema, RLS, authentication, authorization, subscription, AI, order, public-menu, Studio business-logic, dependency, Vercel, merge, or deployment change is authorized.

## Current route model
- `src/routes/admin.tsx` remains the authorized Platform Admin shell and Overview route.
- `src/routes/admin/$workspace.tsx` is the real child-route adapter for verified Admin workspaces.
- Existing workspace content remains implemented by `PlatformAdminPage`; the child route supplies `initialTab` rather than duplicating business logic.
- Existing tab identifiers remain: `overview`, `tenants`, `orders`, `clients`, `branches`, `leads`, `projects`, `requests`, `subscriptions`, `analytics`, `activity`, `system`.
- `src/routes/admin/onboarding.tsx` remains an existing specialized child route and is unaffected by the workspace adapter.
- `src/routeTree.gen.ts` is generator output and was regenerated/verified by CI; it was not hand-edited.

## Authorization
`VERIFIED`
- Existing Platform Admin authorization remains the protected boundary through `requirePlatformAdmin` / `assertPlatformAdmin`.
- The child route validates the workspace key and redirects unknown keys to `/admin`; it does not grant access.
- Browser QA uses a temporary CI-only PostgreSQL fixture that seeds `dev-user` into `menu_v3.platform_admins` and exercises the real authorization path. The fixture is runner-local and does not modify production schema or migration files.

## Route mapping audit

| Current Tab | Existing Source | Existing User Job | Existing Permission | Existing Data | Proposed Route | Migration Type | Legacy Compatibility | Browser Test | Risk | Notes |
|---|---|---|---|---|---|---|---|---|---|---|
| `overview` | `src/routes/admin.tsx` / Overview | understand platform state | Platform Admin | `getPlatformDashboard`, `getAdminDashboard` | `/admin` | DIRECT_ROUTE_EXTRACTION | `/admin?tab=overview` → `/admin` | W7.9 Admin route browser | Low | Root route remains Overview. |
| `tenants` | Tenants | review/manage restaurants | Platform Admin | platform dashboard + tenant status action | `/admin/restaurants` | DIRECT_ROUTE_EXTRACTION | `/admin?tab=tenants` → `/admin/restaurants` | W7.9 Admin route browser | Medium | Technical tenant semantics remain in data; route uses the verified W7.8 operator term. |
| `orders` | Orders / OrderDetail | operate platform orders | Platform Admin | `getPlatformOrders`, order mutations | `/admin/orders` | DIRECT_ROUTE_EXTRACTION | `/admin?tab=orders` → `/admin/orders` | W7.9 Admin route browser | Medium | Existing order actions unchanged. |
| `clients` | Clients | review tenant members/accounts | Platform Admin | platform members | `/admin/clients` | DIRECT_ROUTE_EXTRACTION | `/admin?tab=clients` → `/admin/clients` | W7.9 Admin route browser | Low | No new client behavior. |
| `branches` | Branches | review branches | Platform Admin | platform branches | `/admin/branches` | DIRECT_ROUTE_EXTRACTION | `/admin?tab=branches` → `/admin/branches` | W7.9 Admin route browser | Low | No branch mutation introduced. |
| `leads` | Leads | review/approve leads | Platform Admin | `getAdminDashboard`, `updateLead`, `approveLead` | `/admin/leads` | DIRECT_ROUTE_EXTRACTION | `/admin?tab=leads` → `/admin/leads` | W7.9 Admin route browser | Medium | Existing approval and registration-link actions remain intact. |
| `projects` | Projects | review website projects | Platform Admin | platform projects | `/admin/projects` | DIRECT_ROUTE_EXTRACTION | `/admin?tab=projects` → `/admin/projects` | W7.9 Admin route browser | Low | Read-only presentation preserved. |
| `requests` | Requests | review service requests | Platform Admin | platform service requests | `/admin/service-requests` | DIRECT_ROUTE_EXTRACTION | `/admin?tab=requests` → `/admin/service-requests` | W7.9 Admin route browser | Low | Route name reflects the verified service-request meaning. |
| `subscriptions` | Subscriptions | review subscription state | Platform Admin | existing platform subscription aggregates | `/admin/subscriptions` | DIRECT_ROUTE_EXTRACTION | `/admin?tab=subscriptions` → `/admin/subscriptions` | W7.9 Admin route browser | Low | No entitlement/business-rule change. |
| `analytics` | Analytics | review platform analytics | Platform Admin | platform analytics aggregates | `/admin/analytics` | DIRECT_ROUTE_EXTRACTION | `/admin?tab=analytics` → `/admin/analytics` | W7.9 Admin route browser | Low | Existing aggregates only; no new charts. |
| `activity` | ActivityView | review platform activity | Platform Admin | platform activity | `/admin/activity` | DIRECT_ROUTE_EXTRACTION | `/admin?tab=activity` → `/admin/activity` | W7.9 Admin route browser | Low | Existing activity presentation preserved. |
| `system` | SystemView | inspect existing system/security assertions | Platform Admin | existing platform indicators | `/admin/system` | DIRECT_ROUTE_EXTRACTION | `/admin?tab=system` → `/admin/system` | W7.9 Admin route browser | Medium | Remains one combined System/Security view; no new security/health/configuration routes. |

## Final architecture decision
`VERIFIED`

The progressive extraction uses the repository's existing TanStack Router file-route hierarchy. `/admin` remains the authorized parent shell and Overview. `/admin/$workspace` is a whitelisted routing adapter that resolves a verified workspace to the existing `PlatformAdminPage` with the corresponding `initialTab`. This avoids duplicating Admin business/data logic while providing direct URLs, refresh persistence, and browser history behavior.

Existing selection behavior remains compatible: `selectTab(next)` continues to call `setTab(next)` and then performs additive URL synchronization with `navigate({ to: ADMIN_ROUTES[next] })`. The local state contract is therefore preserved while the URL becomes the durable navigation location.

## Legacy compatibility
`VERIFIED`
- Known `tab` values normalize through the existing `/admin` `beforeLoad` redirect.
- `overview` normalizes to `/admin`.
- `tenants`, `clients`, `branches`, `orders`, `subscriptions`, `requests`, `leads`, `projects`, `analytics`, `activity`, and `system` normalize to their mapped child routes.
- `tab` is removed after normalization and unrelated query parameters are preserved through the router search object.
- Unknown tab values fall back to `/admin` with `replace: true`; no loop is introduced.
- The final browser test verifies the preserved unrelated parameter using the actual TanStack Router serialization (`keep=%221%22` / parsed value `"1"`). This is an encoding detail of the existing router serialization, not data loss.

## Deferred / unavailable routes
`VERIFIED`
- No `/admin/restaurants/:id` or `/admin/clients/:id` detail route exists or is justified by current source.
- No Security, Platform Health, or Configuration route exists because W7.8 found no independent real capabilities for them.
- `/admin/onboarding` remains an existing specialized route outside the workspace mapping.

## Final browser-QA correction
`VERIFIED`
- The original Platform Admin browser blocker was `AUTH_DISABLED_FIXTURE_GAP`: the auth-disabled local environment lacked the `menu_v3.is_platform_admin` schema/context required to reach real authorized Admin state.
- CI now creates an isolated PostgreSQL service, applies only the compatible existing migrations needed by the Admin runtime, creates the Supabase-compatible `anon` and `authenticated` roles when absent, and seeds `dev-user` in `menu_v3.platform_admins`.
- After the fixture correction, the only remaining failure was a test serialization expectation: `URLSearchParams.get("keep")` returned `"1"` because the application URL intentionally serialized the query value as `%221%22`. The assertion was corrected to the actual serialized contract: `expect(search.get("keep")).toBe("\"1\"")`.
- This correction is test-only. Production route behavior was not changed.

## Evidence
- `VERIFIED`: final implementation HEAD `db9e2f6a816d6e1d10fc7e37bfaad4c7004a40f0`.
- `VERIFIED`: final quality run `34925141809` / run 1638 completed successfully.
- `VERIFIED`: all workflow stages, including Platform Admin browser QA, completed successfully.
- `VERIFIED`: final browser QA reached the real authorized Platform Admin state using the CI-only PostgreSQL fixture.
- `VERIFIED`: no fake Admin data, metrics, charts, health scores, security events, recommendations, or operator sample records were introduced.
- `VERIFIED`: no production database/schema, Supabase, RLS, auth, permissions, subscriptions, AI, orders, public menu, Studio business logic, dependencies, Vercel, merge, or deployment changed.
- `UNKNOWN`: physical real-device QA remains release-stage evidence only.

## Evidence labels
- `VERIFIED`: route tree, route tests, browser QA, authorization contract preservation, and final CI are green at the final HEAD.
- `INFERRED`: `tenants → restaurants` and `requests → service-requests` remain safe user-facing route names because the W7.8 IA and current data semantics support those labels.
- `PROPOSED`: further decomposition of `PlatformAdminPage` into independently owned modules; intentionally deferred beyond W7.9.
- `UNKNOWN`: physical real-device behavior outside the CI browser matrix.
- `BLOCKED`: none for W7.9 repository verification.
