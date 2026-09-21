# Platform Approval Controls — Direct Fix

Date: 2026-09-10

## Request
Fix the Platform Owner approval-center entry that returned to the overview and exposed only contact controls.

## Root Cause
The user-facing approval entry was not reliably reaching the intended approval workspace. The required operational behavior was therefore made deterministic inside the existing `/admin` route.

## Scope
- `src/routes/admin.tsx`
- `tests/platform-onboarding-contract.test.mjs`

No database schema, authentication, RLS, tenant isolation, dependency, theme, or Manus infrastructure changes.

## Implementation
- `اعتماد العملاء الجدد` and `فتح مركز الاعتماد` switch directly to the existing `leads` control surface.
- The selected lead shows restaurant, city, contact name, phone, email, status, submitted date, and admin notes.
- Existing server-authorized `approveLead` is used for `اعتماد وإنشاء رابط التسجيل`.
- Existing `updateLead` is used for `تم التواصل`, `رفض الطلب`, and saving notes.
- Rejection uses the existing `lost` status; no new status or schema was introduced.

## Verification
- PR #71 merged to `main` as `d11455f5d9a69b12bed4ba7804353065dccfaa2b`.
- Main quality run `34534791703` passed route generation, typecheck, tests, lint, production build, Playwright runtime/Chromium, all-theme browser QA, performance handling, and cleanup.
- GitHub Vercel status for the merged `main` commit is `success`.

## Next Task
Real-device verification of the Platform Owner approval controls on the latest deployed `main`.
