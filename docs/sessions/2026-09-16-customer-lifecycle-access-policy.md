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

## Verification plan
- `npm run typecheck`
- `npm test`
- `npm run test:platform`
- `npm run lint`
- `npm run build`
- `npm run check:auth`
- migration/schema contract checks
- Git diff review
- GitHub Actions quality gates
- Browser verification of `/login`, `/onboarding`, `/admin`, `/admin/onboarding`, and `/admin/users` where CI evidence supports it.

## Current evidence
- PR: `#152`, `OPEN / DRAFT / UNMERGED`.
- Branch: `customer-lifecycle-access-policy`.
- Latest branch commit: `30dfa87fbb6d1ffc00d65fa574f28952a63438f6`.
- Previous W9 browser workflow attempt failed at `npm install` because an intermediate package edit requested an unavailable Radix Tooltip version; that dependency was restored to the branch's original version before the latest CI run.
- Latest Quality and W9 workflow runs are currently in progress for the corrected branch head.
- Vercel status reports `failure` with `build-rate-limit`; no manual Vercel action was performed and no production deployment was requested.

## Deployment
- No Vercel action or production deployment performed.

## Continuity
- `PROJECT_STATE.md`, `PLAN.md`, and `TASKS.md` still require a safe reconciliation after final CI evidence; they were not rewritten blindly because their full historical content was not safely available through the current repository tool response.
- Physical real-device QA remains a release-stage gate.

## Exact next task
Finish the current GitHub quality runs. If all required gates pass, review the final diff and mark PR #152 ready for review without merging or deploying unless separately authorized.
