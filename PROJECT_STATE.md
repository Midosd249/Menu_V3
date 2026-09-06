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
- **Heritage + Gallery — comprehensive repository/design audit COMPLETE; implementation remains next.**
- **Visual/Functional Quality System — DONE / VERIFIED / MERGED.**
- **External Theme Preview QR Mode — DONE / VERIFIED.**
- **Shared Public Menu Rendering Stabilization — VERIFIED in repository.**

## Protected Completed Work
- Essential, Editorial, and Noir are not reopened by the Heritage/Gallery task.
- Shared public-menu behavior, customer actions, authentication, authorization, tenant/branch isolation, routing, migrations, and deployment controls remain protected.
- No database schema, migration, dependency, CI/CD, or Vercel configuration changes are part of the current theme work.

## Current Theme Evidence
- **VERIFIED:** the theme registry defines five keys: `essential`, `editorial`, `noir`, `heritage`, and `gallery`.
- **VERIFIED:** Heritage maps to `contemporary-restaurant` with hero/list/horizontal-card/scroll-category/landscape metadata.
- **VERIFIED:** Gallery maps to `bakery-dessert` with standard-header/gallery-grid/vertical-card/scroll-category/portrait metadata.
- **VERIFIED:** neither Heritage nor Gallery currently has a dedicated theme stylesheet; their differentiation is presently primarily registry-token/family-template based.
- **VERIFIED:** shared public-menu logic owns search, categories, product details, modifiers, cart/order, language handling, and configured customer actions.
- **VERIFIED:** repository memory warns against duplicate shells, broad selectors, unnecessary stacking contexts, arbitrary z-index escalation, and animation-dependent visibility.

## Heritage + Gallery Audit — CLOSED / VERIFIED
- **VERIFIED:** comprehensive repository audit completed on 2026-09-06.
- **VERIFIED:** relevant architecture, theme registry, shared renderer, template families, quality checklist, visual audit contract, project memory, and current state documents were inspected.
- **VERIFIED:** material research was performed using W3C Arabic/i18n guidance, current digital-menu guidance, and Saudi/MENA public examples.
- **VERIFIED:** the findings and implementation boundary are recorded in `docs/theme-audit-heritage-gallery.md`.
- **HIGH finding:** Heritage needs a distinct scoped presentation layer; current differentiation is mostly token-level.
- **HIGH finding:** Gallery needs a distinct scoped presentation layer; current differentiation is mostly token-level.
- **PROPOSED:** Heritage should use restrained Arabic/Saudi material cues with information hierarchy above ornament.
- **PROPOSED:** Gallery should use a disciplined image-first catalogue system with stable media boxes and mobile scanability.
- **VERIFIED:** no new template or customer-action system is required; the existing family templates can be refined through scoped presentation.
- **UNKNOWN:** rendered browser/device geometry, mixed-direction behavior, safe-area behavior, and post-hydration console state remain unobserved.

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
- **VERIFIED:** current work followed the memory rules for theme presentation ownership and Vercel release discipline.

## Session Log — 2026-09-06
- **Completed task:** Comprehensive Audit & Design Intelligence Pass — Heritage + Gallery.
- **VERIFIED:** repository architecture and relevant documentation were inspected before making a design decision.
- **VERIFIED:** Heritage and Gallery are registry-level themes mapped to existing template families, but neither has a dedicated presentation stylesheet.
- **VERIFIED:** material research covered Arabic/i18n layout requirements and Saudi/MENA digital-menu patterns.
- **VERIFIED:** audit findings and implementation boundaries were recorded in `docs/theme-audit-heritage-gallery.md`.
- **VERIFIED:** no application code, schema, auth, or deployment configuration was changed in this audit task.
- **UNKNOWN:** browser/device visual behavior remains unverified.
- **Result:** audit milestone closed; implementation is the next atomic task.

## Exact Next Task
Implement the smallest complete, scoped presentation layer for **Heritage only**, using the audited design brief and existing `contemporary-restaurant` family. Preserve shared public-menu behavior, then run the full applicable quality gates and update continuity. Do not start Gallery implementation in the same task.
