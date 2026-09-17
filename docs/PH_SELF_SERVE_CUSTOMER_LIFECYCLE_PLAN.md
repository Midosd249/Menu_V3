# Menu V3 — PH Self-Serve Customer Lifecycle Plan

## Status
- Plan: `PH`
- Canonical branch: `main`
- Source of truth: repository code, migrations, tests, Git history, CI, and direct deployment evidence.
- Rule: only one PH step may be `IN_PROGRESS` at a time.
- Rule: no PH-05 or unrelated milestone is activated automatically.

## Recovered Phase History — 2026-09-17

| Phase | Intended scope | Continuity status | Current evidence |
|---|---|---|---|
| PH-01 | Self-serve registration → workspace → Studio | `DONE / VERIFIED` for merged substeps; PH-01.4 verification is still CI-gated | PH-01.2 is merged in PR #159; PH-01.3 is merged in PR #160; PR #161 contains PH-01.4 verification work but its latest Quality run must pass before it can be marked merged. |
| PH-02 | Customer lifecycle visibility in Platform Admin | `COMPLETED — USER-CONFIRMED; RECONCILIATION RECORD` | The current main contains Platform Admin customer/tenant/member/subscription visibility. A dedicated historical PH-02 completion artifact was not found on current main. |
| PH-03 | Subscription plans + paid 14-day trial | `COMPLETED — USER-CONFIRMED; CURRENT-MAIN GAP` | The user confirms this phase was completed previously. Current main still exposes the older `free / 99 / 199` subscription catalog and the old trial initialization migration, so the exact PH-03 completion is not currently verifiable on main. Do not silently overwrite that discrepancy. |
| PH-04 | Platform Admin Subscription & Account Control | `IN_PROGRESS` | Current task. |
| PH-05 | Invoice generation + WhatsApp sharing | `TODO / NOT STARTED` | Must not start in this session. |

## Canonical Customer Journey

```text
Landing
  ├─ ابدأ مجانًا → registration → workspace → Studio
  └─ تسجيل الدخول → existing customer → Studio

Studio
  └─ choose plan → Free / 49 SAR / 149 SAR → paid-plan trial where applicable

Platform Admin
  └─ customer visibility → subscription/account control → audited changes

PH-05
  └─ invoice + WhatsApp sharing (not started)
```

## PH-01 — Self-Serve Registration → Workspace → Studio

### PH-01.1 — Entry Surface Audit
`DONE / VERIFIED` — public entry and authentication paths audited; no runtime implementation was performed in the audit.

### PH-01.2 — Registration Contract
`DONE / VERIFIED / MERGED` — PR #159. Six-field registration contract: full name, brand/restaurant name, Saudi phone, email, password, confirmation. Server-side validation and safe duplicate behavior preserved.

### PH-01.3 — Secure Workspace Provisioning
`DONE / VERIFIED / MERGED` — PR #160. Server-authoritative, atomic/idempotent provisioning with tenant, owner membership, primary branch, branch hours, secure eligibility, and legacy approval protections.

### PH-01.4 — Existing Customer Login
`IN VERIFICATION / PR #161` — existing-customer login, verified-session identity, membership-to-tenant resolution, fail-closed Studio access, and real Better Auth browser coverage. Latest Quality run was re-run after a browser-stage failure and must be reviewed before merge.

### PH-01.5 — Studio Setup Guidance
`DONE / VERIFIED — USER-CONFIRMED` in prior work context. No new implementation is authorized by this recovery task.

### PH-01.6 — New Customer Platform Admin Visibility
`DONE / VERIFIED — USER-CONFIRMED` in prior work context. Current main already exposes platform customer/account data.

### PH-01.7 — Legacy Approval Dependency
`DONE / VERIFIED — USER-CONFIRMED` in prior work context. Preserve legacy compatibility/security boundaries.

### PH-01.8 — Verification Gate
`DONE / VERIFIED for the completed merged work; PH-01.4 remains the outstanding CI/merge reconciliation item.`

