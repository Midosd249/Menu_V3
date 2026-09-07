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
- Specialized Design Agent — DEFINED / VERIFIED as a permanent documentation-level visual-quality role at `docs/agents/design-agent.md`.
- Editorial image/card balance refinement — IMPLEMENTATION IN PROGRESS; scoped to Editorial presentation only; final browser evidence remains pending.
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
- W16 QA, Browser/Device, and Release — `IN_PROGRESS / DEPLOYMENT_BLOCKED`; final production verification remains open.
- W17 Public Pages & Themes Integration — `IN_PROGRESS`; focused public-menu hardening is merged to `main`.

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
- W17 Public Pages & Themes Integration.

## Permanent Design Agent Workflow
- VERIFIED: the specialized visual, image, layout, theme, and site-consistency Design Agent is defined in `docs/agents/design-agent.md`.
- VERIFIED: the Design Agent is a separate specialist from the main repository agent and does not own architecture, data, auth/authz, entitlements, subscriptions, tenant/branch isolation, CI/CD, Vercel, or general product logic.
- PROPOSED: invoke the Design Agent workflow for significant visual, layout, image, theme, and site-consistency work; require evidence labels and relevant design documentation.
- PROTECTED: Essential, Editorial, Noir, Heritage, and Gallery implementation status remains unchanged by the Design Agent definition task.

## Editorial Image / Card Refinement
- VERIFIED: supplied mobile screenshot shows an oversized first Editorial product composition where image and product copy are visually separated by excessive vertical space.
- VERIFIED: repository contains a legacy mobile Editorial rule assigning `min-height: 25rem` to every `3n + 1` card through `src/theme-refinements.css`.
- VERIFIED: final Editorial hardening layer now resets product-card `min-height`, preserves a stable two-column scan unit, standardizes product media to `4 / 3`, and keeps featured media consistent.
- VERIFIED: `tests/editorial-browser-hardening.test.mjs` now protects the stable mobile geometry.
- VERIFIED: audit is recorded in `docs/template-audits/editorial-image-layout-audit-2026-09-07.md`.
- PROTECTED: no other theme implementation was changed.
- UNKNOWN: final browser/device rendering after the new refinement has not yet been observed in this connector environment.
- PROPOSED: use the next browser QA pass to verify that Editorial remains visually premium at 360px, 390px, 430px, tablet, and desktop widths without reopening unrelated theme work.

## W17 Public Pages & Themes Integration
- VERIFIED: canonical source is `Midosd249/Menu_V3`; legacy `Menu-V2-Sandbox` is not part of this implementation.
- VERIFIED: homepage uses `COMMERCIAL_PLANS` for Free, Starter, and Pro pricing and displays branch/product/team limits.
- VERIFIED: homepage exposes the five protected themes from `MENU_THEMES` and links them to the real Menu V3 preview route.
- VERIFIED: plan and theme selections are shown in the new-customer request area before submission.
- VERIFIED: selected plan/theme are serialized into the existing `submitLead` details field without changing the server contract.
- VERIFIED: `/themes` presents personality, product style, imagery emphasis, and preview actions without introducing a sixth theme or a paywall.
- VERIFIED: `/themes/preview` continues to render through the existing Menu V3 theme controller and public-menu/template system.
- VERIFIED: preview controls are localized and include a return-to-comparison action and a use-theme path.
- VERIFIED: `tests/public-pages-themes-contract.test.mjs` protects the pricing/theme/lead/renderer boundaries.
- VERIFIED: `docs/w17-public-pages-themes-design-brief.md` records scope and acceptance requirements.
- VERIFIED: client screenshot audit identified and fixed public-menu image-failure fallback and empty-hours placeholder defects.
- VERIFIED: focused hardening is merged to `main` through PR #21.
- UNKNOWN: the full final W17-Q repository quality suite has not yet been executed after the hardening merge.
- UNKNOWN: new hardening browser/device visual QA has not yet been directly observed in this connector environment.
- UNKNOWN: live lead submission and owner notification delivery have not yet been directly exercised here.
- BLOCKED: final production deployment evidence for the merged hardening state is not yet established.

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
- VERIFIED: production experimentation is intentionally not activated because the current event schema has no experiment exposure/variant property.
- VERIFIED: experimentation policy and first recommended experiment are recorded in `docs/growth-w15-analytics-experimentation.md`.
- VERIFIED: no database migration was required for W15.
- INFERRED: the highest-value immediate growth lever is making existing acquisition → engagement → intent data actionable before adding more instrumentation.
- UNKNOWN: statistical significance, retention, revenue attribution, and true conversion-to-order rates are not measurable until corresponding events exist and enough production traffic accumulates.
- VERIFIED: Quality Gate `34053348446` passed install, route generation, typecheck, tests, lint, production build, Playwright Chromium, all-theme Browser Template QA, performance upload, and preview shutdown.

## W16 QA, Browser/Device, and Release — Audit Result
- VERIFIED: repository default branch is `main`.
- VERIFIED: W14 and W15 regression quality gates remain green.
- VERIFIED: direct Vercel inspection confirms the current production deployment is READY but remains on the earlier W17 closure state; the final merged hardening commit is not yet confirmed as production.
- VERIFIED: direct production `/m/nafas` fetch returns HTTP 200 with Arabic RTL and English LTR markup.
- VERIFIED: current production runtime error/fatal inspection for the inspected deployment returned no entries.
- BLOCKED: final merged W17-Q hardening commit is not yet established as the active production deployment.
- UNKNOWN: exact Vercel Usage/Billing resource value is not exposed through the available connector surface.
- VERIFIED: premium-theme testing override is fail-closed and expiry-bound; UNKNOWN: its current production environment value cannot be inspected through the available read surface.
- UNKNOWN: physical-device rendering, manual screen-reader output, authenticated Owner keyboard traversal, QR-camera scanning, and Opera-specific behavior remain unobserved in this connector environment.
- Evidence: `docs/sessions/2026-09-06-w16-qa-release.md` and `docs/sessions/2026-09-07-w17-q-public-menu-hardening.md`.

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
### W17-Q — Verify and harden the public Pages & Themes integration
Objective: run the complete repository quality gate against the merged W17 state, inspect the final diff, and resolve only scoped implementation/test defects; then re-check Vercel deployment state and record production evidence without claiming deployment until the commit match is verified.

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
