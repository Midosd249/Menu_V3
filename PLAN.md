# Platform Growth, Template Ecosystem, and Saudi SEO — Active Plan

## Status and Current Section
- Status: IN_PROGRESS / BLOCKED on Vercel deployment confirmation and external Search Console ownership verification.
- Repository: `Midosd249/Menu_V3`; `main` is the source of truth.
- G1 — Public Menu SEO Foundation: **DONE / VERIFIED**.
- G2 — Crawl Control and Indexation: **DONE / VERIFIED**.
- G3 — Saudi Local Discovery + Branch SEO: **DONE / VERIFIED / CLOSED**.
- G4 — Arabic/English SEO Architecture: **DONE / VERIFIED / CLOSED**.
- G5 — Template Ecosystem Expansion: **DONE / VERIFIED / CLOSED**.
- G6 — Performance + Media: **DONE / VERIFIED / CLOSED**.
- **Current section:** G7 — Analytics, Search Console, Growth, Rollout.
- **Current atomic task:** G7.2 deployment confirmation after completing G7.1 regression verification.

## G7 — Analytics, Search Console, Growth, Rollout — IN_PROGRESS

### G7.1 — Production analytics integrity hardening — DONE / VERIFIED
- **VERIFIED:** added `src/lib/menu/analytics-integrity.test.ts` covering the existing analytics/event trust-boundary contracts without changing runtime event behavior.
- **VERIFIED:** owner analytics remains restricted to 7/30-day ranges and defaults to 7 days for the existing optional input contract.
- **VERIFIED:** owner analytics aggregation queries retain tenant scoping for totals, daily series, top products, categories, and branches.
- **VERIFIED:** public product views reject missing product IDs and require the product to belong to the resolved published tenant.
- **VERIFIED:** public visit and QR events retain 30-minute per-tenant/per-session/per-event duplicate suppression.
- **VERIFIED:** public event recording resolves tenants only through active, published slugs.
- **VERIFIED:** `package.json` test script includes the regression suite; no dependency was added by G7.1.
- **VERIFIED:** GitHub Actions quality run `33821751476` / run 430 passed typecheck, all 81 tests, lint, production build, Playwright installation, Browser Template QA, performance artifact step, and cleanup.
- **VERIFIED:** two brittle assertion failures found in runs 427 and 429 were corrected using the concrete CI evidence; the final query-specific assertions pass.

### G7.2 — Search Console production readiness — IN_PROGRESS / BLOCKED
- **VERIFIED:** Vercel project `menu-v3` is linked to `Midosd249/Menu_V3` and exposes `menu-v3-kohl.vercel.app` as a configured project domain.
- **VERIFIED:** a prior production deployment from `main` reached READY.
- **VERIFIED:** current Vercel failure was a concrete dependency declaration defect: `vite.config.ts` imports `@vitejs/plugin-react`, but `package.json` did not declare it.
- **VERIFIED:** `package.json` now declares `@vitejs/plugin-react` at `^6.1.1`, compatible with the repository's Vite 8 line.
- **VERIFIED:** dependency fix was pushed to `main`; follow-up state/test commits are also on `main`.
- **VERIFIED:** existing dynamic sitemap and robots sitemap declaration are already in place; no duplicate sitemap implementation is required.
- **VERIFIED:** `src/routes/__root.tsx` supports optional `VITE_GOOGLE_SITE_VERIFICATION`; no verification token is committed.
- **VERIFIED:** maintained `@vitejs/plugin-react` documentation/releases support Vite 8.
- **VERIFIED:** latest GitHub quality run `33821751476` passes the full workflow on the tested `main` history.
- **BLOCKED:** Vercel has not created a deployment for the latest tested `main` history; the newest observed Vercel production deployment still targets older commit `1a7dbcdaa246e7103e69a43322425be8806c9c46` and is `ERROR`.
- **BLOCKED:** the available direct-deploy connector cannot be invoked with the required deployment arguments in the current connected surface.
- **UNKNOWN:** local shell execution outside GitHub Actions.
- **BLOCKED:** Search Console ownership remains pending the account-specific verification token and Google confirmation.
- **UNKNOWN:** Search Console ownership/indexation state, submitted sitemap state, and Google-selected canonicals.

## G7 guardrails
- Preserve G1–G6 contracts.
- Do not add Google credentials, external analytics dependencies, or provider-specific configuration without an explicit atomic task and security review.
- Treat existing first-party `menu_events` analytics as the current analytics source of truth.
- Do not infer Search Console performance or indexing state from repository code alone.
- Never commit the Search Console verification token; configure it only as a Vercel Production environment value.
- Do not declare Vercel deployment success until Vercel reports the fixed `main` commit as READY.

## Exact Next Task
- **G7.2 deployment confirmation:** obtain a Vercel deployment from the latest verified `main` history containing `@vitejs/plugin-react`, confirm the deployment reaches READY, then perform the existing Search Console verification step. Do not start another feature or refactor.

## Research / Design Sources
- **VERIFIED:** Google Search Console ownership verification guidance: `https://support.google.com/webmasters/answer/9008080` — URL-prefix properties support HTML-tag verification; Domain properties require DNS verification; verification values must match the wizard-provided token exactly.
- **VERIFIED:** Google Search Console property guidance: `https://support.google.com/webmasters/answer/34592` — Domain properties cover protocols/subdomains and are DNS-verified; URL-prefix properties use the specified protocol/prefix and support multiple verification methods.
- **VERIFIED:** Google Search Console sitemap guidance: `https://support.google.com/webmasters/answer/7451001` — sitemap submission through the Sitemaps report requires owner permission and an accessible sitemap.
- **VERIFIED:** Vite environment guidance: `https://vite.dev/guide/env-and-mode` — variables prefixed with `VITE_` are exposed to client-side code, so only non-secret/public verification material may use this prefix.
- **VERIFIED:** `@vitejs/plugin-react` maintained release documentation confirms Vite 8 compatibility.
- **PROPOSED:** Keep G7.2 credential-free in git; use one optional public verification meta tag controlled by the Vercel Production environment.

## Unified milestones
- G1 — Public Menu SEO Foundation: **DONE / VERIFIED**.
- G2 — Crawl Control and Indexation: **DONE / VERIFIED**.
- G3 — Saudi Local Discovery + Branch SEO: **DONE / VERIFIED / CLOSED**.
- G4 — Arabic/English SEO Architecture: **DONE / VERIFIED / CLOSED**.
- G5 — Template Ecosystem Expansion: **DONE / VERIFIED / CLOSED**.
- G6 — Performance + Media: **DONE / VERIFIED / CLOSED**.
- G7 — Analytics, Search Console, Growth, Rollout: **IN_PROGRESS**.
