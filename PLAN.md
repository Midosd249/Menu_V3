# Platform Growth, Template Ecosystem, and Saudi SEO — Active Plan

## Status and Current Section
- Status: IN_PROGRESS.
- Repository: `Midosd249/Menu_V3`; `main` is the source of truth.
- Superseded plan archived as `PLAN_ARCHIVE_2026-09-03-template-ecosystem.md`.
- Completed T1/T2/T3 template work is preserved.
- G1 — Public Menu SEO Foundation is **DONE / VERIFIED**.
- G2 — Crawl Control and Indexation is **DONE / VERIFIED**.
- **Current section:** G3 — Saudi Local Discovery + Branch SEO.

## G1 Status — CLOSED
- **VERIFIED:** Public-menu SSR metadata/schema implementation is complete and protected.
- **VERIFIED:** CI run `33763072784` passed all G1 quality gates.
- **VERIFIED:** Production `/m/nafas` and `/m/nafas/olaya` return SSR menu content with route-specific SEO metadata.
- **VERIFIED:** Production missing-menu output is `noindex, nofollow`.
- **VERIFIED:** Duplicate branch canonical/JSON-LD emission was fixed and rechecked in production.

## G2 Status — CLOSED
### Objective
Establish deterministic crawler controls so only intentionally published public menu pages can be discovered/indexed, while unavailable/unpublished content is excluded without harming valid public pages.

### Implementation Evidence
- **VERIFIED:** `src/lib/seo/crawl.ts` provides deterministic `robots.txt` and XML sitemap builders with XML escaping, origin normalization, and duplicate-path elimination.
- **VERIFIED:** `server/middleware/grok-pwa.ts` serves `/robots.txt` and `/sitemap.xml` through the existing Nitro middleware.
- **VERIFIED:** sitemap SQL selects only active/published tenants and active branches.
- **VERIFIED:** robots allows public pages, disallows private application surfaces, and declares `/sitemap.xml`.
- **VERIFIED:** unavailable public-menu routes emit `noindex, nofollow`.
- **VERIFIED:** regression coverage protects crawler behavior and sitemap eligibility.

### Final Verification Evidence
- **VERIFIED:** GitHub Actions run `33769708337` passed route-tree generation, Typecheck, Tests (66/66), Lint, Production build, Playwright installation, Browser Template QA, and preview cleanup.
- **VERIFIED:** Vercel production deployment `dpl_4VUKHziJn8B3nwVTUG6mjiFksihS` is `READY`.
- **VERIFIED:** live `/robots.txt` returns HTTP 200 with expected crawl rules and sitemap declaration.
- **VERIFIED:** live `/sitemap.xml` returns HTTP 200 with `application/xml; charset=utf-8`.
- **VERIFIED:** live sitemap is valid XML and contains four absolute unique URLs: `/m/mndy-alwtnya`, `/m/mndy-alwtnya/main-branch`, `/m/nafas`, `/m/nafas/olaya`.
- **VERIFIED:** the live URL set is consistent with the repository eligibility contract; automated tests cover active/published tenant and active branch filtering.

### G2 Acceptance Criteria
- **PASS:** deterministic robots surface without accidental `/m/*` blocking.
- **PASS:** deterministic valid sitemap containing only indexable public URLs.
- **PASS:** unavailable/unpublished routes excluded from sitemap and non-indexable.
- **PASS:** canonical policy remains consistent between normal and branch routes.
- **PASS:** regression tests cover eligible/ineligible entries and crawler controls.
- **PASS:** G1 behavior remains intact.
- **PASS:** CI/browser quality workflow remains green.

**G2 is CLOSED.** Do not reopen it unless new evidence demonstrates a regression.

## G3 — Saudi Local Discovery + Branch SEO
- **Status:** IN_PROGRESS.
- **Objective:** build a safe, evidence-driven Saudi local-discovery SEO layer around verified city and branch data, increasing local search relevance without creating thin, duplicate, or fabricated location pages.

### Scope
1. Audit the existing branch/tenant schema and verified location fields.
2. Identify which Saudi city/region/location data is complete enough to support indexable landing pages.
3. Define URL and canonical strategy for local discovery without conflicting with public menu URLs.
4. Implement only location pages backed by verified database entities and useful content.
5. Add branch-level local SEO metadata and structured data where supported by verified fields.
6. Add regression tests for location eligibility, canonical URLs, unavailable locations, and duplicate content boundaries.
7. Verify mobile/RTL accessibility and production-safe behavior.

### Non-goals
- Do not invent cities, branches, addresses, coordinates, opening hours, ratings, or business claims.
- Do not create hundreds of thin city pages merely for keyword coverage.
- Do not change public menu URL ownership.
- Do not start G4 locale architecture, G5 template expansion, G6 performance/media, or G7 growth analytics in this task.

### Acceptance Criteria
- Every indexable local page is backed by verified branch/tenant data.
- Local URLs have deterministic canonical ownership and do not duplicate public menu routes.
- Metadata and structured data use only verified fields.
- Empty/incomplete location data produces no indexable page.
- Tests cover eligibility, duplicate prevention, missing data, and canonical behavior.
- `npm test`, `npm run typecheck`, `npm run lint`, `npm run build`, and applicable Browser QA remain successful.

### Research / Design Requirement
Before implementation, inspect official Google Search Central guidance for local business structured data and duplicate/canonical handling, plus the repository schema and current branch data. Record material decisions here before coding.

## Unified milestones
- G1 — Public Menu SEO Foundation: **DONE / VERIFIED**.
- G2 — Crawl Control and Indexation: **DONE / VERIFIED**.
- G3 — Saudi Local Discovery + Branch SEO: **IN_PROGRESS**.
- G4 — Arabic/English SEO Architecture: TODO.
- G5 — Template Ecosystem Expansion: TODO.
- G6 — Performance + Media: TODO.
- G7 — Analytics, Search Console, Growth, Rollout: TODO.

## Exact Current Task
**G3 — Audit verified Saudi location data and implement the smallest production-safe local-discovery/branch-SEO slice backed entirely by existing verified entities. Stop after G3 verification; do not begin G4.**
