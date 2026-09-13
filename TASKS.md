# TASKS

## Completed Strategic Tasks

- P0 Public Order Hardening — CLOSED / VERIFIED.
- P1 Production/Continuity Hardening — CLOSED / VERIFIED.
- P2 Growth & Differentiation — CLOSED / VERIFIED / DEPLOYED.
- Platform Approval Center — CLOSED / VERIFIED.
- Registration-link rendering — CLOSED / VERIFIED.
- Onboarding Creation Recovery — CLOSED / VERIFIED / MERGED.
- Menu Intelligence V5 Report Center — CLOSED / VERIFIED / MERGED.
- AI Provider Routing & Multimodal Fallback — CLOSED / VERIFIED / MERGED.
- Grounded Guest Menu Assistant — CLOSED / VERIFIED.
- Gallery + Noir Theme Hardening — CLOSED / VERIFIED / MERGED.
- Continuity reconciliation — CLOSED / VERIFIED / MERGED.

## R2 — Menu Intelligence Product Layer — CLOSED / VERIFIED

```text
R2.1 Menu Health / Completeness       DONE
R2.2 Problem Detection                DONE
R2.3 Priority + Actionable Fixes      DONE
R2.4 Owner Menu Intelligence UX       DONE
R2.5 Verified Analytics Intelligence  DONE
R2.6 Professional Analytics Reports   DONE
R2.7 WhatsApp Report Sharing          DONE
```

## R4 — Owner Intelligence — CLOSED / VERIFIED

```text
R4.1 Verified Owner Signals           DONE / VERIFIED
R4.2 Intelligence Action Center       DONE / VERIFIED
R4.3 Action Center Follow-through     DONE / VERIFIED
R4.4 Intelligence Data Quality        DONE / VERIFIED
R4.5 Owner Decision Loop              DONE / VERIFIED
```

## R5 — Growth Extensions — CLOSED / VERIFIED

- Deterministic distribution action for published zero-activity menus.
- Uses only existing OwnerAnalytics evidence and verified publication state.
- Reuses `/studio/brand`; no duplicate dashboard or route.
- No fabricated metrics or autonomous messaging.

## R6 — Experiments — CLOSED / VERIFIED

- Experiment: `whatsapp-cta-v1`.
- Stable `control` / `prominent` assignment from existing anonymous session id.
- Server derives the recorded variant.
- Participation is limited to published menus with configured WhatsApp.
- Existing `menu_events` remains canonical through nullable experiment fields.
- Preview/owner-preview does not activate or record the experiment.
- Primary metric: WhatsApp-click sessions / exposed sessions.
- Guardrail: product-view sessions / exposed sessions.
- Collection target: 50 exposed sessions per variant.
- Directional results only; no statistical significance claim.
- Production outcome remains UNKNOWN until real exposure accumulates.

## R7 — Initial Evidence Review

- VERIFIED: current canonical `menu_v3.menu_events` has 1 exposed `prominent` session and 0 observed `control` exposed sessions for `whatsapp-cta-v1`.
- VERIFIED: current `prominent` exposure has 0 WhatsApp-click sessions and 1 product-view session.
- INFERRED: evidence is insufficient for the declared 50-exposed-sessions-per-variant decision threshold.
- DECISION: do not select a winner or end the experiment; continue eligible real exposure.

## Gallery + Noir Theme Hardening — CLOSED / VERIFIED / MERGED

- Gallery hides only its floating bottom action dock while the assistant dialog is open and restores it on close.
- Noir no longer traps shared dialogs inside the content stacking context.
- Noir dialog surface, text, and border tokens are hardened for readability.
- Focused regression coverage protects both fixes.
- Canonical main after continuity synchronization: `8bce889eda8605c73173e390139e54393024b03b`.

## Protected Scope

- Essential, Editorial, Noir, Heritage/Taste, and Gallery.
- Public menu behavior, customer actions, authentication, authorization, tenant/branch isolation, routing, migrations, and deployment controls.
- Quick Add, Item Notes, Cart, Orders, Notifications, Import, AI provider infrastructure, Platform Admin security, subscription protection, and release-only Vercel workflow.
- Do not repeat completed work without current reproducible regression evidence.

## Saudi Food Disclosure Extension — 2026-09-13

- IMPLEMENTED LOCALLY: nullable sodium and caffeine fields with explicit caffeine basis, owner entry/review, public display, and derived high-salt warning.
- VERIFIED: canonical `menu_v3.products` migration applied successfully.
- PRESERVED: calories, existing allergen text, AI review boundaries, tenant scoping, and protected menu/theme behavior.
- UNKNOWN: final technical-regulation presentation details, controlled allergen categories, and physical-activity calculation formula.
- BLOCKED: full TypeScript gate has pre-existing route/type-generation errors unrelated to the changed Product fields.
- NOT DEPLOYED: release-only workflow has not been started.

## Current Release Evidence
- VERIFIED: canonical `main` is `8bce889eda8605c73173e390139e54393024b03b`.
- VERIFIED: continuity synchronization was merged after the preceding canonical main `df72b5b9efa3df19f84c7e7f92057b1cc250bccd`.
- VERIFIED: Quality Run 1420 completed successfully for the pre-merge reconciliation commit.
- BLOCKED: Vercel production state must be verified separately; do not infer deployment from GitHub main.
- UNKNOWN: direct physical-device production QA is not available through the current connector environment.

## Exact Next Task
### R7 — Continue Real Exposure / Controlled Optimization Review

1. Keep `whatsapp-cta-v1` active for eligible real traffic.
2. Re-read canonical `menu_events` after exposure accumulates.
3. Compare control vs prominent using the declared primary and guardrail metrics.
4. Decide keep control, keep treatment, or end the experiment only when the evidence is sufficient.
5. Do not claim statistical significance without sufficient data.
6. Do not start a second experiment before this review.

## Working Rules
- `main` is source of truth.
- Use `VERIFIED`, `INFERRED`, `PROPOSED`, `UNKNOWN`, `BLOCKED`.
- Preserve completed work.
- One atomic task at a time unless the user explicitly names a complete milestone.
- Never claim deployment without direct deployment evidence.
- Reconcile continuity files against Git history at every session boundary.
