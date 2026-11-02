# Critical Data Flows

**Status:** F1 source-traced baseline — 2026-11-02  
**Baseline SHA:** `e5d7c89a73718f35e7accbae7933af36c366bbc1`

## Public menu read
1. Browser navigates to `/m/$slug` or `/m/$slug/$branch`.
2. Route validates search parameters (`lang`, `theme`, optional `table` token).
3. If a table token is present, `resolvePublicTableQrContext` validates it server-side and verifies tenant/branch match.
4. Route calls `getPublicMenu`; menu module loads active/published tenant and branch content and maps domain data.
5. Locale/theme selection is applied; route returns menu view data.
6. Branch route uses private/no-store cache headers when a resolved table label is present; ordinary public branch menu has short shared-cache headers.
Sources: `src/routes/m.$slug.tsx`, `m.$slug.$branch.tsx`, `src/lib/menu/public.ts`, `table-qr-public.ts`.

## Public order submission
1. Server function validates slug, optional branch slug, source, token, customer fields and item selections using Zod.
2. Server loads tenant/branch/product/variant/modifier/offer records; price and availability are based on DB values, not client price fields.
3. Anonymous session is resolved from server cookie and rate-limit keys include tenant/branch/session or IP-derived digest.
4. If table token exists, the server resolves the opaque token to trusted table/branch/tenant context.
5. The order fingerprint includes tenant, branch and table identity; idempotency/rate-limit mechanisms protect duplicate/abusive submissions.
6. Order creation and associated items are persisted; receipt access is later bound to the same active anonymous session.
Sources: `src/lib/menu/order-public.ts`, `table-qr.ts`, existing historical audit for atomic order creation and layered abuse controls.

**Qualification:** The complete transaction body and every DB constraint were not exhaustively restated here; see the implementation and tests as the source of truth.

## Authenticated mutation
1. Browser invokes a TanStack server function.
2. `authMiddleware` checks same-site request context and resolves verified identity.
3. Handler calls domain authorization to load active tenant membership and role.
4. Optional branch authorization checks branch scope/member assignment.
5. Handler verifies requested resources belong to the authorized tenant/branch before mutation.
Sources: `src/lib/auth/middleware.ts`, `verify.server.ts`, `authorization.server.ts`, `permissions.ts`.

## Table QR management and use
- Owner/admin table management is protected by session middleware, `settings.read/write` permission and active tenant/branch checks.
- QR tokens are generated as opaque values; persisted token material is represented by a hash.
- Public resolution validates token lifecycle and current table/branch/tenant activation/publishing.
Sources: `table-qr-management.ts`, `table-qr.ts`, `table-qr-primitives.ts`, `table-qr-public.ts`.

## Other important flows (inventory only)
- Registration/workspace provisioning: `customer-registration.ts`, `self-serve-provisioning.ts`.
- Subscription/entitlement: `subscriptions.ts`, `subscription-limits.ts`, `platform-subscriptions.ts`.
- Team invitation: `team-invitations.ts`.
- AI routing: `ai-capability-router.ts`, with policy context requiring authorization, entitlement, tenant, branch and pricing checks.

## Unknowns
- Full sequence for email verification/password reset and OAuth callbacks.
- Exact transaction/isolation behavior for every workspace provisioning and subscription mutation.
- Every server function's authorization coverage and rate limit.
