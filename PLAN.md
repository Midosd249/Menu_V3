# PLAN

## Rules
- Status: VERIFIED
- `main` is the only source of truth.
- Preserve completed work and prefer additive changes.
- Verify before claiming completion.
- Never mark DONE without evidence.
- Only one task may be IN_PROGRESS.
- First unblocked TODO is the exact next task.
- Authorization and tenant isolation stay server-side.
- No AI, payments, or domain work before Level 4 foundation is stable.

## Current Milestone
- Status: IN_PROGRESS
- **LEVEL 4 — Client SaaS & Commercial Platform: Authorization Foundation Integration**.
- Existing foundations include onboarding, team invitations, durable roles, branch scope, and subscription plans.

## Phases
- Status: VERIFIED / PLANNED
1. Level 4A — Durable authorization integration — IN_PROGRESS.
2. Level 4B — Client account lifecycle and onboarding hardening — TODO.
3. Level 4C — Subscription entitlement enforcement — TODO.
4. Level 4D — Service/project workflows and observability — TODO.
5. Level 4 Gate — production/security verification — TODO.

## Decisions
- Status: VERIFIED
- `access_role` is the canonical durable role; legacy `role` remains a compatibility field.
- Canonical roles: `tenant_owner`, `branch_manager`, `staff`, `editor`.
- Branch access must fail closed and derive from trusted membership state.
- Existing invitation roles remain admin/editor.
- Official references for future hardening: https://www.postgresql.org/docs/current/ddl-rowsecurity.html ; https://www.postgresql.org/docs/current/sql-createfunction.html ; https://supabase.com/docs/guides/database/postgres/row-level-security ; https://tanstack.com/start/latest/docs/framework/react/guide/server-functions .

## Risks
- Role-model drift can cause privilege escalation or denial of access.
- Legacy and canonical branch-scope representations can diverge.
- Current Vercel status reports a build-rate-limit target, so deployment verification is not equivalent to a code failure.
- Current CI completion is pending.

## Release Criteria
- Server authorization consumes trusted canonical membership state.
- Legacy compatibility fields remain synchronized where mutations require them.
- Staff is least-privilege.
- Focused tests, typecheck, lint, and production build pass.
- CI succeeds for the release commit.
- No Level 0–3 behavior is intentionally regressed.

## Next Task
- Status: TODO / UNBLOCKED
- **After CI verification of the current authorization integration, harden client account lifecycle and tenant onboarding idempotency using the existing `src/routes/onboarding.tsx` and server-side tenant creation flow.**