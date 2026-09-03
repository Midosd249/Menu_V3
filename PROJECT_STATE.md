# PROJECT_STATE

## Identity
- Status: IN_PROGRESS
- Repository: `Midosd249/Menu_V3`
- Source of truth: `main`
- Product: Menu V3, an Arabic-first bilingual multi-tenant digital-menu SaaS.
- Active plan: `PLAN.md` — Template Ecosystem Redesign.
- Previous roadmap archive: `PLAN_ARCHIVE_2026-09-03.md`.

## Current Position
- Status: IN_PROGRESS
- Previous Level 0–4C completed work remains protected and is not being reopened.
- The verified template-system bottleneck is structural: eight named themes share the same `PublicMenuView` renderer and rely primarily on CSS/token variation.
- T1 and T2 template foundations are now DONE / VERIFIED.
- The next implementation is T3: a complete flagship template family.

## Verified Stack
- React 19, TypeScript, TanStack Start/Router, Vite, Tailwind CSS, Better Auth, PostgreSQL/PGlite-ready data layer, Supabase integration, Vercel target, Node 24 CI.

## Completed / Protected
- Level 0: DONE / VERIFIED.
- Level 1: DONE / VERIFIED.
- Level 2: IMPLEMENTED / historical partial verification; do not rebuild.
- Level 3: DONE / VERIFIED in repository continuity.
- Team invitation lifecycle: DONE / VERIFIED.
- Durable roles and branch scope: DONE / VERIFIED.
- Client onboarding idempotency: DONE / VERIFIED for owner uniqueness and concurrent-request reconciliation.
- Subscription-plan foundation: DONE / VERIFIED.
- Subscription entitlement enforcement: DONE / VERIFIED for default provisioning/backfill and branch/product/active-team-member limits.
- Repository agent contract: DONE / VERIFIED.
- Platform-admin authorization consistency: implementation completed; historical final verification remains deferred and preserved.
- T1 template architecture contract: DONE / VERIFIED.
- T2 shared semantic menu presentation primitives: DONE / VERIFIED.

## Current Task
- Status: TODO / UNBLOCKED.
- Task: **T3 — Build the first structurally distinct flagship template family using the existing `PublicMenu` contract.**
- Why selected: T1 establishes the family boundary and T2 supplies reusable semantic presentation primitives; T3 is now the smallest task that delivers visible product value while keeping the legacy renderer intact.
- Scope: create one family renderer, integrate it through an additive boundary, preserve legacy `ThemeKey` resolution, and support real bilingual menu data without changing business rules or database schema.

## Verification
- VERIFIED: T1 quality run `33742263927` passed install, route generation, typecheck, tests, lint, and production build.
- VERIFIED: T2 quality run `33742271561` passed install, route generation, typecheck, tests, lint, and production build.
- VERIFIED: existing eight `ThemeKey` values remain unchanged.
- VERIFIED: `getThemeFamily()` is deterministic and all eight themes map to supported families.
- VERIFIED: T2 primitives provide semantic media, price, badge, section, and product-card building blocks without owning business logic.
- UNKNOWN: production visual behavior and screenshot-regression coverage.

## Important Paths
- `AGENTS.md`
- `PROJECT_STATE.md`
- `PLAN.md`
- `TASKS.md`
- `SESSION_PROTOCOL.md`
- `PLAN_ARCHIVE_2026-09-03.md`
- `docs/template-system-strategy.md`
- `src/lib/theme/types.ts`
- `src/lib/theme/registry.ts`
- `src/lib/theme/registry.test.ts`
- `src/components/menu/primitives.tsx`
- `src/components/menu/index.ts`
- `src/components/public-menu.tsx`
- `src/components/menu-theme-controller.tsx`
- `src/routes/themes.tsx`
- `src/routes/themes/preview.tsx`
- `src/routes/m.$slug.tsx`
- `src/lib/menu/types.ts`
- `src/styles.css`
- `.github/workflows/quality.yml`
- `package.json`

## Known Issues / Risks
- UNKNOWN: exact live traffic mix by restaurant type.
- UNKNOWN: current production screenshot-regression coverage.
- VERIFIED: legacy public rendering remains active; no migration has started.
- VERIFIED: T3 must preserve canonical menu data and existing business rules.

## Session Log
- 2026-09-03 — Audited the existing theme registry, public renderer, preview flow, menu data contract, package tooling, and repository history.
- 2026-09-03 — Researched Toast, Square, GloriaFood, Radix, WAI-ARIA, web.dev, and an open-source React menu reference; recorded transferable principles and tradeoffs.
- 2026-09-03 — Created `docs/template-system-strategy.md`.
- 2026-09-03 — Implemented T1 type-safe `TemplateFamily` metadata and deterministic family lookup.
- 2026-09-03 — Implemented T2 shared semantic presentation primitives in `src/components/menu/primitives.tsx` and exports in `src/components/menu/index.ts`.
- 2026-09-03 — GitHub Actions runs `33742263927` and `33742271561` passed install, route generation, typecheck, tests, lint, and production build.
- 2026-09-03 — Updated `PLAN.md`, `TASKS.md`, and this state to close T1/T2 and select T3 as the next unblocked task.

## Exact Next Task
- **T3 — Build the first structurally distinct flagship template family using the existing `PublicMenu` contract.**
