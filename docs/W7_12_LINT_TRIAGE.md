# W7.12 — Lint Warning Triage

Date: 2026-09-15
Status: VERIFIED — 29 warnings, 0 errors, 0 warnings classified as merge blockers.
Evidence: W7.11 final GitHub Actions run `34940468908` / run #1668, quality job `104287770287`.

## Summary

The final lint step executed `npm run lint` (`eslint .`) and reported **29 warnings and 0 errors**. The warnings are existing code-quality debt across public, Studio, Admin, onboarding, invitation, and shared-library files. No W7.12 code change is required to clear them.

The warnings were not treated as release blockers because the final W7.11 browser/quality run passed, the affected areas have dedicated runtime/browser coverage, and the warnings do not establish a demonstrated security, authorization, data-integrity, production-runtime, or accessibility failure.

## Warning Inventory

| # | File | Rule | Count | W7 relation | Risk | Recommendation | Evidence / rationale |
|---|---|---|---:|---|---|---|---|
| 1 | `src/components/guest-menu-assistant.tsx` | `react-hooks/exhaustive-deps` | 1 | Existing | Low runtime; no demonstrated regression | ACCEPT_AS_EXISTING_TECH_DEBT | Ref cleanup warning; W7.11 public/Studio browser QA passed and no console-error failure was observed. |
| 2 | `src/lib/lang.tsx` | `react-refresh/only-export-components` | 1 | Existing | Low developer-experience risk | ACCEPT_AS_EXISTING_TECH_DEBT | Module exports a non-component alongside component code; not a runtime failure. |
| 3 | `src/lib/menu/commercial.ts` | `@typescript-eslint/no-unused-vars` | 3 | Existing | Low | ACCEPT_AS_EXISTING_TECH_DEBT | Unused commercial constants/types; no W7 runtime path depends on their removal. |
| 4 | `src/lib/menu/growth-advisor.ts` | `@typescript-eslint/no-unused-vars` | 1 | Existing | Low | ACCEPT_AS_EXISTING_TECH_DEBT | Unused imported `Product`; no browser/runtime failure evidenced. |
| 5 | `src/lib/menu/problem-detection.ts` | `@typescript-eslint/no-unused-vars` | 1 | Existing | Low | ACCEPT_AS_EXISTING_TECH_DEBT | Unused `branches` local; tests and Growth browser QA passed. |
| 6 | `src/lib/menu/studio.tsx` | `react-refresh/only-export-components` | 2 | Existing | Low developer-experience risk | ACCEPT_AS_EXISTING_TECH_DEBT | Non-component exports in a component module; no runtime defect evidenced. |
| 7 | `src/routes/admin.tsx` | `react-refresh/only-export-components` | 2 | Pre-existing pattern retained through W7.9 | Low developer-experience risk | ACCEPT_AS_EXISTING_TECH_DEBT | W7.9 exports route mapping/types from the route module; browser and route contract tests passed. |
| 8 | `src/routes/admin.tsx` | `react-hooks/exhaustive-deps` | 4 | Pre-existing | Medium theoretical stale-effect risk, but no demonstrated defect | NEEDS_HUMAN_DECISION | The exact dependency arrays were present in the pre-W7 monolithic implementation; W7.9 did not introduce the hook bodies. Human review should decide whether future cleanup is safe because effects call data-loading functions. |
| 9 | `src/routes/admin/onboarding.tsx` | `@typescript-eslint/no-unused-vars` | 1 | Existing | Low | ACCEPT_AS_EXISTING_TECH_DEBT | Unused `AdminLead` type; onboarding browser/contract coverage passed. |
| 10 | `src/routes/admin/onboarding.tsx` | `react-hooks/exhaustive-deps` | 3 | Existing | Medium theoretical stale-effect risk, no demonstrated regression | NEEDS_HUMAN_DECISION | Effects were retained from the existing implementation; changing dependencies can alter fetch timing/behavior and is outside W7.12 scope. |
| 11 | `src/routes/invite.$token.tsx` | `@typescript-eslint/no-unused-vars` | 2 | Existing | Low | ACCEPT_AS_EXISTING_TECH_DEBT | Unused imports; no W7 route/security regression evidenced. |
| 12 | `src/routes/m.$slug.tsx` | `react-refresh/only-export-components` | 1 | Existing | Low developer-experience risk | ACCEPT_AS_EXISTING_TECH_DEBT | Existing mixed export module; public all-theme browser QA passed. |
| 13 | `src/routes/m.$slug.tsx` | unused `eslint-disable` directive | 1 | Existing | Low | FIX_POST_MERGE | Safe cleanup candidate, but it is not release-blocking and should be removed only with a focused change. |
| 14 | `src/routes/m.$slug.tsx` | `react-hooks/exhaustive-deps` | 1 | Existing | Medium theoretical stale-effect risk, no demonstrated regression | NEEDS_HUMAN_DECISION | Existing menu-loading effect; public route QA passed all required responsive/theme checks. |
| 15 | `src/routes/onboarding/$token.tsx` | `react-hooks/exhaustive-deps` | 1 | Existing | Medium theoretical lifecycle risk, no demonstrated regression | NEEDS_HUMAN_DECISION | Existing activation effect; changing dependencies may affect onboarding flow and is outside release-readiness scope. |
| 16 | `src/routes/studio/options.tsx` | `react-hooks/exhaustive-deps` | 1 | Existing | Medium theoretical refresh risk, no demonstrated regression | NEEDS_HUMAN_DECISION | Existing refresh effect; options route is not part of W7 presentation changes. |
| 17 | `src/routes/studio/orders.tsx` | `react-hooks/exhaustive-deps` | 1 | Existing | Medium theoretical refresh risk, no demonstrated regression | NEEDS_HUMAN_DECISION | Existing orders loading effect; orders business logic is protected from W7.12 changes. |
| 18 | `src/routes/studio/reports.tsx` | `react-hooks/exhaustive-deps` | 1 | Existing | Medium theoretical refresh risk, no demonstrated regression | NEEDS_HUMAN_DECISION | Existing reports loading effect; no W7.12 runtime change. |
| 19 | `src/routes/studio/reports.tsx` | `@typescript-eslint/no-unused-vars` | 1 | Existing | Low | ACCEPT_AS_EXISTING_TECH_DEBT | Unused `text` parameter; no runtime impact evidenced. |

