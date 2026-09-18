# TASKS

## Current State — 2026-09-18
- VERIFIED: `main` = `c3afb623559ea1d6e015a5abeb6a59ebc26a4f27`.
- VERIFIED: strategic blueprint is recorded in `docs/customer-product-master-blueprint.md`.
- UNKNOWN: physical real-device Production QA.
- UNKNOWN: representative real-production funnel values.

## Completed Protected Scope
PH-01 through PH-06 — CLOSED / VERIFIED historically.

Protected product capabilities include:
- Essential, Editorial, Noir, Heritage/Taste, Gallery.
- Public menu and customer actions.
- Cart, Quick Add, Item Notes, Orders, Notifications.
- Menu/Owner Intelligence and Growth.
- Guest CRM, loyalty, campaigns, feedback, retention.
- AI provider routing, multimodal import, grounded assistant.
- Platform Admin and self-serve lifecycle.
- Subscription/entitlement/security/RLS/tenant/branch isolation.
- SEO/local discovery foundations.
- Release-only Vercel workflow.
- Do not repeat completed work without reproducible regression evidence.

## Strategic Task Program

### A — Measurement Truth / P0
1. **A.1 Customer Journey & Event Truth Audit** — PROPOSED / next atomic task.
   - Inspect actual event emitters, schemas, metrics, order linkage, session identity, privacy boundaries, and tests.
   - Produce current-state event map and funnel gap matrix.
   - Identify smallest safe implementation sequence.
   - No UI redesign.
   - No schema change unless separately authorized after the audit.
   - No Vercel deployment.

2. A.2 Event reliability/measurement implementation — future, only after A.1 evidence.

### B — Guest Friction / P0
- Public customer journey audit.
- First-screen/search/category/product/cart/action review.
- Mobile/RTL/LTR/accessibility/performance verification.
- Implement only evidence-backed gaps.

### C — Commerce Intelligence / P0-P1
- Intent → cart → order linkage.
- Branch/item diagnostics.
- Evidence-backed owner actions.

### D — Guest Relationship Loop / P1
- Favorites/reorder refinement.
- Loyalty/feedback/retention connection.
- Consent/preferences.
- No autonomous outbound actions.

### E — Growth Optimization / P1
- Approved upsells.
- SEO/shareability.
- QR acquisition attribution.
- Controlled experimentation.
- Growth action center.

### F — Internationalization Core / P1
- Locale/currency/timezone.
- Phone/address rules.
- Market configuration.
- Provider adapters.
- Non-Saudi test configuration.
- Country-specific compliance extension points.

### G — Platform Scale / P2
- Entitlements/capabilities.
- Observability.
- Tenant limits.
- Import/export.
- Recovery/backup.
- Operational health.

## Non-Goals
- Full POS replacement.
- Accounting suite.
- Delivery fleet.
- Generic CRM.
- Generic chatbot platform.
- Autonomous restaurant operator.
- Saudi-only architecture.
- Feature-count competition.

## Release Guardrails
Follow:
LOCAL DEVELOPMENT → LOCAL QA → LOCAL BROWSER / VISUAL QA → TESTS → CI QUALITY GATES → DIFF REVIEW → ONE RELEASE BATCH → MAIN → ONE PRODUCTION DEPLOYMENT → REAL-DEVICE QA.

Do not intentionally trigger Vercel deployment for ordinary research or local iteration.

## Exact Next Task
**A.1 Customer Journey & Event Truth Audit** — PROPOSED / awaiting explicit implementation authorization.
