# Menu V3 — Active Plan

## Status
- Status: IN_PROGRESS.
- Repository: `Midosd249/Menu_V3`.
- Canonical branch: `main`.
- Source of truth: `main`.

## Current Verified Main — 2026-09-18
- VERIFIED: `main` = `909935165d10fd7e8fccce6182fd88717ad478e6`.
- VERIFIED: PR #179 merged at `18ca4f243b39640ebd7ed77541b268240b54cefd`.
- VERIFIED: PR #180 merged at `e8677a9d20c19ab03eff84d39358a66918b932b2`.
- VERIFIED: current repository contains the completed PH-01–PH-06 work and the protected product systems listed in `PROJECT_STATE.md`.
- UNKNOWN: physical real-device Production QA for latest `main`.
- UNKNOWN: current Production environment-variable values.

## Protected / Completed — Do Not Rebuild
- Public bilingual menu, five themes, search/category/product/cart/order flows, Quick Add, Item Notes, configured actions.
- Public order hardening, idempotency, rate limits, server-side price/options validation, order status/notifications.
- Menu Intelligence, Owner Intelligence, Growth Engine, Reports, evidence-based upsell.
- Guest profiles, loyalty, campaigns, feedback and retention.
- AI provider routing, multimodal ingestion, menu AI assistance and grounded Guest Assistant.
- Self-serve registration/provisioning/recovery, subscriptions/entitlements, Platform Admin, teams/branches/import/billing.
- SEO/local discovery, accessibility/performance contracts, CI and release-only Vercel workflow.

## Gap-Only Product Plan

### A.1 — Customer Journey & Event Truth Audit
Status: READY_FOR_AUTHORIZATION
Goal: establish the exact current customer funnel from real code and data contracts before changing analytics.

Audit:
- every public analytics emitter across all theme/template paths;
- event schema and database constraints;
- anonymous session lifecycle and privacy boundary;
- search/category/product/cart/order actions;
- order creation and order-status outcomes;
- growth/intelligence metric consumers;
- experiment exposure/variant/conversion/guardrail consumers;
- duplicate-event behavior and failure behavior.

Deliverable:
- one gap matrix: implemented / duplicated / missing / unsafe / unknown;
- one minimal event contract proposal;
- no UI redesign;
- no schema migration unless separately authorized after the audit.

Acceptance:
- every current event has an identified emitter and consumer;
- every proposed new event has a concrete product action and owner decision;
- no duplicate taxonomy is introduced.

### A.2 — Minimal Journey Instrumentation
Only after A.1.
Scope is limited to the smallest missing events and privacy-preserving order/session linkage proven necessary by A.1.
Acceptance requires regression tests and preservation of existing R6 behavior.

### A.3 — Outcome-Linked Owner Intelligence
Only after A.2.
Connect existing owner actions/recommendations to measurable before/after outcomes.
Do not create another dashboard unless a real workflow gap is proven.

### A.4 — International Boundary Audit
Audit and isolate market-dependent concerns:
- currency;
- pricing display;
- phone normalization/validation;
- locale and direction;
- timezone/business hours;
- tax presentation;
- payment providers;
- messaging/WhatsApp-equivalent channels;
- map/location providers;
- compliance adapters.

Acceptance:
Saudi-specific defaults remain valid for Saudi tenants while generic domain logic no longer assumes Saudi when a new market adapter is introduced.
No broad international payment/compliance implementation in this audit.

### A.5 — Public Shareability / Deep-Link Audit
Verify current public URLs, query state, canonical/hreflang, structured data, product/category shareability, QR destinations and search indexing.
Only add routes if the audit proves the existing model cannot satisfy the requirement.

### Release Evidence Track
Separate from feature development:
- gather meaningful real R6 exposure and evaluate using the existing experiment contract;
- complete physical Android/iOS Production QA;
- verify current Production configuration when authorized/available.
Do not use synthetic traffic or Vercel as a development loop.

## Engineering Rules for the New Plan
1. Repository-first: inspect current code before proposing implementation.
2. One atomic task at a time.
3. No feature addition when an existing capability already satisfies the need.
4. No parallel analytics, customer, cart, order, theme or AI architecture.
5. Server remains source of truth for identity, tenant, branch, entitlements, availability and prices.
6. Internationalization is an adapter/configuration concern, not a rewrite.
7. Public visual work must use the Design Agent workflow and real-data/RTL/mobile checks.
8. Every implementation change requires focused regression tests plus relevant full quality gates.
9. Follow LOCAL DEVELOPMENT → LOCAL QA → LOCAL BROWSER/VISUAL QA → TESTS → CI → DIFF REVIEW → ONE RELEASE BATCH → MAIN → ONE PRODUCTION DEPLOYMENT → REAL-DEVICE QA.
10. Never claim deployment without direct evidence.

## Exact Next Task
**A.1 — Customer Journey & Event Truth Audit**
Scope boundary: audit only; no UI redesign, schema migration, deployment.
