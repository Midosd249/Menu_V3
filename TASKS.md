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

## Protected Scope
- Essential, Editorial, Noir, Heritage, and Gallery implementation milestones are protected from unnecessary reopening.
- Shared public-menu behavior, customer actions, authentication, authorization, tenant/branch isolation, routing, migrations, and deployment controls remain protected.
- No database schema/migration changes are planned for theme presentation work.
- No weakening of authentication, authorization, tenant/branch isolation, subscription status, SEO, routing, CI/CD, or deployment controls.
- No client-controlled entitlement bypass.

## Temporary Testing Access
- `MENU_THEME_TESTING_OVERRIDE=true`
- `MENU_THEME_TESTING_OVERRIDE_EXPIRES_AT=<future ISO-8601 timestamp>`
- Both are required; expired/missing override is OFF.
- Override applies only to premium theme entitlement checks for authenticated owner/admin users; subscription status remains enforced.
- Review and disable before commercial production launch.

## Permanent Quality Gate
Every future template/public-menu UI task must use `AGENTS.md`, `docs/design-intelligence.md`, `docs/template-review-checklist.md`, `docs/visual-functional-audit.md`, `docs/design-research-log.md`, and `docs/project-memory/problems-learned.md`.

## Current Task
### Authenticated Browser/Device QA Closure — IN_PROGRESS
- **Objective:** close the remaining direct browser/device evidence gate for all five preview variants: Essential, Editorial, Noir, Heritage, and Gallery.
- **Scope:** evidence and targeted regression fixes only; do not redesign completed themes without direct evidence of a defect.
- **Required checks:** Arabic RTL, English LTR, mixed-direction content, mobile/tablet/desktop geometry, long names/categories, SAR price stability, missing/varied images, empty/populated states, fixed/sticky controls, safe-area clearance, supported customer actions, keyboard/focus behavior, and post-hydration console inspection.
- **Browser evidence:** screenshots and direct interaction evidence are required where the environment supports them. HTTP 200, SSR inspection, and CI template QA are not substitutes for direct visual/device evidence.
- **Release safety:** do not deploy to Vercel merely for ordinary visual iteration. If deployment-specific evidence is genuinely required, inspect Vercel Usage/Billing first and follow the release-only workflow.

## Exact Next Task
### Authenticated Browser/Device QA Closure — all five preview variants
When an interactive browser/device surface is available, execute the checks above, record evidence, fix only the first concrete regression if one is found, rerun the applicable gates, and then stop.
