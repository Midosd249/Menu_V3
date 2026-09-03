# TASKS

## Current
- **No feature task IN_PROGRESS.** Subscription entitlement enforcement is DONE / VERIFIED for its defined atomic scope.
- Current repository HEAD is the subscription entitlement implementation plus continuity documentation.
- This session's atomic task: connect the existing subscription-plan foundation to server-side entitlement checks without changing the existing plan data model. DONE / VERIFIED.

## Queue
- TODO / UNBLOCKED: **Establish service/project workflow foundations and observability.**
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
- DONE / VERIFIED: Repository agent contract upgraded in root `AGENTS.md`.
- DONE / VERIFIED: Client onboarding idempotency boundary: unique tenant ownership per `owner_user_id` plus concurrent onboarding conflict reconciliation through trusted server-side membership lookup.
- DONE / VERIFIED: Level 4C subscription entitlement enforcement: default free subscription provisioning/backfill plus server-side database enforcement for branch, product, and active team-member limits, including subscription-status gating.
