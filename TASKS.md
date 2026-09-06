# TASKS

## Completed Task
### Heritage Theme Implementation — CLOSED / VERIFIED
- **VERIFIED:** implemented a distinct Heritage presentation layer using the existing `contemporary-restaurant` family and shared public-menu behavior.
- **VERIFIED:** `src/theme-heritage.css` is loaded from the root document without introducing a new template architecture.
- **VERIFIED:** implementation follows the audited direction: warm parchment/stone surfaces, dark ink, restrained terracotta/bronze accents, Arabic-first hierarchy, tactile category treatment, landscape media, and controlled decorative cues.
- **VERIFIED:** GitHub Actions quality run `34000474005` for commit `6f3e8bcb92ea943bec9ad1edbce25ec7d75cf587` completed successfully.
- **VERIFIED:** no database schema/migration, auth, customer-action, dependency, CI/CD, or Vercel configuration change was introduced.
- **UNKNOWN / BLOCKED:** direct authenticated browser/device visual closure and post-hydration console inspection remain pending.

## Protected Scope
- Essential is not being redesigned or reopened.
- Editorial is not being redesigned or reopened.
- Noir is not being redesigned or reopened.
- Heritage is not being reopened in the Gallery task.
- No database schema/migration changes.
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
### Gallery Theme Implementation — IN_PROGRESS
- **Objective:** implement a distinct, premium Gallery presentation layer using the existing `bakery-dessert` family and shared public-menu behavior.
- **Scope:** Gallery presentation only; no new template architecture and no shared business-logic rewrite.
- **Design direction:** image-led premium catalogue, stable portrait media boxes, restrained editorial warmth, strong product-name/price hierarchy, disciplined category discovery, intentional image fallback, and mobile-first scanability.
- **Required safety:** use theme-scoped selectors, logical CSS properties, stable media boxes, explicit safe-area clearance, and no arbitrary stacking-context escalation.
- **Acceptance:** Arabic RTL, English LTR, mixed-direction strings, SAR price stability, long names, missing images/descriptions, available/sold-out states, sparse/dense categories, fixed/sticky controls, reduced motion, and existing customer actions remain correct.
- **Verification:** run typecheck, tests, platform tests, lint, build, auth check, template QA, and applicable performance audit after implementation.
- **Release:** do not deploy merely for visual iteration; follow the release-only Vercel policy for any later production release.

## Exact Next Task
### Gallery Theme Implementation — scoped presentation layer only
Implement and verify Gallery, then stop. Do not begin the browser/device closure task until Gallery is fully verified and documented.
