# Menu V3 — PH Self-Serve Customer Lifecycle Plan

## Document Status

- Plan Code: `PH`
- Plan Name: Self-Serve Customer Lifecycle & Commercial Subscription Journey
- Status: `IN_PROGRESS`
- Activation: `ACTIVE_PLAN_ONLY`
- Canonical Branch: `main`
- Scope Authority: user-approved product direction recorded in this plan
- Source of Truth: repository code, migrations, tests, Git history, CI evidence, and direct deployment evidence
- Rule: Only one `PH` step may be `IN_PROGRESS` at a time.
- Rule: No implementation step begins unless the user explicitly authorizes execution of that step.
- Rule: This plan does not authorize unrelated refactors, redesigns, deployments, pricing implementation outside the stated phase, or changes to protected completed product areas.

## Current Verified Position

- `VERIFIED`: `main` is the canonical source of truth.
- `VERIFIED`: the repository already contains Better Auth, Studio, Platform Admin, subscription, entitlement, tenant, membership, branch, and migration infrastructure.
- `VERIFIED`: the current repository has an `/onboarding` lifecycle surface and a legacy/public lead path; these are existing implementation facts that must be reconciled with the new self-serve direction rather than blindly reverted.
- `VERIFIED`: the previous customer approval lifecycle work is merged and must not be reverted wholesale.
- `VERIFIED`: the historical self-serve implementation depended on retired authorization/grant mechanics and is not the implementation target.
- `VERIFIED`: the current subscription architecture includes automatic trial initialization for newly created tenants; this conflicts with the approved commercial rule that paid-plan trials should begin when a paid plan is selected. This is reserved for `PH-03` and must not be silently changed during unrelated phases.
- `UNKNOWN`: direct current Vercel Production environment-variable values and exact Production serving state unless separately verified from Vercel.
- `UNKNOWN`: physical Android/iOS Production QA.

## Product Decision — Canonical Customer Entry Experience

The customer-facing entry experience has exactly two primary choices:

1. **ابدأ مجانًا** — for a new customer who wants to create an account and start using Menu V3.
2. **تسجيل الدخول** — for an existing customer who already has an account.

There is no customer-facing approval gate between registration and Studio.

The existing public contact/lead form remains a separate sales/contact path and is not merged into account registration unless a later task explicitly authorizes that change.

## Canonical Lifecycle

```text
Landing
  |
  +-- ابدأ مجانًا
  |      |
  |      +-- Registration
  |      |      - Full name
  |      |      - Brand name
  |      |      - Saudi phone
  |      |      - Email
  |      |      - Password
  |      |      - Password confirmation
  |      |
  |      +-- Create account
  |      +-- Create workspace
  |      +-- Create owner membership
  |      +-- Create main branch
  |      +-- Initialize safe subscription state
  |      +-- Record new customer for Platform Admin
  |      +-- Redirect to Studio
  |      |
  |      +-- Studio setup guidance
  |
  +-- تسجيل الدخول
         |
         +-- Authenticate existing account
         +-- Resolve active tenant membership
         +-- Redirect directly to Studio

Studio
  |
  +-- Setup Guidance
  +-- Choose plan
       |
       +-- Free
       |
       +-- 49 SAR paid plan -> 14-day trial
       |
       +-- 149 SAR paid plan -> 14-day trial

Paid Trial
  |
  +-- Trialing
  +-- Trial expired
  +-- Payment required / Past due policy
  +-- Account restriction/freeze according to finalized commercial policy
  |
  +-- Invoice
       |
       +-- Admin review
       +-- Professional invoice
       +-- Admin-triggered WhatsApp sharing
```

---

# PH-01 — Self-Serve Registration → Workspace → Studio

**Status:** `TODO` — this becomes the only implementation task when explicitly activated.

## PH-01.1 — Entry Surface Audit

### Objective
Ensure the public entry experience exposes only the two primary account actions:

- `ابدأ مجانًا`
- `تسجيل الدخول`

### Requirements

- `ابدأ مجانًا` routes to the new-account registration experience.
- `تسجيل الدخول` routes to the existing authentication experience.
- Existing authenticated users must not be forced through registration.
- Existing customer sessions should resolve to Studio through the current authorization contract.
- No approval-request screen is presented as a prerequisite to ordinary self-serve signup.
- The separate public contact/lead form remains a separate path.

### Acceptance Criteria

