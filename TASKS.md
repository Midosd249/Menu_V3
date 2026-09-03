# TASKS

## Current
- **No task IN_PROGRESS.** The prior authorization integration is DONE / VERIFIED.
- Final implementation commit: `46b5b42a56ba93f9715a511a6062f39a0f739ace`.
- Verification evidence: GitHub Actions quality run `33733296763` completed with `success` for the final implementation commit.

## Queue
- TODO / UNBLOCKED: **Harden client account lifecycle and tenant onboarding idempotency using the existing `src/routes/onboarding.tsx` and server-side tenant creation flow.**
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
- DONE / VERIFIED: Canonical application authorization integration for `access_role` / `branch_scope`, including focused regression coverage and the final staff-role UI compatibility fix at `46b5b42a56ba93f9715a511a6062f39a0f739ace`.
