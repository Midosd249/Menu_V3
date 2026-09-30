# 2026-09-30 — Mazaq badge + manual menu ordering + Offers plan

## Classification / workflows
- Principal Engineer / Orchestrator
- Research & Connected-Tools Agent
- UI/UX & Design Agent
- Frontend Implementation Agent
- Backend & Data Agent
- Auth & Security Agent
- QA & Verification Agent
- Code Audit & Hygiene Guardian
- Documentation & Continuity Agent
- Release & Deployment Guardian (release held)

## Current verified position
- main: 4f53e397fac357b7dcada23d6a3e069d8fc64aa7.
- PR #327 head: 31f7fa4e84a5ab3053d3a8210bed26b12f632d09.
- Existing ordering fields: categories/products already had tenant-wide sort_order; no Studio UI existed to change it, and there was no branch-specific ordering override.
- Mazaq/Taste source did not contain a hard-coded Chef's Choice / اختيار الشيف string; product badges were sourced from product dietary labels. The change hardens that path by filtering labels from the actual product object and adds a regression contract against a hard-coded phantom label.

## Work completed
- Part A: Taste/Mazaq badge rendering hardened; no other theme template changed.
- Part B: branch-scoped order override tables, server authorization, ordering reads/writes, Studio branch selector and accessible up/down controls, and public-menu branch-order rendering.
- Regression tests added for movement/indexing, persistence/isolation contracts, public ordering, Studio controls, and the Taste badge contract.

## Verification
- VERIFIED: GitHub Quality #2596 passed typecheck, tests, lint, production build, browser QA, and diagnostics.
- VERIFIED: W9 Orders QA #754 passed.
- VERIFIED: PR preview Vercel status success.
- UNKNOWN: physical-device interaction with the new ordering controls.

## Part C plan-only boundary
See the proposal at the top of PLAN.md in this commit. No Offers/Promotions code was implemented.

## Exact next action
Owner reviews PR #327; do not merge or deploy automatically.