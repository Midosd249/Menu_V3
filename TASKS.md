# TASKS

## Current
- **IN_PROGRESS:** Align application authorization with canonical durable `access_role` / `branch_scope` and preserve compatibility.
- Evidence target: `src/lib/auth/authorization.server.ts`, `src/lib/auth/permissions.ts`, `src/lib/menu/types.ts`, `src/lib/menu/team.ts`, `src/lib/menu/team-invitations.ts`, plus focused tests.

## Queue
- TODO: Harden client account lifecycle and tenant onboarding idempotency.
- TODO: Connect existing subscription-plan foundation to server-side entitlement checks.
- TODO: Establish service/project workflow foundations and observability.
- TODO: Execute Level 4 production/security gate.
- TODO: Re-verify historical authenticated/cache/editor E2E caveats.
- TODO: Later security-advisor hardening, realtime refresh, and tenant/branch-scoped order numbering.

## Completed
- DONE / VERIFIED: Level 0 Foundation & Audit.
- DONE / VERIFIED: Level 1 Theme Engine Hardening.
- IMPLEMENTED / VERIFIED PARTIALLY: Level 2 Menu Experience & Product System.
- DONE / VERIFIED: Level 3 Restaurant Operations / Ordering.
- DONE / VERIFIED: Team invitation lifecycle merged via PR #5, merge commit `161d955be4311a457d5b3573212fd8a1baa21489`.
- DONE / VERIFIED: Durable tenant-role/platform-authorization database foundation via migration `20260903008000_roles_permissions_foundation.sql`.
- DONE / VERIFIED: Subscription-plan database foundation is present on `main`.