## PH-02 — Customer Lifecycle Visibility in Platform Admin

- Customer index around authoritative tenant/account/membership/subscription data.
- Customer detail and activity supported by real data.
- New-customer indication without approval semantics.
- Legacy leads remain distinguishable from registered customers.
- Platform Admin authorization and tenant/customer data scope remain mandatory.

Status: `COMPLETED — USER-CONFIRMED; current main contains the underlying Admin visibility infrastructure.`

## PH-03 — Subscription Plans + Paid 14-Day Trial

Canonical commercial direction recovered from the prior plan:

- Free: `0 SAR/month`.
- Growth/paid tier 1: `49 SAR/month` or `490 SAR/year`.
- Pro/paid tier 2: `149 SAR/month` or `1,490 SAR/year`.
- Pro: unlimited products.
- Free: no paid trial.
- Paid tiers: 14-day trial when selected.
- No automatic charging claim without a real billing provider.
- Annual pricing explicitly communicates savings.

Status: `COMPLETED — USER-CONFIRMED; NOT CURRENTLY VERIFIED ON MAIN.`

Current-main reconciliation finding: `src/lib/menu/commercial-catalog.ts` and migration `20260903025817_subscription_plans.sql` still contain the older `99 / 199` catalog and older automatic trial initialization. This is recorded rather than silently treated as complete.

## PH-04 — Platform Admin Subscription & Account Control

**Status: `IN_PROGRESS`**

### PH-04.1 — Plan Control
Platform Admin can change a customer's plan only through server-authorized operations. Client input cannot select an unauthorized actor, tenant, or privilege.

### PH-04.2 — Trial Control
Platform Admin can extend an active trial by a bounded number of days or end an active trial. Trial operations are validated against the current subscription state and audited.

### PH-04.3 — Freeze / Unfreeze
Platform Admin can freeze or restore an account without deleting tenant, menu, customer, order, or subscription data. Account status is separate from subscription status.

### PH-04.4 — Subscription State Control
Administrative subscription states use the repository's current safe states: `trialing`, `active`, `past_due`, `cancelled`. State changes are server-authorized and validated.

### PH-04.5 — Audit Log
Every PH-04 mutation records actor, tenant, action, before-state, after-state, and timestamp. Secrets are never recorded.

### PH-04.6 — Verification Gate
Required evidence: typecheck, tests, lint, build, migration verification, auth/security checks, Platform Admin browser QA for the control surface, final diff review, and CI quality gates. No production mutation or unnecessary Vercel deployment is part of PH-04 implementation.

## Cross-Phase Security Contract

1. Never trust client-supplied identity, tenant, branch, role, privilege, entitlement, or price.
2. Preserve Better Auth and server-side Platform Admin authorization.
3. Preserve RLS and tenant/branch isolation.
4. Validate all mutation input server-side.
5. Fail closed when trusted context is missing or ambiguous.
6. Keep subscription/entitlement decisions server-authoritative.
7. Audit administrative mutations.
8. Do not expose authentication secrets.
9. Do not mutate production data during ordinary verification.
10. Do not weaken security to make tests pass.

## Protected Product Boundaries

Do not change the five public menu themes, public ordering, AI provider business logic, Guest Assistant truth boundaries, R8/R9 semantics, unrelated Studio/Admin redesigns, SEO, or invoice/WhatsApp work during PH-04 unless a direct dependency is proven and separately authorized.

## Vercel / Release Discipline

- Development and verification use local/CI evidence, not Vercel Preview as a development loop.
- Do not intentionally trigger unnecessary Preview/Production deployments.
- Production deployment is a separate release-stage action.
- Current Production serving state must not be claimed without direct evidence.

## Exact Current Task

`PH-04 — Platform Admin Subscription & Account Control` is the only active PH milestone.

`PH-05` remains `TODO / NOT STARTED`.
