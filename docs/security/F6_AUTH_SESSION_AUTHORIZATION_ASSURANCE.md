# F6.1 — Auth, Session & Authorization Assurance

**Status:** SOURCE-TRACED SECURITY REVIEW — documentation-only; no remediation applied.  
**Review date:** 2026-11-04  
**Repository:** `Midosd249/Menu_V3`  
**Verified main baseline:** `fbfe745fc76fd5674fbff2e2524272c8a2269839` (F5.7 squash merge / PR #426).  
**Review branch:** `docs/f6-1-auth-session-authorization-assurance`

## 1. Scope, boundaries and evidence rules

F6.1 maps the current repository implementation for authentication, sessions, middleware, tenant/branch authorization, Platform Admin, critical operations, database/RLS boundaries and existing regression coverage.

This is a source and test review. No production runtime, customer records, secrets, database state, migrations, or deployment were modified or queried as part of this review. The source tree and existing committed architecture records are the evidence base.

Use these labels precisely:

- **VERIFIED** — directly supported by source, migration, test or cited repository evidence at the baseline SHA.
- **INFERRED** — reasoned implication of verified implementation, not a demonstrated runtime exploit.
- **PROPOSED** — remediation or verification recommendation, not implemented.
- **UNKNOWN** — evidence does not establish the behavior or current environment state.
- **BLOCKED** — a required verification depends on a separate authorization, runtime, platform or test environment.

The review does not certify Production security or claim exhaustive coverage of every server function. The existing API inventory explicitly says a generated AST inventory and exhaustive call-site authorization map remain unknown.

## 2. Executive result

**F6.1 result: SECURITY ASSURANCE INCOMPLETE — inconsistent active-membership predicates are verified in several critical handlers; actual reachability of inactive rows through current in-product flows is UNKNOWN. A separate test-first remediation is recommended.**

### Findings summary

| ID | Severity | Status | Finding |
|---|---|---|---|
| F6.1-AUTH-01 | MEDIUM / CONDITIONAL | VERIFIED predicate inconsistency; runtime reachability UNKNOWN | Order and product option/metadata handlers omit `tenant_members.is_active` in some membership lookups. Order status transitions also call `authorizeMutation` only for the initial `new → confirmed` path. |
| F6.1-AUTH-02 | MEDIUM | VERIFIED configuration / INFERRED impact | Better Auth cookie cache is enabled for 300 seconds. This creates a potential stale-session/revocation window for operations that rely on cached session resolution; exact runtime behavior was not exercised. |
| F6.1-AUTH-03 | HIGH | UNKNOWN | Effective PostgreSQL login role used by the application is not established. RLS-enabled tables and catalog policies cannot be treated as proven runtime tenant isolation without that principal. |
| F6.1-AUTH-04 | HIGH | DEFERRED / OPEN — existing F5.3 | `saveBranch` may continue branch-hours writes after a tenant-scoped branch update affects zero rows. F6.1 reconfirms the source shape; it does not close or remediate F5.3. |
| F6.1-AUTH-05 | MEDIUM | UNKNOWN | Better Auth sets `useSecureCookies: false` while also specifying `defaultCookieAttributes.secure: true` and `__Host-` cookie names. Actual response cookie attributes need runtime evidence. |
| F6.1-AUTH-06 | LOW / DESIGN CAVEAT | VERIFIED | Membership lookup without a tenant selector chooses the earliest active membership. Callers must not assume this means the currently selected workspace when multiple active memberships exist. |
| F6.1-AUTH-07 | MEDIUM / CONDITIONAL | VERIFIED helper behavior; exploitability UNKNOWN | `canAccessBranch` returns true immediately for owner/admin without checking that the supplied branch belongs to the membership tenant. Callers must independently tenant-bind the branch resource. |

No severity above is a claim that an external attacker has exploited the path. F6.1-AUTH-01 is a verified source-level predicate inconsistency; current in-product reachability of inactive membership rows, runtime exploitability and any affected data are UNKNOWN.

## 3. Verified authentication architecture

### 3.1 Better Auth configuration

**VERIFIED**

- Better Auth is configured in `src/lib/auth/server.ts`; the installed dependency declaration is `better-auth: ~1.6.30` in `package.json`.
- The configuration uses a server-side database adapter and the configured `baseURL`, `secret`, and `trustedOrigins`.
- OAuth account linking is enabled and restricts trusted providers to the configured Grok providers plus `GATE_PROVIDER_ID`; OAuth tokens are configured for encryption.
- Email/password is enabled in the configuration, requires email verification, disables automatic sign-in after registration, sets password-reset token expiry to 3600 seconds, and enables session revocation on password reset.
- Email verification expiry is explicitly 3600 seconds. Verification and reset email callbacks delegate to the server-side email module.
- The auth plugin list includes Gate identity sessions, Better Auth admin, phone-number plugin, configured OAuth provider plugin when available, bearer auth, and TanStack Start cookie integration.
- The phone-number plugin's `sendOTP` callback is a no-op; SMS OTP delivery is not established by this code.
- `verify.server.ts` refuses the shared development identity when a real database URL is configured and authentication is disabled, except for the explicit CI-only test database flag.

**Source references**

- `src/lib/auth/server.ts:163-178` — Better Auth, account linking and 300-second cookie cache.
- `src/lib/auth/server.ts:179-196` — email verification configuration.
- `src/lib/auth/server.ts:234-274` — email/password and cookie/plugin configuration.
- `src/lib/auth/verify.server.ts:7-31,45-74` — real database detection, fail-closed configuration and verified session identity.
- `src/routes/api/auth/$.ts` — Better Auth catch-all API route; GET/POST are delegated to `auth.handler(request)`.
- `package.json` — Better Auth dependency declaration and test registration.

### 3.2 Signup, login, email verification and OAuth

**VERIFIED**

- Email/password registration and login are implemented through Better Auth client/server configuration.
- Email verification is required before an email/password account is treated as verified for the configured flow.
- Password reset is configured to revoke sessions.
- The application has login, forgot-password, reset-password and verify-email routes.
- OAuth provider availability depends on environment configuration; source includes Google OAuth and a separate Gate/broker identity integration.
- Account deletion is enabled through Better Auth, but `beforeDelete` rejects self-service deletion when the user still has tenant membership or owns a tenant.
- Team invitation acceptance separately requires the authenticated user's stored email to be verified and to match the invitation email.

**UNKNOWN**

- Current Production provider environment values and provider-side configuration were not inspected.
- Real email delivery, OAuth callbacks, email verification and password reset were not exercised in a live browser during F6.1.
- The complete end-to-end callback/verification sequence is not covered by the current architecture inventory.

## 4. Session lifecycle and identity boundaries

### 4.1 Standard session

**VERIFIED**

- `getSessionUser` resolves the request's Better Auth session using server request headers and returns the verified session user ID.
- The middleware's client hook forwards the live-preview bearer token; the server hook calls `requireUserId` and places the verified ID in `context.userId`.
- Authenticated server functions use this context rather than treating a client-supplied user ID as authority.
- The configured session cookie name is `__Host-grok-auth.session_token`.
- Better Auth cookie caching is enabled with `maxAge: 300`.
- The source does not explicitly set `session.expiresIn` or `session.updateAge`; their effective values therefore depend on the installed Better Auth version/defaults.
- Password reset is configured to revoke sessions. Platform user ban deletes the target user's session rows in `src/lib/menu/platform-users.ts`.

**INFERRED / RISK**

- A 300-second cookie cache can allow session data to be reused without a fresh database lookup during the cache window, depending on Better Auth's cache validation/invalidation behavior. Sensitive revocation actions (such as account freeze) need an explicit freshness requirement and runtime test. F6.1 did not prove that a revoked session remains usable for the full 300 seconds.
- Because session lifetime is not explicitly configured in source, the effective expiry/refresh policy should be recorded against the installed version and tested rather than assumed from generic defaults.

### 4.2 Gate identity and preview bearer sessions

**VERIFIED**

- `src/lib/auth/gate-identity.server.ts` accepts the `x-grok-identity` header only when Gate identity is enabled and the project ID is configured.
- Gate JWT verification restricts the algorithm to EdDSA, checks issuer and audience, requires `sub`, `iat`, and `exp`, and sets a maximum token age of 10 minutes.
- Gate signing keys are selected from Ed25519 JWKS and cached in memory for five minutes.
- Gate identity is linked to the Better Auth account by provider ID and external subject; the custom session hook checks that an existing session is bound to the same Gate identity.
- The Gate session hook handles identity switching by deleting a stale session before creating a new Gate-backed session, emits the signed session cookie, expires the old session-data cache cookie, and injects the new cookie into the current request.
- In live preview, the browser stores the bearer token in `sessionStorage` and the auth client forwards it in the `Authorization: Bearer` header.
- The Gate marker cookie is deliberately readable by client JavaScript; it is a UI marker, not the session credential.

**INFERRED / RISK**

- A bearer token in `sessionStorage` is accessible to same-origin JavaScript. The preview flow therefore relies on the application's XSS defenses and on the broker token/session lifetime. This is a preview-specific boundary and must not be generalized to Production cookie authentication.
- Full browser evidence for identity switching, popup messaging, cookie delivery, and partitioned-cookie behavior was not collected during F6.1.

### 4.3 Cookie and request security

**VERIFIED**

- The normal session cookie uses a `__Host-` prefix; configured default attributes specify `secure: true`, `sameSite: "lax"`, and `path: "/"`.
- `advanced.useSecureCookies` is explicitly set to `false` in the same Better Auth configuration.
- The custom Gate cookie emission code explicitly sets `Secure`, `HttpOnly` for the session credential, `SameSite=Lax`, and `Path=/`; the Gate marker is intentionally not HttpOnly.
- `authMiddleware` calls `assertSameSiteRequest` before resolving the user ID.
- The same-site guard rejects cross-site/sibling scripted requests and allows same-origin requests, non-browser requests without Fetch Metadata, and top-level GET navigations.
- Better Auth's `trustedOrigins` and the `__Host-` session cookie are additional configured boundaries.

**UNKNOWN**

- Actual `Set-Cookie` headers for Production and Preview were not captured. The `useSecureCookies: false` / `secure: true` configuration combination must be checked against the installed Better Auth version and observed response headers.
- Trusted-origin values and Production proxy/header behavior were not independently inspected in the live platform.
- The Fetch Metadata guard intentionally allows requests without `Sec-Fetch-Site`; this supports server-to-server/SSR traffic but is not itself authentication. All such routes still require the verified session middleware.

## 5. Middleware and server-side identity derivation

**VERIFIED request chain**

1. TanStack server function is invoked.
2. The `authMiddleware` client hook forwards the preview bearer token when present.
3. The server hook dynamically imports server-only isolation and verification modules.
4. `assertSameSiteRequest()` rejects scripted cross-site/sibling requests.
5. `requireUserId(context.bearerToken)` resolves the Better Auth session.
6. The verified `userId` is written into server function context.
7. Domain authorization separately loads tenant membership, role and branch scope.
8. The handler scopes resource queries and mutations to the verified membership/resource context.

**Source references**

- `src/lib/auth/middleware.ts:28-47`
- `src/lib/auth/isolation.server.ts:11-23,33-52`
- `src/lib/auth/verify.server.ts:45-74`
- `src/lib/auth/server.ts:163-178,264-284`

**Security invariant:** a client-provided user, tenant, branch, owner, role or entitlement value is never a substitute for the server-derived identity and independently verified resource scope.

## 6. Authorization model

### 6.1 Tenant membership and roles

**VERIFIED**

- `getMembership` queries `tenant_members` using the verified user ID and `is_active = true`.
- If a tenant ID is supplied, membership is bound to that tenant. If omitted, the function selects the earliest active membership ordered by `created_at, tenant_id`.
- Canonical `access_role` values map to the compatibility roles owner, admin, editor and staff.
- The permission matrix is explicit:
  - owner: menu, settings, team, orders and analytics permissions.
  - admin: menu, settings, orders and analytics; no team-write permission.
  - editor: menu read/write only.
  - staff: menu read only.
- `authorizeMutation` composes active membership lookup, role permission check and optional branch access.
- `requireTenantResource` binds a resource ID to the supplied tenant ID for the supported table allowlist.

**Source references**

- `src/lib/auth/authorization.server.ts:23-59,91-107`
- `src/lib/auth/permissions.ts:1-35`
- `src/lib/menu/types.ts` — role mapping.

**DESIGN CAVEAT — VERIFIED**

When callers omit tenant ID, the authorization helper chooses the earliest active membership. This is deterministic, but it is not proof that the result matches a currently selected tenant in the UI. Callers that support multiple active tenant memberships should pass an explicit tenant selector and let the server validate it.

### 6.2 Branch access

**VERIFIED**

- Owner/admin are treated as tenant-wide branch roles.
- Editors/staff require a branch ID in the stored `branchScope` or a matching `member_branch_access` association.
- The SQL fallback checks the branch's tenant against the membership tenant and binds the assignment row to the same tenant and user.
- The `member_branch_access` table has tenant/user/branch keys and foreign keys to tenant and branch records.
- Table QR management does a second explicit active-branch lookup scoped by both `branchId` and `tenantId`.

**CONDITIONAL HELPER RISK**

`canAccessBranch` returns true immediately for owner/admin before querying whether the branch exists or belongs to `membership.tenantId`. Therefore, a successful `authorizeMutation(..., { tenantId, branchId })` result alone is not sufficient proof that an owner/admin-supplied branch ID belongs to that tenant. Each caller must tenant-bind the branch in its resource query or perform an explicit ownership lookup. No exploit was demonstrated in F6.1.

**Source references**

- `src/lib/auth/authorization.server.ts:61-95`
- `src/lib/menu/table-qr-management.ts:12-20`

### 6.3 Platform Admin

**VERIFIED**

- Platform Admin is separate from tenant membership.
- `requirePlatformAdmin(userId)` first queries `menu_v3.is_platform_admin(userId)`.
- If the durable database predicate is false, it checks server environment allowlists `PLATFORM_ADMIN_USER_IDS` and `PLATFORM_ADMIN_EMAILS` against the stored user record.
- If neither path grants access, it throws `PLATFORM_ADMIN_REQUIRED`.
- The allowlist values are normalized in `platform-admin-config.ts`; the client does not provide the role or privilege.
- Platform server-function modules use `authMiddleware` and invoke the Platform Admin guard before privileged operations.

**UNKNOWN**

- Current Production allowlist values were not inspected and must not be copied into repository documents or chat.
- The database login role's ability to execute the durable predicate is not independently verified in this task.
- `platform-admin.server.test.ts` tests only environment allowlist normalization; it does not integration-test the database predicate or a live denied request.

**Source references**

- `src/lib/auth/platform-admin.server.ts:6-19`
- `src/lib/auth/platform-admin-config.ts`
- `src/lib/menu/platform.ts`
- `src/lib/menu/platform-subscriptions.ts`
- `src/lib/menu/platform-billing.ts`
- `src/lib/menu/platform-users.ts`
- `src/lib/menu/admin.ts`

## 7. Critical operation authorization matrix

This is a source-traced representative matrix, not an exhaustive generated inventory of every exported server function.

| Critical operation | Authentication boundary | Authorization/resource boundary | F6.1 assessment |
|---|---|---|---|
| Tenant/workspace read | `authMiddleware` | Active membership; optional explicit tenant ID is validated against membership; queries use resolved tenant ID. | **VERIFIED** in `owner.ts`; multi-membership selector behavior remains a design caveat. |
| Workspace creation | `authMiddleware` | Server uses `context.userId` as owner identity; checks for existing active membership before creating tenant, owner membership and main branch. | **VERIFIED** source flow; transaction/runtime behavior not fully assessed here. |
| Tenant profile/settings mutation | `authMiddleware` | Active membership plus owner/admin role; tenant update uses membership tenant ID. | **VERIFIED** representative path. |
| Branch create/update | `authMiddleware` | Active membership plus owner/admin settings role; branch update predicate includes both branch ID and membership tenant ID. | **F5.3 OPEN RISK:** subsequent branch-hours writes use branch ID without checking update affected-row count or revalidating ownership. |
| Branch delete/read hours | `authMiddleware` | Active membership and tenant-bound branch lookup for read; delete predicate includes tenant ID. | **VERIFIED** representative path; no exhaustive branch operation audit. |
| Category/product mutations | `authMiddleware` | Active membership, menu-write role, and tenant predicates on resource reads/writes. | **VERIFIED** representative paths in `owner.ts`. |
| Branch menu ordering | `authMiddleware` | Active membership, menu-write role, branch tenant predicate and explicit assignment for non-owner/admin. | **VERIFIED** representative path in `owner.ts`. |
| Product variants, modifier options and product metadata | `authMiddleware` | Product/resource queries are tenant-bound, but `options.ts` and `product-metadata.ts` resolve membership without `is_active = true`. | **MEDIUM / CONDITIONAL:** inactive membership rows would still pass these handlers; current in-product deactivation path UNKNOWN. |
| Modifier group listing | `authMiddleware` | First membership row is selected without `is_active = true`; result is tenant-scoped. | **MEDIUM / CONDITIONAL:** inactive membership row can still read group metadata. |
| Team member role/branch management | `authMiddleware` | `authorizeMutation(team.write)`, owner-only guard, target member bound to resolved tenant, branch IDs checked against same tenant. | **VERIFIED** representative paths in `team.ts`; tenant is selected by earliest membership when not passed. |
| Team invitation create/revoke/list | `authMiddleware` | `authorizeMutation(team.write)`, owner-only guard, tenant-bound invitation query; token is hashed. | **VERIFIED** source. |
| Team invitation acceptance | `authMiddleware` | Verified session email must match; invitation is locked and consumed in a transaction; membership is created for invitation tenant. | **VERIFIED** source and source-contract tests. |
| Subscription plan/entitlement reads | Depends on calling server function | Tenant ID must be derived from authorized context; subscription helper itself is a data helper, not a complete auth boundary. | **PARTIAL / CALLER REVIEW REQUIRED.** |
| Platform subscription/account/invoice mutations | `authMiddleware` | `requirePlatformAdmin`; tenant ID is a resource selector, not privilege; subscription mutations use transaction/lock/audit patterns. | **VERIFIED** representative source paths. |
| Orders dashboard read | `authMiddleware` | Tenant IDs are selected from owner identity or owner/admin membership; query scopes orders to those IDs. Membership predicate omits `is_active`. | **MEDIUM / CONDITIONAL finding F6.1-AUTH-01.** |
| Order status mutation | `authMiddleware` | Initial order check accepts owner identity or owner/admin membership but omits `is_active`. `orders.write` is checked only for `new → confirmed`, not all later transitions. | **MEDIUM / CONDITIONAL finding F6.1-AUTH-01.** |
| Platform Admin dashboard/users/subscriptions | `authMiddleware` | Durable Platform Admin predicate plus configured server allowlist fallback. | **VERIFIED** representative source paths. |
| Public menu read/public order submission | Intentionally public; not staff-authenticated | Public slug/publish predicates; order payload validation, server-loaded prices and server-resolved anonymous/QR context. | **VERIFIED** architecture/source references; separate from staff authorization. |

### 7.1 Active-membership predicate inconsistency — F6.1-AUTH-01

**VERIFIED source evidence**

- `src/lib/menu/orders.ts:27-40`: `getClientTenantIds` includes tenant owner rows and any owner/admin membership, without `tm.is_active = true`.
- `src/lib/menu/orders.ts:42-60`: `assertOrderAccess` uses tenant ownership or owner/admin membership, also without `is_active = true`.
- `src/lib/menu/orders.ts:177-211`: `updateOrderStatus` calls `authorizeMutation(context.userId, "orders.write", ...)` only inside the `isNewConfirmation` branch.
- `src/lib/menu/orders.ts:213-255`: subsequent permitted status transitions execute the update/audit CTE after that conditional branch; no second authorization check appears in this handler.
- `tests/w9-orders.test.mjs`: the current source-contract test verifies that the initial confirmation path calls `authorizeMutation` and derives tenant/branch from the order row. It does not assert that every status transition requires active membership and `orders.write`.

**Impact**

The order predicates and the product option/metadata membership helpers can authorize a user based on a retained membership row even when `is_active = false`. In the order handler, the shared `orders.write` authorization helper is called only for the initial `new → confirmed` transition. In `options.ts`, the same membership helper is used by product-variant and modifier-group/option operations; `product-metadata.ts` also resolves membership without checking `is_active`; `option-groups.ts` does so for modifier-group reads. These are source-level inconsistencies. However, the current team-removal handler deletes the membership row rather than setting `is_active = false`, and no in-product write that deactivates a tenant membership was found in the inspected source. Therefore, whether an inactive row is currently reachable through a supported product workflow is UNKNOWN. If such a row exists (for example through an external administrative/data operation or a future soft-deactivation path), these handlers do not enforce its inactive state.

The tenant-owner identity path is separate: `tenants.owner_user_id = userId` intentionally grants owner access in the current code and requires a separately reviewed ownership-transfer/deactivation policy if that identity is expected to be revocable through membership state.

**Status:** MEDIUM / CONDITIONAL — verified source inconsistency; current in-product reachability of inactive membership rows and any actual unauthorized access are UNKNOWN.  
**Required next work:** a separately scoped, test-first authorization remediation. Require active membership in every affected order/options/metadata membership lookup; apply `orders.write` consistently to every status transition; derive tenant/branch from the order row; preserve row locking and audit events; and add regression coverage for inactive rows, deleted memberships, unauthorized roles and cross-tenant selectors. Do not implement that remediation inside this documentation task.

## 8. F5.3 relationship — branch-hours side-effect path

**VERIFIED source evidence**

- `src/lib/menu/owner.ts:555-601`: `saveBranch` authenticates, loads active membership, checks settings role, then updates an existing branch using `where id = branchId and tenant_id = member.tenant_id`.
- The update does not return an affected-row indicator or stop when no row matches.
- `src/lib/menu/owner.ts:613-620`: if hours are supplied, the handler deletes `branch_hours` by `branch_id` alone and inserts new rows using the same supplied/retained branch ID.
- The later branch-hours path does not independently verify branch ownership against `member.tenant_id`.

**Assessment**

This confirms the previously documented source shape behind F5.3. It does not establish that an attacker can reach the path in a real runtime, nor that any cross-tenant data was modified. It does not weaken the prior risk. F5.3 remains:

**DEFERRED BY OWNER — OPEN RISK — NOT REMEDIATED — NOT ACCEPTED AS SAFE.**

No F5.3 implementation or test changes are included in F6.1. Any remediation must be separately authorized and test-first.

## 9. Database and RLS boundaries

**VERIFIED repository evidence**

- The custom application schema is `menu_v3`; the app uses the shared PostgreSQL/PGlite adapter in `src/lib/db.ts`.
- The roles/permissions migration creates `tenant_members.access_role`, `branch_scope`, `is_active`, and `platform_admins`, plus server-oriented security-definer predicates.
- The branch-scope migration creates `member_branch_access`, foreign keys to tenants/branches, RLS enablement and a `can_access_branch` function.
- The recorded 2026-11-02 catalog snapshot in `docs/architecture/DATABASE.md` says 47/47 `menu_v3` tables had RLS enabled, zero had FORCE RLS, seven restrictive deny policies targeted server-only tables, and 40 tables had no policies.
- The same snapshot says `anon`, `authenticated`, and `service_role` lacked direct table grants and schema USAGE in the inspected result; `postgres` had broad privileges and bypassed RLS; `service_role` also had BYPASSRLS.
- The actual login role used by the deployed application's PostgreSQL pool was not established in that snapshot.

**UNKNOWN — critical**

The application's effective database principal remains unknown. RLS enabled without a policy is default-deny only for roles subject to RLS; table grants, schema privileges, table ownership and BYPASSRLS are separate. Therefore, this review does not claim that the current RLS catalog snapshot independently enforces tenant isolation for the application's actual database connection.

**Security boundary**

The application currently relies materially on server-side identity derivation, active membership checks, role checks, tenant predicates and branch predicates. These checks must remain intact regardless of RLS status. Do not modify grants, policies, database roles, schema exposure or connection configuration as part of F6.1.

**Migration references**

- `migrations/20260903003000_branch_scope_authorization.sql`
- `migrations/20260903008000_roles_permissions_foundation.sql`
- `migrations/20260922080000_harden_server_only_rls_tables.sql`

No migration was executed.

## 10. Existing regression tests and coverage gaps

### 10.1 Tests found and registered

**VERIFIED**

- `src/lib/auth/authorization.server.test.ts` — role permissions, role mapping, owner/admin branch helper and fail-closed helper behavior.
- `src/lib/auth/permissions.test.ts` — role permission matrix and pure branch-scope helper.
- `src/lib/auth/platform-admin.server.test.ts` — configured user-ID/email allowlist normalization only.
- `src/lib/auth/gate-identity.test.ts` — Gate identity token/key/claim and identity-binding behavior (registered in `package.json`).
- `tests/auth-email-flow.test.mjs` — source-contract checks for email verification, password reset/session revocation configuration and linked-account deletion protection.
- `tests/team-invitations.test.mjs` — source-contract checks for verified-email invitation acceptance, transaction/row lock and tenant membership handoff.
- `tests/w9-orders.test.mjs` — source-contract checks for order confirmation scope, preparation duration, locking and audit persistence.
- `scripts/security-boundary.test.mjs` — static source checks for auth middleware in selected modules, Platform Admin guard and client-visible secret-name exclusions.
- `package.json` registers the listed auth tests and `scripts/security-boundary.test.mjs` in the repository test suite.

### 10.2 Missing or insufficient coverage

**VERIFIED gaps in the inspected tests**

1. No test was found that proves every order status transition requires active membership and `orders.write`.
2. No regression case was found for a retained inactive membership row attempting to access orders, product options, modifier groups or product metadata.
3. The current team-removal flow deletes membership rows; no in-product `is_active = false` transition was found. Tests should nevertheless protect the invariant if soft deactivation is introduced or inactive rows are restored administratively.
4. The authorization helper tests do not integration-test SQL membership lookup, tenant mismatch, branch mismatch, or actual `member_branch_access` lookup.
5. The Platform Admin test covers environment allowlist normalization, not the database-backed predicate or full server-function denial behavior.
6. The static auth-middleware scan explicitly samples `owner.ts` and `admin.ts`; it is not a complete generated inventory of every server function in every module.
7. The architecture docs themselves identify the exhaustive AST/call-site inventory as UNKNOWN.
8. No test found in this pass captures actual Production `Set-Cookie` headers or proves Secure/HttpOnly/SameSite/path behavior across Production and Preview.
9. No end-to-end test found in this pass proves that a revoked session is rejected immediately when cookie caching is enabled.
10. No test found in this pass proves the effective PostgreSQL connection principal and its actual RLS/BYPASSRLS behavior.

These are coverage gaps, not evidence that no related tests exist anywhere beyond the inspected/registered files. The current source inventory remains non-exhaustive.

## 11. External research basis

External sources below are authoritative guidance, not evidence that Menuun implements a control.

- Better Auth — [Session Management](https://better-auth.com/docs/concepts/session-management): session lifecycle, expiry/refresh, cookie cache and revocation concepts.
- Better Auth — [Security Reference](https://better-auth.com/docs/reference/security): password hashing, session revocation and CSRF/origin safeguards.
- Better Auth — [Cookies](https://better-auth.com/docs/concepts/cookies): cookie prefixes, Secure attributes, custom cookie attributes and cross-subdomain considerations.
- OWASP — [Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html): deny by default, least privilege and per-request authorization.
- OWASP — [Session Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html): session identifiers, lifecycle, renewal and invalidation.
- PostgreSQL — [Row Security Policies](https://www.postgresql.org/docs/current/ddl-rowsecurity.html): grants, policy evaluation, default-deny, table owner and BYPASSRLS behavior.
- Supabase — [Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security): RLS plus grants, exposed schemas and service-role boundaries.

## 12. Recommended remediation and verification priorities

### P0 — separately authorize order authorization remediation

**PROPOSED / NEXT TASK**

- Enforce active membership in `orders.ts`, `options.ts`, `option-groups.ts` and `product-metadata.ts`; enforce `orders.write` on every order status transition, not only initial confirmation.
- Decide and explicitly encode whether the tenant owner identity remains authoritative after membership deactivation; do not leave that policy implicit.
- Keep tenant/branch identity derived from the selected order row.
- Preserve the existing row lock, compare-and-set behavior, status transition rules and audit event insertion.
- Add adversarial tests for retained inactive membership rows across orders/options/metadata, deleted membership rows, editor/staff, cross-tenant order IDs and all allowed transition paths.
- Run focused tests, full test suite, typecheck, lint, build, W9 and relevant security/browser checks on the final code head.

### P1 — session freshness and cookie verification

**PROPOSED**

- Determine the intended revocation SLA for account freeze, password reset, sign-out and role/membership changes.
- Test Better Auth cookie-cache behavior for revoked sessions at the installed version.
- If immediate revocation is required, use the supported fresh-session/disable-cache mechanism for sensitive operations or adjust cache policy in a separately scoped change.
- Capture real `Set-Cookie` headers in a controlled Preview test and verify `Secure`, `HttpOnly`, `SameSite`, `Path`, and absence of `Domain` for `__Host-` cookies.
- Make the effective session expiry and refresh settings explicit only after confirming intended product policy.

### P1 — database principal and RLS evidence

**PROPOSED / BLOCKED**

- Obtain safe platform-side evidence of the application's effective PostgreSQL login role without disclosing credentials.
- Verify its schema/table grants, ownership, role memberships and BYPASSRLS attributes.
- Reconcile those facts with the existing RLS catalog snapshot and security-definer function grants.
- Do not change grants, policies or database settings as part of evidence gathering.

### P2 — complete authorization inventory

**PROPOSED**

- Generate a deterministic inventory of exported TanStack server functions and their middleware/authz call sites.
- Review every tenant, branch, menu, product/category, team, subscription, Platform Admin, order and analytics operation.
- For every branch selector, prove branch-to-tenant ownership in the same query or a preceding server-side ownership check.
- Add SQL-backed tests for membership deactivation, tenant mismatch, branch mismatch and role downgrade.
- Keep public menu/order paths explicitly separate from staff authorization.

## 13. F6.1 acceptance and completion boundary

- [x] Reconfirm main baseline and current F5.7 merge SHA.
- [x] Inspect auth configuration, identity verification, middleware, same-site guard and Gate/preview identity paths.
- [x] Inspect tenant membership, permission matrix, branch helper and Platform Admin guard.
- [x] Inspect representative critical operations for workspace, branch, menu, team, subscription, Platform Admin and orders.
- [x] Inspect relevant migrations, RLS architecture record and existing regression tests.
- [x] Research official Better Auth, PostgreSQL, Supabase and OWASP guidance.
- [x] Record source-level findings, evidence gaps and separately scoped remediation priorities.
- [x] Preserve F3 and F5.3 status without reopening or modifying them.
- [x] Exact-head Quality `41729637458` SUCCESS and W9 `41729637474` SUCCESS on `3330ae5391fcadf3eed81494c04738ecfb3a7c87`.
- [x] Final PR diff reviewed; PR #427 merged at `1f0933c6f5008114a7019c70f8742038e544da71`.

**F6.1 STATUS:** DOCUMENTATION COMPLETE AND MERGED — PR #427; merge SHA `1f0933c6f5008114a7019c70f8742038e544da71`.  
**IMPLEMENTATION STATUS:** documentation-only; no application code or database changes.  
**DEPLOYMENT STATUS:** NOT AUTHORIZED / NOT PERFORMED.  
**F3:** DEFERRED BY OWNER — NOT DONE; mandatory pre-commercial gate.  
**F5.3:** DEFERRED BY OWNER — OPEN RISK; not remediated or accepted as safe.

**POST-MERGE EVIDENCE:** no PR-triggered workflow runs were returned for the merge SHA; post-merge CI remains UNKNOWN. GitHub combined status showed a pending Vercel context; this is not deployment evidence. No Production deployment was authorized or performed.

**EXACT NEXT ACTION:** separately authorize and execute the test-first remediation for F6.1-AUTH-01 across order status, product options/modifier groups and product metadata membership checks. Do not begin F6.2 automatically.
