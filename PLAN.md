# Menu V3 — Active Plan

## Canonical Execution Contract

The detailed, durable execution methodology is maintained in:

- docs/master-execution-plan.md

That document is the primary continuity/runbook for future sessions. This file is the concise active-plan index. If this file and the master plan appear inconsistent, verify against current main/code/Git first, then reconcile documentation before implementation.

## Status

- Status: IN_PROGRESS.
- Repository: Midosd249/Menu_V3.
- Canonical branch: main.
- Source of truth: main.

## Current Verified Main — 2026-09-18

- VERIFIED: main = c3afb623559ea1d6e015a5abeb6a59ebc26a4f27.
- VERIFIED: PR #179 merged at 18ca4f243b39640ebd7ed77541b268240b54cefd.
- VERIFIED: PR #180 merged at e8677a9d20c19ab03eff84d39358a66918b932b2.
- VERIFIED: current repository contains completed PH-01–PH-06 work and the protected product systems listed in PROJECT_STATE.md.
- UNKNOWN: physical real-device Production QA for latest main.
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

The dependency chain is:

A.1 Journey & Event Truth Audit
→ A.2 Minimal Journey Instrumentation
→ A.3 Outcome-Linked Owner Intelligence

A.4 International Boundary Audit and A.5 Public Shareability/Deep-Link Audit are separate audit tracks dependent on the relevant evidence.

Release evidence is separate from feature implementation.

### A.1 — Customer Journey & Event Truth Audit

STATUS: READY_FOR_AUTHORIZATION

Boundary: audit only. No runtime implementation, schema migration, UI redesign, deployment, or unrelated refactor.

The exact 32-step procedure and acceptance criteria are in docs/master-execution-plan.md.

Required outputs:
- complete event/emitter/consumer inventory;
- journey-step matrix;
- session/order linkage finding;
- duplicate/failure/privacy finding;
- minimal canonical event proposal only where evidence requires it;
- exact A.2 implementation boundary.

### A.2 — Minimal Journey Instrumentation

DEPENDENCY: A.1 complete.

Only implement missing events/linkage proven by A.1. Preserve R6 and existing analytics infrastructure. No wholesale analytics rewrite.

### A.3 — Outcome-Linked Owner Intelligence

DEPENDENCY: A.2 complete.

Connect existing owner actions/recommendations to measurable outcomes without creating another dashboard unless a real workflow gap is proven.

### A.4 — International Boundary Audit

DEPENDENCY: A.1; implementation only after explicit authorization.

Audit currency, pricing, phone, locale/direction, timezone/business hours, tax, payments, messaging, maps, compliance adapters, and market-specific defaults.

No broad international implementation during the audit.

### A.5 — Public Shareability / Deep-Link Audit

DEPENDENCY: A.1.

Verify current public routes, query state, canonical/hreflang, structured data, QR destinations, product/category sharing and indexing before adding routes.

## Permanent Execution Rules

- Repository-first; current code/Git/tests outrank chat memory.
- Prove absence before adding capability.
- Extend existing contracts; do not create parallel architectures.
- One atomic task per session.
- Preserve auth, authorization, RLS, tenant/branch isolation, entitlements, pricing, validation and privacy.
- Use relevant specialist workflows automatically.
- Use proportional repository-first research.
- Record material evidence and uncertainty.
- Run relevant verification before DONE.
- Review the final diff.
- Update continuity at task end.
- Never claim deployment without direct Vercel evidence.
- Follow the release-only Vercel workflow.
- Stop after the current atomic task.

## Release Evidence Track

- R6 meaningful real exposure: UNKNOWN/pending.
- Physical Android/iOS Production QA: UNKNOWN/pending.
- Current Production configuration evidence: UNKNOWN/pending.
- No synthetic experiment traffic.
- No Vercel iteration loop.

## Exact Next Task

A.1 — Customer Journey & Event Truth Audit.

Boundary: audit only. No UI redesign, schema migration, runtime implementation, deployment, or unrelated refactor.
