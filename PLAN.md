# Menu V3 — Active Plan

## Status
- Status: IN_PROGRESS.
- Repository: `Midosd249/Menu_V3`.
- Source of truth: `main`.
- Premium Theme System is DONE / VERIFIED / MERGED.
- Essential premium refinement is DEPLOYED / VERIFIED; manual real-device/Opera evidence remains UNKNOWN.
- Editorial premium refinement, contact/location actions, language switching, and temporary public theme testing access are IMPLEMENTED / VERIFIED / MERGED.
- Noir implementation refinement is COMPLETE; final browser/device closure remains separately blocked and Noir is not being reopened.
- Heritage implementation is COMPLETE / VERIFIED by repository and GitHub Actions quality gates; browser/device closure remains separately blocked.
- Gallery implementation is COMPLETE / VERIFIED by repository and GitHub Actions quality gates; browser/device closure remains separately blocked.
- Permanent visual/functional/research quality workflow is DONE / VERIFIED and mandatory.
- External theme preview QR mode is DONE / VERIFIED.
- **Design Intelligence & Product Experience Research is COMPLETE at planning level; implementation is intentionally not started.**

## Current Strategic Direction
The next product-development program is broader than themes. The objective is to make Menu V3 a distinctive `Premium Arabic-first Restaurant Presence Platform`: live menu + branded web presence + direct customer action + owner operations + local discoverability, while preserving the existing architecture and completed theme work.

## Master Design Strategy
The complete cross-functional roadmap is recorded in `docs/design-strategy-master-plan.md`.

### Workstreams
- W0 Evidence, measurement, and product positioning.
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

## Research Conclusions So Far
- **VERIFIED:** Saudi/MENA competitors increasingly bundle digital menus with branded presence, direct ordering/contact, analytics, branches, compliance/local-market fit, and customer-data ownership.
- **VERIFIED:** global restaurant platforms increasingly connect menus, websites, ordering, discoverability, and operational data.
- **VERIFIED:** Arabic/RTL and mixed-direction content require explicit bidi handling and dedicated acceptance cases.
- **VERIFIED:** fonts and images are performance/layout inputs, not decoration only.
- **VERIFIED:** the current brand direction is compatible with premium hospitality/editorial cues, warm neutral surfaces, deep ink, muted terracotta, strong Arabic hierarchy, whitespace, and operational clarity.
- **PROPOSED:** build a shared Menu V3 signature above the five existing themes rather than introducing another theme.
- **PROPOSED:** IBM Plex Sans Arabic is a strong typography candidate, pending benchmark against real product content and performance.
- **UNKNOWN:** final homepage IA, typography, color territory, and conversion priorities until synthesis and measurement are completed.

## Protected Scope
- Do not reopen Essential, Editorial, Noir, Heritage, or Gallery without direct defect evidence.
- Do not rebuild shared public-menu business logic for visual reasons.
- Do not create a sixth theme before a proven market/design requirement exists.
- Do not weaken authentication, authorization, tenant/branch isolation, SEO, or deployment controls.
- Do not use Vercel for ordinary design iteration.

## Permanent Release-Only Vercel Strategy
Vercel is a release platform, not the normal development or design-iteration environment.

**LOCAL DEVELOPMENT → LOCAL QA → LOCAL BROWSER / VISUAL QA → TESTS → GITHUB ACTIONS QUALITY GATES → DIFF REVIEW → ONE COHERENT RELEASE BATCH → MERGE TO MAIN → ONE VERCEL PRODUCTION DEPLOYMENT → REAL-DEVICE PRODUCTION QA → RECORD RESULT**

- `main` must remain stable and deployable.
- Preview deployments are exceptions only when deployment-specific behavior cannot be locally verified.
- Before any deployment-related decision, inspect actual Vercel Usage/Billing.
- Production deployment occurs only after a complete verified release batch.

## Existing Release Policy Constraints
- Authenticated browser/device verification remains pending for the five preview variants.
- Temporary theme testing override must be reviewed and disabled before commercial production launch.
- Implementation and deployment status remain separate.

## Design Research Governance
- Material research is recorded in `docs/design-research-log.md`.
- Use official standards for accessibility, internationalization, web platform, and SEO.
- Use competitor products as positioning/pattern evidence, not as design assets.
- Use design galleries/UI libraries as inspiration only.
- Label findings `VERIFIED`, `INFERRED`, `PROPOSED`, or `UNKNOWN`.
- Do not convert an unverified trend into a product requirement.

## Master Design Execution Order
`Evidence → Positioning → Design System Contract → Typography/Color Decisions → Homepage IA → Public Menu UX → Owner Studio UX → SEO/Local Discovery → Performance/Accessibility → Prototype/Visual QA → Atomic Implementation Tasks → Quality Gates → Controlled Release`

## Priority Backlog
### P0 — Foundation before broad visual implementation
1. Design Intelligence Synthesis.
2. Product positioning/message hierarchy.
3. Shared design-system contract.
4. Typography decision with real Arabic/English/mixed content.
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
### Design Intelligence Synthesis — close external research and reconcile it with repository evidence

**Objective:** produce one ranked, evidence-backed design decision set covering the website, public customer experience, Owner Studio, brand system, typography, color, content, conversion, accessibility, RTL, SEO, performance, trust, pricing, analytics, and growth.

**Files likely to change:** `docs/design-intelligence-audit.md`, `docs/design-research-log.md`, `docs/design-strategy-master-plan.md`, `PROJECT_STATE.md`, `TASKS.md` only if synthesis changes the queue.

**Acceptance criteria:**
- external research report reconciled with repository evidence;
- competitor matrix and transferable patterns consolidated;
- final design opportunities ranked P0/P1/P2;
- explicit do-not-change boundaries retained;
- typography and color remain decisions backed by tests/evidence, not assumptions;
- homepage, public menu, and Owner Studio priorities are explicit;
- no code changed during synthesis;
- exact next atomic implementation/research task identified.

**Risks:** research bias, vendor marketing claims, trend-chasing, unsupported feature assumptions, scope creep, and reopening completed theme work.

**Verification:** inspect repository state/docs, validate important external claims against primary sources, review final diff, and ensure only the single synthesis task was performed.
