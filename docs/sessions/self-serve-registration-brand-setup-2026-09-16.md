# Self-Serve Registration → Brand Setup → Studio Handoff — 2026-09-16

## Status

- **VERIFIED:** Implementation and the blocking self-serve grant hardening fix are complete on `feat/self-serve-registration-current`.
- **VERIFIED:** Branch remains 0 commits behind `main`.
- **VERIFIED:** No merge into `main` was performed.
- **VERIFIED:** No Vercel deployment was performed.
- **VERIFIED:** No production account or production data was created or mutated.

## Scope

Only the following atomic scope was implemented and hardened:

`Self-Serve Registration → Brand Setup → Studio handoff`

Explicitly excluded: menu creation, billing/pricing, paid trials, AI, logo upload, subscription entitlement changes, merge, and deployment.

## Security model

1. The existing Customer Lifecycle tenant approval guard remains in place for the legacy approval path.
2. A self-serve registration grant is issued server-side by the successful Better Auth email-signup hook only.
3. The phone persistence server action does not create or refresh the grant.
4. Workspace creation requires an authenticated user, a normalized Saudi phone on the account, and an unused grant.
5. The self-serve grant is now consumed by one conditional `UPDATE ... WHERE used_at is null RETURNING user_id` inside the tenant insert trigger.
6. The affected-row result is authoritative: one returned row permits the tenant insert; zero rows with an existing grant fails with `SELF_SERVE_GRANT_ALREADY_USED` rather than falling through to the self-serve path.
7. PostgreSQL row locking on the conditional update serializes concurrent consumers of the same primary-key grant. A losing concurrent request therefore cannot create a second tenant.
8. Tenant, owner membership, primary branch, and branch hours are created inside one database function, so a failed workspace creation rolls back the complete workspace transaction.
9. The grant table remains inaccessible to public client roles, and the workspace function remains inaccessible to `public`, `anon`, and `authenticated`.

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

## Blocking issue and fix

The review identified a concurrency race in the original grant trigger: two requests could both observe the grant as unused before either `UPDATE` completed, and the second request did not verify that its update actually changed a row.

A forward-only migration, `20260916080000_self_serve_registration_grant_atomic_consumption.sql`, redefines only the existing tenant approval trigger function. It performs the eligibility check and consumption as one conditional row update and rejects a second consumer safely. No prior migration was rewritten or deleted.

## Verification evidence

GitHub Actions Quality run `35055032555` for code head commit `76e32c18fbd850316325d21046a2f1a99e509045` completed successfully.

Verified successful gates:

- route generation and committed route tree check
- `npm run typecheck`
- `npm test`: 294 tests, 294 passed, 0 failed
- targeted concurrency regression executed against the CI PostgreSQL 16 service
- W7.4–W7.10 contract tests
- `npm run lint`
- `npm run build`
- Playwright runtime and Chromium installation
- browser template QA
- Studio/Home/Menu/Growth/Customers responsive browser QA
- Platform Admin/responsive browser QA
- browser diagnostics/performance artifact steps

Targeted regression evidence:

- `self-serve grant authorizes exactly one concurrent workspace creation` — passed
- `self-serve grant hardening uses an affected-row-checked conditional update` — passed
- concurrency test observed exactly one successful workspace, one rejected concurrent request, one consumed grant, one tenant, one membership, one branch, and seven branch-hours rows
- repeated post-consumption attempt failed without changing workspace state

The test uses an isolated temporary PostgreSQL schema and never targets production. When run locally without an explicit `SELF_SERVE_CONCURRENCY_TEST_DATABASE_URL`, the integration test is skipped; CI provides an isolated PostgreSQL 16 service and therefore executed the real concurrent database test.

## Remaining limits

- **UNKNOWN:** Real external production signup/brand creation against the live Vercel/Supabase deployment was not performed because this milestone explicitly excludes deployment and production mutation.
- **UNKNOWN:** Real-device physical QA of the new signup flow remains outside this branch verification run.
- **VERIFIED:** No subscription pricing or commercial entitlement files were changed.
