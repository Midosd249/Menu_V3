# R9 Guest Relationships — 2026-09-13

## Classification
R9 completion batch: Guest CRM, Loyalty foundation, Campaign foundation, Feedback/Reviews foundation, and Retention intelligence.

## Status
- VERIFIED: R9 retention foundation is already merged in main.
- VERIFIED: this batch adds the remaining relationship data structures and the owner-facing relationship surface.
- VERIFIED: all relationship tables are tenant/branch scoped and protected by PostgreSQL RLS.
- VERIFIED: application reads are server-authorized for owner/admin roles.
- VERIFIED: no autonomous outbound messaging, rewards, pricing changes, predictive claims, or ordering changes were introduced.
- VERIFIED: R7 remains independently active and requires real exposure evidence.
- VERIFIED: R10 is intentionally deferred.

## R9 model
- `guest_profiles`: pseudonymous guest identity and observed order history.
- `guest_loyalty_accounts`: owner-controlled loyalty balance and tier foundation.
- `guest_loyalty_ledger`: auditable point changes with optional order linkage.
- `guest_campaigns`: draft/approval-ready campaign records; delivery remains manual.
- `guest_feedback`: rating/comment records with review lifecycle states.
- `retention-intelligence.ts`: deterministic server-side retention and relationship overview.
- `/studio/guests`: owner-facing R9 relationship surface.

## Guardrails
The database remains the source of truth. Guest relationship intelligence does not infer identity from client-supplied tenant or role data. Campaign records do not send messages. Loyalty records do not autonomously award rewards. Feedback is not treated as verified sentiment beyond the stored rating/comment evidence.

## Verification plan
- GitHub Actions quality workflow must pass route generation, typecheck, tests, lint, production build, and browser/performance QA.
- Review the final diff before merge.
- Production deployment remains a separate release-only step and must not be triggered as an iteration loop.
