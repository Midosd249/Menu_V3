# Menu V3 — Active Plan

## Status
- Status: IN_PROGRESS.
- Repository: `Midosd249/Menu_V3`.
- Source of truth: `main`.
- Premium Theme System is DONE / VERIFIED / MERGED.
- Theme 1 Essential is DONE / VERIFIED / MERGED.
- Theme 2 Editorial is DONE / VERIFIED / MERGED.
- Theme 3 Noir is DONE / VERIFIED / MERGED.
- Authentication legacy credential reconciliation is DONE / VERIFIED.
- Existing G1–G7.2 completed work remains protected.

## Current Atomic Task
### Deployment verification — blocked by Vercel build-rate limit

**Objective:** expose the corrected `main` build in Vercel and verify existing customer/owner email-password access against the reconciled Better Auth credentials.

### Root-cause evidence
1. The deployed authentication bridge returned HTTP 401 during sign-in.
2. Vercel runtime logs for the latest production deployment recorded `function crypt(unknown, unknown) does not exist`.
3. The connected Supabase production database has `pgcrypto` installed as `extensions.crypt(text,text)` rather than an unqualified `public.crypt` function.
4. The application database connection intentionally sets a restricted search path, so the unqualified function lookup fails in Vercel.
5. The smallest compatible correction is to qualify the existing function as `extensions.crypt(...)`.

### Implementation
- **VERIFIED:** `src/lib/auth/server.ts` now calls `extensions.crypt($1, $2)` for migrated bcrypt credentials.
- **VERIFIED:** native Better Auth scrypt verification remains unchanged.
- **VERIFIED:** no new dependency, auth architecture, user identity, tenant membership, or database data migration was introduced.
- **VERIFIED:** a direct production SQL check confirms `extensions.crypt`/`extensions.gen_salt` are executable.
- **VERIFIED:** corrected commit: `48d9f0dd4edb538b28af5a15653a42b9b18136a5`.

### Deployment evidence
- **VERIFIED:** the previous production deployment `dpl_398MghMyWmts2a6VDeVf9TgS8uVH` was built from the pre-correction main commit and contains the failing unqualified call.
- **BLOCKED:** the corrected commit currently has a Vercel status failure pointing to the Hobby `build-rate-limit` restriction.
- **UNKNOWN:** live authentication result from the corrected commit until Vercel creates a fresh deployment.

### Acceptance criteria
1. Fresh Vercel deployment uses the corrected `main` commit.
2. Existing legitimate customer/owner credentials can sign in through Better Auth.
3. Better Auth remains the authoritative application session system.
4. No plaintext passwords, password hashes, service credentials, or Supabase auth internals are exposed to the browser.
5. Tenant ownership and membership IDs remain stable.
6. Existing Theme 1–3 behavior remains unchanged.

## Theme Sequence
- Theme 1 — Essential — DONE / VERIFIED / MERGED.
- Theme 2 — Editorial — DONE / VERIFIED / MERGED.
- Theme 3 — Noir — DONE / VERIFIED / MERGED.
- Theme 4 — Heritage — TODO after deployment/access verification.
- Theme 5 — Gallery — TODO.
- G7.3 — Premium Theme Commercialization & Billing UX — TODO after the visual sequence.

## Deployment
- **VERIFIED:** Vercel project `menu-v3` is linked to `Midosd249/Menu_V3`.
- **BLOCKED:** current Vercel GitHub deployment status is blocked by the Hobby build-rate limit.
- **UNKNOWN:** production deployment of corrected `main` until the rate limit clears.

## Stop condition
Do not begin Theme 4 until the corrected deployment is available and authentication access has been verified. After that, resume the sequence with Theme 4 — Heritage.
