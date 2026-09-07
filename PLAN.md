# Menu V3 — Active Plan

## Status
- Status: IN_PROGRESS.
- Repository: `Midosd249/Menu_V3`.
- Canonical branch: `main`.
- Verified application baseline before reconciliation: `bd84d9f663e74eb166c3ad8d89a97521d0c66ce5`.
- Premium Theme System — DONE / VERIFIED / MERGED.
- Essential, Editorial, Noir, Heritage, and Gallery — protected.
- Permanent visual/functional/research quality workflow — DONE / VERIFIED.
- Design Intelligence & Product Experience Research — CLOSED / VERIFIED at planning level.
- Shared Design System Contract — BASELINE ESTABLISHED / VERIFIED; implementation is incremental.
- Specialized Design Agent — DEFINED / VERIFIED at `docs/agents/design-agent.md`.
- P0-01 Canonical Content & Publishing Model Audit — CLOSED / VERIFIED.
- P0 Public Content Propagation — CLOSED / VERIFIED.
- W6 through W15 — CLOSED / VERIFIED, with W14 MERGED and W15 Quality Gate `34053348446` passed.
- W16 QA, Browser/Device, and Release — IN_PROGRESS / DEPLOYMENT_BLOCKED.
- W17 Public Pages & Themes Integration — W17-Q recovery COMPLETED / MERGED; no W17 implementation task is active.

## Canonical Backend Identity
- VERIFIED: Supabase project ref `ublxptcqefujkbeepylc`.
- VERIFIED: Supabase URL `https://ublxptcqefujkbeepylc.supabase.co`, region `ap-northeast-2` (Seoul), status `ACTIVE_HEALTHY` at last verification.
- VERIFIED: canonical database schema is `menu_v3`.
- VERIFIED: Menu V3 is separated from legacy application data by schema boundary.

## Current Strategic Direction
Build Menu V3 as a distinctive `Premium Arabic-first Restaurant Presence Platform`: live menu + branded web presence + direct customer action + owner operations + local discoverability, while preserving existing architecture and completed work.

## Master Design Strategy
Complete roadmap: `docs/design-strategy-master-plan.md`.

Workstreams W0–W17 remain the historical roadmap. Completed work is not re-opened merely because the roadmap remains present.

## Permanent Design Agent Workflow
- VERIFIED: `docs/agents/design-agent.md` defines the specialist workflow for significant visual, image, layout, theme, and site-consistency work.
- VERIFIED: it does not own architecture, data, auth/authz, entitlements, subscriptions, tenant/branch isolation, CI/CD, Vercel, or general product logic.
- PROPOSED: invoke it for significant future visual work only when evidence supports reopening that scope.

## Editorial Image / Card Refinement
- VERIFIED: legacy mobile Editorial `min-height: 25rem` behavior was neutralized; the two-column scan unit and `4 / 3` media geometry were stabilized.
- VERIFIED: `tests/editorial-browser-hardening.test.mjs` protects the refinement.
- VERIFIED: audit: `docs/template-audits/editorial-image-layout-audit-2026-09-07.md`.
- UNKNOWN: physical-device pixel verification remains pending.
- NEXT VERIFICATION: run the existing Editorial browser/device verification; do not begin new Editorial implementation without evidence.

## Noir Full Refinement — COMPLETED / MERGED
- VERIFIED: PR #24 is MERGED, not Draft/Open/In Progress.
- Merge commit: `d2401a9276719bdab4305f89160aba2ca15f0b58`.
- VERIFIED: the Noir refinement preserved the custom hero/featured identity, kept `PublicMenuView` as interaction owner, removed duplicate visit-event ownership, stabilized media, removed card staggering/ornamental transforms, and preserved RTL/LTR and safe-area behavior.
- VERIFIED: `tests/noir-browser-hardening.test.mjs` and `docs/template-audits/noir-full-refinement.md` provide regression/audit evidence.
- UNKNOWN: physical-device rendering and manual screen-reader output remain unobserved.

