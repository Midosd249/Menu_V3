# PROJECT STATE

## Identity
- Status: IN_PROGRESS.
- Repository: `Midosd249/Menu_V3`.
- Canonical branch: `main`.
- Source of truth: `main`.
- Current verified implementation head on `main`: `a7b9fce63257a38eb80ac36a4ab0fb00d2e188ed` — `feat: complete P2 growth differentiation slice`.
- Active work branch: `admin-operations-dashboard`.
- Product: Menu V3, Arabic-first bilingual multi-tenant digital-menu SaaS for restaurants and cafes.

## Canonical Backend Identity
- VERIFIED: Supabase project ref `ublxptcqefujkbeepylc`.
- VERIFIED: canonical database schema `menu_v3`.
- VERIFIED: Menu V3 is separated from legacy application data by schema boundary.
- VERIFIED: live database inspection on 2026-09-09 checked canonical function/table privileges and RLS state.
- Canonical infrastructure reference: `docs/project-infrastructure.md`.

## Current Verified Position — 2026-09-09
- VERIFIED: P0 public-order hardening is completed and protected.
- VERIFIED: P1 implemented production/continuity hardening is completed for its implemented scope; package/lockfile and branch-protection hygiene remain open.
- VERIFIED: P2 Growth & Differentiation is completed and present on `main` at `a7b9fce63257a38eb80ac36a4ab0fb00d2e188ed`.
- VERIFIED: P2 includes advanced analytics storytelling, local visibility readiness, and hypothesis-led experimentation without invented statistical significance.
- VERIFIED: `tests/p2-growth-differentiation.test.mjs` protects P2 contracts.
- VERIFIED: GitHub Quality run `1174` passed for the current P2 line.
- VERIFIED: current Vercel Production deployment is READY and serves `a7b9fce63257a38eb80ac36a4ab0fb00d2e188ed`.
- VERIFIED: no Production `error`/`fatal` runtime entries were returned by the inspected 24-hour query.
- VERIFIED: inspected sensitive Supabase functions are not executable by `anon` or `authenticated`.
- VERIFIED: inspected canonical `menu_v3` tables have direct table privileges closed to `anon` and `authenticated`, with RLS enabled.
- VERIFIED: Essential, Editorial, Noir, Heritage/Taste, and Gallery remain protected.
- VERIFIED: Quick Add, Item Notes, Cart, canonical public rendering, authentication/authorization, tenant/branch isolation, and customer action surfaces remain protected.

## Continuity Reconciliation Finding
- VERIFIED: previous continuity files were stale relative to current repository and Production evidence.
- Stale records included older main heads, older Vercel deployment commits, and outdated active-task descriptions.
- This is continuity/documentation drift, not evidence of missing implementation.
- Full durable plan: `docs/project-continuity-master-plan.md`.
- Audit: `docs/audits/2026-09-09-continuity-reconciliation.md`.

## Completed Milestones — Protected
- G1–G7.2 — CLOSED / VERIFIED.
- Premium Theme System — DONE / VERIFIED / MERGED.
- Essential, Editorial, Noir, Heritage, Gallery — protected.
- Visual/Functional Quality System — DONE / VERIFIED / MERGED.
- External Theme Preview QR Mode — DONE / VERIFIED.
- Shared Public Menu Rendering Stabilization — VERIFIED.
- Design Intelligence & Product Experience Research — CLOSED / VERIFIED at planning level.
- Shared Design System Contract — BASELINE ESTABLISHED / VERIFIED.
- Design Agent — DEFINED / VERIFIED as documentation-level workflow.
- Research/Connected-Tools Agent — DEFINED / VERIFIED as internal AI workflow.
- Automatic Specialist Routing — DEFINED / VERIFIED as governance workflow.
- P0-01 Canonical Content & Publishing Model Audit — CLOSED / VERIFIED.
- P0 Public Content Propagation — CLOSED / VERIFIED.
- W6, W6-01, W7, W8, W9, W10, W11, W12-01, W12-02, W12-03, W13 — CLOSED / VERIFIED.
- W14 — CLOSED / VERIFIED / MERGED.
- W15 — CLOSED / VERIFIED.
- W16 — IN_PROGRESS / HUMAN-DEVICE-VERIFICATION-REMAINING.
- W17 Public Pages & Themes Integration — W17-Q recovery COMPLETED / MERGED; no new W17 implementation is active.
- P0 Public Order Hardening — COMPLETED / VERIFIED.
- P1 Production/Continuity Hardening — COMPLETED for implemented scope; release-hygiene follow-ups remain.
- P2 Growth & Differentiation — COMPLETED / VERIFIED / DEPLOYED.

