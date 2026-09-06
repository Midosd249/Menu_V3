# PROJECT_STATE

## Identity
- Status: IN_PROGRESS.
- Repository: `Midosd249/Menu_V3`.
- Source of truth: `main`.
- Product: Menu V3, Arabic-first bilingual multi-tenant digital-menu SaaS for restaurants and cafes.

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

## Design Strategy Master Plan
- **W0:** Evidence, measurement, product positioning.
- **W1:** Brand positioning and content system.
- **W2:** Marketing website/homepage.
- **W3:** Public customer menu.
- **W4:** Owner Studio/admin UX.
- **W5:** Shared design system.
- **W6:** Typography.
- **W7:** Color and brand tokens.
- **W8:** Imagery/art direction.
- **W9:** Motion/interaction.
- **W10:** Accessibility/RTL quality.
- **W11:** SEO/local discovery/shareability.
- **W12:** Performance/reliability.
- **W13:** Trust/security/data ownership.
- **W14:** Pricing/packaging/commercial UX.
- **W15:** Growth/analytics/experimentation.
- **W16:** QA/browser/device/release.

## Design Research Findings
- **VERIFIED:** Saudi/MENA competitors increasingly combine QR menus with branded presence, direct customer actions, analytics, branches, local-market fit, and/or customer-data ownership.
- **VERIFIED:** global restaurant platforms increasingly connect menus, websites, ordering, discoverability, and operational data.
- **VERIFIED:** Arabic/RTL and mixed-direction content require explicit bidi handling; RTL is not simply visual mirroring.
- **VERIFIED:** typography and image delivery affect accessibility, layout stability, and performance.
- **VERIFIED:** current brand direction supports warm editorial hospitality cues, deep ink, muted terracotta, strong Arabic hierarchy, whitespace, and operational clarity.
- **PROPOSED:** IBM Plex Sans Arabic is a strong typography candidate but is not yet selected; it must be benchmarked against actual Menu V3 content and current font behavior.
- **VERIFIED:** current repository data already provides a canonical menu core across tenant, branch, category, product, options, hours, and public events.
- **VERIFIED:** current publish behavior is a boolean `is_published` gate rather than a revision/schedule/audit publishing system.
- **VERIFIED:** public menu has a 15s server cache; browser storage is used only for anonymous analytics session identity, not menu content.
- **VERIFIED:** public content propagation is now versioned by the database-backed `tenants.public_content_version` revision.
- **PARTIAL:** future tenant website content and broader local-discovery content are not yet represented as a verified shared content surface.
- **UNKNOWN:** final homepage IA, final typography, final color territory, and conversion priorities require implementation-level measurement and user evidence.

## Canonical Content Audit
- **VERIFIED:** `docs/canonical-content-publishing-audit.md` records the P0-01 evidence matrix and final propagation decision.
- **VERIFIED:** no new canonical menu schema is justified beyond the small cache-revision mechanism required for correctness.
- **VERIFIED:** owner and public menu share the same tenant/category/product domain data.
- **VERIFIED:** server-side authentication and tenant-scoped writes protect owner mutations.
- **VERIFIED:** all current owner mutations that can affect public menu content map to tables covered by the public-content revision triggers.
- **VERIFIED:** public cache keys include tenant, branch, and database content revision.
- **VERIFIED:** there is no browser menu-content cache requiring invalidation.
- **RUNTIME REQUIRED:** migration application and a real Owner → Public mutation test remain outstanding because the current agent environment cannot execute the repository locally.

## Design Contract
- **VERIFIED:** `docs/design-system-contract.md` defines shared semantic tokens, typography roles, spacing/radius/elevation rules, component states, responsive behavior, RTL/bidi requirements, public-menu hierarchy, Owner Studio journey, marketing-site hierarchy, accessibility, performance, SEO, trust/security boundaries, and the theme boundary.
- **PROPOSED:** use the contract as the mandatory design baseline for subsequent UI work.
- **UNKNOWN:** exact production token values remain pending Typography and Color decision tasks.

## Do Not Redo
- Do not rebuild the five-theme architecture.
- Do not create a sixth theme as a substitute for brand/product strategy.
- Do not rewrite shared public-menu business logic for visual polish.
- Do not weaken RTL/bidi, authentication, authorization, tenant/branch isolation, SEO, or deployment controls.
- Do not use Vercel for ordinary design iteration.
- Do not convert competitor layouts, assets, copy, or proprietary interactions into Menu V3.

## Browser / Deployment State
- **VERIFIED:** automated Playwright browser template QA passed for all five themes in quality run `34001361889`.
- **VERIFIED:** performance baseline artifact `g6-performance-baseline` was produced by run `34001361889`.
- **UNKNOWN / BLOCKED:** authenticated browser/device closure, Opera-specific behavior, and post-hydration console inspection remain pending in the current agent environment.
- **VERIFIED:** production deployment remains release-only and has not been used for ordinary design research/iteration.

## Session Log — 2026-09-06
- **Completed task:** P0 — Public Content Propagation implementation.
- **VERIFIED:** mapped all current Owner mutations affecting public content in `src/lib/menu/owner.ts`.
- **VERIFIED:** mutation surfaces include restaurant creation, tenant settings/publish, category create/update/delete, product create/update/delete/toggle, branch create/update/delete/hours, CSV import, and starter-item seeding.
- **VERIFIED:** every mapped mutation changes a table covered by the new database-backed public-content revision triggers.
- **VERIFIED:** `src/lib/menu/public.ts` now versions its process-local cache key with `tenants.public_content_version`.
- **VERIFIED:** `src/components/public-menu.tsx` contains no browser menu-content cache; `src/lib/menu/session.ts` uses localStorage only for anonymous analytics session identity.
- **VERIFIED:** tenant/branch isolation remains encoded in the public cache key and public SQL.
- **VERIFIED:** focused regression coverage was added in `scripts/public-menu-cache.test.mjs`.
- **VERIFIED:** durable audit documentation was corrected to remove the earlier false assumption about a browser menu cache.
- **VERIFIED:** no new dependency, theme change, or unrelated refactor was introduced.
- **BLOCKED:** local typecheck/tests/lint/build could not be executed because outbound DNS/network access is unavailable in the current agent environment; no test pass is claimed.

## Exact Next Task
**P0 — Runtime verification of public-content propagation after Owner mutations, including migration application and cross-branch/tenant isolation.**

Objective: apply the new migration in the intended database, exercise representative owner mutations, confirm revision increments and fresh public responses, and run the repository quality gates. Only after this runtime evidence is obtained should P0 propagation be marked fully VERIFIED.
