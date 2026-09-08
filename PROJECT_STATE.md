# PROJECT STATE

## Identity
- Status: IN_PROGRESS.
- Repository: `Midosd249/Menu_V3`.
- Canonical branch: `main`.
- Source of truth: `main`.
- Current verified main head: `1813d013d5292afdbfd7cde8e85ff3efdecd8407` — `docs(tasks): reconcile W16 deployment evidence and remaining device verification`.
- Product: Menu V3, Arabic-first bilingual multi-tenant digital-menu SaaS for restaurants and cafes.

## Canonical Backend Identity (VERIFIED — 2026-09-06)
- Supabase project ref: `ublxptcqefujkbeepylc`.
- Supabase URL: `https://ublxptcqefujkbeepylc.supabase.co`.
- Supabase region: `ap-northeast-2` (Seoul).
- Supabase status: `ACTIVE_HEALTHY` at last verification.
- Canonical database schema: `menu_v3`.
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
- Specialized Design Agent — DEFINED / VERIFIED as a documentation-level workflow; no application implementation status changed.
- Research and Connected-Tools Discovery Agent — DEFINED / VERIFIED as an internal AI research workflow; no application implementation status changed.
- Automatic Specialist Routing and Orchestration — DEFINED / VERIFIED as a documentation-level governance workflow; no application implementation status changed.
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
- W16 QA, Browser/Device, and Release — IN_PROGRESS / DEVICE_VERIFICATION_REMAINING; deployment verification is now directly verified.
- W17 Public Pages & Themes Integration — W17-Q recovery is COMPLETED / MERGED; no new W17 implementation is active.

## Noir — PR #24 (VERIFIED)
- PR #24 `refine(noir): stabilize public menu visual system` is MERGED, not Draft/Open/In Progress.
- Merge commit: `d2401a9276719bdab4305f89160aba2ca15f0b58`.
- The Noir refinement preserved the custom hero/featured identity, delegated interaction to the shared renderer, removed duplicate visit-event ownership, stabilized `4 / 3` media, removed card staggering/ornamental transforms, and preserved RTL/LTR and safe-area behavior.
- `tests/noir-browser-hardening.test.mjs` protects the refinement contracts.
- `docs/template-audits/noir-full-refinement.md` records the audit.
- UNKNOWN: physical-device rendering and manual screen-reader output have not been directly verified in this connector environment.

## W17-Q Public Theme Quality Recovery — COMPLETED / MERGED (VERIFIED)
- PR #26 `fix(theme): complete public-menu visual quality recovery` is MERGED.
- Merge commit: `219f79024fec088c6a9e2e1bd050d6fe2e394e91`.
- The recovery batch covered the five canonical themes, with focused Gallery and Heritage recovery while preserving prior Noir/Editorial hardening.
- Quality Gate `34080681231` completed successfully.
- Test result: `161/161` passing; `0` failures; `0` skips; `0` cancelled; `0` todo.
- Browser Template QA: all five themes — Essential, Editorial, Noir, Heritage, Gallery — passed across mobile, tablet, and desktop.
- Browser QA: `0` runtime console errors and `0px` horizontal overflow.
- Typecheck, tests, lint, production build, Playwright Chromium, all-theme Browser Template QA, performance baseline upload, and preview shutdown all completed successfully in the gate.
- UNKNOWN: physical-device rendering and manual screen-reader output remain unobserved.
- No production deployment is inferred from this CI result.

## Gallery Latest Refinement — VERIFIED
- Latest Gallery refinement is on `main`.
- `e21c14fe337f820c371539b09d086b114216da94` — `fix(gallery): show one featured item at a time`.
- `7d57bb0eb6dc5a5bf2198dc5b3219d0628973882` — `test(gallery): lock single featured presentation`.
- `bd84d9f663e74eb166c3ad8d89a97521d0c66ce5` — `docs(gallery): record single featured item refinement`.
- Gallery featured presentation now shows one image-led item at a time, with responsive media geometry; this is implementation evidence, not a new theme task.

## Editorial Image / Card Refinement
- VERIFIED: Editorial mobile refinement removed the legacy oversized `min-height: 25rem` treatment, stabilized the two-column scan unit, and standardized product media to `4 / 3`.
- VERIFIED: `tests/editorial-browser-hardening.test.mjs` protects the geometry contract.
- VERIFIED: audit is recorded in `docs/template-audits/editorial-image-layout-audit-2026-09-07.md`.
- UNKNOWN: final physical-device pixels remain unobserved.
- PROPOSED: verify the existing Editorial refinement in the supported browser/device matrix; do not reopen implementation without new evidence.

