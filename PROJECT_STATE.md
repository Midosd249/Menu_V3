# PROJECT STATE

## Identity
- Status: IN_PROGRESS.
- Repository: `Midosd249/Menu_V3`.
- Source of truth: `main`.
- Product: Menu V3, Arabic-first bilingual multi-tenant digital-menu SaaS for restaurants and cafes.

## Backend Identity (VERIFIED — 2026-09-06)
- Supabase project ref: `ublxptcqefujkbeepylc`.
- Supabase URL: `https://ublxptcqefujkbeepylc.supabase.co`.
- Supabase region: `ap-northeast-2` (Seoul).
- Supabase status: `ACTIVE_HEALTHY` at last verification.
- Menu V3 canonical database schema: `menu_v3`.
- Menu V3 is separated from legacy application data by schema boundary; legacy `public` tables are not the canonical Menu V3 surface.
- Canonical infrastructure reference: `docs/project-infrastructure.md`.

## Current Position
- G1–G7.2 completed work remains protected.
- Premium Theme System — DONE / VERIFIED / MERGED.
- Essential, Editorial, Noir, Heritage, and Gallery — protected.
- Visual/Functional Quality System — DONE / VERIFIED / MERGED.
- External Theme Preview QR Mode — DONE / VERIFIED.
- Shared Public Menu Rendering Stabilization — VERIFIED.
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
- W15 Growth, Analytics, and Experimentation — IMPLEMENTATION COMPLETE; final Quality Gate pending.

## W15 Growth, Analytics, and Experimentation
- VERIFIED: research reviewed current product-analytics and experimentation guidance and recorded the evidence in `docs/growth-w15-analytics-experimentation.md`.
- VERIFIED: existing public event taxonomy remains exactly `visit`, `qr_scan`, `product_view`, `whatsapp`.
- VERIFIED: tenant resolution and product ownership validation remain server-side; owner aggregation remains tenant-scoped.
- VERIFIED: no third-party analytics SDK, fingerprinting, IP storage, or parallel tracking system was introduced.
- VERIFIED: `src/lib/menu/growth.ts` derives denominator-safe growth metrics only from `OwnerAnalytics` returned by the authenticated server function.
- VERIFIED: Studio analytics now surfaces product-interest, session-engagement, WhatsApp-intent, QR-to-visit, average views/session, and a deterministic opportunity category in Arabic/English.
- VERIFIED: zero-denominator metrics render as unavailable instead of fabricated percentages.
- VERIFIED: `src/lib/menu/growth.test.ts` protects calculations and the event contract.
- VERIFIED: the existing `src/lib/menu/analytics-integrity.test.ts` remains part of the default test suite and protects tenant scoping.
- VERIFIED: no database migration was required.
- VERIFIED: production A/B experimentation is not falsely enabled; the current event schema lacks an experiment exposure/variant property.
- INFERRED: existing acquisition → engagement → intent data is the highest-value immediate growth surface.
- UNKNOWN: statistical significance, retention, revenue attribution, and true order conversion remain unmeasurable until corresponding production events exist.
- Evidence: `docs/growth-w15-analytics-experimentation.md`.

## Protected Completed Work
- Existing themes, public-menu behavior, customer actions, authentication, authorization, tenant/branch isolation, routing, migrations, and deployment controls are not reopened without evidence.
- No sixth theme is created as a substitute for product/design strategy.

## Current Design Strategy
- The five-theme system is not the current design focus; themes remain protected.
- External research covers Saudi/MENA and global restaurant technology, branded web presence, public menu UX, Owner Studio, Arabic/RTL, accessibility, typography, performance, SEO/local discovery, conversion, trust, pricing, analytics, and release QA.
- INFERRED: strongest strategic territory is `Premium Arabic-first Restaurant Presence Platform`.
- PROPOSED: strengthen shared brand/design system and connected customer/owner experience while preserving theme personality.
- Complete roadmap: `docs/design-strategy-master-plan.md`.
- Design contract: `docs/design-system-contract.md`.

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
