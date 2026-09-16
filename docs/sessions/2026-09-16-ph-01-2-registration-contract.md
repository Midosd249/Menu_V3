# PH-01.2 — Registration Contract

Date: 2026-09-16
Plan: `PH`
Status: `DONE — VERIFIED`
Scope: registration contract only

## Baseline

- `VERIFIED`: base `main` is `25f2f1db404bebc79ec7535e5e3eff8ae3d91b0d`.
- `VERIFIED`: PR #159 targets `main` and remains separate from the protected merged PR #157.
- `VERIFIED`: PR #157 remains merged at the base `main` SHA and its approval-lifecycle security hardening is preserved.
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

## Final Verification Evidence — Current Exact HEAD

`VERIFIED`: final tested HEAD is `1c3f26fce8473de15c711a71019b4998eebd68ed` on `feat/ph-01-2-registration-contract`, with PR #159 targeting `main` at `25f2f1db404bebc79ec7535e5e3eff8ae3d91b0d`.

`VERIFIED`: Quality run `35147552010` completed successfully on the exact HEAD. The job passed install/containers, route generation and committed-route-tree verification, typecheck, full tests, W7.4–W7.10 contract tests, lint, production build, Playwright/Chromium installation, all-theme template QA, Customer Lifecycle browser preparation, Studio fixture preparation, Studio browser QA, Platform Admin fixture preparation, Platform Admin browser QA, performance baseline, diagnostics uploads, preview cleanup, and final completion.

`VERIFIED`: the Quality `Tests` step (#9) succeeded on the exact HEAD. `tests/registration-contract.test.mjs` is included in the normal `npm test` path in `package.json`, and the npm-test diagnostics artifact was uploaded by that exact Quality run.

`VERIFIED`: W9 run `35147552029` completed successfully on the same exact HEAD. Its Orders browser QA job passed route generation/typecheck, isolated PGLite Orders fixture preparation, Playwright installation, W9 Orders browser QA, diagnostics upload, and final completion.

`VERIFIED`: browser QA completed successfully for the configured template, Customer Lifecycle, Studio, Platform Admin, responsive design-system, and W9 Orders surfaces in the final current-head workflows.

`VERIFIED`: GitHub combined status for the exact HEAD currently reports Vercel `success`. No Vercel retry or redeployment was performed.

## Final Diff Review

`VERIFIED`: comparison of base `main` `25f2f1db404bebc79ec7535e5e3eff8ae3d91b0d` to the final tested HEAD `1c3f26fce8473de15c711a71019b4998eebd68ed` is ahead by 19 commits and contains exactly six changed files:

- `docs/sessions/2026-09-16-ph-01-2-registration-contract.md`
- `package.json`
- `src/lib/auth/customer-registration-contract.ts`
- `src/lib/auth/customer-registration.ts`
- `src/routes/login.tsx`
- `tests/registration-contract.test.mjs`

`VERIFIED`: the implementation diff contains no migrations, tenant/workspace/membership/branch/branch-hours provisioning, subscription/entitlement/trial creation, pricing, billing, AI, invoice, WhatsApp, menu creation, W7/W8/W9 runtime changes, Studio/onboarding handoff changes, or PR #157 changes.

## Phase Boundary

- `PH-01.2`: `DONE — VERIFIED`.
- `PH-01.3`: `TODO` — not started.
- `PH-01.4`: `TODO` — not started.
- `PH-01.5`: `TODO` — not started.
- `PH-01.6`: `TODO` — not started.
- `PH-01.7`: `TODO` — not started.
- `PH-01.8`: `TODO` — not started.
- `PH-02`–`PH-05`: `TODO` — not started.

## Release / Deployment Boundary

- `VERIFIED`: no merge of PR #159 occurred.
- `VERIFIED`: no Production deployment was authorized or performed by this phase.
- `VERIFIED`: no Production account or Production data was created or mutated.
- `VERIFIED`: Vercel status for the tested HEAD is successful; this is not Production deployment evidence.
