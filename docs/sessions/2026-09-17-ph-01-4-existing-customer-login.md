# PH-01.4 — Existing Customer Login

## Status

- `IN_PROGRESS` at task start.
- Scope: Existing Customer Login only.
- Canonical source of truth: current `main` before implementation: `a9ea0add9989c3949e94d1efd10065176790456f`.
- No production deployment or production-data mutation is part of this task.

## Request Classification

- Classification: PH-01.4 Existing Customer Login.
- Research level: `Focused` repository-first.
- Workflows: Principal Engineer orchestration, authentication/authorization review, customer-lifecycle regression, browser QA, CI/reliability review.
- Design Agent: not invoked; this task changes no public theme or material visual system.

## Verified Baseline

- `/login` already authenticates with Better Auth email/password and phone/password paths and redirects an authenticated user to `/studio` unless an invitation token is present.
- `/studio` waits for session resolution, rejects missing sessions through the existing sign-in gate, resolves the current user's membership server-side, and redirects an authenticated user without a tenant to `/onboarding`.
- Server functions use `authMiddleware`, which derives `context.userId` from the verified session/bearer context.
- `getMyStudio` resolves the active membership from `context.userId` and loads the snapshot from that membership's tenant.
- Existing customer-lifecycle and provisioning tests already cover approval lifecycle, secure provisioning, idempotency, and legacy-path protection.

## Gap Identified

`PARTIAL / NOT VERIFIED` before implementation: repository source showed the intended existing-customer behavior, but there was no direct browser evidence exercising a real Better Auth account through registration, workspace creation, sign-out, subsequent login, authenticated `/login`, and invalid-session rejection.

## Implementation

- Added PH-01.4 contract assertions to `tests/customer-lifecycle.test.mjs` covering:
  - authenticated `/login` redirect to `/studio`;
  - invitation handling preservation;
  - email and phone authentication entry points;
  - verified-session identity propagation;
  - membership-to-tenant resolution;
  - fail-closed Studio behavior for missing sessions;
  - tenant-scoped resource loading.
- Added a real Better Auth browser scenario to `tests/w7-3-studio-shell-browser.spec.ts` because that suite is already executed by the repository's CI browser stage.
- The browser scenario creates a unique customer through the real signup form, verifies no-workspace onboarding, provisions a workspace, verifies authenticated `/login` does not render signup fields, signs out, logs back in with the same credentials, clears cookies to simulate an invalid session, verifies Studio returns to `/login`, and logs in again to recover the correct workspace.
- The browser scenario performs cleanup of its temporary account/workspace in the CI database.
- No application runtime/auth/authorization implementation was rewritten.

## Security Boundaries Preserved

- Better Auth remains the authentication authority.
- Client input does not select user, tenant, role, branch, or entitlement authority.
- Studio access still requires an authenticated user and active tenant membership.
- Tenant snapshot loading remains scoped to the resolved membership tenant.
- Existing approval, provisioning, legacy, RLS, and permission boundaries are not weakened.

## Verification Plan

Required CI evidence for the branch/PR:

- `npm test`
- `npm run typecheck`
- `npm run lint`
- `npm run build`
- existing customer lifecycle/provisioning contract tests
- Playwright/Chromium Studio browser suite including the new PH-01.4 scenario
- auth/security boundary checks included by the repository quality workflow
- final diff review

Local execution is not available through the current connected GitHub-only execution surface; CI is therefore the direct runtime verification source for this branch.

## Status After Implementation

- Implementation: `IMPLEMENTATION_IN_PROGRESS` until CI evidence is reviewed.
- Deployment: no deployment performed by this task.
- Vercel: no intentional deployment/retry performed.

## UNKNOWN / BLOCKED

- `UNKNOWN`: local runtime/browser execution because the current session has repository tooling but no local command runner connected to the repository checkout.
- `UNKNOWN`: final CI result until the PR workflow completes.
- `UNKNOWN`: current Vercel Production serving state; not required for PH-01.4 implementation verification.

## Exact Next Task

Review the PH-01.4 PR CI/browser evidence and final diff. If all required gates pass, close PH-01.4 without starting PH-01.5.
