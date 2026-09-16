# PH-01.3 — Secure Self-Serve Workspace Provisioning

## Status
- Implementation: `IMPLEMENTATION_IN_PROGRESS`
- Branch: `feat/ph-01-3-self-serve-workspace`
- Base: `main` at `46d9f86bf29d92f01f7f396fdd989ad02c41cdc2`
- PR: `#160`
- Production data: not touched
- Vercel: no retry/deploy action taken

## Scope
Implement only:
- workspace setup contract;
- server-authoritative self-serve provisioning;
- atomic tenant/owner membership/primary branch/branch-hours creation;
- idempotent/concurrency-safe recovery;
- onboarding → Studio handoff;
- required security, migration, unit/contract, PostgreSQL, and browser QA.

Explicitly excluded: PH-01.4+, pricing/billing/trials/invoices/WhatsApp/AI/menu creation/logo upload/entitlement work, production signup/data mutation, and Vercel deployment/retry.

## Repository audit
Verified current source at `main` before implementation:
- PH-01.2 registration contract is merged and registration does not provision a workspace.
- `authMiddleware` derives `context.userId` from the server session.
- `/studio` already gates authenticated users without an authorized tenant to `/onboarding`.
- legacy Customer Lifecycle approval and registration-link paths remain implemented and protected.
- historical `self_serve_registration_grants` and `create_self_serve_workspace` are retired; PH-01.3 does not restore them.
- `tenants_owner_user_id_uidx` already enforces one tenant owner at the database boundary.
- `branch_hours` has `(branch_id, weekday)` as its primary key.

## Provisioning architecture
- Client submits only setup fields validated by the shared Zod contract.
- Server function `provisionCustomerWorkspace` uses `authMiddleware`; the caller identity is `context.userId`.
- Server calls the single database authority `menu_v3.provision_customer_workspace`.
- Database function is `SECURITY DEFINER`, has a fixed `search_path`, is not executable by `PUBLIC`, `anon`, or `authenticated`, and is granted only to the server database role (`postgres`).
- The database function locks the authenticated user's row, rejects legacy lifecycle-linked accounts, converges on an existing active membership/owned tenant, and otherwise creates tenant + owner membership + primary branch + seven branch-hours rows in one transaction.
- Tenant creation is admitted through a transaction-local provisioning marker plus session-role check; normal direct tenant inserts still fail with `CUSTOMER_APPROVAL_REQUIRED` unless they use the existing approved legacy paths.

## UX
- `/onboarding` no longer uses a query parameter to decide authorization.
- Accounts without an existing Customer Lifecycle request receive the self-serve setup form.
- Accounts linked to an existing lifecycle request remain on the legacy approval UI.
- Setup supports Arabic-first RTL and English LTR, required brand name/business type, optional English name, optional short description, accessible business-type controls, validation, retry, and refresh-safe Studio handoff.
- Studio navigation is entered only after the server provisioning call returns successfully; Studio independently verifies authorized tenant membership.

## Verification plan
Required final evidence:
- isolated PostgreSQL migration/function/concurrency tests;
- PGlite compatibility checks through repository quality/build paths;
- typecheck;
- focused tests;
- full `npm test`;
- auth/security checks;
- lint;
- production build;
- Playwright/Chromium browser QA for registration/onboarding/setup/Studio, validation, refresh/retry, Arabic RTL, English LTR, mobile, and existing W7/W8/W9 coverage;
- final exact-HEAD diff review;
- PR remains open and unmerged unless separately authorized.

## Current evidence
- Branch created from verified `main` SHA `46d9f86bf29d92f01f7f396fdd989ad02c41cdc2`.
- PR #160 opened against `main`.
- Current implementation head will be recorded after final verification.
- Vercel is intentionally not used as a blocking development signal and no deployment/retry was triggered.
