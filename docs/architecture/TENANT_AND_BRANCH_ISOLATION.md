# Tenant and Branch Isolation

**Status:** F1 source + live catalog baseline — 2026-11-02  
**Baseline SHA:** `e5d7c89a73718f35e7accbae7933af36c366bbc1`

## Isolation model
1. Authenticated identity is resolved server-side by Better Auth/session verification.
2. Active tenant membership is queried using verified user ID.
3. Role permissions are checked in server code.
4. Branch-scoped actions validate membership branch scope or an explicit `member_branch_access` association.
5. Resource queries must bind resource ID to tenant ID and, where relevant, branch ID.
6. Public tenant discovery uses a public slug and published/active predicates; a slug is not an authenticated credential.

## Source evidence
- `src/lib/auth/middleware.ts`: session identity and same-site guard.
- `src/lib/auth/authorization.server.ts`: `getMembership`, `canAccessBranch`, `requireBranchAccess`, `authorizeMutation`, `requireTenantResource`.
- `src/lib/auth/permissions.ts`: role-to-permission matrix.
- `src/lib/menu/table-qr-management.ts`: authenticated settings permission plus tenant/branch active check.
- `src/lib/menu/table-qr.ts`: opaque QR token is hashed and resolved server-side; token validity checks table/branch/tenant state.
- `src/lib/menu/order-public.ts`: validates public order payload and resolves table context from QR token on the server.

## Public vs authenticated paths
| Path | Trust basis | Required invariant |
|---|---|---|
| Public menu read | Tenant slug + active/published state; branch slug where applicable | Only published public menu data is returned |
| Public order | Validated public input + server-loaded product/option/offer data | Client never supplies authoritative prices or trusted tenant/table IDs |
| Table QR order | Opaque token resolved to stored hash and active table/branch/tenant | Server derives table/branch/tenant context; request cannot select another table |
| Studio mutation | Verified session + active membership + role permission + optional branch scope | Requested tenant/branch must be proven against membership |
| Platform admin | Verified session + durable admin predicate/configured fallback | Tenant membership alone does not confer platform privilege |

## Live database catalog facts
- 47/47 `menu_v3` tables have RLS enabled.
- 7 restrictive deny policies target `anon` and `authenticated` on server-sensitive tables.
- 40 tables have no RLS policy.
- No table grants or schema USAGE were found for `anon`, `authenticated`, or `service_role` in the inspected schema.
- The deployed application's PostgreSQL login role was not established. `postgres` has broad grants and bypasses RLS; `service_role` also has bypassrls. Neither should be assumed to be the app's actual connection identity.

## Risks and required follow-up
- **HIGH / UNKNOWN:** Confirm the effective application database principal using safe platform-side metadata that does not reveal connection strings or secrets. Then assess least privilege and blast radius.
- **HIGH / OPEN:** Build a route/server-function authorization coverage matrix. Current source samples do not prove every mutation has the right middleware and tenant predicates.
- **MEDIUM:** Add adversarial cross-tenant and cross-branch tests for every critical mutation/read path; preserve existing tests and avoid generic policy rewrites.
- **RULE:** No RLS, grants, schema exposure, role, or connection-string change is authorized by this F1 documentation task.

## Regression invariants
- Never trust client-supplied user, tenant, branch, role, privilege, subscription, price, or table ID as authority.
- Never use a tenant slug or QR token as proof of authenticated staff access.
- Preserve public menu behavior and cache/session attribution boundaries.
- Keep privileged database credentials server-only.
