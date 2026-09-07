# TASKS

## Completed Tasks

### W13 — Trust, Security, and Data Ownership — CLOSED / VERIFIED
- VERIFIED: public/private tenant boundaries, authenticated middleware, tenant/branch predicates, platform-admin fail-closed behavior, and security regression coverage remain protected.
- VERIFIED: Quality Gate `34050857106` passed all required steps.
- Evidence: `docs/security-w13-trust-data-ownership.md`.

### P0 — Runtime Public Content Propagation — CLOSED / VERIFIED
- VERIFIED: `menu_v3` revision propagation, tenant/branch-safe cache keying, cross-tenant isolation, and regression coverage were completed.
- VERIFIED: Quality Gate `34007481599` passed.
- UNKNOWN: direct authenticated Owner UI -> Public HTTP cache behavior remains unexercised.

### Project Infrastructure Identity — CLOSED / VERIFIED
- VERIFIED: Supabase project ref `ublxptcqefujkbeepylc`, canonical schema `menu_v3`, and legacy/public schema separation.
- Evidence: `docs/project-infrastructure.md`.

### W6 — Typography Evidence & Decision — CLOSED / VERIFIED
- VERIFIED: typography evaluation completed; IBM Plex Sans Arabic + IBM Plex Sans selected as default, with documented alternatives.
- Evidence: `docs/design-intelligence.md`.

### W6-01 — Typography Implementation — CLOSED / VERIFIED
- VERIFIED: semantic typography contract, pinned Fontsource delivery, loading order, and regression coverage are implemented.
- VERIFIED: Quality Gate `34009000701` passed.
- Evidence: `docs/typography-implementation-status.md`.

### W7 — Color / Surface / Contrast System — CLOSED / VERIFIED
- VERIFIED: semantic color/surface roles, five-theme adapters, contrast/focus/reduced-motion behavior, and contract tests are implemented.
- VERIFIED: Quality Gate `34009000701` passed.
- Evidence: `docs/color-system-implementation-status.md`.

### W8 — Imagery and Art Direction — CLOSED / VERIFIED
- VERIFIED: image roles, 4:3 dish/card framing, focal-point hooks, fallbacks, accessibility, licensing/provenance, and safe media loading are documented/protected.
- VERIFIED: Quality Gate `34010117079` passed.
- UNKNOWN: tenant-specific focal-point metadata is not part of the canonical data model.
- Evidence: `docs/image-art-direction.md`.

### W9 — Motion and Interaction — CLOSED / VERIFIED
- VERIFIED: motion tokens, deterministic RTL-aware choreography, reduced-motion behavior, and regression coverage are implemented.
- VERIFIED: Quality Gate `34010117079` passed.
- Evidence: `docs/motion-implementation.md`.

### W10 — Accessibility and RTL Quality — CLOSED / VERIFIED
- VERIFIED: shared accessibility primitives, focus behavior, bidi handling, dialogs, order controls, and regression coverage are implemented.
- VERIFIED: Quality Gate `34010619265` passed.
- UNKNOWN: direct screen-reader output and authenticated Owner keyboard traversal were not manually observed.
- Evidence: `docs/accessibility-rtl-quality.md`.

### W11 — SEO, Local Discovery, and Shareability — CLOSED / VERIFIED
- VERIFIED: canonical URLs, Arabic-first locale behavior, alternates, noindex preview behavior, Restaurant structured data, share metadata, robots, sitemap, and discovery tests are protected.
- VERIFIED: Quality Gate `34013074378` passed.
- Evidence: `docs/seo-local-discovery-shareability.md`.

### W12-01 — Public Menu Hydration Performance — CLOSED / VERIFIED
- VERIFIED: SSR `initialMenu` avoids the avoidable duplicate public-menu request while preserving client fallback behavior.
- VERIFIED: Quality Gate `34013861903` passed.
- UNKNOWN: production RUM does not quantify the real-user reduction.

### W12-02 — Public Menu Resource & Bundle Efficiency — CLOSED / VERIFIED
- VERIFIED: critical font resource hints and regression protection are implemented.
- VERIFIED: Quality Gate `34014895325` passed.
- Evidence: `docs/performance-public-menu-resources.md`.

### W12-03 — Reliability and Failure-Path Audit — CLOSED / VERIFIED
- VERIFIED: bounded retry/timeout policy, terminal failure behavior, and tenant/branch-safe caching are protected.
- VERIFIED: Quality Gate `34015320658` passed.
- UNKNOWN: production RUM for retry/timeout frequency is unavailable.
- Evidence: `docs/reliability-failure-path-audit.md`.

### W14 — Pricing, Packaging, and Commercial UX — CLOSED / VERIFIED / MERGED
- VERIFIED: commercial catalog, bilingual pricing, operational limits, five-theme availability, authenticated usage display, and regression coverage are implemented.
- VERIFIED: Quality Gate `34052577671` passed.
- VERIFIED: W14 then-head deployment status was `success` for `d1bfd7ea1d7cbd225bde923850827cd25f80b064`.
- UNKNOWN: payment collection/billing automation remains outside W14.

### W15 — Growth, Analytics, and Experimentation — CLOSED / VERIFIED
- VERIFIED: event taxonomy remains exactly `visit`, `qr_scan`, `product_view`, `whatsapp`; denominator-safe ratios and opportunity classification are implemented.
- VERIFIED: no third-party analytics SDK or schema migration was introduced.
- VERIFIED: Quality Gate `34053348446` passed all required steps.
- UNKNOWN: retention, revenue attribution, statistical significance, and true order conversion remain unavailable.
- Evidence: `docs/growth-w15-analytics-experimentation.md`.

