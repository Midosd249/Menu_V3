# W8 Main Runtime Diagnosis — 2026-09-15

## Classification

**Visual-delivery incident.** This record is scoped to the existing W8 internal visual system and does not create a parallel project system.

## Ground truth — VERIFIED

- Repository: `Midosd249/Menu_V3`
- Main before correction: `6c673606f47c638c8d6f301be58bd792986692eb`
- PR #147: merged by squash into `main`.
- W8 squash merge commit: `09b143d3262279564b29ccc33b39b49b615fb15c`
- W8 final pre-merge head: `0c56f3b0250179f5f373a7ff24bdfa3c3d0512c4`
- Main contains the W8 semantic visual layer, W8 contract test, W8 documentation, and continuity records.
- No W8 Public Menu theme files were part of the PR #147 changed-file set.

## Deployment ground truth — VERIFIED

Vercel project metadata identifies the repository as `Midosd249/Menu_V3` and the project as `menu-v3`.

The verified Production deployment was:

- Deployment type: **Production**
- Deployment commit: `6c673606f47c638c8d6f301be58bd792986692eb`
- Git ref: `main`
- State: `READY`
- Production deployment URL: `https://menu-v3-58dft8328-midosd2s-projects.vercel.app`
- Configured project domain: `https://menu-v3-kohl.vercel.app`

A newer Preview deployment exists for PR #149, but it is not the Production deployment.

## Runtime diagnosis — VERIFIED from source/runtime contract inspection

The W8 semantic CSS in `src/colors.css` scoped Studio through:

`body:has([role="banner"])`

The current Studio Shell renders a semantic `<header>` without an explicit `role="banner"` attribute. The explicit DOM landmark used by the Studio runtime is instead:

`nav[aria-label="مساحات العمل"]`

The W8 selector therefore relied on an attribute that was not present in the actual Studio DOM. The HTML `<header>` may expose an implicit accessibility banner role, but `[role="banner"]` is an attribute selector and does not match an implicit role.

### Primary root cause

`INTERNAL_SCOPE_SELECTOR_DOES_NOT_MATCH_RUNTIME`

### Secondary deployment finding

`NONE` — the verified Production deployment is built from the current `main` SHA `6c673606f47c638c8d6f301be58bd792986692eb`, so this is not a Vercel branch/commit mismatch.

## Smallest correction

A Studio-only scope bridge was added after `colors.css`. It uses the existing explicit Studio navigation landmark:

`body:has(nav[aria-label="مساحات العمل"])`

The bridge restores the W8 semantic aliases and the required Midnight Ink navigation/header/mobile treatment without touching Public Menu selectors, theme adapters, business logic, authentication, data, or deployment configuration.

Focused browser assertions were added to the existing Studio and Platform Admin browser QA to verify actual computed colors at runtime.

## Required runtime values

- Canvas: `#F2EDE3`
- Surface: `#FBF8F2`
- Ink: `#1D2421`
- Operational navigation: `#1F2522`
- Active navigation: `#2C3430`
- Focus: `#8B642E`

## Status before final merge

- Correction branch: `fix/w8-internal-visual-delivery`
- Current-head CI: **PENDING**
- Actual browser computed-style proof after correction: **PENDING CI**
- Main correction: **NOT YET MERGED**
- Production deployment action: **NOT PERFORMED**

## Protected areas

No changes are authorized or included for database/schema, Supabase, RLS, authentication, authorization, permissions, subscriptions/entitlements, AI, orders business logic, route architecture, dependencies, package-lock, Vercel configuration, deployment configuration, or Public Menu theme identity.
