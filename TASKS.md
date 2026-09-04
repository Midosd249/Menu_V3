# TASKS

## Current Atomic Task
### Deployment verification — blocked by Vercel build-rate limit
- **Objective:** verify the refreshed production/preview deployment exposes the completed Theme 1–3 work and the repaired legacy email/password authentication.
- **Root cause found:** the deployed authentication bridge called unqualified `crypt(...)`, but production uses Supabase's `pgcrypto` extension in the `extensions` schema while the application connection search path is limited to the application schema/public. Vercel logs showed `function crypt(unknown, unknown) does not exist` and the sign-in returned HTTP 401.
- **Completed:** the verifier now calls `extensions.crypt($1, $2)`, matching the actual production extension schema, with no dependency or architecture change.
- **Database verification:** `extensions.crypt` and `extensions.gen_salt` execute successfully in the connected production Supabase project.
- **Verification:** the failing Vercel runtime log was directly reproduced from deployment `dpl_398MghMyWmts2a6VDeVf9TgS8uVH`; the corrected commit is `48d9f0dd4edb538b28af5a15653a42b9b18136a5`.
- **Current blocker:** Vercel's GitHub deployment status for the corrected commit is `failure` with the `build-rate-limit` upgrade target, so no fresh deployment has yet been produced from the corrected commit.
- **User action:** once the Vercel Hobby build-rate limit clears, trigger/allow a fresh deployment from `main`, then test the existing customer/owner credentials.

## Planned Theme Sequence
1. Theme 1 — Essential — DONE / VERIFIED / MERGED.
2. Theme 2 — Editorial — DONE / VERIFIED / MERGED.
3. Theme 3 — Noir — DONE / VERIFIED / MERGED.
4. Theme 4 — Heritage — TODO after refreshed deployment/access verification.
5. Theme 5 — Gallery — TODO.
6. G7.3 — Premium Theme Commercialization & Billing UX — TODO after the visual sequence.

## Completed
### Premium Theme System — 8 → 5 — DONE / VERIFIED / MERGED
- **Catalog:** `essential` (Free), `editorial` (Premium), `noir` (Premium), `heritage` (Premium), `gallery` (Premium).
- **VERIFIED:** five themes only; exactly one Free and four Premium.
- **VERIFIED:** coordinated visual systems include layout rhythm, typography, image treatment, surfaces, geometry, hero composition, hover depth and motion personality.
- **VERIFIED:** Premium preview is available; publishing is server-authorized against the existing subscription model.
- **VERIFIED:** legacy keys normalize and database migration maps existing records before enforcing the five-key catalog.

### Theme 1 — Essential — DONE / VERIFIED / MERGED
- **VERIFIED:** dedicated Free-theme art direction was implemented and isolated from domain/business logic.
- **VERIFIED:** quality workflow passed typecheck, tests, lint, production build, browser QA and performance gates.
- **VERIFIED:** merged as `cdc591bec58eea0f3b0d2985ed7581b4effc9dcb`.

### Theme 2 — Editorial — DONE / VERIFIED / MERGED
- **VERIFIED:** dedicated Premium art direction was implemented and isolated from domain/business logic.
- **VERIFIED:** quality run #465 passed typecheck, tests, lint, production build, all-theme browser QA and performance baseline.
- **VERIFIED:** merged as `fe8b791ec891e1163005d5b2bf23e10b38d90928`.

### Theme 3 — Noir — DONE / VERIFIED / MERGED
- **VERIFIED:** isolated `src/theme-noir.css` added and wired from `src/routes/__root.tsx`.
- **VERIFIED:** implementation is presentation-only and preserves existing route/template/data contracts.
- **VERIFIED:** cinematic hero, layered charcoal surfaces, warm bronze lighting, refined category rail, immersive image treatment, premium product cards and fine-dining signature styling are included.
- **VERIFIED:** responsive, focus-visible and reduced-motion safeguards are included.
- **VERIFIED:** full CI run #473 and current main run #476 passed.

### Authentication — Legacy credential reconciliation — DONE / VERIFIED
- **VERIFIED:** Better Auth accepts native scrypt credentials and migrated Supabase bcrypt credentials.
- **VERIFIED:** PostgreSQL `pgcrypto` is enabled in the production Supabase project under schema `extensions`.
- **VERIFIED:** exactly two existing Better Auth credential accounts were synchronized from their matching Supabase Auth bcrypt hashes.
- **VERIFIED:** tenant membership remains keyed to the original Better Auth user IDs.
- **VERIFIED:** no plaintext password or credential secret was logged or committed.
- **VERIFIED:** the deployed failure was isolated to the unqualified `crypt()` function lookup, not the credential migration itself.

## Notes
- **VERIFIED:** current subscription plans are `free`, `starter`, and `pro`.
- **VERIFIED:** Vercel project `menu-v3` is linked to `Midosd249/Menu_V3`.
- **BLOCKED:** Vercel deployment of the corrected commit is currently blocked by the Hobby build-rate limit.
- **UNKNOWN:** live sign-in behavior of the corrected commit until Vercel produces a fresh deployment.
