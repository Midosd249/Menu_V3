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
- VERIFIED: current `main` SHA is `8fd3f580cee9d740ffa323588f15215b8e7764e1`.
- VERIFIED: R2.7 WhatsApp Report Sharing is merged and protected.
- VERIFIED: R4.1 Verified Owner Signals is merged and protected.
- VERIFIED: R4.2 Intelligence Action Center is merged and protected.
- VERIFIED: R4.3 Action Center Follow-through is merged and protected.
- VERIFIED: R4.4 Intelligence Data Quality Foundation is merged as `8fd3f580cee9d740ffa323588f15215b8e7764e1`.
- VERIFIED: R4.4 GitHub Quality passed before merge.
- VERIFIED: R4.4 adds deterministic `fresh` / `stale` / `insufficient` evidence-quality status from existing OwnerAnalytics data only.
- VERIFIED: invalid observation dates are ignored and duplicate observed dates count once.
- VERIFIED: R4.4 introduced no database mutation, AI provider, dependency, or new UI surface.
- VERIFIED: Vercel reported success for the relevant development commit; no new production deployment is being claimed from this continuity update.
- STATUS: `VERIFIED_LOCALLY` / merged to `main`; production deployment identity for the current main SHA remains UNKNOWN unless directly rechecked.

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
STATUS: IN_PROGRESS

```text
R4.1 Verified Owner Signals           DONE / VERIFIED
R4.2 Intelligence Action Center       DONE / VERIFIED
R4.3 Action Center Follow-through     DONE / VERIFIED
R4.4 Intelligence Data Quality        DONE / VERIFIED
R4.5 Owner Decision Loop              NEXT
```

R4.4 protected contract:
- Evidence quality is deterministic and derived from existing analytics.
- `fresh`, `stale`, and `insufficient` are explicit states.
- No synthetic observations are created.
- AI remains explanatory/recommendation-only and is never the source of truth.

## AI Provider Infrastructure
- VERIFIED: server-side provider abstraction is merged.
- VERIFIED: structured routing supports Inception/Mercury, Gemini, Z.AI, OpenRouter, and xKiro.
- VERIFIED: multimodal routing supports Gemini, OpenRouter, Z.AI, and xKiro.
- VERIFIED: Inception key rotation is server-side; secrets are not committed.
- VERIFIED: schema validation, tenant/user rate limiting, prompt-injection safeguards, and human-review boundaries remain intact.

## Release / Deployment
- VERIFIED: release-only Vercel workflow remains mandatory.
- VERIFIED: development must not use Vercel as the iteration loop.
- UNKNOWN: current production deployment identity for `main` SHA `8fd3f580cee9d740ffa323588f15215b8e7764e1` unless directly rechecked.
- Do not trigger a deployment merely to develop or verify R4.5.

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
### R4.5 — Owner Decision Loop

1. Reuse the existing `/studio/intelligence` and `/studio/intelligence-actions` surfaces; do not create a duplicate intelligence dashboard.
2. Consume the deterministic R4.4 data-quality contract in the existing Owner Intelligence flow.
3. Show evidence status and freshness context beside actionable insights.
4. Make each recommendation explainable: verified evidence → reason → owner action → existing product flow.
5. Add a re-check path through the existing refresh mechanism so the owner can verify the evidence after making an approved change.
6. Preserve read-only intelligence boundaries and all tenant/branch/auth/RLS protections.
7. Add focused regression coverage for fresh/stale/insufficient states and action-loop behavior.
8. Run applicable typecheck, tests, lint, build, browser/accessibility/security checks available in the repository.
9. Release only after one coherent quality-gated batch.

Do not reopen R2, R3, Themes, Orders, Notifications, Import, AI Provider Infrastructure, Platform Admin security, or Subscription protection without a current reproducible regression.

## UNKNOWN / BLOCKED
- UNKNOWN: direct physical-device observations are not available through the current connector environment.
- UNKNOWN: current account-level Vercel Usage/Billing limits unless separately inspected.
- UNKNOWN: current production deployment identity for `main` SHA `8fd3f580cee9d740ffa323588f15215b8e7764e1` until directly checked.

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
