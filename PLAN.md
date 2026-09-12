# Menu V3 — Active Plan

## Status
- Status: IN_PROGRESS.
- Repository: `Midosd249/Menu_V3`.
- Canonical branch: `main`.
- Source of truth: `main`.

## Completed Strategic Milestones
- Premium Theme System — DONE / VERIFIED / MERGED.
- Essential, Editorial, Noir, Heritage/Taste, Gallery — protected.
- Permanent visual/functional/research quality workflow — DONE / VERIFIED.
- P0 Public Order Hardening — DONE / VERIFIED.
- P1 Production/Continuity Hardening — DONE / VERIFIED for implemented scope.
- P1-H1 package/lockfile reconciliation — CLOSED / VERIFIED.
- P1-H2 main branch protection — CLOSED / VERIFIED.
- P2 Growth & Differentiation — DONE / VERIFIED / DEPLOYED.
- Platform Approval Center — CLOSED / VERIFIED.
- Registration-link rendering — CLOSED / VERIFIED.
- Onboarding Creation Recovery — CLOSED / VERIFIED / MERGED.
- Menu Intelligence V5 Report Center — CLOSED / VERIFIED / MERGED.
- R2.7 WhatsApp Report Sharing — CLOSED / VERIFIED / MERGED.
- AI Provider Routing & Multimodal Fallback — CLOSED / VERIFIED / MERGED.
- Gallery/Noir theme interaction hardening — CLOSED / VERIFIED / MERGED as `42b67382d3e1f1c3d66ed8fd8ba582101cf7da7a`.

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

All seven are complete and protected. Do not reopen without a current reproducible regression.

## R4 — Owner Intelligence
STATUS: CLOSED / VERIFIED

```text
R4.1 Verified Owner Signals           DONE / VERIFIED
R4.2 Intelligence Action Center       DONE / VERIFIED
R4.3 Action Center Follow-through     DONE / VERIFIED
R4.4 Intelligence Data Quality        DONE / VERIFIED
R4.5 Owner Decision Loop              DONE / VERIFIED
```

R4 protected principle:
**verified evidence → evidence quality → insight → priority → owner action → re-check**

The Owner Intelligence layer remains deterministic at the data boundary. AI may explain or prepare recommendations, but it cannot become the source of truth or autonomously mutate production data.

## R5 — Growth Extensions
STATUS: CLOSED / VERIFIED

### Completed R5 improvement
R5 discovery inspected the existing growth advisor, canonical OwnerAnalytics data, public-menu distribution signals, local-visibility readiness, and existing owner flows. The selected non-duplicative opportunity was the gap between a published menu with no recorded activity and the absence of a concrete owner action.

Implemented:
- Deterministic `distribution` action for published zero-activity menus.
- Evidence is limited to existing visits, sessions, product views, QR scans, and WhatsApp clicks.
- Owner is routed through the existing `/studio/brand` flow.
- Existing unpublished-menu action remains separate and prevents duplicate guidance.
- Regression tests cover published and unpublished cases.
- No new metrics, conversion claims, dependencies, migrations, providers, autonomous messaging, or duplicate UI were introduced.

R5 is complete and protected. Do not reopen without a reproducible regression.

## R6 — Experiments
STATUS: CLOSED / VERIFIED

### Selected experiment
`whatsapp-cta-v1` is the first bounded experiment. It tests whether making the existing WhatsApp action slightly more visually prominent increases WhatsApp-intent sessions without reducing product exploration.

Implemented:
- Stable `control` / `prominent` assignment derived from the existing anonymous session id.
- Server-side derivation of the recorded variant; the client cannot select the stored variant.
- Participation only for published menus with configured WhatsApp.
- Nullable `experiment_key` and `experiment_variant` columns on the existing `menu_events` stream, with a validation constraint and index.
- Treatment changes only the existing WhatsApp action presentation.
- Owner-preview/preview mode does not activate or record the experiment.
- Existing analytics stream remains canonical; no second event source was created.

Measurement contract:
- Primary metric: WhatsApp-click sessions / exposed sessions.
- Guardrail: product-view sessions / exposed sessions.
- Exposure: distinct session ids with recorded `visit` events for the experiment.
- Minimum collection target: 50 exposed sessions per variant.
- Decision is directional only; no statistical significance is claimed.
- Rollback if a clear product-exploration regression or rendering/accessibility defect appears.

R6 is complete as an experiment activation/measurement milestone. The production outcome is intentionally UNKNOWN until real traffic accumulates.

## Theme Interaction Hardening — CLOSED / VERIFIED

PR #119 was merged into `main` as `42b67382d3e1f1c3d66ed8fd8ba582101cf7da7a`.

Verified scope:
- Gallery assistant modal hides only the Gallery floating bottom action dock while open and restores it on close.
- Gallery uses a structural assistant-dialog state attribute rather than global z-index escalation or duplicate controls.
- Noir removes the blanket public-shell child stacking context that trapped ProductSheet below the assistant.
- Noir preserves intentional header/main/footer layers while allowing shared dialogs to stack correctly.
- Noir dialogs use existing semantic surface/content/border tokens so item-option text remains readable.
- Focused Gallery and Noir regression tests were added.
- Full repository quality gates passed before merge.

No ordering, pricing, availability, tenant/branch isolation, auth, AI grounding, provider routing, cart, or database behavior was changed.

## AI Provider Infrastructure
- VERIFIED: server-side provider abstraction is merged.
- VERIFIED: structured routing: Inception/Mercury → Gemini → Z.AI → OpenRouter → xKiro, configurable by server environment.
- VERIFIED: multimodal routing: Gemini → OpenRouter → Z.AI → xKiro.
- VERIFIED: Inception key rotation is server-side and secrets are not stored in Git.
- VERIFIED: schema validation, tenant/user rate limiting, prompt-injection safeguards, and human-review boundaries remain intact.

## Release-Only Vercel Policy
Normal path:

**LOCAL DEVELOPMENT → LOCAL QA → LOCAL BROWSER / VISUAL QA → TESTS → GITHUB ACTIONS QUALITY GATES → DIFF REVIEW → ONE COHERENT RELEASE BATCH → MERGE TO MAIN → ONE VERCEL PRODUCTION DEPLOYMENT → REAL-DEVICE PRODUCTION QA → RECORD RESULT**

Do not use Vercel for ordinary development or visual iteration. CI success and HTTP 200 are not deployment identity evidence. Do not randomly retry deployments or Redeploy.

## Current Verified Main
- VERIFIED: current `main` SHA is `42b67382d3e1f1c3d66ed8fd8ba582101cf7da7a`.
- VERIFIED: R6 is merged at `16bd37e51870740df547bb5840a0237fe3657f0a`.
- VERIFIED: Gallery/Noir theme hardening is merged at `42b67382d3e1f1c3d66ed8fd8ba582101cf7da7a`.
- VERIFIED: GitHub Quality passed for PR #119 before merge.
- VERIFIED: latest known Production deployment is READY for `887077710808aeae448ccf3d00b027adea165c77`.
- BLOCKED: Vercel has not deployed `42b67382...` because the PR deployment hit `api-deployments-free-per-day`.
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

Wait for real R6 exposure to accumulate, then inspect the canonical `menu_events` experiment fields and determine whether the evidence supports keeping control, keeping treatment, or ending the experiment. Do not claim statistical significance without sufficient data. Do not start a second experiment before this review.

Release prerequisite: once the Vercel free daily deployment limit clears, perform exactly one production deployment for the already-merged `42b67382...` theme hardening batch, then real-device QA for Gallery and Noir. Do not create deployment churn while the limit is active.