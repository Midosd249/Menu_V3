# Temporary Public Theme Testing Access

## Purpose
Temporarily support authenticated restaurant-owner/admin testing of the public/general Menu V3 theme selection without weakening authentication, authorization, tenant isolation, or future commercial entitlement enforcement.

## Included themes
- `essential`
- `editorial`
- `noir`
- `heritage`
- `gallery`

**VERIFIED:** these are the complete five-theme public catalog in `src/lib/theme/registry.ts`.

## Current entitlement position
- **VERIFIED:** the current theme registry marks all five themes as `free`, and `canUseTheme` currently allows the complete catalog.
- Therefore, the temporary override does **not currently grant an otherwise unavailable premium theme**. It is retained only as temporary test infrastructure and as a future-proof boundary around the testing-access path.

## How the override works
- **VERIFIED:** `saveTenantTheme` remains behind `authMiddleware` and only owner/admin tenant members can change a theme.
- **VERIFIED:** the override is server-side and reads only server environment variables; the client cannot submit or toggle it.
- Enable both variables only in an approved non-production testing environment:
  - `MENU_THEME_TESTING_OVERRIDE=true`
  - `MENU_THEME_TESTING_OVERRIDE_EXPIRES_AT=<future ISO-8601 timestamp>`
- **VERIFIED:** the override is hard-disabled whenever Vercel reports `VERCEL_ENV=production`.
- Both values are required outside production. A missing, invalid, or expired timestamp means the override is OFF.
- If commercial theme entitlement becomes restrictive in the future, the override path remains bounded by authentication, membership, subscription-status checks, and the production hard stop.

## Default behavior
- **VERIFIED:** with the override absent/false/expired, the existing `canUseTheme` behavior remains authoritative.
- Theme preview routes remain available for visual inspection without granting commercial entitlement.

## Security controls
- Server-only environment state; no client-controlled bypass parameter.
- Existing authentication middleware is unchanged.
- Existing owner/admin membership check is unchanged.
- Existing tenant-scoped update remains unchanged.
- Existing subscription status check remains unchanged.
- Theme keys are still normalized against the canonical registry.
- The override must have a future expiry; it cannot be enabled indefinitely through a single boolean.
- **VERIFIED:** production Vercel deployments cannot activate the override even if the two testing variables are accidentally present.
- When active for a premium save in a future restrictive entitlement model, the server logs the tenant, theme, expiry, and Vercel environment for operational evidence.

## Disable/revert
1. Set `MENU_THEME_TESTING_OVERRIDE=false`, or remove the variable.
2. Remove the expiry variable as well when the testing period ends.
3. Redeploy the approved non-production environment if its platform requires deployment for environment changes.
4. The expiry timestamp independently disables the override even if the boolean is accidentally left true.
5. Production remains protected by the `VERCEL_ENV=production` hard stop regardless of testing-variable state.

## Test results
- **VERIFIED:** unit tests cover default-off behavior, future expiry, expired override, production hard-disable, preview/local enablement, and normal current free-catalog behavior without override.
- **UNKNOWN:** live production environment variables cannot be inspected through the available deployment read tools; no claim is made that the testing variables are currently configured.

## Review / expiry reminder
The override remains temporary test infrastructure. Review its environment state before every release and disable it in non-production environments when testing ends. Do not convert it into permanent billing enforcement.
