# TASKS

## Current
- **T1 + T2 — Template foundation: IN_PROGRESS.** T1 family contract and T2 shared semantic presentation primitives are implemented; full quality verification is pending.

## Queue
1. **Current verification:** Complete GitHub Actions quality verification for the combined T1/T2 foundation. If green, close the foundation; if not, fix only the verified failure.
2. TODO: Build the first flagship template family as a complete vertical slice on the existing `PublicMenu` contract.
3. TODO: Establish visual-regression, accessibility, responsive, RTL, and performance gates for the flagship family.
4. TODO: Expand to genuinely different restaurant families: specialty cafe, bakery/dessert, fast casual, fine dining/hospitality, and small-menu concepts.
5. TODO: Migrate legacy theme keys to proven family implementations with controlled customization and rollback.
6. TODO: Stage production rollout, compare analytics/performance, and retire legacy renderers only after evidence.

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
- IMPLEMENTED / VERIFICATION PENDING: T1 template architecture contract.
- IMPLEMENTED / VERIFICATION PENDING: T2 shared semantic menu presentation primitives.

## Template Initiative Evidence
- VERIFIED: Existing theme keys are `editorial`, `dark-dining`, `coffee`, `heritage`, `fast-casual`, `gallery`, `immersive`, and `minimal`.
- VERIFIED: All current public menus and theme previews render through shared `PublicMenuView`.
- VERIFIED: Theme differences are primarily implemented through token/layout metadata and CSS selectors in `src/styles.css`.
- VERIFIED: `src/lib/menu/types.ts` provides rich bilingual restaurant/menu content needed by the proposed families.
- VERIFIED: `docs/template-system-strategy.md` records the audit, research, six-family strategy, quality requirements, migration approach, and acceptance criteria.
- VERIFIED: `src/components/menu/primitives.tsx` now provides reusable semantic media, price, badge, section, and product-card primitives without owning menu business rules.

## Current Task Scope
- Objective: complete the combined T1/T2 template foundation without changing current public rendering behavior.
- Changed: `src/lib/theme/types.ts`, `src/lib/theme/registry.ts`, `src/lib/theme/registry.test.ts`, `src/components/menu/primitives.tsx`, `src/components/menu/index.ts`, and continuity documentation.
- Acceptance: family metadata is type-safe and backward-compatible; shared primitives are reusable, semantic, responsive, RTL-compatible, safe for long content and missing images, and do not alter existing public-menu behavior.

## Verification Evidence
- VERIFIED: the repository quality workflow includes install, route generation, typecheck, tests, lint, and production build.
- IN_PROGRESS: quality verification for the combined T1/T2 foundation on `main`.
- UNKNOWN: production visual behavior until browser/manual validation is performed.
