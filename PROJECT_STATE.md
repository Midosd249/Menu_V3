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

## Protected Completed Work
- Existing themes, public-menu behavior, customer actions, authentication, authorization, tenant/branch isolation, routing, migrations, and deployment controls are not reopened without evidence.
- No sixth theme is created as a substitute for product/design strategy.

## W12-03 Reliability and Failure-Path Audit
- VERIFIED: public-menu loading now uses a bounded two-attempt retry policy.
- VERIFIED: each attempt has a 10-second timeout.
- VERIFIED: retry delay is bounded and deterministic at 350 ms after the first failed attempt.
- VERIFIED: terminal `not_found` / invalid responses are not retried.
- VERIFIED: terminal timeout, unavailable, and unknown failures receive Arabic/English actionable messages.
- VERIFIED: existing session cache remains optional and uses the established slug/branch key; no cross-tenant cache mechanism was introduced.
- VERIFIED: no Supabase schema, auth, authorization, theme, routing, or successful-path data contract changed.
- VERIFIED: regression coverage protects retry bounds, terminal-response behavior, delay, and localized failure messages.
- VERIFIED: Quality Gate `34015320658` passed install, route generation, typecheck, tests, lint, production build, Playwright Chromium, all-theme Browser Template QA, performance upload, and preview shutdown.
- UNKNOWN: production RUM is not available, so real-user timeout/retry frequency and recovery rate cannot be quantified.
- Evidence: `docs/reliability-failure-path-audit.md`.

## Current Design Strategy
- The five-theme system is not the current design focus; themes remain protected.
- External research covers Saudi/MENA and global restaurant technology, branded web presence, public menu UX, Owner Studio, Arabic/RTL, accessibility, typography, performance, SEO/local discovery, conversion, trust, pricing, analytics, and release QA.
- INFERRED: strongest strategic territory is `Premium Arabic-first Restaurant Presence Platform`.
- PROPOSED: strengthen shared brand/design system and connected customer/owner experience while preserving theme personality.
- Complete roadmap: `docs/design-strategy-master-plan.md`.
- Design contract: `docs/design-system-contract.md`.

## Exact Next Task
### W13 — Trust, Security, and Data Ownership
Objective: audit public/owner boundaries, tenant and branch authorization, public data exposure, secrets/configuration, error/logging exposure, and data-ownership UX; harden only evidenced risks without changing protected product behavior.

Acceptance criteria:
- no public response exposes private tenant/owner data;
- authorization boundaries remain tenant/branch scoped;
- secrets are not embedded in client bundles or logs;
- error responses do not expose internal SQL, stack traces, or infrastructure details;
- public analytics/event paths remain tenant-scoped;
- security regression coverage exists for every changed boundary;
- full Quality Gate passes;
- no unrelated changes.

Verification: `npm run typecheck`, `npm test`, `npm run lint`, `npm run build`, Playwright/template QA, targeted security tests, and final diff review.
