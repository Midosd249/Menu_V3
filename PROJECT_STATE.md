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
- W15 Growth, Analytics, and Experimentation — CLOSED / VERIFIED; Quality Gate `34053348446` passed all required steps.
- W16 QA, Browser/Device, and Release — `IN_PROGRESS / DEPLOYMENT_BLOCKED`; repository/CI release audit passed, but current `main` is not production-deployed.

## W15 Growth, Analytics, and Experimentation
- VERIFIED: research reviewed current product-analytics and experimentation guidance and recorded the evidence in `docs/growth-w15-analytics-experimentation.md`.
- VERIFIED: existing public event taxonomy remains exactly `visit`, `qr_scan`, `product_view`, `whatsapp`.
- VERIFIED: tenant resolution and product ownership validation remain server-side; owner aggregation remains tenant-scoped.
- VERIFIED: no third-party analytics SDK, fingerprinting, IP storage, or parallel tracking system was introduced.
- VERIFIED: `src/lib/menu/growth.ts` derives denominator-safe directional event ratios only from `OwnerAnalytics` returned by the authenticated server function.
- VERIFIED: Studio analytics now surfaces product views per 100 visits, WhatsApp clicks per 100 sessions, visits per 100 QR scans, average views per session, and a deterministic opportunity category in Arabic/English.
- VERIFIED: the UI explicitly states that these are operational event ratios, not unique-user conversion rates.
- VERIFIED: zero-denominator metrics render as unavailable rather than fabricated percentages.
- VERIFIED: `src/lib/menu/growth.test.ts` protects calculations and the event contract.
- VERIFIED: the existing `src/lib/menu/analytics-integrity.test.ts` remains part of the default test suite and protects tenant scoping.
- VERIFIED: no database migration was required.
- VERIFIED: production A/B experimentation is not falsely enabled; the current event schema lacks an experiment exposure/variant property.
- INFERRED: existing acquisition → engagement → intent data is the highest-value immediate growth surface.
- UNKNOWN: statistical significance, retention, revenue attribution, and true order conversion remain unmeasurable until corresponding production events exist.
- VERIFIED: Quality Gate `34053348446` passed install, route generation, typecheck, tests, lint, production build, Playwright Chromium, all-theme Browser Template QA, performance upload, and preview shutdown.
- Evidence: `docs/growth-w15-analytics-experimentation.md`.

## W16 QA, Browser/Device, and Release
- VERIFIED: repository default branch is `main`; current W15 merge commit is `3a7fcffa2bd68cdb034eb3cde05ab3f0df8ecce1`.
- VERIFIED: current-main Quality run `34053609808` passed install, route generation, typecheck, tests, lint, production build, Playwright Chromium installation, all-theme Browser Template QA, performance baseline upload, and preview cleanup.
- VERIFIED: W14 Quality Gate `34052577671` and W15 Quality Gate `34053348446` remain documented as passed.
- VERIFIED: direct Vercel inspection shows the current production deployment is READY but serves W14 commit `f9725b6bb6df3909b5e720abfdb598d776eb2c7c`, not current main.
- VERIFIED: direct production root fetch returned HTTP 200 and Arabic RTL markup; runtime error/fatal logs were absent in the inspected 24-hour window.
- BLOCKED: GitHub Vercel status for current main reports `build-rate-limit`; current main has not been established as the production deployment.
- BLOCKED: the available Vercel deployment connector rejected a deployment invocation before creating a deployment because its required parameters could not be supplied through the exposed action contract; no deployment success is claimed.
- UNKNOWN: exact Vercel Usage/Billing resource value is not exposed through the available connector surface.
- VERIFIED: premium-theme testing override logic is fail-closed and expiry-bound; UNKNOWN: current production environment values cannot be inspected through the available repository/Vercel read surface.
- UNKNOWN: physical-device rendering, manual screen-reader output, authenticated Owner keyboard traversal, QR-camera scanning, and Opera-specific behavior were not directly observed in this connector environment.
- Evidence: `docs/sessions/2026-09-06-w16-qa-release.md`.

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
### W16-R — Controlled production release retry after Vercel capacity is cleared
Objective: once the Vercel rate/build limitation is cleared, perform exactly one intentional production deployment of current `main`, verify the deployed commit, perform real-device production QA, and close W16 only with direct deployment evidence.

Acceptance criteria:
- Vercel Usage/Billing limitation is rechecked and the deployment condition is clear;
- current `main` commit `3a7fcffa2bd68cdb034eb3cde05ab3f0df8ecce1` is deployed to production;
- direct Vercel evidence confirms the production deployment commit matches current `main`;
- real-device production QA covers supported mobile/browser states and core customer actions;
- testing override state is confirmed disabled/expired before commercial launch;
- final release evidence is recorded and W16 is marked CLOSED only after all required evidence is present.

Verification: direct Vercel deployment evidence plus real-device production QA and final continuity review.
