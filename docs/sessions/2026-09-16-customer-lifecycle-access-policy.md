# Session — Customer Lifecycle, Phone Login & Platform Owner Controls — 2026-09-16

## Request
Complete the new-customer lifecycle so direct account registration cannot create or enter a restaurant workspace before Platform Owner approval, then add approved phone login and reliable Platform Owner account controls.

## Classification
- Authentication / authorization / tenant provisioning / commercial onboarding / Platform Owner operations.
- Research depth: `Deep`.

## Verified starting position
- `main`: `bf28f56d0422fb03aff7b24dc9c50dd28cc9dcce` before this task.
- Existing code supported both approved lead onboarding and direct self-service tenant creation.
- `/login` allowed account sign-up and then routed to `/studio`.
- `/studio` redirected an authenticated user without a tenant to `/onboarding`.
- `/onboarding` could create a tenant directly through `createRestaurant`.
- Platform Owner already had lead review, approval, registration-link, tenant status, order, and platform dashboard controls, but no dedicated customer-account freeze/delete surface.

## Work completed
- Added a database-level tenant creation guard requiring an active, approved, non-expired, non-revoked onboarding record matching the owner email.
- Bound approved onboarding activation to the service-request email.
- Converted `/onboarding` into an approval-status gate; it no longer creates tenants or seeds menu data.
- Added Better Auth phone-number support for password-based phone sign-in.
- Bound the approved service-request phone to the provisioned customer account in normalized Saudi E.164 form and mark it platform-verified.
- Added `/admin/users` for Platform Owner account listing, phone approval, freeze/unfreeze, and guarded hard deletion.
- Freeze revokes existing sessions; protected Platform Owner accounts cannot be frozen or deleted through the customer-management path.
- Hard deletion is blocked for any account linked to tenant membership or tenant ownership, preserving restaurant data.
- Added focused contract tests and lifecycle documentation.

## Security decisions
- Approval remains enforced in the database as well as the UI.
- Platform Owner authorization remains the existing `requirePlatformAdmin` contract; client input never supplies privilege.
- Phone approval is explicitly platform-approved, not falsely represented as SMS/OTP verification.
- SMS OTP is not exposed as a production capability until an SMS provider is configured.
- Existing tenants and existing owner memberships are not retroactively changed.

## Verification
- Repository contract tests reached `success` on the corrected branch head during the final Quality run.
- Route-generation freshness passed after registering `/admin/users` in `src/routeTree.gen.ts`.
- A previous Quality attempt failed only because a temporary package edit used an unavailable Radix Tooltip version; the branch dependency was restored to its prior version before the corrected run.
- W9 focused browser workflow was rerun against the corrected branch and reached the workflow's browser QA stage; no manual production deployment was performed.
- Full final browser/production evidence remains a CI/release gate and is not represented here as a local browser claim.

## Pull request
- PR `#152`: `OPEN / READY FOR REVIEW / UNMERGED`.
- Branch: `customer-lifecycle-access-policy`.
- Current head: `666cd008781136c192c160163b141e16a70479d0`.
- Target: `main` at `bf28f56d0422fb03aff7b24dc9c50dd28cc9dcce`.
- Merge was not performed because the user did not authorize merging this PR.

## Deployment
- No manual Vercel action or production deployment performed.
- Vercel reported a `build-rate-limit` status during the branch work; this was not manually retried or bypassed.

## Continuity
- `PROJECT_STATE.md`, `PLAN.md`, and `TASKS.md` still require a safe reconciliation after final CI/release evidence; they were not rewritten blindly because their complete historical content was not safely available through the current repository tool response.
- Real-device QA remains a release-stage gate.

## Exact next action
Review PR #152's final CI status and diff. If the user authorizes merge, perform only the required merge, then verify the resulting `main` commit and post-merge quality gates. Do not manually deploy Vercel unless separately authorized.
