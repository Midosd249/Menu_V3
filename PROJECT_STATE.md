# PROJECT STATE

## Identity
- Status: IN_PROGRESS.
- Repository: `Midosd249/Menu_V3`.
- Source of truth: `main`.
- Product: Menu V3, Arabic-first bilingual multi-tenant digital-menu SaaS for restaurants and cafes.

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
- Noir full visual/layout/image/theme refinement — IMPLEMENTATION IN PROGRESS on branch `feat/noir-full-refinement`; PR #24 is open as a draft; browser/device evidence remains pending.
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
- W16 QA, Browser/Device, and Release — `IN_PROGRESS / DEPLOYMENT_BLOCKED`; final merged visual refinements are not yet verified as production-deployed.
- W17 Public Pages & Themes Integration — `IN_PROGRESS`; Noir refinement is the current atomic visual task.

## Noir Full Refinement — 2026-09-07
- VERIFIED: target theme is `noir`, template family `fine-dining-hospitality`, public route `/m/$slug` and `/m/$slug/$branch`, preview route `/themes/preview?theme=noir`.
- VERIFIED: the existing Noir template rendered a custom hero/featured presentation and then mounted the shared `PublicMenuView`, producing a second public-menu shell below it.
- VERIFIED: `PublicMenuView` remains the shared owner of search, category navigation, product details, cart/order, pricing, and configured WhatsApp/phone/map/Instagram actions.
- VERIFIED: Noir had three overlapping visual layers (`theme-noir.css`, `theme-refinements.css`, `theme-refinements-v2.css`) with competing card geometries, item-position transforms, alternating radii, different image heights, and motion decoration.
- VERIFIED: supplied screenshots show first-screen density, image/card imbalance, and visual noise consistent with those source-level defects.
- VERIFIED: `src/components/templates/fine-dining-hospitality.tsx` now keeps the Noir hero/featured identity, delegates interaction to the shared renderer, and removes the duplicate template-level visit event.
- VERIFIED: `src/theme-noir-hardening.css` provides a final scoped Noir presentation layer that hides only duplicate inner chrome, stabilizes `4 / 3` media, removes card staggering/ornamental transforms, and preserves safe-area action spacing and RTL/LTR geometry.
- VERIFIED: `src/routes/__root.tsx` loads the Noir hardening layer after the existing Noir refinement layers.
- VERIFIED: `tests/noir-browser-hardening.test.mjs` protects the new shell, media, RTL/safe-area, and stylesheet-order contracts and is registered in the default test suite.
- VERIFIED: `docs/template-audits/noir-full-refinement.md` records the full evidence audit, decisions, acceptance criteria, and verification plan.
- VERIFIED: PR #24 is open as a draft from `feat/noir-full-refinement` to `main`.
- VERIFIED: no database schema, auth/authz, subscriptions, tenant/branch isolation, dependency, CI/CD, Vercel configuration, environment variable, or deployment behavior was intentionally changed.
- VERIFIED: no Vercel deployment was intentionally triggered.
- UNKNOWN: local Git working-tree status cannot be inspected through the available GitHub connector surface.
- UNKNOWN: typecheck, default test suite, lint, production build, performance audit, and Playwright browser QA have not yet produced a visible run for PR #24 in this connector session.
- UNKNOWN: physical-device rendering and the causal source of the muted/covered state in supplied screenshot 2 remain unverified.

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
### W17-Q — Verify the Noir refinement and run the complete public-pages/themes quality gate
Objective: verify PR #24 with the complete repository quality suite and browser/device QA, inspect the final diff, resolve only evidence-backed Noir defects, and then record deployment status without claiming production deployment until the commit match is verified.

Acceptance criteria:
- `npm run typecheck` passes;
- `npm test` passes including `tests/noir-browser-hardening.test.mjs` and existing public-menu resilience/theme contracts;
- `npm run lint` passes;
- `npm run build` passes;
- `npm run qa:template` and the all-theme browser QA pass where applicable;
- Noir Arabic RTL, English LTR, small/standard/large mobile, tablet/desktop, mixed-direction content, long names, varied SAR prices, missing/mixed images, sparse/dense categories, fixed actions, product dialog, cart/order, and preview state are verified to the extent supported by the environment;
- no Essential, Editorial, Heritage, or Gallery regression is introduced;
- final diff contains only Noir refinement plus required continuity/test evidence;
- remaining UNKNOWN/BLOCKED items are explicitly recorded;
- production status is recorded separately from implementation status and is not called DEPLOYED without Vercel evidence.

Verification: GitHub Actions quality evidence, browser/visual evidence, final diff review, and Vercel deployment evidence where available.

## Session Log — 2026-09-07 — Noir Design Agent Full Refinement
- VERIFIED: repository source, design-agent contract, design intelligence, template checklist, project memory, theme registry, public renderer, route/theme bootstrap, CSS load order, existing Noir refinement layers, and current task state were inspected before implementation.
- VERIFIED: supplied 695×1536 mobile screenshots were reviewed as visual evidence; exact physical device/browser identity is UNKNOWN.
- VERIFIED: duplicate Noir presentation shell and overlapping Noir card geometry were identified as the principal source-level causes of the observed layout imbalance and visual noise.
- VERIFIED: `feat/noir-full-refinement` was created from `main` and PR #24 was opened as a draft so repository quality automation can verify the coherent batch without merging or intentionally deploying.
- VERIFIED: changed files are limited to the Noir template, Noir hardening CSS, root stylesheet loading, Noir regression test registration, and the required Noir audit document.
- VERIFIED: no Vercel deployment was intentionally triggered.
- UNKNOWN: GitHub workflow run evidence is not yet exposed for the current PR head through the available connector surface.
- UNKNOWN: browser/device pixel closure remains pending.
- UNKNOWN: screenshot 2's muted/covered layer remains unproven as a Noir application defect.
- Next task: run/inspect the complete W17-Q quality and browser evidence for PR #24; fix only remaining evidence-backed Noir defects, then stop without starting another template.
