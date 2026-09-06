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

## Protected Completed Work
- Essential, Editorial, Noir, Heritage, and Gallery implementation milestones are not reopened by the next browser/device task.
- Shared public-menu behavior, customer actions, authentication, authorization, tenant/branch isolation, routing, migrations, and deployment controls remain protected.
- No database schema, migration, dependency, CI/CD, or Vercel configuration changes were introduced by Heritage/Gallery theme presentation work.

## Current Theme Evidence
- **VERIFIED:** the theme registry defines five keys: `essential`, `editorial`, `noir`, `heritage`, and `gallery`.
- **VERIFIED:** Heritage maps to `contemporary-restaurant` with hero/list/horizontal-card/scroll-category/landscape metadata.
- **VERIFIED:** Gallery maps to `bakery-dessert` with standard-header/gallery-grid/vertical-card/scroll-category/portrait metadata.
- **VERIFIED:** Heritage has a dedicated `theme-heritage.css` presentation layer loaded by the root document.
- **VERIFIED:** Gallery has a dedicated `theme-gallery.css` presentation layer loaded by the root document.
- **VERIFIED:** shared public-menu logic owns search, categories, product details, modifiers, cart/order, language handling, and configured customer actions.
- **VERIFIED:** repository memory warns against duplicate shells, broad selectors, unnecessary stacking contexts, arbitrary z-index escalation, and animation-dependent visibility.

## Heritage Implementation — CLOSED / VERIFIED
- **VERIFIED:** implemented using the existing `contemporary-restaurant` family and shared renderer behavior.
- **VERIFIED:** implementation is scoped to `html[data-menu-theme="heritage"]`.
- **VERIFIED:** GitHub Actions quality run `34000474005` completed successfully for the Heritage implementation.
- **UNKNOWN / BLOCKED:** authenticated real-browser/device visual closure, Opera-specific behavior, and post-hydration console inspection remain unavailable in the current agent environment.

## Gallery Implementation — CLOSED / VERIFIED
- **VERIFIED:** Gallery presentation layer implemented on 2026-09-06 using the existing `bakery-dessert` family.
- **VERIFIED:** implementation is scoped to `html[data-menu-theme="gallery"]` and does not introduce a new template architecture.
- **VERIFIED:** image-led gallery treatment includes stable portrait media, product-name/price hierarchy, category/search treatment, intentional missing-image fallback, safe-area clearance, focus states, and reduced-motion handling.
- **VERIFIED:** shared public-menu/customer-action semantics remain unchanged.
- **VERIFIED:** GitHub Actions quality run `34001361889` for commit `924feda71869a45fb161e2524c6bcc59dcf9dd6d` completed with `success`.
- **VERIFIED:** the quality run passed install, route generation, typecheck, tests, lint, production build, Playwright Chromium installation, browser template QA for all themes, performance baseline upload, cleanup, and completion.
- **VERIFIED:** no database schema/migration, auth, customer-action, dependency, CI/CD, or Vercel configuration change was introduced.
- **UNKNOWN / BLOCKED:** authenticated real-browser/device visual closure, Opera-specific behavior, and post-hydration console inspection remain unavailable in the current agent environment.

## Browser / Deployment State
- **VERIFIED:** automated Playwright browser template QA passed for all five themes in quality run `34001361889`.
- **VERIFIED:** performance baseline artifact `g6-performance-baseline` was produced by run `34001361889`.
- **VERIFIED:** direct Vercel SSR preview requests previously succeeded with HTTP 200 for `essential`, `editorial`, `noir`, `heritage`, and `gallery`.
- **VERIFIED:** Arabic previews return `lang="ar"`, `dir="rtl"`, and preview-safe robots metadata.
- **VERIFIED:** English preview support returns `lang="en"` and `dir="ltr"` where requested.
- **UNKNOWN / BLOCKED:** authenticated browser/device closure remains pending because the current agent environment has no interactive browser/device surface.

## Permanent Release-Only Vercel Workflow
- **VERIFIED:** Vercel is a release platform, not the normal development/design iteration environment.
- **VERIFIED:** normal path is `LOCAL DEVELOPMENT → LOCAL QA → LOCAL BROWSER / VISUAL QA → TESTS → GITHUB ACTIONS QUALITY GATES → DIFF REVIEW → ONE COHERENT RELEASE BATCH → MERGE TO MAIN → ONE VERCEL PRODUCTION DEPLOYMENT → REAL-DEVICE PRODUCTION QA → RECORD RESULT`.
- **VERIFIED:** visual CSS/theme iteration must not require Vercel deployment.
- **VERIFIED:** before future deployment decisions, inspect actual Vercel Usage/Billing and record any limiting resource.

## Project Memory
- **VERIFIED:** `docs/project-memory/problems-learned.md` is the permanent evidence-based memory of hard problems and anti-patterns.
- **VERIFIED:** Heritage and Gallery work followed the memory rules for theme presentation ownership and Vercel release discipline.

## Session Log — 2026-09-06
- **Completed task:** Gallery Theme Implementation — scoped presentation layer only.
- **VERIFIED:** existing `bakery-dessert` family was reused; no new template architecture was introduced.
- **VERIFIED:** `src/theme-gallery.css` provides the Gallery presentation layer and `src/routes/__root.tsx` loads it.
- **VERIFIED:** commit `924feda71869a45fb161e2524c6bcc59dcf9dd6d` passed GitHub Actions quality run `34001361889` with conclusion `success`.
- **VERIFIED:** all required automated quality stages completed successfully, including browser template QA for all five themes and performance baseline generation.
- **VERIFIED:** the implementation preserved shared public-menu/customer-action semantics and did not change schema, auth, dependencies, CI/CD, or Vercel configuration.
- **UNKNOWN / BLOCKED:** direct authenticated browser/device evidence remains pending.
- **Result:** Gallery implementation milestone closed at repository/CI evidence level.

## Exact Next Task
Close the remaining authenticated browser/device QA gate for the five preview variants, then perform final release-batch review. Do not reopen completed theme implementations unless direct QA evidence identifies a concrete regression.