- A new visitor can identify the two account paths immediately.
- The registration path does not accidentally reuse a legacy approval gate.
- The login path does not create duplicate accounts or workspaces.
- No dead or unsupported account action is introduced.

---

## PH-01.2 — Registration Contract

### Required Fields

1. Full name
2. Brand / restaurant name
3. Saudi phone number
4. Email
5. Password
6. Password confirmation

### Validation

- Required fields are validated client-side for usable feedback and server-side for trust.
- Password confirmation must match.
- Saudi phone format must follow the existing repository validation convention.
- Email must use the existing authentication validation behavior.
- Duplicate-account behavior must remain safe and non-leaky.
- Validation errors must be understandable in Arabic-first RTL UI.

### Security Rules

- Never trust client-supplied user id, tenant id, role, membership, plan, privilege, or entitlement.
- Registration must not grant Platform Admin privileges.
- Registration must not allow arbitrary tenant selection.
- Registration must not allow arbitrary branch selection.
- Secrets must remain server-side where applicable.

### Acceptance Criteria

- All six fields are present and usable.
- Invalid submissions fail safely.
- Successful signup creates only the intended authenticated identity before workspace provisioning.
- No authorization boundary is weakened.

---

## PH-01.3 — Secure Workspace Provisioning

### Objective
Replace the customer approval dependency with a secure, server-authorized self-serve workspace creation flow.

### Provisioning Order

```text
Authenticated User
  ↓
Validate registration/workspace input
  ↓
Create or resolve Tenant
  ↓
Create Owner Membership
  ↓
Create Main Branch
  ↓
Initialize required branch defaults
  ↓
Initialize safe subscription state
  ↓
Record customer lifecycle event/data
  ↓
Return authoritative tenant/slug
  ↓
Redirect to Studio
```

### Required Properties

- Atomic where database support exists.
- Idempotent where retries can occur.
- Server/database authorization enforced.
- Tenant and branch isolation preserved.
- Existing RLS remains effective.
- No direct client-side privileged inserts.
- No historical `self_serve_registration_grants` dependency is restored merely for convenience.
- Retired self-serve functions are not reactivated blindly.

### Failure Handling

If any provisioning step fails:

- Do not leave the user with a false success state.
- Do not redirect to Studio without an authoritative active membership.
- Surface a safe retryable error.
- Preserve database integrity.
- Ensure retries do not duplicate tenant, branch, membership, or subscription records.

### Acceptance Criteria

A successful new signup results in:

- account exists;
- tenant/workspace exists;
- owner membership exists;
- main branch exists;
- required defaults exist;
- safe subscription state exists;
- customer is recorded for Platform Admin visibility;
- user reaches `/studio`.

---

## PH-01.4 — Existing Customer Login

### Objective
Make the existing-customer path direct and predictable.

### Flow

```text
تسجيل الدخول
  ↓
Authenticate
  ↓
Resolve active tenant membership
  ↓
Studio
```

### Rules

- Existing active customers go directly to Studio.
- Existing authenticated users should not see signup fields.
- If an account has no valid workspace, the system must use a safe recovery/setup path rather than granting unauthorized Studio access.
- Existing authorization and permission gates remain intact.

### Acceptance Criteria

- Valid existing customer reaches Studio.
- Invalid session is rejected safely.
- No tenant crossover is possible.

---

## PH-01.5 — Studio Setup Guidance

### Objective
Help a new customer complete the minimum setup without blocking access to Studio.

### Proposed Checklist

```text
Account
Workspace
Restaurant information
Logo / identity
Theme
First category
First product
Branch
Publish menu
QR
```

### Rules

- Guidance is progressive, not a hard approval gate.
- It must use existing supported Studio destinations and capabilities.
- No fake progress or fabricated completion state.
- Completed steps must be derived from real product state where possible.
- Missing/empty/error/loading states must be explicit.
- The customer can continue working in Studio without completing every step immediately.

### Acceptance Criteria

- New customers understand what to do next.
- Existing Studio capabilities are reused rather than duplicated.
- No unrelated Studio redesign is introduced.

---

## PH-01.6 — New Customer Platform Admin Visibility

### Objective
Ensure every new self-serve customer becomes visible to Platform Admin without an approval gate.

### Customer Record Minimum Data

- Customer name
- Brand name
- Phone
- Email
- Signup timestamp
- Tenant/workspace
- Current plan
- Subscription status
- Trial end when applicable
- Last activity/login when available from an existing reliable source

### Rules

