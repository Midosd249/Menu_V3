# Menu V3 — Active Plan

## Status
- Status: IN_PROGRESS.
- Repository: `Midosd249/Menu_V3`.
- Canonical branch: `main`.
- Source of truth: `main`.
- Current verified implementation head before this feature: `a7b9fce63257a38eb80ac36a4ab0fb00d2e188ed`.
- Current verified Production deployment serves the same commit.
- Premium Theme System — DONE / VERIFIED / MERGED.
- Essential, Editorial, Noir, Heritage, and Gallery — protected.
- Permanent visual/functional/research quality workflow — DONE / VERIFIED.
- P0 Public Order Hardening — DONE / VERIFIED.
- P1 Production/Continuity Hardening — DONE for implemented scope; release-hygiene follow-ups remain.
- P2 Growth & Differentiation — DONE / VERIFIED / DEPLOYED.
- W16 QA, Browser/Device, and Release — IN_PROGRESS / HUMAN-DEVICE-VERIFICATION-REMAINING.
- Current active atomic task: Platform Admin Operations Center.

## Canonical Backend Identity
- VERIFIED: Supabase project ref `ublxptcqefujkbeepylc`.
- VERIFIED: canonical database schema is `menu_v3`.
- VERIFIED: Menu V3 is separated from legacy application data by schema boundary.

## Current Strategic Direction
Build Menu V3 as a distinctive `Premium Arabic-first Restaurant Presence Platform`: live menu + branded web presence + direct customer action + owner operations + local discoverability, while preserving existing architecture and completed work.

## Master Design Strategy
Complete roadmap: `docs/design-strategy-master-plan.md`.
Workstreams W0–W17 remain historical roadmap context. Completed implementation is not reopened merely because the roadmap remains present.

## Permanent Specialist Workflows
- VERIFIED: `docs/agents/design-agent.md` defines the specialist workflow for significant visual, image, layout, theme, and site-consistency work.
- VERIFIED: `docs/agents/research-connected-tools-agent.md` defines repository-first dynamic research/discovery for consequential or unfamiliar work.
- VERIFIED: `docs/automatic-specialist-routing.md` defines automatic routing/orchestration.
- VERIFIED: all specialist roles are internal AI workflows; the user remains the sole human owner and primary developer.

## P0/P1/P2 Current Evidence
### P0 — Public Order Hardening
- VERIFIED: database-backed public-order rate limiting and idempotency are implemented.
- VERIFIED: server-side product, availability, variant, modifier, quantity, note, tenant, and price validation remains authoritative.
- VERIFIED: legacy sensitive RPC execution is closed to `anon` and `authenticated` in the canonical live database inspection.

### P1 — Production/Continuity Hardening
- VERIFIED: continuity, release, security, and deployment evidence was reconciled against current repository/platform state.
- OPEN: package manifest / lockfile reconciliation for deterministic `npm ci` installation.
- OPEN: `main` branch protection / required status checks.
- No speculative dependency upgrade is authorized.

### P2 — Growth & Differentiation — COMPLETED / VERIFIED / DEPLOYED
- VERIFIED: advanced analytics storytelling is implemented using the canonical owner analytics source.
- VERIFIED: local visibility readiness uses only verified tenant/branch fields and does not claim Google ranking.
- VERIFIED: experimentation is hypothesis-led and does not invent results or statistical significance.
- VERIFIED: no second analytics event source was introduced.
- VERIFIED: `tests/p2-growth-differentiation.test.mjs` protects the P2 contracts.
- VERIFIED: GitHub Quality run `1174` passed.
- VERIFIED: current Production deployment serves `a7b9fce63257a38eb80ac36a4ab0fb00d2e188ed`.

## Protected Completed Work
- Essential, Editorial, Noir, Heritage, and Gallery implementation milestones are protected.
- Shared public-menu behavior, customer actions, authentication, authorization, tenant/branch isolation, routing, migrations, and deployment controls remain protected.
- Quick Add, Item Notes, Cart, canonical public rendering, and customer action surfaces remain protected.
- Do not create a sixth theme as a substitute for product/design strategy.

## Active Atomic Task — Platform Admin Operations Center
### Objective
Turn `/admin` into a practical platform-owner operations workspace, especially for incoming orders, without weakening tenant isolation or destroying historical data.

