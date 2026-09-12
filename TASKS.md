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

- VERIFIED: canonical table is `menu_v3.menu_events`.
- VERIFIED: current observed exposure is 1 distinct `control` session and 2 distinct `prominent` sessions.
- VERIFIED: current `control` has 0 WhatsApp-click sessions and 0 product-view sessions.
- VERIFIED: current `prominent` has 0 WhatsApp-click sessions and 1 product-view session.
- INFERRED: Control is at 2% of the 50-session target and Prominent is at 4% of the 50-session target.
- DECISION: do not select a winner or end the experiment; continue eligible real exposure.
- R7 is a NON-BLOCKING monitoring lane and does not stop independent development work.

## Production / Commercial Readiness — IN PROGRESS

- VERIFIED: temporary premium-theme testing override is server-side, expiry-bound, client-inaccessible, and hard-disabled in production.
- VERIFIED: current all-free theme catalog means the override does not currently grant an otherwise unavailable premium theme.
- VERIFIED: no code removal is justified solely by this review.
- VERIFIED: GitHub quality workflow covers route generation, typecheck, tests, lint, production build, Playwright/Chromium browser QA, all-theme template QA, and performance audit.
- VERIFIED: canonical `main` is `0295650fe3d59e5e25f75cecd51b9a5c8a9b131d`.
- UNKNOWN: direct Vercel Production environment-variable values cannot be inspected through the current GitHub connector.
- UNKNOWN: physical real-device Production QA is unavailable through the current connector environment.

## Gallery + Noir Theme Hardening — CLOSED / VERIFIED / MERGED

- Gallery hides only its floating bottom action dock while the assistant dialog is open and restores it on close.
- Noir no longer traps shared dialogs inside the content stacking context.
- Noir dialog surface, text, and border tokens are hardened for readability.
- Focused regression coverage protects both fixes.
- Canonical main: `0295650fe3d59e5e25f75cecd51b9a5c8a9b131d`.

## Protected Scope

- Essential, Editorial, Noir, Heritage/Taste, and Gallery.
- Public menu behavior, customer actions, authentication, authorization, tenant/branch isolation, routing, migrations, and deployment controls.
- Quick Add, Item Notes, Cart, Orders, Notifications, Import, AI provider infrastructure, Platform Admin security, subscription protection, and release-only Vercel workflow.
- Do not repeat completed work without current reproducible regression evidence.

## Current Release Evidence
- VERIFIED: canonical `main` is `0295650fe3d59e5e25f75cecd51b9a5c8a9b131d`.
- VERIFIED: continuity synchronization follow-up is the current main commit.
- VERIFIED: the quality workflow remains configured for both `main` pushes and pull requests.
- UNKNOWN: direct current Vercel Production environment configuration cannot be verified from the GitHub connector.
- UNKNOWN: direct physical-device production QA is not available through the current connector environment.

## Exact Next Task
### Production / Commercial Readiness — External Verification Gate

1. Verify Vercel Production environment/configuration against canonical Supabase project `ublxptcqefujkbeepylc` and schema `menu_v3`.
2. Perform available authenticated/browser/QR/theme/order/RTL Production QA without overstating unavailable device evidence.
3. Perform real-device QA when a real device/browser session is available.
4. Record direct evidence and close the readiness milestone when all applicable checks pass.

R7 remains active independently and does not block this task.

## Working Rules
- `main` is source of truth.
- Use `VERIFIED`, `INFERRED`, `PROPOSED`, `UNKNOWN`, `BLOCKED`.
- Preserve completed work.
- One atomic task at a time unless the user explicitly names a complete milestone.
- Never claim deployment without direct deployment evidence.
- Reconcile continuity files against Git history at every session boundary.
