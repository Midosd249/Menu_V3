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
- G1 — Public Menu SEO Foundation is DONE / VERIFIED and protected.
- **G2 — Crawl Control and Indexation is IN_PROGRESS.** The production crawl-control implementation and automated regression coverage are complete.
- The focused G2 source commit passed the complete repository quality workflow.
- Vercel now has a READY production deployment built from the focused G2 source commit. Live `robots.txt` is verified; live `sitemap.xml` retrieval remains blocked by Vercel SSO on the available authenticated fetch surface.

## G2 — Crawl Control and Indexation
### Implementation
- **VERIFIED:** `src/lib/seo/crawl.ts` provides deterministic `robots.txt` and XML sitemap builders with XML escaping, origin normalization, and duplicate-path elimination.
- **VERIFIED:** `server/middleware/grok-pwa.ts` serves `/robots.txt` and `/sitemap.xml` through the existing Nitro middleware.
- **VERIFIED:** sitemap database selection requires `tenants.is_active = true`, `tenants.is_published = true`, and `branches.is_active = true`, ordered deterministically.
- **VERIFIED:** sitemap output uses absolute URLs and optional `lastmod` values.
- **VERIFIED:** robots allows public pages, disallows private application surfaces, and declares `/sitemap.xml`.
- **VERIFIED:** public-menu routes enforce active/published tenant state and emit `noindex, nofollow` for missing/unavailable menu data.
- **VERIFIED:** branch routes own their canonical and Restaurant JSON-LD metadata; the parent route suppresses duplicate branch metadata.
- **VERIFIED:** `scripts/quality-workflow.test.mjs` covers robots behavior, sitemap rendering/deduplication, and the published/active sitemap SQL contract.
- **VERIFIED:** the route-id typecheck regression in `src/routes/m.$slug.tsx` is corrected by comparing the route id as a string.
- **VERIFIED:** duplicate-path sitemap handling was corrected in `e0a007a4a45362494d26ff801a833708b17d4fb7`.

### Verification Evidence
- **VERIFIED:** GitHub Actions run `33769708337` passed route-tree generation, Typecheck, Tests (66/66), Lint, Production build, Playwright installation, Browser template QA, and preview cleanup.
- **VERIFIED:** Browser template QA passed on mobile, tablet, and desktop with RTL, Arabic document language, no horizontal overflow, zero runtime console errors, accessibility-name checks, and reduced-motion support.
- **VERIFIED:** Vercel production deployment `dpl_F2NGuDydH1b8RfPaghVToGvoV7Tg` is `READY` and built from focused G2 source commit `2c40efee3c58264606d5e6e6b8cfe74e29e7a109`.
- **VERIFIED:** deployment aliases include `menu-v3-kohl.vercel.app`, `menu-v3-midosd2s-projects.vercel.app`, and `menu-v3-git-main-midosd2s-projects.vercel.app`.
- **VERIFIED:** deployment `/robots.txt` returns HTTP 200 with `Allow: /`, private-surface disallows for `/admin`, `/studio`, `/owner`, `/onboarding`, `/login`, `/invite`, and `/api/`, plus a `Sitemap` declaration.
- **BLOCKED:** direct live retrieval of `/sitemap.xml` through the available Vercel authenticated fetch surface is redirected to Vercel SSO even after generating a deployment share URL, so the sitemap response body cannot be inspected from this execution environment.
- **UNKNOWN:** live `/sitemap.xml` body and actual production URL set until a public/non-SSO production surface can be inspected.
- **UNKNOWN:** Search Console/indexation state until separately inspected.

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
- G1 Public Menu SEO Foundation: DONE / VERIFIED.

## Known Issues / Risks
- **BLOCKED:** Vercel SSO prevents live `/sitemap.xml` inspection through the available deployment-fetch surface.
- **UNKNOWN:** production canonical origin for JSON-LD remains relative because no verified application-level canonical public origin has been configured.
- **UNKNOWN:** Search Console/indexation state until separately inspected.
- Existing lint warnings remain but are not errors and were not introduced by this task.

## Session Log
- 2026-09-03 — Audited repository continuity, routes, public data contract, templates, analytics, CI and deployment evidence.
- 2026-09-03 — Researched Saudi restaurant/delivery competitors and official Google/TanStack/SDAIA guidance.
- 2026-09-03 — Archived the superseded template-only plan and created the unified growth/Saudi SEO active plan.
- 2026-09-03 — Implemented G1 public-menu SSR metadata/schema foundation.
- 2026-09-03 — Fixed typed public-menu links and Browser QA URL handling.
- 2026-09-03 — Fixed CI preview recursion and preview process lifetime handling.
- 2026-09-03 — Isolated and fixed PGlite runtime asset placement and production-only migration isolation; CI run `33763072784` passed all quality gates.
- 2026-09-03 — Inspected live Vercel production HTML/head and fixed duplicate branch canonical/JSON-LD emission.
- 2026-09-03 — Re-inspected production `/m/nafas` and `/m/nafas/olaya`; G1 CLOSED.
- 2026-09-03 — Resumed G2 from repository evidence; confirmed crawl-control implementation already existed but its regression coverage had been reverted.
- 2026-09-03 — Restored and expanded G2 regression coverage and corrected the typecheck regression found in `src/routes/m.$slug.tsx`.
- 2026-09-03 — Committed focused G2 changes as `2c40efee3c58264606d5e6e6b8cfe74e29e7a109`.
- 2026-09-03 — Fixed sitemap duplicate-path handling in `e0a007a4a45362494d26ff801a833708b17d4fb7`; GitHub Actions run `33769708337` passed every repository quality gate.
- 2026-09-03 — Vercel production deployment `dpl_F2NGuDydH1b8RfPaghVToGvoV7Tg` became READY from the focused G2 source commit; live `/robots.txt` was verified, while `/sitemap.xml` remained inaccessible through the available SSO-protected fetch surface.

## Exact Remaining Work
- **Current atomic task remains G2 — Crawl Control and Indexation.**
- **Exact next action:** obtain a publicly inspectable production response for `/sitemap.xml`, verify its body and eligible URL set, then close G2 only if all existing acceptance criteria pass.
- Do not start G3 until G2 is closed and verified.
