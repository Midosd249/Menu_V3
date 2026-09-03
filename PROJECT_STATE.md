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
- Current atomic task: **fix and verify the CI Browser template QA failure caused by missing PGlite runtime files in the Vercel function root.**

## G1 Implementation
- `src/lib/menu/seo.ts` provides page-specific Arabic metadata and truthful `Restaurant` JSON-LD from verified `PublicMenu` fields only.
- `src/lib/menu/seo.test.ts` covers Arabic title, canonical, Restaurant schema, SAR currency, opening hours and missing-menu noindex behavior.
- `src/routes/m.$slug.tsx` validates the optional `branch` search parameter and uses typed `loaderDeps`; its head emits title, description, robots, Open Graph, canonical and JSON-LD.
- `src/routes/m.$slug.$branch.tsx` emits branch-specific metadata, canonical and JSON-LD and preserves the existing menu renderer/order behavior.
- Public menu loaders provide `initialMenu` to preserve server-rendered content while the existing client refresh/cache path remains active.
- No database schema, auth, authorization, ordering, subscription or theme-contract changes were introduced by G1.

## Verification Evidence
- VERIFIED: historical quality run `33743739709` passed all existing quality steps.
- VERIFIED: run `33748743094` passed route generation, Typecheck, Tests (58/58), Lint, Production build, Playwright installation and preview startup; it isolated the `page.goto` URL-type defect.
- VERIFIED: `7b3e0812a29c129374d8d99cdf98cf005790a233` fixed the Browser QA URL-type defect.
- VERIFIED: run `33760030791` isolated preview lifetime loss between CI process contexts.
- VERIFIED: `b56c951e362522ec0e25b02a343278beff725f2c` kept preview startup and Browser QA in one step.
- VERIFIED: run `33762057453` passed Install, route generation, Typecheck, Tests, Lint and Production build but Browser QA failed because the server-function bundle could not find `pglite.wasm` at `.vercel/output/functions/__server.func/pglite.wasm`.
- VERIFIED: `scripts/ensure-pglite-asset.mjs` previously copied PGlite assets only into `_libs`; the runtime resolves these files from the server-function root during Vite preview.
- VERIFIED: `69544f9f55f06c85e70a703765f62ed6a16cf3f1` updated the installer to copy all three runtime files to both the existing `_libs` location and the server-function root.
- VERIFIED: regression test `scripts/pglite-asset.test.mjs` covers the function-root placement contract and is included in `npm test`.
- VERIFIED: run `33762426073` reached Tests and correctly rejected the stale regression assertion; the test was then aligned with the generalized three-file contract.
- IN_PROGRESS: current post-fix CI run is expected to verify the corrected asset contract and Browser QA.
- BLOCKED: Vercel deployment remains unavailable for live verification if its rate limit persists.
- UNKNOWN: final post-fix CI conclusion and deployed production HTML/head output.

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
- IN_PROGRESS: final CI verification of the Browser template QA asset fix.
- BLOCKED: Vercel deployment rate limit prevents live production HTML/head inspection while active.
- UNKNOWN: live production canonical origin, Search Console/indexation state and production content quality.

## Session Log
- 2026-09-03 — Audited repository continuity, routes, public data contract, templates, analytics, CI and deployment evidence.
- 2026-09-03 — Researched Saudi restaurant/delivery competitors and official Google/TanStack/SDAIA guidance.
- 2026-09-03 — Archived the superseded template-only plan and created the unified growth/Saudi SEO active plan.
- 2026-09-03 — Implemented G1 public-menu SSR metadata/schema foundation.
- 2026-09-03 — Fixed the two typed public-menu links in `src/routes/index.tsx` and verified their TypeScript failure was removed by CI.
- 2026-09-03 — Fixed the CI preview recursion and Browser QA URL-type defect.
- 2026-09-03 — Fixed preview lifetime handling in CI and added a workflow regression guard.
- 2026-09-03 — CI run `33762057453` isolated the real remaining Browser QA failure: PGlite runtime files were missing from the Vercel server-function root.
- 2026-09-03 — Implemented the PGlite function-root asset fix and added a regression test.
- 2026-09-03 — CI run `33762426073` confirmed the existing PGlite regression assertion was stale; it was aligned with the new generalized contract.
- 2026-09-03 — Current main now contains the corrected asset installer and regression test.

## Exact Remaining Work
- **Current atomic task:** verify the new GitHub Actions run after the PGlite asset fix through Typecheck, Tests, Lint, Production build and Browser template QA. If it fails, fix only the directly attributable Browser QA/CI regression; otherwise record evidence and stop. Do not start G2.
