# W13 — Trust, Security & Data Ownership

## Status

**Closed / verified pending the final CI gate for the latest security boundary changes.**

## Scope completed

- Public tenant payloads now use `PublicTenant`, which explicitly omits `ownerUserId`.
- Public tenant mapping strips `owner_user_id` and does not expose operational revision fields.
- Public menu code uses `mapPublicTenant`, while authenticated Studio code continues to use the full `Tenant` shape.
- Inactive `tenant_members` records no longer authorize Owner/Studio server functions.
- Studio member snapshots exclude inactive memberships.
- Authenticated Owner/Admin server functions retain the shared `authMiddleware` chokepoint.
- Platform administration remains fail-closed through `requirePlatformAdmin` and the database-backed platform-admin check.
- A security boundary regression suite now checks public/private data separation, auth middleware coverage, platform-admin fail-closed behavior, and client-reachable secret-name leakage.

## High-privilege / emergency client support

The correct production model is **not** a permanent universal bypass. The repository already has a platform-admin capability and a fail-closed `requirePlatformAdmin` guard. A platform administrator can be granted access through the existing platform-admin mechanism, but this repository does not infer or grant that privilege from a client-side flag, tenant ID, email supplied by the browser, or URL parameter.

For future holiday/emergency support, the recommended next capability is a **time-bound, tenant-scoped support session** with explicit audit logging. It should require platform-admin authentication, an explicit target tenant, a short expiry, reason capture, and an immutable audit record. A blanket `superuser=true` client switch would violate the security boundary and is intentionally not implemented.

## Security decisions

1. Public identity and private ownership identity are separate types.
2. Deactivated memberships fail closed.
3. Platform-admin access is server-side and database-backed.
4. No service-role or connector credentials are allowed in client-reachable source.
5. Tenant IDs supplied by clients are never trusted as authorization; server-side membership determines the tenant scope.

## Verification

The normal Quality Gate must pass TypeScript, tests, lint, production build, Playwright, all theme template QA, performance baseline, and preview shutdown before W13 is marked fully verified.