### Required scope
1. Dedicated `الطلبات` navigation entry and overview entry point.
2. Cross-tenant order search by restaurant, customer, phone, and order number.
3. Status filtering and server-authorized status transitions.
4. Order detail view with items, options, notes, source, totals, restaurant, and branch.
5. Contact actions only when verified customer data exists: phone, WhatsApp, email.
6. Safe removal from the operational board through reversible archive, not hard delete.
7. Archived orders excluded from operational order views for both platform and restaurant owner surfaces.
8. Open-order count/badge stays consistent with archived state and status changes.
9. Regression coverage for auth boundary, archive semantics, contact actions, and operational filtering.

### Safety rules
- All platform order operations require `requirePlatformAdmin` server-side authorization.
- Never trust client-supplied tenant, role, or privilege.
- Do not hard-delete order history.
- Preserve order items and status events.
- Do not modify Quick Add, Item Notes, Cart, pricing, checkout/order validation, or theme behavior.

### Evidence
- Audit: `docs/audits/2026-09-09-admin-operations-audit.md`.
- Regression: `tests/admin-operations.test.mjs`.
- Migration: `migrations/20260909001000_order_archive_operations.sql`.

## W16 — Human Device & Manual Accessibility Gate
### Objective
Close the remaining direct-observation gap against the current Production build without reopening completed implementation.

### Required checks
1. Real Android production menu verification.
2. iOS verification when available.
3. Small, standard, and large mobile widths where practical.
4. Arabic RTL, English LTR, and mixed-direction content.
5. Long names, varied SAR prices, missing/mixed images, sparse/dense categories, and sold-out states where applicable.
6. Product details, Quick Add, Item Notes, Cart open/closed, order flow, sticky/floating actions, safe areas, and scrolling.
7. Manual screen-reader/focus checks where supported.
8. QR-camera scanning.
9. Reproducible defect capture with device/browser/viewport/evidence/severity/root-cause hypothesis.
10. No theme/architecture change unless a defect is reproduced and independently scoped.

### Acceptance criteria
- Current Production behavior is directly observed on supported physical devices.
- Any defect is either fixed through a separate atomic task or explicitly recorded with severity and disposition.
- No UNKNOWN item is silently converted into VERIFIED.
- Completed theme work remains protected unless direct evidence requires reopening it.

## Post-W16 Release Hygiene
### P1-H1 — package manifest / lockfile reconciliation
- Reconcile `package.json` and `package-lock.json` in a writable npm environment.
- Run the complete quality gate after regeneration.
- Do not upgrade dependencies unless separately justified.

### P1-H2 — main branch protection
- Owner enables required status checks and branch protection for `main`.
- Verify the resulting ruleset/protection state directly.

## P2-H1 — Small Analytics UX Improvement
- INFERRED: Local Visibility readiness is currently hidden when analytics has no events because the analytics content is gated by `hasData`.
- PROPOSED: expose the readiness check independently from analytics event availability.
- This is a separate atomic UX task.

## Release-Only Vercel Policy
Normal release path:

**LOCAL DEVELOPMENT → LOCAL QA → LOCAL BROWSER / VISUAL QA → TESTS → GITHUB ACTIONS QUALITY GATES → DIFF REVIEW → ONE COHERENT RELEASE BATCH → MERGE TO MAIN → ONE VERCEL PRODUCTION DEPLOYMENT → REAL-DEVICE PRODUCTION QA → RECORD RESULT**

- Do not use Vercel for ordinary CSS/theme iteration.
- Do not intentionally trigger repeated Preview/Production deployments.
- CI success is not deployment evidence.
- `DEPLOYED` requires direct Vercel evidence.
- Do not redeploy until the current release batch is fully verified.

## Research Governance
- Repository evidence is primary.
- Use connected tools dynamically only when relevant, authorized, safe, and materially useful.
- Prefer official/primary sources and maintained standards for external research.
- Preserve evidence labels: `VERIFIED`, `INFERRED`, `PROPOSED`, `UNKNOWN`, `BLOCKED`.
- Record material research and audits persistently.

## Exact Next TODO
### Admin Operations Center — verification and release
1. Inspect the branch CI quality gate.
2. Fix only reproducible failures caused by this atomic task.
3. Review the final diff and security/data boundaries.
4. Create one coherent PR to `main` after quality passes.
5. Merge only with green CI evidence.
6. Verify the resulting single Production deployment separately.
7. Perform real-device/admin smoke verification when available.
8. Return to W16 physical-device verification.

## Continuity Rule
At the end of every atomic task:
1. reconcile current Git head;
2. verify CI evidence;
3. verify deployment separately when relevant;
4. update `PROJECT_STATE.md`, `PLAN.md`, and `TASKS.md`;
5. update the audit/research/project-memory record when material;
6. record one exact next task;
7. stop.
