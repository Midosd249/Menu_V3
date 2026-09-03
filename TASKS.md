# TASKS

## Current
- **T3 — Flagship vertical template: IN_PROGRESS / verification pending.** Build the first genuinely structurally distinct `contemporary-restaurant` family using the existing `PublicMenu` contract.

## Queue
1. **T3 — Flagship vertical template:** IN_PROGRESS — verify the new family renderer on the public route and theme preview.
2. TODO: Establish visual-regression, accessibility, responsive, RTL, and performance gates for the flagship family.
3. TODO: Expand to genuinely different restaurant families: specialty cafe, bakery/dessert, fast casual, fine dining/hospitality, and small-menu concepts.
4. TODO: Migrate legacy theme keys to proven family implementations with controlled customization and rollback.
5. TODO: Stage production rollout, compare analytics/performance, and retire legacy renderers only after evidence.

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
- DONE / VERIFIED: T1 template architecture contract; GitHub Actions run `33742263927` passed install, route generation, typecheck, tests, lint, and production build.
- DONE / VERIFIED: T2 shared semantic menu presentation primitives; GitHub Actions run `33742271561` passed install, route generation, typecheck, tests, lint, and production build.

## Template Initiative Evidence
- VERIFIED: Existing theme keys are `editorial`, `dark-dining`, `coffee`, `heritage`, `fast-casual`, `gallery`, `immersive`, and `minimal`.
- VERIFIED: All current public menus and theme previews previously rendered through shared `PublicMenuView`.
- VERIFIED: Theme differences are primarily implemented through token/layout metadata and CSS selectors in `src/styles.css`.
- VERIFIED: `src/lib/menu/types.ts` provides rich bilingual restaurant/menu content needed by the proposed families.
- VERIFIED: `docs/template-system-strategy.md` records the audit, research, six-family strategy, quality requirements, migration approach, and acceptance criteria.
- VERIFIED: T1 introduced six type-safe `TemplateFamily` identifiers and deterministic `getThemeFamily()` without changing existing `ThemeKey` resolution.
- VERIFIED: T2 added `MenuMedia`, `MenuPrice`, `MenuBadge`, `MenuSection`, and `MenuProductCard` under `src/components/menu/primitives.tsx` and exported them through `src/components/menu/index.ts` without changing the legacy public renderer.
- VERIFIED: T3 now has a dedicated `contemporary-restaurant` renderer with its own responsive composition, product detail/modifier flow, cart/order flow, bilingual content, branch navigation, search, featured items, availability states, and opening-hours section.

## Current Task Scope
- Objective: verify the first structurally distinct flagship template family on the public and preview routes.
- Acceptance: real content; Arabic/English; mobile/desktop; RTL-compatible layout; long names; missing images; modifiers; availability; featured items; clear prices/actions; no regression to legacy theme rendering.
- Files: `src/components/templates/contemporary-restaurant.tsx`, `src/routes/m.$slug.tsx`, `src/routes/themes/preview.tsx`.

## Verification Evidence
- VERIFIED: T1 quality run `33742263927` completed successfully.
- VERIFIED: T2 quality run `33742271561` completed successfully.
- IN_PROGRESS: T3 Quality run `33743078780` is queued/running for the latest preview integration; final result not yet available.
- UNKNOWN: browser-level visual regression and production visual behavior until T3 quality gate and browser validation are complete.
