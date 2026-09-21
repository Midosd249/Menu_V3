# Customer Lifecycle & Access Policy

Status: `VERIFIED` unified activation implementation — 2026-09-16

## Canonical lifecycle

```text
Account registration
→ Activation request + brand/business information
→ Platform Admin review
→ Approval / rejection / action required
→ Workspace activation
→ Studio
```

Account registration and workspace activation are separate concepts. Signing up never creates a tenant, membership, branch, or branch hours.

## Access policy

- `VERIFIED`: a new account may exist without a tenant and can sign in again later.
- `VERIFIED`: the activation request is linked to the authenticated account through `leads.account_user_id` with a database uniqueness guard.
- `VERIFIED`: activation request states are `pending`, `action_required`, `approved`, `activated`, and `rejected`.
- `VERIFIED`: Platform Admin review is server-authorized with `requirePlatformAdmin`.
- `VERIFIED`: Studio remains unavailable until the account has an active tenant membership.
- `VERIFIED`: approved customer activation is performed through an atomic database function that locks the request row and is idempotent under repeated/concurrent activation attempts.
- `VERIFIED`: the database tenant trigger accepts either an active legacy registration-token approval or an `approved` account-linked activation request; signup grants are no longer an authorization path.
- `VERIFIED`: the historical `self_serve_registration_grants` table and migrations remain for migration history, but the signup hook no longer creates grants and the legacy `create_self_serve_workspace` function is retired.
- `VERIFIED`: existing tenants and existing owner memberships are preserved.

## Customer identity and login

- `VERIFIED`: customer authentication remains Better Auth based.
- `VERIFIED`: email/password sign-in remains supported.
- `VERIFIED`: approved service-request phone numbers continue to be normalized to Saudi E.164 form (`+966...`) for the legacy onboarding fallback.
- `VERIFIED`: the approved service-request phone can be bound to the matching customer account during legacy onboarding; this is not an SMS/OTP claim.
- `VERIFIED`: the login surface supports email or phone password sign-in where configured.
- `UNKNOWN`: an SMS provider is not configured in the repository; SMS OTP is not presented as production capability.

## New activation request behavior

1. The user registers with full name, email, Saudi phone, password, and confirmation.
2. The account is created only; no workspace is created and no self-serve grant is issued.
3. `/onboarding` loads the account's activation state.
4. `none` / `action_required` / `rejected` shows the brand/business activation form.
5. Submission creates or updates exactly one account-linked activation request.
6. `pending` shows a clear review state and remains available after logout/login.
7. Platform Admin can approve, reject, or request changes.
8. `approved` allows the authenticated account owner to activate the workspace.
9. Workspace activation creates tenant + owner membership + main branch + seven branch-hour rows atomically and changes the request to `activated` / legacy lead status `converted`.
10. `activated` redirects the customer to Studio.

## Platform Admin

- `VERIFIED`: `/admin/onboarding` now has a primary activation-request queue with Arabic/English status labels and approve/reject/request-changes actions.
- `VERIFIED`: legacy lead requests remain visible in the same page for backward compatibility.
- `VERIFIED`: legacy requests may still use the existing secure, hashed, 7-day registration-link workflow.
- `VERIFIED`: new activation requests never require the admin to copy or send a registration link.
- `VERIFIED`: concurrent admin decisions are guarded by conditional state transitions so only one decision can win from an eligible state.

## Customer states

| State | Customer can | Customer cannot |
|---|---|---|
| No request | Create/sign in to an account and submit activation data | Create a tenant or enter Studio |
| Pending | Sign in and view request status | Create a tenant or operate Studio |
| Action required | Review the admin note and resubmit | Enter Studio or bypass review |
| Approved | Activate the approved workspace | Bypass approval with another account |
| Activated | Enter Studio | Reuse the activation request to create another workspace |
| Rejected | Resubmit the request after reviewing the decision note | Create a tenant through signup alone |

## Legacy registration-link compatibility

- `VERIFIED`: existing approved legacy leads continue to use `/onboarding/:token`.
- `VERIFIED`: legacy token activation still requires an authenticated account whose email matches the approved service request.
- `VERIFIED`: legacy activation is now atomic and idempotent through `activate_legacy_customer_workspace`.
- `VERIFIED`: an already-used legacy token cannot create a second tenant; if the tenant already exists, the existing tenant is returned.
- `VERIFIED`: the legacy path remains a fallback only; it is not presented as the primary path for new account activation.

## Security model

- `VERIFIED`: client-controlled query parameters no longer select a self-serve workspace-creation mode.
- `VERIFIED`: no authenticated signup path creates a tenant merely because an account exists.
- `VERIFIED`: privileged activation functions are `SECURITY DEFINER` with explicit `search_path` and revoked execution from `public`, `anon`, and `authenticated` database roles.
- `VERIFIED`: tenant creation remains behind the database approval trigger.
- `VERIFIED`: request ownership is checked inside the activation function, not only in UI code.
- `VERIFIED`: request-row locking plus unique account linkage prevents duplicate workspace activation under concurrent attempts.
- `VERIFIED`: existing tenant isolation, membership authorization, and Studio gates remain the final application boundary.

## Plan and subscription policy

- `VERIFIED`: approval remains separate from subscription, pricing, trials, entitlements, AI, menu creation, and logo upload.
- `PROPOSED`: commercial plan assignment remains a later explicit handoff step.

## Verification boundary

Required verification for this lifecycle includes isolated PostgreSQL migration/authorization/concurrency coverage, repository typecheck/tests/lint/build, Platform Admin browser QA, and authenticated customer browser scenarios. Production deployment is outside this branch and must not be claimed from local/CI evidence alone.