### W16 — QA, Browser/Device, and Release — IN_PROGRESS / DEPLOYMENT_BLOCKED
- VERIFIED: W14/W15 regression gates remain green.
- VERIFIED: current `main` GitHub status exposes a Vercel `failure` target pointing to `upgradeToPro=build-rate-limit`.
- BLOCKED: this is a Vercel/provider capacity or plan limitation, not evidence of application build failure.
- UNKNOWN: current Vercel production deployment identity and deployed-commit match are not directly verifiable through the available Vercel surface.
- UNKNOWN: physical-device rendering, manual screen-reader output, authenticated Owner keyboard traversal, QR-camera scanning, and Opera-specific behavior.
- Production is not marked `DEPLOYED` without direct Vercel evidence.

### W17-Q — Public Menu Hardening Subtask — COMPLETED / MERGED
- VERIFIED: image-failure fallback and empty-hours placeholder defects were corrected.
- VERIFIED: regression coverage exists in `tests/public-menu-resilience.test.mjs`.
- VERIFIED: PR #21 merged to `main` as `b0a06dbeca47779f371e118beed6d62b6b63c21c`.

### Noir Full Refinement — COMPLETED / MERGED
- VERIFIED: PR #24 is MERGED; merge commit `d2401a9276719bdab4305f89160aba2ca15f0b58`.
- VERIFIED: Noir custom hero/featured identity, shared interaction ownership, RTL/LTR, safe-area behavior, stable media geometry, and removal of duplicate/ornamental card behavior are recorded in the implementation evidence.
- VERIFIED: `tests/noir-browser-hardening.test.mjs` protects the implemented contracts.
- UNKNOWN: physical-device rendering and manual screen-reader output remain unobserved.
- Evidence: `docs/template-audits/noir-full-refinement.md`.

### W17-Q — Public Theme Quality Recovery — COMPLETED / MERGED
- VERIFIED: PR #26 is MERGED; merge commit `219f79024fec088c6a9e2e1bd050d6fe2e394e91`.
- VERIFIED: Quality Gate `34080681231` passed `161/161` tests with zero failures and zero skips.
- VERIFIED: all five canonical themes passed Browser Template QA across mobile, tablet, and desktop.
- VERIFIED: browser runtime console errors `0`; horizontal overflow `0px`.
- VERIFIED: typecheck, tests, lint, production build, Playwright Chromium, all-theme browser QA, performance baseline upload, and preview shutdown all completed successfully.
- UNKNOWN: physical-device rendering and manual screen-reader output remain unverified.
- Evidence: `docs/sessions/2026-09-07-w17-q-closure.md`.

### Gallery Latest Refinement — COMPLETED / VERIFIED
- VERIFIED: `e21c14fe337f820c371539b09d086b114216da94` — `fix(gallery): show one featured item at a time`.
- VERIFIED: `7d57bb0eb6dc5a5bf2198dc5b3219d0628973882` — `test(gallery): lock single featured presentation`.
- VERIFIED: `bd84d9f663e74eb166c3ad8d89a97521d0c66ce5` — `docs(gallery): record single featured item refinement`.
- VERIFIED: Gallery now presents one image-led featured item at a time with responsive media geometry.

## Protected Scope
- Essential, Editorial, Noir, Heritage, and Gallery implementation milestones are protected.
- Shared public-menu behavior, customer actions, authentication, authorization, tenant/branch isolation, routing, migrations, and deployment controls remain protected.
- Do not create a sixth theme as a substitute for product/design strategy.

## Master Design Strategy
The cross-functional roadmap is recorded in `docs/design-strategy-master-plan.md`. Workstreams W0–W17 remain historical roadmap context; completed implementation is not active merely because its roadmap entry exists.

## Design Agent — Permanent Workflow
- VERIFIED: `docs/agents/design-agent.md` defines the specialist workflow for visual/layout/image/theme/site-consistency work.
- VERIFIED: architecture, data, auth/authz, entitlements, subscriptions, tenant/branch isolation, CI/CD, Vercel, deployment, and general product logic remain outside that specialist scope.

## UNKNOWN / BLOCKED Register
- UNKNOWN: physical-device rendering and manual screen-reader output.
- UNKNOWN: authenticated Owner keyboard traversal, QR-camera scanning, and Opera-specific behavior.
- UNKNOWN: current Vercel production deployment identity and commit match.
- BLOCKED: current Vercel GitHub status reports `build-rate-limit` for the current `main` head; this is a provider/platform limitation.

## Exact Next TODO
### Editorial browser/device verification against the latest refinement state
- Verify the existing Editorial refinement using the supported browser viewport matrix and record evidence.
- Do not begin new theme refinement or alter product architecture unless new evidence requires it.
- Keep production deployment verification separate from implementation verification.

## Reconciliation — 2026-09-07
- VERIFIED: PR #24 and PR #26 are MERGED.
- VERIFIED: W17-Q Quality Gate `34080681231` is green with `161/161` tests, zero failures, zero skips, all five themes browser-tested on mobile/tablet/desktop, zero console errors, and `0px` horizontal overflow.
- VERIFIED: latest Gallery refinement is on `main`.
- VERIFIED: stale Noir/W17-Q active-state claims are reclassified; deployment remains separate from implementation and CI evidence.
- VERIFIED: remaining device/manual checks remain UNKNOWN rather than being converted into completion claims.
