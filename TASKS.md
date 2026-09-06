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
- **VERIFIED:** broad research scope was established across product positioning, marketing website, public menu, Owner Studio, typography, color, imagery, motion, accessibility, RTL/bidi, SEO/local discovery, performance, trust/security, pricing, analytics, growth, and release QA.
- **VERIFIED:** Saudi/MENA and global restaurant-tech/product patterns were incorporated as transferable evidence.
- **VERIFIED:** a comprehensive roadmap was created in `docs/design-strategy-master-plan.md`.
- **VERIFIED:** themes are explicitly not the current focus and completed theme work is protected.
- **VERIFIED:** research governance and evidence labels are documented.

## Protected Scope
- Essential, Editorial, Noir, Heritage, and Gallery implementation milestones are protected from unnecessary reopening.
- Shared public-menu behavior, customer actions, authentication, authorization, tenant/branch isolation, routing, migrations, and deployment controls remain protected.
- No database schema/migration changes are planned for design research or presentation strategy without a proven requirement.
- No weakening of authentication, authorization, tenant/branch isolation, subscription status, SEO, routing, CI/CD, or deployment controls.
- No client-controlled entitlement bypass.
- Do not create a sixth theme as a substitute for product/design strategy.

## Permanent Quality Gate
Every future template/public-menu UI task must use `AGENTS.md`, `docs/design-intelligence.md`, `docs/template-review-checklist.md`, `docs/visual-functional-audit.md`, `docs/design-research-log.md`, `docs/project-memory/problems-learned.md`, and `docs/design-strategy-master-plan.md` where applicable.

## Master Design Strategy
The cross-functional design/product roadmap is recorded in `docs/design-strategy-master-plan.md`.

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
### Design Intelligence Synthesis — IN_PROGRESS
- **Objective:** close the broad research round and reconcile external research, repository evidence, existing brand direction, competitive signals, Arabic/RTL standards, and product capabilities into one ranked decision set before implementation.
- **Scope:** website, public menu, Owner Studio, brand system, typography, color, content, conversion, accessibility, RTL/bidi, SEO/local discovery, performance, trust/security, pricing, analytics, and growth. Themes are not the focus.
- **Required outputs:** consolidated evidence map, 10–15 competitor/reference matrix, homepage IA recommendation, public-menu UX priorities, Owner Studio priorities, typography shortlist/decision path, color territory direction, design-system principles, accessibility/RTL/performance requirements, opportunity backlog, explicit do-not-change list, and atomic implementation roadmap.
- **Constraints:** no code changes; no redesign of completed themes; no unsupported feature assumptions; no proprietary copying; no Vercel deployment for research.
- **Verification:** reconcile sources against repository evidence, distinguish VERIFIED/INFERRED/PROPOSED/UNKNOWN, review documentation diff, and identify exactly one next atomic task.

## Browser / Deployment Constraint
- **UNKNOWN / BLOCKED:** authenticated browser/device closure remains pending because the current agent environment does not provide the required interactive browser/device surface.
- Do not use Vercel as a substitute for ordinary design iteration.
- Before any deployment-specific check, inspect Vercel Usage/Billing and follow the release-only workflow.

## Exact Next Task
### Design Intelligence Synthesis — close external research and reconcile it with repository evidence
After this task is closed, the next atomic task will be selected from the master plan based on evidence. The expected candidates are `Design System Contract`, `Typography Decision`, `Marketing Homepage IA`, `Public Menu UX Audit`, or `Owner Studio Activation/Publish UX Audit`; do not start more than one without updating this file.
