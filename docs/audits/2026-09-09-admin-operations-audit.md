# Menu V3 — Platform Admin Operations Audit

Date: 2026-09-09

## Classification
- Scope: Platform Owner `/admin` operations.
- Status: IMPLEMENTATION_IN_PROGRESS on `admin-operations-dashboard`.
- Source of truth remains `main` until release.

## VERIFIED current gaps
- The Platform Owner dashboard already exposed platform-wide counts, tenants, members, branches, leads, projects, service requests, subscriptions, analytics, activity, and security views.
- The platform dashboard counted orders but did not expose an operational order-management tab.
- Restaurant-owner order operations existed separately at `/studio/orders`.
- Platform administration had no direct order contact actions in its dashboard.
- There was no safe platform-admin operation to remove an order from operational lists without destroying historical order data.

## Design decision
Introduce a dedicated `الطلبات` tab in Platform Owner Center with:
- cross-tenant order search;
- status filtering;
- customer contact via phone, WhatsApp, and email when verified data exists;
- order detail and item/options inspection;
- platform-admin status updates with server-side authorization;
- reversible soft-archive instead of hard deletion;
- open-order badge and overview entry point;
- archived orders excluded from owner operational lists.

## Safety boundaries
- All platform order operations require the existing server-side `requirePlatformAdmin` check.
- No client-supplied tenant/role identity is trusted.
- No hard delete is introduced.
- Archived orders retain the order, item snapshots, and status history.
- Existing owner authorization in `src/lib/menu/orders.ts` remains intact.
- Existing Quick Add, Item Notes, Cart, ordering, auth, tenant isolation, and theme implementations are untouched.

## Acceptance criteria
1. `/admin` has a usable Orders workspace.
2. Search supports restaurant, customer, phone, and order number.
3. Status changes are server-authorized and recorded in `order_status_events`.
4. Contact actions appear only when the corresponding customer data exists.
5. Removing an order from the operational board archives it rather than deleting it.
6. Archived orders disappear from `/admin` and `/studio/orders` operational lists.
7. Automated regression coverage protects the new contracts.
8. CI must pass before any release decision.

## Remaining verification
- CI quality gate must complete.
- Production deployment must follow the release-only Vercel workflow.
- Real-device verification of the admin surface is still required after release when a physical device is available.
