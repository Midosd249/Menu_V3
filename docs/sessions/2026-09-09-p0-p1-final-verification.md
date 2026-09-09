# Menu V3 — P0/P1 Final Verification

**Date:** 2026-09-09
**Branch:** `codex/p0-p1-production-hardening`
**PR:** #46
**Supabase:** `ublxptcqefujkbeepylc`

## VERIFIED — P0

- Legacy SECURITY DEFINER RPCs identified by the audit now have `anon=false` and `authenticated=false` execution privileges on the canonical Supabase project.
- The live database contains `menu_v3.public_order_rate_limits` and `menu_v3.public_order_idempotency`.
- Public order code enforces a database-backed six-attempt / ten-minute rate window per tenant/branch/normalized-phone token.
- Public order replay protection uses a deterministic request fingerprint and a ten-minute idempotency reservation.
- Existing server-side product, availability, variant, modifier, quantity, note, tenant and price validation remains intact.
- A fresh-schema failure was found during Browser QA because the legacy-RPC reconciliation migration assumed those functions existed in PGlite. The migration was corrected to guard every `REVOKE`/`ALTER FUNCTION` with `to_regprocedure(...) is not null`.
- After that correction, GitHub Actions Quality run **1169** passed all steps, including Typecheck, 184 tests, Lint, Production build, Browser template QA for all themes, and the performance baseline step.

## VERIFIED — P1

- Continuity documentation is preserved in repository session files.
- Existing dependency manifest was intentionally preserved after a provisional `npm ci` gate failed against the existing lockfile; no speculative dependency upgrade was merged because the current quality workflow remains green and theme regressions must not be introduced for housekeeping.
- The package-lock reconciliation remains a controlled follow-up requiring a writable npm environment capable of regenerating the lockfile and then re-running the complete quality gate.

## BLOCKED / MANUAL

- `main` branch protection/ruleset remains unconfigured. The available GitHub connector can read protection state but cannot write branch-protection settings. Owner action is required in GitHub repository settings.
- No production deployment was triggered by this hardening branch.
- No merge to `main` was performed.

## Protected

No visual/theme redesign was made. Essential, Editorial, Noir, Heritage/Taste, Gallery, Quick Add, Item Notes, Cart, and the canonical public/preview renderer remain protected.

## Next atomic release action

1. Owner enables `main` required status checks/branch protection.
2. Review PR #46 diff.
3. Merge only after the owner accepts the remaining P1 lockfile housekeeping status.
4. Follow the release-only Vercel workflow for one production deployment.
5. Perform real-device Android + QR + Studio/Owner QA.
