# PROJECT STATE

## Identity
- Status: IN_PROGRESS.
- Repository: `Midosd249/Menu_V3`.
- Source of truth: `main`.
- Product: Menu V3, Arabic-first bilingual multi-tenant digital-menu SaaS for restaurants and cafes.

## Backend Identity (VERIFIED — 2026-09-06)
- Supabase project ref: `ublxptcqefujkbeepylc`.
- Supabase URL: `https://ublxptcqefujkbeepylc.supabase.co`.
- Supabase region: `ap-northeast-2` (Seoul).
- Supabase status: `ACTIVE_HEALTHY` at last verification.
- Menu V3 canonical database schema: `menu_v3`.
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
- P0-01 Canonical Content & Publishing Model Audit — CLOSED / VERIFIED.
- P0 Public Content Propagation — CLOSED / VERIFIED.
- W6 Typography Evidence & Decision — CLOSED / VERIFIED.
- W6-01 Typography Implementation — CLOSED / VERIFIED.
- W7 Color / Surface / Contrast System — CLOSED / VERIFIED.
- W8 Imagery and Art Direction — CLOSED / VERIFIED.
- W9 Motion and Interaction — CLOSED / VERIFIED; final Quality Gate `34010117079` passed all required steps.
- W10 Accessibility and RTL Quality — CLOSED / VERIFIED; final Quality Gate `34010619265` passed all required steps.
- W11 SEO, Local Discovery, and Shareability — CLOSED / VERIFIED; final Quality Gate `34013074378` passed all required steps.
- W12-01 Public Menu Hydration Performance — CLOSED / VERIFIED; final Quality Gate `34013861903` passed all required steps.
- W12-02 Public Menu Resource & Bundle Efficiency — CLOSED / VERIFIED; final Quality Gate `34014895325` passed all required steps.
- W12-03 Reliability and Failure-Path Audit — CLOSED / VERIFIED; final Quality Gate `34015320658` passed all required steps.
- W13 Trust, Security, and Data Ownership — IMPLEMENTED / AWAITING FINAL QUALITY GATE.

## Protected Completed Work
- Existing themes, public-menu behavior, customer actions, authentication, authorization, tenant/branch isolation, routing, migrations, and deployment controls are not reopened without evidence.
- No sixth theme is created as a substitute for product/design strategy.

## W13 Trust, Security, and Data Ownership
- VERIFIED: public menu responses use `PublicTenant`, which omits `ownerUserId`.
- VERIFIED: `mapPublicTenant()` strips `owner_user_id`; operational `public_content_version` is not part of the public type.
- VERIFIED: authenticated Studio code retains the full `Tenant` shape for owner-only workflows.
- VERIFIED: inactive `tenant_members` records no longer authorize Owner/Studio server functions.
- VERIFIED: Studio member snapshots exclude inactive memberships.
- VERIFIED: Owner/Admin server functions continue to pass through the shared `authMiddleware` chokepoint.
- VERIFIED: tenant-scoped mutations continue to include `tenant_id` predicates and branch ownership checks.
- VERIFIED: platform administration remains fail-closed through `requirePlatformAdmin` and the database-backed platform-admin check.
- VERIFIED: a static security boundary suite checks public/private data separation, auth middleware coverage, platform-admin fail-closed behavior, and client-reachable secret-name leakage.
- VERIFIED: the existing dependency contract was preserved; no new dependency was added.
- INFERRED: the existing platform-admin capability is the correct high-privilege operational foundation; a permanent client-side superuser flag would be unsafe.
- UNKNOWN: production RUM cannot quantify real-world security/failure frequency.
- Decision: emergency client support should use a future time-bound, tenant-scoped, audited support session rather than a blanket bypass. This is recorded as a follow-up, not silently implemented as a security shortcut.
- Evidence: `docs/security-w13-trust-data-ownership.md`.

## Current Design Strategy
- The five-theme system is not the current design focus; themes remain protected.
- External research covers Saudi/MENA and global restaurant technology, branded web presence, public menu UX, Owner Studio, Arabic/RTL, accessibility, typography, performance, SEO/local discovery, conversion, trust, pricing, analytics, and release QA.
- INFERRED: strongest strategic territory is `Premium Arabic-first Restaurant Presence Platform`.
- PROPOSED: strengthen shared brand/design system and connected customer/owner experience while preserving theme personality.
- Complete roadmap: `docs/design-strategy-master-plan.md`.
- Design contract: `docs/design-system-contract.md`.

## Exact Next Task
### W13 Quality Closure
Objective: prove the W13 security/data-boundary changes through the complete Quality Gate, then close W13 and move to the next roadmap task.

Acceptance criteria:
- no public response exposes private tenant/owner data;
- inactive memberships fail closed;
- authorization boundaries remain tenant/branch scoped;
- secrets are not embedded in client bundles or logs;
- error responses do not expose internal SQL, stack traces, or infrastructure details;
- public analytics/event paths remain tenant-scoped;
- security regression coverage exists for every changed boundary;
- full Quality Gate passes;
- no unrelated changes.

Verification: `npm run typecheck`, `npm test`, `npm run lint`, `npm run build`, Playwright/template QA, targeted security tests, and final diff review.
