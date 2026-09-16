# Customer Approval Lifecycle Unification — 2026-09-16

Status: `VERIFIED_LOCALLY / READY_FOR_HUMAN_REVIEW` pending dedicated customer-lifecycle browser coverage review.

## Canonical lifecycle

`Account Registration → Activation Request → Platform Admin Review → Approval/Decision → Workspace Activation → Studio`

## Verified audit findings

- The previous signup hook created `self_serve_registration_grants` immediately after email signup.
- `/onboarding?new=1` bypassed the legacy customer access-status gate and called `createSelfServeWorkspace`.
- The Platform Admin lead/service-request workflow and the self-serve workspace workflow were separate data paths, so a customer could see an approval-style UX without producing an admin-visible activation request.
- The database approval trigger previously accepted the self-serve grant as a tenant-creation authorization path.
- Legacy registration-token activation created tenant/membership/branch/hour rows through application-level sequential statements and did not serialize concurrent activation/approval operations.

## Implemented architecture

- Existing `leads` table is reused as the activation-request record.
- New account-linked fields: `account_user_id`, `brand_name_en`, `business_type`, `activation_status`, `activation_requested_at`, `decision_at`, `decision_by`, `decision_reason`, `activation_tenant_id`.
- `account_user_id` is unique when present.
- Activation states: `pending`, `action_required`, `approved`, `activated`, `rejected`.
- Signup creates only the Better Auth account and stores the Saudi phone; it does not issue workspace authorization.
- `/onboarding` is now the single customer lifecycle surface.
- Platform Admin gets a primary activation-request queue with approve/reject/request-changes actions.
- Approved customers explicitly activate the workspace; activation is atomic and idempotent.
- Concurrent activation retries reuse persisted `activation_tenant_id` and produce exactly one tenant, owner membership, main branch, and seven branch-hours.
- Legacy `/onboarding/:token` remains available only for existing legacy approvals and is now backed by an atomic/idempotent database function.
- Legacy approval/token issuance is serialized by `approve_legacy_lead` and rejects a second active token.
- The old `create_self_serve_workspace` database function is retired by a forward-only migration.

## Security boundary

- Tenant creation remains protected by the database approval trigger.
- Signup alone cannot satisfy the trigger.
- Activation functions use `SECURITY DEFINER`, fixed `search_path`, and revoked execution from `public`, `anon`, and `authenticated`.
- Activation locks the request row before tenant creation.
- Account linkage and state transitions are server/database controlled.
- Platform Admin mutations require `requirePlatformAdmin` on the server boundary.
- No client-controlled request id, query parameter, form field, or UI state authorizes workspace creation.
- Approval remains separate from subscriptions, pricing, billing, trials, entitlements, AI, menu creation, and logo upload.
- No production data was directly mutated.

## Verification

- Quality run `35059191424` / run `1763` completed `success` on the PR head `a46f258d90e0cc6f8105224ea5f49f2db07baf61`.
- The run executed Node 24, PostgreSQL 16, route generation, typecheck, 295 repository tests, W7.4–W7.10 contract tests, lint, production build, Playwright runtime/Chromium installation, public all-theme browser QA, Studio browser QA, Platform Admin browser QA, performance measurement, diagnostics upload, and cleanup.
- Customer activation lifecycle regression coverage passed in isolated PostgreSQL, including signup-only denial, concurrent admin decision, concurrent activation idempotency, one-tenant/one-membership/one-branch/seven-hours invariants, persisted `activation_tenant_id`, and legacy approval serialization.
- The repository test suite reported `295 passed, 0 failed, 0 skipped`.
- Platform Admin browser QA reported `20 passed`.
- Studio browser QA reported `9 passed`.
- Public all-theme template QA passed the full W7.10 viewport matrix.
- The build's `db:migrate` step skipped the external Postgres connection because CI did not provide one for that command; isolated PostgreSQL lifecycle tests independently applied the four new lifecycle migrations successfully against PostgreSQL 16.
- The container used for direct local commands has no external DNS access, so direct local execution was not used as the verification authority; GitHub Actions is the authoritative CI evidence.
- Vercel automatically produced a branch Preview marked `Ready`; an earlier automatic deployment attempt reported the platform's free daily deployment rate limit. No manual deployment retry was performed and no production deployment was triggered.

## Browser coverage boundary

- `VERIFIED`: Platform Admin browser QA, Studio browser QA, public all-theme browser QA, responsive geometry, accessibility/overflow checks, and existing route browser coverage.
- `VERIFIED`: customer onboarding route code, Arabic/English copy, RTL/LTR handling, state rendering, server authorization, and contract/regression tests.
- `UNKNOWN`: a dedicated authenticated Playwright scenario that drives the new customer lifecycle through actual signup → request → pending → action-required/rejected → approval → activation → Studio. The current Quality workflow has no dedicated customer-lifecycle browser fixture/spec, and production account creation is prohibited for this task.
- Remaining risk is limited to browser-level interaction coverage of the new authenticated lifecycle; database/server authorization and concurrency behavior are covered by the passing isolated PostgreSQL tests and repository contracts.

## Scope exclusions

No pricing, billing, trials, entitlements, AI, menu creation, logo upload, public theme redesign, merge to `main`, production deployment, or production data mutation was performed.
