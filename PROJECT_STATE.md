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
- VERIFIED: current `main` SHA is `16bd37e51870740df547bb5840a0237fe3657f0a`.
- VERIFIED: R2.7 WhatsApp Report Sharing is merged and protected.
- VERIFIED: R4.1 Verified Owner Signals is merged and protected.
- VERIFIED: R4.2 Intelligence Action Center is merged and protected.
- VERIFIED: R4.3 Action Center Follow-through is merged and protected.
- VERIFIED: R4.4 Intelligence Data Quality Foundation is merged and protected.
- VERIFIED: R4.5 Owner Decision Loop is merged and protected.
- VERIFIED: R5 Growth Extensions is merged and protected.
- VERIFIED: R6 bounded WhatsApp CTA experiment is merged as `16bd37e51870740df547bb5840a0237fe3657f0a`.
- VERIFIED: R6 assigns `control` / `prominent` deterministically from the existing anonymous session id, persists the server-derived variant on the existing `menu_events` stream, and limits participation to published menus with configured WhatsApp.
- VERIFIED: R6 treatment changes only the existing WhatsApp action presentation; no new customer action or autonomous outbound behavior was introduced.
- VERIFIED: R6 measurement contract is WhatsApp-click sessions / exposed sessions, with product-view sessions / exposed sessions as guardrail and 50 exposed sessions per variant as the collection threshold.
- VERIFIED: R6 does not claim statistical significance; results are directional only.
- VERIFIED: GitHub Quality run `1408` passed all repository quality steps.

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
- VERIFIED: current advisor surfaces a `distribution` action when a menu is published but the selected analytics window contains zero visits, sessions, product views, QR scans, and WhatsApp clicks.
- VERIFIED: the action uses only existing `OwnerAnalytics` fields and verified `tenant.isPublished` state.
- VERIFIED: the owner is routed to the existing `/studio/brand` flow; no duplicate route or dashboard was created.
- VERIFIED: unpublished menus keep the existing `publish-menu` action and do not receive a duplicate distribution action.
- VERIFIED: regression coverage covers both published zero-activity and unpublished cases.
- VERIFIED: R5 is a growth action, not a fabricated conversion metric; it asks the owner to distribute the existing menu and then collect real activity.
- VERIFIED: no autonomous messaging or external side effect was introduced.

## R6 — Experiments
STATUS: CLOSED / VERIFIED

### Selected experiment
- VERIFIED: `whatsapp-cta-v1` is a bounded CTA hierarchy experiment using the existing shared WhatsApp action.
- VERIFIED: hypothesis: stronger visual prominence of the existing WhatsApp action may increase WhatsApp-intent sessions without reducing product exploration.
- VERIFIED: control is the existing action presentation; treatment adds only `font-semibold shadow-sm`.
- VERIFIED: assignment is stable per existing anonymous session id and is recomputed server-side when recording events.
- VERIFIED: experiment data remains inside the canonical `menu_events` stream through nullable `experiment_key` and `experiment_variant` columns.
- VERIFIED: legacy events remain valid because experiment fields are nullable.
- VERIFIED: no third-party analytics SDK, fingerprinting, IP storage, pricing/order/auth changes, autonomous messaging, or new provider was introduced.
- VERIFIED: preview/owner-preview mode does not activate the treatment or record experiment clicks.

### Measurement contract
- Primary: WhatsApp-click sessions / exposed sessions.
- Guardrail: product-view sessions / exposed sessions.
- Exposure: distinct session ids with recorded `visit` events for the experiment.
- Collection threshold: 50 exposed sessions per variant.
- Decision output is directional only; no statistical significance is claimed.
- Rollback: remove the treatment if a clear product-exploration regression or rendering/accessibility defect appears.

## AI Provider Infrastructure
- VERIFIED: server-side provider abstraction is merged.
- VERIFIED: structured routing supports Inception/Mercury, Gemini, Z.AI, OpenRouter, and xKiro.
- VERIFIED: multimodal routing supports Gemini, OpenRouter, Z.AI, and xKiro.
- VERIFIED: Inception key rotation is server-side; secrets are not committed.
- VERIFIED: schema validation, tenant/user rate limiting, prompt-injection safeguards, and human-review boundaries remain intact.

## Release / Deployment
- VERIFIED: release-only Vercel workflow remains mandatory.
- VERIFIED: development must not use Vercel as the iteration loop.
- VERIFIED: R6 GitHub Quality run `1408` passed Typecheck, Tests, Lint, Production build, Playwright runtime/Chromium, all-theme Browser Template QA, performance upload, and preview shutdown.
- BLOCKED: Vercel remains blocked by the account deployment/build-rate limit. The PR received the direct Vercel bot error: `Resource is limited - try again in 24 hours (more than 100, code: "api-deployments-free-per-day")`.
- UNKNOWN: direct physical-device production QA remains unavailable through the current connector environment.

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

After the R6 experiment has accumulated real production exposure, inspect the experiment data and determine whether the evidence supports keeping control, keeping treatment, or ending the experiment. Do not claim statistical significance without sufficient data. Do not start another experiment before this review.

## UNKNOWN / BLOCKED
- BLOCKED: Vercel production deployment for R6 because the account is over the free daily deployment limit.
- UNKNOWN: direct physical-device observations are not available through the current connector environment.
- UNKNOWN: the R6 production sample size and directional outcome cannot be verified until experiment events accumulate in production.

## Continuity Rule
At the end of every atomic task:
1. reconcile current Git head;
2. verify CI evidence;
3. verify deployment separately when relevant;
4. update `PROJECT_STATE.md`, `PLAN.md`, and `TASKS.md`;
5. update material audit/research/project-memory records;
6. record exactly one next task;
7. stop.

## Session Log — 2026-09-12 — R6
- VERIFIED: started from current `main` `109c5a2683c6538458dc357b1dcd71ffb7631b80` after reconciling stale continuity SHA references.
- VERIFIED: inspected W15 experimentation contract and current `menu_events` event recorder; production A/B variants were previously not ready because the schema had no experiment fields.
- VERIFIED: selected one bounded CTA hierarchy experiment using the existing WhatsApp action and existing anonymous session id.
- VERIFIED: implemented deterministic server-derived assignment and nullable experiment fields without replacing the canonical event stream.
- VERIFIED: GitHub Quality run `1408` passed all quality steps after correcting one pre-existing source-contract assertion for the expanded tenant lookup.
- BLOCKED: Vercel deployment is blocked by `api-deployments-free-per-day`; no deployment retry was performed.
- VERIFIED: merged R6 as `16bd37e51870740df547bb5840a0237fe3657f0a`.
- Exact next task: R7 Post-Experiment Evidence Review / Controlled Optimization.

## Evidence Labels
`VERIFIED` = direct repository/tool/test/platform evidence.
`INFERRED` = derived from verified evidence.
`PROPOSED` = recommendation not yet proven.
`UNKNOWN` = insufficient evidence.
`BLOCKED` = hard constraint prevents verification or implementation.
