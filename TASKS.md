# TASKS

## Current
- **IN_PROGRESS:** Align application authorization with canonical durable `access_role` / `branch_scope` and preserve compatibility.
- Implementation commits: `cd1eef169450351d3f32f3e18c19aff5178c731d`, `e66d3baa9391eb6266ea1827bfef53409d0f8e38`, `a01001402b2f4b83f6f8a10668036c5cf18ecbbc`, `3237a39d8cedbb7fe8101903e8bfc43a1b830a2c`, `0a4530caaf7b83e2be833a073769228d6e876728`, `19a6c3721244cdde0ff9e8ad514704ce9bcec555`.
- Verification: CI quality run `33733157069` is pending/in progress; no DONE claim yet.

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
- DONE / VERIFIED: Team invitation lifecycle via PR #5, merge `161d955be4311a457d5b3573212fd8a1baa21489`.
- DONE / VERIFIED: Durable tenant-role/platform-authorization database foundation.
- DONE / VERIFIED: Subscription-plan database foundation present on `main`.
