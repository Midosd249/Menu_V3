# PROJECT STATE

## Identity
- Status: IN_PROGRESS.
- Repository: `Midosd249/Menu_V3`.
- Canonical branch: `main`.
- Source of truth: `main`.
- Product: Menu V3, Arabic-first bilingual multi-tenant digital-menu SaaS for restaurants and cafes.

## Canonical Backend Identity
- VERIFIED: Supabase project ref `ublxptcqefujkbeepylc`.
- VERIFIED: canonical database schema `menu_v3`.
- VERIFIED: Menu V3 is separated from legacy application data by schema boundary.

## Current Verified Position — 2026-09-12
- VERIFIED: current `main` SHA is `1e2364cde7c9ecc0b40538f2cf606179d24646d9`.
- VERIFIED: R2.7 WhatsApp Report Sharing is merged and protected.
- VERIFIED: R4.1 Verified Owner Signals is merged and protected.
- VERIFIED: R4.2 Intelligence Action Center is merged and protected.
- VERIFIED: R4.3 Action Center Follow-through is merged and protected.
- VERIFIED: R4.4 Intelligence Data Quality Foundation is merged and protected.
- VERIFIED: R4.5 Owner Decision Loop is merged and protected.
- VERIFIED: R5 Growth Extensions is merged as `1e2364cde7c9ecc0b40538f2cf606179d24646d9`.
- VERIFIED: R5 adds deterministic distribution guidance for a published menu with zero recorded entry/interaction events, using existing analytics and publication state only.
- VERIFIED: R5 introduced no new metric, autonomous outbound messaging, AI provider, dependency, database migration, or duplicate dashboard.
- VERIFIED: GitHub Quality passed for R5 before merge.
- UNKNOWN: Vercel status for the new R5 merge commit is still pending at the time of this continuity update.

## Completed Protected Work
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
- R2.7 WhatsApp Report Sharing — CLOSED / VERIFIED / MERGED.
- AI Provider Routing & Multimodal Fallback — CLOSED / VERIFIED / MERGED.

## R2 — Menu Intelligence Product Layer
STATUS: CLOSED / VERIFIED

```text
R2.1 Menu Health / Completeness       DONE
R2.2 Problem Detection                DONE
R2.3 Priority + Actionable Fixes      DONE
R2.4 Owner Menu Intelligence UX       DONE
R2.5 Verified Analytics Intelligence  DONE
R2.6 Professional Analytics Reports   DONE
R2.7 WhatsApp Report Sharing          DONE
```

Protected R2 principles:
- Database is the source of truth.
- Deterministic findings precede AI explanation.
- AI cannot invent price, availability, allergen, tenant, branch, permission, payment, revenue, or financial truth.
- Reports use canonical verified analytics.
- WhatsApp sharing is owner-reviewed; no autonomous outbound messaging was introduced.

## R4 — Owner Intelligence
STATUS: CLOSED / VERIFIED

```text
R4.1 Verified Owner Signals           DONE / VERIFIED
R4.2 Intelligence Action Center       DONE / VERIFIED
R4.3 Action Center Follow-through     DONE / VERIFIED
R4.4 Intelligence Data Quality        DONE / VERIFIED
R4.5 Owner Decision Loop              DONE / VERIFIED
```

R4 protected contract:
- Owner intelligence is grounded in existing analytics.
- Evidence quality is deterministic: `fresh`, `stale`, or `insufficient`.
- Insights and actions remain owner-reviewed.
- Refresh/re-check reuses the existing analytics flow.
- AI remains explanatory/recommendation-only and is never the source of truth.

## R5 — Growth Extensions
STATUS: CLOSED / VERIFIED

### Completed R5 improvement
- VERIFIED: current advisor now surfaces a `distribution` action when a menu is published but the selected analytics window contains zero visits, sessions, product views, QR scans, and WhatsApp clicks.
- VERIFIED: the action uses only existing `OwnerAnalytics` fields and verified `tenant.isPublished` state.
- VERIFIED: the owner is routed to the existing `/studio/brand` flow; no duplicate route or dashboard was created.
- VERIFIED: unpublished menus keep the existing `publish-menu` action and do not receive a duplicate distribution action.
- VERIFIED: regression coverage covers both published zero-activity and unpublished cases.
- VERIFIED: R5 is a growth action, not a fabricated conversion metric; it asks the owner to distribute the existing menu and then collect real activity.
- VERIFIED: no autonomous messaging or external side effect was introduced.

## AI Provider Infrastructure
- VERIFIED: server-side provider abstraction is merged.
- VERIFIED: structured routing supports Inception/Mercury, Gemini, Z.AI, OpenRouter, and xKiro.
- VERIFIED: multimodal routing supports Gemini, OpenRouter, Z.AI, and xKiro.
- VERIFIED: Inception key rotation is server-side; secrets are not committed.
- VERIFIED: schema validation, tenant/user rate limiting, prompt-injection safeguards, and human-review boundaries remain intact.

## Release / Deployment
- VERIFIED: release-only Vercel workflow remains mandatory.
- VERIFIED: development must not use Vercel as the iteration loop.
- VERIFIED: R5 GitHub Quality passed before merge.
- UNKNOWN: direct physical-device observations remain unavailable through the current connector environment.
- UNKNOWN: Vercel deployment status for `1e2364cde7c9ecc0b40538f2cf606179d24646d9` is pending at this continuity checkpoint.

## Current Strategic Direction
Menu V3 is a Premium Arabic-first Restaurant Presence + Menu Intelligence platform:

```text
Live Menu
→ Guest Experience
→ Menu Intelligence
→ Owner Intelligence
→ Growth Extensions
```

Do not turn the product into a generic AI chatbot, POS, accounting system, or autonomous restaurant operator.

## Exact Next Task
### R6 — Experiments Discovery / Evidence-First Prioritization

Before implementing a new feature, inspect current `main` for existing experimentation, analytics, growth, public-menu conversion, and owner workflows. Select one atomic, evidence-backed experiment or growth improvement with a measurable outcome that the current data model can actually observe. Do not invent statistical significance or reopen completed R2/R3/R4/R5 work without a reproducible regression.

## UNKNOWN / BLOCKED
- UNKNOWN: direct physical-device observations are not available through the current connector environment.
- UNKNOWN: current account-level Vercel Usage/Billing limits unless separately inspected.
- UNKNOWN: Vercel production completion for the new R5 merge commit at the time this file was updated.

## Continuity Rule
At the end of every atomic task:
1. reconcile current Git head;
2. verify CI evidence;
3. verify deployment separately when relevant;
4. update `PROJECT_STATE.md`, `PLAN.md`, and `TASKS.md`;
5. update material audit/research/project-memory records;
6. record exactly one next task;
7. stop.

## Evidence Labels
`VERIFIED` = direct repository/tool/test/platform evidence.
`INFERRED` = derived from verified evidence.
`PROPOSED` = recommendation not yet proven.
`UNKNOWN` = insufficient evidence.
`BLOCKED` = hard constraint prevents verification or implementation.