## Rule Totals

- `react-hooks/exhaustive-deps`: **13**
- `react-refresh/only-export-components`: **6**
- `@typescript-eslint/no-unused-vars`: **9**
- unused `eslint-disable` directive: **1**
- **Total: 29 warnings / 0 errors**

## Release Decision

- **Warnings that block merge:** **0**.
- **Warnings requiring human discussion before merge:** 10 dependency-array warnings grouped across existing Admin/onboarding/menu/Studio effects. These are review considerations, not demonstrated release blockers.
- **Warnings safe to accept as existing technical debt:** 18.
- **Safe post-merge cleanup candidate:** 1 unused eslint-disable directive.
- No global lint rule was disabled.
- No lint ignore was added.
- No warning was suppressed.
- No arbitrary mass refactor was performed.

## Important Distinctions

The Node/runner deprecation messages and npm deprecation notice in CI are **not counted** in the 29 ESLint warnings. They are environment/tooling notices, not lint findings.

The CI-only PostgreSQL/PGlite fixture is also not a production schema change. It is created and removed inside the GitHub Actions runner for browser verification.

## Human Review Recommendation

Review the 10 hook-dependency warnings as technical debt during PR review, with special attention to Admin and onboarding effect lifecycles. Do not fix them as part of W7.12 without an isolated proof of safe behavior. The current evidence supports human review rather than a merge-blocking lint failure.
