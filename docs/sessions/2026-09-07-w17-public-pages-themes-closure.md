# W17 — Public Pages & Themes Integration — Closure

Date: 2026-09-07

## Current position
W17 Public Pages & Themes Integration is merged into `main`. The canonical repository remains `Midosd249/Menu_V3`.

## Completed task
Integrated the public customer conversion surface into the existing Menu V3 architecture without replacing the protected backend or public-menu renderer.

### Homepage
- Homepage pricing is sourced from `COMMERCIAL_PLANS`.
- Free, Starter, and Pro are visible on the homepage.
- Plan selection visibly hands off to the existing new-customer request form.
- Selected plan is preserved in the request context.
- Selected theme is preserved in the request context.
- The request flow explicitly identifies itself as a new customer request.
- Existing `submitLead` contract and reference confirmation are preserved.

### Themes
- Homepage and `/themes` surface the canonical five protected themes from `MENU_THEMES`.
- No sixth theme was introduced.
- No artificial premium theme gate was introduced.
- Theme cards expose personality, product presentation, and imagery characteristics.
- `/themes/preview` uses the real `MenuThemeController`, `PublicMenuView`, and `ContemporaryRestaurantTemplate` rather than a duplicate static menu renderer.
- Theme preview supports the existing Arabic/English direction controls and real theme selection.

## Protected boundaries
No database schema, migrations, authentication, authorization, RLS, analytics taxonomy, Owner Studio, or public-menu renderer replacement was introduced by W17.

## Verification
GitHub Actions Quality run `34062957312` passed:
- route generation
- typecheck
- tests
- lint
- production build
- Playwright Chromium installation
- Browser Template QA for all themes
- performance baseline step
- preview cleanup

A W17 contract-test failure was found during verification and corrected before merge. The final Quality run passed all steps.

## Merge evidence
- W17 PR: #20
- Squash merge commit: `92fdc593d1cd344460f9bc6f8e3c9a0406d6cdd1`
- Canonical branch: `main`

## Remaining issues
W16 production release evidence remains separate. The existing Vercel `build-rate-limit` blocker means this documentation does not claim a new production deployment or real-device production QA.

## Next task
`W16-R — Controlled production release retry after Vercel capacity is cleared` remains the next release task. It must only be closed after direct deployment evidence, deployed-commit match, real-device production QA, and confirmation that any temporary testing override is disabled or expired.
