# Menu V3 — Active Plan

## Status
- Status: IN_PROGRESS.
- Repository: `Midosd249/Menu_V3`.
- Source of truth: `main`.
- Premium Theme System is DONE / VERIFIED / MERGED.
- Essential, Editorial, Noir, Heritage, and Gallery milestones are protected; browser/device closure remains separately tracked.
- Permanent visual/functional/research quality workflow is DONE / VERIFIED and mandatory.
- Design Intelligence & Product Experience Research — CLOSED / VERIFIED at planning level.
- Shared Design System Contract — BASELINE ESTABLISHED / VERIFIED as documentation; implementation not started.
- P0-01 Canonical Content & Publishing Model Audit — CLOSED / VERIFIED.
- **P0 Public Content Propagation — CLOSED / VERIFIED.**

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

## Completed P0 — Runtime Public Content Propagation
- VERIFIED: migration applied to intended live database.
- VERIFIED: revision column and trigger set exist in `menu_v3`.
- VERIFIED: representative Owner-side mutations increment revision.
- VERIFIED: tenant isolation for revision mechanism.
- VERIFIED: public cache key includes tenant, branch, and revision.
- VERIFIED: no browser menu-content cache exists.
- VERIFIED: focused regression coverage passes in CI.
- VERIFIED: GitHub Actions Quality run `34007481599` completed successfully for commit `a43052b0f1c2ce8c64a00c852dd30f863783aa95`; typecheck, tests, lint, production build, Playwright Chromium installation, browser template QA, performance baseline upload, and cleanup all passed.
- UNKNOWN: direct authenticated Owner UI -> Public HTTP cache behavior remains unexercised in an interactive authenticated browser session.

## Exact Current Task
### W6 — Typography Evidence & Decision

**Objective:** make an evidence-based Arabic-first typography decision before any production typography implementation.

**Scope:** candidate font systems; Arabic/Latin pairing; Arabic heading/body readability; Latin readability; numerals and SAR; mixed bidi; weights; loading/performance; licensing/availability; current repository usage; compatibility with the existing design-system contract and five protected themes.

**Acceptance criteria:**
- shortlist 5–8 credible candidates;
- verify licensing/availability and web-delivery implications from authoritative sources;
- compare Arabic, Latin, numeric, SAR, and mixed-direction rendering requirements;
- select one default and up to two alternates with explicit rationale;
- record evidence and sources in `docs/design-research-log.md` and the active strategy documents;
- define the smallest separate implementation task;
- do not modify application code, themes, schema, dependencies, or deployment configuration in this decision task.

**Risks:** choosing for aesthetics alone, weak Arabic legibility, inconsistent Latin pairing, numeral/bidi defects, excessive font payload, licensing ambiguity, and accidental theme coupling.

**Verification:** repository typography inventory; authoritative font documentation/licensing sources; representative Arabic/Latin/numeric/bidi comparison; final decision recorded with evidence.
