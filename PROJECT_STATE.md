# PROJECT STATE

## Identity

- Status: IN_PROGRESS.
- Repository: Midosd249/Menu_V3.
- Canonical branch: main.
- Source of truth: main.
- Product: Menu V3, Arabic-first bilingual multi-tenant digital-menu SaaS for restaurants and cafes.

## Durable Continuity Contract

- VERIFIED: detailed execution methodology, recovery procedure, phase dependencies, anti-regression rules, research rules, verification gates, Git/PR discipline, and release policy are documented in docs/master-execution-plan.md.
- VERIFIED: PLAN.md and TASKS.md act as concise active-state indexes and must remain synchronized with the master plan.
- RULE: a new chat must recover from repository evidence and the master plan, not from conversational memory.

## Current Verified Position — 2026-09-18

- VERIFIED: canonical main is c3afb623559ea1d6e015a5abeb6a59ebc26a4f27.
- VERIFIED: PR #179 and PR #180 are merged; PR #161/#174/#176 are obsolete/superseded historical work.
- VERIFIED: PH-01 through PH-06 and protected product systems are present.
- VERIFIED: a current-code gap audit identified a small set of real remaining gaps.
- UNKNOWN: physical real-device Production QA for latest main.
- UNKNOWN: current Production environment-variable values.
- UNKNOWN: sufficient real R6 exposure for directional outcome evaluation.

## Completed Protected Product Work

- G1–G7.2, PH-01–PH-06 — CLOSED / VERIFIED.
- Essential, Editorial, Noir, Heritage/Taste, Gallery — protected.
- Public menu, search/category/product/cart/Quick Add/Item Notes/order flow — protected.
- Public order hardening, Studio Orders, notifications and payment boundary — protected.
- R2/R4/R5/R8 intelligence/growth work — protected.
- R9 Guest CRM/Loyalty/Campaigns/Feedback/Retention — protected.
- AI provider routing, multimodal ingestion, menu AI and grounded Guest Assistant — protected.
- Self-serve lifecycle, subscriptions/entitlements, Platform Admin, branches, teams, import, billing, QR — protected.
- SEO/local discovery, accessibility/performance contracts and release-only Vercel workflow — protected.
- R6 implementation is protected; meaningful real exposure remains insufficient for outcome judgment.

## Current Gap Findings

See docs/current-product-gap-audit-2026-09-18.md when present on the current branch/release.

### VERIFIED gaps

1. Public telemetry currently covers visit, qr_scan, product_view, and whatsapp; search/category/cart actions are not in the public event contract.
2. Public order submission is not linked to the anonymous menu sessionId, preventing a clean end-to-end anonymous journey from menu engagement to order outcome.
3. Existing experiment infrastructure is real, but the broader analytics taxonomy is not yet a single canonical end-to-end journey contract.
4. International presentation exists, but market-dependent boundaries are not yet proven as a complete adapter/configuration model; SAR-specific fallbacks exist in current code.
5. Public menu-level SEO/shareability exists; dedicated product/category deep-link capability is not proven by the current route inventory.
6. Owner intelligence/growth systems exist; stronger action → metric → outcome linkage remains an integration gap.
7. Real-world evidence remains incomplete: meaningful R6 exposure and physical device Production QA are pending.

## Current Strategic Direction

Gap closure, not feature expansion:

Journey truth → minimal missing instrumentation → outcome-linked intelligence → international boundary audit → shareability audit → release evidence.

Do not turn the product into a generic AI chatbot, POS, accounting system, autonomous restaurant operator, Saudi-only architecture, or unrelated feature platform.

## Continuity / Anti-Regression Rules

1. Start every task from the actual current main SHA.
2. Read the master execution plan before meaningful work.
3. Prove an existing capability is absent before adding it.
4. Extend existing contracts instead of creating parallel systems.
5. Add focused regression tests with every runtime change.
6. Preserve tenant/branch isolation, server authorization, price/entitlement trust and fail-closed behavior.
7. One atomic task per session.
8. No Vercel iteration loop.
9. At task end, reconcile Git/CI/deployment/device evidence and record exactly one next task.
10. If chat context is lost, use docs/master-execution-plan.md plus current Git/code evidence to recover.

## Exact Next Task

A.1 — Customer Journey & Event Truth Audit.

Boundary: audit only; no runtime implementation, no schema migration, no UI redesign, no deployment, no unrelated refactor.

## Session Log

### 2026-09-18 — Master Execution Plan Hardened

- VERIFIED: detailed master plan added to docs/master-execution-plan.md.
- VERIFIED: active continuity indexes point to the master plan.
- VERIFIED: no runtime code, database schema, auth/RLS, theme, or deployment behavior changed by this documentation task.
- VERIFIED: documentation changes are being carried on branch docs/current-product-gap-audit-2026-09-18 for PR #190.
- UNKNOWN: whether PR #190 has been merged into main; current PR state must be checked before claiming the master plan is on main.
- Next task: A.1 — Customer Journey & Event Truth Audit, after the documentation baseline is available on the authoritative branch or otherwise explicitly authorized.
