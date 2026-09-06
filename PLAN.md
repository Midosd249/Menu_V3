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

## Research Conclusions
- **VERIFIED:** Saudi/MENA competitors increasingly bundle digital menus with branded presence, direct ordering/contact, analytics, branches, local-market fit, and/or customer-data ownership.
- **VERIFIED:** global restaurant platforms increasingly connect menus, websites, ordering, discoverability, and operational data.
- **VERIFIED:** Arabic/RTL and mixed-direction content require explicit bidi handling and dedicated acceptance cases.
- **VERIFIED:** fonts and images are performance/layout inputs, not decoration only.
- **VERIFIED:** current brand direction supports premium hospitality/editorial cues, warm neutral surfaces, deep ink, muted terracotta, strong Arabic hierarchy, whitespace, and operational clarity.
- **INFERRED:** the strongest territory is a premium Arabic-first restaurant presence platform rather than another generic QR-menu product.
- **PROPOSED:** build a shared Menu V3 signature above the five existing themes rather than introducing another theme.
- **PROPOSED:** IBM Plex Sans Arabic remains a strong typography candidate, pending benchmark against real content and performance.
- **VERIFIED:** current repository data already provides a canonical menu core across tenant, branch, category, product, options, hours, and public events.
- **VERIFIED:** current publish behavior is a boolean `is_published` gate rather than a revision/schedule/audit publishing system.
- **PARTIAL:** public-content propagation has both server and browser caching; complete owner-mutation invalidation coverage is not yet proven.
- **PARTIAL:** future tenant website content and broader local-discovery content are not yet represented as a verified shared content surface.
- **UNKNOWN:** final conversion priorities and final font/color values require measurement and implementation-level testing.

## Canonical Content Audit
`docs/canonical-content-publishing-audit.md` is the evidence record for P0-01.

### P0-01 result
- **VERIFIED:** no new canonical menu schema is justified at this stage.
- **VERIFIED:** Tenant, Branch, Category, Product, ProductVariant, ModifierGroup, ModifierOption, BranchHour, and menu-event structures form a viable canonical menu core.
- **VERIFIED:** Owner Studio and Public Menu consume the same tenant/category/product domain data.
- **VERIFIED:** public reads require an active and published tenant; owner writes use server-side authentication and tenant membership/role checks.
- **VERIFIED:** branch routing exists for `/m/$slug` and `/m/$slug/$branch`.
- **VERIFIED:** public SEO metadata/canonical/hreflang/JSON-LD is already generated from public menu data.
- **PARTIAL:** publish is currently a boolean gate, not a revisioned/scheduled/audited publish system.
- **PARTIAL:** server cache and browser session cache can make propagation stale; every mutation's invalidation behavior is not proven.
- **PARTIAL:** a dedicated tenant website-content model and unified cross-surface analytics taxonomy are not proven.

### P0-01 decision
Do not add schema or redesign the canonical model now. First prove the concrete propagation behavior and only then create a separate publishing/revision or website-content task if evidence requires it.

## Design Contract
`docs/design-system-contract.md` is now the implementation baseline for semantic color/type roles, spacing, radius, elevation, motion, responsive/layout rules, RTL/LTR/bidi behavior, components/states, public-menu hierarchy, Owner Studio journey, marketing website hierarchy, imagery, accessibility, performance, SEO/local discovery, trust/security boundaries, and the theme boundary.

Exact production token values remain deliberately unresolved until the relevant decision tasks pass evidence checks.

## Protected Scope
- Do not reopen Essential, Editorial, Noir, Heritage, or Gallery without direct defect evidence.
- Do not rebuild shared public-menu business logic for visual reasons.
- Do not create a sixth theme before a proven market/design requirement exists.
- Do not weaken authentication, authorization, tenant/branch isolation, SEO, or deployment controls.
- Do not use Vercel for ordinary design iteration.
- Do not copy competitor layouts, assets, copy, or proprietary interactions.

## Permanent Release-Only Vercel Strategy
Vercel is a release platform, not the normal development or design-iteration environment.

`LOCAL DEVELOPMENT → LOCAL QA → LOCAL BROWSER / VISUAL QA → TESTS → GITHUB ACTIONS QUALITY GATES → DIFF REVIEW → ONE COHERENT RELEASE BATCH → MERGE TO MAIN → ONE VERCEL PRODUCTION DEPLOYMENT → REAL-DEVICE PRODUCTION QA → RECORD RESULT`

Before deployment-specific work, inspect actual Vercel Usage/Billing. Never claim production deployment without direct evidence.

## Priority Backlog
### P0 — Foundation
1. ~~Design Intelligence Synthesis~~ — CLOSED / VERIFIED.
2. Product positioning/message hierarchy.
3. ~~Shared design-system contract~~ — BASELINE ESTABLISHED / VERIFIED.
4. **Canonical content & publishing model audit — CLOSED / VERIFIED.**
5. **Public-content propagation/cache verification — CURRENT.**
6. Typography decision with real Arabic/English/mixed content.
7. Public-menu first-screen/action hierarchy.
8. Owner Studio activation/publish journey.
9. Measurement/event baseline where infrastructure supports it.
10. Accessibility/RTL/performance acceptance contract.

### P1 — High-value product/design improvements
1. Marketing homepage redesign.
2. Public menu conversion/business-information hierarchy.
3. Owner Studio onboarding and preview/publish UX.
4. Shared component/state consistency.
5. SEO/local-discovery improvements supported by actual routes/data.
6. Image/font performance improvements.
7. Trust/proof/pricing/packaging improvements.

### P2 — Differentiation and growth
1. Local visibility workflows.
2. Advanced analytics storytelling.
3. Experimentation framework.
4. Advanced personalization where supported.
5. Enhanced restaurant website capabilities.
6. Additional integrations only when validated by demand.

## Exact Current Task
### P0 — Verify public-content propagation after Owner mutations

**Objective:** prove whether an owner edit becomes visible to the public menu within the expected propagation window across server and browser caching, and repair only the smallest proven gap.

**Files likely to change:** only the existing cache/mutation source files and focused regression tests if a defect is proven; otherwise documentation only.

**Acceptance criteria:**
- map all owner mutations that can change public content;
- verify server-cache invalidation behavior for each mutation;
- verify browser session-cache behavior and its expected staleness window;
- verify tenant/branch cache-key isolation;
- add or adjust a focused regression test if the current behavior is incorrect;
- do not add schema/dependencies unless a separate proven requirement exists;
- run relevant typecheck/tests/lint/build when source changes occur;
- update continuity files with evidence and exactly one next task.

**Risks:** stale public content, cross-tenant cache contamination, unnecessary cache-busting, performance regressions, and accidental expansion into a full publish/revision system.

**Verification commands:** `npm run typecheck`, `npm test`, `npm run lint`, `npm run build`, plus focused tests for cache propagation when available.
