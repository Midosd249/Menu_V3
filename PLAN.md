# Platform Growth, Template Ecosystem, and Saudi SEO — Active Plan

## Status and Current Section
- Status: IN_PROGRESS.
- Repository: `Midosd249/Menu_V3`; `main` is the source of truth.
- Superseded plan archived as `PLAN_ARCHIVE_2026-09-03-template-ecosystem.md`.
- Completed T1/T2/T3 template work is preserved; SEO/discoverability remains the priority before broad template expansion.
- **Current section:** G1 — Public Menu SEO Foundation.
- **Current atomic task:** verify the CI Browser template QA fix and final workflow conclusion.

## G1 Status

### VERIFIED
- Public-menu SSR metadata/schema implementation is complete and protected.
- Historical quality and Browser QA gates through preview startup are verified.
- `7b3e0812a29c129374d8d99cdf98cf005790a233` fixed the `page.goto` URL-type defect.
- `b56c951e362522ec0e25b02a343278beff725f2c` moved preview startup into the Browser QA step.
- The current workflow isolates the preview with `setsid`, clears `RUNNER_TRACKING_ID`, redirects stdio, waits for readiness, runs Browser QA in the same step, and cleans up with a trap.
- `scripts/quality-workflow.test.mjs` guards the Browser QA preview-isolation contract.
- `package.json` was restored to its pre-task state except for including that targeted regression test in `npm test`.

### UNKNOWN / BLOCKED
- UNKNOWN: final current CI Browser QA result and workflow conclusion.
- BLOCKED: Vercel deployment may remain rate-limited; live production inspection is not claimed without direct evidence.
- UNKNOWN: live production canonical origin, Search Console/indexation state and production content quality.

## Unified milestones

### G1 — Public Menu SEO Foundation
- **Status:** IN_PROGRESS — implementation is complete; CI verification is the only active work.
- **Acceptance:** useful SSR menu content; truthful metadata/schema; missing menus noindex; renderer/order behavior preserved; generated route search types compile; post-fix CI passes Browser QA.
- **Verification:** `npm test`, `npm run typecheck`, `npm run lint`, `npm run build`, CI/browser QA and deployed HTML/head inspection.

### G2 — Crawl Control and Indexation
- **Status:** TODO. Do not start until G1 is closed.
- **Objective:** add `robots.txt`, dynamic sitemap, indexability filters, canonical/redirect policy and tests.

### G3 — Saudi Local Discovery + Branch SEO
- **Status:** TODO.

### G4 — Arabic/English SEO Architecture
- **Status:** TODO.

### G5 — Template Ecosystem Expansion
- **Status:** TODO.

### G6 — Performance + Media
- **Status:** TODO.

### G7 — Analytics, Search Console, Growth, Rollout
- **Status:** TODO.

## Exact Current Section Exit Criteria
**G1 is not marked DONE until post-fix CI passes Typecheck, Tests, Lint, Production build and Browser QA, and a deployed build can be inspected for the generated HTML/head when the Vercel rate limit clears. Do not start G2 before G1 is closed.**
