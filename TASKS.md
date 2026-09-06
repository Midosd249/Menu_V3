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

### P0-01 Canonical Content & Publishing Model Audit — CLOSED / VERIFIED
- **VERIFIED:** `docs/canonical-content-publishing-audit.md` contains the evidence matrix, security review, decisions, non-actions, and follow-up.
- **VERIFIED:** existing Tenant, Branch, Category, Product, ProductVariant, ModifierGroup, ModifierOption, BranchHour, and menu-event structures form a viable canonical menu core.
- **VERIFIED:** Owner Studio and Public Menu consume the same tenant/category/product domain data.
- **VERIFIED:** public menu routes and active/published gates are present; public SEO metadata is generated from the same menu data.
- **VERIFIED:** owner writes are authenticated and tenant-scoped server-side.
- **PARTIAL:** publish is currently a boolean `is_published` gate; revision history, scheduling, audit trail, and rollback are not proven.
- **VERIFIED:** the original propagation gap has now been repaired with a database-backed public-content revision.

### P0 — Public Content Propagation Implementation — CLOSED / SOURCE-VERIFIED
- **VERIFIED:** all current Owner mutations affecting public content were mapped in `src/lib/menu/owner.ts`.
- **VERIFIED:** mutation surfaces include restaurant creation, tenant settings/publish, category create/update/delete, product create/update/delete/toggle, branch create/update/delete/hours, CSV import, and starter-item seeding.
- **VERIFIED:** `migrations/20260906001000_public_menu_content_revision.sql` adds `tenants.public_content_version` and database triggers covering tenants, branches, branch hours, categories, products, variants, modifier groups, modifier options, and product-modifier links.
- **VERIFIED:** `src/lib/menu/public.ts` versions its process-local cache key by the database revision while retaining tenant and branch identity in the key.
- **VERIFIED:** `src/components/public-menu.tsx` has no browser menu-content cache.
- **VERIFIED:** `src/lib/menu/session.ts` uses localStorage only for the anonymous analytics session identifier.
- **VERIFIED:** focused regression coverage was added in `scripts/public-menu-cache.test.mjs`.
- **VERIFIED:** `docs/canonical-content-publishing-audit.md` was corrected to remove the earlier incorrect browser-cache assumption.
- **VERIFIED:** no new dependency, theme change, or unrelated refactor was introduced.
- **BLOCKED:** local typecheck/tests/lint/build were not executable in the current agent environment because outbound DNS/network access is unavailable. No passing test result is claimed.

## Protected Scope
- Essential, Editorial, Noir, Heritage, and Gallery implementation milestones are protected from unnecessary reopening.
- Shared public-menu behavior, customer actions, authentication, authorization, tenant/branch isolation, routing, migrations, and deployment controls remain protected.
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
- W7 Color/brand tokens.
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
### P0 — Runtime verification of public-content propagation
- **Objective:** apply the new migration in the intended database, exercise representative Owner mutations, confirm revision increments and fresh Public Menu responses, verify cross-branch/tenant isolation, and run the repository quality gates.
- **Scope:** migration application; trigger behavior; cache-key versioning; tenant/branch isolation; focused regression; typecheck/test/lint/build.
- **Constraints:** do not add a second invalidation mechanism unless runtime evidence proves a defect; do not add revision publishing; do not reopen themes; preserve authorization and existing cache semantics.
- **Acceptance criteria:** migration applies; all public-content mutation surfaces increment revision; public cache refreshes after revision change; no cross-tenant/branch leakage; focused test passes; quality gates pass in a runnable repository environment; continuity updated.
- **Risks:** trigger recursion, migration incompatibility, stale process-local entries, cross-tenant cache contamination, unnecessary cache-busting, accidental expansion into revision publishing.
- **Verification:** `npm run typecheck`, `npm test`, `npm run lint`, `npm run build`, `node --test scripts/public-menu-cache.test.mjs`, plus a real database Owner → Public mutation check.

## Browser / Deployment Constraint
- **UNKNOWN / BLOCKED:** authenticated browser/device closure remains pending because the current agent environment does not provide the required interactive browser/device surface.
- Do not use Vercel as a substitute for ordinary design iteration.
- Before any deployment-specific check, inspect Vercel Usage/Billing and follow the release-only workflow.

## Exact Next Task
### P0 — Runtime verification of public-content propagation after Owner mutations, including migration application and cross-branch/tenant isolation
Only after runtime evidence closes this task should the next task be selected from the master plan; Typography remains queued until propagation correctness is fully verified.