## W17-Q Public Theme Quality Recovery — COMPLETED / MERGED
- VERIFIED: PR #26 is MERGED.
- Merge commit: `219f79024fec088c6a9e2e1bd050d6fe2e394e91`.
- VERIFIED: Quality Gate `34080681231` passed.
- VERIFIED: `161/161` tests passed; `0` failures; `0` skips.
- VERIFIED: all five themes passed Browser Template QA across mobile, tablet, and desktop.
- VERIFIED: browser runtime console errors `0`; horizontal overflow `0px`.
- VERIFIED: typecheck, test suite, lint, production build, Playwright Chromium, all-theme Browser Template QA, performance baseline upload, and preview shutdown all completed successfully.
- UNKNOWN: physical-device rendering and manual screen-reader output remain unverified.
- Deployment remains separate from this CI evidence.

## Gallery Latest Refinement — COMPLETED / VERIFIED
- `e21c14fe337f820c371539b09d086b114216da94` — `fix(gallery): show one featured item at a time`.
- `7d57bb0eb6dc5a5bf2198dc5b3219d0628973882` — `test(gallery): lock single featured presentation`.
- `bd84d9f663e74eb166c3ad8d89a97521d0c66ce5` — `docs(gallery): record single featured item refinement` and the application/documentation baseline before this reconciliation.
- VERIFIED: Gallery featured presentation now uses one image-led item at a time with responsive media geometry.

## W16 QA, Browser/Device, and Release
- VERIFIED: W14 and W15 regression gates remain green.
- VERIFIED: before reconciliation, the application/documentation head `bd84d9f663e74eb166c3ad8d89a97521d0c66ce5` exposed a GitHub Vercel `failure` target pointing to `upgradeToPro=build-rate-limit`.
- BLOCKED: that Vercel result is a provider/capacity or plan limitation; it is not evidence of an application build failure.
- UNKNOWN: current Vercel production deployment identity and deployed-commit match are not directly verifiable through the available Vercel connector surface.
- UNKNOWN: production must not be described as matching current `main` without direct deployment evidence.
- UNKNOWN: physical-device rendering, manual screen-reader output, authenticated Owner keyboard traversal, QR-camera scanning, and Opera-specific behavior remain unobserved.

## Protected Scope
- Essential, Editorial, Noir, Heritage, and Gallery implementation milestones are protected.
- Shared public-menu behavior, customer actions, authentication, authorization, tenant/branch isolation, routing, migrations, and deployment controls remain protected.
- Do not create a sixth theme as a substitute for product/design strategy.

## Research Governance
- Material research is recorded in persistent evidence documents.
- Use official standards for accessibility, i18n, web platform, SEO, and analytics event conventions.
- Label conclusions `VERIFIED`, `INFERRED`, `UNKNOWN`, `BLOCKED`, or `PROPOSED`.
- Only one atomic task may be active at a time.

## Exact Next TODO
### Editorial browser/device verification against the latest refinement state
Objective: verify the existing Editorial refinement in the supported browser viewport matrix and record evidence. This is a verification task, not permission to begin a new theme refinement.

Acceptance criteria:
- verify the supported small/standard/large mobile, tablet, and desktop states;
- check Arabic RTL, English LTR, mixed-direction content, long names, varied SAR prices, missing/mixed images, sparse/dense content, and safe-area/action behavior where supported;
- record browser evidence and remaining UNKNOWN items;
- do not modify unrelated themes or product architecture;
- keep production deployment verification separate.

## Reconciliation Note — 2026-09-07
- VERIFIED: stale Noir and W17-Q active-state claims were closed/reclassified.
- VERIFIED: PR #24/#26 merge state and Quality Gate `34080681231` are now reflected accurately.
- VERIFIED: latest Gallery refinement is recorded.
- VERIFIED: deployment is explicitly separated from implementation and CI evidence; the pre-reconciliation Vercel `build-rate-limit` result is retained as platform limitation evidence.
- UNKNOWN/BLOCKED items remain explicit rather than being converted into completion claims.
