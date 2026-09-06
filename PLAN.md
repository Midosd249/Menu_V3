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
- W6-01 Typography Implementation — CLOSED / VERIFIED.
- W7 Color / Surface / Contrast System — CLOSED / VERIFIED.
- W8 Imagery and Art Direction — CLOSED / VERIFIED.
- W9 Motion and Interaction — CLOSED / VERIFIED.
- W10 Accessibility and RTL Quality — CLOSED / VERIFIED.
- W11 SEO, Local Discovery, and Shareability — CLOSED / VERIFIED.
- W12-01 Public Menu Hydration Performance — CLOSED / VERIFIED.
- W12-02 Public Menu Resource & Bundle Efficiency — CLOSED / VERIFIED.
- W12-03 Reliability and Failure-Path Audit — CLOSED / VERIFIED.
- W13 Trust, Security, and Data Ownership — CLOSED / VERIFIED.
- W14 Pricing, Packaging, and Commercial UX — CLOSED / VERIFIED / MERGED.
- W15 Growth, Analytics, and Experimentation — CLOSED / VERIFIED; Quality Gate `34053348446` passed all required steps.

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

## Completed W15 — Growth, Analytics, and Experimentation
- VERIFIED: research reviewed current product-analytics and experimentation guidance from Amplitude and Google Analytics and converted it into a repository-specific, minimal event contract.
- VERIFIED: existing four-event public analytics contract is preserved: `visit`, `qr_scan`, `product_view`, `whatsapp`.
- VERIFIED: no new third-party analytics SDK, fingerprinting, IP storage, or parallel tracking system was introduced.
- VERIFIED: added `src/lib/menu/growth.ts` with pure, denominator-safe directional ratios derived only from authenticated server analytics.
- VERIFIED: added product-view-per-visit, WhatsApp-clicks-per-session, QR-visit ratio, and average product views per session; these are explicitly labeled as operational event ratios rather than unique-user conversion rates.
- VERIFIED: added a deterministic opportunity classifier: baseline, discovery, conversion, content, distribution.
- VERIFIED: Studio analytics now surfaces the growth loop and next opportunity in Arabic/English.
- VERIFIED: zero denominators render as unavailable rather than fabricated percentages.
- VERIFIED: `src/lib/menu/growth.test.ts` protects metric math and the implemented event taxonomy.
- VERIFIED: event integrity and tenant-scoped aggregation remain protected by the existing analytics integrity suite.
- VERIFIED: production experimentation is intentionally not activated because the current event schema has no experiment exposure/variant property; claiming an A/B result without that data would be false.
- VERIFIED: experimentation policy and first recommended experiment are recorded in `docs/growth-w15-analytics-experimentation.md`.
- VERIFIED: no database migration was required for W15.
- INFERRED: the highest-value immediate growth lever is making existing acquisition → engagement → intent data actionable before adding more instrumentation.
- UNKNOWN: statistical significance, retention, revenue attribution, and true conversion-to-order rates are not measurable until corresponding events exist and enough production traffic accumulates.
- VERIFIED: Quality Gate `34053348446` passed install, route generation, typecheck, tests, lint, production build, Playwright Chromium, all-theme Browser Template QA, performance upload, and preview shutdown.

## Protected Work
- Existing five-theme implementation.
- Shared public-menu behavior and customer actions.
- Authentication, authorization, tenant/branch isolation.
- Existing migrations/schema unless evidence proves a requirement.
- Release-only Vercel workflow.
- Existing visual/functional quality system.

## Research Governance
- Material research is recorded in persistent evidence documents.
- Use official standards for accessibility, i18n, web platform, SEO, and analytics event conventions.
- Competitors are pattern evidence, not assets or implementation sources.
- Label conclusions `VERIFIED`, `INFERRED`, `UNKNOWN`, `BLOCKED`, or `PROPOSED`.
- Only one atomic task may be active at a time.

## Exact Next Task
### W16 — QA, Browser/Device, and Release
Objective: perform the final release-readiness pass across the complete Menu V3 surface without reopening completed foundations.

Acceptance criteria:
- full repository state, diff, history, configuration, documentation, and deployment path audited;
- typecheck, tests, lint, build, Playwright, all-theme browser/template QA, performance, and release checks pass;
- W14 and W15 regressions remain green;
- Arabic/English and RTL behavior remain intact;
- no unresolved P0/P1 security, data-isolation, accessibility, or reliability issue;
- final release evidence is recorded before merge.

Verification: repository Quality Gate plus final diff review and deployment status.
