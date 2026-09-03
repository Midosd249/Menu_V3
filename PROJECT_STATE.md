# PROJECT_STATE

## Identity
- Status: IN_PROGRESS
- Repository: `Midosd249/Menu_V3`
- Source of truth: `main`
- Product: Menu V3, Arabic-first bilingual multi-tenant digital-menu SaaS.
- Active plan: `PLAN.md` — Template Ecosystem Redesign.
- Previous roadmap archive: `PLAN_ARCHIVE_2026-09-03.md`.

## Current Position
- T1, T2, and T3 template milestones are DONE / VERIFIED.
- T3 delivered the first structurally distinct `contemporary-restaurant` family while preserving the legacy renderer.
- Current task: **T4 — Visual, accessibility, responsive, and performance quality gates.**

## Verified Stack
- React 19, TypeScript, TanStack Start/Router, Vite, Tailwind CSS, Better Auth, PostgreSQL/PGlite-ready data layer, Supabase integration, Vercel target, Node 24 CI.

## Completed / Protected
- Level 0: DONE / VERIFIED.
- Level 1: DONE / VERIFIED.
- Level 2: IMPLEMENTED / historical partial verification; do not rebuild.
- Level 3: DONE / VERIFIED.
- Team invitation lifecycle: DONE / VERIFIED.
- Durable roles and branch scope: DONE / VERIFIED.
- Client onboarding idempotency: DONE / VERIFIED.
- Subscription foundation and entitlement enforcement: DONE / VERIFIED.
- Repository agent contract: DONE / VERIFIED.
- T1 template architecture contract: DONE / VERIFIED.
- T2 shared semantic menu presentation primitives: DONE / VERIFIED.
- T3 flagship template: DONE / VERIFIED.

## T3 Evidence
- VERIFIED: quality run `33743105967` passed install, route generation, typecheck, tests, lint, and production build.
- VERIFIED: Vercel deployment `dpl_9esaw9UjgAz4NmM3BsDXGBhqz9Tx` for the T3 renderer commit is READY.
- VERIFIED: legacy `PublicMenuView` remains available for non-flagship families.

## Current Task — T4
- Objective: make browser-level quality checks reproducible before expanding the template ecosystem.
- Added `scripts/template-qa.mjs` using the existing Playwright dependency.
- Added `npm run qa:template`.
- Gate covers 390x844, 768x1024, and 1440x900; HTTP status, RTL/language, horizontal overflow, accessible button/link names, headings, runtime console/page errors, and reduced-motion emulation.
- The gate accepts a deployed/local preview URL via CLI or `TEMPLATE_QA_URL`.

## Verification
- VERIFIED: T3 GitHub quality gate passed.
- VERIFIED: T3 Vercel deployment READY.
- IN_PROGRESS: T4 browser gate implementation is committed; execution in a browser-capable environment is still required.
- UNKNOWN: deterministic screenshot baselines/pixel diffs.
- UNKNOWN: complete live-production visual behavior.
- BLOCKED only if browser binaries/runtime are unavailable; do not claim visual verification without execution evidence.

## Important Paths
- `AGENTS.md`
- `PROJECT_STATE.md`
- `PLAN.md`
- `TASKS.md`
- `SESSION_PROTOCOL.md`
- `docs/template-system-strategy.md`
- `src/lib/theme/types.ts`
- `src/lib/theme/registry.ts`
- `src/components/menu/primitives.tsx`
- `src/components/templates/contemporary-restaurant.tsx`
- `src/components/public-menu.tsx`
- `src/routes/m.$slug.tsx`
- `src/routes/themes/preview.tsx`
- `scripts/template-qa.mjs`
- `scripts/preview.mjs`
- `package.json`
- `.github/workflows/quality.yml`

## Known Issues / Risks
- UNKNOWN: exact production traffic mix by restaurant type.
- UNKNOWN: screenshot baseline history.
- VERIFIED: no database/schema/auth changes were introduced for T3/T4.
- VERIFIED: Vercel status can fail independently from GitHub CI due platform limits; this is not evidence of a code failure.

## Session Log
- 2026-09-03 — Audited repository continuity, current T3 commits, CI, and Vercel deployment evidence.
- 2026-09-03 — Confirmed T3 quality run `33743105967` passed and T3 deployment is READY.
- 2026-09-03 — Started T4 and added the reproducible Playwright browser quality gate plus `qa:template` script.

## Exact Next Task
- **T4 — Execute the browser quality gate against a real flagship preview, then harden only verified failures; do not start T5 until T4 is verified or explicitly blocked.**
