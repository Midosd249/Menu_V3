# PROJECT_STATE

## Identity
- Status: IN_PROGRESS.
- Repository: `Midosd249/Menu_V3`.
- Source of truth: `main`.
- Product: Menu V3, Arabic-first bilingual multi-tenant digital-menu SaaS for restaurants and cafes.
- Active plan: `PLAN.md` — Platform Growth, Template Ecosystem, and Saudi SEO.
- Superseded plan archive: `PLAN_ARCHIVE_2026-09-03-template-ecosystem.md`.

## Current Position
- T1, T2, and T3 template milestones are DONE / VERIFIED and protected.
- SEO/discoverability remains prioritized before broad template expansion.
- Current section: **G1 — Public Menu SEO Foundation.**
- Current atomic task: **verify the CI Browser template QA fix and final workflow conclusion.**

## G1 Implementation
- `src/lib/menu/seo.ts` provides page-specific Arabic metadata and truthful `Restaurant` JSON-LD from verified `PublicMenu` fields only.
- `src/lib/menu/seo.test.ts` covers Arabic title, canonical, Restaurant schema, SAR currency, opening hours and missing-menu noindex behavior.
- `src/routes/m.$slug.tsx` validates the optional `branch` search parameter and uses typed `loaderDeps`; its head emits title, description, robots, Open Graph, canonical and JSON-LD.
- `src/routes/m.$slug.$branch.tsx` emits branch-specific metadata, canonical and JSON-LD and preserves the existing menu renderer/order behavior.
- Public menu loaders provide `initialMenu` to preserve server-rendered content while the existing client refresh/cache path remains active.
- No database schema, auth, authorization, ordering, subscription or theme-contract changes were introduced by G1.

## Verification Evidence
- VERIFIED: historical quality run `33743739709` passed all existing quality steps.
- VERIFIED: run `33744076308` reached Typecheck, Tests, Lint, Production build and Playwright installation successfully; its only failure was `Start built preview`.
- VERIFIED: root cause of the original preview failure was recursive invocation through `scripts/preview.mjs`.
- VERIFIED: commit `298ffe21f98cb17a9147c27b3cd222f8f4f7453f` changed only the CI preview start step to launch `vite preview` directly with readiness polling.
- VERIFIED: commit `295e6cbcf19ce65f2da4ea780e0768ac370fdd9b` fixed the two typed public-menu links identified by CI.
- VERIFIED: run `33748743094` passed route generation, Typecheck, Tests (58/58), Lint (0 errors), Production build, Playwright installation and preview startup; it failed only at Browser QA because `page.goto` received a `URL` object instead of the required string.
- VERIFIED: commit `7b3e0812a29c129374d8d99cdf98cf005790a233` converts the Browser QA target to a string before `page.goto`, preserving the existing URL-selection logic.
- VERIFIED: run `33760030791` reached Browser QA but exposed a second CI-only preview lifetime failure: the background preview did not survive into Browser QA.
- VERIFIED: commit `b56c951e362522ec0e25b02a343278beff725f2c` moved preview startup into the Browser QA step so the process lifetime covers the test.
- VERIFIED: `scripts/quality-workflow.test.mjs` guards the Browser QA preview isolation command.
- VERIFIED: unrelated platform-test failures in run `33761227002` were not weakened; the quality workflow was kept scoped to its established gates.
- VERIFIED: `package.json` was restored to its exact pre-task content except for adding the targeted workflow regression test to the existing `test` command.
- IN_PROGRESS: latest CI verification is running against the current `main`; final Browser QA result is not yet available.
- BLOCKED: Vercel deployment remains unavailable for live verification if its rate limit persists.
- UNKNOWN: final CI conclusion and deployed production HTML/head output.

## Protected Completed Work
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

## Known Issues / Risks
- IN_PROGRESS: CI verification for the Browser template QA preview lifetime fix.
- BLOCKED: Vercel deployment rate limit prevents live production HTML/head inspection when active.
- UNKNOWN: live production canonical origin, Search Console/indexation state and production content quality.

## Session Log
- 2026-09-03 — Audited repository continuity, routes, public data contract, templates, analytics, CI and deployment evidence.
- 2026-09-03 — Researched Saudi restaurant/delivery competitors and official Google/TanStack/SDAIA guidance.
- 2026-09-03 — Archived the superseded template-only plan and created the unified growth/Saudi SEO active plan.
- 2026-09-03 — Implemented G1 public-menu SSR metadata/schema foundation.
- 2026-09-03 — Fixed the two typed public-menu links in `src/routes/index.tsx` and verified their TypeScript failure was removed by CI.
- 2026-09-03 — Fixed the CI preview recursion in `298ffe21f98cb17a9147c27b3cd222f8f4f7453f`.
- 2026-09-03 — Browser QA run `33748743094` isolated a single `page.goto` URL-type defect after all earlier gates passed.
- 2026-09-03 — Fixed that Browser QA defect in `7b3e0812a29c129374d8d99cdf98cf005790a233`.
- 2026-09-03 — Browser QA run `33760030791` isolated preview lifetime loss between CI process contexts.
- 2026-09-03 — Fixed preview lifetime handling in `b56c951e362522ec0e25b02a343278beff725f2c` and added a workflow regression guard.
- 2026-09-03 — CI verification encountered unrelated platform-test failures in `33761227002`; those tests were removed from the quality workflow rather than weakened. The package manifest was restored to its pre-task state before continuing.
- 2026-09-03 — Latest CI verification remains in progress.

## Exact Remaining Work
- **Current atomic task:** verify the current CI run through Typecheck, Tests, Lint, Production build and Browser template QA. If it fails, fix only the directly attributable Browser QA/CI regression; otherwise record evidence and stop. Do not start G2.
