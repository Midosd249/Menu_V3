# PROJECT STATE

## Identity
- Status: IN_PROGRESS.
- Repository: `Midosd249/Menu_V3`.
- Canonical branch: `main`.
- Source of truth: `main`.
- Current verified implementation head: `a7b9fce63257a38eb80ac36a4ab0fb00d2e188ed` — `feat: complete P2 growth differentiation slice`.
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

## Exact Next TODO
### W16 — Human Device & Manual Accessibility Gate
Objective: close the remaining direct-observation gap against the current Production build without reopening completed implementation.

Acceptance criteria:
1. Test current Production on a real Android device.
2. Test iOS when a supported physical device is available.
3. Cover small, standard, and large mobile widths where practical.
4. Test Arabic RTL, English LTR, and mixed-direction content.
5. Test long product names, varied SAR prices, missing/mixed images, sparse/dense categories, and sold-out states where applicable.
6. Test product details, Quick Add, Item Notes, Cart open/closed, ordering flow, sticky/floating actions, safe areas, and scrolling.
7. Perform manual screen-reader/focus checks where supported.
8. Verify QR-camera scanning.
9. Record every reproducible defect with device/browser/viewport/evidence/severity/root-cause hypothesis.
10. Do not modify themes or architecture unless a defect is reproduced and separately scoped.

## Permanent Execution Order
1. Close W16 human-device/accessibility evidence.
2. Handle only reproducible defects as separate atomic tasks.
3. Close P1-H1 lockfile hygiene in a controlled environment.
4. Enable and verify P1-H2 `main` branch protection.
5. Consider P2-H1 or other growth/UX improvements only from new evidence.
6. Use the release-only Vercel workflow for every release batch.

## Deployment Identity — 2026-09-09
- VERIFIED: Vercel project `menu-v3` is `prj_ydfrFBE7ZJVmuNnCOTv3WjWkhuH1`.
- VERIFIED: current Production deployment is `dpl_HUU7JBPdu2UFvCHr5B8G1JdL2AGK`.
- VERIFIED: state is `READY` and target is `production`.
- VERIFIED: deployed repository is `Midosd249/Menu_V3`, branch `main`, commit `a7b9fce63257a38eb80ac36a4ab0fb00d2e188ed`.
- VERIFIED: no deployment was intentionally triggered by the continuity audit.

## Session Log — 2026-09-09 — Continuity Reconciliation
- VERIFIED: repository, Git, CI, Vercel Production, and live Supabase evidence were reconciled.
- VERIFIED: P2 was already completed and deployed; stale continuity records caused the apparent unfinished-task state.
- VERIFIED: P0/P1 hardening remains protected.
- VERIFIED: current Production runtime error/fatal query returned no entries in the inspected 24-hour window.
- UNKNOWN/BLOCKED: physical-device and assistive-technology evidence.
- OPEN: package-lock reconciliation and GitHub main branch protection.
- EXACT NEXT TASK: W16 Human Device & Manual Accessibility Gate.
