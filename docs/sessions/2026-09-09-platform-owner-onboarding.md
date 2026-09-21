# Session — Platform Owner Customer Onboarding — 2026-09-09

## Request
Extend the Platform Owner admin experience so new restaurant/customer requests can be reviewed, contacted, approved, issued a registration link and QR, and converted into a restaurant workspace. Then continue toward W16 closure without falsely claiming physical-device verification.

## Current verified position
- Current source of truth is `main`.
- Existing `/admin` already contains platform-level operational areas and now links directly to the new onboarding workspace.
- Existing `leads` are submitted from the public new-customer request flow.
- Existing tenant creation is server-authenticated.

## Work completed on branch `platform-admin-lead-onboarding`
- Dedicated `/admin/onboarding` Platform Owner workspace.
- Lead search and status filtering.
- Lead detail review.
- Phone, WhatsApp, and email contact actions.
- Approve lead action.
- Single-use 7-day onboarding token issuance.
- Revocation of an active onboarding token before replacement.
- Shareable registration URL and generated QR.
- `/onboarding/$token` customer registration/sign-in flow.
- Automatic tenant + owner membership + main branch + default hours creation after valid authenticated onboarding.
- Automatic lead conversion after successful onboarding.
- Public menu URL and QR after conversion.
- SHA-256 token storage; no plaintext token column.
- Contract tests and migration.
- Existing `/admin` lead area now links to the onboarding workspace.

## Security boundaries
- Platform Owner mutations use `requirePlatformAdmin`.
- Customer activation requires authentication plus a valid, unexpired, unrevoked token.
- Existing active tenant membership blocks accidental second-tenant creation.
- Existing public menu/order/theme/security behavior is not intentionally changed.

## Verification
- Static diff reviewed.
- Package manifest was restored to the repository baseline; only the test command was extended.
- PR #51 is open.
- Current GitHub combined status exposes a Vercel build-rate-limit failure; this is a deployment infrastructure gate, not evidence of application failure.
- GitHub quality workflow exists and covers route generation, typecheck, tests, lint, build, auth, performance, and browser template QA.

## W16
- The earlier user-provided Android failures were used as remediation input.
- Those remediation changes were implemented before this onboarding work.
- W16 cannot be marked fully `DONE / VERIFIED` until the corrected release is exercised on a real Android device and the previously failing checks are re-tested.
- iPhone, VoiceOver, and Opera remain unavailable unless a real test environment is provided.

## Exact next action
1. Resolve the Vercel build-rate-limit deployment gate without unnecessary redeploy retries.
2. Complete PR quality verification once CI is available.
3. Merge one coherent release batch only when quality gates are green.
4. Verify Production deployment identity.
5. Re-run the W16 Android matrix against the corrected Production build.
6. Close W16 only if the required real-device evidence is PASS.
