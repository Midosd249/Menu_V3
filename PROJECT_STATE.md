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
- VERIFIED: current `main` SHA is `42b67382d3e1f1c3d66ed8fd8ba582101cf7da7a`.
- VERIFIED: latest main commit is `fix(themes): polish Gallery assistant and Noir item modal`.
- VERIFIED: Guest Assistant public rendering hardening is present in main through commits `8614eae9b77a64569282ad17aa3224b1f3c4cb05` and `887077710808aeae448ccf3d00b027adea165c77`.
- VERIFIED: Gallery assistant modal layering and Noir item-modal stacking/surface contrast hardening are present in `42b67382d3e1f1c3d66ed8fd8ba582101cf7da7a`.
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

## AI Provider Infrastructure
- VERIFIED: server-side provider abstraction is merged.
- VERIFIED: structured routing supports Inception/Mercury, Gemini, Z.AI, OpenRouter, and xKiro.
- VERIFIED: multimodal routing supports Gemini, OpenRouter, Z.AI, and xKiro.
- VERIFIED: schema validation, tenant/user rate limiting, prompt-injection safeguards, and human-review boundaries remain intact.
- VERIFIED: server-only credentials; no client API-key exposure is part of the supported architecture.

## Release / Deployment
- VERIFIED: release-only Vercel workflow remains mandatory.
- VERIFIED: development must not use Vercel as the iteration loop.
- VERIFIED: latest main theme fix is in GitHub at `42b67382d3e1f1c3d66ed8fd8ba582101cf7da7a`.
- BLOCKED: Vercel production deployment for the latest release batch remains subject to the account deployment/build-rate limit; direct Vercel deployment evidence must be checked before claiming production state.
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
### R7 — Post-Experiment Evidence Review / Controlled Optimization

After real R6 exposure accumulates, inspect the canonical `menu_events` experiment fields and determine whether the evidence supports keeping control, keeping treatment, or ending the experiment. Do not claim statistical significance without sufficient data. Do not start another experiment before this review.

## Continuity Reconciliation Rule
At the end of every atomic task:
1. reconcile current Git head;
2. verify CI evidence;
3. verify deployment separately when relevant;
4. update `PROJECT_STATE.md`, `PLAN.md`, and `TASKS.md`;
5. update material audit/research/project-memory records when the task reveals a durable lesson;
6. record exactly one next task;
7. stop.

## Session Log — 2026-09-12 — Continuity Reconciliation
- VERIFIED: current `main` was reconciled against Git history and is `42b67382d3e1f1c3d66ed8fd8ba582101cf7da7a`.
- VERIFIED: prior continuity files were stale at `16bd37e51870740df547bb5840a0237fe3657f0a`; they did not include the later Guest Assistant and Gallery/Noir fixes.
- VERIFIED: the later commits are part of the current main history and are now reflected in this continuity record.
- VERIFIED: R6 remains the active experiment state; its outcome is not claimed until real exposure is available.
- BLOCKED: Vercel deployment state must remain separate from Git state and must not be inferred from `main` alone.
- Exact next task: R7 Post-Experiment Evidence Review / Controlled Optimization.

## Evidence Labels
`VERIFIED` = direct repository/tool/test/platform evidence.
`INFERRED` = derived from verified evidence.
`PROPOSED` = recommendation not yet proven.
`UNKNOWN` = insufficient evidence.
`BLOCKED` = hard constraint prevents verification or implementation.
