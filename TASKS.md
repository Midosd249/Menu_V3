# TASKS

## Current Atomic Task
### Authentication — Legacy credential reconciliation — BLOCKED
- **Objective:** restore existing customer/owner sign-in safely while keeping Better Auth authoritative.
- **Evidence:** Supabase currently contains two legacy Auth identities and the isolated Menu V3 Better Auth schema contains two corresponding email identities with different user IDs. Better Auth credential accounts use native scrypt hashes; Supabase Auth uses bcrypt.
- **Completed safely:** login email input is normalized with `trim().toLowerCase()`.
- **Blocked:** a transparent password migration cannot be completed without a secure user-driven verification/upgrade mechanism. No plaintext password or password hash is exposed, copied, guessed, or changed by this task.

## Planned Theme Sequence
1. Theme 1 — Essential — DONE / VERIFIED / MERGED.
2. Theme 2 — Editorial — DONE / VERIFIED / MERGED.
3. Theme 3 — Noir — DONE / VERIFIED / MERGED.
4. Theme 4 — Heritage — TODO after authentication is closed.
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

## Notes
- **VERIFIED:** current subscription plans are `free`, `starter`, and `pro`.
- **VERIFIED:** Vercel project `menu-v3` is linked to `Midosd249/Menu_V3`.
- **BLOCKED:** Vercel deployment remains constrained by the Hobby build-rate limit.
- **UNKNOWN:** current production deployment after the latest main changes.
