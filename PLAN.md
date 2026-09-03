# Platform Growth, Template Ecosystem, and Saudi SEO — Active Plan

## Status and Current Section
- Status: IN_PROGRESS.
- Repository: `Midosd249/Menu_V3`; `main` is the source of truth.
- Superseded plan archived as `PLAN_ARCHIVE_2026-09-03-template-ecosystem.md`.
- Completed T1/T2/T3 template work is preserved; SEO/discoverability remains the priority before broad template expansion.
- **Current section:** G1 — Public Menu SEO Foundation.
- **Completed atomic task:** CI Browser template QA repair and verification.

## G1 Status

### VERIFIED
- Public-menu SSR metadata/schema implementation is complete and protected.
- `7b3e0812a29c129374d8d99cdf98cf005790a233` fixed the Browser QA URL-type defect.
- `b56c951e362522ec0e25b02a343278beff725f2c` fixed CI preview process lifetime handling.
- PGlite runtime files are copied to both `_libs` and the Vercel server-function root.
- PGlite skips production-only `menu_v3.*` migrations while preserving those migrations for PostgreSQL.
- Regression coverage exists for Browser QA preview isolation, PGlite assets, migration portability and migration isolation.
- **CI run `33763072784` passed all quality gates, including Browser template QA and cleanup.**

### BLOCKED / UNKNOWN
- BLOCKED: Vercel live deployment verification may remain rate-limited.
- UNKNOWN: production HTML/head output, canonical origin and Search Console/indexation state until live deployment is inspectable.

## Unified milestones

### G1 — Public Menu SEO Foundation
- **Status:** IN_PROGRESS — CI implementation/verification complete; deployment inspection remains blocked.
- **Acceptance:** useful SSR menu content; truthful metadata/schema; missing menus noindex; renderer/order behavior preserved; generated route search types compile; CI/browser QA passes; deployed HTML/head inspected.
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

## Exact Current Section Exit Criteria
**G1 is not marked DONE until the successful CI evidence above is complemented by inspection of the deployed build's generated HTML/head when the Vercel rate limit clears. Do not start G2 before G1 is closed.**
