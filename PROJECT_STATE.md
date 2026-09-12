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
- VERIFIED: R2.7 WhatsApp Report Sharing is merged and protected.
- VERIFIED: R4.1 Verified Owner Signals is merged and protected.
- VERIFIED: R4.2 Intelligence Action Center is merged and protected.
- VERIFIED: R4.3 Action Center Follow-through is merged and protected.
- VERIFIED: R4.4 Intelligence Data Quality Foundation is merged and protected.
- VERIFIED: R4.5 Owner Decision Loop is merged and protected.
- VERIFIED: R5 Growth Extensions is merged and protected.
- VERIFIED: R6 bounded WhatsApp CTA experiment is merged as `16bd37e51870740df547bb5840a0237fe3657f0a`.
- VERIFIED: R6 assigns `control` / `prominent` deterministically from the existing anonymous session id, persists the server-derived variant on the existing `menu_events` stream, and limits participation to published menus with configured WhatsApp.
- VERIFIED: R6 measurement contract is WhatsApp-click sessions / exposed sessions, with product-view sessions / exposed sessions as guardrail and 50 exposed sessions per variant as the collection threshold.
- VERIFIED: R6 does not claim statistical significance; results are directional only.
- VERIFIED: PR #119 `fix(themes): polish Gallery assistant and Noir item modal` merged as `42b67382d3e1f1c3d66ed8fd8ba582101cf7da7a`.
- VERIFIED: PR #119 removed the Gallery assistant/bottom-dock overlap, removed the Noir blanket child stacking context, and restored Noir dialog surface/content contrast.
- VERIFIED: PR #119 added structural regression coverage for Gallery and Noir.
- VERIFIED: GitHub main commit `42b67382d3e1f1c3d66ed8fd8ba582101cf7da7a` is signed/verified.

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
- Gallery/Noir theme interaction hardening — CLOSED / VERIFIED / MERGED.

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

## Theme Interaction Hardening — 2026-09-12
STATUS: CLOSED / VERIFIED / MERGED

- VERIFIED: Gallery assistant dialog now hides only the Gallery floating bottom action dock while the dialog is open and restores the dock unchanged after close.
- VERIFIED: Gallery uses the assistant's structural `data-public-menu-assistant-dialog="true"` state; no duplicated control or global z-index escalation was introduced.
- VERIFIED: Noir no longer applies the blanket `.menu-public-shell > * { position: relative; z-index: 1; }` stacking context.
- VERIFIED: Noir preserves intentional header/main/footer layering while allowing shared ProductSheet/Assistant modal siblings to stack correctly.
- VERIFIED: Noir shared dialogs use existing semantic surface/content/border tokens, preventing light `bg-paper` surfaces from producing unreadable light text.
- VERIFIED: focused regression tests cover Gallery assistant/dock layering and Noir modal stacking/surface contrast.
- VERIFIED: PR #119 merged to `main` as `42b67382d3e1f1c3d66ed8fd8ba582101cf7da7a`.
- VERIFIED: the repository Quality Gate passed before merge, including Typecheck, Tests, Lint, Production Build, Playwright/Chromium, all-theme Browser QA, and performance baseline.

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
- VERIFIED: PR #119 merged to `main` and `main` now points to `42b67382d3e1f1c3d66ed8fd8ba582101cf7da7a`.
- VERIFIED: latest known Production deployment remains `dpl_Ar9gZkRBUHtrT84phwZ4oUUuJJ1f`, READY, for main commit `887077710808aeae448ccf3d00b027adea165c77`.
- BLOCKED: Vercel has not deployed `42b67382...`; the PR #119 Vercel bot reported `Resource is limited - try again in 24 hours (more than 100, code: "api-deployments-free-per-day")` at `2026-09-12T17:53:16Z`.
- VERIFIED: two PR #119 preview deployments were READY, but they were created from earlier head commits and are not production deployment evidence for `42b67382...`.
- UNKNOWN: direct physical-device production QA for the new Gallery/Noir fixes remains unavailable through the current connector environment.

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

Before release of any subsequent change, first clear the current Vercel deployment limit and perform one controlled production deployment for the already-merged `42b67382...` theme hardening batch. Do not create preview/redeploy churn while the limit is active.

## UNKNOWN / BLOCKED
- BLOCKED: production deployment of `42b67382d3e1f1c3d66ed8fd8ba582101cf7da7a` because the Vercel Hobby deployment quota is exhausted.
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

## Session Log — 2026-09-12 — Theme Interaction Hardening
- VERIFIED: current `main` is `42b67382d3e1f1c3d66ed8fd8ba582101cf7da7a`.
- VERIFIED: PR #119 addressed the exact Gallery and Noir defects reported from real mobile screenshots.
- VERIFIED: Gallery assistant open state is now exposed structurally so the theme can hide only its floating dock during the modal.
- VERIFIED: Noir ProductSheet/Assistant stacking was corrected by removing the blanket direct-child stacking context and preserving only intentional content layers.
- VERIFIED: Noir dialog surfaces/content now use semantic theme tokens for readable contrast.
- VERIFIED: focused regression tests and the full repository quality gate passed before merge.
- VERIFIED: main merge completed.
- BLOCKED: Vercel production deployment of `42b67382...` remains blocked by the free daily deployment quota; no retry churn was performed.
- Exact next task: clear the deployment limit, perform one production deployment for `42b67382...`, then perform real-device Gallery/Noir QA; after that continue with R7 evidence review.

## Evidence Labels
`VERIFIED` = direct repository/tool/test/platform evidence.
`INFERRED` = derived from verified evidence.
`PROPOSED` = recommendation not yet proven.
`UNKNOWN` = insufficient evidence.
`BLOCKED` = hard constraint prevents verification or implementation.