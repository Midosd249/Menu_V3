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
- W9 Motion and Interaction — CLOSED / VERIFIED; final Quality Gate `34010117079` passed all required steps.
- W10 Accessibility and RTL Quality — CLOSED / VERIFIED; final Quality Gate `34010619265` passed all required steps.
- W11 SEO, Local Discovery, and Shareability — CLOSED / VERIFIED; final Quality Gate `34013074378` passed all required steps.
- W12-01 Public Menu Hydration Performance — CLOSED / VERIFIED; final Quality Gate `34013861903` passed all required steps.
- W12-02 Public Menu Resource & Bundle Efficiency — CLOSED / VERIFIED; final Quality Gate `34014895325` passed all required steps.
- W12-03 Reliability and Failure-Path Audit — CLOSED / VERIFIED; final Quality Gate `34015320658` passed all required steps.
- W13 Trust, Security, and Data Ownership — CLOSED / VERIFIED; final Quality Gate `34050857106` passed all required steps.
- W14 Pricing, Packaging, and Commercial UX — CLOSED / VERIFIED; final Quality Gate `34052577671` passed all required steps.

## Protected Completed Work
- Existing themes, public-menu behavior, customer actions, authentication, authorization, tenant/branch isolation, routing, migrations, and deployment controls are not reopened without evidence.
- No sixth theme is created as a substitute for product/design strategy.

## W14 Pricing, Packaging, and Commercial UX
- VERIFIED: current market scan covers Saudi/MENA and global digital-menu pricing patterns and is recorded in `docs/commercial-w14-pricing.md`.
- VERIFIED: commercial plan display contract mirrors the active subscription catalog: Free 0 SAR / 1 branch / 50 products / 3 team members; Starter 99 SAR / 3 / 300 / 10; Pro 199 SAR / 10 / 1,000 / 25.
- VERIFIED: five protected themes remain available across plans; no theme entitlement gate was invented.
- VERIFIED: public bilingual `/pricing` route exposes only safe static commercial data.
- VERIFIED: online checkout is explicitly not claimed; upgrade discovery routes to the existing start/contact surface.
- VERIFIED: authenticated Studio subscription summary resolves through active tenant membership and shows active-branch, item, and active-team usage against plan limits.
- VERIFIED: commercial catalog regression coverage is part of `npm test`.
- VERIFIED: no new runtime dependency or schema change was introduced by W14.
- VERIFIED: Quality Gate `34052577671` passed Install, route generation, Typecheck, Tests, Lint, Production build, Playwright Chromium, all-theme Browser Template QA, performance upload, and preview shutdown.
- VERIFIED: Vercel status for W14 head commit `d1bfd7ea1d7cbd225bde923850827cd25f80b064` is `success`.
- INFERRED: operational scale is the strongest current packaging boundary because the product already has server-side limits for these resources.
- UNKNOWN: payment collection, automated billing, invoices, refunds, and webhook-driven subscription transitions are not implemented and remain outside W14.
- Evidence: `docs/commercial-w14-pricing.md`.

## Current Design Strategy
- The five-theme system is not the current design focus; themes remain protected.
- External research covers Saudi/MENA and global restaurant technology, branded web presence, public menu UX, Owner Studio, Arabic/RTL, accessibility, typography, performance, SEO/local discovery, conversion, trust, pricing, analytics, and release QA.
- INFERRED: strongest strategic territory is `Premium Arabic-first Restaurant Presence Platform`.
- PROPOSED: strengthen shared brand/design system and connected customer/owner experience while preserving theme personality.
- Complete roadmap: `docs/design-strategy-master-plan.md`.
- Design contract: `docs/design-system-contract.md`.

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
