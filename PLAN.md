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
- **Status:** IN_PROGRESS — implementation and automated verification are complete; final live sitemap inspection is blocked by Vercel SSO on the available authenticated deployment fetch surface.
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
- **VERIFIED:** public menu loading requires active/published tenant state and inactive branches are excluded.
- **VERIFIED:** missing public menu routes emit `noindex, nofollow` and branch routes remain canonical owners.
- **VERIFIED:** regression coverage was restored and expanded in `scripts/quality-workflow.test.mjs`.
- **VERIFIED:** the preceding CI typecheck regression in `src/routes/m.$slug.tsx` was corrected without changing SEO behavior.
- **VERIFIED:** the duplicate-path sitemap regression was corrected in `e0a007a4a45362494d26ff801a833708b17d4fb7`.

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

## Verification Checkpoint
- **VERIFIED:** focused G2 source commit `e0a007a4a45362494d26ff801a833708b17d4fb7` is represented by Vercel production deployment `dpl_F2NGuDydH1b8RfPaghVToGvoV7Tg`, which is `READY` and built from source commit `2c40efee3c58264606d5e6e6b8cfe74e29e7a109`.
- **VERIFIED:** deployment aliases include `menu-v3-kohl.vercel.app`, `menu-v3-midosd2s-projects.vercel.app`, and `menu-v3-git-main-midosd2s-projects.vercel.app`.
- **VERIFIED:** deployment `/robots.txt` returns HTTP 200 with `Allow: /`, private-surface disallows for `/admin`, `/studio`, `/owner`, `/onboarding`, `/login`, `/invite`, and `/api/`, plus a `Sitemap` declaration.
- **VERIFIED:** GitHub Actions run `33769708337` passed route-tree generation, Typecheck, Tests (66/66), Lint, Production build, Playwright installation, Browser template QA, and preview cleanup.
- **VERIFIED:** Browser template QA passed on mobile, tablet, and desktop with RTL, Arabic document language, no horizontal overflow, zero runtime console errors, accessibility-name checks, and reduced-motion support.
- **BLOCKED:** direct live retrieval of `/sitemap.xml` through the available Vercel authenticated fetch surface is redirected to Vercel SSO even after generating a deployment share URL; the sitemap response body therefore cannot be inspected from this execution environment.
- **UNKNOWN:** live `/sitemap.xml` body and actual production URL set until a public/non-SSO production surface can be inspected.
- **UNKNOWN:** Search Console/indexation state until separately inspected.

## Unified milestones

### G1 — Public Menu SEO Foundation
- **Status:** DONE / VERIFIED.

### G2 — Crawl Control and Indexation
- **Status:** IN_PROGRESS — implementation and automated verification complete; live sitemap inspection remains blocked.

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
**Close G2 only after the live `/sitemap.xml` response can be inspected successfully and satisfies the existing acceptance criteria. Do not start G3 before G2 is closed.**
