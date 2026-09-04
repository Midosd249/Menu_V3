# PROJECT_STATE

## Identity
- Status: IN_PROGRESS.
- Repository: `Midosd249/Menu_V3`.
- Source of truth: `main`.
- Current main HEAD: `99891cdc94a0b2f289e7a9d6ff138fb9c25d519f`.
- Product: Menu V3, Arabic-first bilingual multi-tenant digital-menu SaaS for restaurants and cafes.

## Current Position
- G1–G7.2 completed work remains protected.
- **Premium Theme System — DONE / VERIFIED / MERGED.**
- **Theme 1 — Essential — DONE / VERIFIED / MERGED.**
- **Theme 2 — Editorial — DONE / VERIFIED / MERGED.**
- **Theme 3 — Noir — DONE / VERIFIED / MERGED.**
- Theme refinement sequence remains active: Theme 1 → Theme 2 → Theme 3 → Theme 4 → Theme 5.

## Theme 3 Result
- **VERIFIED:** `src/theme-noir.css` is an isolated cinematic fine-dining art direction.
- **VERIFIED:** `src/routes/__root.tsx` loads the Noir stylesheet without changing route behavior.
- **VERIFIED:** the implementation is presentation-only and preserves existing menu, ordering, analytics, SEO, tenant isolation and entitlement contracts.
- **VERIFIED:** cinematic hero, layered charcoal surfaces, warm bronze lighting, refined category rail, immersive media treatment, premium product cards, forms, focus states and reduced-motion safeguards are included.
- **VERIFIED:** Theme 3 PR #11 merged to `main` as `1dffaf79a64f4a3bd75cc04e96574901ec791796`.
- **VERIFIED:** CI run #473 passed the full Theme 3 quality workflow.

## Authentication Diagnosis
- **VERIFIED:** production Supabase project contains 2 Better Auth users and 2 Supabase Auth users.
- **VERIFIED:** the two identity stores contain matching email addresses, but their user IDs are distinct.
- **VERIFIED:** the application tenant membership is keyed to Better Auth identity, not Supabase Auth identity.
- **VERIFIED:** Better Auth credential accounts use Better Auth's native scrypt-style password hashes; Supabase Auth stores bcrypt hashes.
- **INFERRED:** the reported invalid-email/password behavior is consistent with the legacy Supabase credentials not being synchronized with the newer Better Auth credential accounts. This is not safely fixable by guessing or replacing passwords.
- **VERIFIED:** login now normalizes email input with `trim().toLowerCase()` before authentication.
- **BLOCKED:** automatic password migration was not shipped because it would require a secure legacy-password verification/upgrade path and must not expose, copy, or guess user credentials.

## Verification State
- **VERIFIED:** GitHub Actions run #476 for current `main` completed successfully: route-tree generation, typecheck, tests, lint, production build, Chromium installation, all-theme browser QA, performance baseline and cleanup.

## Deployment State
- **VERIFIED:** Vercel project `menu-v3` is linked to `Midosd249/Menu_V3`.
- **VERIFIED:** Theme 1 and Theme 2 preview deployments were READY.
- **BLOCKED:** Vercel production deployment remains constrained by the Hobby build-rate limit.
- **UNKNOWN:** production deployment of current `main` until the Vercel rate limit is cleared.

## Session Log
- 2026-09-04 — Theme 3 Noir refinement completed and merged.
- 2026-09-04 — CI run #473 verified Theme 3; current `main` quality run #476 also passed all checks.
- 2026-09-04 — Investigated reported login failure against the connected Supabase database and identified a dual identity store with distinct user IDs and password-hash systems.
- 2026-09-04 — Applied safe email normalization in the login form; no credentials were exposed or changed.

## Exact Next Task
Implement a secure, user-driven credential reconciliation path for the legacy Supabase accounts without exposing or guessing passwords, then begin Theme 4 — Heritage only after the authentication task is closed.
