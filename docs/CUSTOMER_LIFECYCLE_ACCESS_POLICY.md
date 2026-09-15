# Customer Lifecycle & Access Policy

Status: `VERIFIED` implementation policy — 2026-09-16

## Canonical lifecycle

```text
Public website
→ Service request (lead)
→ Platform Owner review
→ Approval
→ Secure registration link
→ Customer account
→ Tenant + owner membership + main branch
→ Subscription/trial
→ Customer setup
→ QA / publish
→ Public menu + QR
→ Customer handoff
```

## Access policy

- `VERIFIED`: a new account may exist without a tenant, but an account alone does not grant Studio workspace creation.
- `VERIFIED`: new tenant creation is denied by the database unless the authenticated owner email matches a lead with an active, non-revoked, non-expired approved onboarding record.
- `VERIFIED`: `/studio` continues to redirect an authenticated user without a tenant to `/onboarding`; `/onboarding` is now an approval-status gate rather than a self-service tenant creator.
- `VERIFIED`: Platform Owner approval remains the explicit commercial gate and produces the existing single-use, hashed, 7-day registration token.
- `VERIFIED`: the approved registration token must be used with the account whose email matches the service-request email.
- `VERIFIED`: after token activation, the lead becomes `converted` and the tenant/owner/branch are provisioned.
- `VERIFIED`: existing tenants and existing owner memberships are not changed by this policy migration.

## Customer identity and login

- `VERIFIED`: customer authentication remains Better Auth based.
- `VERIFIED`: email/password sign-in remains supported.
- `VERIFIED`: approved service-request phone numbers are normalized to Saudi E.164 form (`+966...`) and bound to the matching customer account during approved onboarding.
- `VERIFIED`: the approved service-request phone is marked `phoneNumberVerified=true` because it is a Platform Owner-approved identity attribute; this is **not** an SMS/OTP claim.
- `VERIFIED`: the login surface now allows the customer to choose email or phone number for password-based sign-in.
- `UNKNOWN`: an SMS provider is not configured in the repository; phone OTP verification/change flows are therefore not presented as production capability.
- `PROPOSED`: connect an SMS provider later if self-service phone verification or phone-number changes are required.

## Platform Owner account controls

- `VERIFIED`: `/admin/users` is a dedicated Platform Owner account-management surface.
- `VERIFIED`: account listing, phone approval, freeze/unfreeze, and deletion operations are server-authorized with the existing `requirePlatformAdmin` contract.
- `VERIFIED`: freezing a user sets Better Auth `banned` state and revokes the user's existing sessions.
- `VERIFIED`: Platform Owner accounts cannot be frozen or deleted through this customer-management path.
- `VERIFIED`: hard deletion is intentionally limited to users with no tenant membership and no tenant ownership, preventing accidental destruction/orphaning of restaurant business data.
- `VERIFIED`: deleting an account does not provide a route to delete an existing restaurant workspace.

## Customer states

| State | Customer can | Customer cannot |
|---|---|---|
| No request | Create/sign in to an account | Create a restaurant workspace or enter Studio |
| Request pending | Sign in and view status | Create a tenant or operate Studio |
| Approved | Use the registration link with the matching email | Bypass the approval requirement with an unrelated account |
| Provisioned | Enter Studio and complete setup; sign in with approved email or phone | Use the onboarding token again |
| Frozen | Remains recorded for platform administration | Sign in while the account is banned |
| Rejected | Contact the platform owner for review | Create a tenant through self-service onboarding |

## Plan and theme policy

- `VERIFIED`: plan/theme selections from the public request remain request context; this task does not silently convert them into entitlements or tenant theme configuration.
- `PROPOSED`: commercial plan assignment and theme provisioning should become explicit handoff steps after the customer lifecycle policy is accepted, rather than being inferred from lead metadata.

## Email verification

- `UNKNOWN`: production email-verification delivery is not currently established in the repository evidence.
- `PROPOSED`: require verified email ownership before commercial handoff once a transactional email provider and verification UX are implemented. Better Auth supports `requireEmailVerification`, but its documentation requires a verification-email delivery function when that policy is enabled.

## Security rationale

The policy uses server-side/database enforcement rather than relying on the `/onboarding` UI. Platform Owner account actions also use server-side authorization and Better Auth's standard ban/session semantics. This follows the repository security contract and the OWASP default-deny/server-side authorization guidance.

## Verification boundary

- Contract tests cover the policy, email binding, phone login, Platform Owner controls, Studio gate, and removal of self-service tenant creation from `/onboarding`.
- Database migration behavior must be exercised by the repository migration/build gates before merge.
- Real authenticated browser verification should cover: new unapproved account → `/studio` → approval gate; approved link + matching email → tenant creation; approved link + different email → denial; existing owner → unchanged Studio access; approved phone → phone sign-in; frozen account → sign-in denial; protected Platform Owner → cannot be deleted/frozen.
- Production deployment remains outside this task and was not performed.
