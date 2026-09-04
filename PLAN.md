# Menu V3 — Active Plan

## Status
- Status: IN_PROGRESS.
- Repository: `Midosd249/Menu_V3`.
- Source of truth: `main`.
- Premium Theme System is DONE / VERIFIED / MERGED.
- Theme 1 Essential is DONE / VERIFIED / MERGED.
- Theme 2 Editorial is DONE / VERIFIED / MERGED.
- Theme 3 Noir is DONE / VERIFIED / MERGED.
- Existing G1–G7.2 completed work remains protected.

## Current Atomic Task
### Authentication — Legacy credential reconciliation — BLOCKED

**Objective:** restore sign-in for existing customer/owner accounts without weakening Better Auth, guessing passwords, exposing password hashes, or changing tenant ownership semantics.

### Evidence
1. The connected Supabase project contains 2 Better Auth users and 2 Supabase Auth users.
2. The two stores have matching email addresses but distinct user IDs.
3. Real tenant membership is keyed to the Better Auth identity.
4. Better Auth credential accounts use its native scrypt password format, while Supabase Auth stores bcrypt hashes.
5. The login form now normalizes email input before authentication.

### Acceptance criteria
1. Existing legitimate customer/owner credentials can be reconciled through a secure user-driven flow.
2. Better Auth remains the authoritative application session system.
3. No plaintext passwords, password hashes, service credentials, or Supabase auth internals are exposed to the browser.
4. Tenant ownership and membership IDs remain stable unless an explicit migration requires otherwise.
5. Authentication tests cover successful reconciliation, wrong-password rejection, and session creation.
6. Existing Theme 1–3 behavior remains unchanged.

## Theme Sequence
- Theme 1 — Essential — DONE / VERIFIED / MERGED.
- Theme 2 — Editorial — DONE / VERIFIED / MERGED.
- Theme 3 — Noir — DONE / VERIFIED / MERGED.
- Theme 4 — Heritage — TODO.
- Theme 5 — Gallery — TODO.
- G7.3 — Premium Theme Commercialization & Billing UX — TODO after the visual sequence.

## Theme 3 Verification
- **VERIFIED:** isolated `src/theme-noir.css` provides the complete Noir art direction.
- **VERIFIED:** responsive, accessibility and reduced-motion safeguards are included.
- **VERIFIED:** GitHub Actions run #473 passed the full Theme 3 quality workflow.
- **VERIFIED:** current main run #476 also passed typecheck, tests, lint, production build, browser QA and performance baseline.

## Deployment
- **VERIFIED:** Vercel project `menu-v3` is linked to `Midosd249/Menu_V3`.
- **BLOCKED:** Vercel production deployment remains constrained by the Hobby build-rate limit.
- **UNKNOWN:** production deployment of the current `main` until the rate limit is cleared.

## Stop condition
Do not begin Theme 4 while the authentication blocker remains unresolved. After authentication is securely reconciled and verified, resume the sequence with Theme 4 — Heritage.
