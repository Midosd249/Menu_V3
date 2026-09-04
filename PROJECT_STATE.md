# PROJECT_STATE

## Identity
- Status: IN_PROGRESS / BLOCKED only on external Search Console ownership verification.
- Repository: `Midosd249/Menu_V3`.
- Source of truth: `main`.
- Product: Menu V3, Arabic-first bilingual multi-tenant digital-menu SaaS for restaurants and cafes.
- Active plan: `PLAN.md` — Platform Growth, Template Ecosystem, and Saudi SEO.

## Current Position
- T1, T2, and T3 template milestones are DONE / VERIFIED and protected.
- **G1 — Public Menu SEO Foundation is DONE / VERIFIED.**
- **G2 — Crawl Control and Indexation is DONE / VERIFIED.**
- **G3 — Saudi Local Discovery + Branch SEO is DONE / VERIFIED and CLOSED.**
- **G4 — Arabic/English SEO Architecture is DONE / VERIFIED and CLOSED.**
- **G5 — Template Ecosystem Expansion is DONE / VERIFIED and CLOSED.**
- **G6 — Performance + Media is DONE / VERIFIED / CLOSED.**
- **G7 — Analytics, Search Console, Growth, Rollout is IN_PROGRESS.**
- **G7 audit is DONE / VERIFIED.**
- **G7.1 production analytics integrity hardening is DONE / VERIFIED.**
- **G7.2 deployment readiness is DONE / VERIFIED; Search Console ownership is BLOCKED on external account verification.**

## G7.1 — Production Analytics Integrity Hardening — DONE / VERIFIED
- **VERIFIED:** `src/lib/menu/analytics-integrity.test.ts` covers supported 7/30-day ranges, tenant scoping across analytics aggregations, invalid/cross-tenant product handling, duplicate visit/QR suppression, and active/published tenant resolution.
- **VERIFIED:** GitHub Actions quality run `33821751476` (run 430) passed typecheck, all 81 tests, lint, production build, Playwright installation, Browser Template QA, performance artifact step, and cleanup.
- **VERIFIED:** no analytics runtime code, event schema, or dependency was changed by the hardening task.

## G7.2 — Search Console Production Readiness
- **VERIFIED:** Vercel project `menu-v3` is linked to `Midosd249/Menu_V3` and exposes `menu-v3-kohl.vercel.app`.
- **VERIFIED:** `package.json` declares `@vitejs/plugin-react` at `^6.1.1`, fixing the observed Vercel `ERR_MODULE_NOT_FOUND` build defect.
- **VERIFIED:** latest `main` history passed the full GitHub quality workflow.
- **VERIFIED:** Vercel production deployment `dpl_BSfCxSgyDetjHQssuz6pQRgm7DNf` is `READY` and targets commit `2e5d7c2d19ab184c51a99a0c84ec198c4a3861fa`.
- **VERIFIED:** production alias `menu-v3-kohl.vercel.app` resolves successfully.
- **VERIFIED:** production `/robots.txt` returns HTTP 200 and declares the production sitemap while disallowing administrative routes.
- **VERIFIED:** production `/sitemap.xml` returns HTTP 200 and contains the current published menu/branch URLs.
- **VERIFIED:** production `/` returns HTTP 200 with Arabic RTL document metadata and the existing public landing experience.
- **VERIFIED:** `src/routes/__root.tsx` supports optional `VITE_GOOGLE_SITE_VERIFICATION`; no token or credential is committed.
- **BLOCKED:** Search Console ownership still requires the account-specific verification token and Google confirmation.
- **UNKNOWN:** Search Console ownership/indexation state, submitted sitemap state, and Google-selected canonicals.
- **UNKNOWN:** local shell execution outside CI.

## Protected Completed Work
- G1 Public Menu SEO Foundation: DONE / VERIFIED.
- G2 Crawl Control and Indexation: DONE / VERIFIED.
- G3 Saudi Local Discovery + Branch SEO: DONE / VERIFIED / CLOSED.
- G4 Arabic/English SEO Architecture: DONE / VERIFIED / CLOSED.
- G5 Template Ecosystem: DONE / VERIFIED / CLOSED.
- G6 Performance + Media: DONE / VERIFIED / CLOSED.
- G7.1 Analytics Integrity: DONE / VERIFIED.

## Session Log
- 2026-09-04 — Rechecked latest `main` after G7.1 CI completion.
- 2026-09-04 — Confirmed the latest production Vercel deployment is READY on commit `2e5d7c2d19ab184c51a99a0c84ec198c4a3861fa`.
- 2026-09-04 — Verified production root, robots.txt, and sitemap.xml over the live Vercel deployment.
- 2026-09-04 — Closed the deployment-confirmation portion of G7.2; retained only external Search Console ownership verification as blocked.

## Exact Remaining Work
- **G7.2 Search Console ownership verification:** configure the Google-provided public verification value in Vercel Production, verify ownership in Google Search Console, submit the existing `/sitemap.xml`, and record the resulting Google status. Do not commit the token or add unrelated refactors.
