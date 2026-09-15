# Session — Customer Lifecycle & Access Policy — 2026-09-16

## Request
Audit and complete the new-customer lifecycle so direct account registration cannot create or enter a restaurant workspace before Platform Owner approval.

## Classification
- Authentication / authorization / tenant provisioning / commercial onboarding.
- Research depth: `Deep`.

## Verified starting position
- `main`: `bf28f56d0422fb03aff7b24dc9c50dd28cc9dcce` before this task.
- Existing code supported both approved lead onboarding and direct self-service tenant creation.
- `/login` allowed account sign-up and then routed to `/studio`.
- `/studio` redirected an authenticated user without a tenant to `/onboarding`.
- `/onboarding` could create a tenant directly through `createRestaurant`.

## Work completed
- Added a database-level tenant creation guard requiring an active, approved, non-expired, non-revoked onboarding record matching the owner email.
- Bound approved onboarding activation to the service-request email.
- Converted `/onboarding` into an approval-status gate; it no longer creates tenants or seeds menu data.
- Added customer access-status server evidence and contract coverage.
- Added the canonical lifecycle/access policy document.

## Security decision
The approval requirement is enforced in the database as well as the UI. Existing tenants are not retroactively changed.

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

## Deployment
- No Vercel action or production deployment performed.

## Remaining evidence
- Current continuity core files require reconciliation to this session after CI evidence is available.
- Physical real-device QA remains a release-stage gate.

## Exact next task
Run the focused and full repository quality gates on the completed branch, review the diff, then prepare the single PR for the customer lifecycle policy if all gates pass.
