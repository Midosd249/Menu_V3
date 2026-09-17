# PH-01 Self-Serve Customer Lifecycle — Closure Record

Date: 2026-09-17
Repository: `Midosd249/Menu_V3`
Canonical branch: `main`
Final merged SHA: `7e91778bfafa67b24efd1edf4387e1f3014fae9d`
PR: #170 — `fix: retire legacy customer approval and request flows`

## Purpose

This document records the final state of the self-serve customer lifecycle correction and the work completed by Manus so future sessions do not reopen the same phase or infer a payment/commercial phase that the owner has explicitly deferred.

## Owner-approved customer lifecycle

### New customer

```text
Home
  ↓
Registration
  ↓
Secure Workspace Provisioning
  ↓
Studio
```

A new customer is not required to submit a manual approval/service request before entering the product.

### Existing customer

```text
Home
  ↓
Existing Customer Login
  ↓
Email OR Phone + Password
  ↓
Existing Workspace / Studio
```

The existing login path must remain separate from self-serve registration and must preserve the customer's existing tenant/workspace context.

## Platform Admin contract

```text
Platform Admin
  ├── Users / Customers
  │      └── server-authorized customer control
  │
  └── existing supported administrative surfaces
```

The following are NOT customer-entry dependencies or supported lifecycle control surfaces:

```text
Leads                 ❌ legacy lifecycle surface
Service Requests      ❌ legacy lifecycle surface
Approval Queue        ❌ legacy customer-entry dependency
```

The important distinction is that removing the old request/approval system does not remove administrative control. `/admin/users` remains the supported customer-control surface.

## Security contract preserved

- Tenant isolation remains mandatory.
- Branch isolation remains mandatory.
- Authentication remains server-authorized.
- Authorization remains server-side.
- Workspace provisioning remains fail-closed when trusted context is missing or ambiguous.
- Client-supplied identity, tenant, branch, role, entitlement, or privilege is not trusted.
- No security boundary was intentionally weakened to implement self-serve onboarding.

## PR #170 scope

The merged PR retired the legacy customer approval/request lifecycle and included the following intended scope:

- self-serve customer onboarding;
- removal of approval/request gating;
- removal of legacy Leads and Service Requests from Platform Admin;
- cleanup/retirement of legacy request records/trigger behavior covered by the PR;
- preservation of `/admin/users` as the server-authorized customer control surface;
- preservation of fail-closed tenant provisioning and tenant isolation;
- route, browser, contract, and lifecycle continuity updates.

## Verification provenance

### Direct GitHub evidence

- `main` currently resolves to `7e91778bfafa67b24efd1edf4387e1f3014fae9d`.
- PR #170 is merged and closed.
- GitHub reports a successful Vercel deployment status for the same merge SHA.

### Manus completion report

Manus reported:

- Platform Admin navigation and retired routes were fixed.
- W7.9 contracts, server-side authorization, and isolation were preserved.
- Quality gates passed.
- W9 Orders QA passed.
- Vercel deployment completed successfully.
- The local TypeScript/baseUrl failure observed during the work was attributed to a local TypeScript/toolchain version mismatch, not an application failure; CI was treated as the authoritative quality gate.
- Local repository state was synchronized and clean at handoff.

## Important history / root-cause lessons

During the implementation, the work encountered CI/browser routing issues involving Platform Admin workspace navigation and generated route-tree consistency. The resolution path was evidence-driven rather than disabling checks or introducing permanent test bypasses.

The final PR was merged only after the required quality path was completed according to the Manus handoff.

Do not reopen these issues without new reproducible evidence.

## Commercial boundary

The previously discussed sequence after PH-06 included:

```text
Payment Provider Integration
        ↓
Commercial Launch
```

The owner has explicitly decided NOT to implement these now.

Therefore:

- Payment Provider Integration = `NOT STARTED / DEFERRED`.
- Commercial Launch = `NOT STARTED / DEFERRED`.
- No PH-07 is defined.
- No payment provider credentials, webhooks, payment state machine, production billing flow, or commercial-launch implementation should be started automatically.

## Current state

```text
PH-01  DONE / VERIFIED / MERGED
PH-02  DONE / VERIFIED / MERGED
PH-03  DONE / VERIFIED / MERGED
PH-04  DONE / VERIFIED / MERGED
PH-05  DONE / VERIFIED / MERGED
PH-06  DONE / VERIFIED / MERGED

Payment Provider Integration  DEFERRED
Commercial Launch             DEFERRED
PH-07                         NOT DEFINED
```

## Next-action rule

There is intentionally no automatic next PH implementation.

Wait for the owner's next explicitly scoped product request.