## W16 Release / Deployment State
- VERIFIED: canonical repository branch is `main`.
- VERIFIED: Vercel team is `team_4qTUNnhDhAW00uQId6JvETf4` and project is `menu-v3` / `prj_ydfrFBE7ZJVmuNnCOTv3WjWkhuH1`.
- VERIFIED: production deployment `dpl_Cv1zzzwMaFKfzoDWUj6GtKXERdT1` is READY and targets `production`.
- VERIFIED: deployment metadata identifies GitHub repository `Midosd249/Menu_V3`, branch `main`, and commit `e8ac80ec43774da98bd5bbe12bdf8260a244954f`.
- VERIFIED: production aliases include `menu-v3-kohl.vercel.app`.
- VERIFIED: deployment has no alias error and uses region `icn1`.
- VERIFIED: no error/fatal production runtime logs were found in the queried six-hour window.
- VERIFIED: the historical `getMyStudio` / `is_active` error is attached to older deployment `dpl_4vYyUatnMdhU5H5gJBTnbh8mG6NU`, not the current production deployment.
- UNKNOWN: the current Vercel environment variable value for the Supabase connection is not exposed by the Vercel read surface.
- UNKNOWN: live Supabase schema/RLS/grant parity has not been re-queried in this session.
- UNKNOWN: physical-device rendering, manual screen-reader output, authenticated Owner keyboard traversal, QR-camera scanning, and Opera-specific behavior remain unobserved.

## Protected Completed Work
- Existing themes, public-menu behavior, customer actions, authentication, authorization, tenant/branch isolation, routing, migrations, and deployment controls are not reopened without evidence.
- No sixth theme is created as a substitute for product/design strategy.

## Current Design Strategy
- The five-theme system remains protected while existing themes are refined through evidence-backed work only.
- Complete roadmap: `docs/design-strategy-master-plan.md`.
- Design contract: `docs/design-system-contract.md`.
- VERIFIED: specialized Design Agent definition is `docs/agents/design-agent.md`.
- PROPOSED: invoke the Design Agent workflow for significant future visual/theme/layout/image/site-consistency tasks while the main agent retains product and infrastructure ownership.

## Exact Next TODO
### Physical-device and manual accessibility verification
- Verify the current production menu on a real Android/iOS device at small, standard, and large mobile widths.
- Check Arabic RTL, English LTR, mixed-direction content, long product names/prices, missing images, product details, cart open/closed, sticky/floating controls, safe areas, and scrolling.
- Perform manual screen-reader/focus checks where supported.
- Verify QR-camera scanning and record any reproducible defect.
- Do not reopen completed theme implementation unless a real-device defect is reproduced.

## Release Identity Verification — 2026-09-08
- VERIFIED: Vercel team `Midosd2's projects` is `team_4qTUNnhDhAW00uQId6JvETf4`.
- VERIFIED: Vercel project `menu-v3` is `prj_ydfrFBE7ZJVmuNnCOTv3WjWkhuH1` and is linked to GitHub repository `Midosd249/Menu_V3`.
- VERIFIED: production deployment `dpl_Cv1zzzwMaFKfzoDWUj6GtKXERdT1` is READY and explicitly targets production.
- VERIFIED: deployment metadata records `main` and commit `e8ac80ec43774da98bd5bbe12bdf8260a244954f`.
- VERIFIED: production aliases include `menu-v3-kohl.vercel.app`.
- VERIFIED: no error/fatal production runtime logs were found during the queried six-hour window.
- VERIFIED: the only aggregated runtime error found in the preceding 24 hours belongs to the older deployment `dpl_4vYyUatnMdhU5H5gJBTnbh8mG6NU`.
- VERIFIED: no deployment was triggered by the verification itself.
- Next TODO: physical-device and manual accessibility verification.

## Session Log — 2026-09-08 — Release Identity Verification
- VERIFIED: current Vercel project identity, GitHub repository linkage, production deployment target, READY state, production aliases, and deployed commit were directly inspected.
- VERIFIED: production runtime error/fatal query returned no entries in the queried six-hour window.
- VERIFIED: historical `getMyStudio` / `is_active` error is isolated to an older deployment.
- VERIFIED: the repository-declared canonical Supabase identity remains `ublxptcqefujkbeepylc` with schema `menu_v3`.
- UNKNOWN: current production environment variable values and live Supabase RLS/schema parity.
- UNKNOWN: physical-device and manual accessibility evidence.
- Next TODO: physical-device and manual accessibility verification.
