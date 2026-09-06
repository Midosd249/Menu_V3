# Menu V3 — Active Plan

## Status
- Status: IN_PROGRESS.
- Repository: `Midosd249/Menu_V3`.
- Source of truth: `main`.
- Premium Theme System is DONE / VERIFIED / MERGED.
- Essential, Editorial, Noir, Heritage, and Gallery milestones are protected; browser/device closure remains separately tracked.
- Permanent visual/functional/research quality workflow is DONE / VERIFIED and mandatory.
- Design Intelligence & Product Experience Research — CLOSED / VERIFIED at planning level.
- Shared Design System Contract — BASELINE ESTABLISHED / VERIFIED; implementation is incremental.
- P0-01 Canonical Content & Publishing Model Audit — CLOSED / VERIFIED.
- P0 Public Content Propagation — CLOSED / VERIFIED.
- W6 Typography Evidence & Decision — CLOSED / VERIFIED.
- W6-01 Typography Implementation — CLOSED / VERIFIED; corrected Fontsource CDN delivery passed full Quality Gate.
- W7 Color / Surface / Contrast System — CLOSED / VERIFIED.
- W8 Imagery and Art Direction — CLOSED / VERIFIED; final Quality Gate passed in run `34010117079`.
- W9 Motion and Interaction — CLOSED / VERIFIED; final Quality Gate passed in run `34010117079`.
- W10 Accessibility and RTL Quality — CLOSED / VERIFIED; final Quality Gate passed in run `34010619265`.
- W11 SEO, Local Discovery, and Shareability — CLOSED / VERIFIED; final Quality Gate passed in run `34013074378`.
- W12-01 Public Menu Hydration Performance — CLOSED / VERIFIED; final Quality Gate passed in run `34013861903`.
- W12-02 Public Menu Resource & Bundle Efficiency — CLOSED / VERIFIED; Quality Gate run `34014895325` passed all required steps.
- W12-03 Reliability and Failure-Path Audit — CLOSED / VERIFIED; Quality Gate run `34015320658` passed all required steps.
- W13 Trust, Security, and Data Ownership — CLOSED / VERIFIED; final Quality Gate passed in run `34050857106`.

## Canonical Backend Identity
- VERIFIED (2026-09-06): Menu V3 uses Supabase project ref `ublxptcqefujkbeepylc`.
- VERIFIED: Supabase URL is `https://ublxptcqefujkbeepylc.supabase.co`, region `ap-northeast-2` (Seoul), status `ACTIVE_HEALTHY` at verification.
- VERIFIED: Menu V3 canonical database schema is `menu_v3`.
- VERIFIED: Menu V3 is separated from legacy application data by schema boundary; legacy `public` tables are not the default Menu V3 canonical surface.
- Canonical infrastructure record: `docs/project-infrastructure.md`.

## Current Strategic Direction
Build Menu V3 as a distinctive `Premium Arabic-first Restaurant Presence Platform`: live menu + branded web presence + direct customer action + owner operations + local discoverability, while preserving existing architecture and completed theme work.

## Master Design Strategy
Complete roadmap: `docs/design-strategy-master-plan.md`.

### Workstreams
- W0 Evidence, measurement, product positioning.
- W1 Brand positioning and content system.
- W2 Marketing website/homepage.
- W3 Public customer menu.
- W4 Owner Studio/admin UX.
- W5 Shared design system.
- W6 Typography.
- W7 Color and brand tokens.
- W8 Imagery and art direction.
- W9 Motion and interaction.
- W10 Accessibility and RTL quality.
- W11 SEO/local discovery/shareability.
- W12 Performance and reliability.
- W13 Trust, security, and data ownership.
- W14 Pricing, packaging, and commercial UX.
- W15 Growth, analytics, and experimentation.
- W16 QA, browser/device, and release.

