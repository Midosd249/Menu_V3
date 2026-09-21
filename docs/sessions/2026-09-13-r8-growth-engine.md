# R8 — Closed-Loop Menu Growth Engine

Date: 2026-09-13

## Classification

- R8.1 Action Loop
- R8.2 Evidence-based Recommendations
- R8.3 Experiment Expansion

## Verified starting position

- `main` at start: `f4111f86738a098122a7e536ae35a0ea97ed03fd`.
- R2 Menu Intelligence, R4 Owner Intelligence, R5 Growth, and R6 WhatsApp experimentation already existed.
- R6 `whatsapp-cta-v1` remains active and must not be closed until its real exposure threshold is reached.
- Existing analytics and menu data remain the source of truth.

## Implementation

Added `src/lib/menu/growth-engine.ts` as a deterministic orchestration layer over the existing menu snapshot and owner analytics.

### R8.1 Action Loop

The engine models the existing product loop as Observe → Act → Measure. It does not mutate menu data automatically. It directs the owner to the existing safe Studio destinations and keeps action execution under owner control.

### R8.2 Evidence-based Recommendations

Recommendations are derived from verified snapshot/analytics fields only. Thin traffic is explicitly treated as insufficient evidence. Recommendations are limited to supported destinations and do not invent conversion, revenue, customer satisfaction, or causal claims.

### R8.3 Experiment Expansion

Added a design-ready catalogue for:

- `whatsapp-cta-v1` (active; existing experiment)
- `featured-item-order` (design-ready only)
- `category-entry` (design-ready only)

New experiments are not activated automatically. Each requires a stable baseline, one isolated change, an exposure definition, a primary metric, a guardrail, and owner-approved activation.

Added `/studio/growth` as the unified owner-facing surface for the loop, evidence-based recommendations, and experiment lab.

## Safety boundaries

- No database schema changes.
- No synthetic traffic.
- No automatic menu mutation.
- No automatic experiment activation.
- No changes to authentication, authorization, tenant isolation, branch isolation, subscriptions, pricing, or ordering.
- R7 remains non-blocking and continues to wait for real exposure.

## Verification plan

The new pure engine has focused unit coverage in `src/lib/menu/growth-engine.test.ts`. Full repository CI remains the release gate. Browser/device production verification is still a separate deployment-stage concern and must not be inferred from source inspection.

## Status

`IMPLEMENTATION_IN_PROGRESS` until repository quality gates review the branch.

Next exact task: run CI quality gates on the R8 branch, review the diff, then merge only if all applicable checks pass. Vercel deployment remains a separate release decision.
