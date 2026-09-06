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

## Protected Completed Work
- Essential, Editorial, Noir, Heritage, and Gallery implementation milestones are not reopened by the design-strategy work.
- Shared public-menu behavior, customer actions, authentication, authorization, tenant/branch isolation, routing, migrations, and deployment controls remain protected.
- No database schema, migration, dependency, CI/CD, or Vercel configuration changes are introduced by the design-research program unless a later atomic task proves a requirement.

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
- **VERIFIED:** Saudi/MENA competitors increasingly combine QR menus with branded presence, direct ordering/contact, analytics, branches, local-market fit, and/or customer-data ownership.
- **VERIFIED:** global restaurant platforms increasingly connect menus, websites, ordering, discoverability, and operational data.
- **VERIFIED:** Arabic/RTL and mixed-direction content require explicit bidi handling; RTL is not simply visual mirroring. W3C recommends structural direction markup and tightly scoped markup for opposite-direction inline runs.
- **VERIFIED:** typography and image delivery affect accessibility, layout stability, and performance.
- **VERIFIED:** current brand direction supports warm editorial hospitality cues, deep ink, muted terracotta, strong Arabic hierarchy, whitespace, and operational clarity.
- **PROPOSED:** IBM Plex Sans Arabic is a strong typography candidate but is not yet selected; it must be benchmarked against actual Menu V3 content and current font behavior.
- **UNKNOWN:** final homepage IA, final typography, final color territory, and conversion priorities require implementation-level measurement and user evidence.

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
- **Completed task:** Design Intelligence Synthesis and Shared Design System Contract baseline.
- **VERIFIED:** repository state, continuity, existing brand direction, research findings, and protected architecture were reconciled.
- **VERIFIED:** external research scope covered product positioning, marketing website, public menu, Owner Studio, typography, color, imagery, motion, accessibility, RTL/bidi, SEO/local discovery, performance, trust/security, pricing, analytics, and release QA.
- **VERIFIED:** the master roadmap and priority backlog are recorded in `docs/design-strategy-master-plan.md`.
- **VERIFIED:** the shared design contract is recorded in `docs/design-system-contract.md`.
- **VERIFIED:** no application source, database, dependency, CI/CD, or deployment configuration was changed in this task.
- **PROPOSED:** execute the contract through one atomic decision/implementation task at a time.

## Exact Next Task
**Typography Decision — benchmark candidate font systems against real Menu V3 Arabic/English/mixed content and performance constraints.**

Objective: select one production-ready default typography system plus fallbacks, with evidence for Arabic shaping, Latin pairing, numerals, SAR, mixed-direction content, hierarchy, readability, licensing/availability, and font-loading impact.
