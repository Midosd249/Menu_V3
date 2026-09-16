# Customer Approval Lifecycle Unification — 2026-09-16

Status: `READY_FOR_REVIEW` pending final CI/security/browser evidence.

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
- New account-linked fields: `account_user_id`, `brand_name_en`, `business_type`, `activation_status`, `activation_requested_at`, `decision_at`, `decision_by`, `decision_reason`.
- `account_user_id` is unique when present.
- Activation states: `pending`, `action_required`, `approved`, `activated`, `rejected`.
- Signup creates only the Better Auth account and stores the Saudi phone; it does not issue workspace authorization.
- `/onboarding` is now the single customer lifecycle surface.
- Platform Admin gets a primary activation-request queue with approve/reject/request-changes actions.
- Approved customers explicitly activate the workspace; activation is atomic and idempotent.
- Legacy `/onboarding/:token` remains available only for existing legacy approvals and is now backed by an atomic/idempotent database function.
- The old `create_self_serve_workspace` database function is retired by a forward-only migration.

## Security boundary

- Tenant creation remains protected by the database approval trigger.
- Signup alone cannot satisfy the trigger.
- Activation functions use `SECURITY DEFINER`, fixed `search_path`, and revoked execution from `public`, `anon`, and `authenticated`.
- Activation locks the request row before tenant creation.
- Account linkage and state transitions are server/database controlled.
- No production data was directly mutated.

## Verification

- Isolated PostgreSQL regression test added for signup-only denial, concurrent admin decision, concurrent activation, and duplicate workspace prevention.
- Existing customer lifecycle and platform onboarding contract tests updated to the new architecture.
- CI run on the first PR head reached the install step but was blocked by an existing dependency version mismatch introduced during implementation (`@radix-ui/react-collapsible@^1.3.3` did not exist); the package file was subsequently restored exactly to the current `main` dependency versions and the lifecycle test replacement retained.
- Vercel status for the branch reports `build-rate-limit`; this is an external Vercel capacity/status issue and was not manually retried.
- Full typecheck/test/lint/build/browser verification must be confirmed by the next CI run before merge.

## Scope exclusions

No pricing, billing, trials, entitlements, AI, menu creation, logo upload, public theme redesign, or production deployment was performed.
