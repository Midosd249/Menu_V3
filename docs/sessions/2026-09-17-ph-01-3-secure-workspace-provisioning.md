# PH-01.3 — Secure Self-Serve Workspace Provisioning

## Status
- Implementation: `DONE — VERIFIED` pending final current-head CI confirmation after this continuity-only update.
- Branch: `feat/ph-01-3-self-serve-workspace`
- Base: `main` at `46d9f86bf29d92f01f7f396fdd989ad02c41cdc2`
- PR: `#160` — Open / Unmerged / Ready for review
- Current implementation head before this documentation update: `215733172be9b38832d2dfee32e366697f73dd1b`
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
- The Customer Lifecycle browser fixture now applies the PH-01.3 migration before starting its server, so the legacy onboarding regression test exercises the same schema contract as production.
- PH-01.3 browser users now use distinct Saudi phone numbers and explicitly seed `selfServeEligibleAt`, matching the production eligibility boundary without weakening authorization.

## CI evidence before this continuity-only update
Quality run `35154075898` passed on implementation head `215733172be9b38832d2dfee32e366697f73dd1b`.

Verified Quality stages:
- route generation + committed route freshness;
- typecheck;
- full `npm test`;
- W7.4–W7.10 contract tests;
- lint;
- production build;
- Playwright + Chromium installation;
- browser template QA across all themes;
- Customer Lifecycle browser database preparation;
- Studio browser fixture preparation;
- Studio Shell/Home/Menu/Growth/Customers/W7.10 browser QA;
- Platform Admin browser database preparation;
- Platform Admin/W7.10 browser QA;
- performance baseline;
- diagnostics upload;
- cleanup.

W9 run `35154075965` passed on the same exact head, including isolated PGLite preparation and Orders browser QA.

## CI diagnosis and resolution
Earlier exact-head browser evidence identified two PH-01.3 fixture defects:
1. Customer Lifecycle browser QA lacked the new migration column, causing `selfServeEligibleAt` lookup failure. The test now applies the PH-01.3 migration before starting the lifecycle browser servers.
2. The two self-serve browser users shared one phone number, violating the unique phone constraint. The fixture now uses distinct numbers and seeds the eligibility marker.

These were fixture/test-boundary corrections only; no production authorization was weakened.

## Scope review
Final compare against base `46d9f86bf29d92f01f7f396fdd989ad02c41cdc2` is PH-01.3 scoped to:
- `docs/sessions/2026-09-17-ph-01-3-secure-workspace-provisioning.md`
- `migrations/20260917100000_self_serve_workspace_provisioning.sql`
- `package.json`
- `src/lib/auth/customer-registration.ts`
- `src/lib/menu/self-serve-provisioning.ts`
- `src/routes/onboarding.tsx`
- `tests/self-serve-provisioning.test.mjs`
- `tests/w7-3-studio-shell-browser.spec.ts`

No PH-01.4+ implementation was introduced. No pricing, billing, trials, AI, menu creation, logo upload, invoices, WhatsApp, or entitlement work was introduced. PR #159 and PH-01.2 remain unchanged. W8/W9 behavior remains covered by the successful CI gates.

## Final current-head verification requirement
Because this continuity record is itself a repository commit, the resulting new branch head must receive fresh Quality and W9 verification before PH-01.3 is considered fully complete at the repository HEAD. No production deployment or Vercel retry is authorized.

## Next task
After fresh current-head Quality and W9 success: keep PR #160 Open / Unmerged / Ready for review, record the final head and evidence, and stop. PH-01.4 through PH-05 remain `TODO / NOT STARTED`.