- The record is created from authoritative server-side state.
- Admin visibility must respect Platform Admin authorization.
- No sensitive authentication secrets are exposed.
- The record is not presented as awaiting approval.
- Existing Admin data models should be reused where appropriate.

### Acceptance Criteria

- A newly registered customer appears in the appropriate Admin customer view.
- Admin can distinguish new customers from legacy sales leads.
- No duplicate customer records are created by retrying signup.

---

## PH-01.7 — Remove/Bypass Legacy Approval Dependency Safely

### Objective
Disconnect the ordinary self-serve path from the retired customer approval lifecycle without deleting historical functionality that remains needed elsewhere.

### Rules

- Do not blindly revert PR #157.
- Preserve its security hardening, idempotency, database validation, authorization boundaries, and audit principles.
- Identify which `/onboarding`, Admin approval, lead, and self-serve helpers are still used elsewhere before modifying/removing them.
- Remove only the obsolete dependency from the ordinary self-serve signup journey.
- Keep the public lead/contact path separate.

### Acceptance Criteria

- New signup no longer waits for manual approval.
- Existing approved/legacy records are not corrupted.
- Historical data remains readable where required.
- No unrelated lifecycle route is broken.

---

## PH-01.8 — PH-01 Verification Gate

### Required Checks

At minimum, run the applicable repository-defined checks:

- `npm run typecheck`
- `npm test`
- `npm run test:platform`
- `npm run lint`
- `npm run build`
- `npm run check:auth`
- `npm run db:migrate` when migration changes exist
- Relevant customer-lifecycle tests
- Relevant Playwright/browser tests
- RTL/LTR and responsive checks for registration and Studio entry
- Security/authorization/tenant-isolation checks

### Manual Scenarios

1. New customer with valid Arabic data.
2. New customer with English/mixed-direction data.
3. Duplicate email.
4. Duplicate phone where applicable.
5. Invalid Saudi phone.
6. Password mismatch.
7. Provisioning retry/failure.
8. Existing customer login.
9. Existing authenticated session visiting signup.
10. Customer with no active tenant.
11. Platform Admin sees the new customer.
12. No customer can access another tenant.

### Release Rule

PH-01 is not `DONE` until the relevant checks pass and the final diff is reviewed. A local success is not deployment evidence.

---

# PH-02 — Customer Lifecycle Visibility in Platform Admin

**Status:** `TODO`

## PH-02.1 — Customer Index

Create/extend a Platform Admin customer index around authoritative account, tenant, membership, and subscription data.

## PH-02.2 — Customer Detail

Provide a focused customer record with identity, workspace, plan, subscription state, trial dates, activity, notes, and audit information supported by real data.

## PH-02.3 — New Customer Notification/Indicator

Provide an Admin-visible indicator for newly registered customers. It must not imply an approval requirement.

## PH-02.4 — Legacy Lead Separation

Keep sales/contact leads distinguishable from actual registered customers.

## PH-02.5 — PH-02 Verification

Run platform Admin authorization, data-scope, UI, responsive, regression, typecheck, test, lint, and build checks.

---

# PH-03 — Subscription Plans + Paid 14-Day Trial

**Status:** `TODO`

## PH-03.1 — Commercial Catalog Update

Target prices:

- Free: `0 SAR`
- Paid Tier 1: `49 SAR/month`
- Paid Tier 2: `149 SAR/month`
- Paid Tier 2: unlimited products

Detailed entitlement allocation is intentionally deferred until this phase.

## PH-03.2 — Trial Rule

- Free: no trial.
- 49 SAR: 14-day trial when selected.
- 149 SAR: 14-day trial when selected.
- Trial does not begin merely because an account was created.

## PH-03.3 — Subscription State Model

Keep account state separate from subscription state.

Suggested account state:

```text
active
frozen
blocked
```

Suggested subscription state:

```text
free
trialing
active
past_due
cancelled
suspended
```

Exact states are finalized against current schema before implementation.

## PH-03.4 — Existing Automatic Trial Correction

The current repository behavior that automatically creates a 14-day trial at tenant creation must be audited and changed only within this phase so the new rule is authoritative.

## PH-03.5 — Trial Expiry

Define and implement what the customer sees when a paid trial expires, while preserving menu/customer/order data and avoiding destructive deletion.

## PH-03.6 — Annual Billing Discount

Design an attractive annual-payment discount after the monthly plan and entitlement model are stable. The exact discount is `PROPOSED` until validated and explicitly approved.

