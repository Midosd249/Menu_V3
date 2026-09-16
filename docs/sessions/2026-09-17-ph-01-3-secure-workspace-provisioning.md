# PH-01.3 — Secure Self-Serve Workspace Provisioning

## Status
- Implementation: `DONE — VERIFIED`
- Branch: `feat/ph-01-3-self-serve-workspace`
- Base: `main` at `46d9f86bf29d92f01f7f396fdd989ad02c41cdc2`
- PR: `#160` — Open / Unmerged / Ready for review
- Final verification head before this continuity-only update: `9fc7e44986b1c28f52592b84d2e93e80eca25a98`
- Production data: not touched
- Production accounts: not created or modified
- Vercel: no manual deploy/retry action taken

## Scope
Implemented only PH-01.3:
- workspace setup contract;
- server-authoritative self-serve eligibility and provisioning;
- atomic tenant/owner membership/primary branch/branch-hours creation;
- idempotent/concurrency-safe recovery;
- onboarding → Studio handoff;
- required security, migration, contract, PostgreSQL, and browser QA.

Explicitly excluded: PH-01.4+, pricing/billing/trials/invoices/WhatsApp/AI/menu creation/logo upload/entitlement work, production signup/data mutation, and Vercel deployment/retry.

## Verified implementation
- `selfServeEligibleAt` is persisted on the Better Auth user and is set only from the server-side registration flow when the latest authenticated session is within the new-registration window.
- Existing users logging in later do not receive the marker automatically.
- `/onboarding` uses the persisted eligibility marker plus server-derived Customer Lifecycle state; query parameters and localStorage are not authorization inputs.
- Legacy Customer Lifecycle users without the self-serve marker remain on the legacy approval flow.
- `provisionCustomerWorkspace` uses `authMiddleware` and `context.userId`; client-supplied user/tenant/role/approval state is not trusted.
- `menu_v3.provision_customer_workspace` is `SECURITY DEFINER`, uses a fixed `search_path`, requires the server provisioner role, is protected by a transaction-local marker, and is executable only by `postgres`.
- Legacy approved registration-link and account-bound approval paths remain valid; unapproved direct tenant inserts still raise `CUSTOMER_APPROVAL_REQUIRED`.
- The historical `self_serve_registration_grants` and `create_self_serve_workspace` paths remain retired and are not restored.
- Provisioning locks the Better Auth user row, converges on an existing active membership or owned tenant, and creates tenant + owner membership + primary branch + seven branch-hours in one transaction.
- Repeated/concurrent provisioning converges to exactly one workspace; existing owner recovery repairs missing membership/branch/hours without creating duplicates.
- Studio handoff occurs only after successful provisioning and the existing Studio authorization gate remains authoritative.

## Final browser-fixture corrections
- The Customer Lifecycle browser fixture applies the PH-01.3 migration before starting its server, so the legacy onboarding regression test exercises the same schema contract as production.
- PH-01.3 browser users use distinct Saudi phone numbers and explicitly seed `selfServeEligibleAt`, matching the production eligibility boundary without weakening authorization.

## Final CI evidence on tested head
Quality run `35160159079` / #1847 passed on exact head `9fc7e44986b1c28f52592b84d2e93e80eca25a98`.

All required Quality stages completed successfully, including:
- install/containers;
- route generation + committed route freshness;
- typecheck;
- full `npm test` including `tests/self-serve-provisioning.test.mjs`;
- W7.4–W7.10 contract tests;
- lint;
- production build;
- Playwright + Chromium;
- browser template QA across all themes;
- Customer Lifecycle browser database preparation;
- Studio fixture preparation;
- Studio Shell/Home/Menu/Growth/Customers/W7.10 browser QA;
- Platform Admin browser database preparation;
- Platform Admin + W7.10 responsive browser QA;
- browser performance baseline;
- Studio/browser diagnostics upload;
- built preview stop and cleanup;
- final workflow completion.

W9 run `35160159011` / #143 passed on the same exact head, including isolated PGLite preparation and Orders browser QA.

`GitHub.fetch_commit_workflow_runs` for `9fc7e44986b1c28f52592b84d2e93e80eca25a98` returned exactly these two pull-request workflow runs: Quality `35160159079` and W9 `35160159011`.

## Eligibility/security evidence
- Newly registered self-serve users receive eligibility only through the authenticated registration path.
- Existing Customer Lifecycle users do not receive eligibility automatically and remain in the legacy flow unless legitimately provisioned through the existing protected lifecycle.
- Query parameters, localStorage, client form fields, fabricated status, and direct client RPC execution are not authorization inputs.
- `self_serve_registration_grants` remains retired; `create_self_serve_workspace` remains retired and is not granted to client roles.
- The provisioning function requires the server provisioner authority and the server path supplies the authenticated `context.userId`.
- Legacy approval guards remain fail-closed.

## Atomicity/idempotency/concurrency evidence
The focused provisioning suite and Quality database checks cover successful provisioning, required validation, ownership enforcement, unauthorized rejection, legacy approval protection, repeated provisioning, concurrent provisioning, failure rollback, existing-workspace recovery, and retired-path protections. The implementation serializes provisioning by locking the authenticated user row and uses transaction rollback semantics for failures.

## Final diff/scope review
The final compare against base `46d9f86bf29d92f01f7f396fdd989ad02c41cdc2` was performed on tested head `9fc7e44986b1c28f52592b84d2e93e80eca25a98`. It is ahead by 25 commits, with no commits behind base, and the changed-file set is limited to these eight PH-01.3 files:
- `docs/sessions/2026-09-17-ph-01-3-secure-workspace-provisioning.md`
- `migrations/20260917100000_self_serve_workspace_provisioning.sql`
- `package.json`
- `src/lib/auth/customer-registration.ts`
- `src/lib/menu/self-serve-provisioning.ts`
- `src/routes/onboarding.tsx`
- `tests/self-serve-provisioning.test.mjs`
- `tests/w7-3-studio-shell-browser.spec.ts`

`package.json` contains only the intended `npm test` integration for `tests/self-serve-provisioning.test.mjs`; no unrelated dependency change is present. No PH-01.4+ implementation was introduced. No pricing, billing, trials, AI, menu creation, logo upload, invoices, WhatsApp, or entitlement work was introduced. PR #159 and PH-01.2 remain unchanged. W8/W9 behavior remains covered by the successful CI gates.

The reviewed provisioning server path derives identity from `authMiddleware`/`context.userId`. The migration's provisioning function validates inputs, locks the authenticated user row, preserves legacy approval guards, uses `SECURITY DEFINER` with a fixed `search_path`, requires the server provisioner authority, sets only a transaction-local authorization marker, and revokes execute from `public`, `anon`, and `authenticated`, granting execution only to `postgres`.

## Final state
PH-01.3 is `DONE / VERIFIED` for the tested implementation head `9fc7e44986b1c28f52592b84d2e93e80eca25a98`.

A continuity-only documentation update after that verification changes the branch HEAD and therefore requires a fresh exact-head Quality/W9 verification before this record can be treated as the final branch verification record. Until those fresh runs pass, implementation remains verified on `9fc7e44986b1c28f52592b84d2e93e80eca25a98`, while the current branch state is `VERIFICATION_PENDING` for the documentation-only head.

PR #160 remains Open / Unmerged / Ready for review. PH-01.4 through PH-05 remain `TODO / NOT STARTED`. No production deployment, signup, migration, data mutation, or Vercel retry was performed.
