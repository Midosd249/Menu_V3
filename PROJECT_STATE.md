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
- **P0 Public Content Propagation — RUNTIME DATABASE EVIDENCE VERIFIED; repository quality run pending.**

## Protected Completed Work
- Essential, Editorial, Noir, Heritage, and Gallery implementation milestones are not reopened by the design-strategy work.
- Shared public-menu behavior, customer actions, authentication, authorization, tenant/branch isolation, routing, migrations, and deployment controls remain protected.
- No database schema, migration, dependency, CI/CD, or Vercel configuration changes are introduced by design research unless a later atomic task proves a requirement.

## Runtime Evidence — P0 Public Content Propagation
- **VERIFIED:** live Supabase database contains `menu_v3.tenants.public_content_version`.
- **VERIFIED:** live `menu_v3` has public-content revision triggers on tenants, branches, branch hours, categories, products, product variants, modifier groups, modifier options, and product-modifier links.
- **VERIFIED:** trigger functions are explicitly qualified to `menu_v3` and use `search_path = menu_v3, pg_temp`.
- **VERIFIED:** representative live Owner-side writes incremented the published tenant revision.
- **VERIFIED:** changing the `demo-nafas` tenant/branch/product surface advanced its revision while the separate `mndy-alwtnya` tenant remained at its prior revision, demonstrating tenant isolation for the revision mechanism.
- **VERIFIED:** `src/lib/db.ts` sets PostgreSQL `search_path` to `menu_v3,public`; `src/lib/menu/public.ts` reads the revision and versions its process-local cache key by tenant, branch, and revision.
- **VERIFIED:** browser menu-content caching is not present in `src/components/public-menu.tsx`; the browser-side session storage is limited to anonymous analytics session identity.
- **VERIFIED:** the canonical migration was corrected to explicitly target `menu_v3`; a repair migration was applied to the live database for the trigger set.
- **UNKNOWN:** direct end-to-end Owner UI -> Public HTTP response cache behavior has not been exercised in an interactive browser session in this environment.

## Current Design Strategy
- **VERIFIED:** the five-theme system is not the current design focus.
- **VERIFIED:** the repository already contains substantial theme and public-menu visual work.
- **VERIFIED:** external research covers Saudi/MENA and global restaurant technology, digital menus, branded restaurant websites, Arabic/RTL, accessibility, typography, performance, SEO/local discovery, conversion, and product UX.
- **INFERRED:** the strongest strategic territory is `Premium Arabic-first Restaurant Presence Platform`, not another generic QR-menu product.
- **PROPOSED:** strengthen the shared Menu V3 brand/design system and the connected customer/owner experience while preserving theme personality.
- **VERIFIED:** the complete cross-functional roadmap is recorded in `docs/design-strategy-master-plan.md`.
- **VERIFIED:** the implementation-ready shared design contract is recorded in `docs/design-system-contract.md`.

## Exact Next Task
**P0 verification closure — wait for the GitHub quality run for commit `c6fd114fa9659d355a99b7a0543b24d22f023422`, review its complete result, and close P0 only if all required gates pass. If it fails, diagnose only the failure relevant to this task.**
