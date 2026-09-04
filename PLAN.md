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
### Deployment verification — awaiting refreshed Vercel deployment

**Objective:** expose the current `main` build in Vercel and verify existing customer/owner email-password access against the reconciled Better Auth credentials.

### Evidence
1. The connected Supabase project contains two Better Auth users and two Supabase Auth users with matching emails but distinct user IDs.
2. Real tenant membership remains keyed to the Better Auth identity.
3. Better Auth now verifies both native scrypt hashes and migrated Supabase bcrypt hashes through PostgreSQL `pgcrypto`.
4. Exactly two existing Better Auth credential accounts were synchronized from their matching Supabase Auth bcrypt hashes.
5. The login form normalizes email input before authentication.
6. CI run #480 passed the authentication implementation and run #481 passed the resulting state documentation.

### Acceptance criteria
1. Fresh Vercel deployment uses the current `main` commit.
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

## Theme 3 Verification
- **VERIFIED:** isolated `src/theme-noir.css` provides the complete Noir art direction.
- **VERIFIED:** responsive, accessibility and reduced-motion safeguards are included.
- **VERIFIED:** GitHub Actions run #473 passed the full Theme 3 quality workflow.
- **VERIFIED:** later main quality runs passed typecheck, tests, lint, production build, browser QA and performance baseline.

## Authentication Verification
- **VERIFIED:** PostgreSQL `pgcrypto` is enabled.
- **VERIFIED:** exactly two credential accounts were migrated to the matching Supabase bcrypt hashes.
- **VERIFIED:** Better Auth supports both migrated bcrypt and native scrypt verification.
- **VERIFIED:** no plaintext password or credential secret was logged or committed.

## Deployment
- **VERIFIED:** Vercel project `menu-v3` is linked to `Midosd249/Menu_V3`.
- **BLOCKED:** Vercel production deployment may still be constrained by the Hobby build-rate limit.
- **UNKNOWN:** production deployment of the latest `main` until the rate limit is cleared.

## Stop condition
Do not begin Theme 4 until the refreshed deployment is available and authentication access has been verified. After that, resume the sequence with Theme 4 — Heritage.
