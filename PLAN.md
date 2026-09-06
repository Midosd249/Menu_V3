# Menu V3 — Active Plan

## Status
- Status: IN_PROGRESS.
- Repository: `Midosd249/Menu_V3`.
- Source of truth: `main`.
- Premium Theme System is DONE / VERIFIED / MERGED.
- Essential, Editorial, Noir, Heritage, and Gallery milestones are protected; browser/device closure remains separately tracked.
- Permanent visual/functional/research quality workflow is DONE / VERIFIED and mandatory.
- Design Intelligence & Product Experience Research — CLOSED / VERIFIED at planning level.
- Shared Design System Contract — BASELINE ESTABLISHED / VERIFIED; implementation is incremental.
- P0-01 Canonical Content & Publishing Model Audit — CLOSED / VERIFIED.
- P0 Public Content Propagation — CLOSED / VERIFIED.
- W6 Typography Evidence & Decision — CLOSED / VERIFIED.
- W6-01 Typography Implementation — CLOSED / VERIFIED; corrected Fontsource CDN delivery passed full Quality Gate.
- W7 Color / Surface / Contrast System — CLOSED / VERIFIED.
- W8 Imagery and Art Direction — CLOSED / VERIFIED; final Quality Gate passed in run `34010117079`.
- W9 Motion and Interaction — CLOSED / VERIFIED; final Quality Gate passed in run `34010117079`.
- W10 Accessibility and RTL Quality — CLOSED / VERIFIED; final Quality Gate passed in run `34010619265`.
- W11 SEO, Local Discovery, and Shareability — CLOSED / VERIFIED; final Quality Gate passed in run `34013074378`.
- W12-01 Public Menu Hydration Performance — CLOSED / VERIFIED; final Quality Gate passed in run `34013861903`.
- W12-02 Public Menu Resource & Bundle Efficiency — CLOSED / VERIFIED; Quality Gate run `34014895325` passed all required steps.
- W12-03 Reliability and Failure-Path Audit — CLOSED / VERIFIED; Quality Gate run `34015320658` passed all required steps.
- W13 Trust, Security, and Data Ownership — CLOSED / VERIFIED; final Quality Gate passed in run `34050857106`.
- W14 Pricing, Packaging, and Commercial UX — CLOSED / VERIFIED; Quality Gate `34052577671` passed all required steps and Vercel deployment status is `success`.

## Canonical Backend Identity
- VERIFIED (2026-09-06): Menu V3 uses Supabase project ref `ublxptcqefujkbeepylc`.
- VERIFIED: Supabase URL is `https://ublxptcqefujkbeepylc.supabase.co`, region `ap-northeast-2` (Seoul), status `ACTIVE_HEALTHY` at verification.
- VERIFIED: Menu V3 canonical database schema is `menu_v3`.
- VERIFIED: Menu V3 is separated from legacy application data by schema boundary; legacy `public` tables are not the default Menu V3 canonical surface.
- Canonical infrastructure record: `docs/project-infrastructure.md`.

## Current Strategic Direction
Build Menu V3 as a distinctive `Premium Arabic-first Restaurant Presence Platform`: live menu + branded web presence + direct customer action + owner operations + local discoverability, while preserving existing architecture and completed theme work.

## Master Design Strategy
Complete roadmap: `docs/design-strategy-master-plan.md`.

### Workstreams
- W0 Evidence, measurement, product positioning.
- W1 Brand positioning and content system.
- W2 Marketing website/homepage.
- W3 Public customer menu.
- W4 Owner Studio/admin UX.
- W5 Shared design system.
- W6 Typography.
- W7 Color and brand tokens.
- W8 Imagery and art direction.
- W9 Motion and interaction.
- W10 Accessibility and RTL quality.
- W11 SEO/local discovery/shareability.
- W12 Performance and reliability.
- W13 Trust, security, and data ownership.
- W14 Pricing, packaging, and commercial UX.
- W15 Growth, analytics, and experimentation.
- W16 QA, browser/device, and release.

## Completed W14 — Pricing, Packaging, and Commercial UX
- VERIFIED: market scan covered current Saudi/MENA and global digital-menu pricing patterns, with evidence recorded in `docs/commercial-w14-pricing.md`.
- VERIFIED: commercial display catalog mirrors the existing database subscription catalog: Free 0 SAR / 1 branch / 50 products / 3 team members; Starter 99 SAR / 3 / 300 / 10; Pro 199 SAR / 10 / 1,000 / 25.
- VERIFIED: all five protected themes remain available across the commercial catalog; no artificial theme entitlement was invented.
- VERIFIED: public bilingual `/pricing` presents prices and operational limits without exposing tenant data.
- VERIFIED: pricing UI explicitly states that online checkout is not implemented; no fake payment path was introduced.
- VERIFIED: authenticated Studio overview reads the subscription through active tenant membership and displays current usage against the plan limits.
- VERIFIED: active branch count is used in Studio commercial usage messaging so inactive branches do not consume the displayed limit.
- VERIFIED: commercial contract tests exist in `src/lib/menu/commercial.test.ts` and are part of `npm test`.
- VERIFIED: no runtime dependency was added and the existing package manifest contract was preserved.
- VERIFIED: public menu, theme, authentication, authorization, tenant isolation, and existing schema boundaries were not reopened.
- VERIFIED: Quality Gate `34052577671` passed install, route generation, typecheck, tests, lint, production build, Playwright Chromium, all-theme Browser Template QA, performance upload, and preview shutdown.
- VERIFIED: Vercel deployment status for W14 head commit `d1bfd7ea1d7cbd225bde923850827cd25f80b064` is `success`.
- INFERRED: operational scale is the strongest current packaging boundary because those limits already exist and are enforced server-side.
- UNKNOWN: online payment collection, automated billing, invoices, refunds, and webhook-driven subscription transitions remain unimplemented and are intentionally outside W14.
- Evidence record: `docs/commercial-w14-pricing.md`.

## Protected Work
- Existing five-theme implementation.
- Shared public-menu behavior and customer actions.
- Authentication, authorization, tenant/branch isolation.
- Existing migrations/schema unless evidence proves a requirement.
- Release-only Vercel workflow.
- Existing visual/functional quality system.

## Research Governance
- Material research is recorded in `docs/design-research-log.md` and persistent task evidence documents.
- Use official standards for accessibility, i18n, web platform, SEO, and font licensing.
- Competitors are pattern evidence, not assets or implementation sources.
- Label conclusions `VERIFIED`, `INFERRED`, `UNKNOWN`, `BLOCKED`, or `PROPOSED`.
- Only one atomic task may be active at a time.

## Exact Next Task
### W15 — Growth, Analytics, and Experimentation
Objective: turn the existing verified analytics and commercial surfaces into a measurable growth loop without weakening privacy, tenant isolation, performance, or the public-menu customer experience.

Acceptance criteria:
- identify the smallest evidence-backed growth metrics and event contract;
- preserve existing analytics integrity and tenant boundaries;
- add only measurable, reversible experiments;
- Arabic/English conversion surfaces remain explicit and accessible;
- no fabricated analytics or client-only business truth;
- regression coverage exists for changed analytics/growth contracts;
- full Quality Gate passes;
- no unrelated refactor.

Verification: repository-specific analytics tests plus `npm run typecheck`, `npm test`, `npm run lint`, `npm run build`, Playwright/template QA, and final diff review.
