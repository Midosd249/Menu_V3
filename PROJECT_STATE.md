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
- Specialized Design Agent — DEFINED / VERIFIED as a permanent documentation-level workflow; no application implementation status changed.
- Editorial image/card balance refinement — IMPLEMENTATION IN PROGRESS; scoped to Editorial presentation only; final browser/device evidence remains pending.
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
- W16 QA, Browser/Device, and Release — `IN_PROGRESS / DEPLOYMENT_BLOCKED`; repository/CI release audit passed, but the final merged W17-Q state is not yet verified as production-deployed.
- W17 Public Pages & Themes Integration — `IN_PROGRESS`; implementation is merged to `main` and the focused public-menu hardening subtask is complete.

## W17 Public Pages & Themes Integration
- VERIFIED: implementation is being applied to the canonical `Menu_V3` architecture, not the legacy `Menu-V2-Sandbox`.
- VERIFIED: homepage now consumes the canonical `COMMERCIAL_PLANS` catalog and visibly presents Free, Starter, and Pro pricing with operational limits.
- VERIFIED: homepage now presents the five protected themes from `MENU_THEMES` and links each to the real `/themes/preview` route.
- VERIFIED: plan selection and theme selection scroll to the existing new-customer request form and display the current selection before submission.
- VERIFIED: selected plan/theme are included in the existing `submitLead` details payload; no backend schema or RPC contract was changed.
- VERIFIED: the homepage request area explicitly identifies itself as a `New customer request` and preserves the existing reference-ID confirmation state.
- VERIFIED: `/themes` now presents theme personality, product-card style, imagery emphasis, preview, and a clear relationship to the existing Menu V3 architecture.
- VERIFIED: `/themes/preview` remains connected to `MenuThemeController`, `PublicMenuView`, and `ContemporaryRestaurantTemplate`; no static HTML theme renderer was introduced.
- VERIFIED: preview controls are localized for Arabic/English and provide return-to-theme comparison plus a use-theme path.
- VERIFIED: a repository-level public-pages/themes contract test protects the commercial catalog, five theme keys, lead flow, and real preview renderer boundary.
- VERIFIED: `docs/w17-public-pages-themes-design-brief.md` records scope, protected boundaries, journey, pricing, theme, i18n/RTL, accessibility, responsive, and verification requirements.
- VERIFIED: supplied client screenshots were audited and two concrete public-menu defects were fixed: broken external product-image requests now fall back gracefully, and an empty schedule no longer renders a misleading opening-hours status chip.
- VERIFIED: `tests/public-menu-resilience.test.mjs` records regression contracts for the hardening subtask.
- VERIFIED: focused hardening was merged through PR #21 as commit `b0a06dbeca47779f371e118beed6d62b6b63c21c`.
- VERIFIED: current production HTML for `/m/nafas` already reflects the W17 spacing/bidi/rectangular-card implementation for the Essential route.
- UNKNOWN: full repository quality gates for the final merged hardening commit have not yet been executed in this connector environment.
- UNKNOWN: browser/device visual QA of the final merged hardening commit has not yet been executed in this connector environment.
- UNKNOWN: final merged hardening commit is not yet confirmed as the active production deployment.
- UNKNOWN: live lead submission and owner notification delivery have not been directly exercised here.
- BLOCKED: production release verification remains separately constrained until Vercel exposes/activates the final deployment state.

## Editorial Image / Card Refinement
- VERIFIED: supplied mobile screenshot shows the first Editorial product image separated from its name/price by excessive vertical space and visually inconsistent card height.
- VERIFIED: repository contains a legacy Editorial mobile rule assigning `min-height: 25rem` to every `3n + 1` card through `src/theme-refinements.css`.
- VERIFIED: `src/theme-editorial-hardening.css` now neutralizes that legacy height, preserves a stable two-column product scan unit, standardizes product media to `4 / 3`, and keeps featured imagery on the same geometry.
- VERIFIED: `tests/editorial-browser-hardening.test.mjs` protects the new mobile geometry contract.
- VERIFIED: audit and design rationale are recorded in `docs/template-audits/editorial-image-layout-audit-2026-09-07.md`.
- PROTECTED: no Essential, Noir, Heritage, or Gallery implementation was changed.
- UNKNOWN: final rendered pixels on a browser/device after the refinement are not yet directly observed in this connector environment.
- PROPOSED: complete the next browser QA pass at small/standard/large mobile plus tablet/desktop before declaring the Editorial refinement visually closed.

