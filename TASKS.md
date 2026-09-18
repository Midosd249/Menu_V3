# TASKS

## Current State — 2026-09-18

- VERIFIED: main = c3afb623559ea1d6e015a5abeb6a59ebc26a4f27.
- VERIFIED: PH-01–PH-06 and protected product systems remain completed.
- VERIFIED: current repository audit found substantial existing implementation; the plan is gap-only.
- VERIFIED: the detailed execution and recovery contract is in docs/master-execution-plan.md.
- UNKNOWN: physical real-device Production QA for latest main.
- UNKNOWN: current Production environment-variable values.

## Completed / Protected

Do not repeat these without reproducible regression evidence:

- Public menu + five themes + bilingual/RTL/LTR behavior.
- Search/category/product/cart/Quick Add/Item Notes/order flows.
- Public order hardening and Studio Orders.
- Menu/Owner Intelligence and Growth Engine.
- Upsell evidence/approval, reports, experiments.
- Guest CRM/loyalty/campaigns/feedback/retention.
- AI provider routing/multimodal ingestion/grounded assistant.
- Self-serve customer lifecycle, subscriptions/entitlements, Platform Admin.
- Branch/team/import/billing/QR/SEO/accessibility/performance/release workflow.

## Current Gap Program

### A.1 — Customer Journey & Event Truth Audit
STATUS: READY_FOR_AUTHORIZATION
DEPENDENCY: none
BOUNDARY: audit only.

Checklist:
1. Verify current main SHA.
2. Read AGENTS.md, master execution plan, PROJECT_STATE.md, PLAN.md, TASKS.md, SESSION_PROTOCOL.md and relevant memory/docs.
3. Inventory public routes/templates/themes.
4. Inventory analytics emitters and event payloads.
5. Trace event persistence and database constraints.
6. Trace anonymous session lifecycle.
7. Trace visit/QR/search/category/product/cart/order actions.
8. Trace order creation, validation, status and outcomes.
9. Trace Growth, Owner Intelligence, Reports and R6 consumers.
10. Check duplicates, failures, privacy, tenant/branch boundaries.
11. Classify each journey step and each event as implemented/duplicated/missing/unsafe/unknown.
12. Define minimal canonical event vocabulary only where evidence requires it.
13. Define smallest A.2 boundary.
14. Stop.

Acceptance:
- every current event has an identified emitter;
- every event has a consumer or explicit no-consumer finding;
- every journey step is classified;
- session/order linkage is classified;
- R6 semantics are preserved;
- duplicate/failure/privacy behavior is classified;
- no runtime code changes.

### A.2 — Minimal Journey Instrumentation
DEPENDENCY: A.1 complete.
Only implement missing events/linkage proven by A.1. No wholesale analytics rewrite.

### A.3 — Outcome-Linked Intelligence
DEPENDENCY: A.2 complete.
Extend existing Growth/Owner Intelligence so recommendations/actions can be evaluated against observed outcomes. No new dashboard unless a real workflow gap is proven.

### A.4 — International Boundary Audit
DEPENDENCY: A.1.
Audit currency, pricing, phone, locale/direction, timezone/business hours, tax, payments, messaging, maps and compliance boundaries. No broad international implementation during the audit.

### A.5 — Public Shareability / Deep-Link Audit
DEPENDENCY: A.1.
Verify routes, query state, QR destinations, canonical/hreflang, structured data and product/category sharing before adding routes.

## Release Evidence — Separate

- R6 meaningful real exposure remains pending.
- Physical Android/iOS Production QA remains pending.
- Production configuration evidence remains pending.
- No synthetic experiment traffic.
- No Vercel iteration loop.

## Exact Next Task

A.1 — Customer Journey & Event Truth Audit.

Boundary: audit only. No UI redesign, schema migration, runtime implementation, deployment, or unrelated refactor.
