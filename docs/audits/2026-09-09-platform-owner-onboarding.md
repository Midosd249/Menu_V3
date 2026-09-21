# Platform Owner Customer Onboarding Audit — 2026-09-09

## Scope
Platform Owner administration for new restaurant/customer requests, separate from restaurant-owner order operations.

## Verified current foundation
- `/admin` already had platform-level leads, tenants, projects, service requests, subscriptions, analytics, activity, and security views.
- `leads` currently captures business name, city, contact name, phone, email, details, status, source, and timestamps.
- The existing public request form writes directly through `submitLead` into `leads`.
- Existing tenant creation is owner-authenticated and creates a tenant, owner membership, branch, and default hours.
- Existing `/studio/qr` generates public menu QR codes from the tenant/branch URL.

## Gap identified
The Platform Owner could receive a new restaurant request but had no dedicated operational flow to review it, contact the requester, approve it, issue a registration link, track onboarding, or hand the new customer into a ready restaurant workspace.

## Implemented workflow
1. Lead appears in Platform Owner onboarding workspace.
2. Owner reviews business/contact/details.
3. Owner can call, open WhatsApp, or email the requester.
4. Owner approves the lead.
5. System issues a single-use 7-day registration token.
6. Owner receives a shareable registration URL and QR.
7. Customer registers or signs in through the dedicated onboarding URL.
8. Server validates the token and authenticated user, then creates the tenant, owner membership, main branch, and default hours.
9. Lead becomes `converted` and onboarding token becomes used.
10. Customer receives the public menu URL and QR and can continue in `/studio`.

## Safety boundaries
- Platform mutations remain server-authorized through `requirePlatformAdmin`.
- Onboarding tokens are stored as SHA-256 hashes.
- Tokens expire after seven days and can be revoked before replacement.
- Existing tenant membership blocks accidental second-tenant creation for the same account.
- No changes to restaurant ordering, Quick Add, Item Notes, cart, theme logic, tenant isolation, or pricing.
- Registration/menu URLs are relative paths until rendered by the current origin, avoiding a hard-coded deployment domain.

## Verification plan
- Route generation/typecheck.
- Full repository test suite.
- Lint.
- Production build.
- Migration validation.
- Auth/security invariants.
- Existing theme/browser contracts.
- Production smoke test after the release reaches Vercel.
- W16 physical-device retest remains a separate human-device gate.
