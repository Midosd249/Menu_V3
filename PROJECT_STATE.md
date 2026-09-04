# PROJECT_STATE

## Identity
- Status: IN_PROGRESS.
- Repository: `Midosd249/Menu_V3`.
- Source of truth: `main`.
- Current main HEAD: `27f7ffb67ea2b265102e39b9319c0c5b76bdd28a`.
- Product: Menu V3, Arabic-first bilingual multi-tenant digital-menu SaaS for restaurants and cafes.

## Current Position
- G1–G7.2 completed work remains protected.
- **Premium Theme System — DONE / VERIFIED / MERGED.**
- **Theme 1 — Essential — DONE / VERIFIED / MERGED.**
- **Theme 2 — Editorial — DONE / VERIFIED / MERGED.**
- **Theme 3 — Noir — DONE / VERIFIED / MERGED.**
- Authentication reconciliation is implemented and database-migrated.
- The first deployed auth bridge had a runtime schema-resolution defect; it has now been corrected.
- Theme refinement sequence remains active: Theme 1 → Theme 2 → Theme 3 → Theme 4 → Theme 5.

## Authentication Reconciliation
- **VERIFIED:** production Supabase project contains two Better Auth users and two Supabase Auth users.
- **VERIFIED:** the stores contain matching email addresses while their user IDs are distinct.
- **VERIFIED:** application tenant membership is keyed to Better Auth identity.
- **VERIFIED:** Better Auth native credentials use scrypt; the legacy Supabase Auth credentials use bcrypt.
- **VERIFIED:** `src/routes/login.tsx` normalizes email input with `trim().toLowerCase()`.
- **VERIFIED:** the two existing credential accounts in `menu_v3.account` were synchronized from their matching Supabase Auth bcrypt hashes without exposing plaintext passwords.
- **VERIFIED:** PostgreSQL `pgcrypto` is installed in the production Supabase project under schema `extensions`.
- **VERIFIED:** the deployed authentication failure was caused by the unqualified `crypt(...)` call not resolving because the Vercel database connection uses a restricted search path.
- **VERIFIED:** `src/lib/auth/server.ts` now calls `extensions.crypt($1, $2)` for migrated bcrypt credentials while native scrypt verification remains unchanged.
- **VERIFIED:** direct production SQL confirms `extensions.crypt` and `extensions.gen_salt` are available.
- **VERIFIED:** corrected implementation commit: `48d9f0dd4edb538b28af5a15653a42b9b18136a5`.
- **UNKNOWN:** successful live sign-in with the corrected deployment until Vercel produces a deployment from the corrected commit.

## Verification State
- **VERIFIED:** previous auth implementation CI passed.
- **VERIFIED:** Vercel runtime logs directly identified the `crypt(unknown, unknown)` error on the deployed auth request.
- **VERIFIED:** production database function lookup confirms the required bcrypt function exists in `extensions`.
- **VERIFIED:** current source contains the schema-qualified correction.

## Deployment State
- **VERIFIED:** Vercel project `menu-v3` is linked to `Midosd249/Menu_V3`.
- **VERIFIED:** the last successful production deployment was `dpl_398MghMyWmts2a6VDeVf9TgS8uVH`, built from commit `8a2afba2ca7511317cf9815942a9eac024528c01` before the latest correction.
- **BLOCKED:** Vercel's current GitHub deployment status for the corrected commit reports the Hobby `build-rate-limit` restriction.
- **UNKNOWN:** production deployment of the corrected authentication code until Vercel accepts a fresh build.

## Session Log
- 2026-09-04 — Investigated the user's failed production login rather than assuming the earlier migration fix was sufficient.
- 2026-09-04 — **VERIFIED:** Vercel runtime log showed HTTP 401 because `crypt(unknown, unknown)` could not be resolved.
- 2026-09-04 — **VERIFIED:** production Supabase exposes `crypt(text,text)` in the `extensions` schema.
- 2026-09-04 — Fixed the verifier to call `extensions.crypt(...)` with the smallest possible code change.
- 2026-09-04 — **VERIFIED:** production SQL can execute the qualified bcrypt functions; no credentials or plaintext passwords were accessed.
- 2026-09-04 — Updated continuity records to preserve the verified root cause and current deployment blocker.

## Exact Next Task
After the Vercel Hobby build-rate limit clears, deploy the current `main` commit and verify existing customer/owner email-password sign-in. Do not begin Theme 4 until live authentication is confirmed.
