# PROJECT_STATE

## Identity
- Status: IN_PROGRESS
- Repository: `Midosd249/Menu_V3`
- Source of truth: `main`
- Current HEAD after this session: `2e6310b85a23d87ba748aee5ac2f131d12425714`.
- Product: Menu V3, an Arabic-first bilingual multi-tenant digital-menu SaaS.

## Current Position
- Status: IN_PROGRESS
- Previous Level 0–4C completed work remains protected and is not being reopened.
- Previous roadmap remains preserved as `PLAN_ARCHIVE_2026-09-03.md`.
- `PLAN.md` contains `Template Ecosystem Redesign — Active Plan` as the active product-design initiative.
- The verified template-system bottleneck is structural: eight named themes share the same `PublicMenuView` renderer and rely primarily on CSS/token variation.
- The first template task has been implemented: a type-safe family-level contract for the existing theme registry, with no public rendering behavior change.

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

## Current Task
- Status: IN_PROGRESS / verification pending.
- Task: **Establish and test the family-level template contract for the existing theme registry without changing public rendering behavior.**
- Why selected: repository evidence shows the current renderer is shared and theme differences are largely CSS/token-driven; a family contract is the smallest reversible boundary that enables real structural templates.
- Scope implemented: six typed template-family identifiers, classification of all eight existing themes, deterministic `getThemeFamily()` lookup, and focused regression tests. No data-model or public-route changes.

## Verification
- VERIFIED: existing `ThemeKey` values remain unchanged.
- VERIFIED: all eight registered themes map to one of the six supported `TemplateFamily` identifiers.
- VERIFIED: `getThemeFamily()` resolves deterministically from the existing registry.
- VERIFIED: existing `resolveTheme()` behavior and public rendering entry points were not changed.
- VERIFIED: strategy/research documentation exists in `docs/template-system-strategy.md`.
- BLOCKED: full local/CI quality gate is not yet available for the latest session commit because no new GitHub Actions run is exposed for the direct `main` commit in the available integration.
- UNKNOWN: local test/lint/typecheck/build execution in this environment.
- UNKNOWN: production visual behavior and screenshot-regression coverage until browser validation is performed.

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
- `src/lib/theme/index.ts`
- `src/lib/theme/registry.test.ts`
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
- BLOCKED: full quality verification for T1 until an accessible CI run or local execution is available.
- VERIFIED: current themes are not yet genuinely separate renderers; the active plan deliberately postpones structural renderer work until T1 is verified.
- UNKNOWN: exact live traffic mix by restaurant type.
- UNKNOWN: current production visual-regression coverage.
- VERIFIED: historical entitlement UI error mapping, E2E caveats, Supabase security-advisor notices, realtime, order-numbering follow-up areas, and platform-schema ownership gaps remain outside this template task.

## Session Log
- 2026-09-03 — Audited current theme registry, public-menu renderer, theme controller, preview flow, menu data contract, package tooling, branches, and recent history.
- 2026-09-03 — Researched Toast, Square, GloriaFood, Radix, WAI-ARIA, web.dev, and an open-source React menu reference; documented transferable principles and tradeoffs.
- 2026-09-03 — Created `docs/template-system-strategy.md` with the evidence-based template ecosystem strategy.
- 2026-09-03 — Added typed `TemplateFamily` metadata and deterministic `getThemeFamily()` lookup to the existing theme registry.
- 2026-09-03 — Added `src/lib/theme/registry.test.ts` and included it in the repository test command.
- 2026-09-03 — Updated the active plan, task queue, and session protocol to make template work the current initiative while preserving prior completed work.

## Exact Next Task
- **Run and complete the T1 quality gate for the template-family contract. If green, mark T1 DONE and select the next unblocked task; if a failure appears, fix only that verified failure.**
