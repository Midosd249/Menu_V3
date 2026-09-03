# Platform Growth, Template Ecosystem, and Saudi SEO — Active Plan

## Status and Current Section
- Status: IN_PROGRESS.
- Repository: `Midosd249/Menu_V3`; `main` is the source of truth.
- Superseded plan archived as `PLAN_ARCHIVE_2026-09-03-template-ecosystem.md`.
- Completed T1/T2/T3 template work is preserved; SEO/discoverability remains the priority before broad template expansion.
- **Current section:** G2 — Crawl Control and Indexation.
- G1 — Public Menu SEO Foundation is **DONE / VERIFIED**.

## G1 Status — CLOSED

### VERIFIED
- Public-menu SSR metadata/schema implementation is complete and protected.
- `33763072784` passed all quality gates, including Browser template QA and cleanup.
- Production `/m/nafas` and `/m/nafas/olaya` return SSR menu content with route-specific SEO metadata.
- Production missing-menu output is `noindex, nofollow`.
- The original nested branch duplicate canonical/JSON-LD defect was fixed in `62df67e5d2597dcc3f4132354cefe750ae2c2188`.
- Production deployment `dpl_y7wz8vKhNzXWjjDYthLCGYfwv9Bm` is built from descendant commit `30325490ed502344360e86e31ae0d13d3fe5eae2`, which directly includes the fix.
- Live production inspection confirms one canonical and one relevant Restaurant JSON-LD payload per inspected public page.

### Remaining G1 Notes
- **UNKNOWN:** production canonical origin for JSON-LD remains relative because no verified application-level canonical public origin has been configured.
- **UNKNOWN:** Search Console/indexation state until separately inspected.

## G2 — Crawl Control and Indexation
- **Status:** TODO — this is the exact next atomic milestone.
- **Objective:** establish deterministic crawler controls so only intentionally published public menu pages can be discovered/indexed, while unavailable/unpublished content is excluded without harming valid public pages.

### Scope
1. Audit existing `robots.txt`, sitemap behavior, route handling, and any noindex/redirect logic.
2. Implement a production-safe `robots.txt` surface.
3. Implement a dynamic sitemap containing only eligible published public menu/branch URLs backed by verified data.
4. Define and enforce published/unpublished/not-found canonical and redirect policy.
5. Add regression tests for robots, sitemap eligibility, route status/metadata behavior, and duplicate URL exclusion.
6. Verify generated outputs in CI and, when available, on the deployed production host.

### Non-goals
- Do not start Saudi local landing pages yet.
- Do not implement locale URL variants yet.
- Do not expand the template family set yet.
- Do not change ordering, authentication, billing, or unrelated dashboard behavior.

### Acceptance Criteria
- `robots.txt` is deterministic and does not accidentally block valid public menu routes.
- Sitemap output is deterministic, valid, and contains only published/indexable public URLs.
- Unpublished/inactive/not-found menu routes are excluded from sitemap and emit appropriate non-indexing behavior.
- Canonical policy is consistent between normal and branch routes.
- Tests cover eligible and ineligible sitemap entries plus crawler-control behavior.
- Existing G1 behavior remains intact.
- `npm test`, `npm run typecheck`, `npm run lint`, `npm run build`, and CI/browser QA remain successful.

## Unified milestones

### G1 — Public Menu SEO Foundation
- **Status:** DONE / VERIFIED.

### G2 — Crawl Control and Indexation
- **Status:** TODO — exact next task.

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
**Complete G2 only after robots.txt and sitemap behavior are implemented and tested, published/indexable filtering is proven, canonical/redirect/noindex policy is consistent, existing G1 tests still pass, and the full CI verification suite is green. Do not start G3 before G2 is closed.**
