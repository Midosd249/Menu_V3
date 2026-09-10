# TASKS

## Completed Tasks

### P0 — Public Order Hardening — CLOSED / VERIFIED
- VERIFIED: database-backed public-order rate limiting and idempotency are implemented.
- VERIFIED: server-side product, availability, variant, modifier, quantity, note, tenant, and price validation remains authoritative.
- Evidence: `docs/sessions/2026-09-09-p0-p1-final-verification.md`.

### P1 — Production/Continuity Hardening — CLOSED / VERIFIED for implemented scope
- VERIFIED: P0/P1 security and continuity work is present on the current main line.
- VERIFIED: deployment identity is directly verified separately from CI.
- CLOSED: package manifest / lockfile reconciliation for deterministic `npm ci` installation.
- OPEN FOLLOW-UP: GitHub `main` branch protection / required status checks.
- No speculative dependency upgrade is authorized.
- Evidence: PR #57, GitHub Actions run `34451068766`, and `docs/audits/2026-09-09-continuity-reconciliation.md`.

### P2 — Growth & Differentiation — CLOSED / VERIFIED / DEPLOYED
- VERIFIED: advanced analytics storytelling is implemented from the canonical owner analytics source.
- VERIFIED: local visibility readiness uses verified tenant/branch fields only and does not claim Google ranking.
- VERIFIED: experimentation is hypothesis-led and does not invent measured significance.
- VERIFIED: no second analytics event source was introduced.
- VERIFIED: `tests/p2-growth-differentiation.test.mjs` protects the P2 contracts.

### W13 — Trust, Security, and Data Ownership — CLOSED / VERIFIED
- VERIFIED: public/private tenant boundaries, authenticated middleware, tenant/branch predicates, platform-admin fail-closed behavior, and security regression coverage remain protected.

### P0 — Runtime Public Content Propagation — CLOSED / VERIFIED
- VERIFIED: `menu_v3` revision propagation, tenant/branch-safe cache keying, cross-tenant isolation, and regression coverage were completed.

### Project Infrastructure Identity — CLOSED / VERIFIED
- VERIFIED: Supabase project ref `ublxptcqefujkbeepylc`, canonical schema `menu_v3`, and legacy/public schema separation.

### W6 — Typography Evidence & Decision — CLOSED / VERIFIED
- VERIFIED: typography evaluation completed; IBM Plex Sans Arabic + IBM Plex Sans selected as default, with documented alternatives.

### W6-01 — Typography Implementation — CLOSED / VERIFIED
- VERIFIED: semantic typography contract, pinned Fontsource delivery, loading order, and regression coverage are implemented.

### W7 — Color / Surface / Contrast System — CLOSED / VERIFIED
- VERIFIED: semantic color/surface roles, five-theme adapters, contrast/focus/reduced-motion behavior, and contract tests are implemented.

### W8 — Imagery and Art Direction — CLOSED / VERIFIED
- VERIFIED: image roles, 4:3 dish/card framing, focal-point hooks, fallbacks, accessibility, licensing/provenance, and safe media loading are documented/protected.
- UNKNOWN: tenant-specific focal-point metadata is not part of the canonical data model.

### W9 — Motion and Interaction — CLOSED / VERIFIED
- VERIFIED: motion tokens, deterministic RTL-aware choreography, reduced-motion behavior, and regression coverage are implemented.

### W10 — Accessibility and RTL Quality — CLOSED / VERIFIED
- VERIFIED: shared accessibility primitives, focus behavior, bidi handling, dialogs, order controls, and regression coverage are implemented.
- UNKNOWN: direct screen-reader output and authenticated Owner keyboard traversal remain unobserved.

### W11 — SEO, Local Discovery, and Shareability — CLOSED / VERIFIED
- VERIFIED: canonical URLs, Arabic-first locale behavior, alternates, noindex preview behavior, Restaurant structured data, share metadata, robots, sitemap, and discovery tests are protected.

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

### W16 — QA, Browser/Device, and Release — CLOSED FOR CURRENT EXECUTION / OWNER-ACCEPTED
- VERIFIED: CI/browser quality evidence remains green.
- OWNER-ACCEPTED: latest direct-device results are accepted for the current milestone.
- RULE: do not reopen completed implementation without reproducible defect evidence.

