# Platform Growth, Template Ecosystem, and Saudi SEO — Active Plan

## Status and Current Section
- Status: IN_PROGRESS.
- Repository: `Midosd249/Menu_V3`; `main` is the source of truth.
- Superseded plan archived as `PLAN_ARCHIVE_2026-09-03-template-ecosystem.md`.
- Completed T1/T2/T3 template work is preserved; SEO/discoverability remains the priority before broad template expansion.
- **Current section:** G1 — Public Menu SEO Foundation.
- **Current atomic task:** complete Vercel production verification after the live inspection found and the repository fixed a nested branch-head duplication.

## G1 Status

### VERIFIED
- Public-menu SSR metadata/schema implementation is complete and protected.
- `7b3e0812a29c129374d8d99cdf98cf005790a233` fixed the Browser QA URL-type defect.
- `b56c951e362522ec0e25b02a343278beff725f2c` fixed CI preview process lifetime handling.
- PGlite runtime files are copied to both `_libs` and the Vercel server-function root.
- PGlite skips production-only `menu_v3.*` migrations while preserving those migrations for PostgreSQL.
- Regression coverage exists for Browser QA preview isolation, PGlite assets, migration portability and migration isolation.
- **CI run `33763072784` passed all quality gates, including Browser template QA and cleanup.**
- Production `/m/nafas` and `/m/nafas/olaya` return SSR menu content with route-specific SEO metadata.
- Production missing-menu output is `noindex, nofollow`.
- No production error/fatal runtime events were observed in the last hour at verification time.
- TanStack Router documents nested route head composition and exposes `matches` to route `head`; this supports suppressing parent canonical/JSON-LD entries when the branch child is active. citeturn0search0turn0search3

### FINDING
- **VERIFIED:** live `/m/nafas/olaya` initially emitted two canonical links and two Restaurant JSON-LD scripts because both `/m/$slug` and `/m/$slug/$branch` supplied head entries.
- **VERIFIED:** this is a metadata correctness defect, not a runtime rendering failure.

### FIX
- **VERIFIED:** commit `62df67e5d2597dcc3f4132354cefe750ae2c2188` changes only `src/routes/m.$slug.tsx` so the parent route omits canonical and JSON-LD when the branch child is present. The branch route remains the sole owner of branch canonical/schema metadata.
- **VERIFIED:** continuity documentation was updated in commit `30325490ed502344360e86e31ae0d13d3fe5eae2` to preserve the finding and blocker evidence.

### BLOCKED / UNKNOWN
- **BLOCKED:** Vercel has not created a new deployment for the fixed `main` commit during the current verification window, so the fix cannot yet be rechecked in production.
- **UNKNOWN:** whether the Git integration webhook is delayed, paused, or requires manual re-triggering.
- **UNKNOWN:** production canonical origin for JSON-LD remains relative because no verified canonical public origin has been configured in the application.
- **UNKNOWN:** Search Console/indexation state until separately inspected.

## Unified milestones

### G1 — Public Menu SEO Foundation
- **Status:** IN_PROGRESS — implementation and CI are verified; production verification found a nested-head defect, the repository fix is committed, and deployment of that fix remains pending.
- **Acceptance:** useful SSR menu content; truthful metadata/schema; missing menus noindex; renderer/order behavior preserved; generated route search types compile; CI/browser QA passes; deployed HTML/head inspected with no duplicate canonical/schema output.
- **Verification:** `npm test`, `npm run typecheck`, `npm run lint`, `npm run build`, CI/browser QA and deployed HTML/head inspection.

### G2 — Crawl Control and Indexation
- **Status:** TODO. Do not start until G1 is closed.

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

## Exact Current Task Exit Criteria
**Close G1 only after the fixed `main` commit is deployed to Vercel production and the generated HTML/head for `/m/nafas` and `/m/nafas/olaya` confirms one canonical per page, one relevant Restaurant JSON-LD payload per page, correct indexation directives, SSR menu content, and no production runtime errors attributable to this task. Do not start G2 before G1 is closed.**
