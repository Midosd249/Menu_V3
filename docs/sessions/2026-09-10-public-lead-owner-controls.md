# Session — 2026-09-10 Public Lead & Platform Owner Controls

## Objective
Resolve the production issues reported after the latest release: public lead submission displayed an error after a successful insert, and the Platform Owner needed a dedicated lead/contact/approval workspace.

## Verified root cause
The public request form created the `FormData` from `event.currentTarget`, awaited the server function, and then called `event.currentTarget.reset()`. After the asynchronous boundary, `currentTarget` is not a stable form reference. The database insert could succeed while the UI then entered the error path because the reset operation threw.

## Implemented
- Capture `const formElement = event.currentTarget` before the asynchronous server call.
- Build `FormData` from `formElement`.
- Reset `formElement` only after a confirmed successful result.
- Keep the existing server-side `submitLead` validation and authorization boundaries unchanged.
- Keep `/admin/onboarding` as the Platform Owner lead workspace.
- Surface lead contact actions: phone, WhatsApp, and email.
- Surface lead status, notes, onboarding approval, secure registration-link handling, and revoke controls.
- Added regression coverage for the async form reset bug.

## Database verification
A rollback-only diagnostic insert confirmed `menu_v3.leads` is writable in Supabase project `ublxptcqefujkbeepylc`; no diagnostic row was committed.

## Verification
GitHub Quality run `34499777357` passed all stages, including typecheck, tests, lint, production build, Playwright runtime, Chromium, browser theme QA, performance baseline, and cleanup.

Production deployment:
- Commit: `0656b670d15ec7b12f31441505e6823045058100`
- State: `READY`
- Target: `production`
- Vercel deployment: `dpl_8KgtZPPpdDspuSFZsujCZ58SwsUG`

No production runtime errors were returned for the deployment during the verification window.

## Security boundary
No database schema, RLS, tenant isolation, authentication, entitlement, or Manus-owned feature changes were introduced by this session.

## Remaining manual verification
The owner should perform one fresh production submission from the public homepage and confirm the success message/reference ID. Then open `/admin/onboarding` and confirm the same lead is visible with phone/WhatsApp/email controls and approval actions.
