# TASKS

## Current State — 2026-09-18
- VERIFIED: `main` = `c3afb623559ea1d6e015a5abeb6a59ebc26a4f27`.
- VERIFIED: PH-01–PH-06 and protected product systems remain completed.
- VERIFIED: current repository audit found substantial existing implementation; the new plan is gap-only.
- UNKNOWN: physical real-device Production QA for latest `main`.
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

Verify against current code:
- all public event emitters and event consumers;
- search/category/product/cart actions;
- anonymous session lifecycle;
- order/session linkage;
- order outcome linkage;
- metric and experiment consumers;
- duplicate-event and failure semantics;
- privacy/tenant/branch boundaries.

Output:
- gap matrix;
- exact missing contracts;
- minimal implementation sequence;
- no runtime implementation unless separately authorized.

### A.2 — Minimal Journey Instrumentation
DEPENDENCY: A.1
Only implement events/linkage proven missing by A.1.
No wholesale analytics rewrite.

### A.3 — Outcome-Linked Intelligence
DEPENDENCY: A.2
Extend existing Growth/Owner Intelligence so recommendations/actions can be evaluated against observed outcomes.

### A.4 — International Boundary Audit
DEPENDENCY: A.1
Audit market-dependent currency, phone, locale, timezone, tax, payments, messaging, maps and compliance boundaries.
No broad international feature build until boundaries are verified.

### A.5 — Public Shareability / Deep-Link Audit
DEPENDENCY: A.1
Verify existing public URLs, QR destinations, SEO, canonical/hreflang and product/category sharing before adding routes.

## Release Evidence — Separate
- R6 meaningful real exposure remains pending.
- Physical Android/iOS Production QA remains pending.
- Production configuration evidence remains pending.
- No synthetic experiment traffic.
- No Vercel iteration loop.

## Exact Next Task
**A.1 — Customer Journey & Event Truth Audit**

Boundary: audit only. No UI redesign, schema migration, deployment, or unrelated refactor.
