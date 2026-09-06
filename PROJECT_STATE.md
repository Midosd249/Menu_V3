# PROJECT STATE

## Identity
- Status: IN_PROGRESS.
- Repository: `Midosd249/Menu_V3`.
- Source of truth: `main`.
- Product: Menu V3, Arabic-first bilingual multi-tenant digital-menu SaaS for restaurants and cafes.

## Backend Identity (VERIFIED — 2026-09-06)
- Supabase project ref: `ublxptcqefujkbeepylc`.
- Supabase project URL: `https://ublxptcqefujkbeepylc.supabase.co`.
- Supabase region: `ap-northeast-2` (Seoul).
- Supabase status at verification: `ACTIVE_HEALTHY`.
- Menu V3 canonical database schema: `menu_v3`.
- Menu V3 is separated from legacy application data by schema boundary; legacy `public` tables must not be assumed to be the Menu V3 canonical surface.
- Canonical infrastructure reference: `docs/project-infrastructure.md`.

## Current Position
- G1–G7.2 completed work remains protected.
- **Premium Theme System — DONE / VERIFIED / MERGED.**
- **Theme 1 — Essential — DEPLOYED / VERIFIED.**
- **Theme 2 — Editorial — DEPLOYED / VERIFIED.**
- **Theme 3 — Noir — implementation refinement COMPLETE; final browser/device closure remains separately blocked.**
- **Theme 4 — Heritage — IMPLEMENTED / VERIFIED by repository and CI quality gates; browser/device closure remains separately blocked.**
- **Theme 5 — Gallery — IMPLEMENTED / VERIFIED by repository and CI quality gates; browser/device closure remains separately blocked.**
- **Visual/Functional Quality System — DONE / VERIFIED / MERGED.**
- **External Theme Preview QR Mode — DONE / VERIFIED.**
- **Shared Public Menu Rendering Stabilization — VERIFIED in repository.**
- **Design Intelligence & Product Experience Research — CLOSED / VERIFIED at planning level.**
- **Shared Design System Contract — BASELINE ESTABLISHED / IMPLEMENTATION NOT STARTED.**
- **P0-01 Canonical Content & Publishing Model Audit — CLOSED / VERIFIED.**
- **P0 Public Content Propagation — IMPLEMENTED / SOURCE-VERIFIED; runtime database verification remains required.**

## Protected Completed Work
- Essential, Editorial, Noir, Heritage, and Gallery implementation milestones are not reopened by the design-strategy work.
- Shared public-menu behavior, customer actions, authentication, authorization, tenant/branch isolation, routing, migrations, and deployment controls remain protected.
- No database schema, migration, dependency, CI/CD, or Vercel configuration changes are introduced by design research unless a later atomic task proves a requirement.

## Current Design Strategy
- **VERIFIED:** the five-theme system is not the current design focus.
- **VERIFIED:** the repository already contains substantial theme and public-menu visual work.
- **VERIFIED:** external research covers Saudi/MENA and global restaurant technology, digital menus, branded restaurant websites, Arabic/RTL, accessibility, typography, performance, SEO/local discovery, conversion, and product UX.
- **INFERRED:** the strongest strategic territory is `Premium Arabic-first Restaurant Presence Platform`, not another generic QR-menu product.
- **PROPOSED:** strengthen the shared Menu V3 brand/design system and the connected customer/owner experience while preserving theme personality.
- **VERIFIED:** the complete cross-functional roadmap is recorded in `docs/design-strategy-master-plan.md`.
- **VERIFIED:** the implementation-ready shared design contract is recorded in `docs/design-system-contract.md`.

## Exact Next Task
**P0 — Runtime verification of public-content propagation after Owner mutations, including migration application and cross-branch/tenant isolation.**

Objective: apply the new migration in the intended database, exercise representative owner mutations, confirm revision increments and fresh public responses, and run the repository quality gates. Only after this runtime evidence is obtained should P0 propagation be marked fully VERIFIED.
