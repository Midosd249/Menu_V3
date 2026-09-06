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
- **Theme 5 — Gallery — comprehensive audit COMPLETE; implementation remains next.**
- **Visual/Functional Quality System — DONE / VERIFIED / MERGED.**
- **External Theme Preview QR Mode — DONE / VERIFIED.**
- **Shared Public Menu Rendering Stabilization — VERIFIED in repository.**

## Protected Completed Work
- Essential, Editorial, and Noir are not reopened by the Gallery task.
- Shared public-menu behavior, customer actions, authentication, authorization, tenant/branch isolation, routing, migrations, and deployment controls remain protected.
- No database schema, migration, dependency, CI/CD, or Vercel configuration changes are part of the current theme work.

## Current Theme Evidence
- **VERIFIED:** the theme registry defines five keys: `essential`, `editorial`, `noir`, `heritage`, and `gallery`.
- **VERIFIED:** Heritage maps to `contemporary-restaurant` with hero/list/horizontal-card/scroll-category/landscape metadata.
- **VERIFIED:** Gallery maps to `bakery-dessert` with standard-header/gallery-grid/vertical-card/scroll-category/portrait metadata.
- **VERIFIED:** Heritage now has a dedicated `theme-heritage.css` presentation layer loaded by the root document.
- **VERIFIED:** Gallery does not yet have a dedicated stylesheet; its differentiation remains registry-token/family-template based.
- **VERIFIED:** shared public-menu logic owns search, categories, product details, modifiers, cart/order, language handling, and configured customer actions.
- **VERIFIED:** repository memory warns against duplicate shells, broad selectors, unnecessary stacking contexts, arbitrary z-index escalation, and animation-dependent visibility.

## Heritage Implementation — CLOSED / VERIFIED
- **VERIFIED:** Heritage presentation layer implemented on 2026-09-06 using the existing `contemporary-restaurant` family.
- **VERIFIED:** implementation is scoped to `html[data-menu-theme="heritage"]` and preserves shared renderer behavior.
- **VERIFIED:** root stylesheet loading was added without creating a new template architecture.
- **VERIFIED:** design direction follows the audited Heritage brief: warm parchment/stone surfaces, dark ink, restrained terracotta/bronze accents, Arabic-first hierarchy, tactile category treatment, landscape media, and controlled decorative cues.
- **VERIFIED:** GitHub Actions quality run `34000474005` for commit `6f3e8bcb92ea943bec9ad1edbce25ec7d75cf587` completed with `success`.
- **VERIFIED:** the quality workflow completed successfully for the Heritage implementation commit.
- **VERIFIED:** no schema, auth, customer-action, dependency, CI/CD, or Vercel configuration change was introduced by the Heritage implementation.
- **UNKNOWN / BLOCKED:** authenticated real-browser/device visual closure, Opera-specific behavior, and post-hydration console inspection remain unavailable in the current agent environment.

## Browser / Deployment State
- **VERIFIED:** automated Playwright browser template QA previously passed for all five themes.
- **VERIFIED:** direct Vercel SSR preview requests for `/m/nafas` succeeded with HTTP 200 for `essential`, `editorial`, `noir`, `heritage`, and `gallery`.
- **VERIFIED:** Arabic previews return `lang="ar"`, `dir="rtl"`, `robots=noindex,nofollow`, and the requested preview theme.
- **VERIFIED:** English Editorial preview returns `lang="en"`, `dir="ltr"`, English labels, and the requested preview theme.
- **UNKNOWN / BLOCKED:** authenticated browser/device closure remains pending because the current agent environment has no interactive browser/device surface.

## Permanent Release-Only Vercel Workflow
- **VERIFIED:** Vercel is a release platform, not the normal development/design iteration environment.
- **VERIFIED:** normal path is `LOCAL DEVELOPMENT → LOCAL QA → LOCAL BROWSER / VISUAL QA → TESTS → GITHUB ACTIONS QUALITY GATES → DIFF REVIEW → ONE COHERENT RELEASE BATCH → MERGE TO MAIN → ONE VERCEL PRODUCTION DEPLOYMENT → REAL-DEVICE PRODUCTION QA → RECORD RESULT`.
- **VERIFIED:** visual CSS/theme iteration must not require Vercel deployment.
- **VERIFIED:** before future deployment decisions, inspect actual Vercel Usage/Billing and record any limiting resource.

## Project Memory
- **VERIFIED:** `docs/project-memory/problems-learned.md` is the permanent evidence-based memory of hard problems and anti-patterns.
- **VERIFIED:** current Heritage work followed the memory rules for theme presentation ownership and Vercel release discipline.

## Session Log — 2026-09-06
- **Completed task:** Heritage Theme Implementation — scoped presentation layer only.
- **VERIFIED:** existing `contemporary-restaurant` family was reused; no new template architecture was introduced.
- **VERIFIED:** `src/theme-heritage.css` provides the Heritage presentation layer and `src/routes/__root.tsx` loads it.
- **VERIFIED:** commit `6f3e8bcb92ea943bec9ad1edbce25ec7d75cf587` passed GitHub Actions quality run `34000474005` with conclusion `success`.
- **VERIFIED:** the implementation preserved shared public-menu/customer-action semantics and did not change schema, auth, dependencies, CI/CD, or Vercel configuration.
- **UNKNOWN / BLOCKED:** direct authenticated browser/device evidence remains pending.
- **Result:** Heritage implementation milestone closed at repository/CI evidence level.

## Exact Next Task
Implement the smallest complete, scoped presentation layer for **Gallery only**, using the completed Gallery audit and existing `bakery-dessert` family. Preserve shared public-menu behavior, then run the full applicable quality gates and update continuity. Do not reopen Heritage, Essential, Editorial, or Noir.
