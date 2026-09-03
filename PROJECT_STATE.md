# PROJECT_STATE

## Identity
- Status: IN_PROGRESS
- Repository: `Midosd249/Menu_V3`
- Source of truth: `main`
- Current HEAD after this session: `43232c62e778a9fd1c9aa646b94acfec3cae3f5b`.
- Product: Menu V3, an Arabic-first bilingual multi-tenant digital-menu SaaS.

## Current Position
- Status: IN_PROGRESS
- Previous Level 0–4C completed work remains protected and is not being reopened.
- Previous roadmap remains preserved as `PLAN_ARCHIVE_2026-09-03.md`.
- `PLAN.md` contains `Template Ecosystem Redesign — Active Plan` as the active product-design initiative.
- The verified template-system bottleneck is structural: eight named themes share the same `PublicMenuView` renderer and rely primarily on CSS/token variation.
- T1 family-level contract is implemented.
- T2 shared semantic presentation primitives are implemented as a reusable foundation; public rendering has not yet been migrated to them.

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
- T1 template architecture contract: IMPLEMENTED / verification pending.
- T2 shared semantic menu presentation primitives: IMPLEMENTED / verification pending.

## Current Task
- Status: IN_PROGRESS / verification pending.
- Task: **Complete T1 + T2 template foundation verification as one combined foundation task.**
- Why selected: T1 establishes the family boundary and T2 provides reusable semantic presentation primitives without changing the current public renderer. Together they create the smallest reversible foundation for structurally distinct templates.
- Scope implemented: six typed template families, classification of all eight themes, deterministic family lookup, and reusable `MenuMedia`, `MenuPrice`, `MenuBadge`, `MenuSection`, and `MenuProductCard` primitives. No database, route, authorization, ordering, or public-menu behavior changes.

## Verification
- VERIFIED: existing `ThemeKey` values remain unchanged.
- VERIFIED: all eight registered themes map to one of the six supported `TemplateFamily` identifiers.
- VERIFIED: `getThemeFamily()` resolves deterministically from the existing registry.
- VERIFIED: shared primitives use semantic HTML, responsive layout classes, long-content-safe wrapping, missing-image fallbacks, and RTL-compatible inherited direction.
- VERIFIED: `MenuMedia` defaults to lazy loading and supports eager loading for critical media.
- IN_PROGRESS: GitHub Actions quality verification for the combined T1/T2 foundation.
- UNKNOWN: production visual behavior and screenshot-regression coverage until browser validation is performed.
- UNKNOWN: local test/lint/typecheck/build execution in the current environment.

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
- IN_PROGRESS: full CI verification of the combined T1/T2 foundation.
- VERIFIED: current public menus still use the legacy shared renderer; T2 primitives have not replaced it yet.
- UNKNOWN: exact live traffic mix by restaurant type.
- UNKNOWN: current production visual-regression coverage.
- VERIFIED: historical entitlement UI error mapping, E2E caveats, Supabase security-advisor notices, realtime, order-numbering follow-up areas, and platform-schema ownership gaps remain outside this template initiative.

## Session Log
- 2026-09-03 — Audited current theme registry, public-menu renderer, theme controller, preview flow, menu data contract, package tooling, branches, and recent history.
- 2026-09-03 — Researched Toast, Square, GloriaFood, Radix, WAI-ARIA, web.dev, and an open-source React menu reference; documented principles and tradeoffs.
- 2026-09-03 — Created `docs/template-system-strategy.md` with the evidence-based template ecosystem strategy.
- 2026-09-03 — Added typed `TemplateFamily` metadata and deterministic `getThemeFamily()` lookup to the existing theme registry.
- 2026-09-03 — Added `src/lib/theme/registry.test.ts` and included it in the repository test command.
- 2026-09-03 — Added reusable semantic menu presentation primitives in `src/components/menu/primitives.tsx` and exported them through `src/components/menu/index.ts` without changing the existing public renderer.
- 2026-09-03 — Updated the active task queue to treat T1 + T2 as the current combined template-foundation execution scope.

## Exact Next Task
- **Complete GitHub Actions verification for the combined T1/T2 template foundation. If green, mark the foundation DONE and select the flagship vertical template task; if a failure appears, fix only the verified failure.**
