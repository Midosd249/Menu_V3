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
- VERIFIED: current canonical `main` after continuity reconciliation is `df72b5b9efa3df19f84c7e7f92057b1cc250bccd` before this documentation-only follow-up branch.
- VERIFIED: the preceding application baseline is the theme-hardening main commit `42b67382d3e1f1c3d66ed8fd8ba582101cf7da7a`.
- VERIFIED: Guest Assistant public rendering hardening is present in main through commits `8614eae9b77a64569282ad17aa3224b1f3c4cb05` and `887077710808aeae448ccf3d00b027adea165c77`.
- VERIFIED: Gallery assistant modal layering and Noir item-modal stacking/surface contrast hardening are present in main through the preceding theme-hardening commit.
- VERIFIED: the latest theme fix has focused regression coverage for Gallery and Noir.
- VERIFIED: R2.7 WhatsApp Report Sharing, R4.1–R4.5 Owner Intelligence, R5 Growth Extensions, and R6 bounded WhatsApp CTA experiment remain in repository history and are protected.
- VERIFIED: R6 assigns `control` / `prominent` deterministically from the existing anonymous session id, persists the server-derived variant on the existing `menu_events` stream, and limits participation to published menus with configured WhatsApp.
- VERIFIED: R6 measurement contract is WhatsApp-click sessions / exposed sessions, with product-view sessions / exposed sessions as guardrail and 50 exposed sessions per variant as the collection threshold.
- VERIFIED: R6 does not claim statistical significance; results are directional only.

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
- Grounded Guest Menu Assistant — DONE / VERIFIED, including public-route rendering and accessibility hardening.
- Gallery + Noir theme hardening — DONE / VERIFIED / MERGED.
- Continuity reconciliation — CLOSED / VERIFIED / MERGED.

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

- VERIFIED: published zero-activity menus surface a deterministic `distribution` action using existing OwnerAnalytics fields and verified publication state.
- VERIFIED: owner is routed to existing `/studio/brand`; no duplicate route/dashboard was created.
- VERIFIED: unpublished menus retain the existing `publish-menu` action without duplicate guidance.
- VERIFIED: no new metrics, conversion claims, autonomous messaging, or production mutation were introduced.

## R6 — Experiments
STATUS: CLOSED / VERIFIED — ACTIVATION COMPLETE; OUTCOME PENDING REAL EXPOSURE

### Selected experiment
- VERIFIED: `whatsapp-cta-v1` is a bounded CTA hierarchy experiment using the existing shared WhatsApp action.
- VERIFIED: hypothesis: stronger visual prominence of the existing WhatsApp action may increase WhatsApp-intent sessions without reducing product exploration.
- VERIFIED: control is the existing presentation; treatment adds only `font-semibold shadow-sm`.
- VERIFIED: assignment is stable per existing anonymous session id and is recomputed server-side when recording events.
- VERIFIED: experiment data remains inside the canonical `menu_events` stream through nullable `experiment_key` and `experiment_variant` fields.
- VERIFIED: preview/owner-preview mode does not activate the treatment or record experiment clicks.

### Measurement contract
- Primary: WhatsApp-click sessions / exposed sessions.
- Guardrail: product-view sessions / exposed sessions.
- Exposure: distinct session ids with recorded `visit` events for the experiment.
- Collection threshold: 50 exposed sessions per variant.
- Decision output is directional only; no statistical significance is claimed.

## R7 — Initial Post-Experiment Evidence Review
STATUS: IN_PROGRESS — INSUFFICIENT EXPOSURE

- VERIFIED: canonical `menu_v3.menu_events` currently contains R6 exposure for `whatsapp-cta-v1` only in the `prominent` variant.
- VERIFIED: current observed exposure is 1 distinct exposed session for `prominent` and 0 observed exposed sessions for `control`.
- VERIFIED: current `prominent` exposure has 0 WhatsApp-click sessions and 1 product-view session.
- INFERRED: the experiment has not reached the declared collection threshold of 50 exposed sessions per variant and cannot support a keep-treatment, keep-control, or end-experiment decision.
- DECISION: no treatment decision is made from the current sample; continue real exposure and re-review after meaningful accumulation.
- VERIFIED: no statistical significance claim is made.

## AI Provider Infrastructure
- VERIFIED: server-side provider abstraction is merged.
- VERIFIED: structured routing supports Inception/Mercury, Gemini, Z.AI, OpenRouter, and xKiro.
- VERIFIED: multimodal routing supports Gemini, OpenRouter, Z.AI, and xKiro.
- VERIFIED: schema validation, tenant/user rate limiting, prompt-injection safeguards, and human-review boundaries remain intact.
- VERIFIED: server-only credentials; no client API-key exposure is part of the supported architecture.

## Release / Deployment
- VERIFIED: release-only Vercel workflow remains mandatory.
- VERIFIED: development must not use Vercel as the iteration loop.
- BLOCKED: Vercel production deployment state for the latest application release must be verified separately because the account has a deployment/build-rate limit condition.
- UNKNOWN: direct physical-device production QA is unavailable through the current connector environment.

## Current Strategic Direction
Menu V3 is a Premium Arabic-first Restaurant Presence + Menu Intelligence platform:

```text
Live Menu
→ Guest Experience
→ Menu Intelligence
→ Owner Intelligence
→ Growth Extensions
→ Experiments
```

Do not turn the product into a generic AI chatbot, POS, accounting system, or autonomous restaurant operator.

## Exact Next Task
### R7 — Continue Real Exposure / Controlled Optimization Review

Keep `whatsapp-cta-v1` running for eligible real traffic. Re-read canonical `menu_events` after exposure accumulates, compare control and prominent against the declared primary and guardrail metrics, and make a directional decision only when the evidence is sufficient. Do not start another experiment before this review.

## Continuity Reconciliation Rule
At the end of every atomic task:
1. reconcile current Git head;
2. verify CI evidence;
3. verify deployment separately when relevant;
4. update `PROJECT_STATE.md`, `PLAN.md`, and `TASKS.md`;
5. update material audit/research/project-memory records when the task reveals a durable lesson;
6. record exactly one next task;
7. stop.

## Session Log — 2026-09-12 — R7 Initial Evidence Review
- VERIFIED: Quality Run 1420 succeeded for the pre-merge continuity reconciliation commit.
- VERIFIED: current canonical `main` before this follow-up documentation branch is `df72b5b9efa3df19f84c7e7f92057b1cc250bccd`.
- VERIFIED: Supabase canonical `menu_v3.menu_events` currently shows 1 exposed `prominent` session, 0 observed `control` exposure, 0 prominent WhatsApp-click sessions, and 1 prominent product-view session for `whatsapp-cta-v1`.
- DECISION: R7 remains open because the declared 50-exposed-sessions-per-variant threshold is not met.
- BLOCKED: Vercel deployment state remains separate from Git state.

## Evidence Labels
`VERIFIED` = direct repository/tool/test/platform evidence.
`INFERRED` = derived from verified evidence.
`PROPOSED` = recommendation not yet proven.
`UNKNOWN` = insufficient evidence.
`BLOCKED` = hard constraint prevents verification or implementation.
