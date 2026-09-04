# Platform Growth, Template Ecosystem, and Saudi SEO — Active Plan

## Status and Current Section
- Status: IN_PROGRESS.
- Repository: `Midosd249/Menu_V3`; `main` is the source of truth.
- G1 — Public Menu SEO Foundation: **DONE / VERIFIED**.
- G2 — Crawl Control and Indexation: **DONE / VERIFIED**.
- G3 — Saudi Local Discovery + Branch SEO: **DONE / VERIFIED / CLOSED**.
- G4 — Arabic/English SEO Architecture: **DONE / VERIFIED / CLOSED**.
- G5 — Template Ecosystem Expansion: **DONE / VERIFIED / CLOSED**.
- G6 — Performance + Media: **DONE / VERIFIED / CLOSED**.
- **Current section:** G7 — Analytics, Search Console, Growth, Rollout.
- **Current atomic task:** G7.2 — Search Console production readiness.

## Repository Maintenance Note — 2026-09-04
- **VERIFIED:** A separate repository-organization audit was performed on `main` without reopening or changing G1–G7 product milestones.
- **VERIFIED:** `chore/repository-organization` is the dedicated maintenance branch.
- **VERIFIED:** The audit is recorded in `docs/repository-organization-audit.md` and deletion candidates are isolated in `DELETE_CANDIDATES.md`.
- **PROPOSED:** Apply only documentation-focused moves/archive operations that preserve file contents and application paths.
- **UNKNOWN:** Local working-tree status and local command execution are unavailable through the GitHub connector.

## G7 — Analytics, Search Console, Growth, Rollout — IN_PROGRESS

### G7.1 — Production analytics integrity hardening — DONE / VERIFIED
- **VERIFIED:** added `src/lib/menu/analytics-integrity.test.ts` covering the existing analytics/event trust-boundary contracts without changing runtime event behavior.
- **VERIFIED:** owner analytics remains restricted to 7/30-day ranges and defaults to 7 days for the existing optional input contract.
- **VERIFIED:** owner analytics aggregation queries retain tenant scoping through `member.tenant_id`.
- **VERIFIED:** public product views reject missing product IDs and require the product to belong to the resolved published tenant.
- **VERIFIED:** public visit and QR events retain 30-minute per-tenant/per-session/per-event duplicate suppression.
- **VERIFIED:** public event recording resolves tenants only through active, published slugs.
- **VERIFIED:** `package.json` test script includes the new regression suite; no dependency was added.
- **UNKNOWN:** runtime database execution of the new tests was not available through the connected GitHub-only execution surface in this session.
- **INFERRED:** the regression suite is compatible with the existing Node test runner because it follows the repository's existing `node:test` conventions and uses only Node built-ins.

### G7 guardrails
- Preserve G1–G6 contracts.
- Do not add Google credentials, external analytics dependencies, or provider-specific configuration without an explicit atomic task and security review.
- Treat existing first-party `menu_events` analytics as the current analytics source of truth.
- Do not infer Search Console performance or indexing state from repository code alone.

## Exact Next Task
- **G7.2 — Search Console production readiness:** verify the intended production domain from repository/deployment evidence, then prepare only the minimal first-party verification/submission surface required by official Google Search Central guidance. Do not add credentials or claim ownership/indexation until production-domain evidence exists.

## Research / Design Sources
- **VERIFIED:** Google Search Central LocalBusiness guidance: https://developers.google.com/search/docs/appearance/structured-data/local-business
- **VERIFIED:** Google Search Central canonicalization guidance: https://developers.google.com/search/docs/crawling-indexing/canonicalization
- **VERIFIED:** Google Search Central canonical implementation guidance: https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls
- **VERIFIED:** Google Search Central localized versions guidance: https://developers.google.com/search/docs/specialty/international/localized-versions
- **PROPOSED:** G7.2 should remain dependency-free and credential-free until the production domain and ownership mechanism are explicitly evidenced.

## Unified milestones
- G1 — Public Menu SEO Foundation: **DONE / VERIFIED**.
- G2 — Crawl Control and Indexation: **DONE / VERIFIED**.
- G3 — Saudi Local Discovery + Branch SEO: **DONE / VERIFIED / CLOSED**.
- G4 — Arabic/English SEO Architecture: **DONE / VERIFIED / CLOSED**.
- G5 — Template Ecosystem Expansion: **DONE / VERIFIED / CLOSED**.
- G6 — Performance + Media: **DONE / VERIFIED / CLOSED**.
- G7 — Analytics, Search Console, Growth, Rollout: **IN_PROGRESS**.
