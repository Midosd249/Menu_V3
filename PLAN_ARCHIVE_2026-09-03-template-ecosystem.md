# Archived Plan — Template Ecosystem Redesign

Archived on 2026-09-03 before strategic reassessment.

The repository preserved the following completed work from this plan:
- T1 template architecture contract — DONE / VERIFIED (`33742263927`).
- T2 shared semantic menu presentation primitives — DONE / VERIFIED (`33742271561`).
- T3 `contemporary-restaurant` flagship renderer — DONE / VERIFIED (`33743105967`).
- Theme preview routing correction — DONE / VERIFIED (`657757dfe485465277088108b43871f8d941a9a4`).

The former T4 browser-quality gate remains historically recorded, but its CI execution exposed a preview-process integration failure (`33744076308`): repository quality checks passed through production build and Playwright installation, while `npm run preview` exited before the browser gate. This reassessment supersedes the old milestone order; it does not delete or reopen completed T1–T3 work.

Original active-plan strategy:
- Preserve the canonical `PublicMenu` contract.
- Introduce six behavioral template families.
- Keep presentation separate from data, authorization, pricing, availability, and ordering rules.
- Use semantic menu primitives and bounded customization.
- Validate mobile, RTL, accessibility, performance, and visual regression before legacy migration.

The detailed historical strategy remains in git history and `docs/template-system-strategy.md`.
