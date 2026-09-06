# Menu V3 — Active Plan

## Status
- Status: IN_PROGRESS.
- Repository: `Midosd249/Menu_V3`.
- Source of truth: `main`.
- Premium Theme System is DONE / VERIFIED / MERGED.
- Essential, Editorial, Noir, Heritage, and Gallery milestones are protected; remaining browser/device closure is tracked separately.
- Permanent visual/functional/research quality workflow is DONE / VERIFIED and mandatory.
- **Design Intelligence & Product Experience Research — CLOSED / VERIFIED at planning level.**
- **Shared Design System Contract — BASELINE ESTABLISHED / VERIFIED as documentation; implementation not started.**
- **P0-01 Canonical Content & Publishing Model Audit — CLOSED / VERIFIED.**
- **P0 Public Content Propagation — IMPLEMENTED / SOURCE-VERIFIED; runtime verification remains required.**

## Canonical Backend Identity
- **VERIFIED (2026-09-06):** Menu V3 uses Supabase project ref `ublxptcqefujkbeepylc`.
- **VERIFIED:** Supabase URL is `https://ublxptcqefujkbeepylc.supabase.co`, region `ap-northeast-2` (Seoul), status `ACTIVE_HEALTHY` at verification.
- **VERIFIED:** Menu V3 canonical database schema is `menu_v3`.
- **VERIFIED:** Menu V3 is separated from legacy application data by schema boundary; legacy `public` tables are not the default Menu V3 canonical surface.
- Canonical infrastructure record: `docs/project-infrastructure.md`.

## Current Strategic Direction
Build Menu V3 as a distinctive `Premium Arabic-first Restaurant Presence Platform`: live menu + branded web presence + direct customer action + owner operations + local discoverability, while preserving the existing architecture and completed theme work.

## Master Design Strategy
The complete roadmap is recorded in `docs/design-strategy-master-plan.md`.

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

## Exact Current Task
### P0 — Runtime verification of public-content propagation

**Objective:** apply the new migration in the intended database, exercise representative Owner mutations, confirm revision increments and fresh Public Menu responses, verify cross-branch/tenant isolation, and run the repository quality gates.

**Acceptance criteria:**
- migration applies cleanly;
- revision increments for tenant, branch, hours, category, product, variant, modifier-group, modifier-option, and product-modifier-group changes;
- public cache misses after a revision change and returns the fresh payload;
- tenant and branch cache keys cannot cross-contaminate;
- no browser menu-content cache exists;
- focused regression test passes;
- `npm run typecheck`, `npm test`, `npm run lint`, and `npm run build` pass when executed in a network-enabled repository environment;
- continuity files record evidence and exactly one next task.

**Risks:** trigger recursion, migration incompatibility, stale process-local entries, cross-tenant cache contamination, unnecessary cache-busting, and accidental expansion into revision publishing.

**Verification commands:** `npm run typecheck`, `npm test`, `npm run lint`, `npm run build`, `node --test scripts/public-menu-cache.test.mjs`, plus a real database Owner → Public mutation check.
