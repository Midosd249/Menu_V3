# PROJECT_STATE

## Identity
- Status: IN_PROGRESS
- Repository: `Midosd249/Menu_V3`
- Source of truth: `main`
- Current HEAD: `c3b0697df38cc594e9e2f3cfa6f860b5744972a8` before the current template commits; the repository advances through the current session commits.
- Product: Menu V3, an Arabic-first bilingual multi-tenant digital-menu SaaS.

## Current Position
- Status: IN_PROGRESS
- Previous Level 0–4C completed work remains protected and is not being reopened.
- Previous roadmap remains preserved as `PLAN_ARCHIVE_2026-09-03.md`.
- `PLAN.md` now contains `Template Ecosystem Redesign — Active Plan` as the active product-design initiative.
- The verified template-system bottleneck is structural: eight named themes share the same `PublicMenuView` renderer and rely primarily on CSS/token variation.
- The first template task is a type-safe family-level contract for the existing theme registry; it does not change public rendering behavior.

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
- Status: IN_PROGRESS
- Task: **Establish and test the family-level template contract for the existing theme registry without changing public rendering behavior.**
- Why selected: repository evidence shows the current renderer is shared and theme differences are largely CSS/token-driven; a family contract is the smallest reversible boundary that enables real structural templates.
- Scope: add six typed template-family identifiers, classify the eight existing themes, expose deterministic family lookup, and add regression tests. No data-model or public-route changes.

## Verification
- VERIFIED: existing `ThemeKey` values remain unchanged.
- VERIFIED: `PublicMenu` remains the canonical public-menu content contract.
- VERIFIED: current theme preview and published menu routes still resolve themes through the existing controller.
- VERIFIED: research findings were recorded in `docs/template-system-strategy.md` and `PLAN.md`.
- IN_PROGRESS: quality verification for the current family-contract changes.
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
- IN_PROGRESS: CI verification of the family-contract task.
- VERIFIED: current themes are not yet genuinely separate renderers; the new plan intentionally postpones structural renderer work until the family contract is proven.
- UNKNOWN: exact live traffic mix by restaurant type.
- UNKNOWN: current production visual-regression coverage.
- VERIFIED: historical entitlement UI error mapping, E2E caveats, Supabase security-advisor notices, realtime, order-numbering follow-up areas, and platform-schema ownership gaps remain outside this template task.

## Session Log
- 2026-09-03 — Audited current theme registry, public-menu renderer, theme controller, preview flow, menu data contract, package tooling, branches, and recent history.
- 2026-09-03 — Researched Toast, Square, GloriaFood, Radix, WAI-ARIA, web.dev, and an open-source React menu reference; documented transferable principles and tradeoffs.
- 2026-09-03 — Created `docs/template-system-strategy.md` with the evidence-based template ecosystem strategy.
- 2026-09-03 — Added typed `TemplateFamily` metadata and deterministic `getThemeFamily()` lookup to the existing theme registry.
- 2026-09-03 — Added `src/lib/theme/registry.test.ts` and included it in the repository test command.

## Exact Next Task
- **Complete the quality gate for the template-family contract. If green, mark T1 DONE and select the next unblocked task from the active template plan; if not green, fix only the verified failure.**