### W17-Q — Public Theme Quality Recovery — COMPLETED / MERGED
- VERIFIED: all five canonical themes passed Browser Template QA across mobile, tablet, and desktop in the recorded quality gate.

### Noir Full Refinement — COMPLETED / MERGED
- VERIFIED: PR #24 is MERGED; merge commit `d2401a9276719bdab4305f89160aba2ca15f0b58`.

### Gallery Latest Refinement — COMPLETED / VERIFIED
- VERIFIED: Gallery presents one image-led featured item at a time with responsive media geometry.

## Current Active Task

### P1-H2 — GitHub main branch protection — OPEN / OWNER ACTION
- Objective: enforce the required quality gate and minimum appropriate branch protection on `main`.
- Scope: repository settings only; no application code, dependency, theme, auth, database, or product behavior changes.
- VERIFIED: `main` currently reports `protected: false`; required status checks are off; repository rulesets collection is empty (`[]`).
- VERIFIED: the relevant GitHub Actions check is named `quality`.
- BLOCKED: the installed GitHub connector cannot perform the administration-level branch-protection write because the required administration endpoint is not exposed by the managed connection.
- OWNER ACTION: configure the minimum protection in GitHub repository settings, then re-read and verify it directly.
- Acceptance: exact protection/ruleset state and required checks are directly verified and documented.

## Closed Task Evidence — P1-H1
- VERIFIED: npm regenerated `package-lock.json` from the current `package.json` in GitHub Actions.
- VERIFIED: `npm ci --ignore-scripts --dry-run` passed before commit.
- VERIFIED: PR #57 merged to `main` as `65314826bdb652c541d66071ea9d2401067f35d2`.
- VERIFIED: final PR diff contained only `package-lock.json`; temporary reconciliation workflow was removed before merge.
- VERIFIED: final quality run passed install, route tree generation, typecheck, tests, lint, build, Playwright browser QA, performance baseline, and cleanup.

## Open Follow-ups — Not Current Task

### P2-H1 — Analytics no-data UX
- INFERRED: Local Visibility readiness is hidden when analytics has no events because the current analytics content is gated by `hasData`.
- PROPOSED: expose Local Visibility readiness independently from analytics event availability.
- This must remain a separate atomic UX task.

## Protected Scope
- Essential, Editorial, Noir, Heritage/Taste, and Gallery implementation milestones are protected.
- Shared public-menu behavior, customer actions, authentication, authorization, tenant/branch isolation, routing, migrations, and deployment controls remain protected.
- Quick Add, Item Notes, Cart, canonical public rendering, and customer action surfaces remain protected.
- Do not create a sixth theme as a substitute for product/design strategy.
- Do not repeat Manus-completed work unless a current reproducible defect is proven.

## Permanent Specialist Workflows
- VERIFIED: `docs/agents/design-agent.md` is the Design workflow for significant visual/layout/image/theme/site-consistency work.
- VERIFIED: `docs/agents/research-connected-tools-agent.md` is the repository-first dynamic research workflow.
- VERIFIED: `docs/automatic-specialist-routing.md` is the routing/orchestration contract.
- VERIFIED: `docs/project-memory/manus-engineering-lessons.md` records durable Manus execution lessons.
- All specialist roles are internal AI workflows; the user remains the sole human owner and primary developer.

## UNKNOWN / BLOCKED Register
- UNKNOWN/BLOCKED: some physical-device/accessibility observations remain unavailable in the connector environment.
- UNKNOWN: current Production deployment identity for the post-P1-H1 `main` documentation commits until direct Vercel evidence is inspected.
- BLOCKED: GitHub `main` branch protection configuration through the current managed connector.

## Exact Next TODO
### P1-H2 — GitHub main branch protection
1. Owner enables the documented minimum protection/ruleset for `main`.
2. Re-read the protection/ruleset state directly.
3. Confirm `quality` is required and force-push/delete protections are active.
4. Record the verified result.
5. Close P1-H2 only after direct verification.
6. Do not start P2-H1 automatically.

## Continuity Rule
At the end of each atomic task, reconcile current Git/CI/deployment evidence, update continuity and material audit/research/memory records, record exactly one next task, and stop.
