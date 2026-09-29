# 2026-09-30 — Menu ordering and Mazaq badge audit

## Scope
Parts A+B of the 2026-09-30 task; Part C is intentionally plan-only.

## Evidence
- Current main inspected at 4f53e397fac357b7dcada23d6a3e069d8fc64aa7.
- PR #327 inspected at head 31f7fa4e84a5ab3053d3a8210bed26b12f632d09.
- Relevant theme, menu owner, public menu, Studio workspace, tests, and migration paths inspected.
- GitHub Quality #2596 passed; W9 Orders QA #754 passed.

## Findings
- VERIFIED: category/product sort_order already existed as tenant-wide creation/order metadata, but there was no branch-specific Studio control.
- VERIFIED: new ordering persistence is keyed by branch_id + resource id and validates branch/resource tenant alignment at the database trigger layer plus server authorization.
- VERIFIED: public menu reads branch overrides and falls back to existing sort_order when an override is absent.
- VERIFIED: the Taste/Mazaq template contains no hard-coded Chef's Choice label; badge rendering is derived from product dietary labels only, with empty labels filtered.
- VERIFIED: no other theme template was modified by Part A.
- UNKNOWN: physical-device UX of the new ordering controls.
- BLOCKED: Production deployment is intentionally held for owner review.

## Part C boundary
Offers/Promotions remains a written proposal only; no code or schema for offers was added.

## Exact next action
Owner review of PR #327.