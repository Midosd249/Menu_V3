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
- W12-02 Public Menu Resource & Bundle Efficiency — CLOSED / VERIFIED for the current low-risk resource-efficiency slice; final Quality Gate `34014895325` passed all required steps.

## Protected Completed Work
- Existing themes, public-menu behavior, customer actions, authentication, authorization, tenant/branch isolation, routing, migrations, and deployment controls are not reopened without evidence.
- No sixth theme is created as a substitute for product/design strategy.

## W12-02 Public Menu Resource & Bundle Efficiency
- Objective: reduce avoidable public-menu resource startup cost without changing protected architecture or introducing speculative bundle refactors.
- VERIFIED: audited `src/routes/__root.tsx`, `src/routes/m.$slug.tsx`, `src/typography.css`, theme loading, and `scripts/performance-audit.mjs`.
- VERIFIED: the critical third-party font origin is `https://cdn.jsdelivr.net` under the established Fontsource typography contract.
- VERIFIED: `src/routes/__root.tsx` now emits `preconnect` with anonymous CORS mode and `dns-prefetch` for the critical font origin.
- VERIFIED: `scripts/quality-workflow.test.mjs` protects the connection-hint ordering and CORS contract.
- VERIFIED: no runtime dependency, Supabase/schema, tenant/cache, hydration, or theme behavior changed.
- VERIFIED: no arbitrary JavaScript/CSS performance budget was introduced; the existing browser audit remains report-only and evidence driven.
- VERIFIED: the existing globally available theme styles were intentionally retained because the current preview/theme architecture relies on immediate theme availability; route-level stylesheet injection was not introduced without evidence that its FOUC/switching risk is acceptable.
- VERIFIED: Quality Gate `34014895325` passed install, route generation, typecheck, tests, lint, production build, Playwright Chromium, all-theme Browser Template QA, performance upload, and preview shutdown.
- UNKNOWN: production RUM is not available, so the real-user latency improvement from connection warming cannot be quantified in this repository.
- Evidence: `docs/performance-public-menu-resources.md`.

## Current Design Strategy
- The five-theme system is not the current design focus; themes remain protected.
- External research covers Saudi/MENA and global restaurant technology, branded web presence, public menu UX, Owner Studio, Arabic/RTL, accessibility, typography, performance, SEO/local discovery, conversion, trust, pricing, analytics, and release QA.
- INFERRED: strongest strategic territory is `Premium Arabic-first Restaurant Presence Platform`.
- PROPOSED: strengthen shared brand/design system and connected customer/owner experience while preserving theme personality.
- Complete roadmap: `docs/design-strategy-master-plan.md`.
- Design contract: `docs/design-system-contract.md`.

## Exact Next Task
### W12-03 — Reliability and Failure-Path Audit
Objective: inspect public-menu and critical application failure behavior under timeout, upstream failure, malformed/partial data, cache miss, retry, navigation interruption, and dependency degradation; improve only evidenced failure-path weaknesses without changing successful-path architecture.

Acceptance criteria:
- critical failure states remain understandable and actionable in Arabic and English;
- no unhandled rejection or infinite retry loop;
- no stale/cross-tenant cache exposure;
- timeout/retry behavior remains bounded;
- browser and automated regression coverage exists for every changed failure path;
- full Quality Gate passes;
- no unrelated changes.

Verification: `npm run typecheck`, `npm test`, `npm run lint`, `npm run build`, Playwright/template QA, performance audit, and targeted failure-path tests.