## W16 Remaining Verification Boundary
- VERIFIED: current Production deployment identity and commit match are directly verified.
- UNKNOWN/BLOCKED: physical Android/iOS rendering, manual screen-reader output, authenticated Owner keyboard traversal, QR-camera scanning, and Opera-specific behavior.
- These are direct-observation gaps, not implementation failures.
- Do not reopen completed themes unless a reproducible defect is found.

## Release Hygiene Follow-ups
### P1-H1 — package manifest / lockfile reconciliation
- OPEN: `package.json` and `package-lock.json` are not fully reconciled for a deterministic `npm ci` path.
- Required environment: writable npm environment capable of regenerating the lockfile.
- After regeneration, run the complete quality gate.
- Do not perform speculative dependency upgrades.

### P1-H2 — main branch protection
- VERIFIED: current GitHub `main` branch protection is not configured.
- Owner action required: enable required status checks/branch protection in GitHub repository settings.
- Connector access can inspect but cannot configure this setting.

## Current Product/UX Follow-up
### P2-H1 — Analytics no-data UX
- INFERRED: Local Visibility readiness is currently hidden when analytics has no events because the analytics content is gated by `hasData`.
- PROPOSED: expose Local Visibility readiness independently from analytics event availability.
- This remains a separate atomic task and is not part of this reconciliation.

## New Active Work — Platform Admin Operations Center
- STATUS: IMPLEMENTATION_IN_PROGRESS on branch `admin-operations-dashboard`.
- Objective: make `/admin` operationally useful for platform-owner order handling without weakening tenant isolation or destroying historical data.
- VERIFIED current gap: `/admin` counted orders but did not expose an order-management workspace; restaurant-owner order operations existed separately in `/studio/orders`.
- Implemented in branch: dedicated `الطلبات` tab, cross-tenant order search/status filter, customer phone/WhatsApp/email actions when data exists, order detail, server-authorized status updates, and reversible soft-archive.
- Migration: `migrations/20260909001000_order_archive_operations.sql` adds nullable `archived_at` and an active-order index.
- Regression suite: `tests/admin-operations.test.mjs`.
- Owner operational rule: "إزالة من لوحة التشغيل" means archive, not hard delete; order/item/status history remains preserved.
- Existing `/studio/orders` now excludes archived orders so the operational view remains consistent.
- Audit: `docs/audits/2026-09-09-admin-operations-audit.md`.

## Exact Current TODO
### Admin Operations Center — verification and release
1. Wait for/inspect the branch CI quality gate.
2. Fix only reproducible CI/type/lint/build/test failures caused by this task.
3. Review the final diff for task scope and security boundaries.
4. Create one coherent PR to `main` after quality passes.
5. Merge only after CI evidence is green.
6. Do not intentionally trigger Vercel Preview/Production deployment during development.
7. If merged, verify the single resulting Production deployment separately.
8. Then perform real-device/admin UI smoke verification when available.
9. Record the result and return to the W16 physical-device gate unless the owner explicitly reprioritizes.

## Permanent Execution Order
1. Complete the currently active Admin Operations Center atomic task.
2. Close W16 human-device/accessibility evidence.
3. Handle only reproducible defects as separate atomic tasks.
4. Close P1-H1 lockfile hygiene in a controlled environment.
5. Enable and verify P1-H2 `main` branch protection.
6. Consider P2-H1 or other growth/UX improvements only from new evidence.
7. Use the release-only Vercel workflow for every release batch.

## Deployment Identity — 2026-09-09
- VERIFIED: Vercel project `menu-v3` is `prj_ydfrFBE7ZJVmuNnCOTv3WjWkhuH1`.
- VERIFIED: current Production deployment is `dpl_HUU7JBPdu2UFvCHr5B8G1JdL2AGK`.
- VERIFIED: state is `READY` and target is `production`.
- VERIFIED: deployed repository is `Midosd249/Menu_V3`, branch `main`, commit `a7b9fce63257a38eb80ac36a4ab0fb00d2e188ed`.
- VERIFIED: no deployment was intentionally triggered by the continuity audit.

## Session Log — 2026-09-09 — Platform Admin Operations
- VERIFIED: audited `/admin`, `/studio/orders`, order authorization, order schema, and current continuity constraints.
- VERIFIED: platform admin had order counts/activity but no operational order-management surface.
- IMPLEMENTATION_IN_PROGRESS: added platform-wide order operations with contact actions, status management, and reversible archive semantics.
- VERIFIED: archive is server-authorized and does not hard-delete historical order data.
- OPEN: branch CI and release verification.
- EXACT NEXT TASK: finish verification and release of the Admin Operations Center atomic task.
