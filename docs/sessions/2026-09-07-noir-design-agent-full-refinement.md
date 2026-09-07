# Session — 2026-09-07 — Noir Design Agent Full Refinement

## Current position
`W17-Q` remains `IN_PROGRESS`. The current atomic task is the Noir public-menu visual/layout/image/theme refinement on branch `feat/noir-full-refinement`, PR #24.

## Objective
Complete one Noir refinement milestone without reopening other themes or changing product/data/security/deployment architecture.

## Evidence
- User-supplied mobile screenshots: 695×1536.
- Repository source at `main` before the branch: `b346a494afd19992236baea4b3f8b26ca6a30d3e`.
- Required design-agent, design-intelligence, checklist, project-memory, route/theme, public-menu, and CSS sources inspected before implementation.

## Findings
- VERIFIED: `FineDiningHospitalityTemplate` rendered a custom Noir hero/featured surface and then mounted `PublicMenuView`, which rendered another public-menu header/featured surface.
- VERIFIED: Noir styling was distributed across `theme-noir.css`, `theme-refinements.css`, and `theme-refinements-v2.css` with competing card geometry and decorative motion/transform rules.
- VERIFIED: supplied evidence showed image/card imbalance and visual noise consistent with the source-level geometry conflict.
- UNKNOWN: screenshot 2's muted/covered lower state is not causally reproduced and is not treated as a confirmed application defect.

## Implementation
- Updated `src/components/templates/fine-dining-hospitality.tsx` to keep the Noir identity while making `PublicMenuView` the single interaction owner and removing duplicate template-level visit tracking.
- Added `src/theme-noir-hardening.css` as the final Noir-scoped presentation layer.
- Loaded the hardening stylesheet after the existing Noir refinement layers in `src/routes/__root.tsx`.
- Added `tests/noir-browser-hardening.test.mjs` and registered it in the default `npm test` suite.
- Added `docs/template-audits/noir-full-refinement.md`.
- Updated `PROJECT_STATE.md`, `PLAN.md`, and `TASKS.md` with the current Noir milestone and exact next task.

## Verification
- VERIFIED: PR #24 is open as a draft from `feat/noir-full-refinement` to `main`.
- VERIFIED: changed-file list is limited to the six scoped files: audit, package test registration, Noir template, root stylesheet loading, Noir hardening stylesheet, and Noir regression test.
- VERIFIED: no Vercel deployment was intentionally triggered.
- UNKNOWN: typecheck, default test suite, lint, production build, performance audit, and Playwright/browser QA have not yet produced visible workflow evidence for PR #24 in this connector session.
- UNKNOWN: physical-device rendering and screenshot 2's muted/covered layer remain pending.

## Rollback
Revert the Noir-scoped PR #24 changes only. No database/data migration rollback is required.

## Exact next task
Run/inspect the complete W17-Q repository quality and browser evidence for PR #24. Resolve only evidence-backed Noir defects, then stop without starting another template.
