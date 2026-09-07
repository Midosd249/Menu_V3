# Session — 2026-09-07 — Heritage Final Actions

## Request classification
- Public-menu visual/theme refinement.
- Internal workflows: Design Agent, QA/regression, repository governance, release/reliability review.
- Research level: Focused, repository-first.

## Current position
- **VERIFIED:** baseline was `main` commit `ce9ae28748dfed4675db2748a10fa03cc85e321d`.
- **VERIFIED:** Heritage uses the shared `contemporary-restaurant` renderer.
- **VERIFIED:** the shared renderer contains decorative numbering and an action/language rail that can be visually refined without changing business logic.

## Work completed
- Removed Heritage presentation of all decorative numbering for featured dishes, category headings, product rows, information headings, and hero volume metadata.
- Refined Heritage hero height and attached the existing action/language controls to the hero as a single premium floating rail.
- Preserved existing data-driven customer actions: WhatsApp, location, phone, and Instagram only when valid configured destinations exist.
- Preserved cart/order, analytics, tenant/branch, and localization logic.
- Expanded Heritage regression coverage for the new visual contract.

## Verification
- **VERIFIED:** branch `fix/heritage-final-actions-v2` is based directly on the current main baseline and contains only focused Heritage CSS/test changes plus documentation.
- **VERIFIED:** GitHub compare shows the implementation scope before documentation as two files: `src/theme-heritage-hardening.css` and `tests/heritage-browser-hardening.test.mjs`.
- **UNKNOWN:** local test execution is unavailable because the repository is not mounted in the local execution environment.
- **UNKNOWN:** browser/device visual QA is unavailable in the current connector environment.
- **UNKNOWN:** production deployment/commit match must not be inferred from this implementation branch.

## Exact next task
Create and review the focused pull request; then use available CI/status evidence before any merge decision. Physical/browser inspection remains required before declaring visual success.
