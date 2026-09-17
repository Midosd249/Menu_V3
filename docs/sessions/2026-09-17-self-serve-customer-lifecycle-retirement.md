# 2026-09-17 — Self-Serve Customer Lifecycle Retirement

## Status

- Implementation branch: `fix/self-serve-customer-lifecycle`
- Base `main`: `468e979ca4bf100e52d6528cfc34fbeefa561171`
- Production deployment: UNKNOWN / NOT VERIFIED
- Scope: corrective atomic task for customer registration, onboarding, Platform Admin request retirement, and customer account controls.

## Verified intent

- New customers register directly from the public homepage.
- New customers are not gated by manual approval, activation requests, registration links, or service requests.
- Existing customers can use the existing login path with email/password or phone/password subject to the existing phone-verification contract.
- Platform Admin retains server-authorized account controls through `/admin/users`.

## Implementation

- Homepage request/lead form removed from the active UX; signup CTAs route to `/login?mode=signup`.
- `/onboarding` is self-serve workspace setup only.
- Legacy `/admin/onboarding` and `/onboarding/$token` routes redirect instead of exposing approval UI.
- Platform Admin no longer exposes Leads or Service Requests workspaces.
- Platform dashboard no longer loads `service_requests` or lead counts for the active admin shell.
- Client admin workspace links directly to `/admin/users` for account control.
- Legacy approval services `platform-onboarding.ts`, `customer-lifecycle.ts`, `platform-customers.ts`, and `admin.ts` were removed because their active consumers were retired.
- Migration `20260917160000_retire_legacy_customer_request_flows.sql` removes the legacy customer-request trigger, clears legacy request records, and keeps tenant creation fail-closed behind the server-only provisioning marker.

## Verification contract added/updated

- `tests/self-serve-customer-lifecycle.test.mjs`
- `tests/w7-8-admin-shell.test.mjs`
- `tests/w7-8-admin-shell-browser.spec.ts`
- `tests/w7-9-admin-routes.test.mjs`
- `tests/w7-10-responsive-admin-browser.spec.ts`
- Obsolete approval/request contract tests were removed.

## Security boundary

Removing business approval does not remove authorization, RLS, tenant isolation, or server-side provisioning. The tenant insert guard remains fail-closed and accepts the dedicated provisioning function marker only.

## Remaining gate

Run repository CI/quality gates on the branch before merge. Do not deploy to Vercel as part of development verification.
