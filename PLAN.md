# Menu V3 — Active Plan

## Status
- Status: IN_PROGRESS.
- Repository: `Midosd249/Menu_V3`.
- Canonical branch: `main`.
- Source of truth: `main`.

## Current Verified Main
- VERIFIED: `main` = `c3afb623559ea1d6e015a5abeb6a59ebc26a4f27` on 2026-09-18.
- VERIFIED: PR #179 merged at `18ca4f243b39640ebd7ed77541b268240b54cefd`.
- VERIFIED: PR #180 merged at `e8677a9d20c19ab03eff84d39358a66918b932b2`.
- UNKNOWN: physical real-device Production QA.
- UNKNOWN: current Production environment-variable values.
- UNKNOWN: representative real-production funnel values.

## Strategic Master Blueprint
Document: `docs/customer-product-master-blueprint.md`

### Product direction
Menu V3 should become a restaurant-owned:
- guest experience engine;
- direct-commerce layer;
- guest relationship layer;
- decision-intelligence layer;
- international-ready platform core.

### Core loop
```text
DISCOVERY / QR
→ FAST UNDERSTANDING
→ EXPLORATION
→ CONFIDENT DECISION
→ ACTION
→ OUTCOME
→ FEEDBACK
→ RETURN
→ OWNER INSIGHT
→ OWNER ACTION
→ MEASURED RESULT
→ BETTER GUEST EXPERIENCE
```

### International strategy
Saudi Arabia remains an important market, but is not the architecture boundary.

Generic core:
- tenant;
- branch;
- menu/catalog;
- availability;
- cart/order;
- guest;
- analytics;
- growth;
- AI;
- SEO;
- entitlements.

Market configuration:
- country;
- locale/languages;
- currency;
- timezone;
- tax presentation;
- phone/address rules;
- payment providers;
- messaging providers;
- maps/discovery;
- compliance adapters.

Do not hard-code Saudi assumptions into generic domain logic.

## Comprehensive Execution Roadmap

### Phase A — Measurement Truth / P0
- Inventory actual event emitters and schemas.
- Map event → source → consumer → metric.
- Identify funnel gaps.
- Define session/deduplication/privacy rules.
- Establish authoritative metric definitions.
- Map experimentation measurement requirements.

Exit:
- one authoritative definition per strategic metric;
- no synthetic evidence;
- tenant/branch/session boundaries explicit;
- unknowns documented.

### Phase B — Guest Friction / P0
- Audit public first screen.
- Search/category discovery.
- Product detail and availability.
- Cart/action path.
- Loading/empty/error/offline states.
- Mobile/RTL/LTR/accessibility/performance.

Exit:
- realistic critical path verified;
- no critical clipping/overlap/action ambiguity;
- accessibility baseline verified;
- performance budget respected.

### Phase C — Commerce Intelligence / P0-P1
- Link menu intent to authoritative order facts.
- Define intent → cart → order funnel.
- Add evidence-backed branch/item diagnostics.
- Convert measurements into owner actions.
- Preserve server-side trust boundaries.

Exit:
- insights trace to observable evidence;
- no unsupported causal claims.

### Phase D — Guest Relationship Loop / P1
- Refine favorites/reorder where justified.
- Connect loyalty to behavior.
- Feedback/recovery loop.
- Consent/preferences.
- Retention reporting.

Exit:
- tenant isolation and consent verified;
- no autonomous outbound actions;
- retention outcomes measurable.

### Phase E — Growth Optimization / P1
- Evidence-based upsells.
- SEO/shareability.
- QR acquisition attribution.
- Controlled experiments.
- Growth action center.

Exit:
- denominator/conversion/guardrail/stop rule for experiments;
- evidence-backed recommendations;
- no dark patterns.

### Phase F — Internationalization Core / P1
- Locale/currency/timezone audit.
- Phone/address rules.
- Market configuration.
- Provider adapters.
- Compliance extension points.
- Non-Saudi test configuration.

Exit:
- Saudi configuration remains correct;
- at least one non-Saudi configuration passes locally;
- no generic core logic depends on Saudi assumptions.

### Phase G — Platform Scale / P2
- Entitlement/capability refinement.
- Provider abstraction.
- Observability.
- Tenant limits.
- Import/export portability.
- Recovery/backup checks.
- Operational health.
- Documentation.

## Priority
1. Customer funnel truth — P0.
2. Guest friction — P0.
3. Intent → order linkage — P0.
4. Owner action center — P1.
5. Guest relationship loop — P1.
6. SEO/shareability — P1.
7. Controlled experimentation — P1.
8. International core — P1.
9. Advanced AI — P2.
10. New theme — P3 / avoid.
11. Full POS/accounting — out of scope.

## Protected Strategic Boundaries
Do not:
- restart or rewrite completed work;
- create a sixth theme merely for novelty;
- turn Menu V3 into a POS/accounting/delivery-fleet system;
- turn it into a generic chatbot;
- hard-code Saudi-only assumptions;
- use Vercel as the development iteration loop.

## Current Exact Next Task
PROPOSED / awaiting explicit implementation authorization:
**Phase A.1 — Customer Journey & Event Truth Audit.**

Scope: current event emitters, schemas, metrics, order linkage, session identity, privacy boundaries, and tests. Produce a gap matrix and smallest safe implementation sequence. Do not redesign UI, change schema, or deploy in this task.
