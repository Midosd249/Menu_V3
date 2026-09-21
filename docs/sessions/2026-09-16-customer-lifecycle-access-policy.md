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
- Restored the repository's existing `@radix-ui/react-tooltip` dependency version after detecting an unrelated temporary downgrade during verification.
- Added focused contract tests and lifecycle documentation.

## Security decisions
- Approval remains enforced in the database as well as the UI.
- Platform Owner authorization remains the existing `requirePlatformAdmin` contract; client input never supplies privilege.
- Phone approval is explicitly platform-approved, not falsely represented as SMS/OTP verification.
- SMS OTP is not exposed as a production capability until an SMS provider is configured.
- Existing tenants and existing owner memberships are not retroactively changed.
- Restaurant-linked accounts cannot be hard-deleted through the account-management path; freezing is the safe administrative action until a separate ownership-transfer/archive policy exists.

## Verification
- Corrected branch head `f97ce636bd3331247744cd371704b343b0666b0a` passed the final `Menu V3 Quality` run `35037060757` / run `1725`.
- The final Quality workflow passed route generation/freshness, typecheck, repository tests, W7.4–W7.10 contract tests, lint, production build, Playwright runtime/Chromium, public all-theme browser QA, Studio browser QA, Platform Admin browser QA, performance/diagnostics, and cleanup.
- `Menu V3 W9 Orders QA` run `35037060758` / run `26` passed on the corrected branch head.
- The branch's Vercel status briefly reported `build-rate-limit`; no manual Vercel retry or bypass was used.
- After merge, GitHub reported the resulting `main` commit with a successful Vercel status; this is build/status evidence, not proof of a manually triggered Production deployment.

## Pull request / merge
- PR `#152`: merged by squash after final CI passed.
- Branch: `customer-lifecycle-access-policy`.
- Final branch head before merge: `f97ce636bd3331247744cd371704b343b0666b0a`.
- Target before merge: `main` at `bf28f56d0422fb03aff7b24dc9c50dd28cc9dcce`.
- Resulting canonical `main`: `1be08a420058a52e0ded536e46bfe658ad7bbcb3`.

## Deployment
- No manual Vercel deployment was performed.
- Automatic Vercel status for resulting `main` is `success`.
- Production deployment identity remains `UNKNOWN` without direct Vercel Production evidence.

## Continuity
- `PROJECT_STATE.md`, `PLAN.md`, and `TASKS.md` contain older continuity snapshots and require a controlled reconciliation to the new canonical `main` state rather than blind replacement.
- Real-device Android/iOS QA remains a release-stage gate.

## Exact next task
Controlled continuity reconciliation for `PROJECT_STATE.md`, `PLAN.md`, and `TASKS.md`, then release-stage real-device QA when explicitly authorized. Do not manually deploy Vercel unless separately authorized.
