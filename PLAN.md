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
- **UNKNOWN:** final conversion priorities and final font/color values require measurement and implementation-level testing.

## Design Contract
`docs/design-system-contract.md` is now the implementation baseline for:
- semantic color/type roles;
- spacing, radius, elevation, motion;
- responsive/layout rules;
- RTL/LTR/bidi behavior;
- buttons, inputs, cards, search, dialogs, fixed actions;
- public-menu hierarchy;
- Owner Studio journey;
- marketing website hierarchy;
- imagery;
- accessibility;
- performance;
- SEO/local discovery;
- trust/security boundaries;
- theme boundary.

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
4. **Typography decision with real Arabic/English/mixed content — CURRENT.**
5. Public-menu first-screen/action hierarchy.
6. Owner Studio activation/publish journey.
7. Measurement/event baseline where infrastructure supports it.
8. Accessibility/RTL/performance acceptance contract.

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
### Typography Decision — benchmark candidate font systems

**Objective:** select one production-ready default typography system plus fallbacks using actual Menu V3 Arabic/English/mixed content and measurable performance constraints.

**Files likely to change:** typography research/decision documentation and, only if evidence supports it, the existing font configuration/source files.

**Acceptance criteria:**
- candidate set is explicit;
- Arabic shaping and Latin pairing are checked;
- numerals, SAR, phones, URLs, and mixed-direction strings are checked;
- heading/body/UI/price roles are compared;
- loading/subsetting/performance impact is measured where tooling permits;
- licensing/availability is verified;
- one default system and fallbacks are selected, or the decision remains explicitly BLOCKED with evidence;
- no theme is reopened;
- relevant tests/build/lint/typecheck run if source changes are introduced;
- continuity files are updated.

**Risks:** font metrics changing layout, Arabic readability regressions, mixed bidi issues, loading cost, licensing assumptions, and accidental global visual drift.

**Verification commands when source changes occur:** `npm run typecheck`, `npm test`, `npm run lint`, `npm run build`, plus applicable visual/template QA.
