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

## Customer states

| State | Customer can | Customer cannot |
|---|---|---|
| No request | Create/sign in to an account | Create a restaurant workspace or enter Studio |
| Request pending | Sign in and view status | Create a tenant or operate Studio |
| Approved | Use the registration link with the matching email | Bypass the approval requirement with an unrelated account |
| Provisioned | Enter Studio and complete setup | Use the onboarding token again |
| Rejected | Contact the platform owner for review | Create a tenant through self-service onboarding |

## Plan and theme policy

- `VERIFIED`: plan/theme selections from the public request remain request context; this task does not silently convert them into entitlements or tenant theme configuration.
- `PROPOSED`: commercial plan assignment and theme provisioning should become explicit handoff steps after the customer lifecycle policy is accepted, rather than being inferred from lead metadata.

## Email verification

- `UNKNOWN`: production email-verification delivery is not currently established in the repository evidence.
- `PROPOSED`: require verified email ownership before commercial handoff once a transactional email provider and verification UX are implemented. Better Auth supports `requireEmailVerification`, but its documentation requires a verification-email delivery function when that policy is enabled.

## Security rationale

The policy uses server-side/database enforcement rather than relying on the `/onboarding` UI. This follows the repository security contract and the OWASP default-deny/server-side authorization guidance.

## Verification boundary

- Contract tests cover the policy, email binding, Studio gate, and removal of self-service tenant creation from `/onboarding`.
- Database migration behavior must be exercised by the repository migration/build gates before merge.
- Real authenticated browser verification should cover: new unapproved account → `/studio` → approval gate; approved link + matching email → tenant creation; approved link + different email → denial; existing owner → unchanged Studio access.
- Production deployment remains outside this task and was not performed.
