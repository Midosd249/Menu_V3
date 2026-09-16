# PH-01.2 — Registration Contract

Date: 2026-09-16
Plan: `PH`
Status: `DONE — VERIFIED`
Scope: registration contract only

## Baseline

- `VERIFIED`: base `main` is `25f2f1db404bebc79ec7535e5e3eff8ae3d91b0d`.
- `VERIFIED`: PR #158 remains a separate documentation-only Draft PR and was not modified by this implementation branch.
- `VERIFIED`: PR #157 remains merged at the same `main` SHA and its approval-lifecycle security hardening is preserved.
- `VERIFIED`: no workspace provisioning, tenant creation, membership creation, branch creation, subscription/trial changes, pricing, billing, AI, invoice, WhatsApp, menu creation, or production-data changes are part of this task.

## Registration Contract

The signup mode contains exactly these six required customer inputs:

1. Full name
2. Brand / restaurant name
3. Saudi phone number
4. Email
5. Password
6. Password confirmation

The existing Better Auth email/password flow remains the authentication authority.

## Validation

- Required fields are validated in the browser for immediate feedback.
- The same six-field contract is validated again in a TanStack Start server function before Better Auth signup.
- Password confirmation must match in the shared contract and cannot be bypassed by a direct server-function caller.
- Saudi phone input is normalized and validated server-side using the existing `normalizePhoneDigits(..., "SA")` convention and the existing authenticated phone-persistence function.
- Phone persistence keeps the canonical `+9665...` form and `phoneNumberVerified = false`.
- Duplicate phone failures return a generic registration error rather than exposing ownership.
- Better Auth signup errors are mapped to the same generic registration error so duplicate-email errors are not surfaced verbatim.
- `mode=signup` only selects the registration presentation state; it does not authorize tenant/workspace access.

## Workspace / Authorization Boundary

- Signup creates the Better Auth identity and persists the phone only.
- Registration code does not create a tenant, membership, branch, branch hours, or workspace.
- Registration code does not call `createRestaurant`, `createSelfServeWorkspace`, or any historical `self_serve_registration_grants` path.
- The existing `/onboarding` handoff remains unchanged because workspace provisioning belongs to `PH-01.3` and approval-dependency reconciliation belongs to `PH-01.7`.
- Existing authenticated-user `/studio` redirect and invitation handling remain unchanged.

## Accessibility / Localization

- Arabic and English labels remain explicit.
- `/login` continues to set `dir="rtl"` for Arabic and `dir="ltr"` for English.
- Existing semantic `required` inputs, password autocomplete semantics, responsive single-column layout, and alert error rendering are preserved.

## Focused Regression Coverage

`tests/registration-contract.test.mjs` covers:

- six required fields;
- required-field validation;
- password mismatch;
- Saudi phone normalization and invalid-phone rejection;
- duplicate phone generic handling;
- duplicate email generic handling scoped to the signup path;
- Better Auth preservation;
- `mode=signup` navigation-only behavior;
- no workspace/self-serve-grant usage;
- existing authenticated-user Studio/invite behavior;
- Arabic RTL / English LTR registration rendering.

## Verification Evidence

`VERIFIED`: Quality run `35146619386` completed successfully against the exact head `a92b34fba94af6c4821327586005789d31f1cc9d` on branch `feat/ph-01-2-registration-contract`, with PR #159 targeting `main` at `25f2f1db404bebc79ec7535e5e3eff8ae3d91b0d`.

`VERIFIED`: the Quality job completed successfully. Its `Tests` step (#9) succeeded on the exact head, followed by successful W7.4–W7.10 contract tests, lint, production build, Playwright/Chromium installation, all-theme template QA, customer-lifecycle and Studio browser preparation, Studio/browser QA, Platform Admin browser preparation and browser QA, performance-baseline upload, Studio diagnostics upload, preview cleanup, and final job completion.

`VERIFIED`: `tests/registration-contract.test.mjs` is included in the normal `npm test` command in `package.json`; the Quality workflow's `Tests` step succeeded and the corresponding npm-test diagnostics artifact was uploaded for this exact run.

`VERIFIED`: W9 run `35146619381` succeeded against the same exact head. It is supplemental evidence only and was not used as a substitute for Quality.

`EXTERNAL BLOCKED`: the GitHub commit status contains a Vercel `failure` context pointing to `build-rate-limit`. This is separate from the successful Quality and W9 conclusions and is not treated as a PH-01.2 Quality failure.

No production deployment was authorized or performed by this phase. No production account or production data was created or mutated.

## Final Diff Review

`VERIFIED`: comparison of base `main` `25f2f1db404bebc79ec7535e5e3eff8ae3d91b0d` to the verified implementation head `a92b34fba94af6c4821327586005789d31f1cc9d` contains exactly six changed files:

- `docs/sessions/2026-09-16-ph-01-2-registration-contract.md`
- `package.json`
- `src/lib/auth/customer-registration-contract.ts`
- `src/lib/auth/customer-registration.ts`
- `src/routes/login.tsx`
- `tests/registration-contract.test.mjs`

`VERIFIED`: no migrations, tenant/workspace/membership/branch/branch-hours provisioning, subscription/entitlement/trial creation, pricing, billing, AI, invoice, WhatsApp, menu creation, W7/W8/W9, Studio/onboarding handoff, or PR #157 changes are included in the implementation diff.

## Phase Boundary

- `PH-01.2`: `DONE — VERIFIED`.
- `PH-01.3`: `TODO` — not started.
- `PH-01.4`: `TODO` — not started.
- `PH-01.5`: `TODO` — not started.
- `PH-01.6`: `TODO` — not started.
- `PH-01.7`: `TODO` — not started.
- `PH-01.8`: `TODO` — not started.
- `PH-02`–`PH-05`: `TODO` — not started.
