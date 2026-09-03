# TASKS

## Current
- **T1 — Template architecture contract: IN_PROGRESS.** Add a type-safe family boundary to the existing theme registry without changing public rendering behavior.

## Queue
1. **T1 verification:** Run the repository quality gate for the family contract. If green, close T1; if not green, fix only the verified failure.
2. TODO / UNBLOCKED after T1: Extract shared semantic public-menu presentation primitives while preserving current behavior.
3. TODO: Build the first flagship template family as a complete vertical slice on the existing `PublicMenu` contract.
4. TODO: Establish visual-regression, accessibility, responsive, RTL, and performance gates for the flagship family.
5. TODO: Expand to genuinely different restaurant families: specialty cafe, bakery/dessert, fast casual, fine dining/hospitality, and small-menu concepts.
6. TODO: Migrate legacy theme keys to proven family implementations with controlled customization and rollback.
7. TODO: Stage production rollout, compare analytics/performance, and retire legacy renderers only after evidence.

## Completed / Protected
- DONE / VERIFIED: Level 0 Foundation & Audit.
- DONE / VERIFIED: Level 1 Theme Engine Hardening.
- IMPLEMENTED / VERIFIED PARTIALLY: Level 2 Menu Experience & Product System.
- DONE / VERIFIED: Level 3 Restaurant Operations / Ordering.
- DONE / VERIFIED: Team invitation lifecycle via PR #5, merge `161d955be4311a457d5b3573212fd8a1baa21489`.
- DONE / VERIFIED: Durable tenant-role/platform-authorization database foundation.
- DONE / VERIFIED: Subscription-plan database foundation.
- DONE / VERIFIED: Canonical application authorization integration for `access_role` / `branch_scope`.
- DONE / VERIFIED: Repository agent contract in root `AGENTS.md`.
- DONE / VERIFIED: Client onboarding idempotency boundary.
- DONE / VERIFIED: Level 4C subscription entitlement enforcement for default subscription provisioning/backfill and branch/product/active-team-member limits.

## Template Initiative Evidence
- VERIFIED: Existing theme keys are `editorial`, `dark-dining`, `coffee`, `heritage`, `fast-casual`, `gallery`, `immersive`, and `minimal`.
- VERIFIED: All current public menus and theme previews render through shared `PublicMenuView`.
- VERIFIED: Theme differences are primarily implemented through token/layout metadata and CSS selectors in `src/styles.css`.
- VERIFIED: `src/lib/menu/types.ts` already provides rich bilingual restaurant/menu content needed by the proposed families.
- VERIFIED: `docs/template-system-strategy.md` records the audit, research, six-family strategy, quality requirements, migration approach, and acceptance criteria.

## Current Task Scope
- Objective: establish the family-level template contract without changing the current public renderer.
- Changed: `src/lib/theme/types.ts`, `src/lib/theme/registry.ts`, `src/lib/theme/registry.test.ts`, `package.json`, and continuity documentation.
- Acceptance: six type-safe family identifiers exist; all eight themes map to a supported family; `getThemeFamily()` is deterministic; legacy theme resolution remains unchanged.

## Verification Evidence
- VERIFIED: the current theme registry and public rendering contracts remain structurally compatible.
- IN_PROGRESS: quality verification for T1 on the resulting `main` state.
- UNKNOWN: production visual behavior until browser/manual validation is performed.
