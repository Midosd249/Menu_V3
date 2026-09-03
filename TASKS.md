# TASKS

## Current
- **No feature task IN_PROGRESS.** The prior authorization integration is DONE / VERIFIED.
- Current repository HEAD is documentation-only agent/continuity work; application implementation remains verified at `46b5b42a56ba93f9715a511a6062f39a0f739ace`.
- This session's atomic task: upgrade the root `AGENTS.md` operating contract. DONE / VERIFIED; no application code changed.

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
- DONE / VERIFIED: Repository agent contract upgraded in root `AGENTS.md`; commit `c3a6e612f98a6f64b997ccd20318bca53aee218b` contains the documentation-only change.