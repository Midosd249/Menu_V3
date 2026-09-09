# TASKS

## Completed Tasks

### P0 — Public Order Hardening — CLOSED / VERIFIED
- VERIFIED: database-backed public-order rate limiting and idempotency are implemented.
- VERIFIED: server-side product, availability, variant, modifier, quantity, note, tenant, and price validation remains authoritative.
- VERIFIED: legacy sensitive RPC execution is closed to `anon` and `authenticated` in the canonical live database inspection.
- Evidence: `docs/sessions/2026-09-09-p0-p1-final-verification.md`.

### P1 — Production/Continuity Hardening — CLOSED / VERIFIED for implemented scope
- VERIFIED: P0/P1 security and continuity work is present on the current main line.
- VERIFIED: deployment identity is directly verified separately from CI.
- OPEN FOLLOW-UP: package manifest / lockfile reconciliation for deterministic `npm ci` installation.
- OPEN FOLLOW-UP: GitHub `main` branch protection / required status checks.
- No speculative dependency upgrade is authorized.
- Evidence: `docs/sessions/2026-09-09-p0-p1-final-verification.md` and `docs/audits/2026-09-09-continuity-reconciliation.md`.

### P2 — Growth & Differentiation — CLOSED / VERIFIED / DEPLOYED
- VERIFIED: advanced analytics storytelling is implemented from the canonical owner analytics source.
- VERIFIED: local visibility readiness uses verified tenant/branch fields only and does not claim Google ranking.
- VERIFIED: experimentation is hypothesis-led and does not invent measured significance.
- VERIFIED: no second analytics event source was introduced.
- VERIFIED: `tests/p2-growth-differentiation.test.mjs` protects the P2 contracts.
- VERIFIED: GitHub Quality run `1174` passed.
- VERIFIED: current Vercel Production serves `a7b9fce63257a38eb80ac36a4ab0fb00d2e188ed`.
- Evidence: `docs/sessions/2026-09-09-p2-growth-differentiation.md` and `docs/audits/2026-09-09-continuity-reconciliation.md`.

### W13 — Trust, Security, and Data Ownership — CLOSED / VERIFIED
- VERIFIED: public/private tenant boundaries, authenticated middleware, tenant/branch predicates, platform-admin fail-closed behavior, and security regression coverage remain protected.
- Evidence: `docs/security-w13-trust-data-ownership.md`.

### P0 — Runtime Public Content Propagation — CLOSED / VERIFIED
- VERIFIED: `menu_v3` revision propagation, tenant/branch-safe cache keying, cross-tenant isolation, and regression coverage were completed.

### Project Infrastructure Identity — CLOSED / VERIFIED
- VERIFIED: Supabase project ref `ublxptcqefujkbeepylc`, canonical schema `menu_v3`, and legacy/public schema separation.
- Evidence: `docs/project-infrastructure.md`.

### W6 — Typography Evidence & Decision — CLOSED / VERIFIED
- VERIFIED: typography evaluation completed; IBM Plex Sans Arabic + IBM Plex Sans selected as default, with documented alternatives.
- Evidence: `docs/design-intelligence.md`.

### W6-01 — Typography Implementation — CLOSED / VERIFIED
- VERIFIED: semantic typography contract, pinned Fontsource delivery, loading order, and regression coverage are implemented.
- Evidence: `docs/typography-implementation-status.md`.

### W7 — Color / Surface / Contrast System — CLOSED / VERIFIED
- VERIFIED: semantic color/surface roles, five-theme adapters, contrast/focus/reduced-motion behavior, and contract tests are implemented.
- Evidence: `docs/color-system-implementation-status.md`.

### W8 — Imagery and Art Direction — CLOSED / VERIFIED
- VERIFIED: image roles, 4:3 dish/card framing, focal-point hooks, fallbacks, accessibility, licensing/provenance, and safe media loading are documented/protected.
- UNKNOWN: tenant-specific focal-point metadata is not part of the canonical data model.
- Evidence: `docs/image-art-direction.md`.

### W9 — Motion and Interaction — CLOSED / VERIFIED
- VERIFIED: motion tokens, deterministic RTL-aware choreography, reduced-motion behavior, and regression coverage are implemented.
- Evidence: `docs/motion-implementation.md`.

### W10 — Accessibility and RTL Quality — CLOSED / VERIFIED
- VERIFIED: shared accessibility primitives, focus behavior, bidi handling, dialogs, order controls, and regression coverage are implemented.
- UNKNOWN: direct screen-reader output and authenticated Owner keyboard traversal remain unobserved.
- Evidence: `docs/accessibility-rtl-quality.md`.

### W11 — SEO, Local Discovery, and Shareability — CLOSED / VERIFIED
- VERIFIED: canonical URLs, Arabic-first locale behavior, alternates, noindex preview behavior, Restaurant structured data, share metadata, robots, sitemap, and discovery tests are protected.
- Evidence: `docs/seo-local-discovery-shareability.md`.

### W12-01 — Public Menu Hydration Performance — CLOSED / VERIFIED
- VERIFIED: SSR `initialMenu` avoids the avoidable duplicate public-menu request while preserving client fallback behavior.

