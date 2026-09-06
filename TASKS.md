# TASKS

## Completed Task
### Heritage + Gallery Comprehensive Audit — CLOSED / VERIFIED
- **VERIFIED:** repository architecture, theme registry, shared public-menu renderer, relevant template families, quality checklist, visual/functional audit contract, project memory, and continuity documents were inspected.
- **VERIFIED:** Heritage maps to `contemporary-restaurant`; Gallery maps to `bakery-dessert`.
- **VERIFIED:** neither remaining theme currently has a dedicated theme stylesheet; differentiation is primarily registry-token/family-template based.
- **VERIFIED:** W3C Arabic/i18n guidance, current digital-menu guidance, and Saudi/MENA public examples were reviewed for material decisions.
- **VERIFIED:** findings, risks, design directions, and implementation boundaries are recorded in `docs/theme-audit-heritage-gallery.md`.
- **VERIFIED:** no application code, schema, auth, customer-action logic, dependency, CI/CD, or deployment configuration was changed by the audit.
- **UNKNOWN:** browser/device visual behavior and post-hydration console behavior remain pending.

## Protected Scope
- Essential is not being redesigned or reopened.
- Editorial is not being redesigned or reopened.
- Noir is not being redesigned or reopened.
- Gallery is not being implemented in the Heritage task.
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
### Heritage Theme Implementation — IN_PROGRESS
- **Objective:** implement a distinct, premium Heritage presentation layer using the existing `contemporary-restaurant` family and shared public-menu behavior.
- **Scope:** Heritage presentation only; no new template architecture and no shared business-logic rewrite.
- **Design direction:** restrained Arabic/Saudi material identity, warm parchment/stone surfaces, dark ink, controlled terracotta/bronze accents, clear Arabic-first hierarchy, tactile category rail, stable horizontal product cards, landscape media, and subtle pattern/material cues.
- **Required safety:** use theme-scoped selectors, logical CSS properties, stable media boxes, explicit safe-area clearance, and no arbitrary stacking-context escalation.
- **Acceptance:** Arabic RTL, English LTR, mixed-direction strings, SAR price stability, long names, missing images/descriptions, available/sold-out states, sparse/dense categories, fixed/sticky controls, reduced motion, and existing customer actions remain correct.
- **Verification:** run typecheck, tests, platform tests, lint, build, auth check, template QA, and applicable performance audit after implementation.
- **Release:** do not deploy merely for visual iteration; follow the release-only Vercel policy for any later production release.

## Exact Next Task
### Heritage Theme Implementation — scoped presentation layer only
Implement and verify Heritage, then stop. Do not start Gallery until Heritage is fully verified and documented.
