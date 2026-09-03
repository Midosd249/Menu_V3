# PLAN

## Rules
- Status: VERIFIED
- `main` is the only source of truth for execution.
- Preserve completed work; use additive changes unless evidence requires otherwise.
- Verify before claiming completion.
- Never mark DONE without evidence.
- Only one task may be IN_PROGRESS.
- First unblocked TODO is the exact next task.
- Keep security and tenant isolation server-side; never trust client tenant/role identifiers.
- Do not add AI, payments, or domain work before the Level 4 foundation is stable.

## Current Milestone
- Status: IN_PROGRESS
- **LEVEL 4 — Client SaaS & Commercial Platform: Authorization Foundation Integration**.
- Repository already contains team invitations, durable role schema, branch-scope schema, onboarding, and subscription-plan foundation. The immediate gap is consistent runtime consumption of the durable authorization model.

## Phases
- Status: VERIFIED / PLANNED
1. **Level 4A — Durable authorization integration** — IN_PROGRESS. Align server authorization, permissions, team management, and invitation acceptance with `access_role` / `branch_scope` while preserving compatibility.
2. **Level 4B — Client account lifecycle and onboarding hardening** — TODO. Verify account-to-tenant lifecycle, onboarding idempotency, tenant selection, and isolation.
3. **Level 4C — Commercial subscription enforcement** — TODO. Connect existing plan data to server-side limits and tenant entitlements without adding payment processing yet.
4. **Level 4D — Service/project workflow foundations and observability** — TODO.
5. **Level 4 Gate** — TODO. Full regression, production verification, security review, and release criteria.

## Decisions
- Status: VERIFIED
- Existing `tenant_members.role` remains for compatibility while `access_role` is the canonical authorization role per `migrations/20260903008000_roles_permissions_foundation.sql`.
- Branch access must fail closed and derive from trusted membership state.
- Existing invitation roles remain limited to admin/editor until the commercial role model is deliberately expanded.
- Research is not currently blocking implementation. Relevant official references for later hardening: PostgreSQL Row-Level Security — https://www.postgresql.org/docs/current/ddl-rowsecurity.html ; PostgreSQL CREATE FUNCTION/security — https://www.postgresql.org/docs/current/sql-createfunction.html ; Supabase Row Level Security — https://supabase.com/docs/guides/database/postgres/row-level-security ; TanStack Start server functions — https://tanstack.com/start/latest/docs/framework/react/guide/server-functions .

## Risks
- Role-model drift between database and application can create privilege escalation or unintended denial of access.
- Legacy `role` writes can leave `access_role` stale.
- Branch scope represented in two systems can diverge.
- Historical production/security-advisor caveats remain outside the immediate task.
- CI for the current commit is not yet evidenced.

## Release Criteria
- All targeted authorization paths use trusted server-side membership state.
- Canonical role and branch-scope fields remain synchronized with legacy compatibility fields where required.
- `staff` is least-privilege and cannot inherit editor/admin permissions accidentally.
- Regression tests pass.
- Typecheck, lint, and production build pass.
- CI status is successful for the release commit.
- No existing Level 0–3 behavior is intentionally regressed.

## Next Task
- Status: TODO / UNBLOCKED
- **Align `src/lib/auth/authorization.server.ts`, `src/lib/auth/permissions.ts`, `src/lib/menu/types.ts`, `src/lib/menu/team.ts`, and `src/lib/menu/team-invitations.ts` with the canonical `access_role` / `branch_scope` model, add focused regression coverage, and verify with typecheck/tests/lint/build.**