## Completed W12-03 — Reliability and Failure-Path Audit
- Objective: harden public-menu failure behavior for timeout, transient upstream failure, cache miss, and terminal errors without changing the successful path.
- VERIFIED: `src/routes/m.$slug.tsx` uses a bounded two-attempt retry policy with a 10-second per-attempt timeout and a deterministic 350 ms first retry delay.
- VERIFIED: terminal `not_found` and invalid results are not retried.
- VERIFIED: terminal timeout, unavailable, and unknown failures produce actionable Arabic/English messages.
- VERIFIED: the existing optional session cache remains slug/branch keyed; no cross-tenant cache mechanism was introduced.
- VERIFIED: no Supabase/schema, auth, authorization, theme, routing, or successful-path data contract changed.
- VERIFIED: `scripts/quality-workflow.test.mjs` protects retry bounds, delay, terminal-response behavior, and localized failure copy.
- VERIFIED: Quality Gate `34015320658` passed install, route generation, typecheck, tests, lint, production build, Playwright Chromium, all-theme Browser Template QA, performance upload, and preview shutdown.
- UNKNOWN: production RUM is unavailable, so real-user timeout/retry frequency and recovery rate cannot be quantified.
- Evidence record: `docs/reliability-failure-path-audit.md`.

## Completed W13 — Trust, Security, and Data Ownership Hardening
- VERIFIED: public tenant responses use `PublicTenant = Omit<Tenant, "ownerUserId">` and `mapPublicTenant()` strips owner identity before public serialization.
- VERIFIED: operational revision metadata is not part of the public response type.
- VERIFIED: authenticated Studio code retains the full `Tenant` model for owner-only workflows.
- VERIFIED: inactive `tenant_members` no longer authorize Owner/Studio server functions; Studio member snapshots exclude inactive records.
- VERIFIED: Owner/Admin server functions retain the shared `authMiddleware` chokepoint and tenant predicates.
- VERIFIED: platform-admin access remains server-side and fail-closed through `requirePlatformAdmin` and the database-backed platform-admin check.
- VERIFIED: the public action-link boundary consumes `PublicTenant`.
- VERIFIED: the Node test runner can execute the menu mapper/theme registry through explicit ESM paths required by this repository.
- VERIFIED: no new dependency was added; the existing dependency contract was restored.
- VERIFIED: `scripts/security-boundary.test.mjs` covers public/private data separation, authenticated middleware coverage, platform-admin fail-closed behavior, and client-reachable secret-name leakage.
- INFERRED: the existing platform-admin mechanism is the correct high-privilege foundation; a client-side permanent superuser flag would be unsafe.
- Decision: future emergency/holiday client support should use a time-bound, tenant-scoped, audited support session rather than a blanket bypass. This is recorded for a future atomic task and was not introduced as an insecure shortcut.
- VERIFIED: final Quality Gate `34050857106` passed Install, route generation, Typecheck, Tests, Lint, Production build, Playwright Chromium, all-theme Browser Template QA, performance upload, and preview shutdown.
- VERIFIED: Vercel status for the final W13 verification commit `f156275c274e2d721260d556d55d3791196d5584` is `success`.
- Evidence record: `docs/security-w13-trust-data-ownership.md`.

## Protected Work
- Existing five-theme implementation.
- Shared public-menu behavior and customer actions.
- Authentication, authorization, tenant/branch isolation.
- Existing migrations/schema unless evidence proves a requirement.
- Release-only Vercel workflow.
- Existing visual/functional quality system.

## Research Governance
- Material research is recorded in `docs/design-research-log.md` and persistent task evidence documents.
- Use official standards for accessibility, i18n, web platform, SEO, and font licensing.
- Competitors are pattern evidence, not assets or implementation sources.
- Label conclusions `VERIFIED`, `INFERRED`, `UNKNOWN`, `BLOCKED`, or `PROPOSED`.
- Only one atomic task may be active at a time.

## Exact Next Task
### W14 — Pricing, Packaging, and Commercial UX
Objective: define and implement the smallest evidence-backed commercial UX layer that makes Menu V3 sellable without disrupting the protected public menu, themes, authentication, authorization, or tenant architecture.

Acceptance criteria:
- pricing/plan presentation is consistent with the existing free-theme catalog and current product capabilities;
- plan limits and entitlement messaging are explicit and fail closed;
- upgrade/CTA paths are clear in Arabic and English;
- no client-side-only entitlement bypass is introduced;
- commercial UI does not expose private tenant data;
- existing free/public menu behavior remains unchanged;
- regression coverage exists for changed commercial contracts;
- full Quality Gate passes;
- no unrelated refactor.

Verification: `npm run typecheck`, `npm test`, `npm run lint`, `npm run build`, Playwright/template QA, targeted commercial/entitlement tests, and final diff review.
