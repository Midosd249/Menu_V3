# PROJECT_STATE

## Identity
- Status: IN_PROGRESS.
- Repository: `Midosd249/Menu_V3`.
- Source of truth: `main`.
- Current main HEAD: `c9bb54276267bfb99675a4c5be2f34d955a3844b`.
- Product: Menu V3, Arabic-first bilingual multi-tenant digital-menu SaaS for restaurants and cafes.

## Current Position
- G1–G7.2 completed work remains protected.
- **Premium Theme System — DONE / VERIFIED / MERGED.**
- **Theme 1 — Essential — DONE / VERIFIED / MERGED.**
- **Theme 2 — Editorial — DONE / VERIFIED / MERGED.**
- **Theme 3 — Noir — DONE / VERIFIED / MERGED.**
- Authentication reconciliation is now implemented and database-migrated.
- Theme refinement sequence remains active: Theme 1 → Theme 2 → Theme 3 → Theme 4 → Theme 5.

## Theme 3 Result
- **VERIFIED:** `src/theme-noir.css` is an isolated cinematic fine-dining art direction.
- **VERIFIED:** `src/routes/__root.tsx` loads the Noir stylesheet without changing route behavior.
- **VERIFIED:** the implementation is presentation-only and preserves existing menu, ordering, analytics, SEO, tenant isolation and entitlement contracts.
- **VERIFIED:** cinematic hero, layered charcoal surfaces, warm bronze lighting, refined category rail, immersive media treatment, premium product cards, forms, focus states and reduced-motion safeguards are included.
- **VERIFIED:** Theme 3 PR #11 merged to `main` as `1dffaf79a64f4a3bd75cc04e96574901ec791796`.
- **VERIFIED:** CI run #473 passed the full Theme 3 quality workflow.

## Authentication Reconciliation
- **VERIFIED:** production Supabase project contains two Better Auth users and two Supabase Auth users.
- **VERIFIED:** the stores contain matching email addresses while their user IDs are distinct.
- **VERIFIED:** application tenant membership is keyed to Better Auth identity.
- **VERIFIED:** Better Auth native credentials use scrypt; the legacy Supabase Auth credentials use bcrypt.
- **VERIFIED:** `src/routes/login.tsx` normalizes email input with `trim().toLowerCase()`.
- **VERIFIED:** Better Auth now accepts native scrypt credentials and migrated Supabase bcrypt credentials through a dedicated verification path using PostgreSQL `pgcrypto`.
- **VERIFIED:** the two existing credential accounts in `menu_v3.account` were synchronized from their matching Supabase Auth bcrypt hashes without exposing plaintext passwords.
- **VERIFIED:** the database now reports two credential accounts with bcrypt-format migrated hashes.
- **VERIFIED:** no plaintext password, password value, or secret was written to the repository or session log.
- **INFERRED:** users who enter the same passwords previously stored in Supabase Auth can now authenticate through the Better Auth session layer while retaining the existing Better Auth user IDs and tenant memberships.

## Verification State
- **VERIFIED:** GitHub Actions run #480 for commit `c9bb54276267bfb99675a4c5be2f34d955a3844b` completed successfully: route-tree generation, typecheck, tests, lint, production build, Chromium installation, all-theme browser QA, performance baseline and cleanup.
- **VERIFIED:** Supabase migration affected exactly the two existing Better Auth credential accounts and copied only bcrypt hashes matched by normalized email.

## Deployment State
- **VERIFIED:** Vercel project `menu-v3` is linked to `Midosd249/Menu_V3`.
- **VERIFIED:** Theme 1, Theme 2, and Theme 3 are present in the GitHub `main` source used by Vercel.
- **BLOCKED:** Vercel production deployment may still be constrained by the Hobby build-rate limit.
- **UNKNOWN:** production deployment of the latest authentication reconciliation commit until Vercel accepts a fresh build.

## Session Log
- 2026-09-04 — Theme 3 Noir refinement completed and merged.
- 2026-09-04 — CI verified Theme 3 and the current `main` quality workflow.
- 2026-09-04 — Investigated reported login failure and identified a dual identity store with distinct user IDs and password-hash systems.
- 2026-09-04 — Applied safe email normalization in the login form.
- 2026-09-04 — Added a secure Better Auth password verifier that supports migrated Supabase bcrypt hashes through PostgreSQL `pgcrypto` while retaining native scrypt verification for new accounts.
- 2026-09-04 — Synchronized the two existing credential account hashes from Supabase Auth into the matching Better Auth accounts; plaintext credentials were never accessed or logged.

## Exact Next Task
Proceed to Theme 4 — Heritage only after the user confirms access to the refreshed deployment. If Vercel remains rate-limited, the user can trigger the deployment manually from Vercel using the current `main` commit.
