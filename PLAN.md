# Platform Growth, Template Ecosystem, and Saudi SEO — Active Plan

## Status and Current Section
- Status: IN_PROGRESS / BLOCKED on external Search Console ownership verification.
- Repository: `Midosd249/Menu_V3`; `main` is the source of truth.
- G1 — Public Menu SEO Foundation: **DONE / VERIFIED**.
- G2 — Crawl Control and Indexation: **DONE / VERIFIED**.
- G3 — Saudi Local Discovery + Branch SEO: **DONE / VERIFIED / CLOSED**.
- G4 — Arabic/English SEO Architecture: **DONE / VERIFIED / CLOSED**.
- G5 — Template Ecosystem Expansion: **DONE / VERIFIED / CLOSED**.
- G6 — Performance + Media: **DONE / VERIFIED / CLOSED**.
- **Current section:** G7 — Analytics, Search Console, Growth, Rollout.
- **Current atomic task:** G7.2 — Search Console production readiness.

## G7 — Analytics, Search Console, Growth, Rollout — IN_PROGRESS

### G7.1 — Production analytics integrity hardening — DONE / VERIFIED
- **VERIFIED:** added `src/lib/menu/analytics-integrity.test.ts` covering the existing analytics/event trust-boundary contracts without changing runtime event behavior.
- **VERIFIED:** owner analytics remains restricted to 7/30-day ranges and defaults to 7 days for the existing optional input contract.
- **VERIFIED:** owner analytics aggregation queries retain tenant scoping through `member.tenant_id`.
- **VERIFIED:** public product views reject missing product IDs and require the product to belong to the resolved published tenant.
- **VERIFIED:** public visit and QR events retain 30-minute per-tenant/per-session/per-event duplicate suppression.
- **VERIFIED:** public event recording resolves tenants only through active, published slugs.
- **VERIFIED:** `package.json` test script includes the new regression suite; no dependency was added.
- **UNKNOWN:** runtime database execution of the new tests was not available through the connected GitHub-only execution surface in the earlier session.
- **INFERRED:** the regression suite is compatible with the existing Node test runner because it follows the repository's existing `node:test` conventions and uses only Node built-ins.

### G7.2 — Search Console production readiness — IN_PROGRESS / BLOCKED
- **VERIFIED:** Vercel project `menu-v3` is linked to `Midosd249/Menu_V3` and exposes `menu-v3-kohl.vercel.app` as a configured project domain.
- **VERIFIED:** a prior production deployment from `main` reached READY at commit `ca3d7e39b4eb6954e2c6012f251e384a2d38a3df`.
- **VERIFIED:** current `main` commit `b553184488e082544fc03e441b42c8e7d25da381` has an associated Vercel production deployment currently reported as BUILDING.
- **VERIFIED:** `src/lib/menu/seo.ts` uses `https://menu-v3-kohl.vercel.app` as the default public origin and supports `VITE_VERCEL_PROJECT_PRODUCTION_URL` override.
- **VERIFIED:** existing dynamic sitemap and robots sitemap declaration are already in place; no duplicate SEO implementation is required.
- **VERIFIED:** `src/routes/__root.tsx` now supports the optional `VITE_GOOGLE_SITE_VERIFICATION` environment value and emits the standard `google-site-verification` meta tag only when the value is non-empty.
- **VERIFIED:** no dependency, credential, token, sitemap implementation, canonical contract, or tenant behavior was changed.
- **INFERRED:** for the current shared `*.vercel.app` production hostname, URL-prefix verification is the compatible path. A Domain property requires DNS control of the parent domain, which is not evidenced here.
- **VERIFIED:** Google Search Console guidance confirms Domain properties use DNS verification, while URL-prefix properties support HTML-tag verification. Google also requires owner permission to submit a sitemap through the Sitemaps report.
- **BLOCKED:** the verification token is generated for the user's Google account/property and must be copied exactly from the Search Console verification wizard; it cannot be safely invented or prefilled.
- **UNKNOWN:** Search Console ownership/indexation state, submitted sitemap state, and Google-selected canonicals.

## G7 guardrails
- Preserve G1–G6 contracts.
- Do not add Google credentials, external analytics dependencies, or provider-specific configuration without an explicit atomic task and security review.
- Treat existing first-party `menu_events` analytics as the current analytics source of truth.
- Do not infer Search Console performance or indexing state from repository code alone.
- Never commit the Search Console verification token; configure it only as a Vercel Production environment value.

## Exact Next Task
- **G7.2 completion:** configure `VITE_GOOGLE_SITE_VERIFICATION` in the Vercel Production environment using the exact token from the Search Console URL-prefix verification wizard, wait for a successful production deployment, verify ownership in Search Console, then submit `/sitemap.xml` and inspect the homepage/public menu URLs.

## Research / Design Sources
- **VERIFIED:** Google Search Console ownership verification guidance: `https://support.google.com/webmasters/answer/9008080` — URL-prefix properties support HTML-tag verification; Domain properties require DNS verification; verification values must match the wizard-provided token exactly.
- **VERIFIED:** Google Search Console property guidance: `https://support.google.com/webmasters/answer/34592` — Domain properties cover protocols/subdomains and are DNS-verified; URL-prefix properties use the specified protocol/prefix and support multiple verification methods.
- **VERIFIED:** Google Search Console sitemap guidance: `https://support.google.com/webmasters/answer/7451001` — sitemap submission through the Sitemaps report requires owner permission and an accessible sitemap.
- **VERIFIED:** Vite environment guidance: `https://vite.dev/guide/env-and-mode` — variables prefixed with `VITE_` are exposed to client-side code, so only non-secret/public verification material may use this prefix.
- **PROPOSED:** Keep G7.2 dependency-free and credential-free in git; use one optional public verification meta tag controlled by the Vercel Production environment.

## Unified milestones
- G1 — Public Menu SEO Foundation: **DONE / VERIFIED**.
- G2 — Crawl Control and Indexation: **DONE / VERIFIED**.
- G3 — Saudi Local Discovery + Branch SEO: **DONE / VERIFIED / CLOSED**.
- G4 — Arabic/English SEO Architecture: **DONE / VERIFIED / CLOSED**.
- G5 — Template Ecosystem Expansion: **DONE / VERIFIED / CLOSED**.
- G6 — Performance + Media: **DONE / VERIFIED / CLOSED**.
- G7 — Analytics, Search Console, Growth, Rollout: **IN_PROGRESS**.
