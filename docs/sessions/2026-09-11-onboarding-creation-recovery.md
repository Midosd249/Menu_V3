# Session — 2026-09-11 — Onboarding Creation Recovery

## Request
Fix the production onboarding failure shown on the final onboarding step and make the onboarding wording suitable for businesses beyond restaurants, such as cafes and other menu-based establishments.

## Reproduction / Production Evidence
- Production runtime logs for `menu-v3` showed repeated `createRestaurant failed` errors on the onboarding server function.
- Exact PostgreSQL error: duplicate key violation on `tenants_owner_user_id_uidx`.
- The affected authenticated user had one tenant owned by the user but zero active `tenant_members` rows.
- This is a partially-created/orphaned onboarding state: the tenant exists, but the membership write was not completed.

## Root Cause
`createRestaurant` only checked for an active tenant membership before creating a tenant. When a prior request had already inserted the tenant but failed before persisting the membership, the next request did not see an active membership and attempted a second tenant insert. The database correctly rejected it because `tenants_owner_user_id_uidx` permits at most one tenant per owner.

## Fix
- Added `src/lib/menu/onboarding-recovery.ts` with a server-authorized `ensureOwnerMembership` recovery operation.
- Recovery derives the tenant exclusively from `tenants.owner_user_id = context.userId` and restores the canonical `tenant_owner` access role.
- Updated `src/routes/onboarding.tsx` to run the recovery before creation and to recover/retry once after a failed creation instead of surfacing a duplicate-owner failure.
- Newly-created owners are also reconciled to the canonical `tenant_owner` access role before subsequent onboarding writes.
- Changed onboarding presentation from restaurant-specific wording to business-neutral wording (`منشأتك`, `اسم المنشأة`) without changing existing restaurant/menu functionality.

## Security
- No client-supplied tenant ID, role, or privilege is trusted.
- Recovery is authenticated through the existing `authMiddleware`.
- Ownership is established from the server-side `owner_user_id` field.
- No secrets, tokens, RLS, authentication, or authorization boundaries were weakened.

## Regression Coverage
- Added `tests/onboarding-recovery.test.mjs` covering server-authorized owner recovery, one retry after recovery, canonical owner role, and business-neutral onboarding wording.

## Scope
- No theme, public menu, ordering, analytics, approval-center, or Manus-derived infrastructure was changed.
- No dependency was added.

## Next Verification
Run the full repository quality gates, then verify one real onboarding attempt on Production using a suitable new/unused registration flow.
