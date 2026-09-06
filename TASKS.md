# TASKS

## Completed Tasks
### Heritage Theme Implementation — CLOSED / VERIFIED
- **VERIFIED:** distinct Heritage presentation layer implemented using the existing `contemporary-restaurant` family and shared public-menu behavior.
- **VERIFIED:** GitHub Actions quality run `34000474005` completed successfully.
- **UNKNOWN / BLOCKED:** direct authenticated browser/device visual closure and post-hydration console inspection remain pending.

### Gallery Theme Implementation — CLOSED / VERIFIED
- **VERIFIED:** distinct Gallery presentation layer implemented using the existing `bakery-dessert` family and shared public-menu behavior.
- **VERIFIED:** `src/theme-gallery.css` is loaded from `src/routes/__root.tsx`.
- **VERIFIED:** image-led portrait media, product-name/price hierarchy, category/search treatment, intentional image fallback, responsive behavior, safe-area clearance, focus states, and reduced-motion handling are implemented.
- **VERIFIED:** selectors are scoped to `html[data-menu-theme="gallery"]`.
- **VERIFIED:** no new template architecture or shared business-logic rewrite was introduced.
- **VERIFIED:** GitHub Actions quality run `34001361889` for commit `924feda71869a45fb161e2524c6bcc59dcf9dd6d` completed successfully.
- **VERIFIED:** automated quality completed install, route generation, typecheck, tests, lint, production build, Playwright Chromium installation, browser template QA for all themes, performance baseline upload, cleanup, and completion.
- **VERIFIED:** performance artifact `g6-performance-baseline` was generated.
- **VERIFIED:** no schema, auth, customer-action, dependency, CI/CD, or Vercel configuration change was introduced.
- **UNKNOWN / BLOCKED:** direct authenticated browser/device visual closure, Opera-specific behavior, and post-hydration console inspection remain pending.

## Completed Research / Planning
### Design Intelligence & Product Experience Planning — CLOSED / VERIFIED
- **VERIFIED:** the final planning round shifted focus away from theme implementation and covered the complete product/site experience.
- **VERIFIED:** the master plan covers product positioning, brand/content, marketing website, public menu, Owner Studio, shared design system, typography, color, imagery, motion, accessibility, RTL/bidi, SEO/local discovery, performance, trust/security, pricing, analytics/growth, and release QA.
- **VERIFIED:** Saudi/MENA and global competitive signals, authoritative web guidance, current brand direction, and repository constraints were incorporated.
- **VERIFIED:** all workstreams, priorities, protected scope, decision principles, governance, readiness criteria, and execution sequence are documented in `docs/design-strategy-master-plan.md`.
- **VERIFIED:** design intelligence evidence remains in `docs/design-intelligence-audit.md` and `docs/design-research-log.md`.
- **VERIFIED:** completed themes are explicitly protected and are not the current focus.

### Shared Design System Contract — CLOSED / VERIFIED
- **VERIFIED:** `docs/design-system-contract.md` establishes implementation-ready shared rules without introducing a new theme.
- **VERIFIED:** contract covers semantic tokens, typography roles, spacing, radius, elevation, motion, responsive layout, RTL/LTR/bidi, components/states, public menu, Owner Studio, marketing site, imagery, accessibility, performance, SEO, trust/security, and theme boundaries.
- **VERIFIED:** exact production typography and color values remain unresolved until their dedicated evidence-based decision tasks.
- **VERIFIED:** no application source, schema, dependency, CI/CD, or Vercel configuration changed in this task.

## Protected Scope
- Essential, Editorial, Noir, Heritage, and Gallery implementation milestones are protected from unnecessary reopening.
- Shared public-menu behavior, customer actions, authentication, authorization, tenant/branch isolation, routing, migrations, and deployment controls remain protected.
- No database schema/migration changes are planned for design research or presentation strategy without a proven requirement.
- No weakening of authentication, authorization, tenant/branch isolation, subscription status, SEO, routing, CI/CD, or deployment controls.
- No client-controlled entitlement bypass.
- Do not create a sixth theme as a substitute for product/design strategy.

## Permanent Quality Gate
Every future template/public-menu UI task must use `AGENTS.md`, `docs/design-intelligence.md`, `docs/template-review-checklist.md`, `docs/visual-functional-audit.md`, `docs/design-research-log.md`, `docs/project-memory/problems-learned.md`, `docs/design-strategy-master-plan.md`, and `docs/design-system-contract.md` where applicable.

## Master Design Strategy
The cross-functional roadmap is recorded in `docs/design-strategy-master-plan.md`.

Workstreams:
- W0 Evidence, measurement, product positioning.
- W1 Brand positioning and content system.
- W2 Marketing website/homepage.
- W3 Public customer menu.
- W4 Owner Studio/admin UX.
- W5 Shared design system.
- W6 Typography.
- W7 Color and brand tokens.
- W8 Imagery/art direction.
- W9 Motion/interaction.
- W10 Accessibility/RTL quality.
- W11 SEO/local discovery/shareability.
- W12 Performance/reliability.
- W13 Trust/security/data ownership.
- W14 Pricing/packaging/commercial UX.
- W15 Growth/analytics/experimentation.
- W16 QA/browser/device/release.

## Current Task
### Typography Decision — benchmark candidate font systems
- **Objective:** select one production-ready default typography system plus fallbacks using actual Menu V3 Arabic/English/mixed content and measurable performance constraints.
- **Scope:** Arabic shaping, Latin pairing, numerals, SAR, phones, URLs, mixed-direction content, hierarchy, readability, licensing/availability, font loading, subsetting, and layout stability.
- **Constraints:** do not reopen themes; do not globally replace fonts without evidence; preserve RTL/bidi semantics; do not add dependencies without a documented need.
- **Acceptance criteria:** candidate set explicit; real-content comparison complete; performance/licensing evidence recorded; one default plus fallbacks selected or the decision explicitly BLOCKED; if source changes occur, relevant quality gates pass; continuity updated.
- **Risks:** metric changes can cause layout drift; Arabic shaping/readability can regress; font loading can hurt performance; licensing may be misunderstood.
- **Verification:** compare representative Arabic/English/mixed strings and UI roles, inspect responsive behavior, run `npm run typecheck`, `npm test`, `npm run lint`, and `npm run build` if source changes are made, then review the final diff.

## Browser / Deployment Constraint
- **UNKNOWN / BLOCKED:** authenticated browser/device closure remains pending because the current agent environment does not provide the required interactive browser/device surface.
- Do not use Vercel as a substitute for ordinary design iteration.
- Before any deployment-specific check, inspect Vercel Usage/Billing and follow the release-only workflow.

## Exact Next Task
### Typography Decision — benchmark candidate font systems against real Menu V3 Arabic/English/mixed content and performance constraints
After typography is closed, select exactly one next task from the master plan based on evidence: Color Decision, Marketing Homepage IA, Public Menu UX Audit, Owner Studio Activation/Publish UX Audit, or Measurement/Event Baseline.