## W15 Growth, Analytics, and Experimentation
- VERIFIED: research reviewed current product-analytics and experimentation guidance and recorded the evidence in `docs/growth-w15-analytics-experimentation.md`.
- VERIFIED: existing public event taxonomy remains exactly `visit`, `qr_scan`, `product_view`, `whatsapp`.
- VERIFIED: tenant resolution and product ownership validation remain server-side; owner aggregation remains tenant-scoped.
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
- VERIFIED: repository default branch is `main`; current merged W17-Q hardening commit is `b0a06dbeca47779f371e118beed6d62b6b63c21c` before the continuity-session documentation commit.
- VERIFIED: W14 and W15 Quality Gates remain passed.
- VERIFIED: direct Vercel inspection shows the current production deployment is READY but is still associated with the earlier W17 closure commit `822516eb216ba30f628dd839d7b531b3bdd9382d`; final merged hardening commit is not yet confirmed in production.
- VERIFIED: direct production `/m/nafas` fetch returns HTTP 200 with Arabic RTL and English LTR markup.
- VERIFIED: current production runtime error/fatal inspection for the inspected production deployment returned no entries.
- BLOCKED: production deployment of the final merged hardening commit is not yet established; no deployment success is claimed.
- UNKNOWN: exact Vercel Usage/Billing resource value is not exposed through the available connector surface.
- VERIFIED: premium-theme testing override logic is fail-closed and expiry-bound.
- UNKNOWN: current production environment values cannot be inspected through the available repository/Vercel read surface.
- UNKNOWN: physical-device rendering, manual screen-reader output, authenticated Owner keyboard traversal, QR-camera scanning, and Opera-specific behavior were not directly observed in this connector environment.
- Evidence: `docs/sessions/2026-09-06-w16-qa-release.md` and `docs/sessions/2026-09-07-w17-q-public-menu-hardening.md`.

## Protected Completed Work
- Existing themes, public-menu behavior, customer actions, authentication, authorization, tenant/branch isolation, routing, migrations, and deployment controls are not reopened without evidence.
- No sixth theme is created as a substitute for product/design strategy.

## Current Design Strategy
- The five-theme system remains protected while W17 improves how the existing themes are presented and selected.
- External research covers Saudi/MENA and global restaurant technology, branded web presence, public menu UX, Owner Studio, Arabic/RTL, accessibility, typography, performance, SEO/local discovery, conversion, trust, pricing, analytics, and release QA.
- INFERRED: strongest strategic territory is `Premium Arabic-first Restaurant Presence Platform`.
- PROPOSED: strengthen shared brand/design system and connected customer/owner experience while preserving theme personality.
- Complete roadmap: `docs/design-strategy-master-plan.md`.
- Design contract: `docs/design-system-contract.md`.
- VERIFIED: the specialized Design Agent definition is `docs/agents/design-agent.md`; it is a documentation-only specialist for visual, image, layout, theme, and site-consistency quality.
- PROPOSED: invoke the Design Agent workflow for significant future visual/theme/layout/image/site-consistency tasks while keeping the main agent as the owner of product and infrastructure boundaries.

## Exact Next Task
### W17-Q — Run the complete repository quality gate and final continuity review
Objective: verify the merged W17 state with the full repository quality suite, inspect the final diff, and resolve only scoped public-pages/themes defects; then re-check Vercel deployment state and record production evidence without claiming deployment until the commit match is verified.

Acceptance criteria:
- `npm run typecheck` passes;
- `npm test` passes including `tests/public-pages-themes-contract.test.mjs` and `tests/public-menu-resilience.test.mjs`;
- `npm run lint` passes;
- `npm run build` passes;
- `npm run qa:template` passes where applicable;
- final diff contains only W17-scoped changes and preserves protected backend/theme architecture;
- Arabic RTL, English LTR, mobile/responsive, plan selection, theme selection, and preview controls are verified to the extent supported by the available environment;
- remaining UNKNOWN/BLOCKED items are explicitly recorded rather than hidden behind DONE;
- final merged commit is either directly verified in Vercel production or explicitly remains BLOCKED.

Verification: GitHub Actions quality evidence plus final diff/continuity review, Vercel deployment evidence, and available browser/visual evidence.

## Session Log — 2026-09-07 — Editorial Design Agent Image/Card Refinement
- VERIFIED: supplied mobile evidence was reconciled with repository CSS and the Editorial refinement brief.
- VERIFIED: the observed vertical imbalance maps to a legacy mobile `25rem` first-card rule in `src/theme-refinements.css` that was not neutralized by the previous hardening layer.
- VERIFIED: `src/theme-editorial-hardening.css` was refined in commit `0518acf985fc0692cfe786ee1e89f87626439e93` to reset the oversized card height, stabilize media geometry, and normalize featured media.
- VERIFIED: `tests/editorial-browser-hardening.test.mjs` was updated in commit `c2e03fc729c55cffc73655c44056b1017b26695a` with regression coverage for stable mobile card geometry.
- VERIFIED: `docs/template-audits/editorial-image-layout-audit-2026-09-07.md` records the evidence, diagnosis, design rationale, and remaining verification.
- VERIFIED: no database/schema, auth/authorization, subscriptions/entitlements, tenant/branch isolation, dependency, CI/CD, Vercel configuration, environment variable, or deployment behavior was changed.
- VERIFIED: no Vercel deployment was intentionally triggered.
- UNKNOWN: browser/device visual proof for the new commit remains pending.
- Next task: run Editorial/all-theme browser QA against the refinement, inspect mobile/tablet/desktop screenshots, and resolve only remaining evidence-backed Editorial image/card defects before the final W17-Q gate.