### W12-02 — Public Menu Resource & Bundle Efficiency — CLOSED / VERIFIED
- VERIFIED: critical font resource hints and regression protection are implemented.

### W12-03 — Reliability and Failure-Path Audit — CLOSED / VERIFIED
- VERIFIED: bounded retry/timeout policy, terminal failure behavior, and tenant/branch-safe caching are protected.

### W14 — Pricing, Packaging, and Commercial UX — CLOSED / VERIFIED / MERGED
- VERIFIED: commercial catalog, bilingual pricing, operational limits, five-theme availability, authenticated usage display, and regression coverage are implemented.

### W15 — Growth, Analytics, and Experimentation — CLOSED / VERIFIED
- VERIFIED: event taxonomy remains exactly `visit`, `qr_scan`, `product_view`, `whatsapp`; denominator-safe ratios and opportunity classification are implemented.
- UNKNOWN: retention, revenue attribution, statistical significance, and true order conversion remain unavailable.

### W16 — QA, Browser/Device, and Release — IN_PROGRESS / HUMAN-DEVICE-VERIFICATION-REMAINING
- VERIFIED: CI/browser quality evidence remains green.
- VERIFIED: current Production deployment identity and deployed commit match are directly verified.
- VERIFIED: no error/fatal Production runtime entries were returned in the inspected 24-hour query.
- UNKNOWN/BLOCKED: physical-device rendering, manual screen-reader output, authenticated Owner keyboard traversal, QR-camera scanning, and Opera-specific behavior.
- The remaining W16 gap is direct human/device observation, not deployment verification.

### W17-Q — Public Theme Quality Recovery — COMPLETED / MERGED
- VERIFIED: all five canonical themes passed Browser Template QA across mobile, tablet, and desktop in the recorded quality gate.
- VERIFIED: `161/161` tests passed with zero failures and zero skips.
- UNKNOWN: physical-device rendering and manual screen-reader output remain unverified.

### Noir Full Refinement — COMPLETED / MERGED
- VERIFIED: PR #24 is MERGED; merge commit `d2401a9276719bdab4305f89160aba2ca15f0b58`.
- UNKNOWN: physical-device rendering and manual screen-reader output remain unobserved.

### Gallery Latest Refinement — COMPLETED / VERIFIED
- VERIFIED: Gallery now presents one image-led featured item at a time with responsive media geometry.

## Open Follow-ups — Not Current Task

### P1-H1 — package manifest / lockfile reconciliation
- TODO: reconcile `package.json` and `package-lock.json` in a writable npm environment.
- TODO: run the complete quality gate after regeneration.
- Constraint: no speculative dependency upgrades.

### P1-H2 — main branch protection
- TODO: owner enables required status checks and branch protection for `main`.
- VERIFIED: current connector can inspect protection state but cannot configure it.

### P2-H1 — Analytics no-data UX
- INFERRED: Local Visibility readiness is hidden when analytics has no events because the current analytics content is gated by `hasData`.
- PROPOSED: expose Local Visibility readiness independently from analytics event availability.
- This must remain a separate atomic UX task.

## Protected Scope
- Essential, Editorial, Noir, Heritage/Taste, and Gallery implementation milestones are protected.
- Shared public-menu behavior, customer actions, authentication, authorization, tenant/branch isolation, routing, migrations, and deployment controls remain protected.
- Quick Add, Item Notes, Cart, canonical public rendering, and customer action surfaces remain protected.
- Do not create a sixth theme as a substitute for product/design strategy.

## Permanent Specialist Workflows
- VERIFIED: `docs/agents/design-agent.md` is the Design workflow for significant visual/layout/image/theme/site-consistency work.
- VERIFIED: `docs/agents/research-connected-tools-agent.md` is the repository-first dynamic research workflow.
- VERIFIED: `docs/automatic-specialist-routing.md` is the routing/orchestration contract.
- All specialist roles are internal AI workflows; the user remains the sole human owner and primary developer.

## UNKNOWN / BLOCKED Register
- UNKNOWN/BLOCKED: real-device rendering and manual accessibility evidence.
- UNKNOWN/BLOCKED: QR-camera scanning and Opera-specific behavior.
- OPEN: package-lock reconciliation.
- OPEN: GitHub `main` branch protection.

## Exact Next TODO
### W16 — Human Device & Manual Accessibility Gate
1. Test current Production on real Android.
2. Test iOS when a supported device is available.
3. Cover small/standard/large mobile widths where practical.
4. Check Arabic RTL, English LTR, and mixed-direction content.
5. Check long names, varied SAR prices, missing/mixed images, sparse/dense categories, and sold-out states where applicable.
6. Check product details, Quick Add, Item Notes, Cart open/closed, ordering flow, sticky/floating controls, safe areas, and scrolling.
7. Perform manual screen-reader/focus checks where supported.
8. Verify QR-camera scanning.
9. Record reproducible defects with device/browser/viewport/evidence/severity/root-cause hypothesis.
10. Do not reopen completed themes or architecture unless a defect is reproduced.

## Continuity Rule
At the end of each atomic task, reconcile current Git/CI/deployment evidence, update continuity and material audit/research/memory records, record exactly one next task, and stop.
