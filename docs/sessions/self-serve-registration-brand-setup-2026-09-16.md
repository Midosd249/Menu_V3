# Self-Serve Registration → Brand Setup → Studio Handoff — 2026-09-16

## Status

- **VERIFIED:** Implementation is complete on `feat/self-serve-registration-current`.
- **VERIFIED:** Branch is 0 commits behind `main` and 16 commits ahead at the time of review.
- **VERIFIED:** No merge into `main` was performed.
- **VERIFIED:** No Vercel deployment was performed.

## Scope

Only the atomic milestone below was implemented:

`Self-Serve Registration → Brand Setup → Studio handoff`

Explicitly excluded: menu creation, billing/pricing, paid trials, AI, logo upload, subscription entitlement changes, merge, and deployment.

## Security model

1. The existing Customer Lifecycle tenant approval guard remains in place for the legacy approval path.
2. A self-serve registration grant is issued server-side by the successful Better Auth email-signup hook only.
3. The phone persistence server action does not create or refresh the grant.
4. Workspace creation requires an authenticated user, a normalized Saudi phone on the account, and an unused grant.
5. Tenant insertion consumes the grant through the existing database trigger.
6. Tenant, owner membership, primary branch, and branch hours are created inside one database function so grant consumption and workspace creation are atomic.
7. Database execution privileges for the new workspace function are not exposed to public client roles.

## Product flow

1. Landing `ابدأ مجانًا` opens `/login?mode=signup`.
2. Registration collects full name, email, Saudi phone, password, and confirmation.
3. SMS OTP is not used.
4. Phone is normalized and persisted server-side with duplicate prevention.
5. Successful registration routes to `/onboarding?new=1`.
6. Brand setup requires brand name and business type; English name and short description are optional.
7. Business type is restricted to `restaurant`, `cafe`, `bakery`, `dessert`, `food_truck`, or `other`.
8. Workspace creation creates the primary branch and branch hours.
9. Successful creation hands the user to Studio.
10. Existing non-self-serve onboarding continues to use the approval lifecycle.

## Verification evidence

GitHub Actions Quality run `35053746179` for head commit `44644f89107118328a77ed3b141ef99f6df184a1` completed successfully.

Verified successful gates:

- route generation and committed route tree check
- typecheck
- npm tests: 292 tests, 292 passed, 0 failed in the successful run
- W7.4–W7.10 contract tests
- lint
- production build
- Playwright runtime and Chromium installation
- browser template QA
- Studio/Home/Menu/Growth/Customers responsive browser QA
- Platform Admin/responsive browser QA
- browser diagnostics/performance artifact steps

A prior CI attempt failed first on a TypeScript narrowing issue and then on an overly specific contract assertion; both were fixed and the final Quality run passed.

## Remaining limits

- **UNKNOWN:** Real external production signup/brand creation against the live Vercel/Supabase deployment was not performed because this milestone explicitly excludes deployment and production mutation.
- **UNKNOWN:** Real-device physical QA of the new signup flow remains outside this branch verification run.
- **VERIFIED:** No subscription pricing or commercial entitlement files were changed.
