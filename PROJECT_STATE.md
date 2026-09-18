# PROJECT STATE

## Identity
- Status: IN_PROGRESS.
- Repository: `Midosd249/Menu_V3`.
- Canonical branch: `main`.
- Source of truth: `main`.
- Product: Menu V3, Arabic-first bilingual multi-tenant digital-menu SaaS for restaurants and cafes.

## Current Verified Position — 2026-09-18
- VERIFIED: canonical `main` resolves to `c3afb623559ea1d6e015a5abeb6a59ebc26a4f27`.
- VERIFIED: PR #179 is CLOSED / MERGED at `18ca4f243b39640ebd7ed77541b268240b54cefd`.
- VERIFIED: PR #180 is CLOSED / MERGED at `e8677a9d20c19ab03eff84d39358a66918b932b2`.
- VERIFIED: PR #161, #174, and #176 are CLOSED as obsolete/superseded historical work.
- VERIFIED: current strategy documentation was prepared from current repository evidence and external research.
- UNKNOWN: physical real-device Production QA for the latest `main`.
- UNKNOWN: current Production environment-variable values.
- UNKNOWN: representative real-production funnel values.

## PH Lifecycle — Completed
PH-01 through PH-06 are completed historical milestones. No additional PH milestone is defined by this strategy task.

## Completed Protected Product Work
- G1–G7.2 — CLOSED / VERIFIED.
- Premium Theme System — DONE / VERIFIED / MERGED.
- Essential, Editorial, Noir, Heritage/Taste, Gallery — protected.
- Visual/Functional Quality System — DONE / VERIFIED / MERGED.
- P0 Public Order Hardening — DONE / VERIFIED.
- P1 Production/Continuity Hardening — DONE / VERIFIED for implemented scope.
- P1-H1 package/lockfile reconciliation — CLOSED / VERIFIED.
- P1-H2 main protection — CLOSED / VERIFIED.
- P2 Growth & Differentiation — DONE / VERIFIED / DEPLOYED.
- Platform Approval Center — CLOSED / VERIFIED.
- Registration-link rendering — CLOSED / VERIFIED.
- Onboarding Creation Recovery — CLOSED / VERIFIED / MERGED.
- Menu Intelligence V5 Report Center — CLOSED / VERIFIED / MERGED.
- R2.1–R2.7 Menu Intelligence — CLOSED / VERIFIED.
- R4.1–R4.5 Owner Intelligence — CLOSED / VERIFIED.
- R5 Growth Extensions — CLOSED / VERIFIED.
- R6 bounded WhatsApp CTA experiment — CLOSED / VERIFIED for implementation; outcome pending meaningful real exposure.
- R7 evidence review — IN PROGRESS / NON-BLOCKING while exposure remains insufficient.
- R8.1–R8.5 Closed-Loop Menu Growth Engine — CLOSED / VERIFIED / MERGED.
- R9 Guest CRM / Loyalty / Campaigns / Feedback / Retention — CLOSED / VERIFIED / MERGED.
- AI Provider Routing & Multimodal Fallback — CLOSED / VERIFIED / MERGED.
- Grounded Guest Menu Assistant — CLOSED / VERIFIED.
- Gallery + Noir theme hardening — CLOSED / VERIFIED / MERGED.
- W7.1–W7.12 internal product experience work — CLOSED / VERIFIED for implemented scope; physical Android/iOS QA remains release-stage evidence.
- W8 Internal Visual System — DONE / VERIFIED for implemented scope.

## Strategic Blueprint — 2026-09-18
- DONE / VERIFIED as documentation: `docs/customer-product-master-blueprint.md`.
- Direction: evolve Menu V3 toward a restaurant-owned guest experience, direct-commerce, relationship, and decision-intelligence platform.
- PROPOSED execution sequence:
  1. Measurement Truth.
  2. Guest Friction Elimination.
  3. Commerce Intelligence.
  4. Guest Relationship Loop.
  5. Growth Optimization.
  6. Internationalization Core.
  7. Platform Scale.
- PROPOSED international principle: Saudi Arabia is a market configuration, not the core product identity.
- PROTECTED: do not restart, re-theme, or replace completed capabilities.
- PROTECTED: do not turn Menu V3 into a generic chatbot, full POS, accounting suite, delivery fleet, or autonomous restaurant operator.

## Production / Release Gates
- UNKNOWN: physical real-device Production QA for latest `main`.
- UNKNOWN: current production environment-variable values.
- BLOCKED / NON-BLOCKING: prior Vercel deployment attempts encountered the known free daily deployment quota; no unnecessary retry is authorized.
- Do not use Vercel as an iteration loop.

## Continuity Rule
At the end of every atomic task:
1. reconcile Git head against GitHub `main`;
2. distinguish implementation, CI, deployment, and device evidence;
3. update continuity files when canonical state changes;
4. record exactly one next authorized task;
5. never infer authorization for deferred payment/commercial work.

## Exact Next Task
PROPOSED / awaiting explicit implementation authorization: Phase A.1 — Customer Journey & Event Truth Audit. Inspect current event emitters, schemas, metrics, order linkage, session identity, privacy boundaries, and tests; produce a gap matrix. No UI redesign, schema change, or Vercel deployment is implied.
