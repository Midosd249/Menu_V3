# Menu V3 — P0/P1 Production Hardening

**Date:** 2026-09-09
**Branch:** `codex/p0-p1-production-hardening`
**Base:** current `main` at audit baseline `d4c50d1b774ee1cb16c7cda2dff0c8b410d97a8c`
**Mode:** implementation + verification preparation; theme work protected.

## Scope completed

### P0 — Security and public ordering

1. **Legacy SECURITY DEFINER RPC reconciliation**
   - Live Supabase project: `ublxptcqefujkbeepylc`
   - Revoked `anon`/`authenticated` execution on the six legacy SECURITY DEFINER functions identified by the final audit.
   - Normalized their SECURITY DEFINER `search_path` to `public, pg_temp`.
   - Direct client grants on `menu_v3` remain absent; the audit confirmed no `anon`, `authenticated`, or `public` table grants in `menu_v3`.
   - This intentionally preserves the current Menu V3 server-side authorization boundary rather than introducing a second public data plane.

2. **Public order abuse controls**
   - Added database-backed 10-minute rate windows keyed by tenant + branch + normalized customer-phone hash.
   - Hard limit: 6 accepted attempts per window.
   - The key is SHA-256 hashed server-side; raw phone numbers are not stored in the limiter table.
   - Added deterministic request fingerprinting for replay protection.
   - Added a database-backed idempotency reservation table with a 10-minute replay window.
   - Replayed completed requests return the original order result instead of creating another order.
   - Concurrent duplicate reservations fail closed with a temporary retry message.
   - Existing server-side tenant/product/variant/modifier/availability/price validation remains unchanged.

3. **Regression contract**
   - Added `tests/public-order-hardening.test.mjs` covering rate limiting, idempotency, and RPC grant revocation.

## P1 — Reliability and release hygiene

1. **Dependency manifest reconciliation**
   - Updated `package.json` to match the authoritative root dependency declarations already present in `package-lock.json`.
   - Added missing root dev dependencies represented by the lockfile, including Playwright and TypeScript.
   - Updated Radix versions to the lockfile's declared ranges.

2. **Deterministic dependency verification**
   - Added `.github/workflows/dependency-lock.yml` using `npm ci --ignore-scripts --no-audit --no-fund`.
   - This gives the repository an explicit lockfile integrity gate independent of the existing quality workflow.

3. **Branch protection**
   - **BLOCKED:** the available GitHub connector exposes branch protection as read-only; it cannot create/update repository rulesets/protection.
   - Current state must remain recorded as `main` unprotected until the owner enables required checks in GitHub settings.

## Protected work

Do not reopen or redesign the five canonical themes during this hardening milestone:
- Essential
- Editorial
- Noir
- Heritage / Taste
- Gallery

Also protected: Quick Add, Item Notes, Cart, public renderer/preview convergence, and existing visual recovery layers.

## Verification status

- Supabase migration execution: **VERIFIED** successful for RPC grant reconciliation and abuse-control schema.
- GitHub implementation: **VERIFIED** committed on this branch.
- Local typecheck/lint/test/build: **BLOCKED** in the current connector environment because the repository shell cannot access GitHub/npm registry; the GitHub Actions gates are the required executable verification path.
- Production deployment: **NOT REQUESTED / NOT PERFORMED**.
- Main branch merge: **NOT PERFORMED**.

## Remaining exact action

1. Let GitHub Actions run on this branch and inspect both `Menu V3 Quality` and `Menu V3 Dependency Lock`.
2. If green, review the branch diff once.
3. Merge to `main` only after the owner has confirmed the P1 branch-protection decision.
4. Run the production release workflow only through the established release-only Vercel path.
5. Perform real Android + QR + owner-device QA before declaring production readiness.