## PH-03.7 — PH-03 Verification

Verify billing state transitions, authorization, tenant isolation, trial dates, expiry behavior, plan limits, and regression safety.

---

# PH-04 — Platform Admin Subscription & Account Control

**Status:** `TODO`

## PH-04.1 — Plan Control

Platform Admin can change a customer's plan only through server-authorized operations.

## PH-04.2 — Trial Control

Platform Admin can extend, end, or otherwise manage trial state according to an explicit audit-safe policy.

## PH-04.3 — Freeze / Unfreeze

Platform Admin can freeze and restore an account without deleting its data.

## PH-04.4 — Subscription State Control

Administrative changes to subscription state must be validated and audited.

## PH-04.5 — Audit Log

Record who changed what, when, and the relevant customer/workspace identifier without exposing secrets.

## PH-04.6 — PH-04 Verification

Verify authorization, auditability, RLS, tenant isolation, failure handling, and Admin UI behavior.

---

# PH-05 — Invoice Generation + WhatsApp Sharing

**Status:** `TODO`

## PH-05.1 — Invoice Data Model

Define invoice number, customer, plan, billing period, subtotal, applicable VAT/tax fields, total, status, issue date, and due date using authoritative billing data.

## PH-05.2 — Professional Invoice Output

Produce a professional Arabic-first invoice suitable for customer sharing.

## PH-05.3 — Tax/Regulatory Boundary

Do not claim ZATCA tax-invoice compliance until the relevant requirements have been researched, implemented, and verified.

## PH-05.4 — Admin WhatsApp Action

Provide an Admin-triggered WhatsApp sharing action with a professional prefilled message and invoice reference.

No autonomous outbound messaging is introduced.

## PH-05.5 — PH-05 Verification

Verify invoice calculations, authorization, tenant/customer scope, document rendering, WhatsApp target correctness, and audit behavior.

---

# Cross-Phase Security Contract

The following requirements apply to every `PH` phase:

1. Never trust client-supplied identity, tenant, branch, role, privilege, entitlement, or price.
2. Preserve Better Auth authentication boundaries.
3. Preserve database authorization and RLS.
4. Preserve tenant and branch isolation.
5. Validate all user-controlled inputs server-side.
6. Fail closed when trusted context is missing or ambiguous.
7. Keep subscription/entitlement decisions server-authoritative.
8. Keep administrative mutations audited.
9. Do not expose secrets or authentication credentials.
10. Do not mutate production data as part of ordinary implementation verification.
11. Do not weaken controls merely to make tests pass.

# Cross-Phase Product Boundaries

The PH plan does not authorize changes to these protected areas unless a later explicit task proves a direct dependency:

- Public menu themes: Essential, Editorial, Noir, Heritage/Taste, Gallery
- Menu Creation architecture
- AI provider infrastructure/business logic
- Guest Assistant business truth boundaries
- R8 Growth engine
- R9 Guest Relationships
- Logo/brand systems
- Unrelated Studio/Admin redesigns
- Unrelated SEO/public-menu behavior
- Unrelated order business logic

# Git / Release Discipline

- Work one atomic PH step at a time.
- Prefer a focused branch for implementation when local workflow is available.
- Do not push every small change.
- Do not intentionally trigger Vercel Preview deployments for ordinary development.
- Follow the release-only Vercel workflow for any release.
- Documentation-only PH plan activation does not constitute production deployment.
- Never label a change `DEPLOYED` without direct Vercel Production evidence.

# Status Legend

- `VERIFIED` — directly confirmed by repository/tool/test/source evidence.
- `INFERRED` — derived from verified evidence but not directly observed.
- `PROPOSED` — recommendation not yet implemented or proven.
- `UNKNOWN` — insufficient direct evidence.
- `BLOCKED` — cannot proceed because of a hard constraint.
- `TODO` — planned and not started.
- `IN_PROGRESS` — current active execution task.
- `DONE` — completed with evidence.
- `CLOSED` — milestone complete and verified.

# Activation Rule

**ACTIVE PLAN: `PH` only.**

When the owner authorizes work, activate exactly one step using the form:

```text
PH-XX.Y — IN_PROGRESS
```

Complete and verify that step before activating the next one.

Do not activate R10, unrelated milestones, or unrelated feature work automatically.

# Exact Next Action

`PH-01.1` is the next planned step. It is `TODO` until the owner explicitly says to begin execution.
