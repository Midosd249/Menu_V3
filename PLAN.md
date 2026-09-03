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

### Remaining G1 Notes
- **UNKNOWN:** production canonical origin for JSON-LD remains relative because no verified application-level canonical public origin has been configured.
- **UNKNOWN:** Search Console/indexation state until separately inspected.

## G2 — Crawl Control and Indexation
- **Status:** IN_PROGRESS — implementation and regression coverage are present; final executable verification is pending.
- **Objective:** establish deterministic crawler controls so only intentionally published public menu pages can be discovered/indexed, while unavailable/unpublished content is excluded without harming valid public pages.

### Scope
1. Audit existing `robots.txt`, sitemap behavior, route handling, and any noindex/redirect logic.
2. Implement a production-safe `robots.txt` surface.
3. Implement a dynamic sitemap containing only eligible published public menu/branch URLs backed by verified data.
4. Define and enforce published/unpublished/not-found canonical and redirect policy.
5. Add regression tests for robots, sitemap eligibility, route status/metadata behavior, and duplicate URL exclusion.
6. Verify generated outputs in CI and, when available, on the deployed production host.

### Implementation Evidence
- **VERIFIED:** `src/lib/seo/crawl.ts` provides deterministic `robots.txt` and XML sitemap builders with XML escaping, origin normalization, and duplicate-path elimination.
- **VERIFIED:** `server/middleware/grok-pwa.ts` serves `/robots.txt` and `/sitemap.xml` directly through deployed Nitro middleware.
- **VERIFIED:** sitemap SQL selects only active/published tenants and active branches, with deterministic ordering.
- **VERIFIED:** sitemap output uses absolute URLs and optional `lastmod` values.
- **VERIFIED:** robots allows public pages, disallows private application surfaces, and declares `/sitemap.xml`.
- **VERIFIED:** public menu loading already requires `t.is_active = true` and `t.is_published = true`; inactive branches are excluded.
- **VERIFIED:** missing public menu routes emit `noindex, nofollow` and existing branch canonical ownership prevents duplicate canonical/JSON-LD output.
- **VERIFIED:** regression coverage was restored and expanded in `scripts/quality-workflow.test.mjs`.
- **VERIFIED:** the preceding CI run isolated a typecheck regression in `src/routes/m.$slug.tsx`; the focused route-id comparison correction is included in the G2 commit.

### Research Decisions
- Use root-level `/sitemap.xml` with fully qualified URLs and optional truthful `lastmod` values.
- Keep `robots.txt` focused on crawl control rather than indexing suppression; page-level `noindex` remains the mechanism for unavailable pages.
- Serve both crawler-control surfaces from the existing Nitro middleware rather than adding a second routing mechanism or changing Vercel routing.
- These decisions follow current Google Search Central guidance for sitemap URLs, robots.txt, and `noindex` semantics.

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

## Verification Blocker
- **BLOCKED:** the repository has no new GitHub Actions run for commit `2c40efee3c58264606d5e6e6b8cfe74e29e7a109` in the available tool window, and the local execution environment cannot clone GitHub because outbound DNS/network access is unavailable.
- **UNKNOWN:** final CI results for the focused G2 commit.
- **UNKNOWN:** final Vercel deployment result and live `/robots.txt`/`/sitemap.xml` output for the focused G2 commit.

## Unified milestones

### G1 — Public Menu SEO Foundation
- **Status:** DONE / VERIFIED.

### G2 — Crawl Control and Indexation
- **Status:** IN_PROGRESS — implementation complete, final verification blocked.

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
**Close G2 only after the focused commit passes the repository verification suite and the deployed `/robots.txt` and `/sitemap.xml` outputs are inspected successfully. Do not start G3 before G2 is closed.**
